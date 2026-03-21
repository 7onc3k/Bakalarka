# Handoff — nekonzistence a TODO

## Citační chyby (mechanické opravy)

- [ ] **kap04:479** — `\cite{lulla2026}` u "kontrola před odevzdáním funguje spolehlivěji" → Lulla to neříká, má být `\cite{breunig2025}` nebo vlastní zjištění z pilotu
- [ ] **kap04:214** — `\cite{lulla2026}` u "verbose step-by-step nejsou efektivnější" → Lulla měří přítomnost vs nepřítomnost souboru, ne verbose vs stručné. Spíš `\cite{gloaguen2025agentsmd}` nebo bez citace
- [ ] **kap04 RAW:263** — stará misatribuce "architektura + konvence = nejúčinnější obsah instrukcí" připsaná Lullovi → opravit nebo smazat
- [ ] **kap03 RAW:615** — "nejefektivnější" → "nejčastější" (Mao 46% = prevalence v korpusu, ne efektivita)

## Konzistence s novými cíli (kap01 DRAFT v5)

Nové cíle:
1. Navrhnout sadu metrik (proces + kvalita)
2. Iterativním postupem navrhnout instrukce → exit kritéria (pilot)
3. Ablacemi identifikovat které složky přispívají a které jsou redundantní (komparace)

- [ ] **kap03:12** — sekce 3.1 odkazuje na staré cíle ("demonstrovat iterativní postup a popsat pozorované tendence") → aktualizovat na nové
- [ ] **kap03 sekce 3.3.4** — komparativní variace popis → ověřit že sedí s cílem 3 (ablace)
- [ ] **kap04 úvod** — ověřit že intro kap04 odráží nové cíle

## Souhrnná tabulka (kap04)

- [ ] **Q3 pro r5 = "---"** — chybí vysvětlení proč (poznámka pod tabulkou)

## Judge — chybějící data

- [ ] **Q4** chybí pro A-1, A-2, B-2 (judge API timeout) — spustit znovu
- [ ] **Q8** chybí pro B-1 (judge API timeout) — spustit znovu

## Infra — OpenCode hang problém

- [ ] OpenCode se tiše ukončí při vyčerpání kontextu (žádný error, žádný compaction)
- [ ] Přidáno `--print-logs --log-level DEBUG` do new-run.ts pro diagnostiku
- [ ] Ablace A měla 2 neúspěšné pokusy (hang) ze 4 — zdokumentováno v kap04
- [ ] TODO: zjistit proč OpenCode necompactuje a nahlásit bug

## Už opraveno (tato session)

- [x] kap05 DRAFT blok o r4→r5 — smazán, ingestion checkpoint přesunut do future work
- [x] kap05:11 — "výzkumné otázky" → "cíle práce"
- [x] kap01 cíle — přeformulovány (DRAFT v5): metriky / pilot+exit kritéria / ablace
- [x] kap04 ablace A — DRAFT s tabulkou, interpretací (verif. kroky nejsou redundantní)
- [x] kap04 ablace B — DRAFT s tabulkou, interpretací (PQ převážně redundantní)
- [x] kap04 souhrnná tabulka — rozšířena o ablační sloupce
- [x] Ablační běhy spuštěny a dokončeny (A-1, A-2, B-1, B-2)
- [x] analyze-run + judge spuštěny na všech 4 bězích
