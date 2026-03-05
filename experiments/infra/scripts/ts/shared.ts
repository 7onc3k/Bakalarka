/**
 * shared.ts — Sdilene typy, utility a konstanty pro experimentalni infrastrukturu.
 *
 * Tento soubor obsahuje:
 * - Typove definice pro vsechny metriky (P1-P8, Q1-Q7, E1-E3, judge vysledky)
 * - Utility pro spousteni shell prikazu a praci se soubory
 * - Resolving adresar runu (runs/<name> nebo runs/archive/<name>)
 *
 * POZNAMKA: Nema zadne externi zavislosti — pouziva pouze Node.js built-ins.
 * Spousti se pres `npx tsx`.
 */

import { execSync, type ExecSyncOptions } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

// ============================================================================
// Konstanty experimentu
// ============================================================================

/** GitHub organizace kde se vytvareji repozitare pro runy */
export const GITHUB_ORG = "7onc3k";

/** Model pouzivany agentem (minimax, zdarma) */
export const AGENT_MODEL = "opencode/minimax-m2.5-free";

/** Model pouzivany jako LLM-as-judge (GLM-5 — jina rodina nez generator,
 *  aby se eliminoval self-preference bias, viz Panickssery 2024) */
export const JUDGE_MODEL = "zai-coding-plan/glm-5";

// ============================================================================
// Cesty v adresarove strukture
// ============================================================================

/**
 * Resolvuje klicove adresar relativne ke skriptu.
 * Struktura:
 *   experiments/
 *     infra/
 *       scripts/ts/   <-- ZDE jsme
 *       judge/         <-- rubrics pro LLM-as-judge
 *       eslint-fixed.config.mjs
 *     runs/            <-- aktivni runy
 *     runs/archive/    <-- dokoncene runy
 *     reference/       <-- referencni implementace (baseline)
 */
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
export const INFRA_DIR = path.resolve(SCRIPT_DIR, "../..");
export const EXPERIMENTS_DIR = path.resolve(INFRA_DIR, "..");
export const JUDGE_DIR = path.join(INFRA_DIR, "judge");
export const RUNS_DIR = path.join(EXPERIMENTS_DIR, "runs");
export const REFERENCE_DIR = path.join(EXPERIMENTS_DIR, "reference");

// ============================================================================
// Typove definice pro metriky
//
// Kazda metrika ma vlastni interface, aby bylo jasne co se meri a jaky
// je format vysledku. Metricky ramec je definovan v kap03 BP.
// ============================================================================

// --- P1-P5: Process Compliance (binarni checklist) ---
// Kazda z 5 binarnich metrik je samostatny vysledek merici zda agent dodrzuje
// spec-driven development proces (issues pred kodem, TDD, PR workflow...).

export interface PComplianceResult {
  /** Identifikator metriky (napr. "P1", "P2", ...) */
  id: string;
  /** Popis co se meri (napr. "Issues before code") */
  label: string;
  /** Vysledek: true = splneno, false = nesplneno, null = nelze urcit */
  pass: boolean | null;
  /** Detailni informace pro vypis (napr. "issue: 2026-02-20, code: 2026-02-20") */
  detail: string;
}

// P1Result az P5Result jsou aliasy na PComplianceResult pro srozumitelnost kodu.
export type P1Result = PComplianceResult;
export type P2Result = PComplianceResult;
export type P3Result = PComplianceResult;
export type P4Result = PComplianceResult;
export type P5Result = PComplianceResult;

// --- P6-P8: Process Artifact Quality (LLM-as-judge, skala 1-3) ---
// Kazda z dimenzionalniho hodnoceni (commit messages, issues, PRs)
// je samostatna metrika se skore 1-3.

export interface PJudgeResult {
  /** Identifikator metriky (napr. "P6", "P7", "P8") */
  metric: string;
  /** Skore 1-3 (1=inadequate, 2=acceptable, 3=good) */
  score: number;
  /** Zduvodneni od LLM-as-judge */
  rationale: string;
}

