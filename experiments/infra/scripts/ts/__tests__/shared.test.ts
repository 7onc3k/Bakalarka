/**
 * Unit testy pro shared.ts — utility funkce experimentalni infrastruktury.
 *
 * Testuje:
 * - exec() — wrapper nad execSync s error handling
 * - parseOpenCodeOutput() — NDJSON parser pro OpenCode vystup
 * - countMatches() — pocitani regex matchů v textu
 */

import { describe, it, expect } from "vitest";
import { exec, parseOpenCodeOutput, countMatches } from "../shared.js";

// ============================================================================
// exec()
// ============================================================================

describe("exec()", () => {
  it("vraci stdout pri uspechu", () => {
    const result = exec("echo hello");
    expect(result).toBe("hello");
  });

  it("vraci stdout z err.stdout pri non-zero exit code", () => {
    // Prikaz vypise do stdout a pak exitne s 1
    const result = exec("echo 'some output' && exit 1");
    expect(result).toBe("some output");
  });

  it("vraci fallback kdyz cmd neexistuje", () => {
    const result = exec("command_that_does_not_exist_xyz_123", {}, "FALLBACK");
    expect(result).toBe("FALLBACK");
  });

  it("respektuje cwd option", () => {
    const result = exec("pwd", { cwd: "/tmp" });
    expect(result).toBe("/tmp");
  });
});

// ============================================================================
// parseOpenCodeOutput()
// ============================================================================

describe("parseOpenCodeOutput()", () => {
  it("extrahuje text z jednoho text eventu", () => {
    const input = '{"type":"text","part":{"text":"hello"}}';
    expect(parseOpenCodeOutput(input)).toBe("hello");
  });

  it("spoji vice text eventu do jednoho stringu", () => {
    const input = [
      '{"type":"text","part":{"text":"hello "}}',
      '{"type":"text","part":{"text":"world"}}',
    ].join("\n");
    expect(parseOpenCodeOutput(input)).toBe("hello world");
  });

  it("ignoruje eventy typu step_start a step_finish", () => {
    const input = [
      '{"type":"step_start","part":{"name":"compile"}}',
      '{"type":"text","part":{"text":"result"}}',
      '{"type":"step_finish","part":{"name":"compile"}}',
    ].join("\n");
    expect(parseOpenCodeOutput(input)).toBe("result");
  });

  it("ignoruje prazdne radky", () => {
    const input = [
      "",
      '{"type":"text","part":{"text":"hello"}}',
      "",
      '{"type":"text","part":{"text":" world"}}',
      "",
    ].join("\n");
    expect(parseOpenCodeOutput(input)).toBe("hello world");
  });

  it('vraci "" pro prazdny vstup', () => {
    expect(parseOpenCodeOutput("")).toBe("");
  });
});

// ============================================================================
// countMatches()
// ============================================================================

describe("countMatches()", () => {
  it("vraci 0 pro zadny match", () => {
    expect(countMatches("hello world", /xyz/g)).toBe(0);
  });

  it("vraci spravny pocet pro vicenasobne matche", () => {
    expect(countMatches("aaa bbb aaa", /aaa/g)).toBe(2);
  });

  it("funguje s globalnim flagem", () => {
    const input = "test: add unit tests\nfeat: implement X\ntest: fix flaky spec\nfix: typo";
    expect(countMatches(input, /^test:/gm)).toBe(2);
  });
});
