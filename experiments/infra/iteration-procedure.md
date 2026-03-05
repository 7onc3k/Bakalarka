# Iteration Procedure — AGENTS.md Pilotní Iterace

Systematický postup pro iterativní vylepšování AGENTS.md v pilotní fázi experimentu.

## Přehled cyklu

```
Run → Measure → Diagnose → Fix → Run → ...
```

Každá iterace produkuje:
- `experiments/runs/pilot-rN/FINDINGS.md` — behavioral trace + metriky (v repu runu)
- `experiments/runs/pilot-rN/DIAGNOSIS.md` — FSE/SASE/Lulla/Breunig analýza (v repu runu)
- `experiments/infra/changelog/pilot-rN-to-rN+1.md` — co se změnilo a proč (s citacemi)
- Aktualizovaný `experiments/infra/inputs/AGENTS.md`

Run může být v `runs/pilot-rN/` nebo `runs/archive/pilot-rN/` — FINDINGS i DIAGNOSIS vždy v adresáři daného runu.

---

## Workflow: iterativní spolupráce

Diagnose a Fix se provádějí **iterativně ve spolupráci** (ne automaticky):

1. **Diagnostika** — projít 4 nástroje (FSE, SASE, Lulla, Breunig), identifikovat problémy
2. **Diskuse** — pro každý problém: proč to nefungovalo? jaká změna dává smysl?
3. **Návrh fixu** — konkrétní text změny + citace do literatury
4. **Schválení** — uživatel potvrdí nebo upraví návrh
5. **Aplikace** — teprve pak změnit AGENTS.md a zapsat do `changelog/pilot-rN-to-rN+1.md`

Cíl: uživatel rozumí každé změně, žádné "black box" fixy.

---

## Metriky

Tři kategorie metrik (Fenton & Bieman 2014): procesní, produktové, efektivita.
Kódy odpovídají thesis kap03 sekce 3.4.

### Procesní metriky (P1-P8)

**P1-P5 — process compliance** (binární metriky, automatizovatelné z git/GitHub):

| Kód | Položka | Jak ověřit |
|-----|---------|-----------|
| P1 | Issues před kódem | `gh issue list` timestamps vs. první kódový commit |
| P2 | Branch per issue | `git branch -a` vs. issue count |
| P3 | Test commit před implementačním | `git log` — pořadí commitů (tddOrderViolations=0) |
| P4 | PRs linkované na issues | `gh pr list` — "Closes #N" |
| P5 | Nemodifikoval ref testy | `git diff` na test souborech |

Exit: každá P1-P5 musí být ✅.

**P6-P8 — kvalita procesních artefaktů** (LLM-as-judge, GLM-5):

| Kód | Dimenze | Rubrik |
|-----|---------|--------|
| P6 | Commit message quality | `infra/judge/p6-commit-messages.md` |
| P7 | Issue description quality | `infra/judge/p7-issue-descriptions.md` |
| P8 | PR description quality | `infra/judge/p8-pr-descriptions.md` |

Škála 1-3. Exit: každá ≥ 2/3.

### Produktové metriky (Q1-Q8)

| Kód | Metrika | Co měří | Jak | Exit kritérium |
|-----|---------|---------|-----|----------------|
| Q1 | API contract match | Sedí veřejné API? | `tsc` import + typecheck | match |
| Q2 | Ref test pass rate | Funguje implementace? | 45 behavioral testů ze spec | 45/45 |
| Q3 | Mutation score | Detekují agentovy testy chyby? | Stryker | ≥70% |
| Q4 | AC coverage | Kolik z 24 AC má test? | LLM-as-judge (GLM-5) | 24/24 |
| Q5 | Lint warnings | Čistý kód? | `eslint --format json` | 0 |
| Q6 | Typecheck errors | Kompiluje strict? | `tsc --noEmit` | 0 |
| Q7 | Složitost kódu | Není zbytečně složitý? | Cyklomatická složitost (ESLint) | ≤10/fn |
| Q8 | Kvalita kódu (design) | Naming, SoC, idiomatic TS, docs, komplexita | LLM-as-judge (GLM-5) | 3/3 |

Q4 rubrik: `infra/judge/q4-ac-coverage.md`.
Q8 rubrik: `infra/judge/q8-code-quality.md`.

### Metriky efektivity (E1-E3)

| Kód | Metrika | Jak | Exit |
|-----|---------|-----|------|
| E1 | Tokeny (input/output) | `opencode export` → JSON | záznam |
| E2 | Trvání (minuty) | Session timestamps | záznam |
| E3 | Kompletní dokončení | Crash/no crash + restart count (auto-continue log) | záznam |

E1-E3 nemají pass/fail — slouží k across-run srovnání.

