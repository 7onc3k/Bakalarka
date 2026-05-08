# pilot-r1 Diagnosis

**Vstup:** FINDINGS.md
**AGENTS.md:** baseline (pilot-r1)
**Datum:** 2026-03-04

---

## Shrnutí

Pilot-r1 ukázal, že baseline instrukce stačí k částečně funkční implementaci,
ale ne k disciplinovanému SWE workflow. Největší slabina byla v abstraktním
Process kroku a vágních Constraints: agent kombinoval issues do branchí,
neprovedl TDD jako verifikovatelnou sekvenci a upravil existující test.

## Selhání k diagnostice

| Selhání | Exit kritérium | Výsledek |
|---------|----------------|----------|
| P2 Branch per issue | 1 branch per issue | ❌ branches=4, issues=11 |
| P3 Test-first commits | test commit před feat | ❌ test:0, feat:4 |
| P5 No existing test modifications | 0 souborů modifikováno | ❌ 1 test soubor modifikován |
| Q2 Ref test pass rate | 45/45 | ❌ 34/45 |
| Q5 Lint warnings | 0 | ❌ 2 (complexity) |
| Q7 Code complexity | 0 violations >10 | ❌ 2 violations |

**Mimo diagnostiku:** Q2 selhání je implementační chyba (manual_advance stavy, elapsed time při resume) — spec byla jasná, instrukce dostatečné. Není kandidát na fix v AGENTS.md.

---

## FSE 2025 — komponentní analýza

| Komponenta | Přítomna? | Pozice | Kvalita | Finding |
|------------|-----------|--------|---------|---------|
| Role | Ano | sekce "Role" | OK — "senior TypeScript developer" | Adekvátní, jednoznačná |
| Directive | Ano | sekce "Goal" | OK — "Implement dunning system" | Jasný cíl |
| Context | Ano | sekce "Specification" + "Environment" | OK — odkazuje na Issue #1, runtime stack | Dostatečný |
| Workflow | Ano | sekce "Process" | **Slabý** — krok 2 obsahuje 4 akce v jedné větě, chybí git příkazy | Hlavní příčina P1.2+P1.3 |
| Output | Ano | sekce "Package Quality" | OK — popisuje strukturu balíčku | Adekvátní |
| Constraints | Ano | sekce "Constraints" | **Slabý** — "Never modify a test" neurčuje, zda lze později upravit již napsaný vlastní test; chybí complexity threshold | Příčina P1.5, Q5/Q7 |
| Examples | Ne | — | Chybí zcela | Nízká priorita pro tento typ úkolu |

**Závěr FSE:** Kritická slabina je Workflow komponenta — krok 2 je příliš hutný a abstraktní. Agent si "branch from main, write tests first, implement, PR" interpretoval volně: kombinoval issues do branchí a nevytvořil separátní `test:` commity. Druhá slabina je Constraints — absence rozlišení typů testů a chybějící quality gate pro complexity.

---

## SASE — script balance

| Script | Obsah | Řádky (approx) | % |
|--------|-------|----------------|---|
| BriefingScript | Role, Goal, Specification, Environment | ~16 | ~30% |
| LoopScript | Process (4 kroky) | ~8 | ~45% (z celkové délky) |
| MentorScript | Constraints (5 pravidel) | ~7 | ~25% |

**Závěr SASE:** LoopScript dominuje ale kvalitou je slabý — 4 akce v kroku 2 bez operacionalizace. MentorScript je podreprezentovaný: chybí error recovery ("co dělat když test selže?"), chybí quality gates pro complexity. BriefingScript je adekvátní. Fix: rozšířit MentorScript o konkrétní self-check příkazy (complexity, lint).

---

## Lulla 2026 — content effectiveness

**Efektivní obsah (přítomen):**
- Architektura balíčku — sekce "Package Quality" popisuje modulární strukturu, oddělení typů/logiky/API
- Coding conventions — strict TypeScript, no `any`, JSDoc, conventional commits
- Odkaz na project description — odkazuje na Issue #1 jako zdroj pravdy

**Neefektivní obsah (kandidáti na revizi):**
- Krok 2 v Process je verbose popis čtyř kroků v jedné větě — paradoxně verbose formou, ale chudý obsahem; přepsat jako číslované sub-kroky
- "Never implement without a failing test first" je princip, ale bez operacionalizace (jak poznat že test existuje před implementací? → separátní commit)

**Závěr Lulla:** AGENTS.md je stručné (53 řádků) — Lulla efektivita není primárním problémem. Problém je granularita, ne délka. Krok 2 potřebuje rozpad na sub-kroky, ne zkrácení.

---

## Breunig/Razavi — prompt sensitivity

**Co agent ignoroval:**

| Instrukce | Co agent udělal | Strategie |
|-----------|-----------------|-----------|
| "never combine multiple issues into one branch" (Constraints) — P2 | Vytvořil 4 branches pro 11 issues — kombinoval | Přesunout a přeformulovat do Workflow jako operační krok s příkladem (`git checkout -b issue-N`) |
| "write tests first" (Process krok 2) — P3 | 0 test: commitů, 4 feat: commity — TDD ignorováno | Rozepsat jako 2 explicitní sub-kroky: (2a) test commit, (2b) feat commit |
| "never modify a test" (Constraints) — P5 | Modifikoval 1 test soubor | Zpřesnit: zákaz vztáhnout na přepisování již existujících testů |

**Závěr Breunig/Razavi:** Agent ignoroval instrukce které byly formulovány jako obecné principy bez konkrétní operacionalizace. Dle Breunig: opakování by nepomohlo — nutné přestrukturovat jako konkrétní git příkazy a sub-kroky. Razavi: přeformulování instrukce (ne pouze zopakování) má větší efekt než zdůraznění.

---

## Návrh fixů

| Fix | Selhání | Zdůvodnění | Literatura |
|-----|---------|------------|------------|
| Rozepsat Process krok 2 na sub-kroky s git příkazy | P2, P3 | Workflow komponenta příliš abstraktní; agent improvizoval | FSE 2025 (Workflow), Breunig 2025 |
| Přidat `test:` commit jako explicitní sub-krok před `feat:` | P3 | TDD bez operacionalizace je ignorováno; commit je verifikovatelný checkpoint | FSE 2025 (Workflow), Razavi 2025 |
| Zpřesnit "never modify a test" — explicitně zmínit `tests/_ref_tests/` jako immutable | P5 | Vágní constraint nerozlišuje spec testy od vlastních; agent opravoval test místo kódu | FSE 2025 (Constraints) |

**KOREKCE (2026-03-18):** Tato diagnóza byla chybná. Agent `tests/_ref_tests/` nevidí — soubory se kopírují až při post-hoc měření (analyze-run.ts). P5 měří modifikaci agentových vlastních testů. Opraveno: zjednodušeno na "Never modify a test to match your implementation. If a test fails after implementation, fix the code — not the test. Tests encode the spec."
| Přidat complexity self-check do Constraints (`eslint src/ --max-warnings 0`) | Q5, Q7 | MentorScript chybí quality gate; agent nevěděl o complexity threshold | FSE 2025 (Constraints), SASE MentorScript |
