# Anotace vedoucího — `prace-anotace.pdf`

Vytaženo z PDF s anotacemi (Jiří Korčák, 119 anotací). Strany odpovídají číslům **PDF stránky** v `prace-anotace.pdf`. Sekce jsou mapované přes TOC.

Legenda:
- **HL** = zvýrazněný text v práci
- **POZN** = komentář vedoucího
- (bez POZN) = jen highlight bez komentáře — typicky ukazuje na místo, kde vedoucí něco hodnotí ne-textově (nesouhlas / zpřesnit / zkrátit)

### str. 4

- **HL:** _(vyřešil agent úkol?),_
- **HL:** _demonstrovat_
  - **POZN:** Toto byl opravdu cíl?
- **HL:** _ale ne monotónně._
  - **POZN:** Nevím co je monotónní zlepšení postupu
- **HL:** _redundantní;_
  - **POZN:** Tady by měl být jiný spojovník než ;
- **Sticky note** (kotva v textu: _redun
kódu._)
  - **POZN:** Ty věty jsou spíše výštěky než celé rozvité věty.
- **HL:** _konkrétní naměřené hodnoty jsou vázány na podmínky případové studie._
  - **POZN:** Toto je také pouze AI výstřel
- **HL:** _Abstract AI_
  - **POZN:** Měl by začít na vlastní stránce

## str. 11 — [Úvod]

- **HL:** _funkční korektnost._
  - **POZN:** funkční korektnost nevím co je
- **HL:** _kvůli nedostatkům v procesu nebo udržovatelnosti._
  - **POZN:** toto by bylo dobré alsepoň trochu vysvětlit
- **HL:** _proces_
  - **POZN:** proces práce?
- **HL:** _necháváme_
  - **POZN:** nepište v 1. osobě, ale ve 3. - v abstraktu bylo totéž
- **HL:** _porovnává je s existujícím výzkumem._
  - **POZN:** a mělo by také navrhnout zlepšení

## str. 12 — [Motivace]

- **HL:** _projitých_
  - **POZN:** prošlých? Nebo jinak opsat
