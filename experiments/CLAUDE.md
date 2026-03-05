# Experiment — iterace AGENTS.md

Pilotní fáze experimentu iteruje na AGENTS.md dokud agent nedosáhne cílového chování.

**Postup:** `infra/iteration-procedure.md`

## Cyklus

Run → Measure → Diagnose → Fix → Run

Každá iterace (Diagnose a Fix iterativně ve spolupráci — viz procedure):
1. **Observe** — behavioral trace z runu (FINDINGS.md šablona)
2. **Diagnose** — analýza proti FSE 2025 (7 komponent), SASE (script balance), Lulla 2026 (content effectiveness), Breunig (fighting-the-weights)
3. **Fix** — literature-grounded změna v AGENTS.md (zapsat do `changelog/pilot-rN-to-rN+1.md` s citací)
4. **Run** — `npx tsx infra/scripts/ts/new-run.ts pilot-rN`

## Analytické nástroje

- **FSE 2025 component order:** Role → Directive → Context → Workflow → Output → Constraints
- **SASE script balance:** BriefingScript (co+proč) / LoopScript (jak) / MentorScript (co ne + recovery)
- **Lulla 2026:** architektura + konvence efektivní; verbose workflow neefektivní
- **AGENTbench meta-princip:** "Kdyby řádek chyběl, udělal by agent neočividnou chybu?"
- **Breunig:** pokud agent ignoruje instrukci přes iterace → přestrukturovat, ne opakovat

## Exit kritéria

Agent splní 80%+ cílových chování:
- [ ] Přečte spec (Issue #1) před kódem
- [ ] Decomponuje do sub-issues (`gh issue create`)
- [ ] 1 branch per issue (žádné kombinování)
- [ ] TDD: test-first (ověřitelné z git history)
- [ ] Separátní commity pro test a implementaci
- [ ] PR → merge → close per issue
- [ ] Průběžné commity (ne blob na konci)

## Soubory

- `infra/inputs/AGENTS.md` — iterovaný vstup (jediná proměnná)
- `infra/changelog/pilot-rN-to-rN+1.md` — změny per iterace s literaturou
- `infra/iteration-procedure.md` — kompletní analytický postup
- `infra/inputs/build.md` — system prompt override (fixní)
- `runs/pilot-rN/FINDINGS.md` — behavioral trace + metriky (v repu runu)
- `runs/pilot-rN/DIAGNOSIS.md` — FSE/SASE/Lulla/Breunig analýza (v repu runu)
- `infra/scripts/ts/new-run.ts` — spouštěč runů
