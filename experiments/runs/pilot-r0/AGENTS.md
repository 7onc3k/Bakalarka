# AGENTS.md — Dunning System

## Specification

Read GitHub Issue #1 — it contains:
- **Acceptance Criteria** — your implementation must satisfy all of them
- **Domain Glossary** — use these terms consistently in code
- **Out of Scope** — do not implement these items

## Environment

OpenCode (https://opencode.ai/docs) with GitHub CLI, Git, and Node.js tooling.

## Output

Working, tested code committed to the repository.
Commit your changes as you progress — do not wait until the end.
Do not rewrite git history (no amend, squash, rebase, or force-push).

## Planning

Before writing any implementation code, create a short design document:
1. List the modules/files you will create and their responsibilities.
2. Define the key data types and their relationships.
3. Sketch the public API (function signatures, inputs, outputs).

Update this document as your understanding evolves.

**Constraint:** Do not start writing implementation code until you have
documented your design decisions.

## Testing

Follow strict Test-Driven Development from the specification:

For each acceptance criterion:
1. Write a failing unit test derived from the spec (expected values
   come from acceptance criteria, not from code).
2. Run the test and verify it fails.
3. Write the minimum implementation to make it pass.
4. Refactor if needed, then move to the next criterion.

**Constraint:** Do not write implementation code without a corresponding
failing test. Do not derive expected values from observing code behavior.

## Process

Satisfy all acceptance criteria with correct, working code and tests.
Use your best judgment for everything else.
