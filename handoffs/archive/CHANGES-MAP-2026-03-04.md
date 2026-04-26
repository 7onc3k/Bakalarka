# MAPOVÁNÍ ZMĚN — Bakalarka projekt
## 2026-03-04

Tento dokument zmapovává všechny požadované změny v projektu bez jejich implementace.
Cíl: poskytnout přehled co, kde a jak se má měnit.

---

## ZMĚNA #1: METRIKY P1 — ROZHODNUTÍ O ČÍSLOVÁNÍ

### Problém
Aktuální stav: P1 = "checklist 5 položek" které se v kódu označují jako P1.1-P1.5.
Možnost: Přejmenovat na jednotlivé metriky P1-P5, čímž by se P2 přesunula na P6.

### Místa v kódu a dokumentaci

**Thesis — /home/dev/code/Bakalarka/thesis/kap03.tex**

1. Řádky 110-113 — Definice kategorií "P -- proces (P1--P2)"
   - Rozhodnutí: zůstat nebo změnit?

2. Řádky 131-179 — Sekce "Procesní metriky (P1--P2)" s detailem
   - Řádek 141: "P1 (process compliance) je binární checklist pěti položek"
   - Řádky 143-154: Enumerace P1.1-P1.5

3. Řádky 679-680 — Přehledová tabulka
   - Pokud změna: tabulka dostane 6 řádků místo 2 (P1-P5 + P6)

**Procedura — /home/dev/code/Bakalarka/experiments/infra/iteration-procedure.md**

1. Řádky 40-57 — Tabulka "P1 — process compliance" (P1.1-P1.5)
2. Řádek 121 — "P1 score: /5"

