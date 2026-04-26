# Bakalářská práce — text k recenzi
Generováno: 2026-04-22
Soubory hlavního textu: uvod.tex, kap01.tex, kap02.tex, kap03.tex, kap04.tex, kap05.tex, zaver.tex
Bibliografie: literatura.bib
Poznámka: Hlavní text se načítá podle include mapy v prace.tex. RAW bloky (poznámky, audit trail) byly odstraněny. Posíláme DRAFT + finální text a k tomu citovanou bibliografii.

## Statistika (řádky v orig. zdrojích)
- uvod.tex: finální=32, draft=0, raw=10 (odstraněno)
- kap01.tex: finální=70, draft=0, raw=135 (odstraněno)
- kap02.tex: finální=447, draft=0, raw=632 (odstraněno)
- kap03.tex: finální=537, draft=0, raw=208 (odstraněno)
- kap04.tex: finální=785, draft=0, raw=112 (odstraněno)
- kap05.tex: finální=658, draft=0, raw=256 (odstraněno)
- zaver.tex: finální=45, draft=0, raw=11 (odstraněno)

## Bibliografie
- citované klíče: 56
- nalezené záznamy: 56
- chybějící klíče: žádné

---



---

# Úvod

AI coding agenti dokáží autonomně implementovat funkcionalitu, psát
testy, spravovat verzovací historii a komunikovat prostřednictvím
issues a pull requestů. S rostoucí autonomií těchto nástrojů roste
i potřeba systematicky hodnotit kvalitu jejich práce. Současné benchmarky hodnotí izolované aspekty práce agenta,
především funkční korektnost. Holistický pohled, který by
zachytil proces, kvalitu kódu a efektivitu společně, však chybí.
Přitom i funkčně správné řešení může být v praxi odmítnuto
kvůli nedostatkům v procesu nebo udržovatelnosti. Praktik, který vidí
jen pass/fail výsledek, tak může přecenit řešení, které by ve skutečném
vývoji neprošlo code review nebo by se obtížně rozvíjelo.

Kvalitu práce agenta výrazně ovlivňují instrukce, které dostane.
V praxi se etablují instrukční soubory jako `AGENTS.md`
nebo `CLAUDE.md`, které definují pracovní postup, konvence
a omezení projektu. Tyto soubory se stávají standardním rozhraním
mezi člověkem a agentem nejen v softwarovém vývoji, ale
i v univerzálních agentních nástrojích. Jak instrukce systematicky
navrhovat a jak měřit, zda agent dodržuje požadované praktiky,
zůstává otevřenou otázkou.

Tato práce navrhuje sadu metrik pokrývající proces, kvalitu kódu
a efektivitu práce agenta. Na případové studii necháváme agenta
opakovaně implementovat systém upomínek faktur ze specifikace,
výsledky měříme navrženými metrikami a na jejich základě
upravujeme instrukce mezi iteracemi. Ablacemi dále zkoumáme,
které složky instrukcí přispívají k měřenému chování
a které jsou redundantní.

Práce nejprve vymezuje problém a cíle, poté shrnuje teoretická
východiska z oblasti softwarového inženýrství, AI agentů
a měření kvality. Na jejich základě navrhuje metodiku, kterou
ověřuje na případové studii. Kapitola Vyhodnocení a diskuse interpretuje
výsledky ve vztahu k cílům a porovnává je s existujícím výzkumem.

---

# Vymezení problému a cílů práce

## Motivace

AI agenti se používají k vývoji softwaru, ale výsledky ukazují, že to
není tak jednoduché, jak se čekalo. Randomizovaná studie
METR [metr2025] na 246 úlohách ukázala, že s AI nástroji byli
vývojáři o 19 % pomalejší.

Agent často produkuje funkční výstup, ale nedodržuje vývojové praktiky.
Ehsani et al. [ehsani2026failedprs] analyzovali 33 tisíc agentních
pull requestů a zjistili, že procesní nedostatky jsou jedním z hlavních
důvodů odmítnutí. Klíčovým nástrojem jak chování agenta řídit jsou
instrukce: Shin et al. [shin2025prompt] ukazují, že iterativní
zpřesňování instrukcí výrazně zlepšuje výsledky na úlohách s kódem.

Současné benchmarky jako SWE-bench [swebench2024] hodnotí izolované
aspekty práce agenta, především funkční korektnost. Studie
METR [metr2026]\footnote{Jiná studie téže organizace než [metr2025];
zde analýza SWE-bench pull requestů, ne randomizovaný experiment.} ukázala,
že polovina řešení která projdou testy by nebyla přijata při code review.
Li et al. [li2026beyondbugfixes]
analyzovali 1 210 sloučených pull requestů a zjistili kvalitativní
nedostatky i v přijatém kódu. Holistický pohled, který by zachytil proces,
kvalitu kódu a efektivitu společně, však chybí.

Jak instrukce systematicky navrhovat a jak měřit, zda agent dodržuje
požadované praktiky, je méně prozkoumané. Lulla
et al. [lulla2026] zjistili, že přítomnost instrukčního souboru
je spojena se zkrácením doby běhu o 28,6 %, ale Gloaguen
et al. [gloaguen2025agentsmd] upozorňují, že generické instrukce
přinášejí marginální zlepšení při vyšších nákladech. Které složky
instrukcí k měřenému chování skutečně přispívají a které jen zabírají
kontextové okno, dosud nebylo izolováno.

Chování agenta lze přizpůsobit trénováním modelu nebo instrukcemi
v kontextovém okně. S rostoucí velikostí kontextových oken
a zkracujícími se cykly mezi generacemi modelů se instrukce stávají
praktičtější alternativou: jsou dostupné komukoliv, iterativně
upravitelné a přenositelné mezi modely. Fine-tuning naproti tomu
vyžaduje trénovací data, výpočetní kapacitu a investici vázanou
na konkrétní verzi modelu. Shin et al. [shin2025prompt]
ukazují, že iterativní zpřesňování instrukcí dosahuje srovnatelných
výsledků s fine-tuned modely na úlohách s kódem.

## Cíle práce

    - Na základě analýzy existujících standardů kvality softwaru
          a současných benchmarků pro AI agenty navrhnout sadu metrik
          pokrývající proces, kvalitu kódu a efektivitu, a tím zachytit
          dimenze, které stávající benchmarky neměří.
    - Na případové studii demonstrovat iterativní postup návrhu
          instrukcí řízený těmito metrikami a vyhodnotit, zda a jak
          vede k měřitelným změnám v dodržování vývojových praktik.
    - Z instrukcí vytvořených v cíli 2 prozkoumat ablacemi, které
          složky přispívají k měřenému chování agenta a které jsou
          redundantní.

## Rozsah práce

Cíle ověřujeme na případové studii systému upomínek faktur.
Existující studie hodnotí agenty na velkém počtu krátkých
úloh; naše práce volí opačný přístup: jeden projekt do hloubky,
s opakovanými běhy a podrobnou analýzou každého z nich.

Práce se nezabývá trénováním modelů, protože cílem je zkoumat
vliv instrukcí, ne schopnosti konkrétního modelu. Nesrovnává různé
modely ani programovací jazyky, protože experimentální design se snaží
držet ostatní podmínky co nejstabilnější a měnit především instrukce.
Neporovnává agenta s lidským vývojářem, protože
měří zlepšení mezi iteracemi, ne absolutní výkon. Navržená sada
metrik a iterativní postup jsou koncipovány jako přenositelný rámec;
konkrétní instrukce a naměřené hodnoty platí pro tuto případovou studii
a slouží jako feasibility demonstrace, nikoli jako obecně platný
výsledek pro všechny modely a projekty.
Zdůvodnění volby projektu a podrobnosti experimentálního designu
popisuje kapitola [ref:kap:metodika].

---

# Teoretická východiska

Tato kapitola poskytuje teoretický základ pro metrický rámec
a experimentální postup práce. První sekce se věnuje kvalitě
software z pohledu softwarového inženýrství: proč je její
zajištění obtížné, jaké dimenze má, jakými praktikami se
zajišťuje a jak se měří. Druhá sekce zavádí AI coding agenty:
co jsou, jak se řídí instrukcemi a jak se jejich výstupy hodnotí.

## Kvalita software a její měření

Softwarové inženýrství je disciplína, která přistupuje k vývoji
software systematicky: od specifikace přes implementaci po
údržbu [swebok2024]. Na rozdíl od programování, které se
soustředí na algoritmy a implementaci, softwarové inženýrství řeší
mimo jiné i to, jak zajistit kvalitu výsledku [sommerville2016].
To zahrnuje řízení požadavků, návrh architektury, správu konfigurací,
zajištění kvality i řízení projektu. V tomto kontextu se kvalita
neposuzuje jen podle vlastností výsledného software produktu, ale
i podle procesů a praktik, jimiž tento produkt vzniká, a podle
způsobů jejich měření. Tato sekce proto nejprve vymezuje produktovou
kvalitu software, poté shrnuje praktiky, kterými se v praxi
zajišťuje, a nakonec popisuje přístupy k jejímu měření.

### Kvalita software

SWEBOK shrnuje kvalitu software jako míru, do jaké software splňuje
stanovené požadavky a odpovídá potřebám stakeholderů, pro které byl
vytvořen. V kontextu softwarového inženýrství však tyto potřeby
nejsou jednotné: různé charakteristiky kvality jsou důležité pro
různé stakeholdery [swebok2024]. Pro
koncové uživatele a zadavatele je podstatné především, zda software
poskytuje požadovanou funkcionalitu spolehlivě a bezpečně; pro
vývojáře a maintainers je klíčové, zda je systém srozumitelný,
modifikovatelný a dlouhodobě udržitelný [sommerville2016].
Kvalitu proto nelze posuzovat podle jediného hlediska: software může
splňovat funkční požadavky, a přesto být obtížně čitelný, náchylný
k chybám při úpravách nebo špatně strukturovaný. Právě proto vznikly
modely kvality, které rozkládají kvalitu software do více dílčích
charakteristik a umožňují je posuzovat odděleně.

Mezi první vlivné modely, které kvalitu software rozložily na
konkrétní charakteristiky, patří McCallův model z roku
1977 [mccall1977]. Ten organizuje kvalitu do tří perspektiv:
provoz produktu (*Product Operation*), který zahrnuje
vlastnosti důležité při používání software; revize produktu
(*Product Revision*), zaměřenou na vlastnosti důležité při
jeho úpravách; a přechod produktu mezi prostředími
(*Product Transition*), který pokrývá přenositelnost
a znovupoužitelnost. McCallův model je důležitý tím, že chápe
kvalitu software jako soubor dílčích charakteristik, které lze
posuzovat odděleně [mccall1977]. Na tento princip navazují
i současné standardizované modely kvality.

Standard ISO/IEC 25010 definuje model produktové kvality, který
rozkládá kvalitu software do charakteristik a podcharakteristik, jako
jsou funkční vhodnost, výkonnostní efektivita, kompatibilita,
bezpečnost nebo udržovatelnost [iso25010]. Tento model
neposkytuje konkrétní metriky, ale rámec, podle jakých hledisek lze
software hodnotit. Pro tuto práci je důležitý tím, že odděluje
otázku, zda software plní požadovanou funkci, od otázky, zda je jeho
kód srozumitelný, modifikovatelný a vhodný pro další rozvoj.
Z tohoto rámce proto dále vybíráme dvě charakteristiky, které přímo
odpovídají sledovaným aspektům výstupu AI agenta: funkční vhodnost
a udržovatelnost.

*Funkční vhodnost* vyjadřuje, do jaké míry software poskytuje
funkce, které naplňují stanovené potřeby při použití za
specifikovaných podmínek. *Udržovatelnost* vyjadřuje, s jakou
účinností a efektivitou lze software upravovat za účelem opravy,
zlepšení nebo přizpůsobení změnám v prostředí či požadavcích [iso25010].
V kontextu této práce to znamená, že první charakteristika se vztahuje
k tomu, zda agent vytváří správné řešení, zatímco druhá k tomu, zda
vytváří kód, který lze dále bezpečně chápat, upravovat a rozvíjet.
Rozdíl mezi nimi spočívá i v tom, jak se v praxi projevují:
funkční vhodnost se ukazuje především v chování software při běhu,
zatímco udržovatelnost ve vlastnostech kódu při jeho dalším rozvoji.
Tento rozdíl je důležitý pro následující sekce, protože naznačuje, že
správnost řešení a jeho dlouhodobou udržovatelnost nelze posuzovat
stejným typem evidence.

Modely kvality tedy vymezují, jaké vlastnosti od software očekáváme.
Samy však ještě nevysvětlují, proč je dosažení těchto vlastností
v praxi obtížné; tento problém otevírá složitost software.
Brooks [brooks1987] rozlišuje *esenciální složitost*,
která je vlastní řešenému problému a nelze ji odstranit lepšími
nástroji, a *akcidentální složitost*, kterou do systému
vnáší zvolené technologie a implementační rozhodnutí
(konfigurace frameworku, řešení verzí závislostí, nastavení build
systému). Podobnou dynamiku dlouhodobého růstu složitosti popisuje
i Lehman [lehman1980]: používaný software musí být průběžně
přizpůsobován měnícím se požadavkům a prostředí a bez aktivní
redukce jeho složitost v čase roste. I software, který v daném
okamžiku splňuje sledované požadavky na kvalitu, bude bez průběžné
údržby postupně degradovat.

Modely kvality definují, *co* měřit; složitost vysvětluje,
proč je dosažení kvality obtížné. Následující sekce popisuje,
jakými praktikami se jednotlivé dimenze kvality v softwarovém
inženýrství zajišťují.

### Praktiky zajišťování kvality

Předchozí sekce vymezila, jaké vlastnosti charakterizují kvalitní
software. Samotné vymezení těchto charakteristik však ještě neříká,
jak jich při vývoji dosáhnout. Praktiky zajišťování kvality přitom
v softwarovém inženýrství tvoří širší spektrum činností od práce
s požadavky a specifikací přes organizaci změn a jejich ověřování až
po průběžnou péči o strukturu kódu. Tato sekce se z tohoto širšího
rámce soustředí na tři skupiny praktik, které se přímo promítají do
hodnocení agentních běhů a výsledného kódu: organizaci práce se
změnami, testování a postupy podporující udržovatelnost kódu.

**Procesní praktiky.**
Procesní praktiky určují, jak změny vznikají, kontrolují se
a začleňují do projektu. Jejich význam spočívá v tom, že zvyšují
sledovatelnost, přezkoumatelnost a spolehlivost vývoje.

Základem těchto praktik je správa verzí, protože umožňuje sledovat
historii změn a bezpečně se vracet k předchozím stavům kódu. Pro
kvalitu vývoje však není rozhodující jen samotný nástroj, ale způsob,
jakým se používá. Práce v oddělených větvích
(*branches*) izoluje rozpracované změny od stabilního kódu;
Shihab et al. [shihab2012] empiricky ukázali, že nesoulad mezi
strukturou větví a organizační strukturou je spojen s vyšší mírou
defektů po vydání. Granulární commity, kde každá změna odpovídá
jednomu logickému kroku, usnadňují zpětnou analýzu chyb
a code review [humble2010]. Průběžná integrace (\textit{continuous
integration}) tyto praktiky doplňuje automatickým ověřováním, že
sloučení změn nenarušilo funkčnost [humble2010].

Další procesní praktikou je code review, tedy kontrola kódu jiným
vývojářem před jeho začleněním. Historicky probíhala formou
strukturovaných inspekcí, dnes převládá méně
formální podoba integrovaná do pull requestů, označovaná jako
*modern code review*. Jde o průběžné posuzování menších změn
jako běžné součásti integrace, nikoli o samostatnou formální
inspekci celé implementace. Bacchelli
a Bird [bacchelli2013] empiricky zjistili, že moderní code
review přispívá nejen k odhalování defektů, ale především ke
zlepšování kvality kódu, sdílení znalostí a nalézání alternativních
řešení. McIntosh et al. [mcintosh2016] dále prokázali, že
kód, který neprošel review, vykazuje měřitelně vyšší míru defektů
po vydání.

Vedle správy verzí a code review je pro kvalitu vývoje důležitá také
*traceability*, tedy schopnost dohledat vazby mezi požadavkem
a artefakty, které s ním souvisejí [gotel1994]. Nejde jen
o uchování historie kódu, ale o propojení zadání změny, její
implementace, review a ověření. V praxi to znamená vazby mezi issue,
commity a větvemi, pull requestem a testy. Díky nim lze zpětně
pochopit, proč byla změna provedena, co přesně měnila a jak bylo
ověřeno, že odpovídá zadání.

**Testování.**
Testování ověřuje, zda software skutečně plní požadavky, které na něj
klademe. Jeho význam spočívá v tom, že poskytuje systematickou
kontrolu chování výsledného řešení a zachycuje chyby dříve, než se
projeví v provozu.

Testování se provádí na různých úrovních:
*unit testy* ověřují jednotlivé funkce nebo moduly izolovaně,
*integrační testy* ověřují spolupráci komponent
a *akceptační testy* ověřují splnění požadavků z pohledu
zadavatele. Každá úroveň zachycuje jiný typ chyb.

Z hlediska pořadí lze testování organizovat různými způsoby.
Nejběžnější je *test-after* přístup, kdy vývojář napíše
implementaci a následně k ní vytvoří testy. Přístup
*test-driven development* (TDD) pořadí obrací: nejprve se
napíše test definující očekávané chování, teprve pak implementace,
která test splní [beck2000]. Tím se test stává specifikací
požadavku, nikoli zpětnou kontrolou již napsaného kódu. Meta-analýza
27 studií Rafiqua a Mišiće [rafique2013] ukazuje, že TDD má
pozitivní efekt na kvalitu kódu měřenou hustotou defektů. Efekt je
výraznější v průmyslových projektech než v akademických experimentech,
což naznačuje, že přínos roste se složitostí řešeného problému.

**Praktiky podporující udržovatelnost.**
Praktiky podporující udržovatelnost mají zajistit, aby kód zůstal
srozumitelný a bezpečně modifikovatelný i při dalších změnách.
Jejich význam spočívá v tom, že omezují růst složitosti a snižují
riziko, že každá další úprava bude dražší a náchylnější k chybám.

V praxi se udržovatelnost opírá o vlastnosti jako čitelnost,
srozumitelné pojmenování, oddělení zodpovědností, omezení složitosti
nebo dodržování konvencí jazyka [mcconnell2004]. Proto ji
podporují průběžný refaktoring, důsledná práce s rozhraními
a odpovědnostmi modulů i automatizované kontroly kódu. SWEBOK
zároveň zdůrazňuje, že její úroveň neposilují jen vlastnosti
samotného kódu, ale i systematické vývojové procesy, techniky
a nástroje [swebok2024]. Některé z těchto vlastností lze
ověřovat deterministicky, jiné však vyžadují i expertní posouzení;
právě k těmto způsobům hodnocení se vrací následující sekce.

### Měření kvality software

Předchozí sekce identifikovala praktiky, kterými se kvalita software
zajišťuje. Samotná existence praktik však neznamená, že se dodržují,
ani že jejich výstupy jsou kvalitní. Kvalitu je proto třeba měřit.

Fenton a Bieman [fenton2014] rozlišují tři kategorie měřitelných
entit v softwarovém inženýrství: *proces* (aktivity během
vývoje), *produkt* (výstupy vývoje, zejména kód)
a *zdroje* (lidé, nástroje, výpočetní kapacita). Toto členění
je důležité, protože kvalita produktu a kvalita procesu spolu souvisí,
ale nejsou totéž: funkčně správný kód může vzniknout chaotickým
procesem a naopak dodržení procesu nezaručuje funkční výsledek. Měření
pouze jedné kategorie proto poskytuje neúplný obraz. Nejde přitom
o alternativu k modelu ISO/IEC 25010 z předchozí sekce, ale o jiný
řez problémem: ISO/IEC 25010 vymezuje, *které* charakteristiky
kvality produktu sledovat, zatímco Fenton a Bieman rozlišují,
*na jaké entitě* kvalitu měříme.

**Produktové měření.**
Na úrovni produktu v návaznosti na ISO/IEC 25010 [iso25010]
sledujeme především funkční vhodnost a udržovatelnost. Funkční
vhodnost se ověřuje testováním, tedy porovnáním chování implementace
s očekávaným chováním odvozeným ze specifikace. Ani u testování však
nestačí jediný ukazatel. Strukturální coverage (line, branch) ukazuje,
jak velkou část kódu testy vykonaly, ale sama o sobě neříká, zda by
testy zachytily skutečnou chybu [papadakis2019]. \textit{Mutation
testing} proto coverage doplňuje o druhý pohled: do programu
systematicky zavádí drobné změny (*mutanty*) a sleduje, kolik
z nich testy odhalí. Papadakis et al. [papadakis2019] jej proto
chápou jako měření síly testovací sady, nikoli jen průchodnosti kódu.

Udržovatelnost se naproti tomu neprojevuje primárně v jednom běhu
programu, ale ve vlastnostech samotného kódu: zda je srozumitelný,
lokalizovatelný při změně a bezpečně modifikovatelný. Právě proto se
její část hodnotí statickou analýzou, tedy zkoumáním zdrojového kódu
bez spuštění programu. Statická analýza neposkytuje úplné hodnocení
udržovatelnosti, ale nabízí proxy metriky pro její vybrané vnitřní
atributy. *Cyklomatická složitost* [mccabe1976] vyjadřuje
počet lineárně nezávislých cest grafem řízení toku; vyšší hodnoty
souvisejí s vyšší chybovostí a nižší testovatelností a v praxi se
často používá práh 10 na funkci [mcconnell2004]. *Linting*
kontroluje porušení jazykových a projektových konvencí a \textit{typová
kontrola} zachycuje nekonzistence v rozhraních a práci s datovými typy
ještě před během programu. Tyto nástroje jsou užitečné jako časné
signály strukturálních problémů, ale pokrývají jen část
udržovatelnosti; vhodnost dekompozice, pojmenování nebo přiměřenost
návrhových rozhodnutí přesahují možnosti deterministických nástrojů.

