# Recenze bakalářské práce

**Datum:** 2026-03-25  
**Model:** Evaluace podle kritérií pro návrhový výzkum s case study

---

## Celkové hodnocení

Práce je **obhajitelná, ale vyžaduje průběžné opravy** v následujících oblastech:

1. **Kritická omezení:** Kapitola 2 (Teoretická východiska) chybí v DRAFT formě (jen 41 finálních řádků vs. 460 RAW); klíčový zdroj (Fenton & Bieman 2014) není ověřen; LLM-as-judge metriky se nevalidovaly proti lidskému hodnocení.

2. **Metodologická síla:** DSR design + single-case study je vhodný pro демонstraci principů, ale generalizovatelnost je omezená (jeden projekt, jeden model). Výsledky jsou indikativní, ne deklarativní.

3. **Hlavní přínos:** Sada 19 metrik pokrývajících proces+kvalitu je originální; iterativní postup je prakticky realizovatelný; ablace poskytují první empirické údaje o efektu jednotlivých složek instrukcí.

---

## Kritické problémy (musí se opravit)

### K1: Kap02 (Teoretická východiska) chybí v DRAFT
- **Kde:** celá kap02.tex
- **Problém:** Kapitola má jen 41 řádků FINAL obsahu a 0 DRAFT; RAW obsahuje fragmenty bez struktury. Jedná se o páteř práce - teoretické základy pro P/Q/E taxonomii, LLM-as-judge, DSR nejsou jako koherentní kapitola.
- **Dopad:** Čtenář (zvláště oponent) nebude mít adekvátní teoretickou základnu pro ústav P/Q/E metrik.
- **Řešení:** Vytvorit DRAFT verzi kap02 strukturovanou jako: 2.1 SWE & metriky (definice, Fenton taxonomie), 2.2 AI coding agenti (DSR, benchmarky), 2.3 Scaffolding & instrukce (typy obsahu, literatura), 2.4 LLM-as-judge teorie (Zheng, Panickssery, Verga). Lze využít RAW obsahy, jen strukturovat.

### K2: Fenton & Bieman 2014 není ověřen
- **Kde:** Throughout práce, zvláště kap03.2, kap02 (plánované)
- **Problém:** Memory uvádí: "Nemáme Fentona ve zdrojích (kniha, ne paper). TODO: stáhnout/ověřit." Tato kniha je klíčová pro taxonomii Process/Product/Resource, na níž je postavena celá sada metrik. Neuvedení/ověření znamená, že primární teoretický základ není ověřen.
- **Dopad:** Důvěryhodnost celého metrického rámce je kompromitována.
- **Řešení:** Stáhnout Fenton & Bieman (2014) "Software Metrics: A Rigorous and Practical Approach" (3. vyd., CRC Press). Ověřit na stranách XXX-YYY, že Process/Product/Resource je opravdu jejich taxonomie. Přidat do bibliography s DOI/ISBN. Eventuálně najít alternativní sources (např. handbook SWEBOK který cituje Fentona).

### K3: LLM-as-judge bez validace vs. lidským hodnocením
- **Kde:** kap03.2.4, kap05 (Limity)
- **Problém:** Pět metrik (P6, P7, P8, Q4, Q8) se měří LLM-as-judge (GLM-5) bez Cohenovova κ validace. Sekce 3.5 to přiznává: "z důvodu časových omezení". Autor pak v kap05 dělá závěry jako "Q8 identifikovalo chybějící JSDoc" - vyvozuje fakta z nevalidované metriky.
- **Dopad:** Hlavní závěry (zvláště o design quality, AC coverage) nejsou vědecky podloženy. Věrohodnost je oslabena.
- **Řešení:** V kap03.2.4 jasně formulovat: "LLM-as-judge metriky (P6-P8, Q4, Q8) jsou bezpečné pouze jako **orientační indikátory**. Nejsou to objektivní měření. Primární důkazní osa se opírá o metriky deterministické [seznam: P1-P5, Q1-Q3, Q5-Q7]." V kap05 pak diskutovat Q8 jako "naznačuje" ne "identifikovalo". Přidat do future work: "Validace P6-P8, Q4, Q8 proti 2-3 lidským anotátorům (Cohen's κ ≥ 0.60)."

