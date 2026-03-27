import { query } from "@anthropic-ai/claude-agent-sdk";
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { join } from "path";
import { loadAndStripThesis, buildFullText } from "./strip-latex.js";

const OUTPUT_DIR = join(import.meta.dirname, "..", "output");
const PROMPT_PATH = join(import.meta.dirname, "system-prompt.md");

const MODEL = process.argv.includes("--opus")
  ? "claude-opus-4-6"
  : process.argv.includes("--sonnet")
    ? "claude-sonnet-4-6"
    : "claude-haiku-4-5-20251001";

function loadSystemPrompt(): string {
  return readFileSync(PROMPT_PATH, "utf-8");
}

async function main() {
  console.log(`Loading thesis files...`);
  const sections = loadAndStripThesis();
  const fullText = buildFullText(sections);
  const systemPrompt = loadSystemPrompt();

  console.log(
    `Stripped ${sections.length} files, ${fullText.length} chars (~${Math.round(fullText.length / 4)} tokens)`
  );
  console.log(`System prompt: ${systemPrompt.length} chars`);
  console.log(`Using model: ${MODEL}`);

  // Save stripped text for inspection
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const strippedPath = join(OUTPUT_DIR, "stripped-thesis.md");
  writeFileSync(strippedPath, fullText);
  console.log(`Stripped text saved to: ${strippedPath}`);

  console.log(`\nSending to Claude for review...\n`);

  let resultText = "";

  const q = query({
    prompt: `Zvaliduj tuto bakalářskou práci. Projdi celý text níže a vytvoř kompletní recenzi podle instrukcí v system promptu.\n\n${fullText}`,
    options: {
      model: MODEL,
      systemPrompt: systemPrompt,
      maxTurns: 1,
      tools: [],
      allowedTools: [],
      permissionMode: "dontAsk",
    },
  });

  for await (const message of q) {
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if ("text" in block && block.text) {
          process.stdout.write(block.text);
          resultText += block.text;
        }
      }
    }

    if (message.type === "result") {
      if (message.subtype === "success") {
        resultText = message.result || resultText;
        console.log(
          `\n\n--- Done. Cost: $${message.total_cost_usd.toFixed(4)}, turns: ${message.num_turns}, duration: ${(message.duration_ms / 1000).toFixed(1)}s ---`
        );
      } else {
        console.error(`\nError:`, message);
      }
    }
  }

  // Save review output
  const date = new Date().toISOString().split("T")[0];
  const modelShort = MODEL.includes("opus")
    ? "opus"
    : MODEL.includes("sonnet")
      ? "sonnet"
      : "haiku";
  const outputPath = join(OUTPUT_DIR, `review-${date}-${modelShort}.md`);
  writeFileSync(outputPath, resultText);
  console.log(`Review saved to: ${outputPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