**Procesní měření.**
Kvalita software se však neprojevuje jen na hotovém produktu, ale
i v postupu, kterým vznikl. Procesní metriky proto sledují, zda lze
propojit požadavek, implementaci a ověření [gotel1994], jak jsou
změny členěny a dokumentovány ve verzovacím systému a zda před
integrací proběhly kontrolní kroky a automatizované
ověření [humble2010]. Tento typ evidence neodpovídá na otázku,
zda je řešení správné, ale zda vzniklo způsobem, který je
sledovatelný, přezkoumatelný a opakovatelný.

**Měření zdrojů.**
Třetí kategorií jsou metriky zdrojů, tedy nákladů spojených se
vznikem výsledku. V tradičním softwarovém inženýrství sem patří
zejména čas, lidské úsilí, použití nástrojů a výpočetních
prostředků [fenton2014]. Dvě řešení mohou mít srovnatelnou
produktovou kvalitu, a přesto se výrazně lišit v ceně, za kterou byla
vytvořena; i proto představují zdrojové metriky samostatnou rovinu
hodnocení.

Pro tuto práci z tohoto rozlišení plyne jednoduchý závěr: když kód
vytváří autonomní agent, zůstávají relevantní všechny tři roviny.
Testy a statická analýza stále měří produkt, ale pro posouzení
agentovy práce je třeba sledovat i procesní artefakty a spotřebované
zdroje. Následující sekce proto přechází od měření kvality software
obecně ke specifikům AI coding agentů a jejich hodnocení.

## AI coding agenti

Předchozí sekce popsala, jak se kvalita software zajišťuje a měří
v tradičním vývoji. AI coding agenti tento kontext mění: kód již
nepíše pouze člověk, ale autonomní systém řízený instrukcemi.
Požadavky na kvalitu zůstávají stejné, mění se však to, kdo je
plní a jak lze výsledek hodnotit. Tato sekce zavádí základní pojmy
(sekce [ref:sec:zakladni-pojmy]), popisuje jak se chování agentů
řídí instrukcemi (sekce [ref:sec:scaffolding-instrukce]) a jak se
jejich výstupy hodnotí (sekce [ref:sec:hodnoceni-ai-agentu]).

### Základní pojmy a typy

*Velký jazykový model* (*large language model*, LLM)
je neuronová síť založená na architektuře
Transformer [vaswani2017], trénovaná na rozsáhlých textových
korpusech. Model predikuje pravděpodobnost následujícího tokenu
na základě předchozího kontextu, což mu umožňuje generovat
koherentní text, včetně zdrojového kódu.

Samotný LLM je však pasivní: odpovídá na dotazy, ale nemůže
samostatně číst soubory, spouštět příkazy ani měnit stav projektu.
*LLM-based agent* rozšiřuje model o schopnost interagovat
s prostředím [liu2024llmagents]. Liu et al. identifikují čtyři
klíčové komponenty agenta: *plánování* (dekompozice úkolu na
kroky), *paměť* (krátkodobý kontext a dlouhodobé znalosti),
*percepce* (vnímání prostředí, například čtení souborů
a výstupů příkazů) a *akce* (provádění změn pomocí nástrojů).
Interakce s prostředím probíhá v cyklu
Thought \to Action \to Observation, který formalizovali Yao
et al. [yao2022react] v rámci ReAct. Agent v každém kroku
zformuluje záměr, provede akci (například zavolá nástroj) a na
základě pozorovaného výsledku rozhodne o dalším kroku.

Schopnost volat nástroje (*tool use*, \textit{function
calling}) je technickým předpokladem agentního chování. Schick
et al. [schick2023toolformer] ukázali, že LLM se dokáže naučit,
kdy a jaký nástroj použít. V kontextu coding agentů to znamená, že
agent může číst a zapisovat soubory, spouštět testy, používat
verzovací systém nebo volat API.

Guo et al. [guo2025benchmarks] rozlišují tři paradigmata
s rostoucí autonomií:

    - *Prompt-based*: člověk formuluje dotaz, model odpovídá
          (např.\ ChatGPT, GitHub Copilot pro doplňování kódu).
    - *Fine-tune-based*: model je adaptován na doménu
          softwarového inženýrství (např.\ CodeLlama, StarCoder).
    - *Agent-based*: model autonomně plánuje a vykonává
          vícekrokové úkoly v reálném prostředí (např.\ Devin, Claude
          Code, OpenHands).

Předmětem dalšího výkladu je třetí paradigma: autonomní coding agenti,
kteří na základě specifikace a instrukcí samostatně implementují
softwarový projekt. Zásadní rozdíl oproti předchozím paradigmatům
spočívá v tom, že agent provádí celý vývojový proces, nikoli jen
jednotlivé kroky. To znamená, že na jeho výstupy lze aplikovat
stejné požadavky na kvalitu procesu i produktu, jaké popisuje
sekce [ref:sec:swe-zivotni-cyklus].

### Scaffolding a instrukce

Autonomní agent nemá *tacit knowledge*, tedy implicitní znalosti, které
lidský vývojář získává zkušeností: jaké konvence tým dodržuje, proč
je kód strukturovaný určitým způsobem nebo jaké chyby se v projektu
opakují. Nonaka a Takeuchi [nonaka1995] popisují převod tacit
knowledge na explicitní jako klíčový proces v organizacích. Pro
agenty je tento převod nutný v plném rozsahu: veškerý kontext, který
agent potřebuje, musí být zapsán explicitně. Hassan
et al. [hassan2025sase] tuto dualitu formalizují v rámci SASE
(*Software Engineering for Agents*): zatímco lidský vývojář
(SE4H) čerpá z meetingů, code review a zkušenosti, agent (SE4A)
pracuje výhradně s tím, co dostane jako vstup.

*Scaffolding* označuje strukturované artefakty v prostředí
agenta, které jeho chování řídí. V praxi jde nejčastěji
o instrukční soubory umístěné v repozitáři
(např.\ `AGENTS.md`, `CLAUDE.md`), které definují
roli agenta, pracovní postup, konvence a omezení. Na rozdíl od
jednorázových promptů jsou tyto soubory verzované a iterativně
upravované, což z nich činí "living documents," jejichž vývoj
lze zpětně sledovat.

Mao et al. [mao2025fse] analyzovali 2 163 produkčních
prompt šablon a identifikovali sedm typů komponent: Role,
Directive, Context, Workflow, Output, Constraints a Examples.
Zjistili, že Role a Directive se nejčastěji objevují na začátku
dokumentu a že Workflow (procedurální kroky) je nejúčinnější
komponentou pro složité úkoly. Toto zjištění potvrzují Li
et al. [skillsbench2025], kteří ukazují, že procedurální
instrukce ("jak pracovat") jsou efektivnější než popisná
dokumentace ("jak vypadá codebase").

Empirická evidence o účinnosti instrukčních souborů je smíšená.
Lulla et al. [lulla2026] zjistili, že přítomnost souboru
`AGENTS.md` je spojena s nižší mediánovou dobou běhu agenta
(-28{,}6 %), ačkoli účinnost jednotlivých typů obsahu dosud
nebyla izolována. Gloaguen et al. [gloaguen2025agentsmd]
naopak ukázali, že LLM-generované instrukční soubory úspěšnost
agenta snižují a že i soubory napsané vývojáři přinášejí jen
marginální zlepšení. Li et al. [skillsbench2025] v benchmarku
SkillsBench zjistili, že kurátorované moduly zlepšují výsledky
o 16,2 procentních bodů, zatímco automaticky generované nemají
žádný efekt. Syntéza těchto zjištění naznačuje, že samotná
přítomnost instrukcí nestačí; rozhodující je jejich obsah, struktura
a relevance pro konkrétní úlohu.

Chování agenta je navíc citlivé na formulaci instrukcí. Breunig
et al. [breunig2025] ukazují, že přestrukturování instrukce
je účinnější než její opakování: když agent pravidlo ignoruje,
nepomůže ho zopakovat; je třeba ho přeformulovat tak, aby se stal
součástí pracovního postupu. Razavi a Fard [razavi2025]
dokládají, že drobné změny formulace promptu mohou dramaticky
změnit chování modelu, což motivuje cílené úpravy místo přidávání
dalších pravidel.

### Hodnocení AI agentů

De facto standardem pro hodnocení coding agentů je
SWE-bench [swebench2024]: benchmark obsahující 2 294 úloh
z reálných GitHub repozitářů, kde agent dostane popis problému
(GitHub issue) a má vytvořit patch, který projde testy. Hodnocení
je binární: patch projde nebo neprojde. Obdobně
HumanEval [chen2021humaneval] měří schopnost modelu generovat
funkčně správný kód na izolovaných programovacích úlohách.

Tyto benchmarky měří *funkční korektnost*: zda výsledek dělá
to, co má. Neměří však, jak agent pracoval (dodržoval proces?),
jakou strukturální kvalitu má výsledný kód (je udržovatelný?) ani za
jakou cenu výsledku dosáhl (kolik tokenů spotřeboval?). Tři nedávné
studie tuto mezeru empiricky dokládají. METR [metr2026]
nechal čtyři správce repozitářů z SWE-bench posoudit patche, které
prošly automatickými testy; přibližně polovina z nich by nebyla
přijata do hlavní větve, protože nesplňovala standardy kvality kódu
nebo procesu. Li et al. [li2026beyondbugfixes] analyzovali
1 210 přijatých pull requestů od coding agentů pomocí SonarQube
a zjistili, že přijetí neznamená kvalitu: přijaté PR vykazovaly
měřitelné problémy s udržovatelností. Ehsani
et al. [ehsani2026failedprs] na vzorku 33 000 agentních PR
identifikovali, že vedle funkčních chyb se vyskytují i procesní
selhání (duplicitní PR, špatně zvolená větev, chybějící popis),
která stávající benchmarky vůbec nezachycují.

Existují benchmarky, které hodnocení rozšiřují nad rámec pass/fail.
SWE-bench Pro [swebenchpro2025] přidává strukturované
požadavky, ACE-Bench [acebench2025] testuje end-to-end vývoj
a FeatureBench [featurebench2026] hodnotí implementaci celých
funkcí. Žádný z nich však systematicky neměří kvalitu procesu (jak
agent organizoval práci), kvalitu kódu nad rámec funkční korektnosti
(udržovatelnost, čistota) a efektivitu (spotřeba zdrojů) současně.
Tato mezera naznačuje potřebu metrického rámce, který by tyto
dimenze pokrýval současně.

**LLM-as-judge.**
Některé dimenze kvality, jako srozumitelnost commit zpráv, kvalita
dokumentace nebo vhodnost návrhových vzorů, nelze spolehlivě hodnotit
deterministickými nástroji. Jedním z přístupů je využití LLM jako
hodnotitele (*LLM-as-judge*). Zheng et al. [zheng2023mtbench]
ukázali, že LLM dokáže hodnotit kvalitu výstupů na úrovni
srovnatelné s lidskými hodnotiteli, ale identifikovali tři
systematické biasy: *position bias* (preferuje odpověď
na určité pozici), *verbosity bias* (preferuje delší
odpovědi) a *self-enhancement bias* (preferuje vlastní
výstupy). Panickssery et al. [panickssery2024] prokázali
korelaci mezi schopností modelu rozpoznat vlastní výstupy a mírou,
do jaké je preferuje, což naznačuje kauzální vztah mezi
self-recognition a self-preference. Verga et al. [verga2024poll]
navrhli mitigaci formou panelu diverzních modelů (PoLL), který
dosahuje lepší shody s lidským hodnocením než jednotlivý model.
Praktickou implikací je volba hodnotícího modelu z odlišné modelové
rodiny, než ve které pracuje hodnocený agent.

**Test oracle problem.**
S testováním souvisí *test oracle problem*: kdo definuje
správný výsledek? Mathews et al. [mathews2024] zjistili, že
nástroje pro automatické generování testů systematicky filtrují
selhávající testy; až 68,1 % výsledných testovacích sad validuje
chybné chování místo jeho odhalení. Chen et al. [rethinking2025]
na 500 úlohách benchmarku SWE-bench Verified potvrdili, že
agent-generované testy slouží primárně jako observační zpětná vazba,
nikoli jako validační nástroj. Obranou proti tomuto problému je
odvozování očekávaných hodnot ze specifikace, nikoli z pozorování
kódu.

---

# Metodika

## Výzkumný přístup

Kapitolа [ref:kap:vymezeni] vymezila problém, že pass/fail benchmarky
nepostačují pro posouzení praktické použitelnosti AI coding agenta,
a kapitola [ref:kap:teorie] ukázala, proč je vedle funkční
korektnosti nutné sledovat i proces, kvalitu kódu a efektivitu a proč
jsou instrukce smysluplnou nezávislou proměnnou. Tato kapitola tato
východiska převádí do konkrétní metodiky: definuje sadu metrik,
experimentální design a způsob, jak jsou výsledky mezi běhy
porovnávány.

Navrhujeme sadu metrik a iterativní postup pro hodnocení AI coding
agentů. Ověřujeme je na případové studii systému upomínek faktur:
opakovaně pouštíme agenta s různými variantami instrukcí a měříme,
jak se mění jeho proces, výstup a náklady. Tento přístup odpovídá
iterativnímu cyklu návrhu a vyhodnocení [hevner2004, peffers2008],
ale v našem kontextu neslouží k silné statistické izolaci kauzality.
Jeho cílem je ukázat, zda je navržený metrický rámec a postup
použitelný a jaké typy změn v chování agenta dokáže odhalit.

V této práci realizujeme cyklus čtyřmi kroky: Spuštění, Měření,
Diagnóza a Úprava. Podrobný popis kroků uvádí
sekce [ref:sec:pilotni-iterace]. Postup má dvě fáze: pilotní fázi,
v níž cyklus opakujeme dokud nedosáhneme stabilního zlepšení a jednoho
úspěšného běhu podle zvolených kritérií, a komparativní variace, v níž
z fungující verze instrukcí systematicky odebíráme jednotlivé části
a měříme dopad na chování agenta
(sekce [ref:sec:komparativni-variace]).

Pro ověření jsme zvolili případovou studii na jednom projektu.
Řízený experiment s větším počtem běhů by byl vzhledem k ceně jedné
iterace (tisíce tokenů, desítky minut) nepraktický. Případová studie
naopak umožňuje opakované běhy s různými instrukcemi a podrobnou
analýzu každého z nich. Z jednoho projektu nelze statisticky
generalizovat; Yin [yin2018] pro tento typ výzkumu používá pojem
analytická generalizace: na jednom případě ukazujeme princip, který
lze dále ověřovat na dalších projektech. Jde o embedded single-case
design: zkoumáme jeden projekt, ale v rámci něj více běhů agenta, z nichž
každý má vlastní verzi instrukcí, git historii a sadu naměřených
metrik.

## Sada metrik

Každý experimentální běh probíhá tak, že agent dostane prázdné
GitHub repo, specifikaci v Issue \#1 a instrukce v `AGENTS.md`,
a autonomně implementuje zadaný projekt. Výstup jednoho běhu (kód,
testy, git historie) měříme sadou 19 metrik. Postup běhu
a experimentální design popisuje
sekce [ref:sec:experimentalni-design].

Sada metrik pokrývá tři otázky: jak agent pracoval, co vyrobil
a za jakou cenu. Fenton a Bieman [fenton2014] klasifikují
měřitelné entity v softwarovém inženýrství do tří kategorií: proces,
produkt a zdroje. V kontextu AI agentů dospívají k obdobnému
rozdělení Yin et al. (2025) [yin2025agents], kteří hodnotí agentní
frameworky ve třech dimenzích: effectiveness (výsledek), efficiency
(průběh práce) a overhead (spotřebované zdroje). Naše sada metrik
sleduje stejnou strukturu a obsahuje 19 metrik ve třech kategoriích:

\begin{description}
    
    - [P – proces (P1–P8)] Dodržel agent předepsaný postup?
          Měříme dodržování workflow pravidel z instrukcí (P1–P5)
          a kvalitu procesních výstupů jako commit messages, issue
          a PR descriptions (P6–P8).
    - [Q – kvalita produktu (Q1–Q8)] Je kód kvalitní?
          Měříme funkční korektnost (Q1–Q2), kvalitu testů (Q3–Q4)
          a udržovatelnost kódu (Q5–Q8).
    - [E – efektivita (E1–E3)] Za jakou cenu?
          Zaznamenáváme tokeny z exportu (E1: špička promptu na krok,
          součet výstupů a součet `cache.read`+`cache.write`
          přes kroky; vše v tisících vedle sebe), čas (E2) a stabilitu
          session (E3).
\end{description}

Výběr konkrétních metrik vychází z potřeb případové studie
a dostupných nástrojů; sada si neklade nárok na úplnost.
Teoretické základy jednotlivých metrik (proč jsou validní, jaká
je evidence) popisuje sekce [ref:sec:mereni-kvality]. Tato sekce
se soustředí na jejich operacionalizaci: jaký nástroj používáme,
jaká data jsou vstupem a co přesně je výsledkem měření. Interpretace
přínosu jednotlivých metrik patří až do kapitoly
[ref:kap:vyhodnoceni].

### Procesní metriky (P1–P8)

Procesní metriky [fenton2014] měří *jak* agent pracuje.
Instrukce v AGENTS.md definují strukturovaný vývojový postup: agent
má odvozovat práci ze specifikace, organizovat ji přes issues
a branches, psát testy před implementací a dokumentovat rozhodnutí
v commit messages a PR descriptions.

#### P1–P5: compliance (binární)

P1 ověřuje, zda agent vytvořil issues
s timestampem před prvním kódovým commitem. Měříme porovnáním
`created\_at` nejstaršího agentova issue (GitHub API)
s časem prvního commitu obsahujícího soubory v `src/`
nebo `tests/`.

P2 ověřuje, zda agent vytvořil pro každé
issue vlastní větev. Měříme počet remote branches (bez `main`)
vůči počtu issues: podmínka *branches \geq issues* je splněna
tehdy, nenastalo-li slučování více issues do jedné větve.

P3 ověřuje, zda agent psal testy před
implementací. Primární indikátor: existuje alespoň jeden commit s prefixem
`test:` a zároveň alespoň jeden `feat:`. Přesnější
měření poskytuje behavioral trace (sekce [ref:sec:iterativni-cyklus]):
počet větví, kde první zápis do `src/` předcházel prvnímu
zápisu do `tests/` (`tddOrderViolations`).

P4 ověřuje, zda každý PR obsahuje
odkaz na issue. GitHub API vrací tělo PR; podmínka: všechna PR těla
obsahují regex `Closes \#N`.

P5 ověřuje, že agent
nepřepisoval již existující testové soubory. Metrika zachycuje
`modified` změny (`-{`-diff-filter=M}) na testovacích
souborech, tedy situaci kdy agent dříve vytvořený test později upraví
místo toho, aby opravil implementaci. Nově přidané testy se do
P5 nezapočítávají.

#### P6–P8: kvalita procesních artefaktů (LLM-as-judge)

P6 hodnotí popisnost commit messages:
atomicitu, konvenční prefix a srozumitelnost co a proč bylo změněno.
Hodnocení provádí LLM-as-judge na škále 1–3
(sekce [ref:sec:llm-as-judge-aplikace]).

P7 hodnotí popisnost issue descriptions:
jasnost scope, přítomnost acceptance criteria, dostatečnost pro
implementaci. Hodnocení provádí LLM-as-judge na škále 1–3.

P8 hodnotí popisnost PR descriptions:
přítomnost odkazu na issue, popis co a proč, dostatečnost pro
code review. Hodnocení provádí LLM-as-judge na škále 1–3.

### Produktové metriky (Q1–Q8)

Produktové metriky [fenton2014] měří *co* agent vyrobil.
Pokrývají tři oblasti: funguje implementace správně (Q1–Q2), detekují
agentovy testy skutečné chyby (Q3–Q4) a je kód udržovatelný (Q5–Q8).

#### Funkční korektnost (Q1–Q2)

Q1 ověřuje, zda agentův kód dodržuje
definované rozhraní. Referenční typy se importují a zkompilují proti
agentovu kódu (`tsc`). Výsledek je binární: typy sedí, nebo ne.
Q1 je vstupní podmínkou pro Q2: pokud agentův kód neimplementuje
správné API, referenční testy nelze ani zkompilovat, a výsledek Q2
by byl nesmyslný.

Q2 měří kolik z referenčních
testů projde na agentově implementaci. Vitest spustí 42 testů proti
agentovu kódu; výsledek je počet passing testů z 42. Testy ověřují
chování přes veřejné API (black-box,
sekce [ref:sec:testovani-mutation]), takže je lze spustit na
libovolném běhu nezávisle na interní struktuře. Konstrukce referenční
test suite popisuje sekce [ref:sec:ref-implementace-postup].

#### Kvalita testů (Q3–Q4)

Q3 měří, jestli agentovy testy skutečně
detekují chyby (sekce [ref:sec:testovani-mutation]). Stryker
s konfigurací `-{`-mutate 'src/**/*.ts'} a mutátory pro
TypeScript (conditional, arithmetic, string, logical operators)
systematicky zavádí drobné změny do zdrojového kódu. Vstup: agentovy
testy + zdrojový kód. Výstup: procento zabitých mutantů z celkového
počtu.