### K4: P/Q/E zkratky nejsou vysvětleny
- **Kde:** kap03.2 (úvod)
- **Problém:** Text: "Tři kategorie: P – proces (P1–P8), Q – kvalita (Q1–Q8), E – efektivita (E1–E3)". Čtenář si myslí, že P/Q/E jsou ze Fentona. V MEMORY vidím: "P/Q/E kódy jsou naše, ne Fentonovy". To se NIKDE v textu neuvádí.
- **Dopad:** Nesprávné přisouzení původu, matení čtenáře.
- **Řešení:** Přidat větu v kap03.2 (po Fenton citaci): "Fentonova taxonomie rozlišuje tři kategorie: *Process*, *Product*, *Resource*. V našem evaluačním rámci je přejmenováváme na **P** (proces), **Q** (quality = produkt), **E** (efficiency = zdroje), a strukturujeme je do 19 konkrétních metrik."

### K5: Nejasné propojení mezi 3 cíli a výsledky
- **Kde:** kap01 (Cíle), kap04-05 (Výsledky)
- **Problém:** Cíl 3 ("ablacemi identifikovat které složky jsou nezbytné") v motivaci práce není motivován - motivace vysvětluje cíl 1 a 2, ale ne 3. Až později je zřejmé, že je to důležité.
- **Dopad:** Čtenář cítí, že cíl 3 je nahodilý nebo přidaný dodatečně.
- **Řešení:** V kap01 Motivace přidat větu (po odstavci o Shin et al.): "Zbývá otevřená otázka: které složky instrukcí jsou pro dodržování praktik skutečně kritické a které jsou redundantní vůči znalostem modelu z tréninku? Tuto mezeru vyplňuje ablační část studie." Pak cíl 3 nebude překvapivý.

---

## Důležité problémy (výrazně zlepší práci)

### D1: Cíl 2 není SMART
- **Kde:** kap01 Cíle práce, bod 2
- **Problém:** "Iterativním postupem navrhnout instrukce které dovedou agenta k dodržování stanovených exit kritérií." Toto popisuje METODU, ne CÍLE. Cíl by měl být "Co chceme dosáhnout", ne "Jak".
- **Dopad:** Nejasnost mezi výzkumným cílem a metodou.
- **Řešení:** Přeformulovat na: "Demonstrovat, že iterativní postup Spuštění→Měření→Diagnóza→Úprava vede ke zlepšení splnění exit kritérií (z baseline na target)."

### D2: Motivace se neodkazuje na exit kritéria
- **Kde:** kap01 Motivace (řádky 8-15)
- **Problém:** Text zmiňuje "praktiky" ale nikdy nedefinuje jaké. V kap03 se definují exit kritéria (P1-P5 binární, Q3 ≥70%, atd.), ale v motivaci je to vágní.
- **Dopad:** Čtenář neví co práce měří.
- **Řešení:** V motivaci přidat: "Práce definuje konkrétní kritéria dodržování praktik - spec-first development (Issues before code), test-driven development (Test-first commits), čistý kód (zero lint warnings, zero typecheck errors) - a měří, jak instrukce agenta vedou k jejich splnění."

### D3: Kap02 struktura - není jasné co je teorie vs. praktika
- **Kde:** kap02 struktura (plánovaná)
- **Problém:** RAW obsah v kap02 mluví o "mutation testing", "ESLint", "TypeScript" jako o teoretických konceptech, ale to jsou praktické nástroje. Měly by být v kap03.
- **Dopad:** Nejasné rozdělení mezi teoretickým rámcem a metodikou.
- **Řešení:** Kap02 = Teorie (Fenton taxonomie, DSR, LLM-as-judge z Zheng et al., mutation testing z Papadakis). Kap03 = Konkrétní volba nástrojů (Stryker pro mutations, ESLint pro lint, GLM-5 pro judge).

