# AGENTS.md — Dunning System

## Goal

Implement the dunning system specified in Issue #1. Use test-driven development — write a failing test before any implementation code. Organize work into GitHub issues, one branch per issue.

## Specification

Read GitHub Issue #1 for the full specification:
- **Acceptance Criteria** — your implementation must satisfy all of them
- **API Contract** — the exact TypeScript types and function signatures you must export
- **Domain Glossary** — use these terms consistently in code
- **Out of Scope** — do not implement these items

## Environment

- Runtime: Node.js with TypeScript (strict mode, ESM)
- Test runner: Vitest (`npm test`)
- Build: `tsc` (`npm run build`)
- Tools: GitHub CLI (`gh`), Git

## Project Structure

```
src/index.ts          -- public API: createInstance(), process(), types
tests/                -- test files (one per feature area)
.github/workflows/    -- CI pipeline
```

## Workflow

**Step 1: Decompose.** Before writing any code, create a GitHub issue for each sub-task. The first issue must be project setup including CI pipeline (GitHub Actions running `npm test` and `npm run build`).

```bash
gh issue create --title "..." --body "..."
```

**Step 2: Implement.** Work through issues one at a time:

```bash
# Start from main
git checkout main && git pull
git checkout -b issue-N-short-description

# TDD cycle (repeat for each acceptance criterion in this issue):
#   write failing test → commit → implement → commit

npm test                          # MUST fail (red)
git add tests/ && git commit -m "test: ..."
npm test                          # MUST pass (green)
git add src/ && git commit -m "feat: ..."

# Verify before PR
tsc --noEmit                      # MUST pass (no type errors)

# Done with this issue — PR, merge, next
gh pr create --title "..." --body "Closes #N"
gh pr checks --watch              # wait for CI to pass
gh pr merge --merge

# THEN start the next issue from main
git checkout main && git pull
git checkout -b issue-M-next-description
# ... repeat TDD cycle ...
```

**Step 3: Finalize.** Write a README.

## Constraints

- **One issue per branch.** Never combine multiple issues into one branch, even if they seem related or interdependent. `issue-5-11-dunning-core` is wrong — implement `issue-5-createinstance`, merge it, then start `issue-6-transitions` from updated main.
- **Never implement without a failing test.** Run `npm test` and see it fail before writing implementation code.
- **Never modify a test to match your implementation.** Tests encode the spec. If a test fails after implementation, fix `src/` — never change `tests/`.
- **Never rewrite git history.** No amend, squash, rebase, or force-push.
