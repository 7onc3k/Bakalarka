/**
 * preflight-test.ts — Pre-run infrastructure test.
 *
 * Verifies that everything works BEFORE starting an expensive agent run.
 * Run this before every new-run.ts invocation.
 *
 * Usage:
 *   npx tsx preflight-test.ts
 *
 * Tests:
 *   1. Docker image exists and opencode binary works
 *   2. Docker --user flag + opencode run works (the actual permission setup)
 *   3. AGENTS.md is visible from /workspace inside container
 *   4. gh auth works inside container
 *   5. API connectivity (MiniMax via Model Studio)
 *   6. Shared DB state (no stale locks, count sessions)
 *   7. Working directory is /workspace
 *   8. Spec issue files exist
 */

import * as path from "node:path";
import * as fs from "node:fs";
import { execSync } from "node:child_process";
import {
  AGENT_MODEL,
  INFRA_DIR,
} from "./shared.js";

const PASS = "\x1b[32mPASS\x1b[0m";
const FAIL = "\x1b[31mFAIL\x1b[0m";
const WARN = "\x1b[33mWARN\x1b[0m";

let failures = 0;
let warnings = 0;

function test(name: string, fn: () => string | null): void {
  try {
    const issue = fn();
    if (issue === null) {
      console.log(`  ${PASS}  ${name}`);
    } else if (issue.startsWith("WARN:")) {
      console.log(`  ${WARN}  ${name} — ${issue.slice(5).trim()}`);
      warnings++;
    } else {
      console.log(`  ${FAIL}  ${name} — ${issue}`);
      failures++;
    }
  } catch (err: any) {
    console.log(`  ${FAIL}  ${name} — ${err.message}`);
    failures++;
  }
}