### D4: Nedeterminismus modelu není adekvátně adresován metodologicky
- **Kde:** kap03 Experimentální design, kap05 Limity
- **Problém:** Práce věnuje málo pozornosti faktu, že dva běhy se stejnými instrukcemi dávají velmi různé výsledky (r3: P2-P4 OK, r5: P2-P4 SELHÁNÍ). Dva běhy per ablaci NEJSOU dostačující pro claim o efektu.
- **Dopad:** Výsledky ablací jsou indikativní, ale práce je někdy prezentuje jako kauzální.
- **Řešení:** V kap03.3.4 (Komparativní variace) změnit text: "Každá ablace se provádí ve dvou nezávislých bězích se stejným nastavením. Se dvěma běhy NEJSOU možné statisticky průkazné závěry o kauzalitě. Výsledky ablací interpretujeme jako INDIKATIVNÍ trendy, které generují hypotézy pro další výzkum." Pak v kap05 důsledně používat "data naznačují", "hypotéza", ne "je".

### D5: Příliš detailní pilotní iterace (r1-r5)
- **Kde:** kap04 Pilot-r2 až Pilot-r5
- **Problém:** Každý běh má tabulku + 2-3 odstavce detailního popisu. Pro čtenáře je to příliš mnoho. Stačilo by shrnutí na 2-3 věty per běh + klíčový poznatek.
- **Dopad:** Papír je dlouhý (621 řádků v DRAFT samotné kap04).
- **Řešení:** Zkrátit pilotní sekce (r2-r5) na 1-2 odstavce se tabulkami. Detaily přesunout do Přílohy. V hlavním textu: "R1 (baseline): 4/10 kritérií. R2: oprava P5 (odebrání modifikačního bugu), ale P3 přetrvá. R3 (klíčová): procedurální verifikace přinesla P3+P8 na 3/3, průlom na 9/10. R4-R5: demonstrace prompt sensitivity - malé změny instrukcí způsobily variabilitu v P2-P4." Pak tabulka souhrnných výsledků.

### D6: Nejasné očekávání vs. pozorování v ablacích
- **Kde:** kap04 Výběr složek pro ablaci (sekce 4.3)
- **Problém:** Text má "Očekávání:" část pro obě ablace, ale to prezentuje hypotézu jako předem zjištěnou. Mělo by být jasně "Předpokládáme, že..." nebo "Hypotéza: ...".
- **Dopad:** Čtenář si myslí, že je to předem určeno, ne otevřená otázka.
- **Řešení:** Změnit "Očekávání:" na "Hypotéza pro testování:" a v textu: "Předpokládáme, že pokud agent přesto spustí typecheck... pak jsou verifikační kroky redundantní. Alternativní hypotéza: zabudované znalosti modelu nejsou dostačující bez explicitních příkazů."

### D7: DSR sekce je příliš dlouhá a repetitivní
- **Kde:** kap03.1 (Návrhový výzkum)
- **Problém:** 5+ odstavců vysvětluje co je DSR, Peffersovy 6 aktivit, Hevner build-evaluate cyklus. VŠE FIS čtenář to zná.
- **Dopad:** Papír je zbytečně dlouhý.
- **Řešení:** Zkrátit na 2 odstavce: "(1) Náš výzkum spadá do návrhového výzkumu (Design Science Research, DSR) - navrhujeme a vyhodnocujeme artefakty (sadu metrik, iterativní postup), ne jen popisujeme fenomény [Hevner 2004, Peffers 2008]. (2) Konkrétně používáme embedded single-case design (Yin 2018): jeden projekt, ale multiple runs s různými instrukcemi, analytická generalizace spíš než statistická."

---

## Drobné problémy (nice-to-have)

### N1: Terminologická nejednotnost - "AGENTS.md" vs. "instrukce" vs. "scaffolding"
- **Kde:** Throughout práce
- **Problém:** Používá se zaměnitelně: "instrukce v souboru AGENTS.md", "scaffolding obsahuje...", "instrukční soubor". To jsou různé věci:
  - **Scaffolding** = teoretický koncept (struktura vůdce)
  - **Instrukce** = specifikace v přirozeném jazyce (co se měří)
  - **AGENTS.md** = konkrétní soubor v experimentu (implementace)
- **Dopad:** Zmatenost.
- **Řešení:** Na začátku kap03 přidat definici: "V práci rozlišujeme: (1) Scaffolding = teoretický koncept strukturovaných pokynů vedoucích agenta; (2) Instrukce = naše implementace scaffoldingu v přirozeném jazyce; (3) AGENTS.md = konkrétní soubor v experimentu obsahující instrukce."