// Zpetna kompatibilita — P1Item byl puvodni nazev pro polozky checklistu
// @deprecated Pouzij PComplianceResult
export type P1Item = PComplianceResult;

// --- Q metriky: Product Quality ---

export interface Q1Result {
  /** Pocet projitych referencnich testu */
  passed: number;
  /** Celkovy pocet referencnich testu */
  total: number;
  /** Textovy vystup z vitest (posledních 15 radku) */
  output: string;
}

export interface Q2Result {
  /** Zda src/index.ts exportuje createInstance */
  hasCreateInstance: boolean;
  /** Zda src/index.ts exportuje process */
  hasProcess: boolean;
  /** Celkove: obe funkce exportovany = match */
  match: boolean;
}

export interface Q3Result {
  /** Mutation score v procentech (napr. 91.9), nebo null pokud Stryker selhal */
  score: number | null;
  /** Textovy vystup ze Strykeru */
  output: string;
}

export interface Q5Result {
  /** Pocet ESLint warnings */
  warnings: number | null;
  /** Pocet ESLint errors */
  errors: number | null;
}

export interface Q6Result {
  /** Pocet TypeScript compiler errors */
  tscErrors: number;
  /** Pocet vyskytu `any` v src/ souborech */
  anyCount: number;
}

export interface Q7Result {
  /** Pocet funkcí s cyklomatickou slozitosti > 10 (McCabe) */
  complexityViolations: number | null;
}

// --- E metriky: Efficiency ---
// Meri "za jakou cenu" agent dosahl vysledku (tokeny, cas, stabilita).

export interface E1Result {
  /** Celkovy pocet vstupnich tokenu (context) */
  inputTokens: number;
  /** Celkovy pocet vystupnich tokenu (generovanych) */
  outputTokens: number;
  /** Soucet input + output */
  totalTokens: number;
}

export interface E2Result {
  /** Delka behu v minutach */
  durationMinutes: number;
}

export interface E3Result {
  /** Zda agent dokoncil bez crashe */
  completed: boolean;
  /** Pocet restartu z auto-continue pluginu */
  restartCount: number;
  /** ID session z opencode */
  sessionId: string;
}

// --- Behavioral Trace (deterministicka extrakce faktů pro DIAGNOSIS) ---
// Nejedna se o metriku (zadny prah) — je to vstup pro analyzu "jak se to stalo".
// Extrakce ze sekvence prikazu v transcript.json.

export interface BehavioralTrace {
  /** Byly vsechny issues vytvoreny najednou pred prvnim git commitem? */
  issuesBatchCreated: boolean | null;
  /** Prislo test-commit (soubory s "test") pred implementation-commitem na stejne vetvi? */
  firstTestCommitBeforeImpl: boolean | null;
  /** Celkovy pocet git commit prikazu */
  commitCount: number;
  /** Celkovy pocet git checkout -b prikazu */
  branchCount: number;
  /** Celkovy pocet gh issue create prikazu */
  issueCount: number;
  /** Celkovy pocet gh pr create prikazu */
  prCount: number;
  /** Pouzil agent todowrite tool? */
  todowriteUsed: boolean;
  /** Commitoval agent vse najednou na konci? (heuristika: <3 commitu na >5 souboru) */
  blobCommit: boolean | null;
  /** Pocet vetvi kde agent psal src/ soubory pred tests/ soubory (TDD violations) */
  tddOrderViolations: number;
  /** Poznamka pokud transcript.json chybi nebo nelze parsovat */
  note?: string;
}

// --- Git Stats (informacni, ne metrika) ---

export interface GitStats {
  totalCommits: number;
  /** Mapa prefix -> pocet (napr. { "feat": 5, "test": 3 }) */
  commitPrefixes: Record<string, number>;
  issueCount: number;
  closedIssueCount: number;
  prCount: number;
  mergedPrCount: number;
}

