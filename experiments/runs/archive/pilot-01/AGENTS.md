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
Do not create planning or tracking files in the repository.

## Planning & Design

Before writing implementation code, design the solution structure —
what components will exist, what their responsibilities are, and how
data flows between them.

**Why:** Upfront design prevents ad-hoc structural decisions during coding.
Without explicit architecture, implementations grow inconsistently and
become difficult to change. Agents that skip design produce monolithic
code with tangled dependencies.

**Constraint:** Do not start writing implementation code until you have
documented your design decisions.

## Work Organization

Organize the implementation into manageable pieces — break the specification
into ordered sub-tasks, separate concerns into distinct roles, and write
tests from the specification before implementing.

**Why:** Feature-level tasks have significantly lower success rates than
isolated sub-tasks. Separating test authoring from implementation prevents
tests from validating buggy behavior instead of catching it.

**Constraint:** Do not implement the entire project in a single pass.
Do not derive test expected values from the code.

## Quality Infrastructure

Set up automated quality feedback before implementing business logic —
checks for correctness and consistency, meaningful test coverage requirements,
and continuous integration that enforces standards on every change.

**Why:** Automated quality gates catch problems earlier than manual review.
Without feedback loops, errors accumulate undetected and tests may achieve
high coverage while missing real bugs.

**Constraint:** Do not implement business logic without functioning
automated quality checks.
