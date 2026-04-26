# Q4 — Acceptance Criteria Coverage

You are evaluating whether a coding agent's test suite covers the acceptance criteria from the specification.

## Input

You will receive:
1. The numbered acceptance criteria (AC1–AC25) extracted from the specification
2. All test files produced by the agent

## Task

For each acceptance criterion (AC1–AC25), determine:
- **Is there a test that covers it?** (yes/no)
- **Which test?** (test name or `null`)

A test "covers" an AC if it verifies the described behavior — the Given/When/Then conditions. Partial coverage (e.g. tests the transition but not the action descriptor) counts as covered.

IMPORTANT: There are exactly 25 acceptance criteria (AC1–AC25). Do NOT add, invent, or split criteria. Your mapping must have exactly 24 entries. If you are unsure about an AC, mark it as not covered rather than inventing a new one.

## Output

Respond with ONLY a JSON object:
```json
{
  "covered": [1, 2, 3],
  "not_covered": [4, 5],
  "total": 25,
  "score": "21/24",
  "mapping": {
    "AC1": "test name that covers it",
    "AC2": "another test name",
    "AC3": null
  }
}
```

RULES:
- `total` MUST be 25
- `mapping` keys MUST be exactly AC1 through AC25 (no more, no less)
- `covered` + `not_covered` lengths MUST sum to 25
- `score` format: "N/25" where N = length of covered array
