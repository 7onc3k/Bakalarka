# Changelog: pilot-r2 → pilot-r3

**Datum:** 2026-03-05
**Zdůvodnění:** DIAGNOSIS.md pilot-r2

---

## Změny v AGENTS.md

### Fix 1: P3 — verifikační checkpoint mezi test: a feat: commitem

**Bylo:**
```
b. Write tests: `git add tests/ && git commit -m "test: <description>"`
c. Implement: `git add src/ && git commit -m "feat: <description>"`
```

**Je:**
```
b. Write tests: `git add tests/ && git commit -m "test: <description>"`
c. Verify: run `git log --oneline -3` and confirm the test: commit exists before proceeding
d. Implement: `git add src/ && git commit -m "feat: <description>"`
```

**Pozorování (r2):** P3 ❌ — agent sloučil testy a implementaci do jednoho commitu s prefixem `test:`. Sub-kroky 2b/2c existovaly, ale agent je interpretoval jako pojmenování, ne jako dva separátní commity. Žádný feat: commit nevznikl.

**Diagnóza:** FSE 2025 — explicitní sub-kroky nestačí bez verifikačního checkpointu. `git log --oneline -3` je mechanický self-check který agent musí provést, a tím se přesvědčí že test: commit existuje jako samostatný záznam. Breunig 2025: přestrukturování na verifikovatelný checkpoint > opakování textového pravidla.

**Literatura:** FSE 2025 Mao et al. (Workflow komponenta), Breunig 2025

---

### Fix 2: P2 — operacionalizace "one branch per issue" jako konkrétní akce

**Bylo:**
```
a. `git checkout main && git pull && git checkout -b issue-N` (one branch per issue, no exceptions)
```

**Je:**
```
a. Pick one open issue: `gh issue list --state open`, then `git checkout main && git pull && git checkout -b issue-N`
```

**Pozorování (r2):** P2 ❌ přes 2 iterace — branches=3, issues=7. Text "one branch per issue, no exceptions" nestačil přes dvě iterace. Agent kombinuje issues do jedné branch.

**Diagnóza:** Breunig 2025: instrukce přítomna přes iterace → nutné přestrukturovat jako operační akci. `gh issue list --state open` explicitně vede agenta k výběru jednoho issue před každou branch — operacionalizace pravidla jako krok, ne jako constraint text. Razavi 2025: přeformulování jako konkrétní příkaz > opakování principu.

**Literatura:** Breunig 2025, Razavi 2025, FSE 2025 Mao et al. (Workflow)

---

### Fix 3: Q8 — JSDoc přesunout do Constraints + pre-PR self-check

**Bylo:**
```
Package Quality:
- **Documentation** — JSDoc on all exported functions and types.
```
(bez enforcement mechanismu)

**Je:**
```
Package Quality:
- **Documentation** — ... This is enforced in Constraints.

Constraints:
- Before every PR, verify JSDoc on every exported function in `src/index.ts`. If any export lacks JSDoc, add it before opening the PR.
```

**Pozorování (r2):** Q8 = 1/3 přes 2 iterace — documentation score = 1/3, žádný JSDoc na veřejném API. Instrukce v Package Quality přítomna ale bez enforcement bodu.

**Diagnóza:** Breunig 2025: instrukce ignorována přes iterace → textový požadavek nestačí. Lulla 2026: konkrétní self-check > popisný požadavek. SASE MentorScript: quality gate musí být explicitní akce těsně před výstupem (PR). Přesun do Constraints + konkrétní akce (verify JSDoc) vytváří enforcement moment.

**Literatura:** Lulla 2026, SASE Hassan et al. 2025 (MentorScript), Breunig 2025
