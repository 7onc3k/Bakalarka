# pilot-r3 Diagnosis

**Datum:** 2026-03-05
**Navazuje na:** FINDINGS.md

## Shrnutí

r3 dosáhl P1-P5 = 5/5 poprvé — všechny procesní fixy z r2 fungovaly.
Q8 = 3/3 (průlom z 1/3). Zbývají implementační mezery: Q2 = 36/45
(business-days import bug + pause-resume logika), Q5 = 1 lint warning,
Q7 = 1 complexity violation. Hlavní cíl r4: Q2 = 45/45.

---

## Selhání k diagnostice

| Selhání | Exit kritérium | Výsledek |
|---------|----------------|----------|
| Q2 Ref test pass rate | 45/45 | ❌ 36/45 |
| Q5 Lint warnings | 0 | ❌ 1 |
| Q7 Code complexity | 0 violations >10 | ❌ 1 violation |

**Mimo diagnostiku:** P1-P5, P6-P8, Q1, Q3, Q4, Q6 a Q8 jsou v r3 dostatečně
silné a nejsou primárním kandidátem na další instrukční fix.

## 2.1 FSE 2025 komponentová analýza

| Komponenta | Přítomna? | Pozice | Kvalita |
|------------|-----------|--------|---------|
| Role | ✅ | 1. | "senior TypeScript developer" — jasná |
| Directive | ✅ | 2. | "Implement the dunning system" — imperativní |
| Context | ✅ | 3. | Environment + Specification odkaz na Issue #1 |
| Workflow | ✅ | 4. | Process sekce, 5 kroků a→e + verifikační checkpoint |
| Output | ✅ | 5. | Package Quality — modular, strict TS, clean API |
| Constraints | ✅ | 6. | Constraints sekce + pre-PR JSDoc guardrail |
| Examples | ❌ | -- | Chybí konkrétní příklady dobrého výstupu |

**Závěr FSE:** Komponenty dobře strukturované a v doporučeném pořadí.
Constraints sekce nyní obsahuje enforcement mechanism (pre-PR JSDoc check).
Chybí Examples — agent nemá vzor jak vypadá dobré issue/PR/commit.

---

## 2.2 SASE script balance

| Script | Obsah | Řádky | % |
|--------|-------|-------|---|
| BriefingScript | Role + Goal + Specification + Environment | ~15 | 23% |
| LoopScript | Process (kroky 1-4), Workflow | ~25 | 38% |
| MentorScript | Package Quality + Constraints (6 pravidel) | ~25 | 38% |

**Závěr SASE:** Dobrá rovnováha. BriefingScript mírně slabší — chybí
explicitní success criteria ("jak poznám že jsem hotový?"). To může
vysvětlit proč agent implementoval jen 4/9 issues v původním r3 pokusu.

---

## 2.3 Lulla 2026 content check

Efektivní obsah (přítomen):
- [x] Architecture / project structure (Package Quality — modular arch)
- [x] Coding conventions (strict TS, no any, conventional commits)
- [x] Project description (Goal sekce)

Neefektivní obsah (nepřítomen):
- [ ] Verbose step-by-step procedures — workflow je stručný ✅
- [ ] Directory trees — nejsou ✅
- [ ] Redundance s README/docs — není ✅

**Závěr Lulla:** AGENTS.md je lean. Žádný zjevný verbosity problem.

---

## 2.4 Breunig: remaining issues

### B1: Q2 — business-days import neshoda

**Pozorování (r3):** `business-days.test.ts` = 0 spuštěných testů.
Ref testy importují z `../../src/businessDays.js`, agent exportoval
funkci ale pod jiným jménem nebo s jiným case.

**Diagnóza:** Instrukce nespecifikuje přesné jméno souborů ani exportů
v src/. Agent má volnost v pojmenování. Spec (Issue #1) API contract
definuje jen `createInstance` a `process` — helpery jako `businessDays`
nejsou součástí kontraktu. Ale ref testy na nich závisí.

**Pozn.:** Toto je spíš infra problém — ref testy předpokládají konkrétní
interní naming. Nepatří do AGENTS.md fixů.

### B2: Q2 — pause-resume elapsed time

**Pozorování (r3):** 1 ref test selhává: "resume preserves elapsed time
— timeout continues from where it left off". Agent implementoval pause/resume
ale ignoroval kumulaci elapsed time při opakovaném pozastavení.

**Diagnóza:** Spec (Issue #1) popisuje: "the timeout resumes from where it
left off". Agent implementoval zjednodušenou verzi. Instrukce neobsahuje
guardrail pro edge cases implementace. Toto je implementační detail, ne
procesní selhání — těžko addressovat přes AGENTS.md.

**Návrh:** Přidat do Constraints odkaz na spec: "Before PR, verify your
implementation passes `tsc --noEmit` AND `npx vitest run` — zero failures."
(vitest check je aktuálně jen doporučení, ne enforced)

### B3: Q5/Q7 — drobnosti (1 lint warning, 1 complexity violation)

**Pozorování (r3):** Q5 = 1 warning přes iterace (r2=1, r3=1).
Q7 = 1 violation (nový v r3).

**Diagnóza:** Process sekce bod 4 říká "fix all issues before opening PR"
pro tsc + eslint. Ale agent to evidentně nekontroluje důsledně pro každý PR,
nebo complexity violation vznikla po lint checku.

**Návrh (Breunig):** Přidat complexity check do pre-PR příkazů explicitně.
Aktuálně je ESLint complexity rule v configu, ale agent neví že komplexita
je součástí lint check.

---

## 2.5 Návrhy fixů pro r4

### Fix 1: Pre-PR vitest check (enforcement)

**Bylo (Process bod 4):**
```
Before every PR, run these checks and fix all issues before opening:
- `tsc --noEmit` — zero type errors
- `npx eslint src/ --max-warnings 0` — zero lint warnings (includes complexity violations)
```

**Je:**
```
Before every PR, run these checks and fix ALL issues before opening:
- `tsc --noEmit` — zero type errors
- `npx eslint src/ --max-warnings 0` — zero lint warnings (includes complexity violations)
- `npx vitest run` — zero test failures (your own tests must pass)
```

**Pozorování (r3):** Q2 = 36/45 — agent otevřel PR kde ref testy selhávají.
Pre-PR vitest check by donutil agenta opravit implementaci před mergem.

**Diagnóza:** Lulla 2026: quality gate těsně před výstupem vymáhán spolehlivěji.
Mao et al. 2025 FSE: verifikační checkpoint > textový požadavek.

**Literatura:** Lulla 2026, Mao et al. 2025 FSE (Workflow komponenta)

---

### Fix 2: Success criteria v BriefingScript

**Bylo (Goal sekce):**
```
Implement the dunning system (billing reminder state machine) specified in
GitHub Issue #1. Deliver a modular, documented, publishable TypeScript package.
```

**Je:**
```
Implement the dunning system specified in GitHub Issue #1. You are done when:
- All acceptance criteria from Issue #1 have a test and pass
- `npx vitest run` reports zero failures
- All open implementation issues are closed
```

**Pozorování (r3):** Agent implementoval jen 4/9 issues v prvním (neúplném)
pokusu — zastavil se bez jasného signálu co "done" znamená.

**Diagnóza:** Hassan 2025 SASE (BriefingScript): success criteria jsou součástí
BriefingScript. Bez explicitních kritérií agent sám rozhodne co je hotové.

**Literatura:** Hassan 2025 SASE, Breunig 2025