→ Automatizované metriky (P1-P5, Q1-Q7, E1-E3): `npx tsx experiments/infra/scripts/ts/analyze-run.ts pilot-rN`
→ LLM-as-judge (P6-P8, Q4, Q8): `npx tsx experiments/infra/scripts/ts/judge.ts pilot-rN`

---

## Fáze 1: Measure (sběr metrik)

Po každém runu:

1. Spustit `npx tsx experiments/infra/scripts/ts/analyze-run.ts pilot-rN` → P1-P5, Q1-Q7, E1-E3
2. Spustit `npx tsx experiments/infra/scripts/ts/judge.ts pilot-rN` → P6-P8, Q4, Q8
3. Vyplnit FINDINGS.md (šablona níže)

### FINDINGS.md šablona

```markdown
# Pilot-rN Findings

**Status:** COMPLETED / CRASHED (příčina)
**Datum:** YYYY-MM-DD
**Session ID:** `ses_...`
**Repo:** https://github.com/7onc3k/bp-billing-reminder-pilot-rN

## AGENTS.md změny oproti r(N-1)
- [seznam změn]

## P1-P5 — Process Compliance

| Kód | Položka | Splněno? | Detail |
|-----|---------|----------|--------|
| P1 | Issues před kódem | | |
| P2 | Branch per issue | | |
| P3 | Test-first commity | | |
| P4 | PRs linkované na issues | | |
| P5 | Nemodifikoval ref testy | | |

## P6-P8 — Kvalita procesních artefaktů (LLM-as-judge)

| Kód | Dimenze | Score (1-3) | Reasoning |
|-----|---------|-------------|-----------|
| P6 | Commit messages | | |
| P7 | Issue descriptions | | |
| P8 | PR descriptions | | |

## Q4 — AC Coverage (LLM-as-judge)

| AC | Covered? | Test |
|----|----------|------|
| AC1 | | |
| ... | | |
| AC24 | | |

**Q4 score:** /24

## Produktové metriky (Q1-Q8)

| Kód | Metrika | Hodnota | Exit? |
|-----|---------|---------|-------|
| Q1 | API contract match | ✅/❌ | |
| Q2 | Ref test pass rate | /40 | |
| Q3 | Mutation score | % | |
| Q4 | AC coverage | /24 | |
| Q5 | Lint warnings | | |
| Q6 | Typecheck errors | | |
| Q7 | Max complexity | | |
| Q8 | Code quality (judge) | /3 | |

## Efektivita (E1-E3)

| Kód | Metrika | Hodnota |
|-----|---------|---------|
| E1 | Tokeny | input: output: |
| E2 | Trvání | min |
| E3 | Dokončení | Ano/Ne, restartů: |

## Srovnání s r(N-1)
[tabulka co se zlepšilo/zhoršilo]

## Diagnóza
[TODO: viz DIAGNOSIS.md v tomto adresáři]

## Fixy pro r(N+1)
[TODO: viz infra/changelog/pilot-rN-to-rN+1.md]
```

---

## Fáze 2: Diagnose (literature-based analýza)

Výstup: `runs/pilot-rN/DIAGNOSIS.md` (nebo `runs/archive/pilot-rN/DIAGNOSIS.md`). Diagnóza zůstává v repu runu.

Struktura DIAGNOSIS.md (šablona: `infra/DIAGNOSIS-template.md`):
1. FSE tabulka — 7 komponent, přítomnost + kvalita
2. SASE balance — BriefingScript / LoopScript / MentorScript poměr
3. Lulla audit — efektivní vs. neefektivní obsah
4. Breunig findings — ignorované instrukce z předchozího runu
5. Návrh fixů — každý fix: Bylo → Je → Pozorování → Diagnóza → Literatura

Pro každý problém identifikovaný v metrikách:

### 2.1 FSE 2025 komponentová analýza

Zkontrolovat AGENTS.md proti 7 komponentám (Mao et al. 2025):

| Komponenta | Frekvence | Doporučená pozice | Přítomna? | Kvalita |
|------------|-----------|-------------------|-----------|---------|
| Role/Profile | 28.4% | 1. (první) | | |
| Directive | 86.7% | 2. (hned po roli) | | |
| Context | 56.2% | 3. | | |
| Workflow | 27.5% | 4. | | |
| Output | 39.7% | 5. | | |
| Constraints | 35.7% | 6. (blízko konce) | | |
| Examples | 19.9% | 7. (poslední) | | |

Pravidla:
- Directive = imperativní instrukce, ne otázky (FSE Finding 2)
- Constraints = exclusion type nejefektivnější (FSE Finding 4: 46% exclusion)
- Constraints nescattered — seskupit do jedné sekce
- Instruction AFTER context, ne before (FSE Finding 9: information decay)

### 2.2 SASE script balance (Hassan 2025)

| Script | Účel | Řádky | % |
|--------|------|-------|---|
| BriefingScript | Co + proč (cíl, kontext, success criteria) | | |
| LoopScript | Jak (workflow, kroky, iterace) | | |
| MentorScript | Co ne + error recovery (constraints, guardrails) | | |

