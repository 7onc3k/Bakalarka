# Handoff — Kap03 metodika restruktualizace (2026-04-26)

## Aktuální fáze

**Kap03 metodika — strukturální restruktualizace dokončena**, obsahový cleanup zbývá.
Cílem session bylo přepsat 3.1 a~3.3 tak, aby informační tok dával smysl
(strategie → případ → cyklus → metriky → operační design → limity)
a~aby terminologie cyklus/iterace/krok/fáze byla konzistentní.

- **Snapshot** s plnou historií: `thesis-checkpoint/` v rootu (z 2026-04-26 ráno)
- **Pracovní složka**: `thesis/` (Overleaf-připojená)
- **Build**: `make watch` (auto-rebuild)

## Co je hotovo v této session

### Strukturální změny v kap03

Nový skelet:
```
3.1 Výzkumný přístup
   3.1.1 Volba výzkumné strategie     (cíle → požadavky → case study + Yin)
   3.1.2 Případ a~jeho prostředí      (kritéria → systém upomínek + tří roviny IV/DV/setting)
   3.1.3 Iterativní cyklus a~fáze     (fáze → cyklus → DIAGRAM)

3.2 Sada metrik
   3.2.1 Procesní (P1-P8)
   3.2.2 Produktové (Q1-Q8)            (ISO 25010 přesunuto sem z 3.2 úvodu)
   3.2.3 Efektivita (E1-E3)
   3.2.4 Aplikace LLM-as-judge

3.3 Experimentální design
   3.3.1 Fixní proměnné                (bývalé 3.3.2)
   3.3.2 Diagnostika a~úprava instrukcí  (bývalé "Iterativní cyklus" 3.3.3,
                                          přepracováno: drop Spuštění+Měření,
                                          fokus na Diagnózu+Úpravu)
   3.3.3 Pilotní fáze                  (bývalé 3.3.4)
   3.3.4 Komparativní variace          (bývalé 3.3.5)

3.4 Přehledová tabulka
3.5 Omezení a~validita
```

Hlavní strukturální posuny:
- **3.3.1 Výběr projektu PŘESUNUT do 3.1.2** (case selection patří ke strategii, ne operačnímu detailu)
- **Diagram iterativního cyklu PŘESUNUT z 3.3 do 3.1.3** (loop arrow = strategy claim, ne mechanic)
- **3.3.2 přejmenováno** "Iterativní cyklus" → "Diagnostika a~úprava instrukcí"; obsah refokusován na substantivní analytickou proceduru, drop Spuštění+Měření (rutinní)
- **Tří roviny** (IV/DV/setting) z preambule do 3.1.2 §3 (kde je projekt právě představen)

### Terminologické sjednocení

| Term | Význam |
|---|---|
| Iterativní cyklus | Strategie celé case study (opakování) |
| Iterace | Jedno kolo |
| Krok iterace | Sub-fáze (Spuštění/Měření/Diagnóza/Úprava) |
| Fáze | Pilot vs ablace |

Anglické "case study" → česky "případová studie" konzistentně.

### Obsahové úpravy

- Anchor v preambuli rewritten: "Aby cíle z~kap1 mohly být ověřeny..." (claim, ne procedurální "X ukázalo, Y staví")
- Roadmap v preambuli updated po renumbering 3.3
- 3.1 §1 otočen na deduktivní formu (per-cíl premise → odvozený požadavek)
- 3.1 §2 case study positive frame (ne defensivní "ne řízený experiment")
- Yin 2018 citace zůstává u "analytická generalizace" (správné místo, ne u prvního výskytu "případová studie")
- Embedded single-case design přesněji vysvětleno (případ = fenomén, embedded units = běhy)
- 3.2 úvod očištěn (Yin 2025 vyhozen — nemapoval stejné dimenze, viz důkaz níže), Fenton repetitions vyhozeny, "operacionalizace" → "postup měření" (vyhne se kolizi se závěrem)
- 3.2 description list \ac → \acs (clean kódy bez expansion noise)
- 3.3 nové intro acknowledging že 3.1 už pokryla strategii a~projekt
- 3.1.3 reorder: fáze první (macro) → cyklus druhý (mechanic)
- 3.3.2 Diagnostika a~úprava: Spuštění+Měření drop (covered jinde), Claude disclosure konsoliduje do 3.5

### Nové artefakty

- **Yin 2025 PDF** stažen do `thesis/sources/yin-2025-agent-frameworks-evaluation.pdf`
- **TODO marker v kap02** ř. ~444 ohledně Yin 2025 (důkaz mezery při hodnocení)

## Pending TODO markery v kap03 (pro příští session)

Všechny zapsané přímo v souboru, lze najít přes `grep -n TODO thesis/kap03.tex`:

| Řádek | TODO | Kontext |
|---|---|---|
| 256 | Q2 ← přesunout sem popis referenčních testů z 3.5 | 3.2.2 |
| 277 | Q4 → odejde AC25 manuální dopočet do 3.5 | 3.2.2 |
| 454 | Vložit NOVOU subsekci "Záznam a~vyhodnocení běhu" před 3.3.2 | 3.3 |
| 462 | Rozhodnout o spektru operacionalizace (zavést tady, nebo až kap05) | 3.3.2 |
| 473 | APO positioning — dořešit v Diagnostika a~úprava | 3.3.2 |
| 497 | 4-framework jako naše syntéza — explicitní claim přínosu | 3.3.2 |
| 673 | 3.5 → odejde popis referenčních testů k Q2 | 3.5 |
| 715 | 3.5 Claude disclosure beef up po dnešní konsolidaci | 3.5 |