function sh(cmd: string, timeout = 15000): string {
  return execSync(cmd, {
    encoding: "utf-8",
    timeout,
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

function shOk(cmd: string, timeout = 15000): boolean {
  try {
    execSync(cmd, { timeout, stdio: ["pipe", "pipe", "pipe"] });
    return true;
  } catch {
    return false;
  }
}

function main(): void {
  const imageName = "bp-agent:latest";
  const uid = process.getuid!();
  const gid = process.getgid!();
  const opencodeAuth = path.join(INFRA_DIR, "opencode-auth");
  const opencodeConfig = path.join(INFRA_DIR, "opencode-config");
  const agentsMd = path.join(INFRA_DIR, "inputs", "AGENTS.md");
  const ghToken = sh("gh auth token");

  // Common docker args matching new-run.ts
  const dockerBase = [
    `docker run --rm --user ${uid}:${gid}`,
    `--name bp-preflight-test`,
    `-v ${opencodeAuth}:/home/ubuntu/.local/share/opencode`,
    `-v ${opencodeConfig}:/home/ubuntu/.config/opencode`,
    `-e GH_TOKEN=${ghToken}`,
    `-e HOME=/home/ubuntu`,
    `-e XDG_STATE_HOME=/tmp/state`,
    imageName,
  ].join(" ");

  console.log("\n=== Preflight infrastructure tests ===\n");

  // 1. Docker image
  test("Docker image exists", () => {
    const created = sh(`docker image inspect ${imageName} --format '{{.Created}}'`);
    if (!created) return "Image not found";
    return null;
  });

  // 2. opencode binary works in container
  test("opencode binary works in container", () => {
    const out = sh(`${dockerBase} bash -c 'which opencode && opencode --help 2>&1 | head -1'`);
    if (!out.includes("opencode")) return `Unexpected output: ${out}`;
    return null;
  });

  // 3. opencode run with --user flag (THE critical test)
  test("opencode run with --user flag succeeds", () => {
    const out = sh(
      `${dockerBase} bash -c 'timeout 15 opencode run -m "${AGENT_MODEL}" "Reply OK" 2>&1; echo EXIT:$?'`,
      30000
    );
    if (!out.includes("EXIT:0")) return `Failed: ${out.slice(-200)}`;
    return null;
  });

  // 4. WORKDIR is /workspace
  test("Working directory is /workspace", () => {
    const pwd = sh(`${dockerBase} pwd`);
    if (pwd !== "/workspace") return `Expected /workspace, got ${pwd}`;
    return null;
  });

  // 5. AGENTS.md visible from /workspace
  test("AGENTS.md visible in /workspace", () => {
    // Mount a temp dir as /workspace with AGENTS.md
    const tmpDir = fs.mkdtempSync("/tmp/preflight-");
    fs.copyFileSync(agentsMd, path.join(tmpDir, "AGENTS.md"));
    const dockerWithWorkspace = dockerBase.replace(
      `--name bp-preflight-test`,
      `--name bp-preflight-agents -v ${tmpDir}:/workspace`
    );
    const out = sh(`${dockerWithWorkspace} head -1 /workspace/AGENTS.md`);
    fs.rmSync(tmpDir, { recursive: true });
    if (!out.includes("AGENTS.md")) return `AGENTS.md not readable: ${out}`;
    return null;
  });

  // 6. gh auth inside container
  test("gh auth works inside container", () => {
    const out = sh(`${dockerBase} gh auth status 2>&1`);
    if (!out.includes("Logged in")) return `Auth failed: ${out.slice(0, 200)}`;
    return null;
  });

  // 7. API connectivity
  test("MiniMax API responds (HTTP 200)", () => {
    const configPath = path.join(opencodeConfig, "opencode.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const provider = config.provider?.["bailian-coding-plan"];
    const baseURL = provider?.options?.baseURL;
    const apiKey = provider?.options?.apiKey;
    if (!baseURL || !apiKey) return "Missing baseURL or apiKey in config";

    const status = sh(
      `curl -s -o /dev/null -w "%{http_code}" -X POST "${baseURL}/messages" ` +
      `-H "x-api-key: ${apiKey}" -H "content-type: application/json" ` +
      `-H "anthropic-version: 2023-06-01" ` +
      `-d '{"model":"MiniMax-M2.5","max_tokens":5,"messages":[{"role":"user","content":"hi"}]}'`,
      15000
    );
    if (status !== "200") return `HTTP ${status}`;
    return null;
  });

  // 8. Spec issue files
  test("Spec issue files exist", () => {
    const specMd = path.join(INFRA_DIR, "inputs", "issue-1-spec.md");
    const specJson = path.join(INFRA_DIR, "inputs", "issue-1-req-only.json");
    if (!fs.existsSync(specMd)) return "issue-1-spec.md not found";
    if (!fs.existsSync(specJson)) return "issue-1-req-only.json not found";
    return null;
  });

  // 9. Shared DB state
  test("Shared DB not locked", () => {
    const dbPath = path.join(opencodeAuth, "opencode.db");
    const lockPath = dbPath + "-lock";
    if (fs.existsSync(lockPath)) return "opencode.db-lock exists — DB may be locked";
    return null;
  });

  test("Shared DB session count", () => {
    const dbPath = path.join(opencodeAuth, "opencode.db");
    const count = sh(
      `python3 -c "import sqlite3; c=sqlite3.connect('${dbPath}'); print(c.execute('SELECT count(*) FROM session').fetchone()[0])"`
    );
    const n = parseInt(count, 10);
    if (n > 20) return `WARN: ${n} sessions in shared DB — consider cleanup`;
    return null;
  });

  // 10. AGENTS.md loadable by OpenCode in container
  test("AGENTS.md loadable in container (OpenCode sees it)", () => {
    const tmpDir = fs.mkdtempSync("/tmp/preflight-load-");
    fs.copyFileSync(agentsMd, path.join(tmpDir, "AGENTS.md"));
    // OpenCode loads AGENTS.md from workspace root automatically
    // Verify the file is readable by the container user
    const dockerCheck = dockerBase.replace(
      `--name bp-preflight-test`,
      `--name bp-preflight-load -v ${tmpDir}:/workspace`
    );
    const out = sh(`${dockerCheck} bash -c 'test -r /workspace/AGENTS.md && head -1 /workspace/AGENTS.md'`);
    fs.rmSync(tmpDir, { recursive: true });
    if (!out.includes("AGENTS.md")) return "AGENTS.md not readable in container /workspace";
    return null;
  });

  // 11. Config consistency with baseline run
  test("OpenCode config matches baseline (r3)", () => {
    const r3Snapshot = path.join(INFRA_DIR, "..", "runs", "pilot-r3", ".experiment-snapshot", "opencode-config.json");
    const currentConfig = path.join(INFRA_DIR, "opencode-config", "opencode.json");
    if (!fs.existsSync(r3Snapshot)) return "WARN: r3 has no config snapshot — cannot verify consistency";
    const r3 = fs.readFileSync(r3Snapshot, "utf-8");
    const current = fs.readFileSync(currentConfig, "utf-8");
    if (r3 !== current) return "OpenCode config differs from r3 baseline! Check limit.context/limit.output";
    return null;
  });

  // 11. AGENTS.md diff sanity
  test("AGENTS.md differs from r3 by exactly 2 lines", () => {
    const r3 = path.join(INFRA_DIR, "..", "runs", "pilot-r3", "AGENTS.md");
    if (!fs.existsSync(r3)) return "WARN: pilot-r3/AGENTS.md not found, skipping diff check";
    const diff = sh(`diff ${r3} ${agentsMd} | grep '^[<>]' | wc -l`);
    const changed = parseInt(diff, 10);
    // Expect 1 deleted line + 2 added lines = 3 diff lines
    if (changed < 2 || changed > 4) return `Expected ~3 diff lines, got ${changed}`;
    return null;
  });

  // Summary
  console.log(`\n=== Results: ${failures} failures, ${warnings} warnings ===\n`);
  if (failures > 0) {
    console.log("FIX failures before running new-run.ts!");
    process.exit(1);
  }
  if (warnings > 0) {
    console.log("Warnings present — review before proceeding.");
  } else {
    console.log("All clear — ready to run.");
  }
}

main();
