# Q4 — Acceptance Criteria Coverage

You are evaluating whether a coding agent's test suite covers the acceptance criteria from the specification.

## Input

You will receive:
1. The numbered acceptance criteria (AC1–AC24) extracted from the specification
2. All test files produced by the agent

## Task

For each acceptance criterion (AC1–AC24), determine:
- **Is there a test that covers it?** (yes/no)
- **Which test?** (test name or `null`)

A test "covers" an AC if it verifies the described behavior — the Given/When/Then conditions. Partial coverage (e.g. tests the transition but not the action descriptor) counts as covered.

IMPORTANT: There are exactly 24 acceptance criteria (AC1–AC24). Do NOT add, invent, or split criteria. Your mapping must have exactly 24 entries. If you are unsure about an AC, mark it as not covered rather than inventing a new one.

## Output

Respond with ONLY a JSON object:
```json
{
  "covered": [1, 2, 3],
  "not_covered": [4, 5],
  "total": 24,
  "score": "21/24",
  "mapping": {
    "AC1": "test name that covers it",
    "AC2": "another test name",
    "AC3": null
  }
}
```

RULES:
- `total` MUST be 24
- `mapping` keys MUST be exactly AC1 through AC24 (no more, no less)
- `covered` + `not_covered` lengths MUST sum to 24
- `score` format: "N/24" where N = length of covered array