Cílový poměr: přibližně vyrovnaný. LoopScript dominance = agent neumí reagovat na odchylky.

### 2.3 Lulla 2026 content check

Efektivní obsah (snižuje runtime):
- [ ] Architecture / project structure
- [ ] Coding conventions
- [ ] Project description

Neefektivní obsah (zvyšuje tokeny bez benefitu):
- [ ] Verbose step-by-step procedures (AGENTbench: +14-22% tokenů)
- [ ] Directory trees (agent umí `ls`)
- [ ] Redundance s README/docs

### 2.4 Breunig test: fighting the weights?

Pokud agent opakovaně ignoruje instrukci přes iterace:
1. Přestrukturovat (ne opakovat) — jiný formát, jiná pozice
2. Rozložit na menší kroky — identifikovat přesně kde se odchyluje
3. Přidat validační krok — agent si sám ověří compliance
4. Negative example — ukázat co NEDĚLAT (Razavi 2025: targeted clarification)

### 2.5 Meta-princip (AGENTbench 2026)

Každý řádek AGENTS.md projde filtrem:
> "Kdyby tento řádek chyběl, udělal by agent neočividnou chybu?"
> Pokud ne → řádek přidává tokeny bez benefitu → odstranit.

---

## Fáze 3: Fix (literature-grounded změny)

Pro každou změnu zapsat do `changelog/pilot-rN-to-rN+1.md`:

```markdown
### Změna N: [název]

**Bylo:** [citace z předchozí verze]
**Je:** [nový text]
**Pozorování (rN):** [co agent udělal/neudělal]
**Diagnóza:** [FSE/SASE/Lulla/Breunig — proč to nefungovalo]
**Literatura:** [konkrétní citace a finding]
```

### Pravidla pro změny:

1. **Jedna změna = jeden problém.** Nekombinovat nesouvisející fixy.
2. **Každá změna má citaci.** Žádné ad hoc "zkusíme tohle".
3. **Preferovat přestrukturování před přidáváním.** AGENTbench: víc textu ≠ lepší.
4. **Testovat proti meta-principu.** Je řádek nezbytný?

---

## Fáze 4: Run

```bash
cd experiments/infra/scripts && npx tsx ts/new-run.ts pilot-rN
```

Po dokončení:
1. Spustit `npx tsx experiments/infra/scripts/ts/analyze-run.ts pilot-rN`
2. Spustit `npx tsx experiments/infra/scripts/ts/judge.ts pilot-rN`
3. Vyplnit FINDINGS.md (šablona z Fáze 1)
4. Zpět na Fáze 2 (Diagnose)

---

## Exit kritéria (přechod na komparativní fázi)

Pilotní iterace končí když agent splní všechna kritéria v posledním běhu:

**Deterministická** (přirozený binární práh):
- [ ] P1 = ✅ (issues before code)
- [ ] P2 = ✅ (branch per issue)
- [ ] P3 = ✅ (test-first commits)
- [ ] P4 = ✅ (PRs linked to issues)
- [ ] P5 = ✅ (no ref test modifications)
- [ ] Q1 = match (API contract)
- [ ] Q2 = 45/45 (referenční testy)
- [ ] Q4 = 24/24 (AC coverage)
- [ ] Q5 = 0 (lint warnings)
- [ ] Q6 = 0 (typecheck errors)

**Minimální standard:**
- [ ] P6 ≥ 2/3 (commit message quality)
- [ ] P7 ≥ 2/3 (issue description quality)
- [ ] P8 ≥ 2/3 (PR description quality)
- [ ] Q3 ≥ 70% (mutation score)
- [ ] Q7 ≤ 10 per funkce (cyklomatická složitost)
- [ ] Q8 ≥ 2/3 (kvalita kódu)

**Záznam (bez prahu):**
- E1, E2, E3 — across-run srovnání

---

## Reference

| Zdroj | Použití v procesu |
|-------|-------------------|
| Fenton & Bieman 2014 | P/Q/E taxonomie metrik |
| FSE 2025 (Mao et al.) | Komponentová analýza, component order, constraint types |
| SASE (Hassan 2025) | Script balance (Briefing/Loop/Mentor) |
| Lulla 2026 | Content effectiveness (architecture > workflow) |
| AGENTbench 2026 | Verbosity filter, meta-princip |
| Breunig 2025/2026 | Fighting-the-weights diagnostika |
| Razavi 2025 | Prompt sensitivity, targeted clarification |
| Mathews 2024 | Mutation score > coverage; test oracle problem |
| Harman et al. 2025 (Meta) | 70% mutantů uniká i při full coverage |
| Panickssery 2024 | Self-preference bias → cross-model judge |
| Zheng 2023 | LLM-as-judge biasy, MT-Bench |
