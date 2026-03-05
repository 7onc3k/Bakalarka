/**
 * summary.ts — Cross-run souhrnna tabulka vsech pilot runu.
 *
 * Agreguje metriky P1-P8, Q1-Q8, E1-E3 ze vsech pilot-rN adresaru
 * a vypisuje srovnavaci tabulku ve formatu Markdown.
 *
 * Spousteni: npx tsx summary.ts
 * Vystup: stdout + experiments/runs/SUMMARY.md
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { RUNS_DIR, readFile } from "./shared.js";

// ============================================================================
// Typy
// ============================================================================

interface RunData {
  name: string;
  // P1-P5 binarni
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  // P6-P8 judge (score/3)
  p6: string;
  p7: string;
  p8: string;
  // Q metriky
  q1: string; // "34/45"
  q2: string; // "match" | "no match"
  q3: string; // "84.02%"
  q4: string; // "24/24"
  q5: string; // "2 warn"
  q6: string; // "0 err"
  q7: string; // "2 viol" | "0"
  q8: string; // "1/3 overall"
  // E metriky
  e1: string; // "143k"
  e2: string; // "33 min"
  e3: string; // "ano" | "ne"
}

// ============================================================================
// Parser FINDINGS.md
// ============================================================================

function parseFindingsP1to5(content: string): {
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
} {
  const result = { p1: "?", p2: "?", p3: "?", p4: "?", p5: "?" };

  const matchP = (line: string): string => {
    if (/✅/.test(line)) return "✅";
    if (/❌/.test(line)) return "❌";
    return "?";
  };

  for (const line of content.split("\n")) {
    if (/^P1 Issues before code/.test(line)) result.p1 = matchP(line);
    else if (/^P2 Branch per issue/.test(line)) result.p2 = matchP(line);
    else if (/^P3 Test-first commits/.test(line)) result.p3 = matchP(line);
    else if (/^P4 PRs linked/.test(line)) result.p4 = matchP(line);
    else if (/^P5 No ref test/.test(line)) result.p5 = matchP(line);
  }

  return result;
}

function parseFindingsQ(content: string): {
  q1: string;
  q2: string;
  q3: string;
  q5: string;
  q6: string;
  q7: string;
  e1: string;
  e2: string;
  e3: string;
} {
  const result = {
    q1: "?",
    q2: "?",
    q3: "?",
    q5: "?",
    q6: "?",
    q7: "?",
    e1: "?",
    e2: "?",
    e3: "?",
  };

  for (const line of content.split("\n")) {
    // Q1: **Q1: ❌ 27/45 reference tests pass** nebo **Q1: ✅ ...**
    const q1m = line.match(/\*\*Q1:.*?(\d+\/\d+) reference tests pass\*\*/);
    if (q1m) result.q1 = q1m[1];

    // Q2: **Q2: ✅ Exports ...**
    if (/\*\*Q2: ✅/.test(line)) result.q2 = "match";
    else if (/\*\*Q2: ❌/.test(line)) result.q2 = "no match";

    // Q3: **Q3: Mutation score: 84.02%**
    const q3m = line.match(/\*\*Q3: Mutation score:\s*([\d.]+)%\*\*/);
    if (q3m) result.q3 = `${q3m[1]}%`;

    // Q5: **Q5: Warnings: 2, Errors: 0**
    const q5m = line.match(/\*\*Q5: Warnings:\s*(\d+)/);
    if (q5m) result.q5 = `${q5m[1]} warn`;

    // Q6: **Q6: Typecheck errors: 0, ...**
    const q6m = line.match(/\*\*Q6: Typecheck errors:\s*(\d+)/);
    if (q6m) result.q6 = `${q6m[1]} err`;

    // Q7: **Q7: Complexity violations (>10): 2**
    const q7m = line.match(/\*\*Q7: Complexity violations.*?:\s*(\d+)\*\*/);
    if (q7m)
      result.q7 = q7m[1] === "0" ? "0" : `${q7m[1]} viol`;

    // E1: E1 Tokens — input: 83,036, output: 60,240, total: 143,276
    const e1m = line.match(/E1 Tokens.*total:\s*([\d,]+)/);
    if (e1m) {
      const total = parseInt(e1m[1].replace(/,/g, ""), 10);
      result.e1 = total >= 1000 ? `${Math.round(total / 1000)}k` : String(total);
    }

    // E2: E2 Duration — 37.2 min
    const e2m = line.match(/E2 Duration.*?([\d.]+)\s*min/);
    if (e2m) result.e2 = `${e2m[1]} min`;

    // E3: E3 Completion — Completed
    if (/E3 Completion.*Completed/.test(line)) result.e3 = "ano";
    else if (/E3 Completion.*/.test(line) && /E3 Completion/.test(line))
      result.e3 = "ne";
  }

  return result;
}

