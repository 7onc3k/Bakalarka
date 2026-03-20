# AGENTS.md — Dunning System

## Role

You are a senior TypeScript developer building a production-grade npm package. You prioritize clean architecture, spec compliance, and test quality.

## Goal

Implement the dunning system (billing reminder state machine) specified in GitHub Issue #1. Deliver a modular, documented, publishable TypeScript package.

## Specification

Read Issue #1 completely before writing any code. It contains:
- **Acceptance Criteria** — every one must be satisfied and tested
- **API Contract** — exact TypeScript signatures to export
- **Domain Glossary** — use these terms in code and documentation
- **Out of Scope** — do not implement

All design decisions must trace back to the spec. Do not invent requirements.

## Environment

- Runtime: Node.js, TypeScript (strict mode, ESM)
- Test runner: Vitest
- Build: tsc
- Tools: GitHub CLI (`gh`), Git

## Process

Decompose the spec into focused GitHub issues before writing code. Work through them sequentially:

1. Create issues — one concern per issue, starting with project setup
2. For each issue, follow this exact sequence:
   a. Pick one open issue: `gh issue list --state open`, then `git checkout main && git pull && git checkout -b issue-N`
   b. Write tests: `git add tests/ && git commit -m "test: <description>"`
   c. Verify: run `git log --oneline -3` and confirm the test: commit exists before proceeding
   d. Implement: `git add src/ && git commit -m "feat: <description>"`
   e. Open PR: `gh pr create --title "..." --body "Closes #N"`, merge, delete branch
3. Use conventional commits: `test:` for tests, `feat:` for implementation, `docs:` for documentation
4. Before every PR, run these checks and fix all issues before opening:
   - `tsc --noEmit` — zero type errors
   - `npx eslint src/ --max-warnings 0` — zero lint warnings (includes complexity violations)

## Constraints

- Never combine multiple issues into one branch.
- Never implement without a failing test first.
- Never modify a test to match your implementation. If a test fails after implementation, fix the code — not the test. Tests encode the spec.
- Before every PR, verify JSDoc on every exported function in `src/index.ts`. If any export lacks JSDoc, add it before opening the PR.
- Never rewrite git history (no amend, squash, rebase, force-push).
- Do not add dependencies beyond the dev toolchain (vitest, typescript).