- **HL:** _(B. Li et al., 2026_
  - **POZN:** Tady už se podruhé jméno neopakuje, pokud je součástí věty
- **HL:** _METR (METR, 2026_
  - **POZN:** V citaci se podruhé jméno neopakuje
- **HL:** _METR (METR, 2025_
  - **POZN:** v citaci se podruhé jméno neobjevuje
- **HL:** _Ehsani et al. (Ehsani et al., 2026)_
  - **POZN:** Už naposledy, ale evidentně to v práci máte všude, tak opravit
- **HL:** _o;_
  - **POZN:** nepoužívejte pokud není potřeba, spíše se ve větách používá ,

## str. 13 — [Rozsah práce]

- **HL:** _demonstrovat_
  - **POZN:** toto je ošemetné, jak změříte, že bylo demonstrováno
- **HL:** _naše_
  - **POZN:** tato místo naše

## str. 14 — [Kvalita software a její měření]

- **HL:** _vývojáři tuto složitost_
  - **POZN:** kterou z nich?
- **HL:** _náklady,_
  - **POZN:** Asi by se hodilo promluvit o zdrojích

## str. 15 — [Procesní kvalita]

- **HL:** _proxy nákladů_
  - **POZN:** lze zvolit jiný pojem?

## str. 16 — [Produktová kvalita]

- **HL:** _Atomicita_
  - **POZN:** Je to správné slovo?
- **HL:** _maintainer_
  - **POZN:** zkuste najít lepší slovo

### str. 17

- **HL:** _(ISO/IEC, 2023)_
  - **POZN:** ISO/IEC není autor ne? Do citace se píše autor a rok
- **HL:** _(Inozemtseva & Holmes, 2014_
  - **POZN:** Jen připomínám problémy s citováním (Pokud v textu je již autor uvedený, pak se do závorky - citace - píše jen rok)
- **HL:** _drobné změny (mutanty),_
  - **POZN:** Nejsem si jistý, jestli se opravdu v češtině používá mutanty

## str. 18 — [Zdrojová dimenze]

- **HL:** _et al. (Beller et al., 2016)_
  - **POZN:** zde také
- **HL:** _procesního úhlu, kde je relevantní samotný fakt, že review proběhlo, a jeho navázání na issue_
  - **POZN:** Tahle věta je zvláštně formulovaná

## str. 19 — [Základní pojmy]

- **HL:** _Cost models_
  - **POZN:** Český výraz?
- **HL:** _chybu_
  - **POZN:** ne chybu, ale chybovost ne?
- **HL:** _wall-clock_
  - **POZN:** lze toto také říci jinak?
- **HL:** _Předchozí sekce popsala kvalitu software v tradičním vývoji. AI coding agenti tento kontext mění: kód nepíše člověk, ale autonomní systém řízený instrukcemi_
  - **POZN:** Tento styl začátku odstavce máte skoro všude: Text: vysvětlení. Takto píše pouze AI, přepište to, takto se to blbě čte a vypadá
- **HL:** _Tři dimenze_
  - **POZN:** Na konci předchozí "sekce" (kapitoly spíš ne?) ovšem již změnu u agentů popisujete, tak proč tady říkáte, že se to mění?
- **HL:** _Samotný LLM je pasivní:_
  - **POZN:** Opět ten druh věty s dvojtečkou, není to hezké čtení

## str. 20 — [Jak agenti mění softwarové inženýrství]

- **HL:** _u SWE-agent_
  - **POZN:** Tady by bylo dobré skloňovat nebo přidat nějaké slovo, aby to působilo jasněji
- **HL:** _sekce._
  - **POZN:** kapitola
- **HL:** _Tato práce se zaměřuje na fáze generování kódu a testů, ke kterým je dnes k dispozici nejvíce empirických studií agentního chování._
  - **POZN:** Nemluvte zde o zaměření práce, mluví o ní v odstavci výše a je to tedy tady zbytečně.
- **HL:** _Tento posun zároveň přináší typická selhání, která se v každé dimenzi projevují jinak. Jejich společným pozadím jsou omezení, která agent dědí z LLM: omezené kontextové okno, absence implicitní znalosti projektu a pravděpodobnostní povaha výstupu._
  - **POZN:** Tyto AI structured věty mě vytáčí
- **HL:** _code smells,_
  - **POZN:** Hezké, ale musíte vysvětlit

## str. 22 — [Instrukce jako nezávislá proměnná]

- **HL:** _mírou_
  - **POZN:** míru?
- **HL:** _í oracle,_
  - **POZN:** to má český výraz ne?

### str. 24

- **HL:** _Konkrétnost instrukce je sama o sobě faktor: Kim et al. (Kim, 2025) v benchmarku DETAIL a Zi et al. (Zi et al., 2025) na úlohách s kódem shodně ukazují, že vyšší specificita zvyšuje úspěšnost agenta, ale přílišný detail může omezit jeho reasoning._
  - **POZN:** Jen zase připomenu tu strukturu věty
- **HL:** _Chování modelu lze tedy ovlivnit přímým vynucením i aktivací latentních znalostí; která z cest je v konkrétním případě účinnější, nelze rozhodnout předem._
  - **POZN:** Lze tuto větu formulovat jinak?
- **HL:** _ač hlavní páka chování_
  - **POZN:** To je divná vsuvka

## str. 25 — [Případ a jeho prostředí]

- **HL:** _Předchozí kapitoly ukázaly potřebu vícerozměrného hodnocení agenta a roli instrukcí jako nezávislé proměnné. Tato kapitola na nich staví metodiku._
  - **POZN:** Tady už používáte kapitoly to je dobře, ale hned pod tím opět sekce
- **HL:** _Sekce 3.1 zdůvodňuje volbu případové studie jako výzkumné strategie, představuje zvolený projekt, fáze studie (pilot a ablace) a strukturu iterativního cyklu. Sekce 3.2 definuje sadu 19 metrik ve třech kategoriích (proces, produkt, efektivita). Sekce 3.3 popisuje operační detail: fixní proměnné, záznam běhu a diagnostickou proceduru. Sekce 3.4 shrnuje metriky tabulkou a sekce 3.5 diskutuje hrozby validity._
  - **POZN:** Asi tento odstavec nepotřebuji. Obecně těch odkazovacích odstavců máte zbytečně moc, zkuste je odstranit

## str. 26 — [Fáze a iterativní cyklus]

- **HL:** _Zvolili jsme systém upomínek faktur: systém pro automatické odesílání připomínek k nezapla- ceným fakturám._
  - **POZN:** opět
- **HL:** _Bez pilotu by ablace neměla z čeho vycházet, bez ablace bychom o redundanci složek mohli jen spekulovat._
  - **POZN:** Divná věta, asi zbytečná, když je to cílem práce
- **HL:** _Pilotní fáze postupuje proti exit kritériím ve sloupci Exit kritérium tabulky 3.10._
  - **POZN:** Tahle věta vůbec na první dobrou nedává smysl. Co jsou to exit kritéria musíte popsat
- **HL:** _Tato kritéria představují principiální ideál: striktní 42/42 referenčních testů, nulové lint warnings, nulové porušení složitosti._
  - **POZN:** I zde je potřeba vše vysvětlit
- **HL:** _Sám zvolený projekt nemusí být v tomto smyslu plně dosažitelný v jediném autonomním běhu; pro orientační srovnání měla i referenční implementace napsaná ručně tři kosmetická lint warnings (sekce 4.1.1). Pro praktické řízení iterací proto pracujeme s operačními prahy (Q2 37/42, Q3 70 %, Q4 24/25, Q5 1, Q7 1 porušení), ≥ ≥ ≥ ≤ ≤_
  - **POZN:** Ty Q se řeší až mnohem později v práci, buď je vysvětlete rovnou nebo na ně neodkazujte
- **HL:** _které lépe rozlišují běhy mezi sebou a odpovídají barevnému kódování souhrnné tabulky a vizualizací v kapitole 5._
  - **POZN:** Nechci se teď dívat na kapitolu 5. Vysvětlete to zde
- **HL:** _(kapitola 5, počty “ z 10”) a zda splnil operační prahy (graf 5.2). “X_
  - **POZN:** Chápu, že se zde chcete odkazovat na výsledky, ale to v práci teprve přijde. Představte si, že to píšete průběžně, když tu práci děláte. Také nevíte, kdy a jak budou vypadat výsledky.

## str. 27 — [Sada metrik]

- **HL:** _další iterace by přinášely jen drobné lokální úpravy._
  - **POZN:** Toto je zaručeno/vzniklo jak?
- **HL:** _Tato definice odpovídá proveditelnosti na jednom případu, neimplikuje obecnou platnost prahů pro jiné agenty a projekty._
  - **POZN:** Zkuste i tuto větu trochu přeformulovat
- **HL:** _Z fungující sady instrukcí (výstup pilotní fáze) systematicky odebíráme jednotlivé složky a měříme dopad na chování agenta: potřebuje agent danou část instrukcí, nebo je redundantní?_
  - **POZN:** Vidíte, co říkám s tou větou s dvojtečkou?
- **HL:** _předem;_
  - **POZN:** Mimochodem dlouho jsem nezmiňoval středníky. Kdo tak píše?
- **HL:** _I se dvěma běhy nelze dosáhnout statistické průkaznosti (sekce 3.5); výsledky proto interpretujeme jako indikativní, ne kauzální._
  - **POZN:** Tohle je strašně důležitá věta a bude to obecně důležité přiznávat během obhajoby
- **HL:** _ověřit cíl 2_
  - **POZN:** Splnit? Cíl - ověřují se hypotézy, zodpovídají se otázky a cíle se plní. Raději se podívejte zda to jinde v práci také nemáte blbě
- **HL:** _Iterativní cyklus. V obou fázích je vlastní postup iterativní cyklus, protože jediná iterace nestačí ověřit cíl 2. Pokud má sada metrik fungovat jako diagnostický nástroj, musí naměřená hodnota vést k identifikovatelné úpravě instrukcí a další běh musí ukázat, zda úprava zabrala. Iterace má čtyři kroky: Spuštění (běh agenta), Měření (extrakce metrik), Diagnóza (analýza odchylek) a Úprava (změna instrukcí). Cyklus iteraci opakuje, dokud nejsou splněna exit kritéria (obr. 3.1). Substantivní část iterace popisuje sekce 3.3.3. Spuštění Diagnóza Měření Úprava opakovat dokud exit kritéria Obrázek 3.1: Iterativní cyklus: čtyři kroky jedné iterace a smyčka opakování až do splnění exit kritérií._
  - **POZN:** Je to pěkné, ale dá se to obecně říct jednodušeji

## str. 28 — [Procesní metriky (P1–P8)]

- **HL:** _Teoretické základy jednotlivých metrik (proč jsou validní, jaká je evidence) popisuje sekce 2.1._
  - **POZN:** To už čtenář četl. Jak jsem psal uberte většinu těchto odkazů
- **HL:** _agentova issue_
  - **POZN:** issue vytvořené agentem
- **HL:** _Behavioral trace_
  - **POZN:** Vysvětlit
- **HL:** _na souborech v tests/; nově přidané git diff --diff-filter=M testy se nezapočítávají._
  - **POZN:** Ještě trochu dopopsat, nezačínat pokynem

## str. 29 — [Produktové metriky (Q1–Q8)]

- **HL:** _Popisnost_
  - **POZN:** popisnost nebo popis? Popisnost se totiž jeví i více jako kreativní esejovité popisy a to není asi chtěné ne?
- **HL:** _(bezpečnost, výkonnostní efektivita, kompatibilita, použitelnost, spolehlivost, přenositelnost_
  - **POZN:** proč se nedá měřit bezpečnost např?
- **HL:** _detekují agentovy testy skutečné chyby_
  - **POZN:** zda detekuji..
- **HL:** _typy sedí, nebo ne._
  - **POZN:** bez čárky?
- **HL:** _Shoda s API kontraktem_
  - **POZN:** to je jediné měřítko správné implementace? Asi ne ne
- **HL:** _Vitest_
  - **POZN:** Vitest
- **HL:** _. Testy ověřují chování přes veřejné API (black-box, sekce 2.1.2). Konstrukci referenční test suite popisuje sekce 4.1.1._
  - **POZN:** Sem už odkazy na jiné kapitoly vůbec nepatří
- **HL:** _Poznámka: Q1 je vstupní podmínkou pro Q2: pokud agentův kód neimplementuje správné API, referenční testy nelze ani zkompilovat a výsledek Q2 by byl nesmyslný._
  - **POZN:** Poznámka pod čarou?

## str. 30 — [Metriky efektivity (E1–E3)]

- **HL:** _Stryker_
  - **POZN:** V této kapitole přímo o Strykeru nemluvíte
- **HL:** _zdrojový kód. Výstup: procento zabitých mutantů_
  - **POZN:** Chápu, že se snažíte o překlad, ale tady naopak by byl lepší příklad a doslovné uvedení v AJ
- **HL:** _Cyklomatická složitost_
  - **POZN:** Cyklomatická?
- **HL:** _Práh 10 per funkci pro Q7 vychází z McCabe (sekce 2.1.2). ≤_
  - **POZN:** To víme.
- **HL:** _Poznámka: Práh 10 per funkci pro Q7 vychází z McCabe (sekce 2.1.2). Celkové skóre Q8 ≤ je minimum pěti dimenzí, nikoliv průměr. Volba minima je záměrná: jeden slabý rozměr má stáhnout celkový výsledek dolů, aby slabiny nebyly maskované silnými dimenzemi_
  - **POZN:** Opět poznámka pod čarou? Ovšem zmínka o MIN je důležitá a to by chtělo jinde než jen v poznámce

## str. 31 — [Experimentální design]

- **HL:** _exit kritérium_
  - **POZN:** stále sem se nikde nedočetl o Exit kritériu
- **HL:** _Se dvěma běhy per variaci jsou tyto hodnoty deskriptivní, ne inferenční._
  - **POZN:** Toto by vyžadovalo opět více rozepsat
- **HL:** _Agentní běhy provádí model MiniMax-M2.5;_
  - **POZN:** Tady se poprvé setkáme s tím jaký model je použitý. Nevím jestli to je dobře. Myslím, že by se to mělo objevovat téměř od začátku práce
- **HL:** _Důvod: model_
  - **POZN:** Takto nepište
- **HL:** _Hodnocení probíhá na škále 1–3 per dimenze: 1 = nevyhovující, 2 = přijatelné, 3 = dobré. Jemnější škály (1–5, 1–10) produkují při malém počtu hodnocených artefaktů nižší shodu mezi hodnotiteli (Zheng et al., 2023); třístupňová škála je pro tento rozsah spolehlivější._
  - **POZN:** Opět AI formáty
- **HL:** _Rubrika._
  - **POZN:** Je Rubrika správné slovo?
- **HL:** _Interpretace výsledků. LLM-as-judge zde neslouží jako plně objektivní měření, ale jako strukturované posouzení vlastností, které nelze spolehlivě vyhodnotit deterministickým skrip- tem. Výsledky těchto metrik proto interpretujeme jako podpůrné kvalitativní indikátory a ne jako hlavní důkazní osu případové studie._
  - **POZN:** Opět toto by mělo být uvedeno pořádně i na začátku celého řešení jako jedna z hlavních point.

## str. 32 — [Fixní proměnné]

- **HL:** _Tato sekce navazuje operačním detailem: jaké proměnné držíme fixní mezi běhy (sekce 3.3.1), jak jeden běh zaznamenáváme a vyhodnocujeme (sekce 3.3.2) a jakou procedurou diagnostikujeme a upravujeme instrukce (sekce 3.3.3)._
  - **POZN:** AI formát

## str. 33 — [Diagnostika a úprava instrukcí]

- **HL:** _exportuje session new-run.ts do ( transcript.json_
  - **POZN:** Možná by bylo někde dobré také uvést obecnou strukturu projektu před tím než se začne uvádět více souborů než build.md a agents.md

### str. 34

- **HL:** _Kdyby tento řádek chyběl, udělal by agent neočividnou chybu?_
  - **POZN:** Proč je to kurzívou?
- **HL:** _Hranice mezi typy příčin jsou v praxi neostré a klasifikace vyžaduje úsudek; rámce slouží jako heuristické vodítko, ne algoritmus. Roli AI asistence při této analýze popisuje sekce 3.5._
  - **POZN:** Tohle je úplně mimo, tento popis máte přeci už nahoře. Všechny tyto informace by měly být jasně řečeny na začátku metodiky.
- **HL:** _Přestrukturování instrukcí má přednost před jejich rozšiřováním: redundantní obsah zvyšuje inference cost bez přínosu k úspěšnosti (Gloaguen et al., 2026) a fokusované instrukce překonávají vyčerpávající dokumentaci (X. Li et al., 2026)._
  - **POZN:** Tady už jsou zdroje zbytečné ne? Pokud to je teoretický základ, tak to mělo být popsáno v teorii. Zde už jen ukážete co jste udělal a na to není potřeba se odkazovat na cizí práci

## str. 35 — [Omezení a validita]

- **HL:** _KAPITOLA 3. METODIKA optimization (APO) (Schnabel & Neville, 2024), kde smyčka score synthesize formálně → odpovídá našemu cyklu měření diagnóza úprava; reprezentanty jsou například PromptWi- → → zard (Agarwal et al., 2024) a Prompt Alchemy (Ye et al., 2025). Volíme ruční postup s nástrojem Claude Code jako analytickým asistentem (popis využití v příloze A): vícerozměrné hodnocení P/Q/E nelze sjednotit do jediné loss funkce, měřítko studie (desítky běhů) neodpovídá řádu APO (tisíce evaluací) a cílem je vysvětlit, proč instrukce selhává a jak se opravuje, ne jen najít kombinaci s nejvyšším score._
  - **POZN:** Tady mám pocit, že trochu pletete výsledek s metodikou. Resp. předpokládáte určitý výsledek. Zkuste si texty v této kapitole projít a popsat je skutečně bez informace o výsledku. Tedy ne že přepokládáte něco, ale řeknete varianty, které můžete udělat a podle XY se rozhodnete.
- **HL:** _Tabulka 3.10:_
  - **POZN:** Až teď to vidím, je zvykem, že všechny tabulky mají jednotné číáslování a ne s odkazem na kapitolu
- **HL:** _operační prahy_
  - **POZN:** Zpětně se také dívám a nejsem si jistý jestli operační prahy je zvoleno jako správný název pro to. Z čeho vycházíte?
- **HL:** _3.1.3. Způsob sběru odpovídá rozlišení deterministické metriky, kvalitativní metriky a záznamové metriky zavedenému v kapitole 2._
  - **POZN:** Stále odkazuje skrz naskrz práci

### str. 36

- **HL:** _hrozby validity,_
  - **POZN:** Validita nikomu nehrozí, to používáte špatně
- **HL:** _známe_
  - **POZN:** nepoužívat první osobu
- **HL:** _Jak se tyto hrozby skutečně projevily v naměřených datech, diskutuje sekce 5.3._
  - **POZN:** Další odkazy
- **HL:** _(měříme to, co chceme měřit?)._
  - **POZN:** I když chápu proč to tady je, tak to patří dovnitř textu, který je zatím.
- **HL:** _(Papadakis et al., 2019), cyklomatická složitost (McCabe, 1976), taxonomie procesních a produktových metrik (Fenton & Bieman, 2014)_
  - **POZN:** Myslím, že ty zdroje jste už uváděl ne?
- **HL:** _Jednotlivé metriky vychází z existující teorie: mutation testing (Papadakis et al., 2019), cyklomatická složitost (McCabe, 1976), taxonomie procesních a produktových metrik (Fenton & Bieman, 2014). Konkrétní kombinace metrik do sady a volba exit kritérií jsou autorské a představují návrh, ne ověřený standard. Pět metrik (P6, P7, P8, Q4, Q8) obsahuje subjektivní složku (LLM-as-judge). Tyto metriky proto slouží jako podpůrné kvalitativní indikátory, zatímco hlavní opora vyhodnocení stojí na deterministických metrikách a auditovatelných artefaktech._
  - **POZN:** Tady jen popisujete ty metriky? To je zbytečné
- **HL:** _U metriky Q4 byly historicky uložené judge běhy exportovány ve 24bodovém formátu; chybějící bod AC25 (custom holiday calendar) byl při finalizaci práce dopočítán manuálně._
  - **POZN:** Tohle by stálo za výrazně větší komentář než je to takto říci
- **HL:** _Konstruktová validita (měříme to, co chceme měřit?). Jednotlivé metriky vychází z existující teorie: mutation testing (Papadakis et al., 2019), cyklomatická složitost (McCabe, 1976), taxonomie procesních a produktových metrik (Fenton & Bieman, 2014). Konkrétní kombinace metrik do sady a volba exit kritérií jsou autorské a představují návrh, ne ověřený standard. Pět metrik (P6, P7, P8, Q4, Q8) obsahuje subjektivní složku (LLM-as-judge). Tyto metriky proto slouží jako podpůrné kvalitativní indikátory, zatímco hlavní opora vyhodnocení stojí na deterministických metrikách a auditovatelných artefaktech. Spolehlivost LLM-as-judge nebyla validována proti lidskému hodnocení (např. Cohenovým κ) z důvodu časových omezení. U metriky Q4 byly historicky uložené judge běhy exportovány ve 24bodovém formátu; chybějící bod AC25 (custom holiday calendar) byl při finalizaci práce dopočítán manuálně. Správnost skriptu pro metriky P1–P5 byla ověřena manuálním srovnáním výstupů analyze-run.ts s raw daty z git logu a GitHub API pro běhy r4 a r5. Žádná diskrepance nebyla identifikována._
  - **POZN:** Hlavně tady zase mluvíte o výsledcích, které ještě nejsou známé...
- **HL:** _(jsou závěry podložené daty?)._
  - **POZN:** Jak jsem psal výše, toto sem nepatří
- **HL:** _Externí validita (lze zobecnit?). Případová studie na jednom projektu, jednom modelu a jednom agentním nástroji neumožňuje statistickou generalizaci. Yin (R. K. Yin, 2018) pro tento typ výzkumu rozlišuje analytickou generalizaci: z jednoho případu lze ukázat principy, ne statistické zákonitosti. Systém upomínek má deterministickou logiku a výsledky nemusí platit pro projekty s uživatelským rozhraním, strojovým učením nebo nedeterministickými výstupy. Přenositelné jsou metriky a postup (kdokoliv je může použít na svém projektu), konkrétní naměřené hodnoty a instrukce platí pro tuto studii._
  - **POZN:** Lze toto ještě také popsat svými slovy -> tedy něco jako. Na základě toho a toho můžeme říct, že nelze/lze a do jaké míry výzkum zobecnit?

## str. 37 — [Systém upomínek faktur]

- **HL:** _Specifikace systému upomínek faktur tvoří fixní zadání, které agent dostává v Issue #1._
  - **POZN:** Lze se na něj někde podívat?
- **HL:** _API Contract (co musí implementace exportovat). API kontrakt je současně jediným technickým omezením implementace a vstupem pro metriku Q1 (API contract match)._
  - **POZN:** Vlastně si myslím, že toto mělo být popsáno dříve.

## str. 39 — [Konstrukce baseline instrukcí]

- **HL:** _pauzu, ale selhává při opakovaném pause/resume, protože druhá pauza ztratí historii první. Za druhé, všechny timeouty se počítají v pracovních dnech, takže od pátku není čtrnáct +14 bd kalendářních dnů a hranice mezi víkendem a pondělím jsou off-by-one zóna. Obě pravidla jsou plně určená API kontraktem; jejich zachycení ale vyžaduje doslovné čtení typů a doménového slovníku, ne odvozování z diagramu automatu. Acceptance criteria. Specifikace obsahuje 25 acceptance criteria ve formátu Given/When/Then. Pokrývají sedm okruhů: časové přechody eskalace, platby, terminální stavy, storno, pauza/obnovení, manuální postup a výpočet pracovních dní. Ukázka jednoho kritéria z okruhu pauza/obnovení: Given an invoice is in PAUSED state When a event occurs dunning_resumed Then the state transitions back to the state it was in before pausing And the timeout resumes from where it left of Formát Given/When/Then usnadňuje převod požadavků do referenčních testů (Q2 (referenční test pass rate)) i mapování acceptance criteria na agentovy vlastní testy (Q4 (AC coverage)). Doménový slovník (9 pojmů: dunning, grace period, business days, action descriptor aj.) sjednocuje terminologii mezi specifikací a implementací. Out of scope. Specifikace explicitně vylučuje šest oblastí: opakování plateb, úroky a poplatky z prodlení, částečné platby, odesílání e-mailů, plánování (cron) a persistenci dat. Sekce out of scope omezuje riziko, že agent rozšíří řešení nad rámec sledovaného zadání, a drží úlohu na úrovni čisté business logiky._
  - **POZN:** Vlastně si myslím, že toto je spíše metodika ne?

### str. 40

- **HL:** _Toto mapování zakládá metodologickou otázku: pokud sekce instrukcí sledují měřené dimenze, hrozí, že metriky budou měřit shodu instrukce s vlastním zápisem, ne kvalitu výstupu. Procesní metriky P1–P5 skutečně měří dodržení postupu, který instrukce předepisuje, a jejich diagnostická hodnota leží v nedodržení. Produktové metriky Q1–Q3, Q6 a Q7 ale vychází z nezávislé literatury a jejich splnění vyžaduje funkční kód, ne převzetí instrukce. U judge-based metrik (Q4, Q8) je hranice neostrá; jejich citlivost vůči samotné instrukci testuje ablace B (sekce 4.3.3)._
  - **POZN:** Tady už žádné otázky nezakládejte.
- **HL:** _Konstrukce proběhla ve dvou krocích: návrh struktury podle pořadí komponent popsaných Mao et al. (Mao et al., 2025) a mapování tří dimenzí chování (sekce 3.2) na konkrétní instrukce. Výsledné sekce (Role, Goal, Specification, Environment, Process, Package Quality, Constraints) jsou adaptací tohoto rámce na doménu případové studie._
  - **POZN:** Tohle by si zasloužilo konkrétnost a vizuál zřejmě
- **HL:** _Procesní sekce obsahuje stručné instrukce pro spec-first TDD (Mathews & Nagappan, 2024), dekompozici do sub-issues, branch-per-issue a conventional commits. Sekce Package Quality vymezuje očekávání na modularitu, striktní typování, dokumentaci a čisté veřejné API. Tyto požadavky přímo míří na metriky kvality kódu (Q5 (lint warnings)–Q8 (design quality)). Sekce byla přidána proto, že udržovatelnost a design nejsou ve specifikaci projektu explicitně vynutitelné, ale v naší sadě metrik je chceme sledovat. Nejde tedy o tvrzení, že “architektura + konvence” jsou obecně nejúčinnější obsah instrukcí, ale o operacionalizaci požadavků na kvalitu do podoby, kterou lze v této případové studii měřit. Sekce Constraints pak obsahuje explicitní zákazy typu nekombinovat issues, nemodifikovat existující testy a nepřepisovat git historii. Výsledný dokument má 53 řádků a ∼350 slov. ∼3_
  - **POZN:** Tak to by asi šlo  ukázat celé

## str. 41 — [Pilotní fáze]

- **HL:** _Obrázek 4.2: Baseline (pilot-r1): kompletní znění instrukcí použitých jako výchozí AGENTS.md bod pilotních iterací._
  - **POZN:** Nedělal bych to jako obrázek, ale jako text = kód
- **HL:** _Specifikace, referenční implementace a baseline instrukce tvoří výchozí bod experimentu. Následující sekce popisuje průběh pilotních iterací cyklem Spuštění/Měření/Diagnóza/Úprava (sekce 3.1.3)._
  - **POZN:** Zbytečný text a ještě zbytečnější odkaz

## str. 42 — [Pilot-r1: baseline]

- **HL:** _Každá iterace sleduje cyklus Spuštění/Měření/Diagnóza/Úprava (sekce 3.1.3)_
  - **POZN:** To je prakticky stejná věta jako nahoře
- **HL:** _Každá iterace sleduje cyklus Spuštění/Měření/Diagnóza/Úprava (sekce 3.1.3) a popisujeme ji ve stejné struktuře: tabulkou metrik, diagnostikou (pozorování chování agenta, interpretace selhání a posun do další iterace) a vizuálním diffem upravené verze md. U prvního AGENTS.m běhu uvádíme kompletní tabulku metrik, u dalších jen řádky, kde došlo ke změně. Diagnóza každé iterace stojí na jednom běhu, takže opakující se selhání napříč iteracemi mají vyšší výpovědní hodnotu než jednorázová; tuto opatrnost atributu doplňuje až ablační fáze dvojicí běhů per variace (sekce 3.5). Iterativní cyklus zároveň nepředpokládá monotónní zlepšování. Pokud iterace vede k regresi, další iterace vychází z předchozí úspěšné verze instrukcí, ne z regresní (Peffers et al., 2008). Souhrnný přehled všech běhů obsahuje sekce 4.4._
  - **POZN:** Tady opět AI spíše popisuje obecně co by se mělo dělat ale ne to jak se to udělalo
- **HL:** _Ze_
  - **POZN:** z

## str. 57 — [Cíl 1: Sada metrik]

- **HL:** _(sekce 5.1), poté v kontextu existují- cího výzkumu (sekce 5.2) a nakonec diskutuje, jak se metodologická omezení identifikovaná v sekci 3.5 projevila v praxi (sekce 5.3)._
  - **POZN:** Už žádné odkazy prosím
- **HL:** _Na základě analýzy existujících standardů kvality softwaru a současných benchmarků pro AI agenty navrhnout sadu metrik pokrývající proces, kvalitu kódu a efektivitu (dimenze, které stávající benchmarky neměří). Sada 19 metrik byla navržena (kapitola 3) a použita na devíti bězích (kapitola 4). Její přínos nespočívá v tom, že „ukázala nějaká čísla“, ale v tom, že rozšířila hodnocení agenta za hranici pass/fail výsledku. Právě to bylo potřeba pro problém vymezený v kapitole 1: odlišit řešení, které jen projde testy, od řešení, které je zároveň vytvořeno obhajitelným postupem a zanechává použitelný kód._
  - **POZN:** Když jsem se teď vrátil ke kapitole 3, myslím, že máte zdroje na metriky jen Q - bylo by zřejmě dobré doplnit zdroje i na metriky další

## str. 62 — [Cíl 2: Iterativní postup]

- **HL:** _může vést k měřitelnému zlepšení, nikoli však že stejný efekt nastane obecně. Postup vedl k měřitelnému zlepšení, ale ne monotónnímu. Baseline (r1) splnila čtyři z deseti tvrdých deterministických procesních a produktových kritérií. Po dvou cyklech úprav (r3) agent splnil sedm z deseti. Regrese r4 (pět z deseti) ukázala, že zlepšení není trvalé: po neúspěšné iteraci bylo nutné vrátit se k předchozí verzi instrukcí (r5 vycházel z r3, ne z r4). Metriky poskytly vodítka kam zasáhnout: tabulka metrik ukázala která kritéria agent nesplnil a behaviorální popis z popsal co agent konkrétně udělal. K pochopení proč agent FINDINGS.md zvolil daný postup však bylo většinou nutné nahlédnout i do transcriptu agenta. Diagnostika se tak opírala o kombinaci kvantitativních dat a kvalitativní analýzy chování. Analýza průběhu iterací odhalila opakující se vzorec na spektru operacionalizace instrukcí. Obrázek 5.4 ukazuje, jak se tři nezávislá selhání vyvíjela přes stejné fáze: pravidlo (agent ignoruje) příkaz (agent obchází) verifikační krok (agent dodržuje). → →_
  - **POZN:** Opět jak jsem zmiňoval už na začátku - nejsem si jistý, že "demonstrace" proběhla - protože to se špatně měří. Zkusme tento cíl trochu upravit. nebo vynechat