// ============================================================================
// Parser JSON judge souboru
// ============================================================================

interface PJudgeJSON {
  metric?: string;
  score?: number;
  error?: string;
}

interface Q4JSON {
  score?: string;
  error?: string;
}

interface Q8JSON {
  overall?: number;
  naming?: { score: number };
  error?: string;
}

function parsePJudge(filePath: string): string {
  const raw = readFile(filePath);
  if (!raw) return "?";

  // Soubor muze obsahovat JSON v code fences (```json ... ```)
  const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) ?? [null, raw];
  const jsonStr = jsonMatch[1]?.trim() ?? raw.trim();

  try {
    const obj = JSON.parse(jsonStr) as PJudgeJSON;
    if (obj.error) return "?";
    if (obj.score !== undefined) return `${obj.score}/3`;
  } catch {
    // fallback: hledame "score": N
    const m = raw.match(/"score"\s*:\s*(\d)/);
    if (m) return `${m[1]}/3`;
  }
  return "?";
}

function parseQ4(filePath: string): string {
  const raw = readFile(filePath);
  if (!raw) return "?";

  const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) ?? [null, raw];
  const jsonStr = jsonMatch[1]?.trim() ?? raw.trim();

  try {
    const obj = JSON.parse(jsonStr) as Q4JSON;
    if (obj.error) return "?";
    if (obj.score) return obj.score;
  } catch {
    const m = raw.match(/"score"\s*:\s*"(\d+\/\d+)"/);
    if (m) return m[1];
  }
  return "?";
}

function parseQ8(filePath: string): string {
  const raw = readFile(filePath);
  if (!raw) return "?";

  const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) ?? [null, raw];
  const jsonStr = jsonMatch[1]?.trim() ?? raw.trim();

  try {
    const obj = JSON.parse(jsonStr) as Q8JSON;
    if (obj.error) return "?";
    if (obj.overall !== undefined) return `${obj.overall}/3`;
  } catch {
    const m = raw.match(/"overall"\s*:\s*(\d)/);
    if (m) return `${m[1]}/3`;
  }
  return "?";
}

// ============================================================================
// Nacteni dat pro jeden run
// ============================================================================

function loadRun(runDir: string, runName: string): RunData {
  const findingsPath = path.join(runDir, "FINDINGS.md");
  const findings = readFile(findingsPath);

  const p15 = parseFindingsP1to5(findings);
  const qe = parseFindingsQ(findings);

  const p6 = parsePJudge(path.join(runDir, "p6-result.json"));
  const p7 = parsePJudge(path.join(runDir, "p7-result.json"));
  const p8 = parsePJudge(path.join(runDir, "p8-result.json"));
  const q4 = parseQ4(path.join(runDir, "q4-result.json"));
  const q8 = parseQ8(path.join(runDir, "q8-result.json"));

  return {
    name: runName,
    ...p15,
    p6,
    p7,
    p8,
    q1: qe.q1,
    q2: qe.q2,
    q3: qe.q3,
    q4,
    q5: qe.q5,
    q6: qe.q6,
    q7: qe.q7,
    q8,
    e1: qe.e1,
    e2: qe.e2,
    e3: qe.e3,
  };
}

// ============================================================================
// Vyhledani vsech pilot runu
// ============================================================================

function findPilotRuns(): Array<{ name: string; dir: string }> {
  const runs: Array<{ name: string; dir: string }> = [];
  const pilotPattern = /^pilot-r(\d+)$/;

  // Aktivni runy (preferovane — maji aktualni FINDINGS.md)
  const activeNames = new Set<string>();
  for (const entry of fs.readdirSync(RUNS_DIR)) {
    if (pilotPattern.test(entry)) {
      activeNames.add(entry);
      runs.push({ name: entry, dir: path.join(RUNS_DIR, entry) });
    }
  }

  // Archivovane runy — pridat jen pokud neni aktivni verze
  const archiveDir = path.join(RUNS_DIR, "archive");
  if (fs.existsSync(archiveDir)) {
    for (const entry of fs.readdirSync(archiveDir)) {
      if (pilotPattern.test(entry) && !activeNames.has(entry)) {
        runs.push({ name: entry, dir: path.join(archiveDir, entry) });
      }
    }
  }

  // Seradit podle cisla N v pilot-rN
  runs.sort((a, b) => {
    const na = parseInt(a.name.replace("pilot-r", ""), 10);
    const nb = parseInt(b.name.replace("pilot-r", ""), 10);
    return na - nb;
  });

  return runs;
}

