# Lineární checklist anotací vedoucího

Zdroj: `konzultace/08-anotace-vedouci.md` (`prace-anotace.pdf`, build 2026-04-27).

Účel: pracovní checklist pro průchod jeden bod po druhém. `08` zůstává raw audit trail s plnými anotacemi; tento soubor slouží k odškrtávání a diskusi.

Statusy:
- `[ ]` otevřené
- `[x]` vyřešené v textu a ověřené
- `[~]` částečně vyřešené nebo čeká na kontrolu v aktuálním PDF
- `[?]` vyžaduje rozhodnutí před přepisem

Routování: #63 otevření, #64 kap02, #65 kap03, #66 kap04, #62 závěrečná terminologie. Systémové body S/C se řeší v kontextu stránky, ne jako nový předblok.

## Checklist

## str. 4
- [x] `p04-01` (#63) **HL:** (vyřešil agent úkol?),
  - Kontrola: původní parentetická formulace už v abstraktu není; nahrazeno věcným rámcem funkčního výstupu a procesu.
- [x] `p04-02` (#63) **HL:** demonstrovat
  - Vedoucí: Toto byl opravdu cíl?
  - Kontrola: cíl je formulován jako návrh metrik a použití k iterativnímu návrhu; „demonstruje“ zůstává jen jako popis případové studie, ne jako akt cíle.
- [x] `p04-03` (#63) **HL:** ale ne monotónně.
  - Vedoucí: Nevím co je monotónní zlepšení postupu
  - Kontrola: abstrakt už vysvětluje regresi i odlišné dodržení postupu napříč běhy.
- [x] `p04-04` (#63) **HL:** redundantní;
  - Vedoucí: Tady by měl být jiný spojovník než ;
  - Kontrola: středník je pryč; věty jsou rozdělené tečkou.
- [x] `p04-05` (#63) **Sticky:** redun
  - Vedoucí: Ty věty jsou spíše výštěky než celé rozvité věty.
  - Kontrola: výsledková část abstraktu je nyní v rozvitých větách, ne ve fragmentech.
- [x] `p04-06` (#63) **HL:** konkrétní naměřené hodnoty jsou vázány na podmínky případové studie.
  - Vedoucí: Toto je také pouze AI výstřel
  - Kontrola: formulace je zeslabená a konkrétnější: hodnoty platí pro daný model, nástroj a projekt; přenositelný je postup a sada metrik.
- [x] `p04-07` (#63) **HL:** Abstract AI
  - Vedoucí: Měl by začít na vlastní stránce
  - Kontrola: vyřešeno vložením zalomení stránky před anglický abstract.

## str. 11 — Úvod
- [x] `p11-01` (#63) **HL:** funkční korektnost.
  - Vedoucí: funkční korektnost nevím co je
  - Kontrola: nahrazeno srozumitelnějším „zda vygenerovaný kód splní zadání a projde testy“.
- [x] `p11-02` (#63) **HL:** kvůli nedostatkům v procesu nebo udržovatelnosti.
  - Vedoucí: toto by bylo dobré alsepoň trochu vysvětlit
  - Kontrola: doplněn kompaktní příklad odmítnutí ve code review kvůli procesním konvencím nebo udržovatelnosti kódu.
- [x] `p11-03` (#63) **HL:** proces
  - Vedoucí: proces práce?
  - Kontrola: „proces“ v úvodu nahrazen přesnějším „pracovní postup agenta“.
- [x] `p11-04` (#63) **HL:** necháváme
  - Vedoucí: nepište v 1. osobě, ale ve 3. - v abstraktu bylo totéž
  - Kontrola: odstavec případové studie přepsán do 3. osoby / neosobního stylu.
- [x] `p11-05` (#63) **HL:** porovnává je s existujícím výzkumem.
  - Vedoucí: a mělo by také navrhnout zlepšení
  - Kontrola: závěr úvodu doplněn o formulaci doporučení pro návrh instrukcí.

## str. 12 — Motivace
- [ ] `p12-01` (#63) **HL:** projitých
  - Vedoucí: prošlých? Nebo jinak opsat
- [ ] `p12-02` (#63) **HL:** (B. Li et al., 2026
  - Vedoucí: Tady už se podruhé jméno neopakuje, pokud je součástí věty
- [ ] `p12-03` (#63) **HL:** METR (METR, 2026
  - Vedoucí: V citaci se podruhé jméno neopakuje
- [ ] `p12-04` (#63) **HL:** METR (METR, 2025
  - Vedoucí: v citaci se podruhé jméno neobjevuje
- [ ] `p12-05` (#63) **HL:** Ehsani et al. (Ehsani et al., 2026)
  - Vedoucí: Už naposledy, ale evidentně to v práci máte všude, tak opravit
- [ ] `p12-06` (#63) **HL:** o;
  - Vedoucí: nepoužívejte pokud není potřeba, spíše se ve větách používá ,

## str. 13 — Rozsah práce
- [ ] `p13-01` (#63) **HL:** demonstrovat
  - Vedoucí: toto je ošemetné, jak změříte, že bylo demonstrováno
- [ ] `p13-02` (#63) **HL:** naše
  - Vedoucí: tato místo naše

## str. 14 — Kvalita software a její měření
- [ ] `p14-01` (#64) **HL:** vývojáři tuto složitost
  - Vedoucí: kterou z nich?
- [ ] `p14-02` (#64) **HL:** náklady,
  - Vedoucí: Asi by se hodilo promluvit o zdrojích

## str. 15 — Procesní kvalita
- [ ] `p15-01` (#64) **HL:** proxy nákladů
  - Vedoucí: lze zvolit jiný pojem?

## str. 16 — Produktová kvalita
- [ ] `p16-01` (#64) **HL:** Atomicita
  - Vedoucí: Je to správné slovo?
- [ ] `p16-02` (#64) **HL:** maintainer
  - Vedoucí: zkuste najít lepší slovo

## str. 17
- [ ] `p17-01` (#64) **HL:** (ISO/IEC, 2023)
  - Vedoucí: ISO/IEC není autor ne? Do citace se píše autor a rok
- [ ] `p17-02` (#64) **HL:** (Inozemtseva & Holmes, 2014
  - Vedoucí: Jen připomínám problémy s citováním (Pokud v textu je již autor uvedený, pak se do závorky - citace - píše jen rok)
- [ ] `p17-03` (#64) **HL:** drobné změny (mutanty),
  - Vedoucí: Nejsem si jistý, jestli se opravdu v češtině používá mutanty

## str. 18 — Zdrojová dimenze
- [ ] `p18-01` (#64) **HL:** et al. (Beller et al., 2016)
  - Vedoucí: zde také
- [ ] `p18-02` (#64) **HL:** procesního úhlu, kde je relevantní samotný fakt, že review proběhlo, a jeho navázání na issue
  - Vedoucí: Tahle věta je zvláštně formulovaná

## str. 19 — Základní pojmy
- [ ] `p19-01` (#64) **HL:** Cost models
  - Vedoucí: Český výraz?
- [ ] `p19-02` (#64) **HL:** chybu
  - Vedoucí: ne chybu, ale chybovost ne?
- [ ] `p19-03` (#64) **HL:** wall-clock
  - Vedoucí: lze toto také říci jinak?
- [ ] `p19-04` (#64) **HL:** Předchozí sekce popsala kvalitu software v tradičním vývoji. AI coding agenti tento kontext mění: kód nepíše člověk, ale autonomní systém řízený instrukcemi
  - Vedoucí: Tento styl začátku odstavce máte skoro všude:
- [ ] `p19-05` (#64) **HL:** Tři dimenze
  - Vedoucí: Na konci předchozí "sekce" (kapitoly spíš ne?) ovšem již změnu u agentů popisujete, tak proč tady říkáte, že se to mění?
- [ ] `p19-06` (#64) **HL:** Samotný LLM je pasivní:
  - Vedoucí: Opět ten druh věty s dvojtečkou, není to hezké čtení

## str. 20 — Jak agenti mění softwarové inženýrství
- [ ] `p20-01` (#64) **HL:** u SWE-agent
  - Vedoucí: Tady by bylo dobré skloňovat nebo přidat nějaké slovo, aby to působilo jasněji
- [ ] `p20-02` (#64) **HL:** sekce.
  - Vedoucí: kapitola
- [ ] `p20-03` (#64) **HL:** Tato práce se zaměřuje na fáze generování kódu a testů, ke kterým je dnes k dispozici nejvíce empirických studií agentního chování.
  - Vedoucí: Nemluvte zde o zaměření práce, mluví o ní v odstavci výše a je to tedy tady zbytečně.
- [ ] `p20-04` (#64) **HL:** Tento posun zároveň přináší typická selhání, která se v každé dimenzi projevují jinak. Jejich společným pozadím jsou omezení, která agent dědí z LLM: omezené kontextové okno, absence implicitní znalosti projektu a pravděpodobnostní povaha výstupu.
  - Vedoucí: Tyto AI structured věty mě vytáčí
- [ ] `p20-05` (#64) **HL:** code smells,
  - Vedoucí: Hezké, ale musíte vysvětlit

## str. 22 — Instrukce jako nezávislá proměnná
- [ ] `p22-01` (#64) **HL:** mírou
  - Vedoucí: míru?
- [ ] `p22-02` (#64) **HL:** í oracle,
  - Vedoucí: to má český výraz ne?

## str. 24
- [ ] `p24-01` (#64) **HL:** Konkrétnost instrukce je sama o sobě faktor: Kim et al. (Kim, 2025) v benchmarku DETAIL a Zi et al. (Zi et al., 2025) na úlohách s kódem shodně ukazují, že vyšší specificita zvyšuje úspěšnost agenta, ale přílišný detail může omezit jeho reasoning.
  - Vedoucí: Jen zase připomenu tu strukturu věty
- [ ] `p24-02` (#64) **HL:** Chování modelu lze tedy ovlivnit přímým vynucením i aktivací latentních znalostí; která z cest je v konkrétním případě účinnější, nelze rozhodnout předem.
  - Vedoucí: Lze tuto větu formulovat jinak?
- [ ] `p24-03` (#64) **HL:** ač hlavní páka chování
  - Vedoucí: To je divná vsuvka

## str. 25 — Případ a jeho prostředí
- [ ] `p25-01` (#65) **HL:** Předchozí kapitoly ukázaly potřebu vícerozměrného hodnocení agenta a roli instrukcí jako nezávislé proměnné. Tato kapitola na nich staví metodiku.
  - Vedoucí: Tady už používáte kapitoly to je dobře, ale hned pod tím opět sekce
- [ ] `p25-02` (#65) **HL:** Sekce 3.1 zdůvodňuje volbu případové studie jako výzkumné strategie, představuje zvolený projekt, fáze studie (pilot a ablace) a strukturu iterativního cyklu. Sekce 3.2 definuje sadu 19 metrik ve třech kategoriích (proces, produkt, efektivita). Sekce 3.3 po...
  - Vedoucí: Asi tento odstavec nepotřebuji. Obecně těch odkazovacích odstavců máte zbytečně moc, zkuste je odstranit

## str. 26 — Fáze a iterativní cyklus
- [ ] `p26-01` (#65) **HL:** Zvolili jsme systém upomínek faktur: systém pro automatické odesílání připomínek k nezapla- ceným fakturám.
  - Vedoucí: opět
- [ ] `p26-02` (#65) **HL:** Bez pilotu by ablace neměla z čeho vycházet, bez ablace bychom o redundanci složek mohli jen spekulovat.
  - Vedoucí: Divná věta, asi zbytečná, když je to cílem práce
- [ ] `p26-03` (#65) **HL:** Pilotní fáze postupuje proti exit kritériím ve sloupci Exit kritérium tabulky 3.10.
  - Vedoucí: Tahle věta vůbec na první dobrou nedává smysl. Co jsou to exit kritéria musíte popsat
- [ ] `p26-04` (#65) **HL:** Tato kritéria představují principiální ideál: striktní 42/42 referenčních testů, nulové lint warnings, nulové porušení složitosti.
  - Vedoucí: I zde je potřeba vše vysvětlit
- [ ] `p26-05` (#65) **HL:** Sám zvolený projekt nemusí být v tomto smyslu plně dosažitelný v jediném autonomním běhu; pro orientační srovnání měla i referenční implementace napsaná ručně tři kosmetická lint warnings (sekce 4.1.1). Pro praktické řízení iterací proto pracujeme s operačn...
  - Vedoucí: Ty Q se řeší až mnohem později v práci, buď je vysvětlete rovnou nebo na ně neodkazujte
- [ ] `p26-06` (#65) **HL:** které lépe rozlišují běhy mezi sebou a odpovídají barevnému kódování souhrnné tabulky a vizualizací v kapitole 5.
  - Vedoucí: Nechci se teď dívat na kapitolu 5. Vysvětlete to zde
- [ ] `p26-07` (#65) **HL:** (kapitola 5, počty “ z 10”) a zda splnil operační prahy (graf 5.2). “X
  - Vedoucí: Chápu, že se zde chcete odkazovat na výsledky, ale to v práci teprve přijde. Představte si, že to píšete průběžně, když tu práci děláte. Také nevíte, kdy a jak budou vypadat výsledky.

## str. 27 — Sada metrik
- [ ] `p27-01` (#65) **HL:** další iterace by přinášely jen drobné lokální úpravy.
  - Vedoucí: Toto je zaručeno/vzniklo jak?
- [ ] `p27-02` (#65) **HL:** Tato definice odpovídá proveditelnosti na jednom případu, neimplikuje obecnou platnost prahů pro jiné agenty a projekty.
  - Vedoucí: Zkuste i tuto větu trochu přeformulovat
- [ ] `p27-03` (#65) **HL:** Z fungující sady instrukcí (výstup pilotní fáze) systematicky odebíráme jednotlivé složky a měříme dopad na chování agenta: potřebuje agent danou část instrukcí, nebo je redundantní?
  - Vedoucí: Vidíte, co říkám s tou větou s dvojtečkou?
- [ ] `p27-04` (#65) **HL:** předem;
  - Vedoucí: Mimochodem dlouho jsem nezmiňoval středníky. Kdo tak píše?
- [ ] `p27-05` (#65) **HL:** I se dvěma běhy nelze dosáhnout statistické průkaznosti (sekce 3.5); výsledky proto interpretujeme jako indikativní, ne kauzální.
  - Vedoucí: Tohle je strašně důležitá věta a bude to obecně důležité přiznávat během obhajoby
- [ ] `p27-06` (#65) **HL:** ověřit cíl 2
  - Vedoucí: Splnit? Cíl - ověřují se hypotézy, zodpovídají se otázky a cíle se plní. Raději se podívejte zda to jinde v práci také nemáte blbě
- [ ] `p27-07` (#65) **HL:** Iterativní cyklus. V obou fázích je vlastní postup iterativní cyklus, protože jediná iterace nestačí ověřit cíl 2. Pokud má sada metrik fungovat jako diagnostický nástroj, musí naměřená hodnota vést k identifikovatelné úpravě instrukcí a další běh musí ukáz...
  - Vedoucí: Je to pěkné, ale dá se to obecně říct jednodušeji

## str. 28 — Procesní metriky (P1–P8)
- [ ] `p28-01` (#65) **HL:** Teoretické základy jednotlivých metrik (proč jsou validní, jaká je evidence) popisuje sekce 2.1.
  - Vedoucí: To už čtenář četl. Jak jsem psal uberte většinu těchto odkazů
- [ ] `p28-02` (#65) **HL:** agentova issue
  - Vedoucí: issue vytvořené agentem
- [ ] `p28-03` (#65) **HL:** Behavioral trace
  - Vedoucí: Vysvětlit
- [ ] `p28-04` (#65) **HL:** na souborech v tests/; nově přidané git diff --diff-filter=M testy se nezapočítávají.
  - Vedoucí: Ještě trochu dopopsat, nezačínat pokynem

## str. 29 — Produktové metriky (Q1–Q8)
- [ ] `p29-01` (#65) **HL:** Popisnost
  - Vedoucí: popisnost nebo popis? Popisnost se totiž jeví i více jako kreativní esejovité popisy a to není asi chtěné ne?
- [ ] `p29-02` (#65) **HL:** (bezpečnost, výkonnostní efektivita, kompatibilita, použitelnost, spolehlivost, přenositelnost
  - Vedoucí: proč se nedá měřit bezpečnost např?
- [ ] `p29-03` (#65) **HL:** detekují agentovy testy skutečné chyby
  - Vedoucí: zda detekuji..
- [ ] `p29-04` (#65) **HL:** typy sedí, nebo ne.
  - Vedoucí: bez čárky?
- [ ] `p29-05` (#65) **HL:** Shoda s API kontraktem
  - Vedoucí: to je jediné měřítko správné implementace? Asi ne ne
- [ ] `p29-06` (#65) **HL:** Vitest
  - Vedoucí: Vitest
- [ ] `p29-07` (#65) **HL:** . Testy ověřují chování přes veřejné API (black-box, sekce 2.1.2). Konstrukci referenční test suite popisuje sekce 4.1.1.
  - Vedoucí: Sem už odkazy na jiné kapitoly vůbec nepatří
- [ ] `p29-08` (#65) **HL:** Poznámka: Q1 je vstupní podmínkou pro Q2: pokud agentův kód neimplementuje správné API, referenční testy nelze ani zkompilovat a výsledek Q2 by byl nesmyslný.
  - Vedoucí: Poznámka pod čarou?

## str. 30 — Metriky efektivity (E1–E3)
- [ ] `p30-01` (#65) **HL:** Stryker
  - Vedoucí: V této kapitole přímo o Strykeru nemluvíte
- [ ] `p30-02` (#65) **HL:** zdrojový kód. Výstup: procento zabitých mutantů
  - Vedoucí: Chápu, že se snažíte o překlad, ale tady naopak by byl lepší příklad a doslovné uvedení v AJ
- [ ] `p30-03` (#65) **HL:** Cyklomatická složitost
  - Vedoucí: Cyklomatická?
- [ ] `p30-04` (#65) **HL:** Práh 10 per funkci pro Q7 vychází z McCabe (sekce 2.1.2). ≤
  - Vedoucí: To víme.
- [ ] `p30-05` (#65) **HL:** Poznámka: Práh 10 per funkci pro Q7 vychází z McCabe (sekce 2.1.2). Celkové skóre Q8 ≤ je minimum pěti dimenzí, nikoliv průměr. Volba minima je záměrná: jeden slabý rozměr má stáhnout celkový výsledek dolů, aby slabiny nebyly maskované silnými dimenzemi
  - Vedoucí: Opět poznámka pod čarou?

## str. 31 — Experimentální design
- [ ] `p31-01` (#65) **HL:** exit kritérium
  - Vedoucí: stále sem se nikde nedočetl o Exit kritériu
- [ ] `p31-02` (#65) **HL:** Se dvěma běhy per variaci jsou tyto hodnoty deskriptivní, ne inferenční.
  - Vedoucí: Toto by vyžadovalo opět více rozepsat
- [ ] `p31-03` (#65) **HL:** Agentní běhy provádí model MiniMax-M2.5;
  - Vedoucí: Tady se poprvé setkáme s tím jaký model je použitý. Nevím jestli to je dobře. Myslím, že by se to mělo objevovat téměř od začátku práce
- [ ] `p31-04` (#65) **HL:** Důvod: model
  - Vedoucí: Takto nepište
- [ ] `p31-05` (#65) **HL:** Hodnocení probíhá na škále 1–3 per dimenze: 1 = nevyhovující, 2 = přijatelné, 3 = dobré. Jemnější škály (1–5, 1–10) produkují při malém počtu hodnocených artefaktů nižší shodu mezi hodnotiteli (Zheng et al., 2023); třístupňová škála je pro tento rozsah spol...
  - Vedoucí: Opět AI formáty
- [ ] `p31-06` (#65) **HL:** Rubrika.
  - Vedoucí: Je Rubrika správné slovo?
- [ ] `p31-07` (#65) **HL:** Interpretace výsledků. LLM-as-judge zde neslouží jako plně objektivní měření, ale jako strukturované posouzení vlastností, které nelze spolehlivě vyhodnotit deterministickým skrip- tem. Výsledky těchto metrik proto interpretujeme jako podpůrné kvalitativní...
  - Vedoucí: Opět toto by mělo být uvedeno pořádně i na začátku celého řešení jako jedna z hlavních point.

## str. 32 — Fixní proměnné
- [ ] `p32-01` (#65) **HL:** Tato sekce navazuje operačním detailem: jaké proměnné držíme fixní mezi běhy (sekce 3.3.1), jak jeden běh zaznamenáváme a vyhodnocujeme (sekce 3.3.2) a jakou procedurou diagnostikujeme a upravujeme instrukce (sekce 3.3.3).
  - Vedoucí: AI formát

## str. 33 — Diagnostika a úprava instrukcí
- [ ] `p33-01` (#65) **HL:** exportuje session new-run.ts do ( transcript.json
  - Vedoucí: Možná by bylo někde dobré také uvést obecnou strukturu projektu před tím než se začne uvádět více souborů než build.md a agents.md

## str. 34
- [ ] `p34-01` (#65) **HL:** Kdyby tento řádek chyběl, udělal by agent neočividnou chybu?
  - Vedoucí: Proč je to kurzívou?
- [ ] `p34-02` (#65) **HL:** Hranice mezi typy příčin jsou v praxi neostré a klasifikace vyžaduje úsudek; rámce slouží jako heuristické vodítko, ne algoritmus. Roli AI asistence při této analýze popisuje sekce 3.5.
  - Vedoucí: Tohle je úplně mimo, tento popis máte přeci už nahoře. Všechny tyto informace by měly být jasně řečeny na začátku metodiky.
- [ ] `p34-03` (#65) **HL:** Přestrukturování instrukcí má přednost před jejich rozšiřováním: redundantní obsah zvyšuje inference cost bez přínosu k úspěšnosti (Gloaguen et al., 2026) a fokusované instrukce překonávají vyčerpávající dokumentaci (X. Li et al., 2026).
  - Vedoucí: Tady už jsou zdroje zbytečné ne? Pokud to je teoretický základ, tak to mělo být popsáno v teorii. Zde už jen ukážete co jste udělal a na to není potřeba se odkazovat na cizí práci

## str. 35 — Omezení a validita
- [ ] `p35-01` (#65) **HL:** KAPITOLA 3. METODIKA optimization (APO) (Schnabel & Neville, 2024), kde smyčka score synthesize formálně → odpovídá našemu cyklu měření diagnóza úprava; reprezentanty jsou například PromptWi- → → zard (Agarwal et al., 2024) a Prompt Alchemy (Ye et al., 2025...
  - Vedoucí: Tady mám pocit, že trochu pletete výsledek s metodikou. Resp. předpokládáte určitý výsledek. Zkuste si texty v této kapitole projít a popsat je skutečně bez informace o výsledku. Tedy ne že přepokládáte něco, ale řeknete varianty, které můžete udělat a podle XY se rozhodnete.
- [ ] `p35-02` (#65) **HL:** Tabulka 3.10:
  - Vedoucí: Až teď to vidím, je zvykem, že všechny tabulky mají jednotné číáslování a ne s odkazem na kapitolu
- [ ] `p35-03` (#65) **HL:** operační prahy
  - Vedoucí: Zpětně se také dívám a nejsem si jistý jestli operační prahy je zvoleno jako správný název pro to. Z čeho vycházíte?
- [ ] `p35-04` (#65) **HL:** 3.1.3. Způsob sběru odpovídá rozlišení deterministické metriky, kvalitativní metriky a záznamové metriky zavedenému v kapitole 2.
  - Vedoucí: Stále odkazuje skrz naskrz práci

## str. 36
- [ ] `p36-01` (#65) **HL:** hrozby validity,
  - Vedoucí: Validita nikomu nehrozí, to používáte špatně
- [ ] `p36-02` (#65) **HL:** známe
  - Vedoucí: nepoužívat první osobu
- [ ] `p36-03` (#65) **HL:** Jak se tyto hrozby skutečně projevily v naměřených datech, diskutuje sekce 5.3.
  - Vedoucí: Další odkazy
- [ ] `p36-04` (#65) **HL:** (měříme to, co chceme měřit?).
  - Vedoucí: I když chápu proč to tady je, tak to patří dovnitř textu, který je zatím.
- [ ] `p36-05` (#65) **HL:** (Papadakis et al., 2019), cyklomatická složitost (McCabe, 1976), taxonomie procesních a produktových metrik (Fenton & Bieman, 2014)
  - Vedoucí: Myslím, že ty zdroje jste už uváděl ne?
- [ ] `p36-06` (#65) **HL:** Jednotlivé metriky vychází z existující teorie: mutation testing (Papadakis et al., 2019), cyklomatická složitost (McCabe, 1976), taxonomie procesních a produktových metrik (Fenton & Bieman, 2014). Konkrétní kombinace metrik do sady a volba exit kritérií js...
  - Vedoucí: Tady jen popisujete ty metriky? To je zbytečné
- [ ] `p36-07` (#65) **HL:** U metriky Q4 byly historicky uložené judge běhy exportovány ve 24bodovém formátu; chybějící bod AC25 (custom holiday calendar) byl při finalizaci práce dopočítán manuálně.
  - Vedoucí: Tohle by stálo za výrazně větší komentář než je to takto říci
- [ ] `p36-08` (#65) **HL:** Konstruktová validita (měříme to, co chceme měřit?). Jednotlivé metriky vychází z existující teorie: mutation testing (Papadakis et al., 2019), cyklomatická složitost (McCabe, 1976), taxonomie procesních a produktových metrik (Fenton & Bieman, 2014). Konkré...
  - Vedoucí: Hlavně tady zase mluvíte o výsledcích, které ještě nejsou známé...
- [ ] `p36-09` (#65) **HL:** (jsou závěry podložené daty?).
  - Vedoucí: Jak jsem psal výše, toto sem nepatří
- [ ] `p36-10` (#65) **HL:** Externí validita (lze zobecnit?). Případová studie na jednom projektu, jednom modelu a jednom agentním nástroji neumožňuje statistickou generalizaci. Yin (R. K. Yin, 2018) pro tento typ výzkumu rozlišuje analytickou generalizaci: z jednoho případu lze ukáza...
  - Vedoucí: Lze toto ještě také popsat svými slovy -> tedy něco jako. Na základě toho a toho můžeme říct, že nelze/lze a do jaké míry výzkum zobecnit?

## str. 37 — Systém upomínek faktur
- [ ] `p37-01` (#65) **HL:** Specifikace systému upomínek faktur tvoří fixní zadání, které agent dostává v Issue #1.
  - Vedoucí: Lze se na něj někde podívat?
- [ ] `p37-02` (#65) **HL:** API Contract (co musí implementace exportovat). API kontrakt je současně jediným technickým omezením implementace a vstupem pro metriku Q1 (API contract match).
  - Vedoucí: Vlastně si myslím, že toto mělo být popsáno dříve.

## str. 39 — Konstrukce baseline instrukcí
- [ ] `p39-01` (#66) **HL:** pauzu, ale selhává při opakovaném pause/resume, protože druhá pauza ztratí historii první. Za druhé, všechny timeouty se počítají v pracovních dnech, takže od pátku není čtrnáct +14 bd kalendářních dnů a hranice mezi víkendem a pondělím jsou off-by-one zóna...
  - Vedoucí: Vlastně si myslím, že toto je spíše metodika ne?

## str. 40
- [ ] `p40-01` (#66) **HL:** Toto mapování zakládá metodologickou otázku: pokud sekce instrukcí sledují měřené dimenze, hrozí, že metriky budou měřit shodu instrukce s vlastním zápisem, ne kvalitu výstupu. Procesní metriky P1–P5 skutečně měří dodržení postupu, který instrukce předepisu...
  - Vedoucí: Tady už žádné otázky nezakládejte.
- [ ] `p40-02` (#66) **HL:** Konstrukce proběhla ve dvou krocích: návrh struktury podle pořadí komponent popsaných Mao et al. (Mao et al., 2025) a mapování tří dimenzí chování (sekce 3.2) na konkrétní instrukce. Výsledné sekce (Role, Goal, Specification, Environment, Process, Package Q...
  - Vedoucí: Tohle by si zasloužilo konkrétnost a vizuál zřejmě
- [ ] `p40-03` (#66) **HL:** Procesní sekce obsahuje stručné instrukce pro spec-first TDD (Mathews & Nagappan, 2024), dekompozici do sub-issues, branch-per-issue a conventional commits. Sekce Package Quality vymezuje očekávání na modularitu, striktní typování, dokumentaci a čisté veřej...
  - Vedoucí: Tak to by asi šlo ukázat celé

## str. 41 — Pilotní fáze
- [ ] `p41-01` (#66) **HL:** Obrázek 4.2: Baseline (pilot-r1): kompletní znění instrukcí použitých jako výchozí AGENTS.md bod pilotních iterací.
  - Vedoucí: Nedělal bych to jako obrázek, ale jako text = kód
- [ ] `p41-02` (#66) **HL:** Specifikace, referenční implementace a baseline instrukce tvoří výchozí bod experimentu. Následující sekce popisuje průběh pilotních iterací cyklem Spuštění/Měření/Diagnóza/Úprava (sekce 3.1.3).
  - Vedoucí: Zbytečný text a ještě zbytečnější odkaz

## str. 42 — Pilot-r1: baseline
- [ ] `p42-01` (#66) **HL:** Každá iterace sleduje cyklus Spuštění/Měření/Diagnóza/Úprava (sekce 3.1.3)
  - Vedoucí: To je prakticky stejná věta jako nahoře
- [ ] `p42-02` (#66) **HL:** Každá iterace sleduje cyklus Spuštění/Měření/Diagnóza/Úprava (sekce 3.1.3) a popisujeme ji ve stejné struktuře: tabulkou metrik, diagnostikou (pozorování chování agenta, interpretace selhání a posun do další iterace) a vizuálním diffem upravené verze md. U...
  - Vedoucí: Tady opět AI spíše popisuje obecně co by se mělo dělat ale ne to jak se to udělalo
- [ ] `p42-03` (#66) **HL:** Ze
  - Vedoucí: z

## str. 57 — Cíl 1: Sada metrik
- [ ] `p57-01` (#66 / #65) **HL:** (sekce 5.1), poté v kontextu existují- cího výzkumu (sekce 5.2) a nakonec diskutuje, jak se metodologická omezení identifikovaná v sekci 3.5 projevila v praxi (sekce 5.3).
  - Vedoucí: Už žádné odkazy prosím
- [ ] `p57-02` (#66 / #65) **HL:** Na základě analýzy existujících standardů kvality softwaru a současných benchmarků pro AI agenty navrhnout sadu metrik pokrývající proces, kvalitu kódu a efektivitu (dimenze, které stávající benchmarky neměří). Sada 19 metrik byla navržena (kapitola 3) a po...
  - Vedoucí: Když jsem se teď vrátil ke kapitole 3, myslím, že máte zdroje na metriky jen Q - bylo by zřejmě dobré doplnit zdroje i na metriky další

## str. 62 — Cíl 2: Iterativní postup
- [ ] `p62-01` (#63 / #65) **HL:** může vést k měřitelnému zlepšení, nikoli však že stejný efekt nastane obecně. Postup vedl k měřitelnému zlepšení, ale ne monotónnímu. Baseline (r1) splnila čtyři z deseti tvrdých deterministických procesních a produktových kritérií. Po dvou cyklech úprav (r...
  - Vedoucí: Opět jak jsem zmiňoval už na začátku - nejsem si jistý, že "demonstrace" proběhla - protože to se špatně měří. Zkusme tento cíl trochu upravit. nebo vynechat

## Pravidla průchodu

- Nejdřív určit roli dotčené sekce, potom teprve leštit větu.
- Pokud je bod už opravený v aktuálním textu, odškrtnout až po kontrole v `thesis/*.tex` nebo PDF.
- Když bod ukazuje na vyšší problém struktury, neřešit ho mikropřepisem a poznamenat rozhodnutí k danému issue.
- C6 neuzavírat před koncem; termíny opravovat cestou, finální konzistenci projet až po kapitolních úpravách.