## Klíčové decisions této session

### Yin et al. 2025 (arXiv:2511.00872) drop z 3.2

Tvrdili jsme "Yin et al. dospívají k~obdobnému rozdělení"; po ověření plného textu papíru:
- Yin hodnotí **frameworky** (architektury), my **instrukce** pro jeden setup
- Jejich osy: effectiveness (task success), efficiency (reasoning execution path), overhead (tokeny)
- NE jejich proces ≠ náš proces (jejich = orchestration, náš = SE workflow)
- Nemají Q3 mutation, Q4 AC coverage, Q5-Q8 udržovatelnost

**Rozhodnutí:** drop z 3.2 (zavádějící), TODO v kap02 jako důkaz mezery (i nejnovější multidim eval listopad 2025 nepokrývá SE praktiky).

### "Iterativní cyklus" a~"Kroky iterace" — rozdělení

Při restruktualizaci jsme zjistili, že **diagram (4 boxy + loop)** je fundamentálně **cyklus diagram** (loop arrow je defining feature), ne pouze "kroky". Patří proto k~strategy úrovni v~3.1.3, ne k~operational v~3.3.

Substantivní obsah uvnitř iterace je jen Diagnóza + Úprava (Spuštění a~Měření jsou rutinní, covered jinde). Proto 3.3.2 přejmenováno z "Kroky iterace" na "Diagnostika a~úprava instrukcí" a~Spuštění+Měření detailní paragrafy vyhozeny.

### Embedded single-case framing

Případ NENÍ projekt (dunning) — projekt je **bounding context / vehicle**.
Případ JE iterativní návrh instrukcí jako fenomén instantiated přes tento projekt.
Embedded units jsou jednotlivé běhy.

Preambule explicitně říká "systém upomínek faktur není předmětem zkoumání" (= setting, ne case).

## Plán pro příští session

### Bezprostředně v kap03 (TODO markery 1-8)

1. **Bod 1+7** (referenční testy přesun z 3.5 do Q2) — coordinated edit
2. **Bod 2** (Q4 AC25 outlier do 3.5)
3. **Bod 4 (4-framework synthesis)** — krátký claim
4. **Bod 5 (Claude disclosure beef up v 3.5)**
5. **Bod 6 (spektrum operacionalizace decision)** — diskutovat zda zavést v 3.3.2 nebo nechat až kap05
6. **Bod 3 (NOVÁ subsekce "Záznam a~vyhodnocení běhu")** — větší zásah, na konec
7. **Bod 8 (APO positioning)** — vyžaduje napsat APO odstavec; možnost odložit do session zaměřené na to

### Deferred (kap04, kap05, závěr) — po dokončení kap03

- **kap02** — zapracovat Yin 2025 (TODO marker už tam, v hodnocení agentů)
- **kap04 4.1.x** — rename všech tří subsekcí (drop "Konstrukce")
- **kap04 4.1.1 Specifikace** — DODAT state machine diagram + API contract sketch (přesun materiálu sem, který do 3.1.2 nemá)
- **kap04 + kap05** sweep terminologie (cyklus/iterace/krok/fáze sjednocené)
- **závěr** verify konzistence — formulace přínosu po změnách (cyklus sám není novum, novum = doménově specifické metriky + kombinace 4 diagnostických rámců)
- **TERMINOLOGIE.md** update slovníku iterace/cyklus/krok/fáze + případ vs setting

## Pravidla pro next session

- **Em-dash nepoužívat** (CLAUDE.md). En-dash `--` se v LaTeXu rendruje jako en-dash, taky raději nahrazovat dvojtečkou nebo závorkou pro jistotu.
- **Doménové termíny česky** ("případová studie", ne "case study").
- **TODO markery jsou source of truth**, ne recap list — `grep TODO thesis/kap03.tex`.
- **Před editem subsekce** vždy ověřit forward refs (grep `sec:<label>`).
- **Bezpečné editace** pres Edit, ne Write (preserve unchanged content).
- **Snapshot v `thesis-checkpoint/`** je z dnešního rána, takže obsahuje stav PŘED touto restruktualizací; pokud potřeba rollback, lze.

## Pravidla nemíchat (klíčová memory)

- `feedback_thesis_brevity.md` — čtivý text, ne telegrafický
- `feedback_theory_methodology_split.md` — selection/scope patří do kap03, ne kap02
- `thesis_full_pass_rules.md` — chapter contracts, validation gates
- CLAUDE.md (project) — DSR terminologii max jednou v kap03

## Co NEDĚLAT

- Necitovat Yin 2025 v 3.2 jako "obdobné rozdělení" (různý problémový prostor)
- Nepoužívat "operacionalizace" v 3.2 (kolize se závěrem)
- Nemíchat "cyklus" a "iterace" — cyklus = strategie, iterace = jedno kolo
- Nepoškozovat sec:vyber-projektu label (kap04 ř. 99 na něj odkazuje)

## Stav thesis-checkpoint

- Datum: 2026-04-26 ráno (před touto restruktualizací)
- Lokace: `thesis-checkpoint/` (387M, gitignored: ne)
- Použití: pokud něco ve velké restruktualizaci ztracené, lze diff