// ============================================================================
// Generovani Markdown tabulky
// ============================================================================

function buildTable(runs: RunData[]): string {
  if (runs.length === 0) {
    return "_Zadne runy nenalezeny._\n";
  }

  // Zkratky pro nazvy sloupcu (r1, r2, ...)
  const headers = runs.map((r) => r.name.replace("pilot-", ""));

  const separator = (n: number) => "|" + Array(n).fill("---").join("|") + "|";

  const row = (label: string, values: string[]): string =>
    `| ${label} | ${values.join(" | ")} |`;

  const lines: string[] = [];

  // Header
  lines.push(`| Metrika | ${headers.join(" | ")} |`);
  lines.push(separator(1 + headers.length));

  // P1-P5
  lines.push(row("P1 issues before code", runs.map((r) => r.p1)));
  lines.push(row("P2 branch/issue", runs.map((r) => r.p2)));
  lines.push(row("P3 test-first", runs.map((r) => r.p3)));
  lines.push(row("P4 PRs linked", runs.map((r) => r.p4)));
  lines.push(row("P5 ref testy", runs.map((r) => r.p5)));
  // P6-P8 judge
  lines.push(row("P6 commit msg (judge)", runs.map((r) => r.p6)));
  lines.push(row("P7 issue quality (judge)", runs.map((r) => r.p7)));
  lines.push(row("P8 PR quality (judge)", runs.map((r) => r.p8)));
  // Q metriky
  lines.push(row("Q1 API contract", runs.map((r) => r.q2)));
  lines.push(row("Q2 ref tests", runs.map((r) => r.q1)));
  lines.push(row("Q3 mutation score", runs.map((r) => r.q3)));
  lines.push(row("Q4 AC coverage (judge)", runs.map((r) => r.q4)));
  lines.push(row("Q5 lint warnings", runs.map((r) => r.q5)));
  lines.push(row("Q6 typecheck errors", runs.map((r) => r.q6)));
  lines.push(row("Q7 slozitost", runs.map((r) => r.q7)));
  lines.push(row("Q8 design quality (judge)", runs.map((r) => r.q8)));
  // E metriky
  lines.push(row("E1 tokeny", runs.map((r) => r.e1)));
  lines.push(row("E2 trvani", runs.map((r) => r.e2)));
  lines.push(row("E3 dokonceni", runs.map((r) => r.e3)));

  return lines.join("\n");
}

// ============================================================================
// Main
// ============================================================================

function main(): void {
  const foundRuns = findPilotRuns();

  if (foundRuns.length === 0) {
    console.log("Zadne pilot runy nenalezeny v", RUNS_DIR);
    process.exit(1);
  }

  console.log(`Nalezeno ${foundRuns.length} run(u): ${foundRuns.map((r) => r.name).join(", ")}`);

  const runData = foundRuns.map(({ name, dir }) => {
    console.log(`  Nacitam: ${name}`);
    return loadRun(dir, name);
  });

  const table = buildTable(runData);
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

  const output = [
    "=== Cross-run summary ===",
    "",
    `Generovano: ${timestamp}`,
    `Runy: ${foundRuns.map((r) => r.name).join(", ")}`,
    "",
    table,
    "",
  ].join("\n");

  // Stdout
  console.log("");
  console.log(output);

  // Zapis do SUMMARY.md
  const summaryPath = path.join(RUNS_DIR, "SUMMARY.md");
  const mdContent = [
    "# Cross-run summary",
    "",
    `> Generovano: ${timestamp}`,
    `> Runy: ${foundRuns.map((r) => r.name).join(", ")}`,
    "",
    table,
    "",
  ].join("\n");

  fs.writeFileSync(summaryPath, mdContent, "utf-8");
  console.log(`Ulozeno: ${summaryPath}`);
}

main();
