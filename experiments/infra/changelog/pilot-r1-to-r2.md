# Changelog: pilot-r1 → pilot-r2

**Datum:** 2026-03-04
**Zdůvodnění:** DIAGNOSIS-pilot-r1.md

---

## Změny v AGENTS.md

### Fix 1: Rozepsat Process krok 2 na sub-kroky s git příkazy (P2 + P3)

**Bylo:**
```
2. For each issue: branch from main, write tests first, implement, PR with "Closes #N", merge
```

**Je:**
```
2. For each issue, follow this exact sequence:
   a. `git checkout main && git pull && git checkout -b issue-N` (one branch per issue, no exceptions)
   b. Write tests: `git add tests/ && git commit -m "test: <description>"`
   c. Implement: `git add src/ && git commit -m "feat: <description>"`
   d. Open PR: `gh pr create --title "..." --body "Closes #N"`, merge, delete branch
```

**Pozorování (r1):** P2: branches=4, issues=11 — agent kombinoval implementačně příbuzné issues do jedné branch. P3: 0× `test:` commit, 4× `feat:` commit — TDD jako princip byl ignorován, agent commitoval vše najednou.

**Diagnóza:** FSE 2025 (Mao et al.) — Workflow komponenta obsahovala 4 akce v jedné větě bez operacionalizace. Agent si "branch from main, write tests first, implement, PR" interpretoval volně. Dle Breunig/Razavi: opakování instrukce by nepomohlo — nutné přestrukturovat jako konkrétní git příkazy. Explicitní staging (`git add tests/` vs `git add src/`) mechanicky vynucuje separaci commitů.

**Literatura:** FSE 2025 Mao et al. (Workflow komponenta), Breunig 2025 (fighting the weights), Razavi 2025 (přestrukturování > opakování)

---

### Fix 2: Přidat `test:` commit jako explicitní sub-krok před `feat:` (P3)

**Bylo:**
```
Use conventional commits: `test:` for tests, `feat:` for implementation, `docs:` for documentation
```
(slovní instrukce v kroku 3 bez vazby na TDD sekvenci)

**Je:**
Integrováno do Fix 1 — sub-kroky 2b a 2c vyžadují separátní commit pro testy a separátní commit pro implementaci ve verifikovatelném pořadí. Konvenční commity zůstávají jako poznámka v kroku 3, ale TDD sekvence je nyní operacionalizována v kroku 2.

**Pozorování (r1):** P3 ❌ — `firstTestCommitBeforeImpl: false`, žádný test commit před implementací. Slovní "test: vs feat:" bez konkrétní staging sekvence nestačí.

**Diagnóza:** FSE 2025 — Directive musí být konkrétní a verifikovatelná. Bez explicitního `git add tests/` agentovi nic nebrání v `git add -A && git commit -m "feat: ..."`. Explicit staging je mechanický checkpoint, ne jen princip.

**Literatura:** FSE 2025 Mao et al. (Directive komponenta), Razavi 2025

---

### Fix 3: Rozlišit ref testy vs vlastní testy v Constraints (P5)

**Bylo:**
```
Never modify a test to match your implementation. Tests encode the spec — fix the code, not the test.
```

**Je:**
```
Never modify a test to match your implementation.
- `tests/_ref_tests/` are immutable — they encode the acceptance criteria from the spec. Never touch them.
- If one of your own tests (outside `_ref_tests/`) has a bug, you may fix the test, but explain why in the commit message.
Fix the code in `src/`, not the tests.
```

**Pozorování (r1):** P5 ❌ — 1 test soubor modifikován. Z behavioral trace není jasné zda šlo o ref test nebo vlastní — ale instrukce nerozlišovala tyto dva případy, takže agent neměl vodítko.

**Diagnóza:** FSE 2025 — Constraints musí být jednoznačné. "Never modify a test" je vágní pravidlo: platí pro immutable spec testy (ref), ale vlastní testy agenta opravit lze pokud je chyba v testu. Bez rozlišení agent buď modifikuje vše nebo nic. SASE MentorScript: recovery instrukce musí říkat konkrétně co dělat místo toho.

**Literatura:** FSE 2025 Mao et al. (Constraints komponenta), Hassan et al. 2025 SASE (MentorScript recovery)

---

### Fix 4: Přidat complexity self-check do Constraints (Q5 + Q7)

**Bylo:**
(žádná zmínka o complexity threshold ani lint jako gate)

**Je:**
```
Before every PR, run these checks and fix all issues before opening:
- `tsc --noEmit` — zero type errors
- `npx eslint src/ --max-warnings 0` — zero lint warnings (includes complexity violations)
```

**Pozorování (r1):** Q5=2 lint warnings, Q7=2 complexity violations (`process()=34`, `addBusinessDays=11`, práh=10). Agent spustil `tsc --noEmit` (instrukce to explicitně říkala), ale eslint jako gate chyběl. Výsledkem jsou dvě complexity violations které agent neodhalil.

**Diagnóza:** FSE 2025 — Constraints obsahovaly `tsc --noEmit` jako explicitní self-check, ale eslint chyběl. Agent proto typový check provedl, complexity check ne. SASE MentorScript: quality gates musí být explicitní příkazy, ne obecné principy ("modular architecture" v Package Quality nestačí jako complexity gate).

**Literatura:** FSE 2025 Mao et al. (Constraints komponenta), Hassan et al. 2025 SASE (MentorScript — quality gates)
