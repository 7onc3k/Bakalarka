# Changelog: pilot-r3 → pilot-r5

**Datum:** 2026-03-18
**Zdůvodnění:** Diagnostika r3 + r4 regrese (viz kap04)
**Baseline:** r3 (návrat po r4 regresi, DSR build-evaluate cyklus — Peffers 2008)

**Poznámka:** R5 vychází z r3, ne z r4. R4 přidalo deklarativní pravidlo
o API kontraktu do Constraints a vitest do checklistu. Obě změny nepomohly
a r4 regresovalo. R5 proto vrací Constraints na r3 verzi a místo
deklarativního pravidla přidává procedurální verifikaci do Process.

---

## Změny v AGENTS.md

### Fix 1: API contract field verification (Q2)

**Bylo (Process bod 4):**
```
4. Before every PR, run these checks and fix all issues before opening:
   - `tsc --noEmit` — zero type errors
   - `npx eslint src/ --max-warnings 0` — zero lint warnings (includes complexity violations)
```

**Je:**
```
4. Before every PR, run these checks and fix all issues before opening:
   - `tsc --noEmit` — zero type errors
   - `npx eslint src/ --max-warnings 0` — zero lint warnings. Your ESLint config must include `"complexity": ["warn", 10]`.
   - Verify API contract compliance: every field in the API Contract types (e.g. `pausedElapsed`, `pausedFrom`) must be read and used in your implementation logic — not just written. If a field is defined but never read, fix it before opening the PR.
```

**Pozorování (r3):** Q2 = 41/42. Agent implementoval pause/resume vlastním
přístupem (posunutí `stateEnteredAt` zpět v čase) místo použití pole
`pausedElapsed` z API kontraktu. Agent pole správně zapisoval při pause,
ale při resume ho "spotřeboval" (zakódoval do posunutého `stateEnteredAt`)
a smazal ze stavu. Specifikace přitom jednoznačně vyžaduje zachování
elapsed time a API kontrakt poskytuje pole pro tento účel.

R4 zkusilo deklarativní pravidlo v Constraints ("every field must be used")
— nepomohlo. Vzorec z pilotu ukazuje, že procedurální verifikace
v Process (git log check pro P3, gh issue list pro P2, JSDoc check pro Q8)
je účinnější než deklarativní pravidla. R5 proto přidává API contract
compliance jako verifikační krok v pre-PR checklistu.

**Literatura:** Breunig 2025 (restructure, don't repeat), Mao FSE 2025
(Workflow checkpoints > Constraints alone), Lulla 2026 (enforceable gates)

---

### Fix 2: ESLint complexity config (Q5/Q7)

**Bylo:**
```
- `npx eslint src/ --max-warnings 0` — zero lint warnings (includes complexity violations)
```

**Je:**
```
- `npx eslint src/ --max-warnings 0` — zero lint warnings. Your ESLint config must include `"complexity": ["warn", 10]`.
```

**Pozorování (r3):** Q5 = 1 warning, Q7 = 1 complexity violation. Funkce
`processTick` má cyklomatickou složitost 15 (práh 10). Agent spustil eslint
s vlastním configem, který neobsahoval pravidlo `complexity` — dostal 0
warningů a považoval kód za hotový. Experiment měří Q5/Q7 s fixním configem
který complexity pravidlo zahrnuje. Agent nemohl opravit problém, o kterém
nevěděl.

R5 explicitně vyžaduje complexity pravidlo v agentově ESLint configu.
Tím se odstraňuje disconnect mezi tím co agent vidí a co experiment měří.

**Literatura:** Lulla 2026 (quality gate musí být enforceable)