// --- Judge (LLM-as-judge) vysledky ---
// GLM-5 hodnotí na skale 1-3. Kazda dimenze ma rubric v experiments/infra/judge/.

export interface JudgeDimension {
  /** Nazev dimenze (napr. "naming", "separation_of_concerns") */
  name: string;
  /** Skore 1-3 (1=inadequate, 2=acceptable, 3=good) */
  score: number;
  /** Zduvodneni od LLM-as-judge */
  rationale: string;
}

export interface JudgeResult {
  /** Identifikator metriky (P6, P7, P8, Q4, Q8) */
  metric: string;
  /** Jednotlive hodnocene dimenze */
  dimensions: JudgeDimension[];
  /** Prumerny score pres vsechny dimenze */
  averageScore: number;
  /** Surovy JSON response od GLM-5 */
  rawResponse: string;
}

// --- Souhrnny vysledek analyzy ---

export interface AnalysisResult {
  runName: string;
  p1: P1Result;
  p2: P2Result;
  p3: P3Result;
  p4: P4Result;
  p5: P5Result;
  gitStats: GitStats;
  q1: Q1Result;
  q2: Q2Result;
  q3: Q3Result;
  q5: Q5Result;
  q6: Q6Result;
  q7: Q7Result;
  e1: E1Result;
  e2: E2Result;
  e3: E3Result;
}

// ============================================================================
// Utility funkce
// ============================================================================

/**
 * Spusti shell prikaz a vrati stdout jako string.
 *
 * Toto je wrapper okolo child_process.execSync, ktery:
 * - Automaticky nastavuje encoding na utf-8
 * - Stripuje trailing newline
 * - Pri chybe vrati fallback hodnotu misto crashe
 *
 * @param cmd - Shell prikaz ke spusteni
 * @param options - Nastaveni pro execSync (napr. cwd pro pracovni adresar)
 * @param fallback - Co vratit pokud prikaz selze (default: prazdny string)
 * @returns stdout prikazu, nebo fallback pri chybe
 */
export function exec(
  cmd: string,
  options: ExecSyncOptions = {},
  fallback: string = ""
): string {
  try {
    const result = execSync(cmd, {
      encoding: "utf-8",
      // Presmerujeme stderr do /dev/null aby nezanaselo stdout
      stdio: ["pipe", "pipe", "pipe"],
      ...options,
    });
    return String(result ?? "").trim();
  } catch (err: unknown) {
    // Kdyz prikaz skonci s non-zero exit code (napr. vitest s failing testy),
    // execSync hodi exception, ale stdout je stale dostupny na err.stdout.
    // Vracime stdout pokud existuje, jinak fallback.
    const e = err as { stdout?: string | Buffer };
    if (e.stdout) {
      return String(e.stdout).trim();
    }
    return fallback;
  }
}

/**
 * Spusti shell prikaz a vrati stdout BEZ error-handlingu (hodi exception pri chybe).
 * Pouzit kdyz selhani prikazu je fatalni chyba, ne normalni stav.
 */
export function execStrict(
  cmd: string,
  options: ExecSyncOptions = {}
): string {
  const result = execSync(cmd, {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
    ...options,
  });
  return String(result ?? "").trim();
}

/**
 * Najde adresar runu podle jmena.
 *
 * Hleda v poradi:
 * 1. experiments/runs/<name>       — aktivni runy
 * 2. experiments/runs/archive/<name> — archivovane (dokoncene) runy
 *
 * @param runName - Nazev runu (napr. "pilot-r1")
 * @returns Absolutni cesta k adresari runu
 * @throws Error pokud adresar neexistuje
 */
export function resolveRunDir(runName: string): string {
  // Zkus aktivni runy
  const active = path.join(RUNS_DIR, runName);
  if (fs.existsSync(active)) return active;

  // Zkus archiv
  const archived = path.join(RUNS_DIR, "archive", runName);
  if (fs.existsSync(archived)) return archived;

  throw new Error(
    `Run directory not found in runs/ or runs/archive/: ${runName}`
  );
}

