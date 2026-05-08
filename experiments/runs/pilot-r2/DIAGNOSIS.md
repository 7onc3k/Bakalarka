# pilot-r2 Diagnosis

**Vstup:** FINDINGS.md
**AGENTS.md:** pilot-r1-to-r2 (rozepsaný Workflow + zákaz přepisování existujících testů + complexity check)
**Datum:** 2026-03-05

---

## Shrnutí

Pilot-r2 potvrdil, že fixy z r1 zlepšily část procesní disciplíny, ale zároveň
odhalily druhé-order selhání. Agent sice začal vytvářet `test:` commity a
nepřepisoval existující testy, ale workflow stále interpretoval mechanicky a
slučoval testy s implementací do jednoho commitu. Současně se zhoršily
produktové metriky a přetrvalo ignorování JSDoc požadavku.

## Selhání k diagnostice


| Selhání               | Exit kritérium                  | Výsledek                  |
| --------------------- | ------------------------------- | ------------------------- |
| P2 Branch per issue   | branches >= issues              | ❌ branches=3, issues=7    |
| P3 Test-first commits | separátní test: a feat: commity | ❌ 3× test:, 0× feat:      |
| Q2 Ref test pass rate | 45/45                           | ❌ 27/45 (regrese z 34/45) |
| Q3 Mutation score     | ≥70%                            | ❌ 68.42%                  |
| Q5 Lint warnings      | 0                               | ❌ 1                       |
| Q8 Documentation      | 3/3                             | ❌ 1/3 (no JSDoc)          |


**Opraveno oproti r1:** P5 (bez modifikací existujících testů), Q7 (complexity violations).

**Mimo diagnostiku:** Q2 regrese (27 vs 34) — agent jinak implementoval state machine logiku. Instrukce byly explicitnější než v r1; selhání je implementační, ne instrukční. Q3 68.42% — těsně pod prahem, nízká priorita.

---

## Klíčové pozorování: P3 inverze

V r1: agent psal `feat:` commity bez předchozích `test:` commitů.
V r2: agent psal `test:` commity bez navazujících `feat:` commitů — test + implementace v jednom commitu s prefixem `test:`.

Instrukce (krok 2b/2c) byla interpretována jako "nazvi commit `test:` pokud obsahuje testy" místo "vytvoř dva oddělené commity". Agent splnil literál (conventional commit prefix) ale ne záměr (separátní commit checkpoint). P6 judge to reflektoval: "no feat: commits for implementation" (score 2/3).

---

## FSE 2025 — komponentní analýza


| Komponenta  | Přítomna? | Kvalita                           | Finding                                                                   |
| ----------- | --------- | --------------------------------- | ------------------------------------------------------------------------- |
| Role        | Ano       | OK — senior TypeScript developer  | Beze změny oproti r1                                                      |
| Directive   | Ano       | OK — jasný cíl                    | Beze změny                                                                |
| Context     | Ano       | OK — odkaz na Issue #1            | Beze změny                                                                |
| Workflow    | Ano       | **Zlepšeno, ale P3 stále selhal** | Sub-kroky 2a/2b/2c jsou přítomny, ale agent je sloučil do jednoho commitu |
| Output      | Ano       | OK — Package Quality sekce        | **Documentation požadavek přítomen, ale ignorován (Q8=1/3)**              |
| Constraints | Ano       | Zlepšeno — zákaz přepisování testů explicitnější | P5 opraveno; Q5 stále 1 warning navzdory `--max-warnings 0` v Process     |


**Závěr FSE:** Workflow byl rozepsán (fix z r1), ale P3 selhal jiným způsobem — agent sloučil sub-kroky. Package Quality sekce obsahuje explicitní požadavek na JSDoc, ale agent ho ignoroval. Toto je Breunig případ — instrukce přítomna, agent ji opakovaně přehlíží.

---

## SASE — script balance


