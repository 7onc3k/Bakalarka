# Experiment Design — Meta vs Explicit Instructions

## Research Question

Do meta-level instructions (what + why) outperform explicit method-based
instructions (what + how) for coding agent scaffolding?

## Instruction Style Distinction

| Aspect | Meta (what + why) | Explicit (what + how) |
|--------|-------------------|----------------------|
| Goal | ✓ States what to do | ✓ States what to do |
| Motivation | ✓ Explains WHY (rationale) | - |
| Method | - Agent decides | ✓ Specifies HOW (approach from literature) |
| Constraint | ✓ What not to do | ✓ What not to do |

Literature grounding for the distinction:
- FSE 2025 "From Prompts to Templates": Directive (what) + Context (why) vs Method (how)
- Suzgun 2024: meta-prompting = goal-level, task-specific = method-level
- SASE (Hassan 2025): BriefingScript (goal+context) vs LoopScript (method+steps)

## Three Dimensions

### P — Planning/Design

**Meta (what + why):**
Design solution structure before coding. WHY: upfront design prevents
ad-hoc decisions (Perry & Wolf 1992).

**Explicit (what + how):**
Design using: information hiding (Parnas 1972), type-driven design,
separation of concerns, interface-first approach.

### O — Organization

**Meta (what + why):**
Organize into sub-tasks, separate roles, TDD from spec. WHY: feature-level
tasks fail more (FeatureBench 2026), test oracle problem (Mathews 2024).

**Explicit (what + how):**
Use: feature decomposition with dependency ordering, role separation
(Wang 2024), spec-first TDD (Mathews 2024), tracked progress via issues.

### Q — Quality

**Meta (what + why):**
Set up quality feedback before implementation. WHY: quality gates catch
problems early (Papadakis 2019).

**Explicit (what + how):**
Use: static analysis + formatter, test coverage gates, CI pipeline
(Lulla 2026), mutation testing (Papadakis 2019).

## Balanced Fractional Factorial Design (6 runs)

| Run | P | O | Q |
|-----|---|---|---|
| R0  | meta | meta | meta |
| R1  | meta | meta | explicit |
| R2  | meta | explicit | explicit |
| R3  | explicit | meta | meta |
| R4  | explicit | explicit | meta |
| R5  | explicit | explicit | explicit |

Each dimension: exactly 3× meta, 3× explicit (perfectly balanced).

### Clean Pairwise Comparisons

| Dimension | Pair 1 (one context) | Pair 2 (other context) |
|-----------|---------------------|----------------------|
| P | R0 ↔ R3 (O=m, Q=m) | R2 ↔ R5 (O=e, Q=e) |
| O | R1 ↔ R2 (P=m, Q=e) | R3 ↔ R4 (P=e, Q=m) |
| Q | R0 ↔ R1 (P=m, O=m) | R4 ↔ R5 (P=e, O=e) |

Plus: R0 vs R5 = overall meta vs explicit.

## Fixed Components (same for all runs)

- **OpenCode system prompt** (qwen.txt) — model identity, no-comments rule,
  lint/typecheck advice, security (not ours to modify)
- **AGENTS.md header** — spec reference (Issue #1), environment (OpenCode +
  docs link), output expectation (committed, tested code)
- **Minimal repo** — AGENTS.md, .opencode/config.json (GLM-5), auto-continue plugin, .gitignore
- **Spec** — Issue #1 requirements only (no architecture layer)

## File Structure

```
experiments/
  agents-md/
    header.md         ← fixed (spec + environment + output)
    p-meta.md         ← what + why
    p-explicit.md     ← what + how (info hiding, type-driven, SoC)
    o-meta.md         ← what + why
    o-explicit.md     ← what + how (decomposition, roles, TDD)
    q-meta.md         ← what + why
    q-explicit.md     ← what + how (static analysis, CI, mutation testing)
  infra/
    auto-continue.ts  ← OpenCode plugin (idle → check → restart)
  runs/
    <run-name>/       ← created by new-run.sh per experiment
      AGENTS.md
      .opencode/
      transcript.json ← opencode export after run
  scripts/
    new-run.sh        ← --run R0-R5, creates repo + runs agent
    issue-1-req-only.json
```

## Metrics

- **Mutation score** (Stryker) — test quality
- **Test pass rate** — correctness
- **Restart count** — auto-continue triggers
- **Token usage** — efficiency
- **Behavioral trace** — git log, issue count, file structure, CI presence
- **LLM-as-judge** — code quality assessment

## Dimension Selection Justification

Three dimensions derived from systematic analysis:
1. SASE (Hassan 2025): BriefingScript → fixed, LoopScript → O,
   MentorScript/AEE → Q, architectural → P
2. Wang 2024 taxonomy: Team Organization → O, Decision Making → P,
   Testing/QA → Q
3. RepairAgent (Bouzenia 2025): component ablation precedent for
   independent dimensions
4. Independence: P (what to build), O (how to work), Q (how to verify)
5. Observability: each produces distinct artifacts

Previously correlated variables (M1-M5) were consolidated into O:
decomposition, role separation, workflow, TDD are facets of work
organization (What/Who/How/When of the same process).
