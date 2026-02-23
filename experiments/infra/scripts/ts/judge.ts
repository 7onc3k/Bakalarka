/**
 * judge.ts — LLM-as-judge evaluace pomoci GLM-5.
 *
 * Hodnosti metriky ktere vyzaduji lidsky/LLM usudek:
 * - P2 (process artifact quality) — jsou commit msgs, issues, PRs popisne?
 * - Q4 (AC coverage) — kolik z 24 acceptance criteria ma test?
 * - Q8 (code quality) — naming, SoC, idiomaticky TS, docs, slozitost
 *
 * Proc GLM-5: Pouzivame model z jine "rodiny" nez generator (minimax),
 * aby se eliminoval self-preference bias (Panickssery 2024, NeurIPS).
 *
 * Usage:
 *   npx tsx judge.ts <run-name>
 *
 * Example:
 *   npx tsx judge.ts pilot-r1
 *
 * Vysledky se ukladaji jako JSON soubory v adresari runu:
 *   p2-result.json, q4-result.json, q8-result.json
 */

import * as path from "node:path";
import * as fs from "node:fs";
import {
  type JudgeResult,
  exec,
  resolveRunDir,
  readFile,
  writeFile,
  fileExists,
  parseOpenCodeOutput,
  getRunNameFromArgs,
  JUDGE_MODEL,
  JUDGE_DIR,
  INFRA_DIR,
} from "./shared.js";

// ============================================================================
// Hlavni logika
// ============================================================================

function main(): void {
  const runName = getRunNameFromArgs("judge.ts");
  const runDir = resolveRunDir(runName);

  // Overime ze adresar obsahuje src/ (agentov kod)
  if (!fs.existsSync(path.join(runDir, "src"))) {
    console.error(
      `Error: ${runDir}/src not found. Agent code expected directly in run directory.`
    );
    process.exit(1);
  }

  console.log("=== LLM-as-judge evaluation ===");
  console.log(`Run: ${runDir}`);
  console.log(`Model: ${JUDGE_MODEL}`);
  console.log("");

  // Spustime hodnoceni pro kazdu metriku
  evaluateP2(runDir);
  evaluateQ4(runDir);
  evaluateQ8(runDir);

  console.log("=== Done ===");
}

// ============================================================================
// Spolecna funkce pro volani LLM-as-judge
//
// Pouziva `opencode run` s GLM-5 modelem. Format JSON vraci NDJSON
// (jeden JSON objekt na radek). My z nej extrahujeme textove casti.
//
// Prikaz:
//   opencode run -m "zai-coding-plan/glm-5" --format json "prompt"
//
// Volame z run directory aby opencode videl spravny context.
// ============================================================================

/**
 * Posle prompt do GLM-5 pres opencode a vrati textovou odpoved.
 *
 * @param cwd - Pracovni adresar (adresar runu)
 * @param prompt - Kompletni prompt (rubric + data k hodnoceni)
 * @returns Textova odpoved z GLM-5
 */
function callJudge(cwd: string, prompt: string): string {
  try {
    // Pouzivame exec s velkym timeoutem — LLM volani muze trvat minuty.
    // Prompt predavame pres stdin-like mechanismus (v bash verzi pres
    // inline string). V opencode run se predava jako posledni argument.
    //
    // POZOR: Prompt muze byt velmi dlouhy (tisice radku kodu),
    // proto ho predavame pres environment variable nebo temp file.
    const tempPromptPath = path.join(cwd, ".judge-prompt.tmp");
    fs.writeFileSync(tempPromptPath, prompt, "utf-8");

    // Ctime prompt z temp souboru a predame jako argument opencode
    // Pouzivame subshell $(cat ...) pro predani obsahu souboru
    const rawOutput = exec(
      `opencode run -m "${JUDGE_MODEL}" --format json "$(cat .judge-prompt.tmp)"`,
      { cwd },
      '{"error": "GLM-5 call failed"}'
    );

    // Cleanup temp soubor
    try {
      fs.unlinkSync(tempPromptPath);
    } catch {
      /* ignore */
    }

    // Parsujeme NDJSON vystup — extrahujeme textove casti
    return parseOpenCodeOutput(rawOutput);
  } catch (err) {
    console.error(`Judge call failed: ${err}`);
    return '{"error": "GLM-5 call failed"}';
  }
}

