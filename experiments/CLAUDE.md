# Experiment — iterace AGENTS.md

Pilotní fáze experimentu iteruje na AGENTS.md dokud agent nedosáhne cílového chování.

**Postup:** `infra/iteration-procedure.md`

## Cyklus

Observe → Diagnose → Fix → Run

Každá iterace:
1. **Observe** — behavioral trace z runu (FINDINGS.md šablona)
2. **Diagnose** — analýza proti FSE 2025 (7 komponent), SASE (script balance), Lulla 2026 (content effectiveness), Breunig (fighting-the-weights)
3. **Fix** — literature-grounded změna v AGENTS.md (zapsat do CHANGELOG.md s citací)
4. **Run** — `./infra/new-run.sh pilot-rN`

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

- `infra/AGENTS.md` — iterovaný vstup (jediná proměnná)
- `infra/CHANGELOG.md` — diff per iterace s literaturou
- `infra/iteration-procedure.md` — kompletní analytický postup
- `infra/build.md` — system prompt override (fixní)
- `runs/pilot-rN/FINDINGS.md` — výstupy per run
- `infra/new-run.sh` — spouštěč runů
