# Changelog: pilot-r4 → pilot-r5

**Datum:** 2026-03-11
**Zdůvodnění:** DIAGNOSIS.md pilot-r4

---

## Změny v AGENTS.md

### Fix 1: Nahradit globální completion cue preflight checkpointem

**Bylo:**
```
## Goal

Implement the dunning system (billing reminder state machine) specified in
GitHub Issue #1. Deliver a modular, documented, publishable TypeScript package.

You are done when:
- Every acceptance criterion from Issue #1 has at least one test
- `npx vitest run` reports zero failures
- All implementation issues are closed
```

**Je:**
```
## Goal

Implement the dunning system (billing reminder state machine) specified in
GitHub Issue #1. Deliver a modular, documented, publishable TypeScript package.

## Process

0. Before any code changes, print a short preflight checklist confirming:
   - I read AGENTS.md
   - I read Issue #1
   - I will create implementation issues before coding
   - I will use one branch per issue
   - I will write a failing test before implementation
```

**Pozorování (r4):** Agent převzal produktový cíl z Issue #1, ale jeho
pracovní smyčka se zredukovala na `todo -> write/edit -> checks -> done`.
V transcriptu není důkaz, že by procesní část `AGENTS.md` aktivoval jako
workflow.

**Diagnóza:** Problém r4 není nedostatek completion criteria obecně, ale
jejich umístění. Blok `You are done when ...` v Goal je silný completion cue,
který může přebít workflow. Minimální další iterace proto nemá přidávat další
guardraily, ale nahradit tento globální signal jediným ověřitelným preflight
checkpointem na začátku Process.

**Literatura:** Hassan 2025 SASE (Briefing vs. LoopScript), Razavi 2025
(targeted clarification), AGENTbench 2026 (prefer restructuring over adding)
