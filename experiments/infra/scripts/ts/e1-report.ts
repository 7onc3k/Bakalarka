/**
 * Výpis E1: vstup = max. (input+cache) na kroku, výstup = Σ, cache = Σ read+write,
 * vše tisíce (zaokrouhleno).
 */

import type { E1Result } from "./shared.js";
import { e1InputOutputThousands, formatNumber } from "./shared.js";

/**
 * Řádek začínající „E1 … (tis.)“ parsuje summary.ts (flexibilní regex).
 */
export function formatE1Block(e1: E1Result): string {
  const { inputTis, outputTis, cacheTis } = e1InputOutputThousands(e1);
  return [
    `E1 vstup (max. krok, vč. cache) / výstup (Σ) / Σ cache (tis.) — ${inputTis} / ${outputTis} / ${cacheTis}`,
    `E1 raw — max input (pole): ${formatNumber(e1.peakInputTokens)} | max vstup+vč. cache (1 krok): ${formatNumber(e1.peakPromptTokens)} | Σ výstup (+reasoning): ${formatNumber(e1.sumOutputTokens)} | Σ cache read+write: ${formatNumber(e1.sumCacheReadTokens + e1.sumCacheWriteTokens)} | Σ vstup přes kroky (diag.): ${formatNumber(e1.sumInputTokens)}`,
  ].join("\n");
}