### N2: Nejasné mapování literárních zjištění na naši metodiku
- **Kde:** kap02 (plánované) → kap03
- **Problém:** V kap02 se budou zmiňovat Mao et al. (7 komponent), Hassan et al. (Brief/Loop/Mentor), Lulla et al. (-28.6% runtime), ale nebude jasné jak z nich vyplývá naš design.
- **Dopad:** Čtenář se ptá "proč právě tyto metriky" nebo "proč tyto fixní proměnné".
- **Řešení:** V kap03 Metodika přidat podsekcí: "Teoretické ospravedlnění výběru metrik: [tabulka mapující každou metriku na zdroj v kap02]".

### N3: Přílohy nejsou uvedeny
- **Kde:** Throughout - text odkazuje na [ref:app:build-md], [ref:app:ai-disclosure] atd.
- **Problém:** Přílohy nejsou v předaném textu.
- **Dopad:** Chybí důležité detaily (obsah build.md, plný AGENTS.md, příklady kódu).
- **Řešení:** Vytvořit přílohy a přidat do PDF: A) build.md úplný; B) AGENTS.md r3 (baseline pro ablace); C) Rubriky pro LLM-as-judge; D) Příklady běhů (git log snippet); E) AI disclosure (využití Claude jako asistenta).

### N4: Nejasné - "test-first commits" vs. "test-first development"
- **Kde:** kap03.2.1 P3 metrika
- **Problém:** Metrika se jmenuje "Test-first commits" ale měří jestli existuje commit s prefixem "test:". To není test-first development - to je jen konvence pojmenování. Skutečný test-first by byl behaviorální trace.
- **Dopad:** Nejasné co se měří.
- **Řešení:** Přejmenovat metriku na "Test-first commit convention" nebo jasně: "P3 měří, zda agent psát testy v oddělených commitech (indikátor: `test:` prefix v commit message). Poznámka: toto měří procesní konvenci, ne kvalitu TDD na úrovni linting."

### N5: Tabulka [tab:metriky-prehled] - nejasné "exit kritérium"
- **Kde:** kap03.4
- **Problém:** Tabulka má sloupec "Exit kritérium" ale v textu není jasně řečeno co to znamená. Je to "cíl" (goal) nebo "práh" (threshold)?
- **Dopad:** Čtenář neví co znamená "pass" nebo "≥70%".
- **Řešení:** Pod tabulkou přidat poznámku: "Exit kritérium = podmínka kterou musí metrika splnit, aby pilotní iterace byla úspěšná. Deterministické metriky (P1-P5, Q1-Q2, Q5-Q6) mají binární práh (pass/fail). Minimální standard (P6-P8, Q3, Q7-Q8) vyžaduje dosažení specifikovaného skóre. E1-E3 jsou záznamové (bez kritéria)."

### N6: Výstupy experimentu - nejasné co je uloženo
- **Kde:** kap04 (průběh běhů)
- **Problém:** Text mluví o "FINDINGS.md", "DIAGNOSIS.md", "transcript.json", changelog, ale není jasné kde jsou archivovány a jak k nim má přístup.
- **Dopad:** Reprodukovatelnost je otázkou.
- **Řešení:** Přidat sekci: "Reproducibilita: Všechna data experimentu (git repo, session transcripts, metrické výstupy) jsou veřejně dostupná na [GitHub URL]. Zdrojový kód nástrojů analyze-run.ts a judge.sh je v experiments/infra/ adresáři."

### N7: Nejasné "behavioral model" a "state diagram"
- **Kde:** kap04 Konstrukce specifikace
- **Problém:** Text říká: "Behavioral model, state diagram ani explicitně formulované invarianty nejsou součástí zadání". To zní jako omezení, ale není jasné proč je to + nebo -.
- **Dopad:** Čtenář se ptá "měli bychom je zahrnout?".
- **Řešení:** Uvést důvod: "Neexplicitní behavioral model nutí agenta odvozovat workflow ze specifikace sám - to je realističtější scénář, ale zvyšuje riziko odchylek. Výhodou je, že experiment měří schopnost agenta strukturovat si práci, ne jen implementovat daný plán."

---

## Konzistence a terminologie

### Záznam nesrovnalostí:

| Pojem | Problém | Řešení |
|-------|---------|--------|
| **AGENTS.md** vs. **instrukce** | Používá se zaměnitelně | Definovat: AGENTS.md = soubor, instrukce = obsah |
| **Metriky P** vs. **procesní compliance** | Někdy "metriky P", někdy "checklist P1-P5" | Konsistentně: "procesní metriky (P1-P8)" |
| **Exit kritéria** vs. **práhy** | "Exit kritérium" pro binární, "minimální standard" pro měřitelné | Jasně: deterministické (exit) + minimální standard (thresholds) |
| **Behavioral summary** | "Faktická pozorování" ale není jasné jak se liší od interpretace | Definovat: "faktická data (počet issues, commitů) vs. interpretace (důvod)" |
| **Dedukce vs. empirie v ablacích** | Constraints nejsou ablován, ale text tvrdí "neplní funkciones" | Uvést explicitně: "hypotéza bez empirického ověření" |
| **Literární tvrzení bez citací** | "Instrukce fungují", "Agent je pomalejší" v motivaci bez citací | Přidat [citace] u každého tvrzení |

---

## Chybějící nebo slabé reference

### Literatura která se zmiňuje v MEMORY nebo textu, ale chybí nebo je slabá:

| Zdroj | Status | Řešení |
|-------|--------|--------|
| Fenton & Bieman (2014) | KRITICKÉ - není ověřen | Stáhnout, ověřit Process/Product/Resource, přidat do bibliography |
| Shin et al. [shin2025prompt] | Zmíněno v motivaci, ale bez [citation] | Přidat `\cite{shin2025prompt}` v textu, ověřit že je v sources |
| Papadakis et al. [papadakis2019] | Zmíněno v mutation testing sekci, měl by být v sources | Ověřit v sources.bib, přidat pokud chybí |
| McCabe [mccabe1976] | Zmíněno v cyklomatické složitosti | Ověřit že je korektní: McCabe, T. J. (1976). "A Complexity Measure." IEEE Transactions. |
| Zheng et al. [zheng2023mtbench] | MT-Bench, zmíněno v LLM-as-judge | OK, je správně citováno |
| PromptWizard [agarwal2024promptwizard] | Zmíněno v budoucím výzkumu | Ověřit citační údaje |
| Cohen's κ | Zmíněno jako neprovedeno | OK, je to omezení |

---

## Silné stránky práce

1. **Originální metrický rámec:** Sada 19 metrik (P1-P8, Q1-Q8, E1-E3) pokrývajících proces, kvalitu a efektivitu je komplexní a prvopočátně. Kombinace automatizovaných (deterministic) a LLM-as-judge metrik je dobře zdůvodněná.

2. **Prakticky realizovatelný iterativní postup:** Cyklus Spuštění/Měření/Diagnóza/Úprava se v praxi osvědčil (25-40 min per iterace, zlepšení z 4/10 na 9/10 deterministických kritérií). Autor demonstruje, že to není jen teoretické, ale pracuje v praxi.

3. **Transparentní experimentální design:** Fixní proměnné jsou jasně specifikovány (prázdné repo, single model, specifikace v issue formátu), což usnadňuje replikaci. Dokumentace změn (changelog per iterace) je vzorová.

4. **Spojení s contemporární literaturou:** Práce se odkazuje na Mao et al., Hassan et al., Lulla et al., Breunig, Razavi - ukazuje, že autor zná current research landscape v domain AI coding agents.

5. **Jasně identifikovaná research gap:** Motivace správně nastavuje, že existující benchmarky (SWE-bench) měří jen výsledek (pass/fail), nikoliv proces a kvalitu. To je legitimní mezera.

---

## Souhrnná tabulka hodnocení