// ============================================================================
// P2: Process Artifact Quality
//
// Hodnosti kvalitu procesních artefaktu — jsou commit messages, issues
// a PR descriptions popisne a uzitecne?
//
// Vstup: git log, gh issue list, gh pr list
// Rubric: experiments/infra/judge/p2-process-artifacts.md
// Skala: 1-3 (inadequate / acceptable / good)
// ============================================================================

function evaluateP2(runDir: string): void {
  console.log("--- P2: Collecting process artifacts ---");

  // Sebrame commit messages (bez merge commitu)
  const commits = exec(
    `git log --format="%h %s" --no-merges`,
    { cwd: runDir },
    "No commits found"
  );

  // Sebrame issues z GitHubu (JSON format pro uplna data vcetne body)
  const issues = exec(
    `gh issue list --state all --json number,title,body --limit 50`,
    { cwd: runDir },
    "No issues found (gh not configured)"
  );

  // Sebrame PR z GitHubu
  const prs = exec(
    `gh pr list --state all --json number,title,body --limit 50`,
    { cwd: runDir },
    "No PRs found (gh not configured)"
  );

  // Sestavime vstup pro judge: vsechny procesni artefakty dohromady
  const p2Input = `## Commit Messages
${commits}

## Issue Descriptions
${issues}

## PR Descriptions
${prs}`;

  // Nacteme rubric (hodnotici kriteria) z infra/judge/
  const p2Rubric = readFile(
    path.join(JUDGE_DIR, "p2-process-artifacts.md")
  );

  if (!p2Rubric) {
    console.error(
      "Error: p2-process-artifacts.md rubric not found in judge/"
    );
    return;
  }

  // Prompt = rubric + oddelovac + data
  const prompt = `${p2Rubric}\n\n---\n\n${p2Input}`;

  console.log("Calling GLM-5 for P2...");
  const result = callJudge(runDir, prompt);

  // Ulozime vysledek jako JSON
  const outputPath = path.join(runDir, "p2-result.json");
  writeFile(outputPath, result);
  console.log(`P2 result saved to ${outputPath}`);
  console.log(result);
  console.log("");
}

// ============================================================================
// Q4: AC Coverage
//
// Hodnosti kolik z 24 acceptance criteria (AC) ze specifikace
// ma odpovidajici test v agentove testovem kodu.
//
// Vstup:
// - AC ze specifikace (issue-1-req-only.json, sekce "Acceptance Criteria")
// - Agentovy testove soubory (*.test.ts, *.spec.ts, bez node_modules atd.)
//
// Rubric: experiments/infra/judge/q4-ac-coverage.md
// ============================================================================

function evaluateQ4(runDir: string): void {
  console.log("--- Q4: Collecting acceptance criteria and test code ---");

  // Nacteme specifikaci a extrahujeme AC
  const specFile = path.join(INFRA_DIR, "issue-1-req-only.json");

  if (!fileExists(specFile)) {
    console.log(`Warning: ${specFile} not found, skipping Q4`);
    return;
  }

  const spec = JSON.parse(readFile(specFile)) as { body: string };
  const body = spec.body;

  // Extrahujeme sekci Acceptance Criteria z body specifikace
  // Sekce je mezi "### Acceptance Criteria" a "### Domain Glossary"
  const startMarker = "### Acceptance Criteria";
  const endMarker = "### Domain Glossary";
  let startIdx = body.indexOf(startMarker);
  let endIdx = body.indexOf(endMarker);
  if (startIdx === -1) startIdx = 0;
  if (endIdx === -1) endIdx = body.length;
  const acSection = body.slice(startIdx, endIdx);

  // Kazde AC zacina "- Given" — rozdelime a ocislujeme
  const acBlocks = acSection
    .split(/\n(?=- Given)/)
    .filter(
      (block) =>
        block.trim().startsWith("- Given") ||
        block.trim().startsWith("Given")
    );

  let acText = "";
  acBlocks.forEach((block, idx) => {
    const cleaned = block.replace(/^- /, "").trim();
    acText += `AC${idx + 1}: ${cleaned}\n\n`;
  });

  // Sebrame agentovy testove soubory
  // Vyrazime: node_modules, .stryker-tmp, dist, _ref_tests (nase ref testy)
  const testCode = collectTestFiles(runDir);

  // Nacteme rubric
  const q4Rubric = readFile(
    path.join(JUDGE_DIR, "q4-ac-coverage.md")
  );

  if (!q4Rubric) {
    console.error(
      "Error: q4-ac-coverage.md rubric not found in judge/"
    );
    return;
  }

  const prompt = `${q4Rubric}\n\n---\n\n## Acceptance Criteria\n\n${acText}\n\n## Agent Test Code\n\n${testCode}`;

  console.log("Calling GLM-5 for Q4...");
  const result = callJudge(runDir, prompt);

  const outputPath = path.join(runDir, "q4-result.json");
  writeFile(outputPath, result);
  console.log(`Q4 result saved to ${outputPath}`);
  console.log(result);
  console.log("");
}

