/**
 * Jednotná extrakce E1–E3 z OpenCode exportu (transcript.json).
 *
 * E1 v tabulkách: peakPrompt = max(input+cache.read+cache.write na kroku) + sumOutput (+reasoning).
 *   Samotné pole input bývá bez větší části kontextu (ten je v cache.read) — peakInputTokens je diagnostika.
 *   Součet inputů přes kroky je v E1Result jen diagnosticky (sumInputTokens).
 *   estimatedCostUsd vč. cache — volitelně. tokens.total → peakTotalTokens.
 *   Sazby: getE1UsdPerMillionRates() — výchozí pro MiniMax-M2.5 @ Alibaba Model Studio.
 *
 * E3 = počet compaction událostí (heuristika snapshot mezi step-finish / step-start).
 */

import type { E1Result, E2Result, E3Result } from "./shared.js";
import { getE1UsdPerMillionRates, stepCostUsd } from "./e1-pricing.js";

export interface EfficiencyFromTranscript {
  e1: E1Result;
  e2: E2Result;
  e3: E3Result;
}

type MsgTokens = {
  input?: number;
  output?: number;
  reasoning?: number;
  total?: number;
  cache?: { read?: number; write?: number };
};

type TranscriptMsg = {
  role?: string;
  info?: {
    role?: string;
    tokens?: MsgTokens;
    time?: { created?: number; completed?: number };
  };
  tokens?: MsgTokens;
  time?: { created?: number; completed?: number };
  parts?: Array<{
    type?: string;
    snapshot?: string;
    [key: string]: unknown;
  }>;
};

/** Kořen OpenCode exportu (podporuje info i session). */
export type LooseTranscript = {
  info?: {
    id?: string;
    time?: { created?: number; updated?: number };
  };
  session?: {
    id?: string;
    time?: { created?: number; updated?: number };
  };
  messages?: TranscriptMsg[];
};

function rawTokens(msg: TranscriptMsg): MsgTokens {
  return (msg.info?.tokens ?? msg.tokens ?? {}) as MsgTokens;
}

function isAssistant(msg: TranscriptMsg): boolean {
  return (msg.info?.role ?? msg.role) === "assistant";
}

function msgInOut(msg: TranscriptMsg): { input: number; output: number } {
  const t = rawTokens(msg);
  return { input: t.input ?? 0, output: t.output ?? 0 };
}

function stepHasTokens(t: MsgTokens): boolean {
  const cr = t.cache?.read ?? 0;
  const cw = t.cache?.write ?? 0;
  return (
    (t.input ?? 0) > 0 ||
    (t.output ?? 0) > 0 ||
    (t.reasoning ?? 0) > 0 ||
    cr > 0 ||
    cw > 0 ||
    (t.total ?? 0) > 0
  );
}

export function efficiencyFromTranscript(
  transcript: LooseTranscript | null | undefined
): EfficiencyFromTranscript | null {
  if (!transcript?.messages?.length) return null;

  const messages = transcript.messages;
  const meta = transcript.info ?? transcript.session ?? {};
  const rates = getE1UsdPerMillionRates();

  let maxTotal = 0;
  let sumInput = 0;
  let peakInput = 0;
  let peakPrompt = 0;
  let sumOutput = 0;
  let sumCacheRead = 0;
  let sumCacheWrite = 0;
  let estimatedCostUsd = 0;

  for (const msg of messages) {
    const t = rawTokens(msg);
    if (t.total != null) maxTotal = Math.max(maxTotal, t.total);

    if (!isAssistant(msg) || !stepHasTokens(t)) continue;

    const inp = t.input ?? 0;
    const out = t.output ?? 0;
    const reasoning = t.reasoning ?? 0;
    const cr = t.cache?.read ?? 0;
    const cw = t.cache?.write ?? 0;

    sumInput += inp;
    peakInput = Math.max(peakInput, inp);
    peakPrompt = Math.max(peakPrompt, inp + cr + cw);
    sumOutput += out + reasoning;
    sumCacheRead += cr;
    sumCacheWrite += cw;
    estimatedCostUsd += stepCostUsd(inp, out, reasoning, cr, cw, rates);
  }

  const e1: E1Result = {
    estimatedCostUsd: Math.round(estimatedCostUsd * 10_000) / 10_000,
    sumInputTokens: sumInput,
    peakInputTokens: peakInput,
    peakPromptTokens: peakPrompt,
    sumOutputTokens: sumOutput,
    sumCacheReadTokens: sumCacheRead,
    sumCacheWriteTokens: sumCacheWrite,
    peakTotalTokens: maxTotal,
  };

  let durationMin = 0;
  const timeInfo = meta.time ?? {};
  if (timeInfo.created && timeInfo.updated) {
    durationMin = (timeInfo.updated - timeInfo.created) / 60000;
  } else {
    let minT = Infinity;
    let maxT = 0;
    for (const msg of messages) {
      const tm = msg.info?.time ?? msg.time;
      if (tm?.created) {
        minT = Math.min(minT, tm.created);
        maxT = Math.max(maxT, tm.created);
      }
      if (tm?.completed) maxT = Math.max(maxT, tm.completed);
    }
    if (minT !== Infinity && maxT) durationMin = (maxT - minT) / 60000;
  }

  const lastMsg = messages[messages.length - 1];
  const lastIO = lastMsg ? msgInOut(lastMsg) : { input: 0, output: 0 };
  const lastEmpty = lastIO.input === 0 && lastIO.output === 0;
  const hadWork =
    estimatedCostUsd > 0 ||
    maxTotal > 0 ||
    sumInput + sumOutput + sumCacheRead + sumCacheWrite > 0;
  const crashed = lastEmpty && !hadWork;

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

  const e2: E2Result = {
    durationMinutes: Math.round(durationMin * 10) / 10,
  };
  const e3: E3Result = {
    compactionCount,
    completed: !crashed,
    restartCount: 0,
    sessionId: meta.id ?? "?",
  };

  return { e1, e2, e3 };
}
