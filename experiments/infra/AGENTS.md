# AGENTS.md — Dunning System

## Specification

Read GitHub Issue #1 — it contains the full specification including:
- **Acceptance Criteria** — your implementation must satisfy all of them
- **API Contract** — the exact TypeScript types and function signatures you must export
- **Domain Glossary** — use these terms consistently in code
- **Out of Scope** — do not implement these items

## Environment

OpenCode with GitHub CLI (`gh`), Git, and Node.js tooling available.

## Output

Working, tested npm package committed to the repository.

## Git Workflow

Track all work through GitHub Issues and Pull Requests:

1. **Decompose** the spec into sub-issues — decide yourself how to break up the work
2. **For each issue:** create a feature branch → implement → open PR → merge → close issue
3. **Commit** as you progress — commit after each meaningful change, not all at once
4. **If you discover a bug or unplanned work**, open a new issue before addressing it
5. Do not rewrite git history (no amend, squash, rebase, or force-push)

## Testing

Follow Test-Driven Development from the specification:

For each acceptance criterion:
1. Write a failing test derived from the spec (expected values from AC, not from code)
2. Verify it fails
3. Write minimum implementation to make it pass
4. Commit, then move to the next criterion

## CI

Set up GitHub Actions to run tests, lint, and type-check on every PR.

## Process

Satisfy all acceptance criteria with correct, working code and tests.
Include a README with installation and usage instructions.
Use your best judgment for everything not covered above.
