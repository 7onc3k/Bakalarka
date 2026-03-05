/**
 * new-run.ts — Vytvori a spusti novy experimentalni run.
 *
 * Co to dela:
 * 1. Vytvori novy privatni GitHub repozitar (bp-<run-name>)
 * 2. Inicializuje lokalni adresar s AGENTS.md, .opencode konfiguraci
 * 3. Pushne do GitHubu, vytvori Issue #1 ze specifikace
 * 4. Spusti OpenCode agenta (minimax-m2.5-free)
 * 5. Exportuje transkript session pro analyzu
 *
 * Usage:
 *   npx tsx new-run.ts <run-name> [--agents path/to/AGENTS.md]
 *
 * Examples:
 *   npx tsx new-run.ts pilot-r6
 *   npx tsx new-run.ts ablation-no-tdd --agents experiments/infra/variants/no-tdd.md
 *
 * Vystup: experiments/runs/<run-name>/
 *   AGENTS.md, .opencode/, transcript.json, .opencode/metrics.csv
 */

import * as path from "node:path";
import * as fs from "node:fs";
import { execSync } from "node:child_process";
import * as os from "node:os";
import {
  exec,
  execStrict,
  readFile,
  fileExists,
  readJSON,
  parseArgs,
  GITHUB_ORG,
  AGENT_MODEL,
  INFRA_DIR,
  RUNS_DIR,
} from "./shared.js";

// ============================================================================
// Hlavni logika
// ============================================================================

