# Handoff — nekonzistence a TODO

## Velké bloky práce (další session)

- [ ] **kap02 je 84% RAW** — největší dluh. Chybí zpracované sekce o: nedeterminismu LLM, prompt sensitivity (Razavi/Breunig), procedurální vs deklarativní instrukce, procesní metriky jako research gap (řádek 553 TODO)
- [ ] **kap05 je kompletně RAW** — musí odpovědět na všechny tři cíle z kap01

## K review (RAW poznámky v textu)

### kap01
- [ ] **(a) Motivace nemotivuje cíl 3** — chybí věta o tom že je otevřená otázka které složky instrukcí jsou nezbytné. RAW poznámka přidána.
- [ ] **(b) Řádek 27 — "dosud nevznikl" bez citace** — silný claim. RAW poznámka přidána.
- [ ] **(c) "Exit kritéria" bez vysvětlení** — poprvé v cíli 2, definice až v kap03. RAW poznámka přidána.
- [ ] **(d) "Evaluační systém" vs "sada metrik"** — nejasné jestli totéž. RAW poznámka přidána.

### kap03
- [ ] **3.3.4 substituce** — DRAFT zmiňuje substituce ale kap04 dělá jen ablace. RAW review poznámka existuje.
- [ ] **Hassan SASE** — vision paper, ne empirická studie. RAW poznámka přidána u diagnostických rámců.

### kap04
- [ ] **RAW:263** — rozhodnout jak popsat důvod přidání Package Quality bez Lully

## Infra

- [ ] OpenCode hang — zdokumentováno v kap03 sekce 3.5, debug logování přidáno
- [ ] TODO: zjistit proč OpenCode necompactuje a nahlásit bug

## Opraveno (tato session)

- [x] kap03:663 — P1-P6 deterministická → P1-P5 (P6 je LLM-as-judge)
- [x] kap03: "jeden běh per variaci" → "dva běhy" (3 místa: 303, 703, 851)
- [x] kap03 sekce 3.5 — přidán OpenCode hang do omezení interní validity
- [x] kap04: Mao 7 komponent — přidáno vysvětlení adaptace (Mao original → naše sekce)
- [x] kap05:117 — "13 metrik" → "19 metrik"
- [x] kap01 — RAW poznámky pro motivaci, exit kritéria, terminologii
- [x] kap03 — RAW poznámka o Hassan SASE jako vision paper
- [x] Citační opravy Lulla (kap04: 4 místa)
- [x] Citační opravy Mao (kap03 RAW: nejefektivnější → nejčastější)
- [x] kap01 cíle přeformulovány (DRAFT v5)
- [x] kap05 zastaralý DRAFT blok smazán
- [x] kap04 ablace A+B — DRAFT s tabulkami a interpretací
- [x] kap04 souhrnná tabulka — kompletní P1-P8, Q1-Q8, E2-E3
- [x] Ablační běhy spuštěny, analyzovány, judge dokončen