Q4 měří, kolik akceptačních kritérií ze specifikace má
odpovídající test v agentově test suite. Na rozdíl od Q2
(funguje implementace?) se Q4 ptá, jestli agent
*testoval všechno co měl*. Specifikace obsahuje 25 acceptance
criteria. Historicky uložené judge běhy byly exportovány ve
24bodovém formátu; při finalizaci práce byl chybějící bod AC25
(*custom holiday calendar*) dopočítán manuálně. V textu proto
Q4 uvádíme na škále `N/25`. Hodnocení provádí
LLM-as-judge (sekce [ref:sec:llm-as-judge-aplikace]) doplněné o toto
manuální ověření.

#### Kvalita kódu (Q5–Q8)

Q5 počítá varování a chyby z ESLint
s fixní konfigurací (pravidla: recommended + strict TypeScript rules).
Konfigurace je součástí experimentální infrastruktury, ne agentova
repo; agent ji nemůže měnit. Výstup: celkový počet warnings + errors.

Q6 počítá chyby z `tsc -{`-noEmit}
ve strict mode. Doplňuje počet explicitních `any` ve zdrojových
souborech (grep v `src/**/*.ts`) jako proxy pro obcházení
typového systému.

Q7 měří cyklomatickou složitost per funkce.
ESLint `complexity` rule reportuje funkce překračující
nastavený práh. Výstup: maximální složitost across all functions.
Práh \leq 10 per funkce vychází
z McCabe (sekce [ref:sec:staticka-analyza]).

Q8 hodnotí aspekty které automatizované
nástroje nezachytí: pojmenování, oddělení zodpovědností, idiomatický
TypeScript, kvalita dokumentace a zbytečná komplexita. Hodnocení
provádí LLM-as-judge (sekce [ref:sec:llm-as-judge-aplikace]).
Celkové skóre Q8 je *minimum* pěti dimenzí, nikoliv průměr.
Volba minima je záměrná: jeden slabý rozměr má stáhnout celkový výsledek
dolů, aby slabiny nebyly maskované silnými dimenzemi.

### Metriky efektivity (E1–E3)

Metriky efektivity měří zdroje spotřebované při vývoji. Nemají exit
kritérium a slouží k porovnání nákladů mezi iteracemi.

E1 zaznamenává tři komplementární hodnoty z exportu
`transcript.json`: maximální vstup na jednom kroku včetně
`cache.read` a `cache.write`, součet výstupních tokenů
přes kroky a součet cache tokenů přes kroky. Všechny tři složky
uvádíme v tisících. Toto rozdělení umožňuje odlišit šířku promptu,
objem generování a cenu opakovaného čtení kontextu. Sledování objemu
tokenů motivuje zjištění Gloaguen et al. [gloaguen2025agentsmd],
že context files zvyšují inference cost o více než 20 %.

E2 měří wall-clock time v minutách od spuštění
agenta po poslední commit.

E3 sleduje stabilitu session ve třech signálech: zda běh
dokončil, kolik kompakcí kontextu nastalo a kolikrát auto-continue
plugin session restartoval. Počet kompakcí odvozujeme heuristicky
z exportu `transcript.json`: porovnáváme snapshot uložený
na konci kroku (`step-finish`) se snapshotem na začátku
následujícího kroku (`step-start`); změna snapshotu značí
kompakci. Počet restartů bereme z `metrics.csv` generovaného
auto-continue pluginem. Na této úloze jde o pomocnou záznamovou
metriku, která má zachytit zjevné kolapsy kontinuity práce mezi kroky.

Se dvěma běhy per variaci jsou tyto hodnoty deskriptivní,
ne inferenční.

### Aplikace LLM-as-judge

Pět metrik (P6, P7, P8, Q4, Q8) hodnotí vlastnosti které nelze extrahovat
automatizovaným nástrojem. Pro jejich hodnocení používáme metodu
LLM-as-judge (sekce [ref:sec:llm-as-judge]).

**Volba modelu.** Jako judge používáme GLM-5 (Zhipu AI).
Agentní běhy provádí model MiniMax-M2.5; judge je tedy z jiné modelové
rodiny. Důvod: model má tendenci hodnotit výstupy svého vlastního
druhu lépe, i když jsou objektivně slabší
(self-preference bias [panickssery2024]). Volba judge
z jiné modelové rodiny než agent tento bias
snižuje [verga2024poll].

**Škála.** Hodnocení probíhá na škále 1–3 per dimenze:
1 = nevyhovující, 2 = přijatelné, 3 = dobré.
Jemnější škály (1–5, 1–10) produkují při malém počtu hodnocených
artefaktů nižší shodu mezi hodnotiteli [zheng2023mtbench];
třístupňová škála je pro tento rozsah spolehlivější.

**Rubrika.** Judge dostane artefakty agentova běhu (zdrojový
kód, commit messages, issue a PR descriptions) spolu s rubrikou
obsahující popis každého stupně. Prompt je fixní across all runs,
aby hodnocení bylo srovnatelné mezi iteracemi. Rubriky jsou
uvedeny v příloze.

**Interpretace výsledků.** LLM-as-judge zde neslouží jako plně
objektivní měření, ale jako strukturované posouzení vlastností, které
nelze spolehlivě vyhodnotit deterministickým skriptem. Výsledky těchto
metrik proto interpretujeme jako podpůrné kvalitativní indikátory a ne
jako hlavní důkazní osu experimentu.

## Experimentální design

### Výběr projektu

Případová studie potřebuje projekt, na kterém lze opakovaně spouštět
agenta s různými instrukcemi a objektivně měřit výsledky. Projekt musí
mít deterministickou logiku (stejný vstup vždy dá stejný výstup), aby
bylo možné ověřit korektnost automatizovanými testy a mutation testingem.
Zároveň musí být dostatečně malý pro více experimentálních běhů, ale
obsahovat reálné nuance (hraniční případy, doménová pravidla), aby
měl agent co řešit.

Zvolili jsme systém upomínek faktur: systém pro automatické odesílání
připomínek k nezaplaceným fakturám. Obsahuje stavový automat (nová,
po splatnosti, upomínaná, eskalovaná), časové výpočty (pracovní dny,
ochranné lhůty) a pravidla pro eskalaci. Specifikace definuje 25
acceptance criteria, API kontrakt (TypeScript typy a signatury)
a doménový slovník. Systém zde neplní roli hlavního výsledku práce,
ale testovacího prostředí, na němž lze měřit chování agenta. Tato
kombinace deterministické logiky
a hraničních případů (víkendy, svátky, grace periods) umožňuje
objektivně testovat jak funkční korektnost (Q1, Q2),
tak kvalitu testů (Q3, Q4).

### Fixní proměnné

Aby bylo možné měřit vliv instrukcí, musí být všechno ostatní
co nejstabilnější. Hlavní měněnou proměnnou mezi běhy je obsah
souboru `AGENTS.md`, tedy procedurálních instrukcí, které
definují pracovní postup, omezení a quality gates. Tento design
negarantuje dokonalou izolaci všech vlivů; jeho cílem je omezit
zjevné vedlejší vstupy a udělat jejich případný vliv auditovatelný.
Na rozdíl od generických context files,
které typicky popisují adresářovou strukturu a build
příkazy [gloaguen2025agentsmd], jde o fokusované instrukce
s konkrétními procedurami [skillsbench2025].

Fixní proměnné jsou:

**Prázdné GitHub repo** obsahuje pouze `AGENTS.md`,
konfiguraci agenta a auto-continue plugin. Žádný existující kód,
testy ani `package.json`. Agent musí inicializovat projekt
a zvolit strukturu sám.

**Specifikace v GitHub Issue \#1** obsahuje 25 acceptance
criteria, API kontrakt (TypeScript typy a signatury), doménový
slovník a out of scope. Je to hlavní věcný vstup, který agent
dostane kromě instrukcí.

**Auto-continue plugin** je hook který detekuje kdy se agent
zastaví a automaticky ho restartuje. Počítadlo restartů a kontrola
otevřených issues zajišťují běh bez manuálního zásahu. Metrika E3
z toho čerpá.

**Model MiniMax-M2.5** byl zvolen jako model schopný autonomně
dokončit zadaný úkol. Cílem práce je vyhodnotit sadu metrik
a iterativní postup, ne srovnávat výkon modelů — volba konkrétního
modelu je v tomto ohledu sekundární. MiniMax-M2.5 je zároveň z jiné
modelové rodiny než judge (GLM-5, Zhipu AI), čímž se eliminuje
self-preference bias (sekce [ref:sec:llm-as-judge]).

**Běhové prostředí (Docker container)** zajišťuje, že agent
nemá přístup ke globální konfiguraci nástroje, MCP serverům ani
rozšířením nainstalovaným na hostitelském systému. Izolace tím
významně omezuje vliv vedlejších vstupů z prostředí, ale
nevylučuje všechny zdroje variability. Sdílený
autentizační svazek zajišťuje konzistentní přístup k API napříč
běhy.

**System prompt agenta** (`build.md`) nahrazuje výchozí
system prompt nástroje OpenCode, jehož instrukce o verzování
konfliktvaly s procesními požadavky experimentu. Vlastní system prompt
obsahuje pouze obecné kódové konvence (styl, bezpečnost, zákaz
komentářů) a odkaz na `AGENTS.md`. Veškeré procesní instrukce
jsou výhradně v `AGENTS.md`, aby bylo možné změny procesního
chování přisuzovat této vrstvě obhajitelněji než při jejich
rozptýlení mezi více vstupů.

### Iterativní cyklus

Pilotní fáze postupuje opakováním čtyřkrokového cyklu, dokud agent
nesplní exit kritéria. Každý průchod cyklem je jedna experimentální
iterace — vstupem je aktuální verze `AGENTS.md`, výstupem
upravená verze pro příští běh.

\begin{center}
\begin{tikzpicture}[
    node distance=1.8cm,
    box/.style={rectangle, draw, rounded corners=3pt,
                minimum width=2.2cm, minimum height=0.8cm,
                font=\small\sffamily},
    arr/.style={->, thick}
]
    \node[box] (run)      {Spuštění};
    \node[box, right=of run]     (measure) {Měření};
    \node[box, right=of measure] (diagnose){Diagnóza};
    \node[box, right=of diagnose](fix)     {Úprava};

    \draw[arr] (run)      – (measure);
    \draw[arr] (measure)  – (diagnose);
    \draw[arr] (diagnose) – (fix);
    \draw[arr] (fix.south) – ++(0,-0.5) -| (run.south)
        node[midway, below, font=\footnotesize\sffamily]
        {opakovat dokud exit kritéria};
\end{tikzpicture}
\end{center}

**Spuštění.** Skript `new-run.ts` připraví izolované prostředí:
vytvoří prázdné GitHub repo, zkopíruje aktuální `AGENTS.md`,
vytvoří Issue \#1 se specifikací a spustí agenta v Docker kontejneru.
Agent dostane výhradně prázdné repo, instrukce a specifikaci — žádný
existující kód ani závislosti. Po dokončení se exportuje session
transcript (`transcript.json`).

**Měření.** Skript `analyze-run.ts` extrahuje
deterministické metriky automaticky: git log a GitHub API (P1),
výstup Vitest a Stryker (Q2, Q3), statická analýza (Q5–Q7),
session metadata (E1–E3). Kvalitativní metriky (P6, P7, P8, Q4,
Q8) hodnotí LLM-as-judge GLM-5 podle fixní rubriky
(sekce [ref:sec:llm-as-judge-aplikace]). Výstupem je
`FINDINGS.md` s tabulkou metrik a faktickým popisem
chování agenta.

**Diagnóza.** Z naměřených hodnot a behaviorálního popisu se
identifikuje kde a proč agent nedodržel očekávané chování. Analýza
postupuje podle čtyř rámců:

    - Mao et al. [mao2025fse] — která složka instrukcí selhala a proč
    - Hassan et al. [hassan2025sase] — zda obsah vyvažuje proceduru, kontext a omezení
    - Lulla et al. [lulla2026] — zda každý řádek přidává hodnotu
    - Razavi, Breunig [razavi2025,breunig2025] — proč agent instrukci opakovaně ignoruje

Výstupem je `DIAGNOSIS.md` s identifikovanými příčinami
a návrhem změn.

**Úprava.** Na základě diagnózy se upraví `AGENTS.md`.
Každá změna odpovídá jednomu identifikovanému problému, je podložena
citací a zaznamenaná v changelogu — aby bylo zpětně dohledatelné
proč daná úprava vznikla a co měla opravit. Přestrukturování
instrukcí je preferováno před jejich rozšiřováním: redundantní
obsah zvyšuje inference cost bez přínosu k úspěšnosti [gloaguen2025agentsmd]
a fokusované instrukce překonávají vyčerpávající
dokumentaci [skillsbench2025].

### Pilotní fáze

Pilotní fáze běží dokud agent nesplní exit kritéria ze sloupce
*Exit kritérium* v tabulce [ref:tab:metriky-prehled].
Kritéria dělíme do tří skupin. Tvrdá deterministická kritéria
(P1–P5, Q1, Q2, Q5, Q6)
mají přirozenou hranici splněno/nesplněno. Prahové deterministické
metriky (Q3, Q7) používají minimum odvozené z literatury
a praxe. Judge-based metriky (P6–P8, Q4, Q8)
slouží jako podpůrné kvalitativní indikátory. E1–E3
jsou zaz bez exit kritéria a slouží k porovnání efektivity
mezi běhy.

S ohledem na scope práce (jeden projekt, jeden model) stačí jeden
úspěšný běh bez manuálního zásahu a prokazatelné zlepšení oproti
baseline. Pilotní fáze tak ukazuje proveditelnost postupu na jednom
případu; neimplikuje, že zvolené prahy obecně platí pro všechny
agenty a projekty. Každá iterace produkuje
aktualizovaný `AGENTS.md`, záznam změn se zdůvodněním
a kompletní P/Q/E metriky.

### Komparativní variace

Z fungující sady instrukcí (výstup pilotní fáze) systematicky odebíráme
jednotlivé složky a měříme dopad na chování agenta. Tento postup,
ablace, odpovídá na otázku: potřebuje agent danou část instrukcí,
nebo je redundantní?

Konkrétní variace nelze specifikovat předem. Pilotní fáze
*generuje* hypotézy o tom, které složky instrukcí jsou pro
chování agenta podstatné, a komparativní fáze je testuje. Výběr
variací vychází z diagnostiky pilotních běhů
(sekce [ref:sec:pilotni-iterace]): pokud se v pilotu ukáže, že agent
konzistentně nedodržuje určité pravidlo, ablace může testovat, zda
jeho odebrání změní i ostatní metriky. Podobně pokud určitá sekce
instrukcí koreluje s vysokou kvalitou výstupu, ablace ověří, zda je
tento vztah kauzální.

Každá ablace se provádí ve dvou nezávislých bězích se stejným
nastavením, aby bylo možné odlišit systematický efekt změny od
přirozené variability nedeterministického modelu. I se dvěma běhy
nelze dosáhnout statistické průkaznosti (sekce [ref:sec:omezeni-validita]);
výsledky komparativní fáze proto interpretujeme jako indikativní,
nikoliv kauzální.

## Přehledová tabulka

Tabulka [ref:tab:metriky-prehled] shrnuje všechny metriky na jednom
místě. Sloupec *typ* rozlišuje deterministická exit kritéria
(automatizované měření), judge-based metriky
(rubrikové hodnocení LLM-as-judge) a záznamové metriky
(bez kritéria, slouží k porovnání mezi běhy). Prahové požadavky
jsou uvedeny ve sloupci *Exit kritérium*; způsob sběru
odpovídá rozlišení det, qual a zaz
zavedenému v kapitole [ref:kap:teorie]. 

[TABLE]

Table: Sada metrik: kód, měřená vlastnost, nástroj, exit kritérium a typ

\footnotesize
\setlength{\tabcolsep}{3pt}
[TABLE START]
lllll@{}}

**Kód**  |  **Metrika**  |  **Nástroj**  |  **Exit kritérium**  |  **Typ** 

\multicolumn{5}{@{}l}{*Procesní (P): jak agent pracuje*} [2pt]
P1  |  Issues before code             |  git, GitHub API  |  pass  |  deter. 
P2  |  Branch per issue               |  git, GitHub API  |  pass  |  deter. 
P3  |  Test-first commits             |  git log          |  pass  |  deter. 
P4  |  PRs linked to issues           |  GitHub API       |  pass  |  deter. 
P5  |  No existing test modifications  |  git diff        |  pass  |  deter. 
P6  |  Commit message quality         |  LLM-as-judge (GLM-5)  |  \geq 2/3  |  judge 
P7  |  Issue description quality      |  LLM-as-judge (GLM-5)  |  \geq 2/3  |  judge 
P8  |  PR description quality         |  LLM-as-judge (GLM-5)  |  \geq 2/3  |  judge 

\multicolumn{5}{@{}l}{*Produktové (Q): co agent vyrobil*} [2pt]
Q1  |  API contract match          |  tsc (import + typecheck)  |  match  |  deter. 
Q2  |  Referenční test pass rate   |  Vitest (42 testů)        |  42/42  |  deter. 
Q3  |  Mutation score               |  Stryker                  |  \geq 70 %  |  min. 
Q4  |  AC coverage agentových testů (25 krit.)  |  LLM-as-judge (GLM-5)    |  25/25  |  judge 
Q5  |  Lint warnings                |  ESLint                   |  0  |  deter. 
Q6  |  Typecheck errors             |  tsc `-{`-noEmit}  |  0  |  deter. 
Q7  |  Cyklomatická složitost       |  ESLint (complexity)      |  \leq 10/fn  |  min. 
Q8  |  Design quality               |  LLM-as-judge (GLM-5)    |  \geq 2/3  |  judge 

\multicolumn{5}{@{}l}{*Efektivita (E): za jakou cenu*} [2pt]
E1  |  Vstup / výstup / \Sigma cache (tis.) z exportu  |  OpenCode export  |  —  |  záznam 
E2  |  Trvání (minuty)              |  session timestamps  |  —  |  záznam 
E3  |  Stabilita session (kompakce + dokončení + restarty)  |  transcript + metrics.csv  |  —  |  záznam 

[TABLE END]

[/TABLE]

## Omezení a validita

Každý výzkumný design má omezení. Následující analýza vychází
z kategorizace Runeson a Höst [runeson2009].

**Konstruktová validita** (měříme to co chceme měřit?).
Jednotlivé metriky vychází z existující teorie: mutation
testing [papadakis2019], cyklomatická složitost [mccabe1976],
taxonomie procesních a produktových metrik [fenton2014]. Konkrétní
kombinace metrik do sady a volba exit kritérií jsou autorské a představují
návrh, ne ověřený standard. Pět metrik (P6, P7, P8, Q4, Q8) obsahují
subjektivní složku (LLM-as-judge). Tyto metriky proto slouží jako
podpůrné kvalitativní indikátory, zatímco hlavní opora vyhodnocení
stojí na deterministických metrikách a auditovatelných artefaktech.
Spolehlivost LLM-as-judge nebyla validována proti lidskému hodnocení
(např.\ Cohenovým \kappa) z důvodu časových omezení; výsledky
kvalitativních metrik proto nelze interpretovat jako objektivní měření.
Q4 navíc vyžadovala technickou korekci reportingu: historické
judge výstupy vznikly ve 24bodové rubrice, ale při finalizaci práce
byl doplněn opomenutý AC25 (*custom holiday calendar*).
Nejde o věcný nedostatek pokrytí, ale o pozdě objevenou chybu
v počítání a reportingu této metriky.
\phantomsection
Experiment rozlišuje dva druhy testů: referenční testy (měřené metrikou
Q2, spouštěné po běhu skriptem, agentovi neviditelné) a agentovy vlastní
testy (psané agentem během běhu, viditelné a spustitelné agentem).
Metrika P5 se vztahuje výhradně k agentovým vlastním testům.
Referenční testy jsou odvozeny ze specifikace metodou
TDD [mathews2024], čímž se snižuje riziko test oracle problému.
Při validaci měřicí infrastruktury byly identifikovány známé
nedostatky (Q4, P7, Q6) a změny prostředí mezi běhy (Docker izolace,
E1 neporovnatelnost, temperature); tyto poznatky jsou konzistentní
napříč běhy a jsou diskutovány
v sekci [ref:sec:limity-vysledky].
Správnost skriptu `analyze-run.ts` pro metriky P1–P5 byla
ověřena manuálním srovnáním výstupů s raw daty z git logu a GitHub
API pro běhy r4 a r5; žádná diskrepance nebyla identifikována.

**Interní validita** (jsou závěry podložené daty?).
Hlavní hrozba je nedeterminismus LLM: stejné instrukce mohou při
různých bězích dát různé výsledky [razavi2025]. Dva běhy per
variaci jsou mitigací, ale neposkytují statistickou sílu.
Další hrozbou je confirmation bias: autor navrhuje instrukce
i evaluuje výsledky. Tuto hrozbu oslabují automatizované metriky
(P1, Q1–Q3, Q5–Q7), které nepodléhají subjektivnímu posouzení,
a volba judge modelu z jiné rodiny. Mitigací je také auditovatelný
řetězec rozhodnutí (changelog per iterace, korekční poznámky
v `FINDINGS.md`) a oddělení měřicí infrastruktury od
agentova prostředí. Jak se tyto hrozby projevily v praxi,
včetně diagnostické chyby výzkumníka, změn prostředí mezi běhy,
nenastavené temperature modelu a tichých ukončení nástroje,
diskutuje sekce [ref:sec:limity-vysledky].

**Externí validita** (lze zobecnit?). Případová studie na jednom
projektu, jednom modelu a jednom agentním nástroji neumožňuje
statistickou generalizaci. Yin [yin2018] pro tento typ výzkumu
rozlišuje analytickou generalizaci: z jednoho případu lze ukázat
principy, ne statistické zákonitosti. Systém upomínek má
deterministickou logiku a výsledky nemusí platit pro projekty
s uživatelským rozhraním, strojovým učením nebo nedeterministickými
výstupy. Přenositelné jsou metriky a postup (kdokoliv je může použít
na svém projektu), konkrétní naměřené hodnoty a instrukce platí pro
tuto studii.