function main(): void {
  const { args, flags } = parseArgs();

  // Prvni pozicni argument = nazev runu
  const runName = args[0];
  if (!runName) {
    console.error(
      "Usage: npx tsx new-run.ts <run-name> [--agents path/to/AGENTS.md]"
    );
    console.error(
      "Example: npx tsx new-run.ts pilot-r6 --agents experiments/infra/inputs/AGENTS.md"
    );
    process.exit(1);
  }

  // Volitelny flag --agents pro pouziti jineho AGENTS.md
  // Default: experiments/infra/inputs/AGENTS.md (hlavni verze iterovana v experimentu)
  const agentsMdPath = flags.agents
    ? path.resolve(flags.agents)
    : path.join(INFRA_DIR, "inputs", "AGENTS.md");

  if (!fileExists(agentsMdPath)) {
    console.error(`Error: AGENTS.md not found: ${agentsMdPath}`);
    process.exit(1);
  }

  // Odvozene cesty
  const repoName = `bp-${runName}`;
  const repoUrl = `https://github.com/${GITHUB_ORG}/${repoName}.git`;
  const runDir = path.join(RUNS_DIR, runName);

  console.log(`=== Experiment run: ${runName} ===`);
  console.log(`    Model:  ${AGENT_MODEL}`);
  console.log(`    Agents: ${agentsMdPath}`);
  console.log(`    Repo:   ${GITHUB_ORG}/${repoName}`);
  console.log(`    Dir:    ${runDir}`);
  console.log("");

  // --- Guard: repozitar nesmi existovat ---
  // Kontrolujeme pres gh API, ne lokalne
  const repoExists = exec(
    `gh repo view ${GITHUB_ORG}/${repoName}`,
    {},
    "NOT_FOUND"
  );
  if (repoExists !== "NOT_FOUND") {
    console.error("Error: repository already exists.");
    console.error(
      `To delete: gh repo delete ${GITHUB_ORG}/${repoName} --yes`
    );
    process.exit(1);
  }

  // --- Guard: lokalni adresar nesmi existovat ---
  if (fs.existsSync(runDir)) {
    console.error(`Error: run directory already exists: ${runDir}`);
    process.exit(1);
  }

  // --- Step 1: Vytvorime GitHub repozitar ---
  console.log("\u2192 Creating repository...");
  execStrict(
    `gh repo create ${GITHUB_ORG}/${repoName} --private --description "Experiment run: ${runName}"`
  );

  // --- Step 2: Inicializujeme lokalni adresar ---
  console.log("\u2192 Creating local repo...");
  fs.mkdirSync(path.join(runDir, ".opencode", "plugins"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(runDir, ".opencode", "agents"), {
    recursive: true,
  });

  // .gitignore — standardni vylouceni pro Node.js/TypeScript projekt
  fs.writeFileSync(
    path.join(runDir, ".gitignore"),
    `node_modules/
dist/
coverage/
.stryker-tmp/
reports/
*.tsbuildinfo
`
  );

  // .opencode/config.json — minimalni konfigurace
  const opencodeConfig = { "$schema": "https://opencode.ai/config.json" };
  fs.writeFileSync(
    path.join(runDir, ".opencode", "config.json"),
    JSON.stringify(opencodeConfig, null, 2)
  );

  // .local/share/opencode/auth.json — provider auth (jen bailian, bez MCP)
  // OpenCode čte auth z $HOME/.local/share/opencode/auth.json
  const bailianApiKey = process.env.BAILIAN_API_KEY || "";
  const authDir = path.join(runDir, ".local", "share", "opencode");
  fs.mkdirSync(authDir, { recursive: true });
  const authJson = { "bailian-coding-plan": { "type": "api", "key": bailianApiKey } };
  fs.writeFileSync(path.join(authDir, "auth.json"), JSON.stringify(authJson, null, 2));

  // .opencode/agents/build.md — system prompt override (nahrazuje defaultni
  // qwen.txt system prompt v opencode). Fixni pres vsechny runy.
  const buildMdSrc = path.join(INFRA_DIR, "inputs", "build.md");
  if (fileExists(buildMdSrc)) {
    fs.copyFileSync(
      buildMdSrc,
      path.join(runDir, ".opencode", "agents", "build.md")
    );
  }

  // .opencode/plugins/auto-continue.ts — plugin ktery automaticky restartuje
  // agenta pri vypadku (meri se jako E3 restarts)
  const pluginSrc = path.join(INFRA_DIR, "scripts", "auto-continue.ts");
  if (fileExists(pluginSrc)) {
    fs.copyFileSync(
      pluginSrc,
      path.join(runDir, ".opencode", "plugins", "auto-continue.ts")
    );
  }

  // --- Step 3: Zkopirujeme AGENTS.md ---
  // AGENTS.md je jedina promenna experimentu — obsahuje instrukce pro agenta.
  // Kazda iterace pilotu pouziva jinou verzi.
  console.log(`\u2192 Copying AGENTS.md from ${agentsMdPath}...`);
  fs.copyFileSync(agentsMdPath, path.join(runDir, "AGENTS.md"));

  // --- Step 4: Git init + push ---
  console.log("\u2192 Pushing to GitHub...");
  execStrict(`git init -b main`, { cwd: runDir });
  execStrict(`git add -A`, { cwd: runDir });
  execStrict(`git commit -m "chore: init run ${runName}"`, {
    cwd: runDir,
  });
  execStrict(`git remote add origin ${repoUrl}`, { cwd: runDir });
  execStrict(`git push -u origin main`, { cwd: runDir });

  // --- Step 5: Vytvorime spec issue #1 ---
  // Issue #1 obsahuje specifikaci (dunning system).
  // Agent ho precte jako prvni krok (pokud AGENTS.md funguje spravne).
  console.log("\u2192 Creating spec issue...");

  // Label "spec" pro identifikaci spec issue
  exec(
    `gh label create "spec" --repo ${GITHUB_ORG}/${repoName} --color "0052CC" --description "Specification issue"`,
    { cwd: runDir }
  );

  // Nacteme titul z JSON a body z markdown souboru
  const specJson = readJSON<{ title: string }>(
    path.join(INFRA_DIR, "inputs", "issue-1-req-only.json")
  );
  const specTitle = specJson?.title ?? "Billing Reminder System";

  const specBodyPath = path.join(INFRA_DIR, "inputs", "issue-1-spec.md");
  const specBody = readFile(specBodyPath);

  if (specBody) {
    // Predame body pres temp soubor (muze byt velmi dlouhy)
    const tempBodyPath = path.join(runDir, ".spec-body.tmp");
    fs.writeFileSync(tempBodyPath, specBody, "utf-8");

    exec(
      `gh issue create --repo ${GITHUB_ORG}/${repoName} --title "${specTitle}" --body-file .spec-body.tmp --label "spec"`,
      { cwd: runDir }
    );

    // Cleanup
    try {
      fs.unlinkSync(tempBodyPath);
    } catch {
      /* ignore */
    }
  } else {
    console.log("Warning: issue-1-spec.md not found, creating minimal issue");
    exec(
      `gh issue create --repo ${GITHUB_ORG}/${repoName} --title "${specTitle}" --body "See specification." --label "spec"`,
      { cwd: runDir }
    );
  }

  console.log(`  Created: ${specTitle}`);

  // --- Step 6: Spustime agenta v Docker containeru ---
  // Docker zajistuje izolaci: zadne globalni MCP servery, skills ani konfigurace
  // ktere by mohly ovlivnit chování agenta a reproducibilitu.
  const dockerfileDir = path.join(INFRA_DIR);
  const imageName = "bp-agent:latest";
  const ghToken = process.env.GH_TOKEN || exec("gh auth token", {}, "");
  const bailianKey = process.env.BAILIAN_API_KEY || "";

  // Build image pokud neexistuje (nebo FORCE_REBUILD=1)
  const imageExists = exec(`docker image inspect ${imageName}`, {}, "NOT_FOUND") !== "NOT_FOUND";
  if (!imageExists || process.env.FORCE_REBUILD === "1") {
    console.log("\u2192 Building agent Docker image...");
    execStrict(`docker build -f Dockerfile.agent -t ${imageName} .`, { cwd: dockerfileDir, stdio: "inherit" });
  }

  console.log("");
  console.log("=== Starting agent (Docker) ===");
  console.log("");

  try {
    execSync(
      [
        `docker run --rm --user ${process.getuid()}:${process.getgid()}`,
        `--name bp-agent-${runName}`,
        `-v ${runDir}:/workspace`,
        `-v ${path.join(INFRA_DIR, "opencode-auth")}:/home/ubuntu/.local/share/opencode`,
        `-v ${path.join(INFRA_DIR, "opencode-auth", "state")}:/home/ubuntu/.local/state`,
        `-v ${path.join(INFRA_DIR, "opencode-config")}:/home/ubuntu/.config/opencode`,
        `-e GH_TOKEN=${ghToken}`,
        `-e HOME=/home/ubuntu`,
        `${imageName}`,
        `bash -c "gh auth setup-git && opencode run -m \"${AGENT_MODEL}\" \"Work on Issue #1 according to AGENTS.md.\" && SESSION_ID=\\$(opencode session list -n 1 --format json | python3 -c \\"import sys,json; print(json.load(sys.stdin)[0]['id'])\\") && opencode export \\$SESSION_ID > /workspace/transcript.json && echo \\$SESSION_ID > /workspace/.session-id.txt"`
      ].join(" "),
      {
        stdio: "inherit",
        timeout: 0,
      }
    );
  } catch (err) {
    console.error(`Agent execution ended with error: ${err}`);
    // Pokracujeme i pri chybe — chceme exportovat transkript
  }

  // --- Step 7: Exportujeme transkript ---
  console.log("");
  console.log("\u2192 Exporting session transcript...");

  // Transcript byl exportovan uvnitr Dockeru do /workspace/transcript.json
  // Session ID ulozeno do .session-id.txt
  const transcriptPath = path.join(runDir, "transcript.json");
  const sessionIdFile = path.join(runDir, ".session-id.txt");

  let sessionId = "";
  if (fileExists(sessionIdFile)) {
    sessionId = readFile(sessionIdFile)?.trim() ?? "";
  }

  if (!fileExists(transcriptPath)) {
    console.log(
      "  Warning: transcript.json not found — export failed inside Docker."
    );
    console.log("  Session ID file:", fileExists(sessionIdFile) ? sessionId : "not found");
    printDone(runDir, repoName, 0);
    return;
  }

  console.log(`  Saved: ${transcriptPath} (session: ${sessionId || "unknown"})`);

  // Rekurzivne exportujeme sub-agent sessions
  // (pokud agent pouzil task tool, kazdy sub-task ma vlastni session)
  const transcriptsDir = path.join(runDir, "transcripts");
  fs.mkdirSync(transcriptsDir, { recursive: true });
  collectSubSessions(transcriptPath, transcriptsDir, runDir);

  // Spocitame sub-sessions
  let subCount = 0;
  try {
    subCount = fs
      .readdirSync(transcriptsDir)
      .filter((f) => f.endsWith(".json")).length;
  } catch {
    /* ignore */
  }

  if (subCount > 0) {
    console.log(
      `  Sub-sessions exported: ${subCount} (in ${transcriptsDir}/)`
    );
  }

  printDone(runDir, repoName, subCount);
}

// ============================================================================
// Rekurzivni export sub-sessions
//
// Agent muze pouzit "task" tool pro delegaci — kazdy sub-task
// vytvori vlastni session. Tady je rekurzivne sebreme.
// ============================================================================

/**
 * Najde sub-sessions v transkriptu a rekurzivne je exportuje.
 *
 * Hledame v messages: parts kde tool=="task" a stav je "completed".
 * Kazdy takovy part ma metadata.sessionId.
 *
 * @param transcriptFile - Cesta k hlavnimu transkriptu
 * @param outDir - Kam ukladat sub-session JSON soubory
 * @param cwd - Pracovni adresar pro opencode prikazy
 */
function collectSubSessions(
  transcriptFile: string,
  outDir: string,
  cwd: string
): void {
  const transcript = readJSON<{
    messages?: Array<{
      parts?: Array<{
        tool?: string;
        state?: {
          status?: string;
          metadata?: { sessionId?: string };
        };
      }>;
    }>;
  }>(transcriptFile);

  if (!transcript?.messages) return;

  // Pro kazdy message hledame parts s tool=="task"
  for (const msg of transcript.messages) {
    for (const part of msg.parts ?? []) {
      if (
        part.tool === "task" &&
        part.state?.status === "completed" &&
        part.state?.metadata?.sessionId
      ) {
        const childId = part.state.metadata.sessionId;

        // Preskocime pokud uz exportovano (muze se stat pri vicenasobnem volani)
        const childFile = path.join(outDir, `${childId}.json`);
        if (fs.existsSync(childFile)) continue;

        console.log(`  Sub-session: ${childId}`);
        const childContent = exec(
          `opencode export "${childId}"`,
          { cwd }
        );
        if (childContent) {
          fs.writeFileSync(childFile, childContent, "utf-8");
          // Rekurzivne hledame dalsi sub-sessions
          collectSubSessions(childFile, outDir, cwd);
        }
      }
    }
  }
}

// ============================================================================
// Zaverecny vypis
// ============================================================================

function printDone(
  runDir: string,
  repoName: string,
  subCount: number
): void {
  console.log("");
  console.log("=== Done ===");
  console.log(
    `    Repo:         https://github.com/${GITHUB_ORG}/${repoName}`
  );
  console.log(`    Dir:          ${runDir}`);
  console.log(`    Transcript:   ${runDir}/transcript.json`);
  if (subCount > 0) {
    console.log(
      `    Sub-sessions: ${runDir}/transcripts/ (${subCount} files)`
    );
  }
  console.log(`    Metrics:      ${runDir}/.opencode/metrics.csv`);
}

// ============================================================================
// Spusteni
// ============================================================================

main();
