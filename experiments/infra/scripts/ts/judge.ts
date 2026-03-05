/**
 * judge.ts — LLM-as-judge evaluace pomoci GLM-5.
 *
 * Hodnosti metriky ktere vyzaduji lidsky/LLM usudek:
 * - P6 (commit message quality) — jsou commit messages popisne a atomicke?
 * - P7 (issue description quality) — jsou issue descriptions popisne?
 * - P8 (PR description quality) — jsou PR descriptions popisne?
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
 *   p6-result.json, p7-result.json, p8-result.json, q4-result.json, q8-result.json
 */

import * as path from "node:path";
import * as fs from "node:fs";
import { execSync } from "node:child_process";
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
  evaluateP6(runDir);
  evaluateP7(runDir);
  evaluateP8(runDir);
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
function callJudge(_cwd: string, prompt: string): string {
  try {
    // Pouzivame execSync primo (ne nasi exec wrapper), protoze:
    // - Prompt muze byt velmi dlouhy (10-30 KB) — shell argument by mohl selhat
    // - Predavame prompt pres stdin pomoci `input` parametru execSync
    // - opencode run podporuje `-` jako posledni argument = cte ze stdin
    // POZOR: cwd musi byt prazdny adresar bez .opencode/ — jinak opencode
    // inicializuje cely projekt (nacita soubory, AGENTS.md) pred zpracovanim promptu
    const tmpDir = "/tmp";
    const rawOutput = execSync(
      `opencode run -m "${JUDGE_MODEL}" --format json -`,
      {
        cwd: tmpDir,
        encoding: "utf-8",
        // Predame prompt na stdin
        input: prompt,
        stdio: ["pipe", "pipe", "pipe"],
        // LLM volani muze trvat minuty (velke prompty az 10 min)
        timeout: 10 * 60 * 1000,
      }
    );

    // Parsujeme NDJSON vystup — extrahujeme textove casti
    return parseOpenCodeOutput(String(rawOutput ?? "").trim());
  } catch (err: unknown) {
    // I pri non-zero exit code muze byt na stdout validni odpoved
    const e = err as { stdout?: string | Buffer };
    if (e.stdout) {
      const output = String(e.stdout).trim();
      if (output) return parseOpenCodeOutput(output);
    }
    console.error(`Judge call failed: ${err}`);
    return '{"error": "GLM-5 call failed"}';
  }
}

// ============================================================================
// Pomocna funkce: sber procesních artefaktu
//
// Vraci commits, issues a PRs z runu pro hodnoceni P6/P7/P8.
// ============================================================================

function collectProcessArtifacts(runDir: string): {
  commits: string;
  issues: string;
  prs: string;
} {
  // Sebrame commit messages (bez merge commitu)
  const commits = exec(
    `git log --format="%h %s" --no-merges`,
    { cwd: runDir },
    "No commits found"
  );

  // Sebrame issues z GitHubu (JSON format pro uplna data vcetne body).
  // Vyfiltrujeme Issue #1 (spec) — jeho body je cela specifikace (~15KB),
  // pro hodnoceni procesních artefaktu je nepotrebujeme a zbytecne
  // zvetsuje prompt (zpusobuje timeouty u LLM).
  const rawIssues = exec(
    `gh issue list --state all --json number,title,body --limit 50`,
    { cwd: runDir },
    "No issues found (gh not configured)"
  );
  let issues = rawIssues;
  try {
    const parsed = JSON.parse(rawIssues) as Array<{ number: number; title: string; body: string }>;
    // Zkratime body Issue #1 na prvnich 200 znaku (jen aby judge vedel ze existuje)
    const filtered = parsed.map((issue) => {
      if (issue.number === 1 && issue.body.length > 200) {
        return { ...issue, body: issue.body.slice(0, 200) + "\n\n[... spec truncated for brevity ...]" };
      }
      return issue;
    });
    issues = JSON.stringify(filtered);
  } catch {
    // Pokud neni validni JSON, pouzijeme original
  }

  // Sebrame PR z GitHubu
  const prs = exec(
    `gh pr list --state all --json number,title,body --limit 50`,
    { cwd: runDir },
    "No PRs found (gh not configured)"
  );

  return { commits, issues, prs };
}

// ============================================================================
// P6: Commit Message Quality
//
// Hodnosti popisnost commit messages — jsou atomicke, maji konvencni prefix,
// je z nich jasne co a proc bylo zmeneno?
//
// Vstup: git log (commit messages)
// Rubric: experiments/infra/judge/p6-commit-messages.md
// Skala: 1-3 (inadequate / acceptable / good)
// ============================================================================

function evaluateP6(runDir: string): void {
  console.log("--- P6: Commit message quality ---");
  if (fileExists(path.join(runDir, "p6-result.json"))) { console.log("P6: skipping (already evaluated)"); return; }

  const { commits } = collectProcessArtifacts(runDir);

  const p6Rubric = readFile(
    path.join(JUDGE_DIR, "p6-commit-messages.md")
  );

  if (!p6Rubric) {
    // Fallback: zkusime stary soubor p2-process-artifacts.md s instrukcemi pro commit messages
    const p2Rubric = readFile(path.join(JUDGE_DIR, "p2-process-artifacts.md"));
    if (!p2Rubric) {
      console.error("Error: p6-commit-messages.md (nor p2-process-artifacts.md fallback) not found in judge/");
      return;
    }
    console.log("Warning: Using p2-process-artifacts.md as fallback rubric for P6");
    const prompt = `${p2Rubric}\n\nEvaluate ONLY commit message quality (P6). Focus on:\n- Conventional prefix (feat:, test:, fix:, etc.)\n- Atomicity (one logical change per commit)\n- Descriptiveness (what and why)\n\nOutput JSON: { "metric": "P6", "score": 1-3, "rationale": "..." }\n\n---\n\n## Commit Messages\n${commits}`;
    const result = callJudge(runDir, prompt);
    const outputPath = path.join(runDir, "p6-result.json");
    writeFile(outputPath, result);
    console.log(`P6 result saved to ${outputPath}`);
    console.log(result);
    console.log("");
    return;
  }

  const prompt = `${p6Rubric}\n\n---\n\n## Commit Messages\n${commits}`;

  console.log("Calling GLM-5 for P6...");
  const result = callJudge(runDir, prompt);

  const outputPath = path.join(runDir, "p6-result.json");
  writeFile(outputPath, result);
  console.log(`P6 result saved to ${outputPath}`);
  console.log(result);
  console.log("");
}