// ============================================================================
// Q8: Code Quality
//
// Hodnosti celkovou kvalitu kodu v 5 dimenzich:
// 1. Naming — smysluplne nazvy promennych, funkci, typu
// 2. Separation of Concerns — modularita, kazda funkce ma jednu zodpovednost
// 3. Idiomatic TypeScript — vyuziti TS features (typy, generika, enums...)
// 4. Documentation — komentare, JSDoc, readme
// 5. Complexity — cistota toku, absence zbytecne slozitosti
//
// Vstup: vsechny .ts soubory z src/ (bez testu)
// Rubric: experiments/infra/judge/q8-code-quality.md
// Skala: 1-3 per dimenze
// ============================================================================

function evaluateQ8(runDir: string): void {
  console.log("--- Q8: Collecting source code ---");

  const srcDir = path.join(runDir, "src");

  // Sebrame vsechny .ts soubory z src/ (bez testu)
  const srcCode = collectSourceFiles(srcDir);

  if (!srcCode) {
    console.log("Warning: No source files found in src/");
    return;
  }

  const q8Rubric = readFile(
    path.join(JUDGE_DIR, "q8-code-quality.md")
  );

  if (!q8Rubric) {
    console.error(
      "Error: q8-code-quality.md rubric not found in judge/"
    );
    return;
  }

  const prompt = `${q8Rubric}\n\n---\n\n${srcCode}`;

  console.log("Calling GLM-5 for Q8...");
  const result = callJudge(runDir, prompt);

  const outputPath = path.join(runDir, "q8-result.json");
  writeFile(outputPath, result);
  console.log(`Q8 result saved to ${outputPath}`);
  console.log(result);
  console.log("");
}

// ============================================================================
// Pomocne funkce pro sber souboru
// ============================================================================

/**
 * Sebere vsechny testove soubory z runu (*.test.ts, *.spec.ts).
 * Vynechava node_modules, .stryker-tmp, dist, _ref_tests.
 *
 * Vraci string s obsahem vsech souboru, kazdy oznaceny nazvem.
 */
function collectTestFiles(runDir: string): string {
  const result: string[] = [];
  const excludeDirs = new Set([
    "node_modules",
    ".stryker-tmp",
    "dist",
    "_ref_tests",
  ]);

  function walk(dir: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!excludeDirs.has(entry.name)) {
          walk(path.join(dir, entry.name));
        }
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".test.ts") ||
          entry.name.endsWith(".spec.ts"))
      ) {
        const filePath = path.join(dir, entry.name);
        const content = readFile(filePath);
        result.push(`// === ${entry.name} ===`);
        result.push(content);
      }
    }
  }

  walk(runDir);

  if (result.length === 0) {
    return "No test files found";
  }

  return result.join("\n");
}

/**
 * Sebere vsechny .ts zdrojove soubory z adresare (bez testu).
 * Vraci string s obsahem vsech souboru, kazdy oznaceny cestou.
 */
function collectSourceFiles(srcDir: string): string {
  if (!fs.existsSync(srcDir)) {
    return "No src/ directory found";
  }

  const result: string[] = [];

  function walk(dir: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name));
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".test.ts") &&
        !entry.name.endsWith(".spec.ts")
      ) {
        const filePath = path.join(dir, entry.name);
        const content = readFile(filePath);
        result.push(`// === ${filePath} ===`);
        result.push(content);
      }
    }
  }

  walk(srcDir);

  if (result.length === 0) {
    return "No source files found";
  }

  return result.join("\n");
}

// ============================================================================
// Spusteni
// ============================================================================

main();
