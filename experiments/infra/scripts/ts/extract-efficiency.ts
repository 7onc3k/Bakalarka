/**
 * Rychlý výpis E1–E3 jen z transcript.json (bez git/npm).
 *
 *   npx tsx experiments/infra/scripts/ts/extract-efficiency.ts pilot-r3
 */

import * as path from "node:path";
import { readJSON, resolveRunDir, fileExists } from "./shared.js";
import {
  efficiencyFromTranscript,
  type LooseTranscript,
} from "./efficiency-from-transcript.js";
import { formatE1Block } from "./e1-report.js";

function main(): void {
  const run = process.argv[2];
  if (!run) {
    console.error(
      "Usage: npx tsx extract-efficiency.ts <run-name>  (e.g. pilot-r3)"
    );
    process.exit(1);
  }
  const dir = resolveRunDir(run);
  const transcriptPath = path.join(dir, "transcript.json");
  if (!fileExists(transcriptPath)) {
    console.error(`No transcript.json in ${dir}`);
    process.exit(1);
  }
  const transcript = readJSON<LooseTranscript>(transcriptPath);
  const eff = efficiencyFromTranscript(transcript);
  if (!eff) {
    console.error("Could not parse efficiency from transcript");
    process.exit(1);
  }
  const { e1, e2, e3 } = eff;
  console.log(`run: ${run}`);
  console.log(formatE1Block(e1));
  console.log(`E2 — duration: ${e2.durationMinutes} min`);
  console.log(
    `E3 — compactions: ${e3.compactionCount}; completion: ${e3.completed ? "OK" : "CRASHED"}; session: ${e3.sessionId}`
  );
}

main();