**Skripty — /home/dev/code/Bakalarka/experiments/infra/scripts/ts/**

1. analyze-run.ts:
   - Řádky 5-7: Komentář "6 binarnich polozek" ← CHYBA (mělo by být 5)
   - Řádky 144-189: Funkce measureP1()
   - Řádky 194-365: Pět funkcí measureP1_1() až measureP1_5()
   - Řádka 26-27: Import P1Item, P1Result

2. shared.ts:
   - Řádky 65-83: Interface P1Item s id polem (např. "P1.1")
   - Interface P1Result

**Výstupy — /home/dev/code/Bakalarka/experiments/runs/pilot-r1/FINDINGS.md**

1. Řádky 5-9: Tabulka s "P1.1 Issues before code" atd.
2. Řádka 11: "P1 score: 2/5"

### Velikost a priorita
- **Velikost:** VELKÁ (2-3 hodiny) — strukturální změna
- **Priorita:** 🔴 HIGH — ovlivňuje celý framework

---

## ZMĚNA #2: CYKLOMATICKÁ SLOŽITOST (Q7)

### Problém
V kap03 se zmiňuje "Práh ≤ 10 per funkce vychází z McCabe" ale:
1. Chybí intuitivní vysvětlení (co 10 znamená)
2. Chybí odkaz na teorii v kap02
3. AGENTS.md o tom neříká nic

### Místa v kódu

**Thesis — /home/dev/code/Bakalarka/thesis/kap03.tex**

1. Řádky 236-240 — Sekce Q7
   - Potřeba: intuitivní vysvětlení + ověření citace

**Thesis — /home/dev/code/Bakalarka/thesis/kap02.tex** (ověřit)

1. Sekce "Statická analýza"
   - Potřeba: ověřit zda je McCabe teorie, případně rozšířit

**AGENTS.md — /home/dev/code/Bakalarka/experiments/infra/inputs/AGENTS.md**

1. Sekce "Package Quality" (řádky 37-44)
   - Potřeba: přidat guidance "Functions must have complexity ≤ 10"

### Velikost a priorita
- **Velikost:** STŘEDNÍ (0.5-1 hodina)
- **Priorita:** 🟡 MEDIUM

---

## ZMĚNA #3: P2 GATING RULES — ČÍSLOVANÝ SEZNAM

### Problém
V kap03 jsou gating rules pro P2 napsány jako prose, uživatel chce strukturovaný seznam.

### Místa v kódu

**Thesis — /home/dev/code/Bakalarka/thesis/kap03.tex**

1. Řádky 165-170 — Sekce P2 v "Procesní metriky"
   - Aktuálně: "(1) pokud v git logu chybí... (2) pokud jeden PR zavírá..."
   - Změna: Převést na \begin{enumerate} seznam

**Ověřit konzistenci — /home/dev/code/Bakalarka/experiments/infra/judge/p2-process-artifacts.md**

1. Řádky 24-34, 44-52 — Judge rubric
   - Musí být konzistentní s kap03

### Velikost a priorita
- **Velikost:** MALÁ (15-20 minut)
- **Priorita:** 🟡 MEDIUM

---

## ZMĚNA #4: ESLint GUIDANCE V AGENTS.md

### Problém
AGENTS.md popisuje workflow (issues, branching, TDD) ale explicitně nezmínuje:
- "Code must pass ESLint"
- "Functions ≤ 10 complexity"

### Místa v kódu

**AGENTS.md — /home/dev/code/Bakalarka/experiments/infra/inputs/AGENTS.md**

1. Sekce "Constraints" (řádky 46-52) nebo nová sekce "Code Quality Gates"
   - Přidat: lint + complexity guidance

### Velikost a priorita
- **Velikost:** MALÁ (5-10 minut)
- **Priorita:** 🟢 LOW

---

## ZMĚNA #5: BEHAVIORAL TRACE + tddOrderViolations

### Problém
BehavioralTrace interface má `firstTestCommitBeforeImpl` (binární), ale je potřeba:
- `tddOrderViolations`: počet porušení TDD per branch (počet)

### Místa v kódu

**Typy — /home/dev/code/Bakalarka/experiments/infra/scripts/ts/shared.ts**

1. Řádky 157-180 — Interface BehavioralTrace
   - Přidat: `tddOrderViolations: number`

**Skript — /home/dev/code/Bakalarka/experiments/infra/scripts/ts/analyze-run.ts**

1. Funkce extractBehavioralTrace()
   - Přidat: měřit počet branch s test commit PO impl commit

**FINDINGS output — (dynamicky generovaný)**

1. Behavioral Trace tabulka
   - Přidat řádek: `| tddOrderViolations | N |`

**Procedura — /home/dev/code/Bakalarka/experiments/infra/iteration-procedure.md**

1. Řádky 40-50 — Tabulka P1
   - Rozšířit popis P1.3 s odkaz na tddOrderViolations

**Diagnóza — /home/dev/code/Bakalarka/experiments/infra/DIAGNOSIS-template.md**

1. Řádky 44-48 — Breunig sekce
   - Rozšířit o analýzu TDD porušení

### Velikost a priorita
- **Velikost:** MALÁ-STŘEDNÍ (1-2 hodiny)
- **Priorita:** 🟡 MEDIUM (závisí na jiném agentovi)

---

## OPRAVA #1: CHYBA V KOMENTÁŘI

**Soubor:** /home/dev/code/Bakalarka/experiments/infra/scripts/ts/analyze-run.ts
**Řádek:** 5-7
**Chyba:** "P1 — 6 binarnich polozek" (mělo by být 5)
**Oprava:** Změnit "6" na "5"
**Priorita:** 🟢 LOW

---

## FINÁLNÍ PŘEHLED

| # | Oblast | Soubor | Typ | Velikost | Priority |
|---|--------|--------|-----|----------|----------|
| 1 | Thesis + Skript | kap03.tex + shared.ts + analyze-run.ts | Structural: P1.1-P1.5 vs P1-P5 | VELKÁ | 🔴 HIGH |
| 2 | Thesis + AGENTS | kap03.tex + kap02.tex + AGENTS.md | Q7 vysvětlení + guidance | STŘEDNÍ | 🟡 MED |
| 3 | Thesis | kap03.tex | P2 gating rules seznam | MALÁ | 🟡 MED |
| 4 | AGENTS | AGENTS.md | ESLint guidance | MALÁ | 🟢 LOW |
| 5 | Typy + Skript + Procedura | shared.ts + analyze-run.ts + md | TDD violations | MALÁ-STŘEDNÍ | 🟡 MED |
| BUG | Skript | analyze-run.ts:5-7 | Oprava: 6→5 | MALÁ | 🟢 LOW |

---

## DOPORUČENÝ POSTUP

### Fáze 1: ROZHODNUTÍ
- [ ] P1 zůstane P1.1-P1.5 (checklist) NEBO změnit na P1-P5?
  - Pokud ANO (zůstane): pokračuj Fází 2A
  - Pokud NE (změní): pokračuj Fází 2B

### Fáze 2A: Bez refactoringu P1
1. [ ] Opravit komentář "6" → "5" v analyze-run.ts
2. [ ] Doplnit Q7 vysvětlení + AGENTS.md guidance
3. [ ] Převést P2 gating rules na seznam
4. [ ] Přidat tddOrderViolations (pokud se měří)

### Fáze 2B: Pokud se změní P1 → P1-P5
1. [ ] Přepsat kap03.tex (3 místa)
2. [ ] Refactor shared.ts + analyze-run.ts typů
3. [ ] Update iteration-procedure.md
4. [ ] Zkontrolovat FINDINGS formát

---

Dokument vytvořen: 2026-03-04
Typ: Mapování (bez implementace)
Status: DRAFT pro review uživatelem
