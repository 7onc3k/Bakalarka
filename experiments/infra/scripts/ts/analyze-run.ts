/**
 * analyze-run.ts — Post-run analyza experimentu.
 *
 * Meri deterministicke metriky z metricky ramce BP (kap03):
 * - P1-P5 (process compliance) — 5 binarnich metrik checklistu
 * - Q1-Q7 (product quality) — API kontrakt, referencni testy, mutace, lint, typy, slozitost
 * - E1-E3 (efficiency) — tokeny, cas, stabilita
 *
 * Pro P6-P8, Q4, Q8 (LLM-as-judge) pouzij judge.ts.
 *
 * Usage:
 *   npx tsx analyze-run.ts <run-name>
 *
 * Example:
 *   npx tsx analyze-run.ts pilot-r1
 *
 * POZNAMKA: Skript se prepne do adresare runu (cd) pro git/npm prikazy,
 * protoze nastroje jako vitest, tsc a eslint resolvuji konfigurace relativne
 * k aktualni working directory.
 */

import * as path from "node:path";
import * as fs from "node:fs";
import { execSync } from "node:child_process";
import {
  // Types
  type PComplianceResult,
  type P1Result,
  type P2Result,
  type P3Result,
  type P4Result,
  type P5Result,
  type Q1Result,
  type Q2Result,
  type Q3Result,
  type Q5Result,
  type Q6Result,
  type Q7Result,
  type E1Result,
  type E2Result,
  type E3Result,
  type GitStats,
  type BehavioralTrace,
  // Utilities
  exec,
  resolveRunDir,
  readFile,
  fileExists,
  readJSON,
  countMatches,
  formatNumber,
  printHeader,
  passIcon,
  getRunNameFromArgs,
  REFERENCE_DIR,
  INFRA_DIR,
} from "./shared.js";

// ============================================================================
// Exportovane pomocne funkce (extrahovane z measureQ1 pro testovatelnost)
// ============================================================================

/**
 * Prepise relativni import cesty v referencnich testech.
 *
 * Referencni testy importuji z "../*.js" (napr. "../index.js",
 * "../business-days.js"). Kdyz je kopirujem do tests/_ref_tests/,
 * spravna cesta je "../../src/*.js".
 *
 * @param content - Obsah testoveho souboru
 * @returns Obsah s prepsanymi import cestami
 */
export function rewriteImports(content: string): string {
  return content.replace(/from "\.\.\/([^"]+)"/g, 'from "../../src/$1"');
}

/**
 * Extrahuje pocet projitych testu z vitest vystupu.
 *
 * Vitest vypise dva radky s "N passed":
 *   "Test Files  4 passed (7)"
 *   "Tests  34 passed (37)"
 * Nas zajima posledni vyskyt — to je pocet jednotlivych testu (ne souboru).
 *
 * @param output - Textovy vystup z vitest
 * @returns Pocet projitych testu, nebo 0 pokud nenalezeno
 */
export function parseVitestPassed(output: string): number {
  const allMatches = [...output.matchAll(/(\d+)\s+passed/g)];
  const lastMatch =
    allMatches.length > 0 ? allMatches[allMatches.length - 1] : null;
  return lastMatch ? parseInt(lastMatch[1], 10) : 0;
}

// ============================================================================
// Hlavni logika
// ============================================================================

