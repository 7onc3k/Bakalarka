# Handoff — nekonzistence a TODO

## Citační chyby — DONE

- [x] kap04:479 — Lulla → Breunig (kontrola v místě akce)
- [x] kap04:214 — Lulla odstraněn (ponechán Gloaguen)
- [x] kap04:534 — Lulla odstraněn (vlastní pozorování z pilotu)
- [x] kap04:555 — Lulla odstraněn (vlastní rozhodnutí)
- [x] kap04 RAW:263 — přidána explicitní poznámka o limitaci Lully
- [x] kap03 RAW:615 — "nejefektivnější" → "nejčastější"

## Konzistence s novými cíli — DONE

- [x] kap03:12 — aktualizováno na nové cíle
- [x] kap03 3.3.4 — přidány RAW review poznámky (substituce, počet běhů)
- [x] kap04 úvod — "odebíráme nebo nahrazujeme" → "odebíráme"

## K review (RAW poznámky pro uživatele)

- [ ] **kap03 3.3.4** — zmínka o substituci v DRAFT: smazat, ponechat, nebo přeformulovat cíl?
- [ ] **kap03 3.3.4** — "jeden běh per variaci" vs skutečné dva běhy
- [ ] **kap04 RAW:263** — rozhodnout jak popsat důvod přidání Package Quality bez Lully

## Judge — DONE

- [x] **Q4** doplněno pro A-1, A-2, B-2 (fix: timeout 90s → 180s)
- [x] **Q8** doplněno pro B-1 (fix: timeout 90s → 180s)

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
