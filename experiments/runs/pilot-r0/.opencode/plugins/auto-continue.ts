/**
 * Auto-continue plugin for OpenCode.
 *
 * When the agent goes idle, checks if work remains:
 * 1. Open implementation issues (agent-created sub-tasks)
 * 2. Build failures
 * 3. Test failures or missing test files
 *
 * Safety limit: MAX_RESTARTS prevents infinite loops.
 * Writes metrics to .opencode/metrics.csv for experiment analysis.
 */
import type { Plugin } from "@opencode-ai/plugin";

const MAX_RESTARTS = 10;
let restartCount = 0;
const startTime = Date.now();
let headerWritten = false;

async function appendMetric(
  ctx: any,
  status: string,
  openIssues: number,
): Promise<void> {
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  if (!headerWritten) {
    await ctx.$`echo "status,restart_count,elapsed_seconds,open_issues" > .opencode/metrics.csv`;
    headerWritten = true;
  }
  await ctx.$`echo "${status},${restartCount},${elapsed},${openIssues}" >> .opencode/metrics.csv`;
}

async function countOpenIssues(ctx: any): Promise<number> {
  try {
    const { stdout } =
      await ctx.$`gh issue list --state open --json number --jq '[.[] | select(.number != 1)] | length'`;
    return parseInt(stdout.trim(), 10) || 0;
  } catch {
    return 0;
  }
}

async function buildPasses(ctx: any): Promise<boolean> {
  try {
    await ctx.$`npm run build`;
    return true;
  } catch {
    return false;
  }
}

async function testsPasses(ctx: any): Promise<boolean> {
  try {
    await ctx.$`npm run test`;
    return true;
  } catch {
    return false;
  }
}

async function hasTestFiles(ctx: any): Promise<boolean> {
  try {
    const { stdout } =
      await ctx.$`find tests src -name "*.test.ts" -o -name "*.spec.ts" 2>/dev/null | wc -l`;
    return parseInt(stdout.trim(), 10) > 0;
  } catch {
    return false;
  }
}

export const AutoContinuePlugin: Plugin = async (ctx) => {
  return {
    event: async ({ event, client }) => {
      if (event.type !== "session.idle") return;

      const openIssues = await countOpenIssues(ctx);

      // Safety limit
      if (restartCount >= MAX_RESTARTS) {
        await appendMetric(ctx, "MAX_RESTARTS", openIssues);
        return;
      }

      // Determine if work remains
      let reason = "";

      if (openIssues > 0) {
        reason = `${openIssues} open issues remain`;
      } else {
        // No open issues — check build + tests as completion criterion
        if (!(await buildPasses(ctx))) {
          reason = "build fails";
        } else if (!(await hasTestFiles(ctx))) {
          reason = "no test files found";
        } else if (!(await testsPasses(ctx))) {
          reason = "tests fail";
        }
      }

      if (reason) {
        restartCount++;
        await appendMetric(ctx, `CONTINUE:${reason}`, openIssues);

        await client.session.prompt({
          sessionId: event.sessionId,
          messages: [
            {
              role: "user",
              content: `[auto-continue #${restartCount}] Work remains: ${reason}. Continue implementing according to AGENTS.md and Issue #1.`,
            },
          ],
        });
      } else {
        await appendMetric(ctx, "DONE", 0);
      }
    },
  };
};

export default AutoContinuePlugin;