Výzkum nezahrnuje lidské účastníky. Veškerá data (git log, metriky,
session transcripts) jsou generována experimentální infrastrukturou.
Zdrojový kód a experimentální data jsou veřejně dostupná.

---

# Praktická část

Tato kapitola popisuje provedení případové studie. Struktura sleduje
chronologii experimentu: nejprve příprava tří výchozích podkladů
(specifikace, referenční implementace, instrukce), pak pilotní fázi
kde se instrukce opakovaně upravují na základě naměřených metrik,
a nakonec komparativní variace kde z fungující sady systematicky
odebíráme jednotlivé části a měříme dopad.

## Příprava experimentu

Před spuštěním pilotních běhů bylo nutné připravit tři výchozí podklady
každého experimentálního běhu: specifikaci projektu (co má agent
implementovat), referenční implementaci (měřicí nástroj pro
Q2 – referenční test pass rate)
a baseline instrukce (jak má agent pracovat).

### Konstrukce specifikace

Specifikace definuje fixní zadání, které agent dostává v Issue \#1.
Navazuje na metodické vymezení fixních vstupů v sekci [ref:sec:experimentalni-design]:
kromě instrukcí v souboru `AGENTS.md` agent pracuje právě s touto
specifikací a žádný další architektonický návrh nedostává. Issue má dvě
části: **Requirements** (co business potřebuje) a **API Contract**
(co musí implementace exportovat). API kontrakt je současně jediným
technickým omezením implementace a vstupem pro metriku Q1.

Specifikace obsahuje:

    - **25 acceptance criteria** ve formátu Given/When/Then
          s konkrétními hodnotami: eskalační flow (8 stavových
          přechodů), platby, terminální stavy, pause/resume, manuální
          advance, konfigurovatelné timeouty, výpočet pracovních dní
    - **API kontrakt** v TypeScriptu: veřejná funkce
          `process(state, event, now)` vracející nový stav
          a action descriptory; typy pro 12 stavů, 6 událostí,
          3 typy akcí; konfigurační interface pro timeouty a svátky
    - **Doménový slovník**: 9 pojmů definujících business
          doménu (dunning, grace period, business days, action
          descriptor aj.)
    - **Out of scope**: 6 explicitně vyloučených oblastí
          (payment retry, late fees, partial payments, email sending,
          scheduling, persistence)

Specifikace je záměrně stručná a strukturovaná, aby omezovala
interpretační volnost agenta a současně zůstala přímo měřitelná.
Formát Given/When/Then usnadňuje převod požadavků do referenčních testů
(Q2) i mapování acceptance criteria na agentem vytvořené testy
(Q4). Systém je definován jako pure function
`process(state, event, now)`, takže stejné deterministické
rozhraní lze použít napříč všemi běhy pro referenční testy Q2
i mutation testing Q3. Explicitní sekce out of scope navíc
omezuje riziko, že agent rozšíří řešení nad rámec sledovaného zadání.

### Referenční implementace

Referenční implementace slouží jako měřicí nástroj: definuje strop
kvality proti kterému se porovnávají agentovy běhy. Její role
v metrikách popisuje sekce [ref:sec:produktove-metriky].

Testy byly napsány metodou *spec-first TDD* (sekce [ref:sec:testovani-mutation]):
expected values pochází ze specifikace, ne z pozorování kódu.

Výsledná implementace obsahuje 42 behavioral testů pokrývajících
všech 25 acceptance criteria (některá kritéria vyžadují více testových
případů pro hraniční situace), dosahuje mutation score 91{,}9 %.
Kód kompiluje bez typecheck errors, neobsahuje žádné `any`
a má 3 lint warnings (kosmetické, bez vlivu na funkční korektnost).
Metrika Q8 ohodnotila design quality na 3/3
ve všech dimenzích. Tyto výsledky validují, že specifikace je
implementovatelná a že exit kritéria
(sekce [ref:sec:pilotni-iterace]) jsou dosažitelná lidským
vývojářem.

### Konstrukce baseline instrukcí

Baseline verze `AGENTS.md` byla konstruována čistě z literatury.
Cílem bylo vytvořit výchozí bod jehož každá komponenta má opodstatnění
v empirických zjištěních.

Konstrukce proběhla ve třech krocích: odstranění předchozí ad-hoc verze,
návrh struktury podle pořadí komponent popsaných Mao
et al. [mao2025fse] a mapování tří dimenzí chování
(sekce [ref:sec:sada-metrik]) na konkrétní instrukce. Výsledné sekce
(Role, Goal, Specification, Environment, Process, Package Quality,
Constraints) jsou adaptací tohoto rámce na doménu případové studie.

Procesní sekce obsahuje stručné instrukce pro spec-first
TDD [mathews2024], dekompozici do sub-issues, branch-per-issue
a conventional commits. Sekce Package Quality vymezuje očekávání
na modularitu, striktní typování, dokumentaci a čisté veřejné API;
tyto požadavky přímo míří na metriky kvality kódu (Q5–Q8).
Sekce Constraints pak obsahuje explicitní zákazy typu nekombinovat
issues, nemodifikovat existující testy a nepřepisovat git historii.
Výsledný dokument má 53 řádků a \sim350 slov.

Tabulka [ref:tab:mapovani-instrukci] ukazuje mapování jednotlivých
sekcí na metriky a obrázek [ref:fig:baseline-agents] uvádí kompletní
znění.

[FIGURE]

[TABLE]

Table: Mapování sekcí baseline `AGENTS.md` na metriky

\small
[TABLE START]
lll@{}}

**Cíl**  |  **Sekce AGENTS.md**  |  **Metriky** 

Spec-first              |  Specification, Process krok 2  |  P1 
Strukturovaný workflow  |  Process kroky 1–4             |  P2, P3, P4 
TDD                     |  Process krok 2, Constraints    |  P3, P5 
Modulární kód           |  Package Quality               |  Q5, Q7, Q8 
API kompatibilita       |  Specification (API Contract)  |  Q1 
Funkční korektnost      |  Specification (AC)            |  Q2, Q4 

[TABLE END]

[/TABLE]

Specifikace, referenční implementace a baseline instrukce tvoří výchozí
bod experimentu. Následující sekce popisuje průběh
pilotních iterací cyklem
Spuštění/\allowbreak Měření/\allowbreak Diagnóza/\allowbreak Úprava (sekce [ref:sec:pilotni-iterace]).

## Pilotní fáze

Každá iterace sleduje cyklus Spuštění/Měření/Diagnóza/Úprava
(sekce [ref:sec:pilotni-iterace]). U prvního běhu (baseline) uvádíme
kompletní tabulku metrik a podrobnou diagnostiku. U dalších běhů
popisujeme pouze změny oproti předchozí iteraci; souhrnný přehled
všech běhů obsahuje sekce [ref:sec:souhrnne-vysledky].

### Pilot-r1: baseline

První běh s baseline instrukcemi
(příloha [ref:app:baseline-agents-md]), agent MiniMax-M2.5 přes OpenCode,
proběhl v jedné session bez restartů. Tabulka [ref:tab:pilot-r1]
shrnuje naměřené metriky.

[TABLE]

Table: Pilot-r1: naměřené metriky

\small
[TABLE START]
llccl@{}}

**Kód**  |  **Metrika**  |  **Hodnota**  |  **Kritérium**  |  **Splněno?** 

P1  |  Issues before code     |  OK  |  splněno   |  OK 
P2  |  Branch per issue       |  FAIL    |  branches \geq issues  |  FAIL 
P3  |  Test-first commits     |  FAIL    |  test: před feat:  |  FAIL 
P4  |  PRs linked to issues   |  OK  |  všechny PR  |  OK 
P5  |  Existující testy nezměněny  |  FAIL    |  0 změn    |  FAIL 
P6  |  Commit msg quality     |  n/a         |  \geq 2/3  |  n/a 
P7  |  Issue quality          |  3/3         |  \geq 2/3  |  OK 
P8  |  PR quality             |  2/3         |  \geq 2/3  |  OK 
Q1  |  API contract match     |  match       |  match     |  OK 
Q2  |  Ref.\ test pass rate   |  39/42       |  42/42     |  FAIL 
Q3  |  Mutation score         |  84 %      |  \geq 70 %  |  OK 
Q4  |  AC coverage (agentovy testy)  |  23/25  |  25/25     |  FAIL 
Q5  |  Lint warnings          |  2           |  0         |  FAIL 
Q6  |  Typecheck errors       |  0           |  0         |  OK 
Q7  |  Složitost kódu         |  2 viol.     |  0 viol.   |  FAIL 
Q8  |  Design quality         |  1/3         |  \geq 2/3  |  FAIL 

E1  |  Vstup / výstup / \Sigma cache (tis.)  |  115 / 60 / 11528  |  —       |  záznam 
E2  |  Trvání                 |  32{,}7 min  |  —       |  záznam 
E3  |  Stabilita session       |  dokončeno   |  —       |  záznam 

[TABLE END]

[/TABLE]

Ze 10 deterministických metrik splnil agent 4 (P1, P4, Q1, Q6).

**Chování agenta.**
Agent vytvořil 11 GitHub issues a rozložil implementaci do
4 pull requestů, každý s vlastní branch. Zvolil modulární strukturu
(4 soubory: `types.ts`, `businessDays.ts`,
`dunning.ts`, `index.ts`), což odpovídá požadavkům
sekce Package Quality v instrukcích. Napsal 59 vlastních testů,
všechny procházejí.

**Diagnostika.**
Tři procesní metriky z pěti nebyly splněny: agent sloučil 11 issues
do 4 branches (P2), nepoužil oddělené commity pro testy a kód (P3)
a upravil vlastní test aby seděl na implementaci (P5). Ve všech třech
případech agent vybral rychlejší cestu místo té předepsané.

Z referenčních testů selhaly 3 z 42 (Q2), převážně v pause/resume
logice a výpočtu pracovních dní. Q8 = 1/3 kvůli chybějící JSDoc
dokumentaci na veřejném API; ostatní dimenze dosáhly 3/3.

**Změna instrukcí pro r2.**
Čtyři selhání sdílela stejný vzorec: instrukce říkala *co*
má platit, ale neukazovala *jak* to provést. Každé selhání proto
dostalo konkrétní opravu v pracovním postupu:

    - P2: na začátek každého cyklu přidán příkaz
          `git checkout -b issue-N`
    - P3: testy a kód se nově odevzdávají odděleně, nejdřív
          `git add tests/`, pak `git add src/`
    - P5: doplněno pravidlo, že selhávající test po implementaci
          se opravuje v kódu, ne přepisem testu
    - Q7: přidána kontrola
          `npx eslint src/\allowbreak{` –max-warnings 0} před
          otevřením pull requestu

Výřez `git diff` mezi verzemi `AGENTS.md` pro běhy
r1 a r2 ukazuje rozsah těchto změn.

[FIGURE]

### Pilot-r2

Druhý běh ověřoval čtyři změny
instrukcí. Tabulka [ref:tab:pilot-r2-delta] ukazuje metriky kde došlo
ke změně.

[TABLE]

Table: Pilot-r2: metriky s změnou oproti r1

\small
[TABLE START]
llccc@{}}

**Kód**  |  **Metrika**  |  **r1**  |  **r2**  |  **Trend** 

P5        |  Existující testy nezměněny   |  FAIL    |  OK   |  opraveno 
Q2        |  Ref.\ test pass rate    |  39/42       |  32/42        |  horší 
Q3        |  Mutation score          |  84 %     |  68 %       |  pod prahem 
Q5        |  Lint warnings           |  2           |  1            |  zlepšení 
Q7        |  Složitost kódu          |  2 viol.     |  0            |  opraveno 
Q8        |  Design quality          |  1/3         |  1/3          |  beze změny 

E1        |  Vstup / výstup / \Sigma cache (tis.)  |  115 / 60 / 11528  |  76 / 41 / 3196  |  záznam 
E2        |  Trvání                  |  32{,}7 min  |  37{,}2 min  |  záznam 

[TABLE END]

[/TABLE]

**Diagnostika.**
P5 a Q7 byly opraveny, ale P2 a P3 přetrvaly
v jiné podobě než v r1: agent tentokrát testy a kód sloučil do jednoho
commitu s prefixem `test:`. Formálně tedy dodržel konvenci názvu
commitu, ale nesplnil její záměr. Q8 = 1/3 zůstala beze změny,
protože samotný textový požadavek na JSDoc dokumentaci agent
nepřiměl k ověření výsledku.

Q2 a Q3 se zároveň zhoršily (32/42 resp.\ 68 %). Agent
napsal víc testů než v r1, ale horší kvality, pravděpodobně proto, že
je vytvořil hromadně ze specifikace místo postupného test-fix cyklu.
E1 klesla na promptové i výstupní straně, ale pro rozhodnutí
o další úpravě byla podstatná hlavně regrese v testování a dokumentaci.

**Změna instrukcí pro r3.**
Z r2 přetrvaly tři slabiny. Každá dostala vlastní opravu:

    - P2: pracovní postup nově začíná příkazem
          `gh issue list –state open`
    - P3: mezi commit s testy a commit s kódem přibyl kontrolní
          příkaz `git log –oneline -3`
    - Q8: požadavek na JSDoc byl přesunut do kontrolního kroku
          před pull requestem, aby ho agent musel ověřit

Výřez `git diff` mezi verzemi `AGENTS.md` pro běhy r2 a r3
ukazuje rozsah těchto změn.

[FIGURE]

### Pilot-r3

Třetí běh ověřoval tři změny instrukcí z r2: kontrolní příkaz po commitu
s testy, výběr issue přes `gh issue list` a přesun požadavku
na JSDoc do kontrolního kroku před pull requestem.
Tabulka [ref:tab:pilot-r3-delta] ukazuje metriky s výraznou změnou.

[TABLE]

Table: Pilot-r3: metriky s změnou oproti r2

\small
[TABLE START]
llccc@{}}

**Kód**  |  **Metrika**  |  **r2**  |  **r3**  |  **Trend** 

P2  |  Branch per issue          |  FAIL    |  OK   |  opraveno 
P3  |  Test-first commity        |  FAIL    |  OK   |  opraveno 
P6  |  Kvalita commit zpráv      |  2/3         |  3/3          |  zlepšení 
P7  |  Kvalita issue popisů      |  2/3         |  3/3          |  zlepšení 
Q2  |  Ref.\ test pass rate      |  32/42       |  41/42        |  zlepšení 
Q3  |  Mutation score            |  68 %      |  71 %       |  nad prahem 
Q8  |  Design quality            |  1/3         |  3/3          |  průlom 

E1  |  Vstup / výstup / \Sigma cache (tis.)  |  76 / 41 / 3196  |  62 / 30 / 4770  |  záznam 
E2  |  Trvání                    |  37{,}2 min  |  24{,}8 min  |  záznam 
E3  |  Stabilita session          |  dokončeno   |  1 kompakce   |  záznam 

[TABLE END]

[/TABLE]

**Diagnostika.**
Všechny tři změny zabraly. Agent poprvé splnil celý procesní checklist
P1–P5 = 5/5: vytvořil issues před kódem, každý issue dostal vlastní
branch, test commit předcházel kódu, pull requesty obsahovaly
`Closes \#N` a žádný test nebyl dodatečně upraven. Současně
Q8 = 3/3 ukazuje, že přesun požadavku na JSDoc do kontrolního kroku
vedl i k doplnění dokumentace.

Q2 = 41/42: zbývá jedna chyba v implementaci. Specifikace definuje
chování pause/resume jednoznačně: acceptance criteria vyžadují
"elapsed time are preserved" při pauzování a "timeout resumes
from where it left off" při obnovení. API kontrakt navíc poskytuje
pole `pausedElapsed` s komentářem "business days elapsed
before pause". Agent přesto zvolil vlastní přístup (posunutí
`stateEnteredAt` zpět v čase) místo použití pole z kontraktu.
Agentův přístup fungoval pro jedno pozastavení, ale selhal při
opakovaném pause/resume. Spec není nejednoznačná; agent učinil
implementační rozhodnutí navzdory explicitnímu poli v kontraktu.

**Změna instrukcí pro r4.**
Diagnostika r3 odhalila dva problémy, každý s vlastní opravou:

    - Procesní hygiena: do pre-PR checklistu přidán příkaz
          `npx vitest run`, aby agent ověřil, že jeho vlastní
          testy procházejí ještě před otevřením pull requestu
    - Agent nedodržel API kontrakt:\allowbreak{} spec definuje pole
          `pausedElapsed`\allowbreak{} v typu `DunningState`, ale
          agent ho nepoužil a vymyslel vlastní řešení. Do Constraints
          přidáno pravidlo: každé pole v API kontraktu musí\allowbreak{} být
          v implementaci použito [breunig2025]

Výřez `git diff` mezi verzemi `AGENTS.md` pro běhy r3 a r4
ukazuje obě změny: nová položka v pre-PR checklistu a nové pravidlo
v Constraints.

[FIGURE]

### Pilot-r4

Čtvrtý běh ověřoval dvě úpravy: přidání
`npx vitest run` do pre-PR checklistu a pravidlo o dodržení API
kontraktu (každé pole v typech musí být použito v implementaci).
Tabulka [ref:tab:pilot-r4-delta] ukazuje metriky s nejvýraznější změnou.

[TABLE]

Table: Pilot-r4: metriky s změnou oproti r3

\small
[TABLE START]
llccc@{}}

**Kód**  |  **Metrika**  |  **r3**  |  **r4**  |  **Trend** 

P2  |  Branch per issue         |  OK  |  FAIL     |  regrese 
P5  |  Testy nezměněny          |  OK  |  FAIL     |  regrese 
Q2  |  Ref.\ test pass rate     |  41/42       |  39/42        |  horší 
Q3  |  Mutation score            |  71 %     |  n/a          |  n/a 
Q8  |  Design quality           |  3/3         |  2/3          |  horší 

E1  |  Vstup / výstup / \Sigma cache (tis.)  |  62 / 30 / 4770  |  81 / 36 / 5996  |  záznam 
E2  |  Trvání                   |  24{,}8 min  |  25{,}9 min  |  stabilní 
E3  |  Stabilita session         |  dokončeno   |  dokončeno    |  záznam 

[TABLE END]

[/TABLE]

**Diagnostika.**
R4 je regrese oproti r3. Agent vytvořil 7 issues ale zpracoval jen 5;
dva issues zůstaly bez branch (P2 = 4/6). Upravil dva vlastní testové
soubory po implementaci (P5).

Q2 se zhoršilo z 41/42 na 39/42: k přetrvávajícímu elapsed time bugu
přibyly dvě nové chyby (výpočet víkendů v eskalaci a boundary
DUE\_SOON přechodu). Pravidlo o dodržení API kontraktu nepomohlo;
agent pole `pausedElapsed` opět nepoužil. Agentův vlastní test
navíc obsahoval timezone bug a přesto agent mergoval kód, přestože
pre-PR checklist zahrnoval `npx vitest run`.

Regrese ukázala dvě věci důležité pro další iteraci: deklarativní
pravidlo v Constraints nepřineslo zlepšení a stejné instrukce mohou
vlivem nedeterminismu modelu vést k novým chybám. Zbývající selhání
současně nebyla důsledkem nejednoznačné specifikace, ale rozhodnutí
agenta ignorovat pole `pausedElapsed` a nerozložit složitou
funkci `processTick`.

**Změna instrukcí pro r5.**
Návrat k předchozí verzi instrukcí po neúspěšné iteraci je
standardní postup; iterativní cyklus nepředpokládá monotónní
zlepšování [peffers2008]. R5 proto vychází z r3 (ne z r4)
a cílí na dvě zbývající selhání procedurální verifikací. Obě změny
používají stejný vzorec jako předchozí úspěšné opravy: místo
deklarativního pravidla přidáváme verifikační akci do pre-PR checklistu.

    - Q2: do pre-PR
          checklistu přidán krok "verify that every field in the API
          Contract types is read and written in your implementation.
          If a field exists in the type but is unused, fix it before
          opening the PR." Na rozdíl od r4, kde pravidlo bylo
          v Constraints (deklarativní), je verifikace v Process
          (procedurální) [breunig2025]
    - Q5/Q7: agent v r3 spustil
          eslint s vlastním configem, který neobsahoval pravidlo
          `complexity`, dostal nula warningů a kód považoval
          za hotový. Experiment měří Q5/Q7 s fixním configem kde
          complexity pravidlo je. Do instrukcí přidán explicitní
          požadavek: "your ESLint config must include
          `complexity: [warn, 10]`"

Výřez `git diff` mezi verzemi `AGENTS.md` pro běhy r3
a r5 ukazuje obě změny: rozšířený pre-PR checklist o API contract
verifikaci a explicitní complexity pravidlo.

[FIGURE]

### Pilot-r5: verifikace kontraktu

\begingroup
\sloppy
Pátý běh ověřoval změny zavedené po r4. Agent přečetl `AGENTS.md`
(v transcriptu potvrzeno), ale místo
`gh issue create` použil interní plánovací nástroj
(`todowrite`) a implementoval vše v jednom `feat:` commitu
bez issues, branches a pull requestů.

[TABLE]

Table: Pilot-r5: metriky s změnou oproti r3

\small
[TABLE START]
llccc@{}}

**Kód**  |  **Metrika**  |  **r3**  |  **r5**  |  **Trend** 