// ============================================================================
// P7: Issue Description Quality
//
// Hodnosti popisnost issue descriptions — maji jasny scope, acceptance criteria,
// je z nich zrejme co ma byt implementovano?
//
// Vstup: gh issue list (issues, bez Issue #1 spec)
// Rubric: experiments/infra/judge/p7-issue-descriptions.md
// Skala: 1-3 (inadequate / acceptable / good)
// ============================================================================

function evaluateP7(runDir: string): void {
  console.log("--- P7: Issue description quality ---");
  if (fileExists(path.join(runDir, "p7-result.json"))) { console.log("P7: skipping (already evaluated)"); return; }

  const { issues } = collectProcessArtifacts(runDir);

  const p7Rubric = readFile(
    path.join(JUDGE_DIR, "p7-issue-descriptions.md")
  );

  if (!p7Rubric) {
    const p2Rubric = readFile(path.join(JUDGE_DIR, "p2-process-artifacts.md"));
    if (!p2Rubric) {
      console.error("Error: p7-issue-descriptions.md (nor p2-process-artifacts.md fallback) not found in judge/");
      return;
    }
    console.log("Warning: Using p2-process-artifacts.md as fallback rubric for P7");
    const prompt = `${p2Rubric}\n\nEvaluate ONLY issue description quality (P7). Focus on:\n- Clarity of scope and acceptance criteria\n- Sufficient detail for implementation\n- Structured format\n\nOutput JSON: { "metric": "P7", "score": 1-3, "rationale": "..." }\n\n---\n\n## Issue Descriptions\n${issues}`;
    const result = callJudge(runDir, prompt);
    const outputPath = path.join(runDir, "p7-result.json");
    writeFile(outputPath, result);
    console.log(`P7 result saved to ${outputPath}`);
    console.log(result);
    console.log("");
    return;
  }

  const prompt = `${p7Rubric}\n\n---\n\n## Issue Descriptions\n${issues}`;

  console.log("Calling GLM-5 for P7...");
  const result = callJudge(runDir, prompt);

  const outputPath = path.join(runDir, "p7-result.json");
  writeFile(outputPath, result);
  console.log(`P7 result saved to ${outputPath}`);
  console.log(result);
  console.log("");
}

// ============================================================================
// P8: PR Description Quality
//
// Hodnosti popisnost PR descriptions — obsahuji odkaz na issue, popis co a proc,
// jsou dostatecne informativni pro code review?
//
// Vstup: gh pr list (PR descriptions)
// Rubric: experiments/infra/judge/p8-pr-descriptions.md
// Skala: 1-3 (inadequate / acceptable / good)
// ============================================================================

function evaluateP8(runDir: string): void {
  console.log("--- P8: PR description quality ---");
  if (fileExists(path.join(runDir, "p8-result.json"))) { console.log("P8: skipping (already evaluated)"); return; }

  const { prs } = collectProcessArtifacts(runDir);

  const p8Rubric = readFile(
    path.join(JUDGE_DIR, "p8-pr-descriptions.md")
  );

  if (!p8Rubric) {
    const p2Rubric = readFile(path.join(JUDGE_DIR, "p2-process-artifacts.md"));
    if (!p2Rubric) {
      console.error("Error: p8-pr-descriptions.md (nor p2-process-artifacts.md fallback) not found in judge/");
      return;
    }
    console.log("Warning: Using p2-process-artifacts.md as fallback rubric for P8");
    const prompt = `${p2Rubric}\n\nEvaluate ONLY PR description quality (P8). Focus on:\n- Link to issue (Closes #N)\n- Description of what and why\n- Sufficient detail for code review\n\nOutput JSON: { "metric": "P8", "score": 1-3, "rationale": "..." }\n\n---\n\n## PR Descriptions\n${prs}`;
    const result = callJudge(runDir, prompt);
    const outputPath = path.join(runDir, "p8-result.json");
    writeFile(outputPath, result);
    console.log(`P8 result saved to ${outputPath}`);
    console.log(result);
    console.log("");
    return;
  }

  const prompt = `${p8Rubric}\n\n---\n\n## PR Descriptions\n${prs}`;

  console.log("Calling GLM-5 for P8...");
  const result = callJudge(runDir, prompt);

  const outputPath = path.join(runDir, "p8-result.json");
  writeFile(outputPath, result);
  console.log(`P8 result saved to ${outputPath}`);
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
  if (fileExists(path.join(runDir, "q4-result.json"))) { console.log("Q4: skipping (already evaluated)"); return; }

  // Nacteme specifikaci a extrahujeme AC
  const specFile = path.join(INFRA_DIR, "inputs", "issue-1-req-only.json");

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
  if (fileExists(path.join(runDir, "q8-result.json"))) { console.log("Q8: skipping (already evaluated)"); return; }

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