| Dimenze | Skóre (1-3) | Hlavní problém |
|---------|-----------|---|
| **Metodologie** | 2 | Single-case study + LLM-as-judge bez validace omezují věrohodnost; prompt sensitivity není metodologicky řešen |
| **Argumentace** | 2 | Některá tvrzení příliš silná bez hedging; závěry z nevalidovaných metrik (Q8); motivace nemotivuje cíl 3 |
| **Konzistence** | 2 | Terminologie nejednotná (AGENTS.md/instrukce/scaffolding); nejasné propojení mezi cíli a výsledky; chapter 2 chybí |
| **Literatura** | 2 | Fenton & Bieman neověřen (KRITICKÉ); některé zdroje zmíněny v MEMORY ale nejsou v textu; kap02 by měla být hlubší |
| **Struktura** | 2 | Kap02 chybí (jen 41 finálních řádků); kap04 pilotní iterace příliš detailní; chybí přílohy; signposting mezi kapitolami slabý |
| **Síla tvrzení** | 2 | Závěry generalizovány mimo rozsah (jeden projekt, jeden model); ablace s dvěma běhy nejsou kauzální; Constraints tvrzení bez evidence |
| **Úplnost** | 2 | Cíl 1 (metriky) - ✓ OK; Cíl 2 (postup) - ✓ OK; Cíl 3 (ablace) - ~ parciální |
| **Prezentace** | 2 | Jasně napsáno, ale příliš dlouhé; pilotní běhy (r1-r5) zbytečně detailní; nepříliš čitelnách tabulky |

**Průměrný skóre: 2.0/3.0** (Odpovídá: "Obhajitelné, ale vyžaduje opravy")

---

## Specifická doporučení pro Each kapitolu

### Kap01 (Vymezení)
- [ ] Přidat větu motivující cíl 3 (ablace)
- [ ] Cíl 2 přeformulovat na SMART  
- [ ] V rozsahu přidat explicitní definici "spec-driven development"

### Kap02 (Teorie) - PSÁT DRAFT
- [ ] Struktura: 2.1 SWE & metriky, 2.2 AI coding agenti, 2.3 Scaffolding, 2.4 LLM-as-judge
- [ ] Ověřit Fenton & Bieman citaci
- [ ] Doplnit: Zheng et al. (LLM biases), Papadakis et al. (mutation testing), McCabe (complexity)

### Kap03 (Metodika)
- [ ] K1-K3: Opravy citované výše
- [ ] Zkrátit DSR sekci na 2 odstavce
- [ ] Přidat tabulku mapující metriky na zdroje v kap02
- [ ] V 3.5 jasněji: LLM-as-judge metriky = indikátory, ne dokazující evidence

### Kap04 (Praktická část)
- [ ] Zkrátit pilotní běhy (r1-r5) z jednotlivých sekcí na jednu shrnutí
- [ ] Detaily přesunout do Přílohy
- [ ] Formulovat "Hypotéza:" místo "Očekávání:" v ablacích
- [ ] Čárka u Q3 v tabulkách vysvětlit poznámkou

### Kap05 (Vyhodnocení)
- [ ] K18-K19: Opravy tvrzení - hedging, spekulace jako hypotézy
- [ ] Constraints tvrzení jasně jako "bez empirického ověření" (nejsou ablován)
- [ ] Doporučení pro praxi opatřit disclaimrem o generalizovatelnosti
- [ ] Přidat kapitolu "Metodologické limity se světle výsledků"

### Přílohy
- [ ] A) build.md (úplný)
- [ ] B) AGENTS.md r3 (baseline)
- [ ] C) Rubriky pro LLM-as-judge (p2, q4, q8)
- [ ] D) Příklady git log, transcript snippet
- [ ] E) AI disclosure (Claude jako asistent - kde, jak)

---

## Konečný verdict

**Práce je obhajitelná, ale VYŽADUJE:**

1. **Okamžité (KRITICKÉ):**
   - Kap02 DRAFT verze (teoretické základy)
   - K1, K2, K3, K4, K5 opravy (taxonomie, validace, motivace)

2. **Před obhajobou (DŮLEŽITÉ):**
   - D1-D7 opravy (cíle, struktura, hedging)
   - Konzistence terminologie

3. **Výrazně zlepší kvalitu (DROBNÉ):**
   - N1-N7 opravy
   - Přílohy
   - Zkrácení pilotních sekcí

**Časový odhad na revizi:** 2-3 týdny (vytvoření kap02, opravy, finalizace).

**Očekávaný výsledek po revizi:** Velmi dobrá práce s originálním přispěním (metriky + iterativní postup) a korektně zvládnutými omezeními (single case, prompt sensitivity, LLM-as-judge validace).