P2  |  Branch per issue         |  OK  |  FAIL     |  regrese 
P3  |  Test-first commity       |  OK  |  FAIL     |  regrese 
P4  |  PRs linked               |  OK  |  FAIL     |  regrese 
Q2  |  Ref.\ test pass rate     |  41/42       |  38/42        |  horší 
Q5  |  Lint warnings            |  1           |  0            |  opraveno 
Q7  |  Složitost kódu           |  1 viol.     |  0            |  opraveno 

E1  |  Vstup / výstup / \Sigma cache (tis.)  |  62 / 30 / 4770  |  65 / 23 / 3028  |  záznam 
E2  |  Trvání                   |  24{,}8 min  |  13{,}2 min  |  záznam 
E3  |  Stabilita session         |  dokončeno   |  dokončeno    |  záznam 

[TABLE END]

[/TABLE]

**Diagnostika.**
Instrukce r5 se lišily od r3 pouze ve dvou řádcích pre-PR checklistu
(API contract verifikace a ESLint complexity config). Obě cílené opravy
zabraly: Q5 = 0 a Q7 = 0. Agent konfiguroval ESLint s pravidlem
`complexity` a rozložil funkci `processTick`. Opravu
Q5/Q7 tak způsobila jediná konkrétní instrukce:
"your ESLint config must include `complexity: [warn, 10]`".

Přesto agent ignoroval celý Process workflow: žádné issues,
branches ani pull requesty. Analýza transcriptu ukazuje posloupnost:
agent přečetl instrukce (zpráva 4: "I need to decompose the spec
into focused GitHub issues"), v následujícím kroku však místo
`gh issue create` použil interní plánovací nástroj
(`todowrite`) a implementoval vše v jednom `feat:`
commitu. Pre-PR checks (tsc, eslint) přitom dodržel. Agent tedy
selektivně plnil instrukce: jednokrokové příkazy s okamžitým
výstupem ("spusť eslint") ano, vícekrokový workflow ("vytvoř
issue, pak branch, pak test, pak implementuj, pak PR") ne.

Srovnání r3, r4 a r5 ukazuje, že tento vzorec není náhodný.
R3 agent dodržel celý workflow (P1–P5 = 5/5). R4 dodržel částečně
(\sim3/5), vytvořil issues ale ne pro všechny branch. R5 workflow
ignoroval zcela (\sim1/5). Instrukce se přitom mezi r3 a r5 liší
minimálně (2 řádky v pre-PR checklistu).
Data tak naznačují, že nedeterminismus modelu je pro dodržování
vícekrokových sekvencí silnějším faktorem než drobné lokální změny
v pre-PR checklistu.
\endgroup

**Závěr pilotních iterací.**
Pět iterací (r1–r5) přineslo čtyři pozorování:

\begingroup
\setlength{\emergencystretch}{0.5em}

    - **Verifikační kroky fungují spolehlivě.**
          Jednokrokové příkazy s okamžitým výstupem agent dodržoval
          stabilněji než zbytek workflow.
    - **Vícekrokový workflow je nedeterministický.**\par
          Stejná instrukční sada vedla od plného dodržení (r3) přes
          částečné dodržení (r4) až po kolaps workflow (r5).
    - **Deklarativní pravidla byla slabší než procedurální verifikace.**
          Pravidlo v Constraints nepomohlo, zatímco konkrétní kontrolní
          kroky opakovaně vedly ke zlepšení.
    - **Některá implementační rozhodnutí instrukce neopravila.**
          Problém s `pausedElapsed` přetrval i po dalších úpravách,
          přestože specifikace i API kontrakt byly jednoznačné.

\endgroup

Pilotní baseline pro komparativní variace zůstává r3, jediný běh
kde agent workflow dodržel. Komparativní variace testují, které
z těchto pozorování vydrží cílenou ablaci.

Obrázek [ref:fig:diff-r1-r3] ukazuje souhrnnou evoluci instrukcí
od baseline k nejlepší iteraci; bílé řádky zůstaly z r1, zelené
byly přidány během iterací.

[FIGURE]

## Komparativní variace

Pilotní iterace ukázaly, že část zlepšení souvisí s přidáním
konkrétních kontrolních kroků. Zbývá proto otázka, které složky
výsledných instrukcí jsou pro chování agenta nezbytné a které lze
odebrat bez dopadu.

Existující studie měří efekt souboru `AGENTS.md` převážně jako
celku; účinek jednotlivých složek proto zůstává otevřenou otázkou
[lulla2026, gloaguen2025agentsmd]. Naše ablace tuto mezeru
částečně vyplňují na úrovni případové studie.

### Výběr složek pro ablaci

Soubor `AGENTS.md` obsahuje sedm sekcí. Pro účely ablací
rozlišujeme sekce definující *co* implementovat
(Role, Goal, Specification, Environment) a sekce definující
*jak* pracovat a jakou kvalitu produkovat
(Process, Package Quality, Constraints). Odebrání kontextových sekcí
by testovalo jinou otázku než vliv instrukcí na proces a kvalitu.
Constraints zde navíc neablujeme, protože jejich efekt se v pilotních
bězích částečně překrýval s workflow v Process. Proto testujeme dvě
složky, u nichž zůstala největší nejistota: verifikační kroky
v Process a sekci Package Quality.

**Ablace A: bez verifikačních kroků.**
Odebíráme explicitní verifikační příkazy
(`tsc –noEmit`, `npx eslint`,
`git log –oneline -3`), ale ponecháváme workflow
issue \to branch \to test \to implement \to PR
(obrázek [ref:fig:diff-r3-ablace-a]). Cílem je ověřit, zda agent tyto
kontrolní kroky spouští i bez instrukce.

[FIGURE]
\footnotetext{Zelené řádky v diffu neobsahují nový text; vznikly
přečíslováním kroků po odebrání kroku c (Verify).}

*Očekávání:* pokud agent typecheck a lint spustí i bez
instrukce, verifikační kroky jsou redundantní; pokud ne, jde
o klíčový mechanismus jejich účinku.

**Ablace B: bez sekce Package Quality.**
Odebíráme celou sekci Package Quality (modulární
architektura, strict TypeScript, JSDoc dokumentace, čisté veřejné
API). Process a Constraints zůstanou beze změny
(obrázek [ref:fig:diff-r3-ablace-b]).

[FIGURE]

*Očekávání:* pokud Q5, Q7 a Q8 zůstanou na úrovni r3,
jsou konvenční instrukce převážně redundantní s tréninkem modelu;
pokud se zhorší, explicitní konvence v instrukcích přispívají
k celkovému efektu souboru.

### Ablace A: bez verifikačních kroků

Tabulka [ref:tab:ablace-a] shrnuje výsledky dvou běhů (A-1, A-2)
ve srovnání s r3.

[TABLE]

Table: Ablace A: srovnání s r3 (bez verifikačních kroků)

\small
[TABLE START]
llccc@{}}

**Kód**  |  **Metrika**  |  **r3**  |  **A-1**  |  **A-2** 

P1  |  Issues before code         |  OK  |  OK  |  OK 
P2  |  Branch per issue           |  OK  |  OK  |  FAIL 
P3  |  Test-first commits         |  OK  |  OK  |  FAIL 
P4  |  PRs linked to issues       |  OK  |  OK  |  FAIL 
P5  |  Testy nezměněny            |  OK  |  FAIL    |  OK 
P6  |  Commit msg quality         |  3/3         |  2/3         |  2/3 
P7  |  Issue quality              |  3/3         |  2/3         |  3/3 
P8  |  PR quality                 |  3/3         |  3/3         |  1/3 

Q1  |  API contract match         |  match       |  match       |  match 
Q2  |  Ref.\ test pass rate       |  41/42       |  35/42       |  37/42 
Q3  |  Mutation score             |  71 %      |  62 %      |  —^\dagger 
Q5  |  Lint warnings              |  1           |  4           |  3 
Q6  |  Typecheck errors           |  0           |  0           |  0 
Q7  |  Complexity violations      |  1           |  4           |  1 
Q8  |  Design quality             |  3/3         |  2/3         |  2/3 

E1  |  Vstup / výstup / \Sigma cache (tis.)  |  62 / 30 / 4770  |  n/a  |  n/a 
E2  |  Trvání                     |  25 min      |  39 min      |  24 min 
E3  |  Stabilita session           |  dokončeno   |  dokončeno   |  dokončeno 

[TABLE END]

[/TABLE]

^\S Sloupec r3: E1 z pilotního `transcript.json` (62 / 30 / 4770 tis.). U A-1 a A-2 chybí export v lokálním snapshotu; E1 pro tyto běhy nešlo dopočítat.

^\dagger Q3 v A-2 nelze měřit: agentovy vlastní testy selhávají
(test očekává stav `REMINDER\_1`, kód vrací `GRACE`),
Stryker vyžaduje funkční test suite. Bez verifikačních kroků agent
commitl kód s nefunkčními testy.

**Interpretace.**
E1 u ablace nelze dopočítat, protože v lokálním snapshotu chybí
`transcript.json`.
Tabulka [ref:tab:ablace-a] ukazuje pokles napříč metrikami kvality
kódu (Q5, Q7) i funkční korektnosti (Q2, Q3). Bez explicitního
příkazu `npx eslint` agent neprovedl kontrolu kvality před
odevzdáním kódu, což naznačuje, že verifikační kroky nejsou
redundantní; agent je bez instrukce nespouští sám.

Procesní metriky vykazují vzorec známý z pilotních iterací: A-1
dodržel workflow kompletně, A-2 nikoliv. Instrukce se mezi běhy
nelišily; variabilita je důsledkem nedeterminismu modelu,
ne ablace.

Agent bez verifikačních kroků spotřeboval přibližně dvakrát více
testovacích cyklů (44 spuštění `vitest` oproti \sim20
u ablace B). To naznačuje, že verifikační kroky plní kromě kontroly
kvality i druhou funkci: fungují jako checkpointy které strukturují
práci agenta a zabraňují cyklickému debugování.

### Ablace B: bez Package Quality

Tabulka [ref:tab:ablace-b] shrnuje výsledky dvou běhů (B-1, B-2)
ve srovnání s r3.

[TABLE]

Table: Ablace B: srovnání s r3 (bez sekce Package Quality)

\small
[TABLE START]
llccc@{}}

**Kód**  |  **Metrika**  |  **r3**  |  **B-1**  |  **B-2** 

P1  |  Issues before code         |  OK  |  OK  |  OK 
P2  |  Branch per issue           |  OK  |  OK  |  FAIL 
P3  |  Test-first commits         |  OK  |  OK  |  OK 
P4  |  PRs linked to issues       |  OK  |  FAIL    |  OK 
P5  |  Testy nezměněny            |  OK  |  FAIL    |  FAIL 
P6  |  Commit msg quality         |  3/3         |  3/3         |  3/3 
P7  |  Issue quality              |  3/3         |  3/3         |  3/3 
P8  |  PR quality                 |  3/3         |  2/3         |  2/3 

Q1  |  API contract match         |  match       |  match       |  match 
Q2  |  Ref.\ test pass rate       |  41/42       |  37/42       |  11/42 
Q3  |  Mutation score             |  71 %      |  67 %      |  72 % 
Q5  |  Lint warnings              |  1           |  2           |  2 
Q6  |  Typecheck errors           |  0           |  0           |  0 
Q7  |  Complexity violations      |  1           |  1           |  2 
Q8  |  Design quality             |  3/3         |  —^*     |  2/3 

E1  |  Vstup / výstup / \Sigma cache (tis.)  |  62 / 30 / 4770  |  n/a  |  n/a 
E2  |  Trvání                     |  25 min      |  28 min      |  21 min 
E3  |  Stabilita session           |  dokončeno   |  dokončeno   |  dokončeno 

[TABLE END]

[/TABLE]

^* Q8 v B-1: judge nedokončil hodnocení (API timeout).

**Interpretace.**
Stejně jako u tabulky [ref:tab:ablace-a] chybí u ablace export
`transcript.json`; řádek E1 proto zůstává n/a.

Automatizované metriky kvality kódu (Q5, Q6, Q7) zůstaly na podobné
úrovni jako v r3 (tabulka [ref:tab:ablace-b]). Agent produkoval
modulární kód, striktní TypeScript a v B-1 i JSDoc dokumentaci,
přestože instrukce tyto požadavky neobsahovaly. Jediný pokles
zaznamenalo Q8: judge identifikoval chybějící
modularitu (veškerý kód v jednom souboru) a neúplnou dokumentaci.
Data naznačují, že základní kódové konvence jsou u tohoto modelu
řízeny převážně znalostmi z tréninku; strukturální rozhodnutí
(modularita, dokumentace) instrukce pravděpodobně ovlivňují.

Funkční korektnost (Q2) vykazuje extrémní variabilitu: B-1 dosáhl
37/42 (srovnatelné s r3), zatímco B-2 pouze 11/42. Mutation score
zůstal stabilní (67–72 %). Propad Q2 v B-2 není důsledkem ablace
Package Quality, ta neobsahuje žádné instrukce o implementační
logice. Jde o projev nedeterminismu modelu: agent v B-2 implementoval
business day výpočty chybně, což způsobilo kaskádové selhání
eskalačních přechodů. Stejný typ chyby se objevoval i v pilotních
iteracích (r1, r4).

P5 (testy nezměněny) selhalo v obou bězích; agent modifikoval
vlastní testy po implementaci. Stejný problém se objevoval
i v pilotních iteracích (r1, r4) se stejnými instrukcemi,
jde tedy o projev nedeterminismu modelu, ne ablace.

### Závěr komparativní fáze

Dvě ablace testovaly dvě složky instrukcí z r3: verifikační
kroky v Process (ablace A) a sekci Package Quality (ablace B).
Výsledky ukazují odlišný charakter obou složek.

Bez verifikačních kroků (`tsc`, `eslint`)
klesly metriky kvality kódu i funkční korektnosti
(tabulka [ref:tab:ablace-a]). Agent bez kontrolních bodů navíc
spotřeboval přibližně dvakrát více testovacích cyklů. Verifikační
kroky tak v této studii fungují nejen jako kontrola kvality, ale
i jako checkpointy strukturující práci agenta.

Bez sekce Package Quality zůstaly automatizované metriky kvality
(Q5–Q7) na srovnatelné úrovni (tabulka [ref:tab:ablace-b]),
avšak Q8 kleslo ve všech ablačních bězích;
judge identifikoval chybějící modularitu a neúplnou dokumentaci.
Data jsou konzistentní s hypotézou, že základní kódové konvence
jsou u tohoto modelu řízeny znalostmi z tréninku, zatímco
strukturální rozhodnutí instrukce ovlivňují.

Procesní metriky (P1–P5) vykazovaly v obou ablacích variabilitu
srovnatelnou s pilotními iteracemi (r3 vs.\ r4/r5). Tato variabilita
není důsledkem ablace, ale nedeterminismu modelu: instrukce
pro workflow zůstaly v obou ablacích beze změny.

## Souhrnné výsledky

Tabulka [ref:tab:cross-run] shrnuje deterministické metriky všech
běhů: pět pilotních iterací a čtyři ablační běhy. Pilotní sloupce
ukazují evoluci instrukcí, ablační sloupce ukazují dopad odebrání
jednotlivých složek. Baseline pro srovnání je r3, jediný pilotní
běh kde agent splnil celý procesní checklist.
Sloupec E1 uvádí vstup (max.\ na kroku včetně `cache` v exportu),
výstup a součet `cache` přes kroky, vše v tisících; stejný přehled
generuje skript `summary.ts` do `experiments/runs/SUMMARY.md`.

\definecolor{cGood}{HTML}{D1FAE5}    
\definecolor{cMid}{HTML}{FEF3C7}     
\definecolor{cBad}{HTML}{FEE2E2}     
\definecolor{cNeutral}{HTML}{F3F4F6} 

