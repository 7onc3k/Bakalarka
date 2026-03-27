# Recenze bakalářské práce
Datum: 2026-03-26
Model: Claude (Anthropic)

## Celkové hodnocení
Práce je v jádru obhajitelná — má jasnou strukturu, přísně kontrolovaný experimentální design a zajímavé výsledky. Hlavní slabinou je **rozpor v počtu metrik mezi kapitolami** (19 vs. 13, P1–P8 vs. P1–P2), který naznačuje nedokončenou revizi textu. Hlavní silou je poctivé přiznání limitů a auditovatelný řetězec rozhodnutí.

## Kritické problémy (musí se opravit)

### K1: Fatální nekonzistence v počtu a kódech metrik
- **Kde:** Celá práce, zejména úvod vs. kap03 vs. MEMORY.md
- **Citace:** Úvod: „sadu 19 metrik ve třech kategoriích — procesní (P1–P8), produktové (Q1–Q8) a metriky efektivity (E1–E3)". MEMORY.md: „P1 process compliance — binární checklist (5 položek)" a „P2 process artifact quality — LLM-as-judge".
- **Problém:** MEMORY.md definuje **P1–P2** (kolaps z pilotní fáze), text práce používá **P1–P8**. To je 2 vs. 8 procesních metrik. Celkový počet je buď 13 (P1–P2, Q1–Q8, E1–E3 dle MEMORY) nebo 19 (P1–P8, Q1–Q8, E1–E3 dle textu). Práce neuvádí, kdy a proč došlo k rozšíření zpět na P1–P8. Cíle v kap01 říkají „sadu metrik", závěr říká „19 metrik" — pokud je skutečný počet jiný, je to zásadní problém.
- **Dopad:** Oponent otevře MEMORY.md / Git historii a zjistí rozpor. Nedůvěryhodnost celého metrického rámce.
- **Řešení:** Rozhodnout se: buď P1–P8 (19 metrik) nebo P1–P2 (13 metrik). Sjednotit VŠUDE — úvod, kap03, tabulka 3.4, kap04, kap05, závěr. Přidat větu vysvětlující evoluci (issue #35 → finální podoba).

### K2: Chybějící celá kapitola 2 (Teoretická východiska)
- **Kde:** kap02.tex
- **Citace:** Všechny podsekce jsou jen nadpisy bez textu: „### Definice a komplexita software", „### Fáze životního cyklu", „### LLM-as-judge" atd.
- **Problém:** Kapitola 2 je páteří teoretického ukotvení. Bez ní nelze posoudit, zda jsou metriky validní, zda je DSR správně zasazeno, zda LLM-as-judge má oporu. Kap03 odkazuje na „sekce [ref:sec:mereni-kvality]", „sekce [ref:sec:testovani-mutation]", „sekce [ref:sec:staticka-analyza]", „sekce [ref:sec:llm-as-judge]" — všechny v kap02, všechny prázdné.
- **Dopad:** Práce je neobhajitelná bez teoretických východisek. Oponent nemá co hodnotit.
- **Řešení:** Dopsat kap02. Minimálně: Fenton & Bieman taxonomie (P/Product/Resource), mutation testing (Papadakis 2019), cyklomatická složitost (McCabe 1976), LLM-as-judge (Zheng 2023, Panickssery 2024), AI coding agenti (definice, typy), scaffolding a instrukce.

### K3: Kap01 Cíle — cíl 2 je formulován jako výsledek, ne jako cíl
- **Kde:** kap01, sekce Cíle práce
- **Citace:** „Iterativním postupem navrhnout instrukce které dovedou agenta k dodržování stanovených exit kritérií."
- **Problém:** Formulace slibuje, že instrukce **dovedou** agenta ke splnění. To je výsledkový claim, ne cílový. Výsledky ukazují, že r5 měl regresi a exit kritéria nebyla splněna beze zbytku. Cíl je nesplnitelný v absolutní formulaci.
- **Dopad:** Oponent řekne: „cíl 2 nesplněn — r5 regrese, nikdy 10/10".
- **Řešení:** Přeformulovat: „Demonstrovat iterativní postup návrhu instrukcí a ukázat, že vede k měřitelnému zlepšení oproti výchozímu stavu." Evaluační kritérium v 3.1 to už správně říká — cíl musí být konzistentní.

### K4: Evaluační kritéria cílů vs. formulace cílů — rozpor
- **Kde:** kap03 sekce 3.1 vs. kap01 sekce Cíle
- **Citace:** Kap01 cíl 3: „Ablacemi identifikovat, které složky instrukcí přispívají k měřenému chování agenta a které jsou redundantní." Kap03 evaluační kritérium cíle 3: „odebrání složky instrukcí způsobí měřitelnou změnu alespoň v jedné metrice."
- **Problém:** Kap01 slibuje identifikaci redundantních složek (= všech). Kap03 evaluační kritérium je skromnější (= alespoň jedna měřitelná změna). Kap04 testuje jen 2 ze 7 sekcí. Constraints explicitně neablací s odůvodněním „námět pro další výzkum".
- **Dopad:** Oponent: „Slíbili jste identifikaci, ablovali jste 2 z 7 sekcí."
- **Řešení:** V cíli 3 zúžit scope: „Na vybraných složkách instrukcí demonstrovat, zda přispívají k měřenému chování agenta." V kap05 explicitně přiznat, že 5 sekcí nebylo ablováno.

## Důležité problémy (výrazně zlepší práci)

### D1: Opakovaně chybějící hedging u interpretací
- **Kde:** kap04 (pilot-r5), kap05 (cíl 1, cíl 3, porovnání s literaturou)
- **Citace:** „Nedeterminismus modelu je dominantní faktor pro dodržování vícekrokových sekvencí." (r5); „Stabilita těchto metrik znamená, že nejsou citlivé na změny instrukcí — jde o baseline schopnosti modelu" (cíl 1); „Základní kódové konvence jsou u tohoto modelu řízeny znalostmi z tréninku" (cíl 3); „Pravidla v Constraints neplní ani jednu funkci" (porovnání s literaturou)
- **Problém:** Toto jsou interpretace prezentované jako fakta. U single-case study s 2 běhy per variaci nelze tvrdit kauzalitu. Text sám v kap03 říká „indikativní, nikoliv kauzální" — ale v kap04/05 to porušuje.
- **Řešení:** Přidat hedging: „data naznačují", „je konzistentní s hypotézou", „pravděpodobně". Specificky u „Constraints neplní ani jednu funkci" — Constraints nebyly ablací testovány! Toto tvrzení je neopodstatněné.

### D2: E1 a E3 chybí u ablačních běhů — interpretační problém
- **Kde:** kap04, tabulky ablací A a B
- **Citace:** „U A-1 a A-2 chybí export v lokálním snapshotu — E1 a E3 pro tyto běhy nešly dopočítat."
- **Problém:** 4 z 9 běhů nemají E1 ani E3. Tím pádem nelze porovnat efektivitu ablací vs. pilotu. Práce to přiznává, ale nijak neřeší (např. „po doplnění exportu by se sloupce vyplnily" — proč nebyly doplněny?).
- **Dopad:** Oponent: „Navrhli jste metriky efektivity, ale u skoro poloviny běhů je nemáte."
- **Řešení:** Buď doplnit data (pokud jsou dostupné), nebo explicitně přiznat jako limit a vysvětlit proč nebyly získány (technický problém? časový? záměr?).

### D3: Q4 rubrika má 24 AC místo 25 — neopraveno
- **Kde:** kap04 souhrnné výsledky, kap05 limity
- **Citace:** „Q4 používá v rubrice 24 AC místo skutečných 25 (známý nedostatek)"
- **Problém:** Známý nedostatek, přiznaný, ale **neopravený**. Pilotní běhy mají Q4 „přepočteno na 25" — jak? Pokud judge hodnotil 24, jak lze přepočítat na 25?
- **Řešení:** Vysvětlit metodu přepočtu, nebo přiznat že Q4 je systematicky podhodnoceno o 1 AC a interpretovat konzistentně.

### D4: Cohenovo κ neprovedeno — oslabuje Q8 argument
- **Kde:** kap03 sekce 3.5, kap05 limity
- **Citace:** „Spolehlivost LLM-as-judge nebyla validována proti lidskému hodnocení (např. Cohenovým κ) z důvodu časových omezení"
- **Problém:** Q8 je **klíčová metrika** pro závěr ablace B („Package Quality ovlivňuje design quality"). Bez κ validace je tento závěr postaven na nevalidovaném judge. Text říká „podpůrné kvalitativní indikátory", ale v závěru cíle 3 a v doporučeních pro praxi s Q8 pracuje jako s plnohodnotnou metrikou.
- **Řešení:** Buď provést alespoň orientační κ (10 hodnocení ručně vs. judge), nebo zeslabit závěry ablace B: „Q8 naznačuje pokles, ale bez validace judge nelze toto tvrzení považovat za robustní."

### D5: Referenční implementace — kdo ji napsal a jaký je test oracle problém
- **Kde:** kap04 sekce 4.1.2
- **Citace:** „Testy byly napsány metodou spec-first TDD"
- **Problém:** Není explicitně řečeno **kdo** napsal referenční implementaci. Z kontextu se dá odvodit, že autor — ale to je confirmation bias riziko (autor specifikaci psal, testy psal, metriky navrhl). Kap03 zmíní „test oracle problém" jen letmo.
- **Řešení:** Explicitně uvést: „Referenční implementaci a testy napsal autor práce." Přiznat riziko a mitigaci (spec-first TDD, behavioral testy přes veřejné API).

### D6: Pilot-r1 chybí kompletně
- **Kde:** kap04
- **Citace:** Text přeskakuje z „Konstrukce baseline instrukcí" rovnou na „Pilot-r2"
- **Problém:** R1 je baseline — nejdůležitější iterace. V textu chybí její popis, tabulka metrik, diagnostika. R2 říká „oproti r1", ale r1 nebyla popsána.
- **Dopad:** Čtenář neví, jak dopadl první běh. Tabulka cross-run má r1 data, ale narativní popis chybí.
- **Řešení:** Přidat sekci Pilot-r1 s tabulkou a diagnostikou.

### D7: Specificity/mechanismus instrukcí — claim překračuje evidenci
- **Kde:** kap05 sekce Porovnání s literaturou
- **Citace:** „Tento mechanismus — instrukce jako nápověda podporující emergentní chování, ne jako příkaz vynucující konkrétní akci — je v kontextu instrukčních souborů pro coding agenty dosud nepopsaný."
- **Problém:** Novelty claim na jedné ablaci, jednom modelu, dvou bězích. Navíc „dosud nepopsaný" je obtížně doložitelné (důkaz neexistence). Chain-of-thought analogie (Wei 2022) je zajímavá, ale tenká — CoT je o reasoning, ne o kódových konvencích.
- **Řešení:** Zeslabit: „Naše data jsou konzistentní s hypotézou, že instrukce mohou působit i aktivačním mechanismem. Tuto hypotézu je třeba ověřit na dalších modelech a projektech."

## Drobné problémy (nice-to-have)

### N1: Úvod říká „19 metrik" ale nekoresponduje s přehledovou tabulkou
- **Kde:** Úvod
- **Citace:** „sadu 19 metrik ve třech kategoriích — procesní (P1–P8)"
- Spočítáno v tabulce 3.4: P1–P8 (8) + Q1–Q8 (8) + E1–E3 (3) = 19 ✓. Ale Q4 v tabulce má „deter." typ s „25/25" exit kritériem — Q4 je přitom LLM-as-judge metrika. Typ by měl být „min." nebo „deter." by měl být zdůvodněn.

### N2: „Práce neporovnává různé modely" ale používá dva modely
- **Kde:** kap01 sekce Rozsah
- **Citace:** „Práce neporovnává různé modely ani programovací jazyky"
- **Problém:** Technicky používá MiniMax (agent) a GLM-5 (judge). Formulace by měla být přesnější: „neporovnává výkon různých modelů jako agentů".

### N3: METR citace bez kontextu
- **Kde:** kap01 sekce Motivace
- **Citace:** „Randomizovaná studie METR [metr2025] na 246 úlohách ukázala, že s AI nástroji byli vývojáři o 19 % pomalejší."
- **Problém:** Toto je kontraintuitivní tvrzení které čtenář potřebuje kontext — byli pomalejší při čem? Na jakých úlohách? Jinak působí jako cherry-picking.

### N4: Chybí signpost na začátku kap03
- **Kde:** kap03, začátek
- **Problém:** Kapitola začíná rovnou sekcí 3.1 bez úvodního odstavce, který by řekl co kapitola obsahuje a proč.

### N5: Tabulka cross-run — P1 u r5 je „?†"
- **Kde:** kap04 souhrnná tabulka
- **Citace:** „P1 v r5 nelze určit — agent nevytvořil issues."
- **Problém:** Pokud agent nevytvořil issues, P1 by mělo být fail (ne „?"). Issues before code = nebyly issues → nesplněno.

### N6: „pilot-r2" jako první popsaná iterace — matoucí číslování
- **Kde:** kap04
- **Problém:** Sekce „Pilot-r2" je první podrobně popsaná iterace. Čtenář se ptá: kde je r1?

## Konzistence a terminologie

| Pojem/zkratka | Problém | Kde se vyskytuje | Návrh |
|---------------|---------|------------------|-------|
| P1–P8 vs. P1–P2 | MEMORY definuje 2, text 8 procesních metrik | celá práce vs. MEMORY.md | Sjednotit na jednu verzi |
| „exit kritéria" vs. „práh" | Většinou konzistentní, ale kap03 pilotní fáze říká „exit kritéria ze sloupce *Exit kritérium*" — tautologické | kap03.3.4 | Přeformulovat |
| „experiment" vs. „případová studie" | Kap03 říká „experimentální design", „experimentální běh", ale kap01 vymezuje jako „případovou studii" | kap01 vs. kap03 | Dodržovat „případová studie"; „experimentální běh" je ok jako dílčí jednotka |
| Q4 typ: „deter." | V tabulce je Q4 (LLM-as-judge) označeno jako „deter." — ale je to LLM hodnocení | tabulka 3.4 | Změnit na „min." nebo vysvětlit proč deter. |
| „19 metrik" | V úvodu a závěru, nikde v kap03 explicitně nespočítáno | úvod, závěr | Přidat větu do kap03: „Sada obsahuje celkem 19 metrik" |

## Chybějící nebo slabé reference

| Místo v textu | Co chybí | Návrh zdroje |
|---------------|----------|--------------|
| kap03 „Fenton a Bieman [fenton2014]" | MEMORY říká „Nemáme Fentona ve zdrojích (kniha, ne paper)" — ověřit dostupnost | Fenton, N.E. & Bieman, J.M. (2014). Software Metrics. 3rd ed. CRC Press |
| kap03 P3 „test-first" | Žádná citace na TDD metodologii | Beck, K. (2003). Test-Driven Development |
| kap04 „spec-first TDD [mathews2024]" | Jediná citace na TDD je Mathews — ověřit zda existuje a je peer-reviewed | Doplnit Beck 2003 jako primární zdroj |
| kap05 „chain-of-thought [wei2022cot]" | Citace přítomna, ale analogie je tenká | Min et al. 2022 je citován ale ne vysvětlen |
| kap05 „Kim et al. [kim2025detail]" | Nová citace bez kontextu v kap02 | Přidat do kap02 pokud kap02 bude dopsána |
| kap03 Runeson & Höst [runeson2009] | Použito pro kategorizaci validity — správné, ale chybí v kap02 | OK pokud v kap02 bude zmíněno |
| kap01 „Shin et al. [shin2025prompt]" | Klíčová motivační citace — ověřit zda je peer-reviewed | Ověřit |

## Silné stránky

1. **Poctivé přiznání limitů**: „Případová studie na jednom projektu, jednom modelu a jednom agentním nástroji neumožňuje statistickou generalizaci." Text konzistentně rozlišuje feasibility vs. generalizability. Sekce 3.5 a 5.3 jsou jedny z nejlepších částí práce.

2. **Auditovatelný řetězec rozhodnutí**: „Každá změna odpovídá jednomu identifikovanému problému, je podložena citací a zaznamenaná v changelogu." Changelog per iterace, FINDINGS.md, diagnostická chyba výzkumníka přiznaná a popsaná — výborná vědecká praxe.

3. **Kontrolovaný experimentální design**: Fixní proměnné jsou důkladně popsány (Docker izolace, system prompt, auto-continue plugin). Jedna proměnná (AGENTS.md) je čistě izolována.

4. **Ablace jako metoda**: Volba ablací místo ad-hoc srovnávání je metodologicky správná. Dva běhy per variaci jako mitigace nedeterminismu — správně zdůvodněno.

5. **Praktická doporučení podložená daty**: „obecné pravidlo → konkrétní příkaz → verifikační krok" vzorec je opakovaně demonstrován na třech nezávislých selháních (P2, P3, Q8) — přesvědčivé i pro single-case study.

6. **Regrese přiznány a analyzovány**: R4 a R5 nejsou zamlčeny — jsou analyzovány jako informativní selhání. „Návrat k předchozí verzi instrukcí po neúspěšné iteraci je standardní postup" — zralý přístup.

## Souhrnná tabulka

| Dimenze | Hodnocení (1-3) | Hlavní problém |
|---------|----------------|----------------|
| Metodologie | 2 | Validní design, ale κ neprovedeno, E1/E3 chybí u ablací |
| Argumentace | 2 | Opakovaný hedging deficit — interpretace jako fakta |
| Konzistence | 1 | **Fatální rozpor P1–P8 vs. P1–P2 v počtu metrik** |
| Literatura | 1 | **Celá kap02 prázdná** — nelze posoudit teoretické ukotvení |
| Struktura | 2 | Chybí r1, dobrá chronologická návaznost jinak |
| Síla tvrzení | 2 | Novelty claims příliš silné pro single-case, ale většinou OK |
| Úplnost | 2 | 3 cíle pokryty, ale cíl 3 jen pro 2/7 sekcí |
| Prezentace | 2 | Tabulky srozumitelné, E1 definice složitá ale vysvětlená |

(1 = zásadní problém, 2 = solidní s výhradami, 3 = výborné)

## Doporučení pro obhajobu

1. **„Proč máte 19 metrik v textu, ale MEMORY/git historie ukazuje 13?"** — Připravit jasnou odpověď o evoluci metrického rámce. Mít timeline (issue #35 → finální podoba).

2. **„Cíl 3 slibuje identifikaci složek, ale ablujete jen 2 ze 7 sekcí. Proč ne Constraints?"** — Připravit zdůvodnění výběru (Process a Package Quality měly deterministické chování v pilotu; Constraints se překrývají s Process).

3. **„Cohenovo κ neprovedeno — jak víte že Q8 je validní?"** — Připravit odpověď: hlavní závěry stojí na deterministických metrikách; Q8 je podpůrný indikátor. Ideálně provést alespoň orientační validaci.

4. **„R5 regrese — cíl 2 nesplněn?"** — Klíčové: cíl je demonstrace postupu, ne garance výsledku. Evaluační kritérium v 3.1 říká „směřuje k cíli", ne „dosáhne cíle". Ale formulace v kap01 to neříká — opravit před odevzdáním.

5. **„Jak víte, že výsledky nejsou artefakt jednoho modelu?"** — Odpověď je v limitech (analytická generalizace, Yin 2018). Přenositelné jsou metriky a postup, ne konkrétní hodnoty. Ale být připraven na follow-up: „Proč jste nezvolili běžnější model (GPT-4, Claude)?"