function main(): void {
  const runName = getRunNameFromArgs("analyze-run.ts");
  const runDir = resolveRunDir(runName);

  // Presmerovat console.log do souboru FINDINGS.md i na stdout zaroven
  const findingsPath = path.join(runDir, "FINDINGS.md");
  const findingsLines: string[] = [];
  const origLog = console.log.bind(console);
  console.log = (...args: unknown[]) => {
    const line = args.map(String).join(" ");
    findingsLines.push(line);
    origLog(...args);
  };

  console.log(`=== Analyze: ${runName} ===`);
  console.log("");

  // Vsechny git/npm prikazy bezi v adresari runu
  const cwd = runDir;

  // Spustime jednotlive analyzy
  const { p1, p2, p3, p4, p5 } = measureProcessCompliance(cwd);
  const gitStats = measureGitStats(cwd);
  const q1 = measureQ1(cwd);
  const q2 = measureQ2(cwd);
  const q3 = measureQ3(cwd);

  // ESLint setup — sdileny mezi Q5 a Q7
  const eslintReady = setupEslint(cwd);

  const q5 = measureQ5(cwd, eslintReady);
  const q6 = measureQ6(cwd);
  const q7 = measureQ7(cwd, eslintReady);

  // Cleanup: smazat kopirovany ESLint config
  cleanupEslint(cwd);

  // Informacni: agentovy vlastni testy
  runAgentTests(cwd);

  // Efficiency metriky
  const { e1, e2, e3 } = measureEfficiency(cwd);

  // Behavioral trace (deterministicka extrakce faktu pro DIAGNOSIS)
  const trace = measureBehavioralTrace(cwd);

  // Souhrnna tabulka
  printSummary(runName, runDir, p1, p2, p3, p4, p5, q1, q2, q3, q5, q6, q7, e1, e2, e3, trace);

  // Automaticky spustit judge.ts po uspesnem analyze-run
  console.log("\n=== Running judge.ts automatically ===");
  const judgeScript = path.join(INFRA_DIR, "scripts", "ts", "judge.ts");
  try {
    const judgeOutput = execSync(`npx tsx "${judgeScript}" ${runName}`, {
      cwd: process.cwd(),
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    if (judgeOutput) {
      console.log(judgeOutput);
    }
  } catch (err: unknown) {
    const error = err as { stdout?: string | Buffer; stderr?: string | Buffer; message?: string };
    let errorMsg = "Unknown error";
    if (error.stderr) {
      errorMsg = String(error.stderr);
    } else if (error.message) {
      errorMsg = error.message;
    }
    console.log("Warning: Judge failed or skipped:", errorMsg.slice(0, 200));
  }

  // Zapsat FINDINGS.md
  console.log = origLog;
  fs.writeFileSync(findingsPath, findingsLines.join("\n"), "utf-8");
  origLog(`\nFINDINGS.md saved: ${findingsPath}`);
}

// ============================================================================
// P1-P5: Process Compliance
//
// Meri zda agent dodrzuje spec-driven development proces.
// 5 binarnich metrik — kazda je samostatny vysledek (pass/fail).
//
// Proc tyto metriky: Kazda odpovida jednomu z cilovych chovani
// definovanych v AGENTS.md a mereny v kap03 BP.
// ============================================================================

function measureProcessCompliance(cwd: string): {
  p1: P1Result;
  p2: P2Result;
  p3: P3Result;
  p4: P4Result;
  p5: P5Result;
} {
  printHeader("P1-P5: Process Compliance");

  const p1 = measureP1(cwd);
  const p2 = measureP2(cwd);
  const p3 = measureP3(cwd);
  const p4 = measureP4(cwd);
  const p5 = measureP5(cwd);

  const all = [p1, p2, p3, p4, p5];

  // Vypis vsech metrik
  for (const item of all) {
    console.log(
      `${item.id} ${item.label}: ${passIcon(item.pass)} (${item.detail})`
    );
  }
  console.log("");

  return { p1, p2, p3, p4, p5 };
}

// --- P1: Issues before code ---
// Agent ma nejdriv vytvorit issues (plan), pak az psat kod.
// Merimo: porovname timestamp prvniho issue vs. prvniho code commitu.

function measureP1(cwd: string): P1Result {
  const issuesJson = exec(
    `gh issue list --state all --limit 100 --json number,createdAt`,
    { cwd }
  );

  let firstIssueTime = "";
  if (issuesJson) {
    try {
      const issues = JSON.parse(issuesJson) as Array<{
        number: number;
        createdAt: string;
      }>;
      // Filtrujeme #1 (spec issue vytvoreny new-run.sh, ne agentem)
      const agentIssues = issues.filter((i) => i.number > 1);
      if (agentIssues.length > 0) {
        // Nejstarsi issue = minimum z createdAt
        firstIssueTime = agentIssues.reduce((min, i) =>
          i.createdAt < min.createdAt ? i : min
        ).createdAt;
      }
    } catch {
      /* JSON parse failed — gh not configured or no issues */
    }
  }

  // Zjistime cas prvniho code commitu (soubory v src/ nebo tests/)
  const firstCodeCommitTime = exec(
    `git log --all --diff-filter=A --format="%aI" -- 'src/*.ts' 'src/**/*.ts' 'tests/*.ts' 'tests/**/*.ts'`,
    { cwd }
  )
    .split("\n")
    .filter(Boolean)
    .pop(); // `tail -1` = posledni radek = nejstarsi

  if (firstIssueTime && firstCodeCommitTime) {
    const pass = firstIssueTime < firstCodeCommitTime;
    return {
      id: "P1",
      label: "Issues before code",
      pass,
      detail: `issue: ${firstIssueTime.slice(0, 19)}, code: ${firstCodeCommitTime.slice(0, 19)}`,
    };
  }

  return {
    id: "P1",
    label: "Issues before code",
    pass: null,
    detail: "could not determine timestamps",
  };
}

// --- P2: Branch per issue ---
// Kazdy issue by mel mit vlastni branch (ne jeden branch pro vse).
// Merimo: pocet remote branches >= pocet issues (minus #1 ktery je spec).

function measureP2(cwd: string): P2Result {
  const issuesJson = exec(
    `gh issue list --state all --limit 100 --json number`,
    { cwd }
  );
  let issueTotal = 0;
  try {
    const issues = JSON.parse(issuesJson || "[]") as Array<{
      number: number;
    }>;
    issueTotal = issues.filter((i) => i.number > 1).length;
  } catch {
    /* ignore */
  }

  // Pocet remote branches (bez HEAD a main)
  const branchOutput = exec(`git branch -a`, { cwd });
  const branchCount = branchOutput
    .split("\n")
    .filter(
      (b) =>
        b.includes("remotes/origin/") &&
        !b.includes("HEAD") &&
        !b.trim().endsWith("remotes/origin/main")
    ).length;

  const pass =
    issueTotal > 0 && branchCount > 0 && branchCount >= issueTotal;
  return {
    id: "P2",
    label: "Branch per issue",
    pass,
    detail: `branches: ${branchCount}, issues: ${issueTotal}`,
  };
}

// --- P3: Test-first commits ---
// TDD: agent ma psat testy pred implementaci.
// Merimo: existuje alespon jeden "test:" commit a alespon jeden "feat:" commit.
// Presnejsi verze: tddOrderViolations=0 v behavioral trace.

function measureP3(cwd: string): P3Result {
  // Spocitame commity s prefixem "test:" a "feat:" v historii.
  const allMessages = exec(`git log --all --oneline --format="%s"`, {
    cwd,
  });
  const testCommits = countMatches(allMessages, /^test:/gm);
  const featCommits = countMatches(allMessages, /^feat:/gm);

  // Podminka: existuji oba typy commitu (test: i feat:).
  // Plna verze: tddOrderViolations=0 (meri poradi per branch — viz behavioral trace).
  const pass = testCommits > 0 && featCommits > 0;
  return {
    id: "P3",
    label: "Test-first commits",
    pass,
    detail: `test: ${testCommits}, feat: ${featCommits}`,
  };
}

// --- P4: PRs linked to issues ---
// Kazdy PR by mel odkazovat na issue (napr. "Closes #3").
// Merimo: pocet PR s "Closes #N" v body == celkovy pocet PR.

function measureP4(cwd: string): P4Result {
  const prJson = exec(`gh pr list --state all --json number`, {
    cwd,
  });
  let prTotal = 0;
  try {
    prTotal = (JSON.parse(prJson || "[]") as unknown[]).length;
  } catch {
    /* ignore */
  }

  // Pocet PR ktere odkazuji na issue (regex: "Closes #N" nebo "closes #N")
  let prLinked = 0;
  if (prTotal > 0) {
    const prBodiesJson = exec(
      `gh pr list --state all --json body`,
      { cwd }
    );
    try {
      const prs = JSON.parse(prBodiesJson || "[]") as Array<{
        body: string | null;
      }>;
      prLinked = prs.filter((pr) =>
        /[Cc]loses? #\d+/.test(pr.body ?? "")
      ).length;
    } catch {
      /* ignore */
    }
  }

  const pass = prTotal > 0 && prLinked === prTotal;
  return {
    id: "P4",
    label: "PRs linked to issues",
    pass,
    detail: `${prLinked}/${prTotal}`,
  };
}

// --- P5: No existing test modifications ---
// Agent nesmi menit existujici testy (jenom pridavat nove).
// Merimo: git log pro MODIFIED (ne ADDED) soubory v tests/ a __tests__/.

function measureP5(cwd: string): P5Result {
  // --diff-filter=M zachyti jen modified files, ne added.
  const modifiedTests = exec(
    `git log --all --diff-filter=M --name-only --format="" -- 'tests/**' 'src/**/*.test.ts' '__tests__/**'`,
    { cwd }
  );
  // Unikatni soubory (muze byt jeden soubor modifikovan vicekrat)
  const uniqueModified = new Set(
    modifiedTests.split("\n").filter(Boolean)
  ).size;

  const pass = uniqueModified === 0;
  return {
    id: "P5",
    label: "No existing test modifications",
    pass,
    detail: pass ? "" : `${uniqueModified} files modified`,
  };
}

// ============================================================================
// Git Stats (informacni, ne metrika — ale pomaha interpretovat P1)
// ============================================================================

function measureGitStats(cwd: string): GitStats {
  printHeader("Git Stats (informational)");

  // Celkovy pocet commitu
  const commitLog = exec(`git log --oneline --all`, { cwd });
  const totalCommits = commitLog.split("\n").filter(Boolean).length;
  console.log(`Total commits: ${totalCommits}`);
  console.log("");

  // Commit prefixy (napr. feat: 5, test: 3, fix: 2)
  const messages = exec(`git log --all --oneline --format="%s"`, {
    cwd,
  });
  const prefixes: Record<string, number> = {};
  for (const msg of messages.split("\n").filter(Boolean)) {
    const prefix = msg.split(":")[0] ?? "other";
    prefixes[prefix] = (prefixes[prefix] ?? 0) + 1;
  }

  console.log("Commit prefixes:");
  // Setridime podle poctu (sestupne)
  const sorted = Object.entries(prefixes).sort(([, a], [, b]) => b - a);
  for (const [prefix, count] of sorted) {
    console.log(`  ${count} ${prefix}`);
  }
  console.log("");

  // Issues
  const issuesJson = exec(
    `gh issue list --state all --limit 100 --json number`,
    { cwd }
  );
  let issueCount = 0;
  try {
    issueCount = (
      JSON.parse(issuesJson || "[]") as Array<{ number: number }>
    ).filter((i) => i.number > 1).length;
  } catch {
    /* ignore */
  }

  const closedJson = exec(
    `gh issue list --state closed --limit 100 --json number`,
    { cwd }
  );
  let closedCount = 0;
  try {
    closedCount = (
      JSON.parse(closedJson || "[]") as Array<{ number: number }>
    ).filter((i) => i.number > 1).length;
  } catch {
    /* ignore */
  }

  console.log(`Issues: ${issueCount} (closed: ${closedCount})`);

  // PRs
  const prJson = exec(`gh pr list --state all --json number`, { cwd });
  let prCount = 0;
  try {
    prCount = (JSON.parse(prJson || "[]") as unknown[]).length;
  } catch {
    /* ignore */
  }

  const prMergedJson = exec(
    `gh pr list --state merged --json number`,
    { cwd }
  );
  let mergedPrCount = 0;
  try {
    mergedPrCount = (JSON.parse(prMergedJson || "[]") as unknown[])
      .length;
  } catch {
    /* ignore */
  }

  console.log(`PRs: ${prCount} (merged: ${mergedPrCount})`);
  console.log("");

  return {
    totalCommits,
    commitPrefixes: prefixes,
    issueCount,
    closedIssueCount: closedCount,
    prCount,
    mergedPrCount,
  };
}

// ============================================================================
// Q1: API Contract Match
//
// Meri zda agentova implementace exportuje spravne verejne API.
// Specifikace pozaduje dva exporty: createInstance() a process().
// Jednoducha kontrola pomoci grepu v src/index.ts.
// ============================================================================

function measureQ1(cwd: string): Q1Result {
  printHeader("Q1: API Contract Match");

  const indexPath = path.join(cwd, "src", "index.ts");
  if (!fileExists(indexPath)) {
    console.log("Warning: No src/index.ts found");
    console.log("");
    return { hasCreateInstance: false, hasProcess: false, match: false };
  }

  // Kontrolujeme src/ jako celek — agent muze pouzit re-export (export * from)
  // nebo primy export. Hledame ve vsech .ts souborech v src/.
  const srcDir = path.join(cwd, "src");
  const srcFiles = fs
    .readdirSync(srcDir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => readFile(path.join(srcDir, f)) ?? "")
    .join("\n");

  const hasCreateInstance =
    countMatches(
      srcFiles,
      /export\s+.*function\s+createInstance|export\s+\{[^}]*createInstance/g
    ) > 0;
  const hasProcess =
    countMatches(
      srcFiles,
      /export\s+.*function\s+process(?!\s*\(.*exit)|export\s+\{[^}]*\bprocess\b/g
    ) > 0;

  const match = hasCreateInstance && hasProcess;

  if (match) {
    console.log(
      `**Q1: ${passIcon(true)} Exports createInstance and process**`
    );
  } else {
    console.log(
      `**Q1: ${passIcon(false)} Missing exports (createInstance: ${hasCreateInstance ? "yes" : "no"}, process: ${hasProcess ? "yes" : "no"})**`
    );
  }
  console.log("");

  return { hasCreateInstance, hasProcess, match };
}

// ============================================================================
// Q2: Reference Test Pass Rate
//
// Meri funkci korektnost agentovy implementace.
// Pouzivame 40 referencnich testu (behavioral tests) ze specifikace.
// Testy jsou v experiments/reference/src/__tests__/ (baseline implementace).
//
// Postup:
// 1. Zkopirujeme ref testy do docasneho adresare v runu
// 2. Upravime import cesty (ref testy importuji z "../index.js",
//    ale z _ref_tests/ je cesta "../../src/index.js")
// 3. Spustime vitest
// 4. Uklidime
// ============================================================================

function measureQ2(cwd: string): Q2Result {
  printHeader("Q2: Reference Test Pass Rate");

  const refTestDir = path.join(REFERENCE_DIR, "src", "__tests__");
  const srcIndex = path.join(cwd, "src", "index.ts");

  // Spocitame kolik testu ocekavame (pocet `it(` v referencnich testech)
  let refExpected = 0;
  if (fs.existsSync(refTestDir)) {
    const refFiles = fs
      .readdirSync(refTestDir)
      .filter((f) => f.endsWith(".test.ts"));
    for (const f of refFiles) {
      const content = readFile(path.join(refTestDir, f));
      refExpected += countMatches(content, /it\(/g);
    }
  }

  if (!fs.existsSync(refTestDir) || !fs.existsSync(srcIndex)) {
    console.log(
      "Warning: Reference tests or src/index.ts not found — skipping"
    );
    console.log("");
    return { passed: 0, total: refExpected, output: "" };
  }

  // Vytvorime docasny adresar pro ref testy
  const tmpTestDir = path.join(cwd, "tests", "_ref_tests");
  fs.mkdirSync(tmpTestDir, { recursive: true });

  // Zkopirujeme ref testy s upravenou import cestou
  const refFiles = fs
    .readdirSync(refTestDir)
    .filter((f) => f.endsWith(".test.ts"));
  for (const f of refFiles) {
    const content = readFile(path.join(refTestDir, f));
    fs.writeFileSync(path.join(tmpTestDir, f), rewriteImports(content));
  }

  // Spustime vitest na ref testech
  const refOutput = exec(`npx vitest run tests/_ref_tests/`, { cwd });

  // Vypiseme poslednich 15 radku vystupu (jako bash verze)
  const outputLines = refOutput.split("\n");
  const tail15 = outputLines.slice(-15).join("\n");
  console.log(tail15);
  console.log("");

  // Extrahujeme pocet passed testu z vitest vystupu
  const passed = parseVitestPassed(refOutput);
  const total = refExpected;

  // Uklidime docasny adresar
  fs.rmSync(tmpTestDir, { recursive: true, force: true });

  const pass = passed === total && total > 0;
  console.log(
    `**Q2: ${passIcon(pass)} ${passed}/${total} reference tests pass**`
  );
  console.log("");

  return { passed, total, output: tail15 };
}

// ============================================================================
// Q3: Mutation Score (Stryker)
//
// Mutation testing generuje male zmeny (mutanty) v kodu a kontroluje
// zda je testy odchyti. Vyssi score = testy lepe pokryvaji logiku.
//
// Pouzivame Stryker — prumyslovy standard pro JS/TS mutation testing.
// Verze Strykeru zavisi na verzi vitest:
//   - vitest <2 → Stryker 8 (kompatibilni)
//   - vitest >=2 → Stryker latest (9.x)
// ============================================================================

function measureQ3(cwd: string): Q3Result {
  printHeader("Q3: Mutation Score (Stryker)");

  if (
    !fileExists(path.join(cwd, "package.json")) ||
    !fileExists(path.join(cwd, "src", "index.ts"))
  ) {
    console.log("Warning: No package.json or src/index.ts — skipping");
    console.log("");
    return { score: null, output: "" };
  }

  // Instalace Strykeru pokud neni (detekce verze vitest pro kompatibilitu)
  const strykerCheck = exec(`npx stryker --version`, { cwd });
  if (!strykerCheck) {
    const vitestVerOutput = exec(`npx vitest --version`, { cwd });
    const vitestMajor = parseInt(
      vitestVerOutput.match(/^(\d+)/)?.[1] ?? "0",
      10
    );
    const strykerTag = vitestMajor >= 2 ? "latest" : "8";

    console.log(
      `Installing Stryker (${strykerTag}) for vitest ${vitestMajor}.x...`
    );
    const installOutput = exec(
      `npm install --save-dev @stryker-mutator/core@${strykerTag} @stryker-mutator/vitest-runner@${strykerTag} @stryker-mutator/typescript-checker@${strykerTag} --legacy-peer-deps`,
      { cwd }
    );
    // Vypiseme posledni radek install vystupu (shruti)
    const lastLine = installOutput.split("\n").filter(Boolean).pop();
    if (lastLine) console.log(lastLine);
  }

  // Vytvorime Stryker config pokud neexistuje
  const strykerConfigPath = path.join(cwd, "stryker.config.json");
  const strykerConfigJsPath = path.join(cwd, "stryker.config.js");
  if (
    !fileExists(strykerConfigPath) &&
    !fileExists(strykerConfigJsPath)
  ) {
    const strykerConfig = {
      $schema:
        "https://raw.githubusercontent.com/stryker-mutator/stryker/master/packages/core/schema/stryker-core.schema.json",
      testRunner: "vitest",
      checkers: ["typescript"],
      tsconfigFile: "tsconfig.json",
      mutate: ["src/**/*.ts", "!src/**/*.test.ts", "!src/__tests__/**"],
      reporters: ["clear-text"],
    };
    fs.writeFileSync(
      strykerConfigPath,
      JSON.stringify(strykerConfig, null, 2)
    );
  }

  console.log("Running Stryker (this may take a few minutes)...");
  const strykerOutput = exec(`npx stryker run`, { cwd });

  // Extrahujeme mutation score z vystupu (radek: "All files | XX.XX | ...")
  const scoreMatch = strykerOutput.match(/All files\s*\|\s*([\d.]+)/);
  const score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

  // Vypiseme souhrn (radky okolo "All files")
  const lines = strykerOutput.split("\n");
  const allFilesIdx = lines.findIndex((l) => l.includes("All files"));
  if (allFilesIdx >= 0) {
    const summary = lines
      .slice(Math.max(0, allFilesIdx - 1), allFilesIdx + 2)
      .join("\n");
    console.log(summary);
  }
  console.log("");
  console.log(
    `**Q3: Mutation score: ${score !== null ? `${score}%` : "?"}**`
  );
  console.log("");

  return { score, output: strykerOutput };
}

// ============================================================================
// ESLint Setup (sdileny pro Q5 a Q7)
//
// Pro konzistentni mereni pouzivame fixni ESLint konfiguraci z infra/
// (eslint-fixed.config.mjs) — NE agentovu vlastni konfiguraci.
// To zajistuje ze vsechny runy se meri stejnym metrem.
// ============================================================================

function setupEslint(cwd: string): boolean {
  if (
    !fileExists(path.join(cwd, "package.json")) ||
    !fileExists(path.join(cwd, "src", "index.ts"))
  ) {
    return false;
  }

  // Kontrola zda jsou ESLint a TS parser nainstalovany
  const checks = [
    `node -e "require.resolve('eslint')"`,
    `node -e "require.resolve('@typescript-eslint/parser')"`,
    `node -e "require.resolve('@typescript-eslint/eslint-plugin')"`,
  ];

  let needInstall = false;
  for (const check of checks) {
    const result = exec(check, { cwd }, "MISSING");
    if (result === "MISSING") {
      needInstall = true;
      break;
    }
  }

  if (needInstall) {
    console.log("Installing ESLint + TypeScript support...");
    const installResult = exec(
      `npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser --legacy-peer-deps`,
      { cwd }
    );
    const lastLine = installResult.split("\n").filter(Boolean).pop();
    if (lastLine) console.log(lastLine);
  }

  // Zkopirujeme fixni config do CWD (ESLint resolvuje pluginy z lokace configu)
  const fixedConfigSrc = path.join(
    INFRA_DIR,
    "config",
    "eslint-fixed.config.mjs"
  );
  const fixedConfigDst = path.join(cwd, "eslint.config.mjs");
  try {
    fs.copyFileSync(fixedConfigSrc, fixedConfigDst);
  } catch {
    console.log("Warning: Could not copy eslint-fixed.config.mjs");
    return false;
  }

  // Overime ze ESLint funguje
  const check = exec(`npx eslint src/index.ts --format json`, { cwd });
  try {
    JSON.parse(check);
    return true;
  } catch {
    console.log(
      `Warning: ESLint could not run: ${check.split("\n")[0]}`
    );
    return false;
  }
}

function cleanupEslint(cwd: string): void {
  const configPath = path.join(cwd, "eslint.config.mjs");
  if (fileExists(configPath)) {
    fs.unlinkSync(configPath);
  }
}

// ============================================================================
// Q5: Lint Warnings
//
// Meri cistotu kodu pomoci ESLint s fixni konfiguraci.
// Exit kriterium: 0 warnings.
// ============================================================================

function measureQ5(cwd: string, eslintReady: boolean): Q5Result {
  printHeader("Q5: Lint Warnings");

  if (!eslintReady) {
    console.log("Warning: ESLint not available — skipping Q5");
    console.log("");
    return { warnings: null, errors: null };
  }

  const lintOutput = exec(`npx eslint 'src/**/*.ts' --format json`, {
    cwd,
  });

  try {
    const results = JSON.parse(lintOutput) as Array<{
      warningCount?: number;
      errorCount?: number;
    }>;
    const warnings = results.reduce(
      (sum, r) => sum + (r.warningCount ?? 0),
      0
    );
    const errors = results.reduce(
      (sum, r) => sum + (r.errorCount ?? 0),
      0
    );

    console.log(`**Q5: Warnings: ${warnings}, Errors: ${errors}**`);
    console.log("");
    return { warnings, errors };
  } catch {
    console.log("**Q5: Could not parse ESLint output**");
    console.log("");
    return { warnings: null, errors: null };
  }
}

// ============================================================================
// Q6: Typecheck Errors
//
// Dvoji mereni:
// 1. `tsc --noEmit` — plne typecheck chyby
// 2. grep pro `any` — explicit any v kodu (indikator slabeho typovani)
//
// Exit kriterium: 0 errors, 0 `any`.
// ============================================================================

function measureQ6(cwd: string): Q6Result {
  printHeader("Q6: Typecheck Errors");

  if (!fileExists(path.join(cwd, "package.json"))) {
    console.log("Warning: No package.json — skipping");
    console.log("");
    return { tscErrors: 0, anyCount: 0 };
  }

  // Spustime tsc pro Q6 (typecheck errors)
  const tscOutput = exec(`npx tsc --noEmit`, { cwd });
  const tscErrors = countMatches(tscOutput, /error TS/g);

  // Spocitame vyskyty `any` v src/ souborech (ne v node_modules)
  // Pouzivame grep pres vsechny .ts soubory v src/
  const anyOutput = exec(
    `grep -r --include='*.ts' '\\bany\\b' src/`,
    { cwd }
  );
  const anyLines = anyOutput.split("\n").filter(Boolean);
  // Filtrujeme node_modules (pro jistotu, i kdyz --include by mel stacit)
  const anyCount = anyLines.filter(
    (l) => !l.includes("node_modules")
  ).length;

  console.log(
    `**Q6: Typecheck errors: ${tscErrors}, \`any\` occurrences: ${anyCount}**`
  );
  console.log("");

  return { tscErrors, anyCount };
}

// ============================================================================
// Q7: Code Complexity
//
// Meri cyklomatickou slozitost (McCabe metric) pomoci ESLint pravidla
// `complexity: ["warn", 10]`. Kazda funkce se slozitosti > 10 je violation.
//
// Exit kriterium: 0 violations (zadna funkce neni slozitejsi nez 10).
// ============================================================================

function measureQ7(cwd: string, eslintReady: boolean): Q7Result {
  printHeader("Q7: Code Complexity");

  if (!eslintReady) {
    console.log("Warning: ESLint not available — skipping Q7");
    console.log("");
    return { complexityViolations: null };
  }

  // Pouzivame stejny ESLint vystup jako Q5 — fixni config obsahuje
  // pravidlo `complexity: ["warn", 10]`
  const lintOutput = exec(`npx eslint 'src/**/*.ts' --format json`, {
    cwd,
  });

  try {
    const results = JSON.parse(lintOutput) as Array<{
      messages?: Array<{ ruleId?: string | null }>;
    }>;

    // Spocitame violations pravidla "complexity"
    let violations = 0;
    for (const file of results) {
      for (const msg of file.messages ?? []) {
        if (
          msg.ruleId &&
          msg.ruleId.toLowerCase().includes("complexity")
        ) {
          violations++;
        }
      }
    }

    console.log(`**Q7: Complexity violations (>10): ${violations}**`);
    console.log("");
    return { complexityViolations: violations };
  } catch {
    console.log("**Q7: Could not parse ESLint output**");
    console.log("");
    return { complexityViolations: null };
  }
}

// ============================================================================
// Agent's Own Tests (informacni — ne metrika)
//
// Spustime agentovy vlastni testy (npm test) pro informaci.
// Toto neni soucasti metricky ramce, ale pomaha pochopit co agent napsal.
// ============================================================================

function runAgentTests(cwd: string): void {
  printHeader("Agent's Own Tests (informational)");

  if (!fileExists(path.join(cwd, "package.json"))) {
    console.log("No package.json — skipping");
    console.log("");
    return;
  }

  const testOutput = exec(`npm test`, { cwd });
  // Vypiseme poslednich 10 radku
  const lines = testOutput.split("\n");
  const tail10 = lines.slice(-10).join("\n");
  console.log(tail10);
  console.log("");
}

// ============================================================================
// E1-E3: Efficiency
//
// Meri "za jakou cenu" agent dosahl vysledku:
// - E1: Tokeny (input/output) — kolok kontextu agent spotreboval
// - E2: Cas behu v minutach
// - E3: Zda agent dokoncil bez crashe + pocet restartu
//
// Data pochazi z transcript.json (OpenCode export format).
// ============================================================================

function measureEfficiency(cwd: string): {
  e1: E1Result;
  e2: E2Result;
  e3: E3Result;
} {
  printHeader("E1-E3: Efficiency");

  const transcriptPath = path.join(cwd, "transcript.json");
  const metricsPath = path.join(cwd, ".opencode", "metrics.csv");

  // Default hodnoty
  let e1: E1Result = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  };
  let e2: E2Result = { durationMinutes: 0 };
  let e3: E3Result = {
    completed: false,
    restartCount: 0,
    sessionId: "?",
  };

  if (fileExists(transcriptPath)) {
    try {
      const transcript = readJSON<{
        messages?: Array<{
          info?: {
            tokens?: { input?: number; output?: number };
          };
          parts?: Array<{
            type?: string;
            snapshot?: string;
            [key: string]: unknown;
          }>;
        }>;
        info?: {
          id?: string;
          time?: { created?: number; updated?: number };
        };
      }>(transcriptPath);

      if (transcript) {
        const messages = transcript.messages ?? [];
        const info = transcript.info ?? {};

        // E1: Spocitame celkove tokeny pres vsechny zpravy
        let totalIn = 0;
        let totalOut = 0;
        for (const msg of messages) {
          const tokens = msg.info?.tokens ?? {};
          totalIn += tokens.input ?? 0;
          totalOut += tokens.output ?? 0;
        }
        e1 = {
          inputTokens: totalIn,
          outputTokens: totalOut,
          totalTokens: totalIn + totalOut,
        };

        // E2: Delka behu (rozdil created - updated v milisekundach)
        const timeInfo = info.time ?? {};
        const created = timeInfo.created ?? 0;
        const updated = timeInfo.updated ?? 0;
        const durationMin =
          created && updated ? (updated - created) / 60000 : 0;
        e2 = { durationMinutes: Math.round(durationMin * 10) / 10 };

        // E3: Detekce crashe — pokud posledni zprava ma 0 tokenu, agent crashnul
        const lastMsg = messages[messages.length - 1];
        const lastTokens = lastMsg?.info?.tokens ?? {};
        const crashed =
          (lastTokens.input ?? 1) === 0 &&
          (lastTokens.output ?? 1) === 0;

        // E3: Compaction eventy — detekce pres zmenu snapshot hodnoty
        // Kdyz se snapshot zmeni mezi step-finish a naslednym step-start,
        // znamena to ze OpenCode provedl compaction (sumarizaci kontextu).
        let compactionCount = 0;
        let prevStepFinishSnapshot: string | undefined;
        for (const msg of messages) {
          for (const part of msg.parts ?? []) {
            if (!part || typeof part !== "object") continue;
            if (part.type === "step-finish" && part.snapshot) {
              prevStepFinishSnapshot = part.snapshot;
            } else if (part.type === "step-start" && part.snapshot) {
              if (
                prevStepFinishSnapshot !== undefined &&
                part.snapshot !== prevStepFinishSnapshot
              ) {
                compactionCount++;
              }
              prevStepFinishSnapshot = undefined;
            }
          }
        }

        e3 = {
          completed: !crashed,
          restartCount: 0,
          sessionId: info.id ?? "?",
          compactionCount,
        };

        console.log(
          `E1 Tokens — input: ${formatNumber(totalIn)}, output: ${formatNumber(totalOut)}, total: ${formatNumber(totalIn + totalOut)}`
        );
        console.log(`E2 Duration — ${durationMin.toFixed(1)} min`);
        console.log(
          `E3 Completion — ${crashed ? "CRASHED" : "Completed"}, ${compactionCount} compaction${compactionCount !== 1 ? "s" : ""}`
        );
        console.log(`   Session: ${info.id ?? "?"}`);
      }
    } catch {
      console.log("Could not parse transcript.json");
    }
  } else if (fileExists(metricsPath)) {
    console.log("No transcript.json, checking metrics.csv...");
    const metricsContent = readFile(metricsPath);
    const lastLine = metricsContent.split("\n").filter(Boolean).pop();
    if (lastLine) console.log(lastLine);
  } else {
    console.log("No transcript.json or metrics.csv found");
  }

  // Pocet restartu z auto-continue pluginu
  if (fileExists(metricsPath)) {
    const metricsContent = readFile(metricsPath);
    const lineCount = metricsContent.split("\n").filter(Boolean).length;
    e3.restartCount = lineCount;
    console.log(`   Restarts (auto-continue): ${lineCount}`);
  }
  console.log("");

  return { e1, e2, e3 };
}

// ============================================================================
// Behavioral Trace — deterministicka extrakce faktu ze sekvence prikazu
//
// Neni to metrika (zadny prah) — je to vstup pro DIAGNOSIS krok.
// Rika "jak se to stalo": poradi akci, pocty, heuristiky.
//
// Zdroj dat: transcript.json (OpenCode export format).
// Struktura: { info, messages[] }, kazda message ma { info, parts[] },
// party s type=="tool" maji tool (nazev) a state.input.command (pro bash).
// ============================================================================

function measureBehavioralTrace(cwd: string): BehavioralTrace {
  printHeader("Behavioral Trace");

  const transcriptPath = path.join(cwd, "transcript.json");

  if (!fileExists(transcriptPath)) {
    const note = "transcript.json not found — trace unavailable";
    console.log(note);
    console.log("");
    return {
      issuesBatchCreated: null,
      firstTestCommitBeforeImpl: null,
      commitCount: 0,
      branchCount: 0,
      issueCount: 0,
      prCount: 0,
      todowriteUsed: false,
      blobCommit: null,
      tddOrderViolations: 0,
      note,
    };
  }

  type TranscriptPart = {
    type?: string;
    tool?: string;
    state?: {
      input?: {
        command?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  type TranscriptMessage = {
    info?: unknown;
    parts?: TranscriptPart[];
  };

  type Transcript = {
    info?: unknown;
    messages?: TranscriptMessage[];
  };

  let transcript: Transcript | null = null;
  try {
    transcript = readJSON<Transcript>(transcriptPath);
  } catch {
    const note = "Could not parse transcript.json";
    console.log(note);
    console.log("");
    return {
      issuesBatchCreated: null,
      firstTestCommitBeforeImpl: null,
      commitCount: 0,
      branchCount: 0,
      issueCount: 0,
      prCount: 0,
      todowriteUsed: false,
      blobCommit: null,
      tddOrderViolations: 0,
      note,
    };
  }

  if (!transcript) {
    const note = "transcript.json is null";
    console.log(note);
    console.log("");
    return {
      issuesBatchCreated: null,
      firstTestCommitBeforeImpl: null,
      commitCount: 0,
      branchCount: 0,
      issueCount: 0,
      prCount: 0,
      todowriteUsed: false,
      blobCommit: null,
      tddOrderViolations: 0,
      note,
    };
  }

  const messages = transcript.messages ?? [];

  // Projdeme vsechny party a extrahujeme relevatni prikazy v poradi vyskytu
  type EventKind = "issue" | "commit" | "branch" | "pr";
  const events: Array<{ kind: EventKind; cmd: string }> = [];
  let todowriteUsed = false;
  let commitCount = 0;
  let branchCount = 0;
  let issueCount = 0;
  let prCount = 0;

  for (const msg of messages) {
    for (const part of msg.parts ?? []) {
      if (part.type !== "tool") continue;
      const tool = part.tool ?? "";
      const cmd = part.state?.input?.command ?? "";

      if (tool === "todowrite") {
        todowriteUsed = true;
        continue;
      }

      if (tool !== "bash" || !cmd) continue;

      if (cmd.includes("git commit") && !cmd.includes("--amend")) {
        commitCount++;
        events.push({ kind: "commit", cmd });
      }
      if (cmd.includes("git checkout -b")) {
        branchCount++;
        events.push({ kind: "branch", cmd });
      }
      if (cmd.includes("gh issue create")) {
        issueCount++;
        events.push({ kind: "issue", cmd });
      }
      if (cmd.includes("gh pr create")) {
        prCount++;
        events.push({ kind: "pr", cmd });
      }
    }
  }

  // --- issuesBatchCreated ---
  // Vsechny issues vytvoreny pred prvnim git commitem?
  let issuesBatchCreated: boolean | null = null;
  if (issueCount > 0 && commitCount > 0) {
    const firstCommitIdx = events.findIndex((e) => e.kind === "commit");
    const lastIssueBeforeFirstCommit = events
      .slice(0, firstCommitIdx)
      .filter((e) => e.kind === "issue").length;
    issuesBatchCreated = lastIssueBeforeFirstCommit === issueCount;
  }

  // --- firstTestCommitBeforeImpl ---
  // Byl alespon jeden commit s test soubory pred commitem s implementacnimi soubory?
  // Heuristika: hledame v poradi commitu — je "test" commit (grep git show) pred "feat/impl" commitem?
  // Zjednodusena verze: hledame commit message obsahujici "test:" pred "feat:" nebo "impl:".
  let firstTestCommitBeforeImpl: boolean | null = null;
  const commitEvents = events.filter((e) => e.kind === "commit");
  if (commitEvents.length >= 2) {
    let firstTestIdx = -1;
    let firstImplIdx = -1;
    for (let i = 0; i < commitEvents.length; i++) {
      const msg = commitEvents[i].cmd.toLowerCase();
      if (firstTestIdx === -1 && (msg.includes("test:") || msg.includes("tests:"))) {
        firstTestIdx = i;
      }
      if (
        firstImplIdx === -1 &&
        (msg.includes("feat:") ||
          msg.includes("fix:") ||
          msg.includes("impl:") ||
          msg.includes("chore:"))
      ) {
        firstImplIdx = i;
      }
    }
    if (firstTestIdx !== -1 && firstImplIdx !== -1) {
      firstTestCommitBeforeImpl = firstTestIdx < firstImplIdx;
    } else if (firstTestIdx !== -1 && firstImplIdx === -1) {
      // Pouze test commity — interpretujeme jako splneno
      firstTestCommitBeforeImpl = true;
    } else {
      firstTestCommitBeforeImpl = false;
    }
  }

  // --- blobCommit ---
  // Heuristika: <3 commitu celkem a agent ma >5 souboru souctu v src/tests?
  // Jednoduchy check: pokud commitCount < 3, oznacime jako blob (podezreni).
  // Presnejsi by bylo pocitat soubory per commit (git show --stat), ale to je drahe.
  let blobCommit: boolean | null = null;
  if (commitCount > 0) {
    // Spocitame celkovy pocet souboru ve vsech commitech
    const totalFilesChanged = exec(
      `git log --all --name-only --format="" | grep -v '^$' | sort -u | wc -l`,
      { cwd }
    );
    const fileCount = parseInt(totalFilesChanged, 10) || 0;
    blobCommit = commitCount < 3 && fileCount > 5;
  }

  // --- tddOrderViolations ---
  // Pocet vetvi kde agent psal src/ soubory pred tests/ soubory.
  // Algoritmus:
  // 1. Extrahuj vsechny "git checkout -b" prikazy (branches) a jejich sekvenci
  // 2. Pro kazdou branch najdi prvni Write/Edit akci na src/ a tests/
  // 3. Pokud prvni Write/Edit na src/ prislo pred prvnim Write/Edit na tests/, je to violation
  // 4. Ignoruj branch "main" a merge commity
  let tddOrderViolations = 0;

  type BranchInfo = {
    branchName: string;
    firstSrcEventOrder: number;  // poradí events kdy se naposledy menit branch (nižší = dřívěji)
    firstTestEventOrder: number; // poradí events kdy se naposledy menit branch (nižší = dřívěji)
  };

  const branchMap = new Map<string, BranchInfo>();
  let currentBranchName = "main";
  let currentEventOrder = 0;

  // Projdeme messages a sledujeme soubory per branch
  for (const msg of messages) {
    for (const part of msg.parts ?? []) {
      if (part.type !== "tool") continue;
      const tool = part.tool ?? "";
      const cmd = part.state?.input?.command ?? "";

      // Detekujeme zmenu branche
      if (tool === "bash" && cmd.includes("git checkout -b")) {
        // Extrakt branch jmena: `git checkout -b feature/xyz`
        const match = cmd.match(/git checkout -b\s+(\S+)/);
        currentBranchName = match ? match[1] : `branch-${currentEventOrder}`;
        if (!branchMap.has(currentBranchName)) {
          branchMap.set(currentBranchName, {
            branchName: currentBranchName,
            firstSrcEventOrder: Infinity,
            firstTestEventOrder: Infinity,
          });
        }
        currentEventOrder++;
        continue;
      }

      // Detekujeme Write/Edit prikazy
      if (tool === "write" || tool === "edit") {
        currentEventOrder++;
        const filePath = String(part.state?.input?.file_path ?? part.state?.input?.filePath ?? "");
        const isInSrc = /src\//.test(filePath);
        const isInTest = /tests\/|__tests__|\.test\.ts/.test(filePath);

        // Inicializuj branch pokud ji nema
        if (!branchMap.has(currentBranchName)) {
          branchMap.set(currentBranchName, {
            branchName: currentBranchName,
            firstSrcEventOrder: Infinity,
            firstTestEventOrder: Infinity,
          });
        }

        const branch = branchMap.get(currentBranchName)!;
        if (isInSrc && branch.firstSrcEventOrder === Infinity) {
          branch.firstSrcEventOrder = currentEventOrder;
        }
        if (isInTest && branch.firstTestEventOrder === Infinity) {
          branch.firstTestEventOrder = currentEventOrder;
        }
      }
    }
  }

  // Pocitaj violations: vetvi kde src/ prislo pred tests/
  for (const branch of branchMap.values()) {
    // Ignoruj main a merge branche
    if (branch.branchName === "main" || branch.branchName.includes("merge")) {
      continue;
    }
    // Je to violation pokud:
    // - src soubor existuje a tests neexistuje
    // - nebo src soubor je prvni a tests je druhy
    if (branch.firstSrcEventOrder !== Infinity) {
      if (branch.firstTestEventOrder === Infinity) {
        // Jsou pouze src soubory, zadne tests — je to violation
        tddOrderViolations++;
      } else if (branch.firstSrcEventOrder < branch.firstTestEventOrder) {
        // src prislo driv — je to violation
        tddOrderViolations++;
      }
    }
  }

  // Vypis
  console.log(`issuesBatchCreated:       ${issuesBatchCreated ?? "null"}`);
  console.log(`firstTestCommitBeforeImpl:${firstTestCommitBeforeImpl ?? "null"}`);
  console.log(`commitCount:              ${commitCount}`);
  console.log(`branchCount:              ${branchCount}`);
  console.log(`issueCount:               ${issueCount}`);
  console.log(`prCount:                  ${prCount}`);
  console.log(`todowriteUsed:            ${todowriteUsed}`);
  console.log(`blobCommit:               ${blobCommit ?? "null"}`);
  console.log(`tddOrderViolations:       ${tddOrderViolations}`);
  console.log("");

  return {
    issuesBatchCreated,
    firstTestCommitBeforeImpl,
    commitCount,
    branchCount,
    issueCount,
    prCount,
    todowriteUsed,
    blobCommit,
    tddOrderViolations,
  };
}

// ============================================================================
// Judge Result Loader — cte vysledky z JSON souboru ulozenych judge.ts
// ============================================================================

/**
 * Nacte vysledek judge metriky z JSON souboru v runDir.
 *
 * Podporovane formaty:
 * - P6/P7/P8: {"metric":"P6","score":2,"rationale":"..."}
 * - Q4:       {"covered":[...],"not_covered":[...],"score":"24/24"}
 * - Q8:       {"naming":{"score":3},...,"overall":1}
 *
 * @param runDir - Adresar runu
 * @param metric - Nazev metriky (napr. "p6", "q4", "q8")
 * @returns Objekt se score a volitelne rationale, nebo null pokud soubor neexistuje
 */
function loadJudgeResult(
  runDir: string,
  metric: string
): { score: number | string; rationale?: string } | null {
  const filePath = path.join(runDir, `${metric.toLowerCase()}-result.json`);
  if (!fileExists(filePath)) return null;

  try {
    const raw = readJSON<Record<string, unknown>>(filePath);
    if (!raw) return null;

    // Q8 format: {"naming":{"score":N},...,"overall":N}
    if ("overall" in raw) {
      return { score: raw.overall as number };
    }

    // Q4 format: {"score":"24/24","covered":[...],...}
    if ("covered" in raw && "score" in raw) {
      return { score: raw.score as string };
    }

    // P6/P7/P8 format: {"metric":"P6","score":N,"rationale":"..."}
    if ("score" in raw) {
      const rationale =
        typeof raw.rationale === "string"
          ? raw.rationale.slice(0, 100) + (raw.rationale.length > 100 ? "..." : "")
          : undefined;
      return { score: raw.score as number, rationale };
    }

    return null;
  } catch {
    return null;
  }
}

// ============================================================================
// Summary — souhrnna tabulka
//
// Format identicky s bash verzi pro snadne porovnani.
// ============================================================================

function printSummary(
  runName: string,
  runDir: string,
  p1: P1Result,
  p2: P2Result,
  p3: P3Result,
  p4: P4Result,
  p5: P5Result,
  q1: Q1Result,
  q2: Q2Result,
  q3: Q3Result,
  q5: Q5Result,
  q6: Q6Result,
  q7: Q7Result,
  _e1: E1Result,
  _e2: E2Result,
  _e3: E3Result,
  trace: BehavioralTrace
): void {
  console.log("==========================================");
  console.log(`=== Summary: ${runName} ===`);
  console.log("==========================================");
  console.log("");

  // Process — P1-P5 individualne, P6-P8 pres judge.ts
  console.log("### Process (P1-P8)");
  console.log("| Metrika | Hodnota | Exit kritérium | Pass? |");
  console.log("|---------|---------|----------------|-------|");
  console.log(`| P1 Issues before code | ${p1.detail} | issues pred kodem | ${passIcon(p1.pass)} |`);
  console.log(`| P2 Branch per issue | ${p2.detail} | branches>=issues | ${passIcon(p2.pass)} |`);
  console.log(`| P3 Test-first commits | ${p3.detail} | test: pred feat: | ${passIcon(p3.pass)} |`);
  console.log(`| P4 PRs linked to issues | ${p4.detail} | vsechny PR linked | ${passIcon(p4.pass)} |`);
  console.log(`| P5 No existing test modifications | ${p5.detail || "ok"} | 0 modifikaci | ${passIcon(p5.pass)} |`);

  // P6/P7/P8 — nacti z judge JSON pokud existuje
  for (const metric of ["p6", "p7", "p8"] as const) {
    const labels: Record<string, string> = {
      p6: "Commit message quality",
      p7: "Issue description quality",
      p8: "PR description quality",
    };
    const judgeResult = loadJudgeResult(runDir, metric);
    if (judgeResult) {
      const scoreStr = `${judgeResult.score}/3`;
      const pass = typeof judgeResult.score === "number" && judgeResult.score >= 2;
      const rationaleStr = judgeResult.rationale ? ` — ${judgeResult.rationale}` : "";
      console.log(
        `| ${metric.toUpperCase()} ${labels[metric]} | ${scoreStr}${rationaleStr} | ≥2/3 | ${passIcon(pass)} |`
      );
    } else {
      console.log(
        `| ${metric.toUpperCase()} ${labels[metric]} | judge | ≥2/3 | run judge.ts |`
      );
    }
  }
  console.log("");

  // Product Quality table
  console.log("### Product Quality (Q1-Q8)");
  console.log("| Metric | Value | Exit criterion | Pass? |");
  console.log("|--------|-------|----------------|-------|");

  // Q1
  const q1Label = q1.match ? "match" : "no match";
  console.log(
    `| Q1 API contract | ${q1Label} | match | ${passIcon(q1.match)} |`
  );

  // Q2
  const q2Pass = q2.passed === q2.total && q2.total > 0;
  console.log(
    `| Q2 Ref tests | ${q2.passed}/${q2.total} | ${q2.total}/${q2.total} | ${passIcon(q2Pass)} |`
  );

  // Q3
  const q3Value =
    q3.score !== null ? `${q3.score}%` : "?";
  const q3Pass = q3.score !== null && q3.score >= 70;
  console.log(
    `| Q3 Mutation score | ${q3Value} | \u226570% | ${passIcon(q3Pass)} |`
  );

  // Q4 (judge) — nacti z JSON pokud existuje
  {
    const q4Result = loadJudgeResult(runDir, "q4");
    if (q4Result) {
      const pass = q4Result.score === "24/24";
      console.log(
        `| Q4 AC coverage | ${q4Result.score} | 24/24 | ${passIcon(pass)} |`
      );
    } else {
      console.log("| Q4 AC coverage | judge | 24/24 | run judge.ts |");
    }
  }

  // Q5
  const q5Value = q5.warnings !== null ? String(q5.warnings) : "?";
  const q5Pass = q5.warnings === 0;
  console.log(
    `| Q5 Lint warnings | ${q5Value} | 0 | ${passIcon(q5Pass)} |`
  );

  // Q6
  const q6Pass = q6.tscErrors === 0;
  console.log(
    `| Q6 Typecheck errors | ${q6.tscErrors} | 0 | ${passIcon(q6Pass)} |`
  );

  // Q7
  const q7Value =
    q7.complexityViolations !== null
      ? String(q7.complexityViolations)
      : "?";
  const q7Pass = q7.complexityViolations === 0;
  console.log(
    `| Q7 Complexity (>10) | ${q7Value} | 0 violations | ${passIcon(q7Pass)} |`
  );

  // Q8 (judge) — nacti z JSON pokud existuje
  {
    const q8Result = loadJudgeResult(runDir, "q8");
    if (q8Result) {
      const pass = typeof q8Result.score === "number" && q8Result.score >= 2;
      console.log(
        `| Q8 Code quality | ${q8Result.score}/3 | ≥2/3 | ${passIcon(pass)} |`
      );
    } else {
      console.log("| Q8 Code quality | judge | \u22652/3 | run judge.ts |");
    }
  }

  console.log("");

  // Efficiency
  console.log("### Efficiency (E1-E3)");
  console.log("(see above)");
  console.log("");


  // Behavioral Trace sekce pro FINDINGS.md
  console.log("### Behavioral Trace");
  console.log("| Fact | Value |");
  console.log("|------|-------|");
  console.log(`| issuesBatchCreated | ${trace.issuesBatchCreated ?? "null"} |`);
  console.log(`| firstTestCommitBeforeImpl | ${trace.firstTestCommitBeforeImpl ?? "null"} |`);
  console.log(`| commitCount | ${trace.commitCount} |`);
  console.log(`| branchCount | ${trace.branchCount} |`);
  console.log(`| issueCount | ${trace.issueCount} |`);
  console.log(`| prCount | ${trace.prCount} |`);
  console.log(`| todowriteUsed | ${trace.todowriteUsed} |`);
  console.log(`| blobCommit | ${trace.blobCommit ?? "null"} |`);
  console.log(`| tddOrderViolations | ${trace.tddOrderViolations} |`);
  if (trace.note) {
    console.log("");
    console.log(`_Note: ${trace.note}_`);
  }
}

// ============================================================================
// Spusteni
// ============================================================================

// Spustime main() jen pokud je skript spusten primo (ne importovan z testu).
// V ESM: porovname import.meta.url s process.argv[1] resolveovanym na file URL.
const isDirectRun =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === `file://${path.resolve(process.argv[1] ?? "")}`;
if (isDirectRun) {
  main();
}