\newcommand{\cmark}{OK}
\newcommand{\xmark}{FAIL}
\newcommand{\cgood}[1]{#1}
\newcommand{\cmid}[1]{#1}
\newcommand{\cbad}[1]{#1}
\newcommand{\cna}[1]{#1}

\begin{landscape}

[TABLE]

Table: Souhrnné výsledky všech běhů (pilot + ablace)

\footnotesize
\begin{tabularx}{\linewidth}{@{}X*{5}{c}|*{2}{c}*{2}{c}@{}}

  |  \multicolumn{5}{c|}{*Pilotní iterace*}  |  \multicolumn{2}{c}{*Ablace A*}  |  \multicolumn{2}{c}{*Ablace B*} 
**Metrika**  |  **r1**  |  **r2**  |  **r3**  |  **r4**  |  **r5**  |  **A-1**  |  **A-2**  |  **B-1**  |  **B-2** 

P1 issues before code    |  \cmark  |  \cmark  |  \cmark  |  \cmark  |  \cmid{?^\dagger}     |  \cmark  |  \cmark  |  \cmark  |  \cmark 
P2 branch per issue      |  \xmark  |  \xmark  |  \cmark  |  \xmark  |  \xmark        |  \cmark  |  \xmark  |  \cmark  |  \xmark 
P3 test-first            |  \xmark  |  \xmark  |  \cmark  |  \cmark  |  \xmark        |  \cmark  |  \xmark  |  \cmark  |  \cmark 
P4 PRs linked            |  \cmark  |  \cmark  |  \cmark  |  \cmark  |  \xmark        |  \cmark  |  \xmark  |  \xmark  |  \cmark 
P5 testy nezměněny       |  \xmark  |  \cmark  |  \cmark  |  \xmark  |  \cmark        |  \xmark  |  \cmark  |  \xmark  |  \xmark 
P6 commit msg            |  n/a   |  \cmid{2/3}   |  \cgood{3/3}   |  \cgood{3/3}   |  \cmid{2/3}     |  \cmid{2/3}   |  \cmid{2/3}   |  \cgood{3/3}   |  \cgood{3/3} 
P7 issue quality         |  \cgood{3/3}   |  \cmid{2/3}   |  \cgood{3/3}   |  \cgood{3/3}   |  \cgood{3/3}^\ddagger  |  \cmid{2/3}   |  \cgood{3/3}   |  \cgood{3/3}   |  \cgood{3/3} 
P8 PR quality            |  \cmid{2/3}   |  \cgood{3/3}   |  \cgood{3/3}   |  \cgood{3/3}   |  \cbad{1/3}   |  \cgood{3/3}   |  \cbad{1/3}   |  \cmid{2/3}   |  \cmid{2/3} 

Q1 API contract          |  match  |  match  |  match  |  match  |  match  |  match  |  match  |  match  |  match 
Q2 ref.\ testy           |  \cmid{39}   |  \cbad{32}  |  \cgood{41}  |  \cmid{39}  |  \cmid{38}   |  \cbad{35}  |  \cmid{37}  |  \cmid{37}  |  \cbad{11} 
Q3 mutation score        |  \cgood{84 %}  |  \cbad{68 %}  |  \cmid{71 %}  |  n/a  |  —  |  \cbad{62 %}  |  —^*  |  \cbad{67 %}  |  \cmid{72 %} 
Q4 AC coverage           |  \cmid{23}   |  \cgood{25}   |  \cgood{25}   |  \cgood{25}   |  \cmid{24}   |  \cgood{25}   |  \cgood{25}  |  \cgood{25}  |  \cmid{23} 
Q5 lint warnings         |  \cbad{2}     |  \cmid{1}       |  \cmid{1}       |  \cmid{1}       |  \cgood{0}       |  \cbad{4}     |  \cbad{3}    |  \cbad{2}    |  \cbad{2} 
Q6 typecheck errors      |  0      |  0      |  0      |  0      |  0      |  0      |  0     |  0     |  0 
Q7 složitost             |  \cbad{2}     |  \cgood{0}       |  \cmid{1}       |  \cmid{1}       |  \cgood{0}       |  \cbad{4}     |  \cmid{1}      |  \cmid{1}      |  \cbad{2} 
Q8 design quality        |  \cbad{1/3}   |  \cbad{1/3}   |  \cgood{3/3}    |  \cmid{2/3}     |  \cmid{2/3}     |  \cmid{2/3}     |  \cmid{2/3}    |  \cmid{2/3}    |  \cmid{2/3} 

E1 in/out/cache (tis.)   |  115/60/11k  |  76/41/3k  |  62/30/5k  |  81/36/6k  |  65/23/3k  |  n/a  |  n/a  |  n/a  |  n/a 
E2 trvání (min)          |  32{,}7      |  37{,}2      |  24{,}8      |  25{,}9      |  13{,}2      |  39          |  24         |  28         |  21 
E3 stabilita session     |  ok    |  ok    |  1 komp.    |  ok    |  ok    |  ok    |  ok   |  ok   |  ok 

\end{tabularx}

\raggedright
^\dagger P1 v r5 nelze určit; agent nevytvořil issues.
^\ddagger P7 v r5: judge hodnotil specifikační issue, ne agentovu.
^* Stryker v A-2 nedokončil analýzu (timeout).
Q4 v uložených judge artefaktech historicky používalo 24bodovou
rubriku. Ve thesis jsou hodnoty převedeny na 25 AC po manuálním
dopočítání AC25 (*custom holiday calendar*).

[/TABLE]

\end{landscape}

Tabulka shrnuje dva hlavní vzorce. V pilotní fázi se instrukce podařilo
iterativně zlepšit: r1 splnila 4/10 tvrdých deterministických kritérií,
r3 po dvou cyklech úprav 7/10. Ablace zároveň ukazují, že ne všechny
složky instrukcí přispívají stejně: odebrání verifikačních kroků
zhoršilo Q2, Q3, Q5 a Q7, zatímco odebrání
sekce Package Quality ponechalo automatizované metriky kvality na
srovnatelné úrovni. Napříč všemi devíti běhy zůstaly stabilní zejména
Q1 a Q6; nejvyšší variabilitu naopak vykazovaly procesní
metriky P2–P5. Interpretaci těchto výsledků ve vztahu
k cílům práce uvádí kapitola [ref:kap:vyhodnoceni].

---

# Vyhodnocení a diskuse

Předchozí kapitola popsala průběh případové studie a naměřená data.
Tato kapitola výsledky interpretuje: nejprve ve vztahu ke třem cílům
práce (sekce [ref:sec:interpretace]), poté v kontextu existujícího
výzkumu (sekce [ref:sec:porovnani-literatura]) a nakonec diskutuje,
jak se metodologická omezení identifikovaná v sekci [ref:sec:omezeni-validita]
projevila v praxi (sekce [ref:sec:limity-vysledky]).

## Interpretace výsledků

Následující tři podsekce hodnotí, do jaké míry případová studie
naplnila cíle stanovené v kapitole [ref:kap:vymezeni]. Vracíme se tím
k hlavnímu problému práce: jak hodnotit a iterativně zlepšovat chování
AI coding agenta v situaci, kdy samotný pass/fail výsledek nestačí pro
praktické rozhodování o použitelnosti řešení.

### Cíl 1: Sada metrik

\textit{Na základě analýzy existujících standardů kvality softwaru
a současných benchmarků pro AI agenty navrhnout sadu metrik
pokrývající proces, kvalitu kódu a efektivitu (dimenze,
které stávající benchmarky neměří).}

Sada 19 metrik byla navržena (kapitola [ref:kap:metodika]) a použita
na devíti bězích (kapitola [ref:kap:prakticka-cast]). Její přínos
nespočívá v tom, že „ukázala nějaká čísla“, ale v tom, že rozšířila
hodnocení agenta za hranici pass/fail výsledku. Právě to bylo potřeba
pro problém vymezený v kapitole [ref:kap:vymezeni]: odlišit řešení,
které jen projde testy, od řešení, které je zároveň vytvořeno
obhajitelným postupem a zanechává použitelný kód.

**Procesní metriky (P1–P8).**
P měří zda agent dodržoval vývojové praktiky (issues, branching,
test-first, PR workflow), tedy dimenzi kterou stávající benchmarky
pokrývají jen okrajově (sekce [ref:sec:hodnoceni-agentu]). Na devíti bězích se ukázaly
jako nejcitlivější složka sady: byly jediné metriky které
kolísaly i mezi běhy se stejnými instrukcemi. Možným vysvětlením
je, že kvalita kódu je u tohoto modelu řízena převážně tréninkovými
daty (Q metriky zůstaly stabilní), zatímco dodržování vícekrokového
postupu (issue \to branch \to test \to implement \to PR)
je inherentně náchylnější k selhání: agent musí udržet sekvenci
kroků v kontextu a každý krok je příležitost k odchylce.
P1–P5 ale říkají jen splněno/nesplněno, což přináší ztrátu nuancí.
Například P3 hlásila v prvních dvou bězích stejný
výsledek "nesplněno", ale z git historie a behaviorálního popisu
bylo vidět, že se chování lišilo: v prvním běhu agent testy nepsal
vůbec, v druhém je psal ale kombinoval s implementací do jednoho
commitu. Odpověď ano/ne řekne *co* nefunguje, ale ne
*proč*. K diagnostice a návrhu opravy instrukcí bylo
vždy nutné doplnit binární metriky o podrobnější analýzu chování
agenta (git historie, `FINDINGS.md`).

Podobně P4 měří *zda* agent vytvořil PR linkovaný na issue,
ale ne *jak kvalitní* ten PR je. P6–P8
(kvalita commit zpráv, issue popisů a PR popisů; hodnocené na škále 1–3) tuto
mezeru doplňují.
V běhu r1 P4 hlásila "splněno" (agent skutečně vytvořil
linkované PR), ale P8 = 2/3 zachytila, že část PR slučovala více
issues do jednoho review artefaktu. Binární a kvalitativní metriky
tedy měří odlišné aspekty téhož procesu a jejich kombinace se ukázala
jako nutná.

Obrázek [ref:fig:variability-process] shrnuje míru splnění exit
kritérií procesních metrik napříč devíti běhy.

\input{generated/variability-process}

**Kvalita kódu (Q1–Q8).**
Na rozdíl od procesních metrik vykazují Q celkově vyšší
stabilitu: Q1 a Q6 byly splněny ve všech devíti bězích,
a Q4 dosáhla ve většině hodnocených běhů plného skóre 25/25.
Data naznačují, že základní kvalita kódu
je u tohoto modelu řízena převážně tréninkovými daty, zatímco
procesní chování závisí na instrukcích výrazněji. Uvnitř skupiny
se ale metriky chovají odlišně podle toho, co měří.

*Korektnost (Q1, Q2).*
Q1 zůstala stabilní ve všech bězích: agent vždy vytvořil
veřejné API odpovídající kontraktu, takže Q1 na této úloze
nepřinesla rozlišení. Q2 je naopak nejvariabilnější produktová
metrika (splněna v 6 z 9 běhů): opakovaně selhávaly testy
pokrývající přechody pause/resume; specifikace i API kontrakt
jednoznačně vyžadují zachování elapsed time (pole
`pausedElapsed`), ale agent toto pole opakovaně ignoroval.
Kontrast mezi Q1 (binární, vždy splněna) a Q2 (poměr
projitých testů, variabilní) ukazuje, že binární metrika nezachytí
problémy které jemnější měření odhalí.

*Testování (Q2–Q4).*
Tři metriky pokrývají testování z různých úhlů: Q2 měří
kolik referenčních testů projde (vyšší = lepší implementace),
Q3 měří jaký podíl injektovaných chyb agentovy testy odhalí
(vyšší = kvalitnější testy) a Q4 měří kolik acceptance
criteria má odpovídající test (vyšší = úplnější pokrytí).

Vztah mezi Q2 a Q3 se ukázal jako nejinformativnější.
V ablačním běhu B-2 agent dosáhl Q2 = 11/42; jeho
implementace byla z velké části chybná. Přesto
Q3 = 72 %, tedy testy které napsal by v korektní
implementaci zachytily většinu injektovaných chyb. Agent tedy uměl
psát kvalitní testy, ale neuměl správně implementovat logiku.
Kdyby sada obsahovala jen jednu z těchto metrik, tento rozdíl by
zůstal skrytý.

Q4 zůstala relativně stabilní: po manuálním doplnění AC25
dosáhla většina hodnocených běhů plného skóre 25/25. Tato metrika ale měří
pouze *přítomnost*
testu na dané AC, ne jeho správnost: agent mohl napsat test
který judge vyhodnotí jako pokrytí, ale který ve skutečnosti
chování neověřuje. Kvalitu testů měří až Q3. Společně tyto
tři metriky tvoří hierarchii: Q4 říká *co* agent
testuje, Q3 *jak dobře*, a Q2 zda implementace
skutečně funguje.

*Čistota a design (Q5–Q8).*
Q5 a Q7 se ukázaly jako citlivé na instrukce: v ablacích
bez sekce Package Quality vzrostl počet lint warnings o přibližně
150 % a počet violations cyklomatické složitosti obdobně.
Q6 naproti tomu zůstala nulová ve všech bězích.
Statické typování poskytuje modelu explicitní vodítka přímo
v kódu: typy parametrů, návratové hodnoty a rozhraní jsou
součástí trénovacích dat a model je při generování dodržuje.
U dynamicky typovaných jazyků by Q6 pravděpodobně
rozlišovala lépe.

Q8 doplňuje automatizované metriky o strukturální pohled na kód.
Hodnocení provádí LLM-as-judge na základě rubriky s pěti dimenzemi:
naming, separation of concerns, idiomatický TypeScript, dokumentace
a složitost.
V pilotních bězích Q8 opakovaně identifikovala chybějící
dokumentaci: r1 a r2 dostaly 1/3 (žádné JSDoc), r4 a r5 dostaly
2/3 (dokumentace jen na hlavním API, ne na utility funkcích).
Teprve po přidání explicitního verifikačního kroku do instrukcí
(r3) agent dokumentaci doplnil (3/3). V ablačních bězích klesla
navíc dimenze separation of concerns: agent soustředil kód do
jednoho souboru. Automatizované metriky
Q5–Q7 přitom žádný z těchto problémů nehlásily.
Kombinace det a qual tak zachycuje víc než
kterýkoliv typ sám.

Obrázek [ref:fig:variability-quality] shrnuje míru splnění exit
kritérií produktových metrik napříč devíti běhy.

\input{generated/variability-quality}

**Efektivita (E1–E3).**
E1 ukázala užitečný vzorec: bez verifikačních kroků agent
spotřeboval přibližně dvakrát více testovacích cyklů, což se
projevilo na vyšší spotřebě tokenů. E2 závisí převážně na
rychlosti poskytovatele API (rate limity, latence), ne na kvalitě
agentovy práce; nejkratší běh (r5, 13 min) vznikl tím, že agent
ignoroval celý pracovní postup. E2 je proto nutné číst
společně s procesními metrikami.

E3 na této úloze přinesla jen malé rozlišení: sessiony byly
většinou dostatečně krátké
na to, aby se vešly do kontextového okna. Pro rozsáhlejší projekty
by E3 pravděpodobně rozlišovala lépe.

Při orientačním přepočtu na cenu (ceník poskytovatele Alibaba
Cloud Model Studio) se ukázalo, že vyšší spotřeba tokenů
nekoreluje s lepším výsledkem: nejlevnější běh (r3, přibližně
\0,17) dosáhl nejlepších metrik (Q2 = 41/42,
P1–P5 = 5/5), zatímco nejdražší běh (r4, přibližně 
\0,64) měl horší výsledky. Agent v r4 spotřeboval víc tokenů
na cyklické debugování, ne na kvalitnější práci
(obrázek [ref:fig:scatter-cost-perf]).

\input{generated/scatter-cost-performance}

**Shrnutí a reflexe.**
Sada se ukázala jako proveditelná pro opakované měření:
det se extrahují automatizovaně, qual hodnotí
LLM-as-judge s fixní rubrikou. Jedno kompletní měření trvá řádově
minuty, což umožňuje zpětnou vazbu v rámci jedné iterace.

Kritický pohled na design sady odhaluje několik slabých míst.
Tři metriky (Q1, Q6, E3) nepřinesly na této
úloze žádné rozlišení; jsou pojistkou pro jiné úlohy nebo
jazyky, ale na devíti bězích zabíraly místo bez informačního
přínosu. Procesní metriky přinesly nejvíc nových poznatků
(nestabilita chování kterou produktové metriky nezachytily),
ale jsou zároveň nejméně spolehlivé: kolísají i mezi běhy se
stejnými instrukcemi, takže u jednoho běhu jim nelze plně věřit.
Binární P1–P5 navíc ztrácí nuance: "nesplněno"
neříká *proč* a k diagnostice bylo vždy nutné vrátit se
k transcriptu agenta. Kvalitativní metriky (Q4, Q8)
zachytily problémy které automatizované nevidí, ale bez validace
Cohenovým \kappa zůstávají podpůrnými indikátory. Metriky
efektivity byly na této úloze nejslabší skupinou: pouze E1
přinesla použitelný insight.

### Cíl 2: Iterativní postup

\textit{Na případové studii demonstrovat iterativní postup návrhu
instrukcí řízený těmito metrikami a vyhodnotit, zda a jak vede
k měřitelným změnám v dodržování vývojových praktik.}

Případová studie ukazuje, že tento postup lze na jednom projektu
prakticky použít a že může vést k měřitelnému zlepšení, nikoli však
že stejný efekt nastane obecně. Postup vedl k měřitelnému zlepšení,
ale ne monotónnímu. Baseline (r1) splnila čtyři z deseti tvrdých
deterministických procesních a produktových kritérií; po dvou cyklech
úprav (r3) agent splnil sedm z deseti. Regrese r4 (pět z deseti)
ukázala, že zlepšení není trvalé: po neúspěšné iteraci bylo nutné
vrátit se k předchozí verzi instrukcí (r5 vycházel z r3, ne z r4).

Metriky poskytly vodítka kam zasáhnout: tabulka metrik ukázala
která kritéria agent nesplnil a behaviorální popis
z `FINDINGS.md` popsal co agent konkrétně udělal. K pochopení
*proč* agent zvolil daný postup však bylo většinou nutné
nahlédnout i do transcriptu agenta. Diagnostika se tak opírala
o kombinaci kvantitativních dat a kvalitativní analýzy chování.

Analýza průběhu iterací odhalila opakující se vzorec na spektru
operacionalizace instrukcí. Obrázek [ref:fig:operacionalizace]
ukazuje, jak se tři nezávislá selhání vyvíjela přes stejné fáze:
pravidlo (agent ignoruje) \to příkaz (agent obchází) \to
verifikační krok (agent dodržuje).

[FIGURE]

Tento vzorec se zopakoval u všech tří selhání. R4 řešilo dosud neadresovaný problém Q2
přidáním pravidla do Constraints ("every field in API contract must
be used"), tedy nejslabšího typu instrukce na spektru. Výsledek
byl regrese. Data jsou konzistentní s hypotézou, že verifikační
kroky jsou účinnější než pravidla, ale při pěti bězích to nelze
statisticky potvrdit.

Postup měl i slepá místa. Q2 zůstalo nesplněné ve všech pěti
bězích (maximum 41/42): agent opakovaně implementoval
pause/resume posunem timestampu místo použití pole
`pausedElapsed` z API kontraktu. Pravděpodobným vysvětlením
je, že posun timestampu je v trénovacích datech častější pattern
než explicitní pole pro elapsed time; navíc název
`pausedElapsed` neříká že hodnota musí přetrvat ve stavu
i po resume. Úpravou instrukcí se tento problém nepodařilo
adresovat; jde o implementační rozhodnutí na úrovni kde
instrukce typu pravidlo ani verifikační krok nestačí. Podobně nelze
vyloučit, že některé regrese v r4 byly vedlejším efektem úprav
cílených na jiné metriky; nedeterminismus modelu a malý počet
běhů neumožňují odlišit kauzální efekt úpravy od náhodného šumu.

Z hlediska praktické proveditelnosti: každá iterace trvala 25–40
minut (běh agenta) plus řádově desítky minut na diagnostiku
a úpravu instrukcí. Diagnóza se opírala o tabulku metrik,
behaviorální popis z `FINDINGS.md` a analýzu transcriptu
agenta. Zjištěný vzorec na spektru operacionalizace
(pravidlo \to příkaz \to verifikační krok) považujeme za
jeden z hlavních poznatků práce, ale vychází z jedné případové
studie s jedním modelem; jeho platnost pro jiné modely a typy
úloh vyžaduje další výzkum.

### Cíl 3: Ablace

\textit{Z instrukcí vytvořených v cíli 2 prozkoumat ablacemi, které
složky přispívají k měřenému chování agenta a které jsou
redundantní.}

Sekce [ref:sec:zaver-ablaci] shrnuje výsledky obou ablací.
Verifikační kroky (ablace A) přispívají: bez nich klesly metriky
kvality i korektnosti. Sekce Package Quality (ablace B) je pro
automatizované metriky převážně redundantní: Q5, Q6
a Q7 zůstaly na srovnatelné úrovni; pouze Q8 zachytila
pokles v modularitě a dokumentaci.

Co tyto výsledky znamenají pro cíl 3? Ablace rozlišily dva typy
složek instrukcí. V této případové studii mají verifikační kroky
zjevný instrumentální přínos: bez explicitní instrukce agent
kontrolní příkazy nespouštěl spolehlivě. Kódové konvence agent
dodržuje i bez instrukce, pravděpodobně ze znalostí z tréninku;
instrukce ale ovlivňují strukturální rozhodnutí (modularita,
dokumentace) která automatizované metriky nezachytí.

Variabilita procesních metrik byla v ablacích srovnatelná
s pilotními iteracemi, přestože instrukce pro workflow zůstaly beze
změny. Data naznačují, že procesní compliance je u tohoto modelu
stochastická vlastnost, kterou instrukce ovlivňují jen částečně.
Variabilita mezi B-1 (Q2 = 37/42) a B-2 (Q2 = 11/42)
ukazuje, že nedeterminismus modelu může být silnějším faktorem než
efekt ablace; při dvou bězích per variaci nelze oba faktory
spolehlivě odlišit.

**Reflexe designu ablací.**
Vzorec operacionalizace (pravidlo \to příkaz \to verifikační
krok), identifikovaný v cíli 2, jsme pojmenovali až při analýze
pilotních dat; výběr ablací mu předcházel. Zpětně je zřejmé, že
u ablace A byl pokles metrik do značné míry předvídatelný:
`npx eslint` a `git log` jsme do instrukcí přidali
v pilotních iteracích právě proto, že bez nich metriky selhávaly.
Novým poznatkem byla dvojí funkce verifikačních kroků: kromě
kontroly kvality strukturují práci agenta a zabraňují cyklickému
debugování (sekce [ref:sec:ablace-a]). Informativnější by byla
ablace Constraints nebo workflow struktury, kde výsledek z pilotů
předvídatelný není. To zůstává námětem pro další výzkum.

## Porovnání s literaturou

### Srovnání metrického rámce

Literatura shrnutá v kapitole [ref:kap:teorie] ukazuje, že hodnocení
AI coding agentů je stále silně orientováno na funkční výsledek.
SWE-bench a jemu podobné benchmarky jsou postaveny především na
pass/fail logice. Právě proti tomuto omezení vystupují novější
empirické práce: METR [metr2026] ukazuje, že část patchů, které
projdou testy, by nebyla přijata při code review; Li
et al. [li2026beyondbugfixes] dokládají, že ani sloučený pull
request negarantuje udržovatelný kód; a Ehsani
et al. [ehsani2026failedprs] ukazují, že neúspěch agentních PR
není jen otázkou chyb v implementaci, ale i procesních selhání.

Naše sada metrik je s těmito zjištěními konzistentní. Funkční
korektnost zůstává nutnou složkou hodnocení, ale sama nestačí.
V naší případové studii právě procesní metriky ukázaly informaci,
kterou by výsledkové benchmarky samy nezachytily: běhy se stejnými
nebo podobnými produktovými výsledky se lišily v tom, zda agent
vytvořil auditovatelný pracovní postup. Produktové metriky naopak
ukázaly, že ani kvalitní procesní artefakty samy nezaručují správnou
implementaci. Přínos rámce P/Q/E tedy nespočívá jen v rozšíření
počtu měřených veličin, ale v tom, že umožňuje sledovat různé druhy
selhání odděleně a pak je znovu spojit při interpretaci.

Odlišnost vůči existujícím benchmarkům je i v tom, že metriky zde
nejsou jen evaluačním výstupem, ale i řídicím nástrojem pro další
iteraci. To je důležité pro hlavní problém práce: nestačí vědět, že
agent selhal nebo uspěl, pokud z výsledku neplyne, jak instrukce
upravit. V tomto smyslu je náš rámec bližší praktickému diagnostickému
nástroji než klasickému benchmarku.

### Vliv instrukcí na chování agenta

Studie o instrukčních souborech zatím většinou měří jejich přítomnost
nebo absenci jako celek. Lulla et al. [lulla2026] spojují
`AGENTS.md` s nižším mediánovým runtime, zatímco Gloaguen
et al. [gloaguen2025agentsmd] ukazují jen marginální přínos
generických repository-level souborů a upozorňují na vyšší náklady.
SkillsBench [skillsbench2025] dále rozlišuje mezi kurátorovanou
a automaticky generovanou instrukční podporou a ukazuje, že rozhodující
je kvalita a relevance obsahu. Naše výsledky jsou s těmito zjištěními
kompatibilní: ne všechny složky instrukčního souboru přispívají stejně.

Nejvýraznější efekt měly v naší studii verifikační kroky. Ablace A
ukázala pokles jak ve funkční korektnosti, tak v automatizovaných
metrikách kvality kódu, když byly explicitní kontroly odstraněny.
To doplňuje pozorování Breuniga [breunig2025], že opakování
ignorované instrukce nepomáhá a účinnější je její přestrukturování do
pracovního postupu. Pilotní iterace v našich datech ukázaly stejný
vzorec: obecné pravidlo nestačilo, konkrétní příkaz pomohl jen
částečně a stabilnější zlepšení přinesl až verifikační krok. Tento
vývoj je konzistentní i s výzkumem specificity instrukcí, podle něhož
vyšší konkrétnost pomáhá zejména u procedurálních úloh, ale přílišný
detail může omezovat flexibilitu modelu [kim2025detail, zi2025specificity].

Sekce Package Quality se chovala odlišně. Její odebrání nezhoršilo
automatizované metriky stejným způsobem jako odebrání verifikačních
kroků, ale projevilo se v designové kvalitě hodnocené
LLM-as-judge. Data jsou proto konzistentní s tím, že část instrukcí
nefunguje primárně jako přímé vynucení chování, ale jako rámec, který
aktivuje latentní znalosti modelu. V tomto ohledu je užitečná analogie
s promptingem: minimální nápověda může vyvolat žádoucí chování i bez
detailního skriptu [wei2022cot, min2022rethinking]. V naší studii
tak vznikají dvě funkce instrukcí: verifikační kroky vynucují měřitelné
požadavky, zatímco obecnější konvence podporují designová rozhodnutí.

Zároveň ale platí, že vliv instrukcí nelze od nedeterminismu modelu
oddělit dokonale. Razavi a Fard [razavi2025] upozorňují na vysokou
citlivost modelů na drobné změny promptu a naše pilotní i ablační běhy
tento problém potvrzují. Proto je třeba naše výsledky číst jako
indikativní syntézu na úrovni případové studie: ukazují, které typy
instrukcí se v tomto prostředí osvědčily, ale neprokazují univerzální
kauzální zákon.

## Omezení a jejich dopad

Sekce [ref:sec:omezeni-validita] identifikovala metodologická
omezení designu studie předem. Zde ukazujeme, jak se tato omezení
projevila v naměřených datech, a popisujeme omezení která se
objevila až v průběhu experimentu. Omezení řadíme podle toho, co
ohrožují: nejprve sílu závěrů, pak spolehlivost měření a nakonec
rozsah platnosti výsledků.

**Nedeterminismus a prompt sensitivity.**
Pět binárních procesních metrik P1–P5
(splněno/nesplněno) kolísalo od 5/5 (r3) přes \sim3/5 (r4) po
\sim1/5 (r5), přestože procesní instrukce v těchto bězích
zůstaly stejné. R4 přidalo dva řádky do Constraints a procesní
compliance se zhoršila, přestože žádná změna přímo necílila na
workflow; Razavi a Fard [razavi2025] tento jev popisují jako
prompt sensitivity. Alternativním vysvětlením je efekt kumulace
instrukcí: s rostoucím počtem instrukcí klesá pravděpodobnost
dodržení všech současně. Instrukce rostly z r1 (baseline) do r5;
část poklesu compliance může být tímto efektem, ne jen citlivostí
na formulaci.

Dva běhy na ablační variaci tento problém zmírňují, ale
neposkytují statistickou sílu. Pokud oba běhy téže ablace ukazují
stejný směr, je pravděpodobnější že jde o efekt ablace, ne
o náhodu. Například Q5 v ablaci A: oba běhy hlásily 4 a 3
lint warnings, zatímco r3 (plné instrukce) hlásil 1. Shoda obou
běhů zvyšuje důvěru, že odebrání sekce Process skutečně ovlivnilo
Q5. Naopak Q2 v ablaci B: jeden běh dosáhl 37/42
projitých testů, druhý jen 11/42. Tak velký rozptyl mezi dvěma
běhy se stejnými instrukcemi znamená, že rozdíl oproti r3 mohl
být způsoben nedeterminismem modelu, ne ablací. Výsledky ablací
proto interpretujeme jako indikace, ne jako statisticky podložené
závěry. V kombinaci s vedlejšími efekty popsanými výše (r4) to
znamená, že každá úprava instrukcí vyžaduje měření celé sady
metrik, ne jen těch na které úprava cílila.

**Efekt učení autora.**
Zlepšení mezi iteracemi (r1: 4/10 deterministických kritérií,
r3: 7/10) nemusí plynout jen z lepších instrukcí. Autor se
v průběhu iterací učil diagnostikovat selhání a formulovat opravy.
Tento efekt nelze od efektu instrukcí oddělit; diagnostická fáze
(výběr příčiny selhání a návrh opravy) závisí výhradně na
autorovi a nezávislé ověření nebylo provedeno. Částečnou mitigací
je použití strukturovaného diagnostického rámce
(sekce [ref:sec:pilotni-iterace]): diagnóza se opírala o naměřená
data a literaturou podložené principy, ne o intuici. Přesto nelze
vyloučit, že zkušenější autor by z téhož baseline dosáhl lepších
výsledků rychleji.

**Změny konfigurace mezi běhy.**
Běhy r1–r2 proběhly bez kontejnerové izolace, od r3 běží agent
v Docker kontejneru. Od r4 byla změněna konfigurace modelu
(parametry kontextového okna). Tyto změny jsou potenciálním
zavádějícím faktorem: regrese r4 mohla být částečně způsobena změnou
konfigurace, ne pouze přidáním dvou řádků do Constraints. Hlavní
proměnné (model, instrukce, specifikace) zůstaly konzistentní.
Temperature modelu nebyla explicitně nastavena; experiment používal
výchozí konfiguraci poskytovatele.

**Tiché ukončení nástroje.**
Při ablačních bězích se OpenCode v některých případech tiše
ukončil uprostřed práce agenta. Běhy s vyšší spotřebou
kontextového okna (ablace A: \sim44 spuštění testů oproti
\sim20 u ablace B) byly postiženy častěji. Postižené běhy
byly opakovány. Pravděpodobnou příčinou je běh agenta uvnitř
Docker kontejneru (spojení s API poskytovatele, limity paměti
nebo síťové timeouty), ale příčina nebyla potvrzena.

**Nerozlišující metriky.**
Q1, Q6 a E3 nepřinesly na této úloze žádné
rozlišení. Q1 byla splněna a Q6 zůstala nulová ve
všech devíti bězích; E3 nezaznamenala žádnou kompakci
kontextu. Pravděpodobným vysvětlením je design úlohy: specifikace
poskytuje explicitní TypeScript typy (Q1, Q6) a úloha
je dostatečně malá na to, aby se kontext nezaplnil (E3).

**Kvalitativní metriky bez validace.**
Hlavní závěry studie stojí na det. qual slouží
jako podpůrné indikátory, protože jejich spolehlivost nebyla
validována proti lidskému hodnocení (Cohenovo \kappa). Jedinou
z nich, na které stojí netriviální závěr, je Q8: jako jediná
metrika zachytila pokles designové kvality v ablacích, který
det nehlásily. Bez \kappa validace ale nelze sílu
tohoto závěru plně posoudit.

**Kontrolované podmínky vs.\ reálný vývoj.**
Experiment probíhal v kontrolovaném prostředí: prázdný repozitář,
jedna úloha s kompletní specifikací, fixní sada metrik. Reálný
vývoj zahrnuje nejednoznačné požadavky, měnící se specifikace
a integraci s existujícím kódem. Instrukce optimalizované pro
kontrolované podmínky (verifikační kroky, explicitní příkazy)
nemusí fungovat v prostředí kde specifikace není kompletní nebo
se mění v průběhu práce.

**Jeden model, jeden nástroj, jeden projekt.**
Omezení plynoucí z jednoho modelu, jednoho projektu
a deterministické specifikace diskutuje
sekce [ref:sec:omezeni-validita]. V praxi se tato omezení
projevila zejména u P: variabilita neumožňuje odlišit efekt
instrukcí od nedeterminismu modelu bez většího počtu běhů.
Výsledky jsou navíc specifické pro OpenCode a model MiniMax-M2.5;
jiné nástroje (GitHub Copilot, Cursor, Claude Code) mohou
zpracovávat instrukční soubory odlišně. Zda by instrukce fungovaly
stejně na projektech s vyšší nejednoznačností specifikace, na
jiných modelech nebo s jinými nástroji, zůstává otevřenou otázkou
(sekce [ref:sec:dalsi-vyzkum]).

## Doporučení pro praxi

Následující doporučení vycházejí z pilotních iterací a ablací
popsaných v kapitole [ref:kap:prakticka-cast]. Konkrétní čísla a prahy
platí pro tento model a typ projektu; přenositelný je iterační
postup (měř \to diagnostikuj \to uprav \to měř znovu)
a principy strukturování instrukcí.

**Požadavky na kvalitu operacionalizovat jako verifikační kroky.**
V pilotních iteracích se opakoval vzorec: obecné pravidlo ("každé
pole musí být použito") agent ignoroval, zatímco explicitní příkaz
s okamžitou zpětnou vazbou (`npx eslint`, \texttt{tsc
–noEmit}) dodržoval spolehlivě i v bězích kde ignoroval zbytek
pracovního postupu (sekce [ref:sec:ablace-a]). Breunig [breunig2025]
formuloval stejný princip: když agent instrukci ignoruje, nepomůže
ji zopakovat, je třeba ji převést na konkrétní akci. Spektrum
operacionalizace shrnuté na obrázku [ref:fig:operacionalizace]
(nápověda \to pravidlo \to příkaz \to verifikační krok)
odpovídá pozorovanému chování: čím blíže je instrukce verifikovatelnému
příkazu, tím spolehlivěji ji agent v této případové studii dodržoval. Doporučení: každý měřitelný požadavek na kvalitu převést na
konkrétní příkaz v pre-PR checklistu. Účinnost tohoto postupu
v naší studii závisela na tom, že pro požadavky na kvalitu kódu
existují deterministické nástroje s jednoznačným výstupem; u požadavků
kde takový nástroj neexistuje (srozumitelnost dokumentace, kvalita
dekompozice) je dosažitelná míra operacionalizace nižší
(sekce [ref:sec:dalsi-vyzkum]).

**Rozlišovat verifikaci a aktivaci.**
Ablace naznačují dva odlišné mechanismy účinku instrukcí.
Odstranění verifikačních kroků (ablace A) vedlo k poklesu
Q2 z 41/42 na 35–37/42 a nárůstu Q5 z 1 na 3–4
varování (sekce [ref:sec:ablace-a]): bez explicitní kontroly
agent chyby nevyhledával. Odstranění konvencí kvality kódu
(ablace B) naopak det ponechalo beze změny, ale
Q8 kleslo z 3/3 na 2/3; podrobnosti uvádí sekce [ref:sec:ablace-b].
Konvence zřejmě nepůsobí jako vynucení, ale jako aktivace
latentních znalostí modelu. Doporučení: verifikační kroky
se v této případové studii ukázaly jako klíčové; konvence kvality
kódu byly pro automatizované metriky převážně redundantní, ale pro
architektonická a designová rozhodnutí mohly mít hodnotu
jako nápověda. Závěr o designové kvalitě zde stojí na Q8,
tedy na podpůrné judge-based metrice bez \kappa validace, a je
proto nutné jej číst opatrně.

**Počítat s nedeterminismem a měřit proces.**
Agent dodržoval verifikační příkazy deterministicky, ale
vícekrokový pracovní postup
(issue \to branch \to test \to PR) nedeterministicky:
pilotní běh r3 dosáhl P1 = 5/5, běh r5 při téměř
identických instrukcích P1 = \sim1/5
(sekce [ref:sec:limity-vysledky]). Na úrovni výsledku
(Q2) přitom rozdíl nemusel být patrný. P
zachytily problém, který Q samy o sobě neodhalily.
Doporučení: nespoléhat na jednorázové ověření výstupu;
zavést měřitelná exit kritéria pokrývající proces i kvalitu
a kontrolovat je opakovaně.

**Iterovat na základě dat.**
Přínos této práce nespočívá v konkrétní instrukční sadě,
ale v postupu jejího návrhu: naměřit metriky, diagnostikovat
příčinu selhání, provést cílenou úpravu instrukcí a změřit
znovu (sekce [ref:sec:pilotni-iterace]). Tento cyklus je
přenositelný nezávisle na modelu a projektu. Podmínkou je
sada metrik pokrývající více dimenzí (proces, kvalitu, efektivitu),
protože jednodimenzionální měření (např. jen test pass rate)
může zakrýt problém v jiné dimenzi
(sekce [ref:sec:interpretace]).

Praktický důsledek je přímočarý: místo delšího a obecnějšího
instrukčního souboru je účelnější budovat kratší, měřitelný pracovní
postup s jasnými verifikačními body a opakovaně ho ladit podle dat.

## Náměty pro další výzkum

Případová studie otevřela několik otázek, které přesahují rozsah
této práce.

**Nedeterminismus vícekrokového pracovního postupu.**
Agent dodržoval verifikační příkazy (jednokrokové akce)
deterministicky, ale vícekrokový pracovní postup
(issue \to branch \to test \to implement \to PR)
nedeterministicky: r3 kompletně, r5 vůbec, při téměř identických
instrukcích. Možná vysvětlení zahrnují ztrátu pozornosti
v dlouhém kontextovém okně, stochastickou volbu mezi
strukturovaným a nestrukturovaným vývojem z tréninku modelu
a pozici instrukce v kontextu. Granulární ablace pracovního postupu
(které kroky jsou kritické?) a opakované běhy se stejnými
instrukcemi by tento fenomén pomohly lépe pochopit.

**Kontinuita práce mezi agenty.**
P měří transparentnost artefaktů
(issues, commit zprávy, PR popisy). Otevřená otázka: stačí tato
transparentnost k tomu, aby jiný agent (nebo člověk) navázal na
rozpracovaný projekt? Testování handoff scénářů by ověřilo, zda
procesní instrukce vytváří nejen pozorovatelný, ale i přenositelný
pracovní kontext.

**Automatizace iteračního postupu.**

Fáze Diagnóza a Úprava jsou v této práci prováděny manuálně
autorem. Frameworky jako PromptWizard [agarwal2024promptwizard]
a Prompt Alchemy [promptalchemy2025] ukazují, že cyklus
analýzy selhání a návrhu úprav lze automatizovat. Kombinace
automatizovaného prompt optimizeru s metrikami P/Q/E by umožnila
rychlejší iteraci bez manuální diagnózy.

**Ingestion checkpoint.**
Pilotní data ukazují, že agent instrukce přečte (v transcriptu
cituje jejich obsah), ale ne vždy je aktivuje jako řídicí smyčku
běhu. Místo pracovního postupu z `AGENTS.md` použije vlastní
postup odvozený ze specifikace. Ověřitelný checkpoint na začátku
běhu (agent musí explicitně potvrdit přečtení a aktivaci
pracovního postupu před prvním zápisem kódu) by mohl tento problém
adresovat.

**Mechanismy účinku instrukcí a unfaithful reasoning.**

Naše data naznačují dva odlišné mechanismy: *vynucení*
(verifikační kroky přímo kontrolují výstup) a *aktivace*
(obecné konvence připomínají modelu znalosti z tréninku). Analogie
existuje v prompt engineeringu: chain-of-thought prompting ukazuje,
že minimální nápověda může aktivovat komplexní latentní schopnost
modelu efektivněji než detailní instrukce. Systematický experiment
s odstupňovanou specificitou instrukcí, od nápověd ("piš
modulární kód") přes pravidla ("každé pole musí být použito")
po verifikační kroky ("spusť `tsc`, oprav chyby"), by
mohl identifikovat, která míra konkrétnosti je pro který typ
požadavku optimální. Otevřená je i otázka, zda se toto optimum
posouvá se schopnostmi modelu; lepší modely by mohly potřebovat
méně specifické instrukce (analogicky k expertise reversal effect
v kognitivní psychologii, kde instrukce účinné pro nováčky
zpomalují experty).

**Generalizovatelnost verifikačních kroků.**
Účinnost verifikačních kroků v naší studii závisela na existenci
deterministických nástrojů (`eslint`, `tsc`, test
runner), které produkují jednoznačný výstup zpět do kontextu
agenta. Kódování je v tomto ohledu specifická doména: většina
požadavků na kvalitu má odpovídající nástroj. U jiných typů
úloh (dokumentace, architektonická rozhodnutí, plánování) takové
nástroje neexistují a operacionalizace se zastaví na úrovni
pravidla nebo příkazu bez externího feedbacku. Otevřená otázka
je, zda principy operacionalizace platí i mimo kódování, nebo
zda je jejich účinnost podmíněna dostupností deterministické
zpětné vazby.

**Rozšíření na další modely a projekty.**
Výsledky platí pro jeden model (MiniMax-M2.5) a jeden typ projektu
(deterministická business logika). Replikace s jinými modely,
nedeterministickými doménami (UI, strojové učení) a většími
projekty by ukázala, které poznatky jsou přenositelné a které
specifické pro tento případ. Zvláště zajímavá je otázka projektů
s vyšší nejednoznačností specifikace (sekce [ref:sec:limity-vysledky]),
kde by obecnější instrukce (enabling constraints) mohly být
efektivnější než detailní příkazy.

---

# Závěr

Tato práce navrhla sadu metrik a iterativní postup pro systematické
navrhování a vyhodnocování instrukcí pro AI coding agenty a ablacemi
prozkoumala vliv jednotlivých složek instrukcí. Všechny tři cíle
byly ověřeny na případové studii systému upomínek faktur, která
zahrnovala pět pilotních iterací a čtyři ablační běhy.

Prvním cílem bylo navrhnout sadu metrik pokrývající proces
a kvalitu práce agenta, ne jen výsledek. Výsledná sada 19 metrik
pokrývá tři dimenze odvozené z taxonomie Fentona a Biemana.
Procesní metriky odhalily problémy, které výsledkové metriky samy
o sobě nezachytily: běh s téměř plným skóre funkčních testů
vykazoval nestabilní procesní compliance. Kombinace deterministických
a kvalitativních metrik přinesla komplementární pohled, protože
každý typ zachycuje jinou dimenzi chování agenta.

Druhým cílem bylo iterativním postupem navrhnout instrukce, které
dovedou agenta k dodržování stanovených exit kritérií. Cyklus
měření, diagnózy a úpravy vedl k měřitelnému zlepšení, ale ne
monotónnímu: jedna iterace způsobila regresi, po které bylo nutné
vrátit se k předchozí verzi instrukcí. Opakujícím se vzorcem
úspěšných úprav bylo nahrazení obecného pravidla konkrétním
příkazem s verifikačním krokem. Účinnost tohoto postupu závisela
na dostupnosti deterministických nástrojů s jednoznačným výstupem;
u požadavků bez takového nástroje je dosažitelná míra
operacionalizace nižší.

Třetím cílem bylo ablacemi prozkoumat, které složky instrukční
sady přispívají k měřenému chování agenta. Verifikační kroky se
ukázaly jako neredundantní: jejich odebrání zhoršilo funkční
korektnost i čistotu kódu. Konvence kvality kódu automatizované
metriky neovlivnily, ale designová kvalita hodnocená LLM-as-judge
klesla. Výsledky zároveň ukázaly, že procesní compliance je výrazně
citlivá na nedeterminismus modelu; stejná sada instrukcí proto může
vést k odlišnému dodržení vícekrokového workflow.

Hlavním přínosem práce je iterativní postup a sada metrik, které
může praktik aplikovat na vlastním projektu s vlastními prahy.
Konkrétní instrukce a naměřené hodnoty platí pro tuto případovou
studii; přenositelný je postup, ne výsledná čísla. Práce je omezena
na jeden model a jeden projekt; závěry mají povahu analytické
generalizace na teorii, nikoliv statistické generalizace na populaci.

Pro praktika z toho plyne jednoduché doporučení: nestačí sledovat,
zda agent úkol vyřešil, ale i jak k řešení došel a jak kvalitní kód
zanechal. Pro akademického čtenáře práce ukazuje, že instrukce lze
studovat ne jen jako promptový artefakt, ale jako samostatně měřenou
nezávislou proměnnou, jejíž účinek je třeba hodnotit přes proces,
produkt i náklady.

---

# Bibliografie
Zdroj: literatura.bib
Citované klíče v hlavním textu: 56
Nalezené záznamy: 56
Chybějící klíče: žádné
Poznámka: Přiloženy jsou pouze záznamy citované v hlavním textu.
@article{metr2025,
  author = {METR},
  title = {Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity},
  year = {2025},
  journal = {arXiv preprint arXiv:2507.09089},
  url = {https://arxiv.org/abs/2507.09089},
  note = {RCT: 16 developers, 246 tasks; AI tools slowed experienced developers by 19\%; developers believed they were 24\% faster}
}

@inproceedings{ehsani2026failedprs,
  author = {Ehsani, Ramtin and others},
  title = {Where Do {AI} Coding Agents Fail? An Empirical Study of Failed Agentic Pull Requests in {GitHub}},
  booktitle = {Proceedings of MSR 2026},
  year = {2026},
  url = {https://arxiv.org/abs/2601.15195},
  note = {33k agent PRs, 5 coding agents, taxonomy of failures}
}

@inproceedings{shin2025prompt,
  author = {Shin, Jiho and Tang, Clark and Mohati, Tahmineh and Nayebi, Maleknaz and Wang, Song and Hemmati, Hadi},
  title = {Prompt Engineering or Fine-Tuning: An Empirical Assessment of Large Language Models for Code},
  booktitle = {Proceedings of the 22nd International Conference on Mining Software Repositories (MSR)},
  year = {2025},
  url = {https://arxiv.org/abs/2310.10508},
  note = {}
}

@inproceedings{swebench2024,
  author = {Jimenez, Carlos E. and Yang, John and Wettig, Alexander and Yao, Shunyu and Pei, Kexin and Press, Ofir and Narasimhan, Karthik},
  title = {{SWE}-bench: Can Language Models Resolve Real-World {GitHub} Issues?},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year = {2024},
  url = {https://arxiv.org/abs/2310.06770},
  note = {2294 tasks from real GitHub repositories, de facto benchmark for AI coding agents}
}

@misc{metr2026,
  author = {{METR}},
  title = {Many {SWE-bench}-Passing {PRs} Would Not Be Merged into Main},
  year = {2026},
  url = {https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/},
  note = {296 patches reviewed by 4 maintainers from 3 SWE-bench repos. $\sim$24pp gap between automated pass rate and maintainer merge decisions. Technical report.}
}

@article{li2026beyondbugfixes,
  author = {Li, Beiyu and Latendresse, Jasmine and Abdalkareem, Rabe and Shang, Weiyi},
  title = {Beyond Bug Fixes: Post-Merge Code Quality Issues in Agent-Generated Pull Requests},
  journal = {Proceedings of the 23rd International Conference on Mining Software Repositories (MSR)},
  year = {2026},
  url = {https://arxiv.org/abs/2601.20109},
  note = {1210 merged agent PRs, SonarQube analysis. Merge success unreliable indicator of quality. Code smells, complexity, duplicated code persist.}
}

@article{lulla2026,
  author = {Karan Lulla and Minjun Zhu and Eirini Kalliamvakou and Yevhen Mohylevskyy},
  title = {On the Impact of AGENTS.md Files on AI Coding Agents},
  year = {2026},
  journal = {arXiv preprint arXiv:2601.20404},
  url = {https://arxiv.org/abs/2601.20404},
  note = {124 PRs across 10 repos: -28\% runtime, -20\% output tokens with AGENTS.md; architectural info and coding conventions most effective}
}

@article{gloaguen2025agentsmd,
  author = {Gloaguen, Thibaud and Mündler, Niels and Müller, Mark and Raychev, Veselin and Vechev, Martin},
  title = {Evaluating {AGENTS.md}: Are Repository-Level Context Files Helpful for Coding Agents?},
  journal = {arXiv preprint arXiv:2602.11988},
  year = {2025},
  url = {https://arxiv.org/abs/2602.11988},
  note = {LLM-generated context files reduce success rate; developer-written marginally help (+4\%); context files increase cost 20\%+; agents follow instructions but no performance gain; AGENTBENCH benchmark (138 instances, 12 repos)}
}

@BOOK{swebok2024,
  title = {Guide to the Software Engineering Body of Knowledge},
  publisher = {IEEE Computer Society},
  year = {2024},
  author = {{IEEE Computer Society}},
  edition = {Version 4.0},
  url = {https://www.computer.org/education/bodies-of-knowledge/software-engineering}
}

@BOOK{sommerville2016,
  title = {Software Engineering},
  publisher = {Pearson},
  year = {2016},
  author = {Sommerville, Ian},
  edition = {10th},
  address = {Harlow},
  isbn = {978-1-292-09613-1}
}

@techreport{mccall1977,
  author = {McCall, Jim A. and Richards, Paul K. and Walters, Gene F.},
  title = {Factors in Software Quality. Volume I: Concepts and Definitions of Software Quality},
  institution = {General Electric Company, Information Systems Programs},
  year = {1977},
  number = {RADC-TR-77-369, Volume I},
  address = {Rome Air Development Center, Griffiss Air Force Base, New York},
  note = {Final technical report},
  url = {https://cgi.csc.liv.ac.uk/~comp208/2013/GetTRDoc.pdf}
}

@techreport{iso25010,
  author = {{ISO/IEC}},
  title = {Systems and software engineering -- Systems and software Quality Requirements and Evaluation ({SQuaRE}) -- Product quality model},
  number = {ISO/IEC 25010:2023},
  year = {2023},
  institution = {International Organization for Standardization},
  address = {Geneva},
  url = {https://www.iso.org/standard/78176.html}
}

@inproceedings{brooks1987,
  author = {Brooks, Frederick P.},
  title = {No Silver Bullet: Essence and Accidents of Software Engineering},
  booktitle = {Computer},
  volume = {20},
  number = {4},
  pages = {10--19},
  year = {1987},
  publisher = {IEEE},
  doi = {10.1109/MC.1987.1663532}
}

@article{lehman1980,
  author = {Lehman, Meir M.},
  title = {Programs, Life Cycles, and Laws of Software Evolution},
  journal = {Proceedings of the IEEE},
  volume = {68},
  number = {9},
  pages = {1060--1076},
  year = {1980},
  doi = {10.1109/PROC.1980.11805}
}

@inproceedings{shihab2012,
  author = {Shihab, Emad and Bird, Christian and Zimmermann, Thomas},
  title = {The Effect of Branching Strategies on Software Quality},
  booktitle = {Proceedings of the ACM-IEEE International Symposium on Empirical Software Engineering and Measurement},
  series = {ESEM '12},
  pages = {301--310},
  year = {2012},
  publisher = {ACM},
  doi = {10.1145/2372251.2372305}
}

@book{humble2010,
  author = {Humble, Jez and Farley, David},
  title = {Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation},
  publisher = {Addison-Wesley},
  year = {2010},
  isbn = {978-0321601919}
}

@inproceedings{bacchelli2013,
  author = {Bacchelli, Alberto and Bird, Christian},
  title = {Expectations, Outcomes, and Challenges of Modern Code Review},
  booktitle = {Proceedings of the 35th International Conference on Software Engineering},
  series = {ICSE '13},
  pages = {712--721},
  year = {2013},
  publisher = {IEEE Press},
  doi = {10.1109/ICSE.2013.6606617}
}

@article{mcintosh2016,
  author = {McIntosh, Shane and Kamei, Yasutaka and Adams, Bram and Hassan, Ahmed E.},
  title = {An Empirical Study of the Impact of Modern Code Review Practices on Software Quality},
  journal = {Empirical Software Engineering},
  volume = {21},
  number = {5},
  pages = {2146--2189},
  year = {2016},
  publisher = {Springer},
  doi = {10.1007/s10664-015-9381-9}
}

@inproceedings{gotel1994,
  author = {Gotel, Orlena C.Z. and Finkelstein, Anthony C.W.},
  title = {An Analysis of the Requirements Traceability Problem},
  booktitle = {Proceedings of IEEE International Conference on Requirements Engineering},
  pages = {94--101},
  year = {1994},
  publisher = {IEEE}
}

@book{beck2000,
  author = {Beck, Kent},
  title = {Extreme Programming Explained: Embrace Change},
  publisher = {Addison-Wesley},
  year = {2000},
  isbn = {978-0201616415}
}

@article{rafique2013,
  author = {Rafique, Yahya and Mi\v{s}i\'{c}, Vojislav B.},
  title = {The Effects of Test-Driven Development on External Quality and Productivity: A Meta-Analysis},
  journal = {IEEE Transactions on Software Engineering},
  volume = {39},
  number = {6},
  pages = {835--856},
  year = {2013},
  doi = {10.1109/TSE.2012.28}
}

@BOOK{mcconnell2004,
  author = {McConnell, Steve},
  title = {Code Complete: A Practical Handbook of Software Construction},
  publisher = {Microsoft Press},
  year = {2004},
  edition = {2nd},
  address = {Redmond, WA},
  isbn = {978-0-7356-1967-8}
}

@BOOK{fenton2014,
  author = {Fenton, Norman E. and Bieman, James},
  title = {Software Metrics: A Rigorous and Practical Approach},
  publisher = {CRC Press},
  year = {2014},
  edition = {3},
  isbn = {978-1439838228},
  note = {Process vs. product vs. resource metrics taxonomy; GQM framework}
}

@ARTICLE{papadakis2019,
  author = {Papadakis, Mike and Kintis, Marinos and Zhang, Jie and Jia, Yue and Le Traon, Yves and Harman, Mark},
  title = {Mutation Testing Advances: An Analysis and Survey},
  journal = {Advances in Computers},
  volume = {112},
  pages = {275--378},
  year = {2019},
  publisher = {Elsevier},
  doi = {10.1016/bs.adcom.2018.03.015},
  note = {Mutation score stronger predictor of fault detection than structural coverage}
}

@article{mccabe1976,
  author = {McCabe, Thomas J.},
  title = {A Complexity Measure},
  journal = {IEEE Transactions on Software Engineering},
  volume = {SE-2},
  number = {4},
  pages = {308--320},
  year = {1976},
  doi = {10.1109/TSE.1976.233837}
}

@inproceedings{vaswani2017,
  author = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N. and Kaiser, Lukasz and Polosukhin, Illia},
  title = {Attention Is All You Need},
  booktitle = {Advances in Neural Information Processing Systems},
  volume = {30},
  year = {2017},
  publisher = {NeurIPS}
}

@article{liu2024llmagents,
  author = {Liu, Junwei and Wang, Kaixin and Chen, Yixuan and Peng, Xin and Chen, Zhenpeng and Zhang, Lingming and Lou, Yiling},
  title = {Large Language Model-Based Agents for Software Engineering: A Survey},
  journal = {arXiv preprint arXiv:2409.02977},
  year = {2024},
  url = {https://arxiv.org/abs/2409.02977},
  note = {124 papers surveyed}
}

@inproceedings{yao2022react,
  author = {Yao, Shunyu and Zhao, Jeffrey and Yu, Dian and Du, Nan and Shafran, Izhak and Narasimhan, Karthik and Cao, Yuan},
  title = {{ReAct}: Synergizing Reasoning and Acting in Language Models},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year = {2023}
}

@article{schick2023toolformer,
  author = {Schick, Timo and Dwivedi-Yu, Jane and Dess{\`i}, Roberto and Raileanu, Roberta and Lomeli, Maria and Zettlemoyer, Luke and Cancedda, Nicola and Scialom, Thomas},
  title = {Toolformer: Language Models Can Teach Themselves to Use Tools},
  journal = {arXiv preprint arXiv:2302.04761},
  year = {2023}
}

@article{guo2025benchmarks,
  author = {Guo, Jiale and Huang, Suizhi and Li, Mei and Huang, Dong and Chen, Xingsheng and Zhang, Regina and Guo, Zhijiang and Yu, Han and Yiu, Siu-Ming and Lio, Pietro and Lam, Kwok-Yan},
  title = {A Comprehensive Survey on Benchmarks and Solutions in Software Engineering of {LLM}-Empowered Agentic System},
  journal = {arXiv preprint arXiv:2510.09721},
  year = {2025},
  url = {https://arxiv.org/abs/2510.09721},
  note = {Over 150 papers surveyed}
}

@book{nonaka1995,
  author = {Nonaka, Ikujiro and Takeuchi, Hirotaka},
  title = {The Knowledge-Creating Company: How Japanese Companies Create the Dynamics of Innovation},
  publisher = {Oxford University Press},
  year = {1995},
  isbn = {978-0195092691}
}

@article{hassan2025sase,
  author = {Hassan, Ahmed E. and Li, Hao and Lin, Dayi and Adams, Bram and Chen, Tse-Hsun and Kashiwa, Yutaro and Qiu, Dong},
  title = {Agentic Software Engineering: Foundational Pillars and a Research Roadmap},
  journal = {arXiv preprint arXiv:2509.06216},
  year = {2025},
  url = {https://arxiv.org/abs/2509.06216},
  note = {SASE framework, BriefingScript, MentorScript, SE4H/SE4A duality}
}

@inproceedings{mao2025fse,
  author = {Mao, Yuetian and He, Junjie and Chen, Chunyang},
  title = {From Prompts to Templates: A Systematic Prompt Template Analysis for Real-world {LLM} Applications},
  booktitle = {Proceedings of the ACM International Conference on the Foundations of Software Engineering (FSE)},
  year = {2025},
  url = {https://arxiv.org/abs/2504.02052},
  note = {Merged 4 frameworks (Google Cloud, Elavis Saravia, CRISPE, LangGPT); 7 component types; Directive 87\% prevalence}
}

@article{skillsbench2025,
  author = {Li, Xiangyi and Chen, Wenbo and Liu, Yimin and Zheng, Shenghan and Chen, Xiaokun and He, Yifeng and Li, Yubo and others},
  title = {{SkillsBench}: Benchmarking How Well Agent Skills Work Across Diverse Tasks},
  journal = {arXiv preprint arXiv:2602.12670},
  year = {2025},
  url = {https://arxiv.org/abs/2602.12670},
  note = {Curated Skills +16.2pp; self-generated Skills -1.3pp; 2--3 focused modules optimal; comprehensive documentation hurts (-2.9pp); smaller model + Skills can exceed larger model without; 84 tasks, 11 domains, 7308 trajectories}
}

@misc{breunig2025,
  author = {Drew Breunig},
  title = {Don't Fight the Weights},
  year = {2025},
  url = {https://www.dbreunig.com/2025/11/11/don-t-fight-the-weights.html},
  note = {Defines fighting-the-weights: when prompt instructions oppose trained model behavior; recognition signs and mitigation strategies}
}

@article{razavi2025,
  author = {Razavi, Seyed Parsa and Fard, Fatemeh H.},
  title = {What Did {I} Do Wrong? Quantifying {LLMs}' Sensitivity and Consistency to Prompt Engineering},
  journal = {Proceedings of NAACL},
  year = {2025},
  url = {https://arxiv.org/abs/2406.12334},
  note = {Up to 76 accuracy points difference from subtle formatting changes in few-shot settings}
}

@article{chen2021humaneval,
  author = {Chen, Mark and Tworek, Jerry and Jun, Heewoo and Yuan, Qiming and Pinto, Henrique Pond{\'e} de Oliveira and Kaplan, Jared and Edwards, Harrison and Burda, Yura and Joseph, Nicholas and Brockman, Greg and Ray, Alex and Puri, Raul and Krueger, Gretchen and Petrov, Michael and Khlaaf, Heidy and Sastry, Girish and Mishkin, Pamela and Chan, Brooke and Gray, Scott and Ryder, Nick and Pavlov, Mikhail and Power, Alethea and Kaiser, Lukasz and Bavarian, Mohammad and Winter, Clemens and Tillet, Philippe and Such, Felipe Petroski and Cummings, Dave and Plappert, Matthias and Chantzis, Fotios and Barnes, Elizabeth and Herbert-Voss, Ariel and Guss, William Hebgen and Nichol, Alex and Paino, Alex and Tezak, Nikolas and Tang, Jie and Babuschkin, Igor and Balaji, Suchir and Jain, Shantanu and Saunders, William and Hesse, Christopher and Carr, Andrew N. and Leike, Jan and Achiam, Joshua and Misra, Vedant and Morikawa, Evan and Radford, Alec and Knight, Matthew and Brundage, Miles and Murati, Mira and Mayer, Katie and Welinder, Peter and McGrew, Bob and Amodei, Dario and McCandlish, Sam and Sutskever, Ilya and Zaremba, Wojciech},
  title = {Evaluating Large Language Models Trained on Code},
  journal = {arXiv preprint arXiv:2107.03374},
  year = {2021},
  url = {https://arxiv.org/abs/2107.03374},
  note = {Introduces HumanEval benchmark (164 hand-written Python problems) and Codex model. pass@k metric for functional correctness.}
}

@inproceedings{swebenchpro2025,
  author = {{Scale AI}},
  title = {{SWE}-Bench Pro: Can {AI} Agents Solve Long-Horizon Software Engineering Tasks?},
  booktitle = {arXiv preprint arXiv:2509.16941},
  year = {2025},
  url = {https://arxiv.org/abs/2509.16941},
  note = {1865 human-verified tasks, adds explicit Requirements and Interface sections to issues}
}

@article{acebench2025,
  author = {others},
  title = {{ACE-Bench}: End-to-End Feature Development Benchmark},
  year = {2025},
  url = {https://openreview.net/forum?id=41xrZ3uGuI},
  note = {212 tasks from 16 repos; Claude 4 Sonnet + OpenHands: 7.5\% on feature-level tasks}
}

@ARTICLE{featurebench2026,
  author = {others},
  title = {{FeatureBench}: Benchmarking Agentic Coding for Complex Feature Development},
  journal = {arXiv preprint arXiv:2602.10975},
  year = {2026},
  note = {Agents struggle when scope exceeds single-issue; feature-level tasks significantly harder}
}

@inproceedings{zheng2023mtbench,
  author = {Zheng, Lianmin and Chiang, Wei-Lin and Sheng, Ying and Zhuang, Siyuan and Wu, Zhanghao and Zhuang, Yonghao and Lin, Zi and Li, Zhuohan and Li, Dacheng and Xing, Eric P. and Zhang, Hao and Gonzalez, Joseph E. and Stoica, Ion},
  title = {Judging {LLM}-as-a-Judge with {MT-Bench} and {Chatbot Arena}},
  booktitle = {Advances in Neural Information Processing Systems (NeurIPS)},
  year = {2023},
  url = {https://arxiv.org/abs/2306.05685},
  note = {Foundational LLM-as-judge paper; position bias, verbosity bias, self-enhancement bias; GPT-4 >80\% human agreement}
}

@inproceedings{panickssery2024,
  author = {Panickssery, Arjun and Bowman, Samuel R. and Feng, Shi},
  title = {{LLM} Evaluators Recognize and Favor Their Own Generations},
  booktitle = {Advances in Neural Information Processing Systems (NeurIPS)},
  year = {2024},
  url = {https://arxiv.org/abs/2404.13076},
  note = {Causal link: self-recognition $\to$ self-preference; linear correlation; fine-tuning pushes recognition to 90\%+}
}

@inproceedings{verga2024poll,
  author = {Verga, Pat and Hofstätter, Sebastian and Cer, Daniel and Thorne, James},
  title = {Replacing Judges with Juries: Evaluating {LLM} Generations with a Panel of Diverse Models},
  booktitle = {arXiv preprint arXiv:2404.18796},
  year = {2024},
  url = {https://arxiv.org/abs/2404.18796},
  note = {Panel of LLM evaluators (PoLL) outperforms single GPT-4 judge; disjoint model families reduce intra-model bias; 7x cheaper}
}

@INPROCEEDINGS{mathews2024,
  author = {Mathews, Noble Saji and Nagappan, Meiyappan},
  title = {{LLM}-Based Test Generation as Bug Validation: Insights from Reproducing Real-World Bugs},
  booktitle = {Proceedings of the 1st ACM International Conference on AI-Powered Software (AIware)},
  year = {2024},
  doi = {10.1145/3664646.3664766},
  note = {68.1\% generated test suites validate bugs instead of detecting them}
}

@ARTICLE{rethinking2025,
  author = {Chen, Jiawei and Lin, Jia and Xiong, Yinglin and Lu, Jiaming and Zhang, Hao and Xie, Tao},
  title = {Rethinking the Value of Agent-Generated Tests in Autonomous Code Repair},
  journal = {arXiv preprint arXiv:2505.21615},
  year = {2025},
  note = {83.2\% tasks same outcome regardless of test writing; tests serve as observational feedback}
}

@article{hevner2004,
  author = {Hevner, Alan R. and March, Salvatore T. and Park, Jinsoo and Ram, Sudha},
  title = {Design Science in Information Systems Research},
  journal = {{MIS} Quarterly},
  year = {2004},
  volume = {28},
  number = {1},
  pages = {75--105},
  doi = {10.2307/25148625},
  note = {Foundational DSR framework: build-evaluate cycle, 7 guidelines for design science research}
}

@article{peffers2008,
  author = {Peffers, Ken and Tuunanen, Tuure and Rothenberger, Marcus A. and Chatterjee, Samir},
  title = {A Design Science Research Methodology for Information Systems Research},
  journal = {Journal of Management Information Systems},
  volume = {24},
  number = {3},
  pages = {45--77},
  year = {2008},
  doi = {10.2753/MIS0742-1222240302}
}

@BOOK{yin2018,
  author = {Yin, Robert K.},
  title = {Case Study Research and Applications: Design and Methods},
  publisher = {SAGE Publications},
  year = {2018},
  edition = {6},
  isbn = {978-1506336169},
  note = {Embedded single-case design; analytic generalization (to theory, not population)}
}

@article{yin2025agents,
  author = {Yin, Zhaoyang and Wang, Jialong and Li, Jiawei and Shi, Dianbiao and Wei, Yuxuan and Yue, Yujia and Liu, Zhongxin and Xia, Xin and Lo, David},
  title = {A Comprehensive Empirical Evaluation of Agent Frameworks on Code-centric Software Engineering Tasks},
  journal = {arXiv preprint arXiv:2511.00872},
  year = {2025}
}

@inproceedings{runeson2009,
  author = {Runeson, Per and Höst, Martin},
  title = {Guidelines for Conducting and Reporting Case Study Research in Software Engineering},
  journal = {Empirical Software Engineering},
  volume = {14},
  number = {2},
  pages = {131--164},
  year = {2009},
  doi = {10.1007/s10664-008-9102-8}
}

@article{kim2025detail,
  author = {Kim, Olivia},
  title = {{DETAIL} Matters: Measuring the Impact of Prompt Specificity on Reasoning in Large Language Models},
  journal = {arXiv preprint arXiv:2512.02246},
  year = {2025},
  url = {https://arxiv.org/abs/2512.02246},
  note = {Emory University. Framework pro evaluaci vlivu specifičnosti promptu na reasoning. 30 úloh, GPT-4 a O3-mini}
}

@article{zi2025specificity,
  author = {Zi, Yangtian and Menon, Harshitha and Guha, Arjun},
  title = {More Than a Score: Probing the Impact of Prompt Specificity on {LLM} Code Generation},
  journal = {arXiv preprint arXiv:2508.03678},
  year = {2025},
  url = {https://arxiv.org/abs/2508.03678},
  note = {PartialOrderEval framework. Partial order of prompts from minimal to maximally detailed. HumanEval + ParEval}
}

@inproceedings{wei2022cot,
  author = {Wei, Jason and Wang, Xuezhi and Schuurmans, Dale and Bosma, Maarten and Ichter, Brian and Xia, Fei and Chi, Ed H. and Le, Quoc V. and Zhou, Denny},
  title = {Chain-of-Thought Prompting Elicits Reasoning in Large Language Models},
  booktitle = {Advances in Neural Information Processing Systems (NeurIPS)},
  volume = {35},
  year = {2022},
  url = {https://arxiv.org/abs/2201.11903},
  note = {Google Research. Few-shot CoT exempláře zlepšují reasoning na aritmetických, commonsense a symbolických úlohách}
}

@inproceedings{min2022rethinking,
  author = {Min, Sewon and Lyu, Xinxi and Holtzman, Ari and Artetxe, Mikel and Lewis, Mike and Hajishirzi, Hannaneh and Zettlemoyer, Luke},
  title = {Rethinking the Role of Demonstrations: What Makes In-Context Learning Work?},
  booktitle = {Proceedings of the Conference on Empirical Methods in Natural Language Processing (EMNLP)},
  year = {2022},
  url = {https://arxiv.org/abs/2202.12837},
  note = {Label space, input distribution a formát jsou klíčové pro ICL, ne správnost label-input mapování}
}

@article{agarwal2024promptwizard,
  author  = {Agarwal, Aman and others},
  title   = {PromptWizard: Task-Aware Prompt Optimization Framework},
  year    = {2024},
  note    = {Microsoft Research. arXiv:2405.18369. Iterativní Score→Critique→Synthesize cyklus pro optimalizaci promptů.}
}

@article{promptalchemy2025,
  title   = {Prompt Alchemy: Automatic Prompt Refinement for Enhancing Code Generation},
  year    = {2025},
  note    = {arXiv:2503.11085. Iterativní refinement promptů pro code generation, evaluace přes execution.}
}