| Script         | Obsah v r2 AGENTS.md                   | Finding                                                                                      |
| -------------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| BriefingScript | Role, Goal, Specification, Environment | OK — beze změny                                                                              |
| LoopScript     | Process (rozepsané sub-kroky)          | Zlepšeno z r1; P3 inverze naznačuje že explicitnost nestačí — potřeba verifikační checkpoint |
| MentorScript   | Constraints + pre-PR checks            | Přidán lint check → Q7 opraveno; ale Q8 MentorScript chybí recovery ("co dělat bez JSDoc?")  |


**Závěr SASE:** MentorScript stále podreprezentovaný pro documentation. Chybí self-check: "ověř že exportované funkce mají JSDoc před PR". BriefingScript/LoopScript balance je lepší než r1.

---

## Lulla 2026 — content effectiveness

**Co zafungovalo (r1→r2 zlepšení):**

- Explicitnější zákaz přepisování již existujících testů → P5 opraveno
- `npx eslint src/ --max-warnings 0` — konkrétní příkaz → Q7 opraveno (complexity)
- Sub-kroky 2a/2b/2c s git příkazy → P3 se změnilo (test commity přítomny, ale sloučeny s impl)

**Neefektivní obsah:**

- Documentation v Package Quality je popsána ale bez verifikačního checkpointu → agent ji vynechá
- P2 "no exceptions" text nestačí — agent stále kombinuje issues do branches

**Závěr Lulla:** Konkrétní příkazy (paths, shell commands) fungují lépe než popisy principů. Dokumentace není verifikovatelná bez self-check příkazu.

---

## Breunig/Razavi — prompt sensitivity


| Instrukce                                                                       | Co agent udělal                    | Iterace    | Strategie                                                                                                    |
| ------------------------------------------------------------------------------- | ---------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| Krok 2b: `git commit -m "test: ..."`, krok 2c: `git commit -m "feat: ..."` — P3 | Sloučil do jednoho `test:` commitu | 2. iterace | Přidat verifikační bod: "před krokem 2c zkontroluj že existuje separátní test: commit v git log"             |
| `git checkout -b issue-N (one branch per issue, no exceptions)` — P2            | 3 branches pro 7 issues            | 2. iterace | Breunig: přeformulování nestačí → přidat `gh issue list --state open` jako operační krok před každým startem |
| JSDoc on all exported functions (Package Quality) — Q8                          | 0 JSDoc na veřejném API            | 1. iterace | Přesunout do Constraints + přidat pre-PR check: `grep -r "export" src/index.ts` + instrukce ověřit JSDoc     |


**Závěr Breunig:** P2 a Q8 jsou Breunig přípmuzrukce ady — instrukce přítomny přes iterace, agent ignoruje. Nutné přestrukturovat jako verifikovatelné checkpointy nebo konkrétní příkazy, ne textová pravidla.

---

## Návrh fixů pro r3


| Fix                                                                                                                    | Selhání | Zdůvodnění                                                                                         | Literatura                        |
| ---------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------- | --------------------------------- |
| Přidat verifikační krok mezi 2b a 2c: "spusť `git log --oneline -3` a ověř že test: commit existuje před implementací" | P3      | Agent sloučil sub-kroky; verifikovatelný checkpoint brání sloučení                                 | FSE 2025 (Workflow), Breunig 2025 |
| Přidat krok 1b: "před každou novou branch spusť `gh issue list --state open` a vyber jeden"                            | P2      | Operacionalizace "one branch per issue" jako akce, ne pravidlo                                     | FSE 2025 (Workflow), Razavi 2025  |
| Přesunout JSDoc požadavek do Constraints + přidat pre-PR check: "ověř JSDoc na každé export funkci v src/index.ts"     | Q8      | Documentation ignorována; Constraints + self-check zvyšuje compliance (Lulla: konkrétní > popisné) | Lulla 2026, SASE MentorScript     |
| Q5 (1 warning) — zkontrolovat který warning přetrvává a přidat specifickou instrukci pokud je opakovaný                | Q5      | Lint check přítomen, ale 1 warning přežívá                                                         | FSE 2025 (Constraints)            |