/**
 * Precte soubor a vrati obsah jako string.
 * Vrati fallback pokud soubor neexistuje (misto crashe).
 */
export function readFile(filePath: string, fallback: string = ""): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return fallback;
  }
}

/**
 * Zapise string do souboru. Vytvori rodicovsky adresar pokud neexistuje.
 */
export function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
}

/**
 * Kontroluje zda soubor existuje.
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Nacte JSON soubor a vrati parsed objekt.
 * Vrati null pokud soubor neexistuje nebo neni validni JSON.
 */
export function readJSON<T = unknown>(filePath: string): T | null {
  const content = readFile(filePath);
  if (!content) return null;
  try {
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Spocita vyskyty patternu v textu (ekvivalent grep -c).
 */
export function countMatches(text: string, pattern: RegExp): number {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

/**
 * Formatuje cislo s oddelovacem tisicu (napr. 1234567 -> "1,234,567").
 */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/**
 * Vypise formatovany header sekce.
 */
export function printHeader(title: string): void {
  console.log(`## ${title}`);
  console.log("");
}

/**
 * Vypise pass/fail indikator.
 */
export function passIcon(pass: boolean | null): string {
  if (pass === null) return "?";
  return pass ? "\u2705" : "\u274C";
}

/**
 * Parsuje NDJSON vystup z `opencode run --format json`.
 *
 * OpenCode v JSON formatu vraci jeden JSON objekt na radek (NDJSON).
 * Kazdy radek je event, nas zajimaji eventy typu "text" ktere
 * obsahuji textovou odpoved modelu v part.text.
 *
 * Toto nahrazuje python3 oneliner z bash verze:
 *   python3 -c "import sys, json; for line in sys.stdin: ..."
 *
 * @param ndjsonOutput - Surovy NDJSON vystup z opencode
 * @returns Spojeny text odpovedi modelu
 */
export function parseOpenCodeOutput(ndjsonOutput: string): string {
  const lines = ndjsonOutput.split("\n");
  const textParts: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const event = JSON.parse(trimmed);
      // OpenCode NDJSON format: { type: "text", part: { text: "..." } }
      if (event.type === "text" && event.part?.text) {
        textParts.push(event.part.text);
      }
    } catch {
      // Ignorujeme radky ktere nejsou validni JSON
      // (napr. progress indicators, logy)
    }
  }

  return textParts.join("");
}

/**
 * Nacte prvni argument z command line jako nazev runu.
 * Ukonci proces s chybovou hlaskou pokud argument chybi.
 *
 * @param usageScript - Nazev skriptu pro usage hlasku (napr. "analyze-run.ts")
 * @returns Nazev runu
 */
export function getRunNameFromArgs(usageScript: string): string {
  // process.argv: [0]=node/tsx, [1]=script-path, [2..]=arguments
  const runName = process.argv[2];
  if (!runName) {
    console.error(`Usage: npx tsx ${usageScript} <run-name>`);
    console.error(`Example: npx tsx ${usageScript} pilot-r1`);
    process.exit(1);
  }
  return runName;
}

/**
 * Nacte command line argumenty vcetne pojmenovanych (--key value).
 * Vraci objekt s pozicnimi args a pojmenovanymi flags.
 *
 * @returns { args: string[], flags: Record<string, string> }
 */
export function parseArgs(): {
  args: string[];
  flags: Record<string, string>;
} {
  const rawArgs = process.argv.slice(2);
  const args: string[] = [];
  const flags: Record<string, string> = {};

  for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i].startsWith("--")) {
      const key = rawArgs[i].replace(/^--/, "");
      const value = rawArgs[i + 1] ?? "";
      flags[key] = value;
      i++; // Skip the value
    } else {
      args.push(rawArgs[i]);
    }
  }

  return { args, flags };
}
