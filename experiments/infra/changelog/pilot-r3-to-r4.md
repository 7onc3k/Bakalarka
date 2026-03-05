# Changelog: pilot-r3 → pilot-r4

**Datum:** 2026-03-05
**Zdůvodnění:** DIAGNOSIS.md pilot-r3

---

### Fix 1: Pre-PR vitest check — zero test failures

**Bylo:**
```
4. Before every PR, run these checks and fix all issues before opening:
   - `tsc --noEmit` — zero type errors
   - `npx eslint src/ --max-warnings 0` — zero lint warnings (includes complexity violations)
```

**Je:**
```
4. Before every PR, run these checks and fix all issues before opening:
   - `tsc --noEmit` — zero type errors
   - `npx eslint src/ --max-warnings 0` — zero lint warnings (includes complexity violations)
   - `npx vitest run` — zero test failures
```

**Pozorování (r3):** Q2 = 36/45 — agent otevřel PR kde 9 ref testů selhávalo
(business-days import bug + pause-resume logika). Pre-PR checklist neobsahoval
vitest check, takže agent mergoval bez ověření funkčnosti.

**Diagnóza:** Lulla 2026: quality gate těsně před výstupem (PR) je vymáhán
spolehlivěji než obecný požadavek. Mao et al. 2025 FSE (Workflow komponenta):
verifikační checkpoint mechanicky nutí agenta ověřit stav. Bez vitest v checklistu
agent nemá signál že testy selhávají.

**Literatura:** Lulla 2026, Mao et al. 2025 FSE (Workflow)

---

### Fix 2: Success criteria v Goal — explicitní definice "done"

**Bylo:**
```
## Goal

Implement the dunning system (billing reminder state machine) specified in
GitHub Issue #1. Deliver a modular, documented, publishable TypeScript package.
```

**Je:**
```
## Goal

Implement the dunning system (billing reminder state machine) specified in
GitHub Issue #1. Deliver a modular, documented, publishable TypeScript package.

You are done when:
- Every acceptance criterion from Issue #1 has at least one test
- `npx vitest run` reports zero failures
- All implementation issues are closed
```

**Pozorování (r3, první pokus):** Agent zastavil po 4/9 issues bez jasného
signálu proč. Auto-continue plugin pak nerestartoval (bug). Bez explicitní
definice "done" agent sám rozhodne kdy je hotový — a může rozhodnout příliš brzo.

**Diagnóza:** Hassan 2025 SASE (BriefingScript): success criteria jsou součástí
BriefingScript — agent potřebuje vědět co je cílový stav. Breunig 2025:
vágní cíl ("deliver a package") je interpretován minimalisticky. Explicitní
verifikovatelná kritéria dávají agentovi konkrétní exit podmínky.

**Literatura:** Hassan 2025 SASE (BriefingScript), Breunig 2025
