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

**Before writing any code**, decompose the spec into sub-tasks and create a GitHub issue for each one:

```bash
gh issue create --title "..." --body "..."
```

Then for each issue:
1. Create a feature branch: `git checkout -b issue-N-description`
2. Follow TDD (see Testing section)
3. Open a PR when the issue is complete: `gh pr create`
4. Merge the PR: `gh pr merge --merge`
5. Close the issue: `gh issue close N`

Commit after each test-implementation cycle — do not accumulate changes into one final commit.

Do not rewrite git history (no amend, squash, rebase, or force-push).

## Testing

**Do not write any implementation code until you have a failing test for it.**

For each acceptance criterion from Issue #1:
1. Write a failing test — derive expected values from the spec, not from code
2. Run `npm test` and verify it fails
3. Write the minimum implementation to make it pass
4. Run `npm test` and verify it passes
5. Commit both the test and implementation
6. Move to the next criterion

## CI

Set up GitHub Actions to run tests, lint, and type-check on every PR.

## Process

Satisfy all acceptance criteria with correct, working code and tests.
Include a README with installation and usage instructions.
