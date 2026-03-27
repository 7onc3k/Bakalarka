/**
 * Sazby pro odhad E1 (náklad v USD) z tokenů v OpenCode exportu.
 *
 * Výchozí hodnoty odpovídají orientačnímu veřejnému ceníku MiniMax-M2.5
 * přes Alibaba Cloud Model Studio (řádově 0,20 USD / 1M vstupních tokenů,
 * 0,95 USD / 1M výstupních — ověřit před obhajobou u aktuálního ceníku).
 * Cache read/write mají vlastní sazby (implicitní cache u MiniMax zahrnuta
 * v reportingu OpenCode jako cache.read / cache.write).
 *
 * Přepsání bez změny kódu:
 *   BP_E1_USD_PER_M_INPUT
 *   BP_E1_USD_PER_M_OUTPUT
 *   BP_E1_USD_PER_M_CACHE_READ
 *   BP_E1_USD_PER_M_CACHE_WRITE
 */

export interface E1UsdPerMillionRates {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

function parseEnvUsd(key: string, fallback: number): number {
  const v = process.env[key];
  if (v === undefined || v === "") return fallback;
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function getE1UsdPerMillionRates(): E1UsdPerMillionRates {
  return {
    input: parseEnvUsd("BP_E1_USD_PER_M_INPUT", 0.2),
    output: parseEnvUsd("BP_E1_USD_PER_M_OUTPUT", 0.95),
    cacheRead: parseEnvUsd("BP_E1_USD_PER_M_CACHE_READ", 0.02),
    cacheWrite: parseEnvUsd("BP_E1_USD_PER_M_CACHE_WRITE", 0.2),
  };
}

/** Součet nákladů za jeden request-krok v USD (tokeny / 1e6 * sazba). */
export function stepCostUsd(
  input: number,
  output: number,
  reasoning: number,
  cacheRead: number,
  cacheWrite: number,
  rates: E1UsdPerMillionRates
): number {
  const outBillable = output + reasoning;
  return (
    (input / 1_000_000) * rates.input +
    (outBillable / 1_000_000) * rates.output +
    (cacheRead / 1_000_000) * rates.cacheRead +
    (cacheWrite / 1_000_000) * rates.cacheWrite
  );
}
