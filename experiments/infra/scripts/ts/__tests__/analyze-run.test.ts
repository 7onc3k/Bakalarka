/**
 * Unit testy pro analyze-run.ts — extrahovane pomocne funkce.
 *
 * Testuje:
 * - rewriteImports() — prepis import cest referencnich testu
 * - parseVitestPassed() — extrakce poctu passed testu z vitest vystupu
 */

import { describe, it, expect } from "vitest";
import { rewriteImports, parseVitestPassed } from "../analyze-run.js";

// ============================================================================
// rewriteImports()
// ============================================================================

describe("rewriteImports()", () => {
  it('prepise from "../index.js" na from "../../src/index.js"', () => {
    const input = 'import { createInstance } from "../index.js";';
    const expected = 'import { createInstance } from "../../src/index.js";';
    expect(rewriteImports(input)).toBe(expected);
  });

  it('prepise from "../business-days.js" na from "../../src/business-days.js"', () => {
    const input = 'import { isBusinessDay } from "../business-days.js";';
    const expected =
      'import { isBusinessDay } from "../../src/business-days.js";';
    expect(rewriteImports(input)).toBe(expected);
  });

  it('prepise from "../foo-bar.js" na from "../../src/foo-bar.js"', () => {
    const input = 'import { fooBar } from "../foo-bar.js";';
    const expected = 'import { fooBar } from "../../src/foo-bar.js";';
    expect(rewriteImports(input)).toBe(expected);
  });

  it("zachova import type a stale prepise cestu", () => {
    const input = 'import type { Config } from "../index.js";';
    const expected = 'import type { Config } from "../../src/index.js";';
    expect(rewriteImports(input)).toBe(expected);
  });

  it('nemeni importy z "vitest" nebo jinych packages', () => {
    const input = [
      'import { describe, it, expect } from "vitest";',
      'import { something } from "lodash";',
      'import { helper } from "../utils.js";',
    ].join("\n");
    const expected = [
      'import { describe, it, expect } from "vitest";',
      'import { something } from "lodash";',
      'import { helper } from "../../src/utils.js";',
    ].join("\n");
    expect(rewriteImports(input)).toBe(expected);
  });
});

// ============================================================================
// parseVitestPassed()
// ============================================================================

describe("parseVitestPassed()", () => {
  it('extrahuje 34 z "Tests  34 passed (37)"', () => {
    expect(parseVitestPassed("Tests  34 passed (37)")).toBe(34);
  });

  it('extrahuje 45 z "Tests  45 passed (45)"', () => {
    expect(parseVitestPassed("Tests  45 passed (45)")).toBe(45);
  });

  it("vraci posledni match kdyz je vice radku s passed", () => {
    const output = [
      "Test Files  4 passed (7)",
      "Tests  34 passed (37)",
    ].join("\n");
    expect(parseVitestPassed(output)).toBe(34);
  });

  it("vraci 0 kdyz zadny passed ve vystupu", () => {
    expect(parseVitestPassed("some random output\nno matches here")).toBe(0);
  });
});
