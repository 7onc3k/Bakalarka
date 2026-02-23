# Q4 — Acceptance Criteria Coverage

You are evaluating whether a coding agent's test suite covers all 24 acceptance criteria from the specification.

## Input

You will receive:
1. The 24 acceptance criteria (numbered AC1–AC24) from the specification
2. All test files produced by the agent

## Task

For each acceptance criterion (AC1–AC24), determine:
- **Is there a test that covers it?** (yes/no)
- **Which test?** (test name or `null`)

A test "covers" an AC if it verifies the described behavior — the Given/When/Then conditions. Partial coverage (e.g. tests the transition but not the action descriptor) counts as covered.

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

`mapping` keys are AC1–AC24. Value is the test name (from `it()` / `test()`) or `null` if not covered.
