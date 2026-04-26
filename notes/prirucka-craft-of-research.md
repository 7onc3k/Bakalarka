# Příručka k teoretickým a argumentačním částem BP

Tento dokument je interní průvodce pro psaní částí práce, které nestaví
na "co jsem udělal", ale na "jaký problém řeším, proč je důležitý,
jaké teoretické pojmy potřebuji a jak z nich udělám obhajitelný
argument".

Nevznikl jako shrnutí jedné knihy. Je to překlad rámce z
*The Craft of Research* do kontextu naší konkrétní bakalářky a do
lokálních pravidel v repo. Opírá se hlavně o:

- *The Craft of Research*, 5. vydání, University of Chicago Press:
  https://press.uchicago.edu/ucp/books/book/chicago/C/bo215874008
- `notes/jak-psat-vedecky.md`
- `notes/doporuceni-fis.md`
- `AGENTS.md`
- aktuální strukturu thesis v `kap01` až `kap05`

Smysl této příručky je jednoduchý: pomoct autorovi napsat text, který
není jen "správně odcitovaný", ale argumentačně drží pohromadě.

## Nejdřív velký obrázek

Než začneš řešit jednotlivé odstavce, drž v hlavě roli kapitol:

| Kapitola | Hlavní role |
|----------|-------------|
| `kap01` | Vymezit problém, motivaci, cíle a scope |
| `kap02` | Postavit teoretický argument pro to, co budeme v `kap03` měřit a proč |
| `kap03` | Převést teoretické pojmy do konkrétní metodiky a měření |
| `kap04` | Ukázat, co se v případové studii skutečně stalo |
| `kap05` | Vysvětlit, co výsledky znamenají vzhledem k cílům a literatuře |

Jedna z nejdůležitějších věcí z *The Craft of Research* je, že práce
nemá být jen sled témat. Má mít tah: od problému k odpovědi. To je
hlavní rozdíl mezi "něco jsem si nastudoval" a "napsal jsem odborný
text".

## Ještě jeden filtr: tři úrovně této konkrétní BP

Naše práce je zrádná tím, že se v ní velmi snadno smíchají tři různé
roviny:

- `systém upomínek faktur` je testovací prostředí
- `agent píše kód` je pozorované chování
- `instrukce` jsou nezávislá proměnná, kterou mezi běhy měníme

To má přímý dopad na psaní.

Když píšeš o systému upomínek, většinou nepíšeš o hlavním výzkumném
objektu, ale o prostředí, na kterém něco demonstrujeme. Proto se jeho
popis musí držet při zemi a sloužit cíli práce.

Když píšeš o agentovi, píšeš o tom, co se měří: proces, kvalita kódu,
efektivita, stabilita chování.

Když píšeš o instrukcích, píšeš o tom, co mezi běhy měníme a čemu
přisuzujeme vysvětlující sílu.

Typický argumentační pád v této BP vypadá takto:

- autor začne detailně rozebírat reminder systém, jako by to byl hlavní přínos práce
- nebo začne mluvit o agentovi, ale neodliší jeho chování od vlivu instrukcí
- nebo začne psát o instrukcích, ale bez návaznosti na to, co přesně jimi chce v chování změnit

Jednoduchá kontrola:

- Mluvím teď o prostředí, chování, nebo o proměnné?
- Je to z textu poznat i čtenáři, který není v hlavě autora?

## 1. Topic vs. Question vs. Problem

### Intuice

Nejjednodušší analogie je tato:

- `topic` je území
- `question` je konkrétní cesta tím územím
- `problem` je důvod, proč na té cestě vůbec záleží

Spousta slabých bakalářek zůstane na úrovni topicu. Autor ví, o čem
chce psát, ale neví, na jakou otázku odpovídá a čí problém tím řeší.

### Co je co

`Topic` je oblast zájmu. Je široký a sám o sobě se nedá "zodpovědět".

Příklad pro naši BP:

- "AI coding agenti"
- "instrukce v AGENTS.md"
- "benchmarky pro hodnocení agentů"

To jsou témata, ne výzkumné otázky.

`Question` je formulace toho, co chceš zjistit. Musí být užší,
směřovat k odpovědi a být dost konkrétní na to, aby sis uměl říct,
jaký typ evidence by ji mohl podpořit nebo vyvrátit.

Příklady:

- "Jak navrhnout sadu metrik, která vedle funkční korektnosti zachytí i proces a kvalitu kódu?"
- "Jak lze iterativně upravovat instrukce tak, aby agent lépe dodržoval vývojové praktiky?"
- "Které složky instrukcí mají v naší případové studii měřitelný přínos a které jsou redundantní?"

`Problem` je ještě o krok výš. Není to jen "na co se ptám", ale
"proč by mělo někoho zajímat, že odpověď neznáme". V pojetí
*The Craft of Research* je problém napětí mezi tím, co potřebujeme
vědět, a tím, co ještě nevíme.

Pro naši BP to není:

- "Máme téma AI agentů a chceme o něm něco napsat."

Ale spíš:

- "Současné benchmarky typicky měří hlavně výsledek, zejména pass/fail na testech."
- "To ale nestačí pro praktické rozhodování, protože mergeovatelný výstup musí obstát i procesně a kvalitativně."
- "Zároveň chybí přenositelný postup, jak instrukce iterativně navrhovat a vyhodnocovat."

To už je problém. A právě ten dává smysl cílům práce.

### Jak to vypadá na naší BP

Jedna užitečná rekonstrukce:

- `Topic`: AI coding agenti a instrukce
- `Question`: Jak měřit a iterativně zlepšovat chování AI coding agenta pomocí instrukcí?
- `Problem`: Stávající benchmarky nedávají praktikovi dostatečný obraz o tom, zda agent pracuje způsobem použitelným v reálném vývoji, a není jasné, jak instrukce systematicky ladit

Tohle je přesně ten rozdíl, který je v `kap01` potřeba udělat explicitně.

### Typické chyby

- Autor zamění topic za cíl práce. "Cílem práce je popsat AI coding agenty." To není cíl k odbornému problému, ale k textu.
- Autor má question, ale nemá problem. Pak text zní jako "zkoumáme to, protože je to zajímavé".
- Autor má problem, ale otázka je moc široká. Pak teorie bobtná a metodika nemá ostré hranice.

### Kontrolní otázky

- Dá se moje "otázka" zodpovědět seznamem podtémat? Pak to ještě není otázka.
- Kdyby se mě oponent zeptal "a proč na tom záleží?", mám odpověď jinou než "protože AI je aktuální"?
- Je z formulace cíle jasné, jaká evidence by ho mohla naplnit?

## 2. "So what?" aneb relevance pro čtenáře

### Co tahle otázka opravdu znamená

`So what?` neznamená "umím to marketingově prodat". Znamená:

- Co se pokazí, když odpověď nemáme?
- Komu přesně ta neznalost vadí?
- K jakému chybnému rozhodnutí nebo slepému místu vede?

V naší práci je čtenář dvojí:

- akademický čtenář, který chce vědět, zda je problém a postup obhajitelný
- praktik, který chce vědět, zda mu navržené metriky a postup pomohou na vlastním projektu

Dobrá relevance proto musí fungovat pro oba.

### Slabá a silná relevance

Slabé:

> AI coding agenti jsou dnes populární, proto je důležité se jimi zabývat.

Tohle říká jen to, že téma je módní.

Silnější:

> Současné benchmarky typicky měří funkční správnost, ale v praxi může být i testy procházející výstup odmítnut kvůli procesním a kvalitativním nedostatkům. Pokud chceme instrukce pro agenty navrhovat systematicky, potřebujeme měření, které zachytí více než pass rate.

Tady už je jasné:

- co víme
- co nestačí
- proč to nestačí
- co z toho plyne pro naši práci

### Praktický vzorec pro psaní relevance

U argumentačně důležité pasáže si zkus napsat čtyři věty:

1. V oboru nebo praxi se běžně dělá `X`.
2. Pro náš typ rozhodnutí to nestačí, protože `Y`.
3. Důsledkem je `Z`.
4. Tato práce proto řeší `W`.

Pro naši BP:

1. Benchmarky běžně měří funkční korektnost.
2. To nestačí pro posouzení použitelnosti agenta v reálném vývoji, protože nevidíme proces ani kvalitu kódu.
3. Praktik tak může přecenit kvalitu řešení, které by ve skutečnosti neprošlo review nebo by se špatně udržovalo.
4. Tato práce proto navrhuje sadu metrik a iterativní postup návrhu instrukcí.

### Vazba na FIS

`notes/doporuceni-fis.md` je v tomhle nekompromisní a správně:

- cíl má být vztažený k odbornému problému
- východiska mají obsahovat jen poznatky s dopadem na výsledky
- text nemá být populárně naučný přehled

Jinými slovy: relevance není ozdoba v úvodu. Je to filtr pro celý text.

## 3. Jak funguje teorie

### Nejprve správná intuice

Teorie v bakalářce není muzeum pojmů. Je to pracovní sada nástrojů,
která čtenáři umožní pochopit:

- podle jakých pojmů se díváš na problém
- proč právě tyto pojmy dávají smysl
- jak z nich později vznikne metodika

Pokud teoretická kapitola nic nepřipravuje pro metodiku nebo diskusi,
je pravděpodobně přestřelená.

### Čtyři funkce teorie

#### 1. Definice

Definice stabilizuje význam pojmu. Ne proto, aby text zněl učeně, ale
aby bylo jasné, co v práci daným slovem myslíš.

V naší BP typicky potřebujeme definovat:

- co je AI coding agent
- co je scaffolding / instrukce
- co znamená kvalita software
- co znamená maintainability

Definice je dobrá tehdy, když pak opravdu nese váhu v dalších
kapitolách. Pokud pojem zavedeš a už ho nikdy nepotřebuješ, byl
nejspíš zbytečný.

#### 2. Rámec

Rámec říká, podle jakých dimenzí budeš problém číst.

V naší BP jsou důležité hlavně dva rámce:

- kvalita software jako vícerozměrná věc, ne jen funkční správnost
- rozlišení proces / produkt / zdroje, které později umožní P/Q/E

Tady teorie nedodává "fakta navíc", ale strukturu pohledu.

#### 3. Argumentace

Argumentační role teorie je ukázat, proč zvolený rámec odpovídá
problému z `kap01`.

Například:

- jestliže literatura ukazuje, že kvalita software není jen correctness
- a jestliže benchmarky agentů měří hlavně correctness
- pak je obhajitelné tvrdit, že stávající benchmarky nezachycují celý problém

To už není přehled literatury. To je argument.

#### 4. Syntéza

Syntéza znamená, že zdroje nenecháš stát vedle sebe, ale použiješ je
k vlastnímu tvrzení.

Špatně:

> ISO 25010 říká X. Fenton a Bieman říkají Y. Mao říká Z.

Lépe:

> ISO 25010 ukazuje, že produktovou kvalitu nelze redukovat na funkční správnost, zatímco Fenton a Bieman rozlišují měření procesu, produktu a zdrojů. Dohromady tyto rámce podporují návrh metrik, které nepokrývají jen výsledek běhu, ale i způsob práce agenta a jeho náklady.

Tohle je přesně ten typ syntézy, který má v `kap02` vznikat.

### Co teorie není

Teorie není:

- detailní popis toho, jak budeme měřit konkrétní metriku
- seznam všech papers, které autor přečetl
- skrytá metodika přepsaná do minulého času
- diskuse výsledků dřív, než čtenář viděl data

Jakmile píšeš "v této práci použijeme nástroj X s konfigurací Y", jsi
pravděpodobně už v metodice, ne v teorii.

### Mini-příklad z naší BP

Dobrá teoretická linka:

1. Kvalita software má víc dimenzí než correctness.
2. Praktiky jako branching, testování a code review souvisí s kvalitou procesu i produktu.
3. Měření jen výsledku dává neúplný obraz.
4. U agentů je navíc proměnná instrukce, která může ovlivňovat chování.
5. Proto dává smysl navrhnout sadu metrik pokrývající proces, produkt a efektivitu.

Tohle je teorie, která tlačí čtenáře směrem ke `kap03`.

## 3.5 Jak stavět jeden argumentační odstavec

Lokální pravidla v `notes/jak-psat-vedecky.md` a `AGENTS.md` se tady
dobře potkávají s rámcem z *The Craft of Research*: odstavec nemá být
jen "blok informací", ale malý argument.

Prakticky funguje tento vzorec:

1. `Topic sentence`: co tento odstavec tvrdí
2. `Elaborace`: co je potřeba dovysvětlit, aby tvrzení bylo srozumitelné
3. `Evidence`: čím je tvrzení podepřené
4. `Propojení`: proč to odstavec říká zrovna tady a co z toho plyne pro BP

Mini-příklad:

> Současné benchmarky AI coding agentů zachycují hlavně funkční výsledek, nikoli celý vývojový proces. To je pro naši práci podstatné, protože agent může vytvořit řešení, které projde testy, ale vzniklo nedisciplinovaným postupem nebo produkuje obtížně udržovatelný kód. Empirické práce citované v `kap01` i `kap02` ukazují, že pass/fail sám o sobě nestačí k posouzení praktické použitelnosti výstupu. Z toho pro naši práci plyne potřeba metrického rámce, který bude vedle correctness sledovat i proces a kvalitu kódu.

Když odstavec nemá poslední vrstvu, často působí jako izolovaná poznámka
z literatury. Když nemá první vrstvu, čtenář neví, proč ho vůbec čte.

## 4. Typy sekcí a kdy je použít

Ne každá sekce má dělat totéž. Častá chyba je, že autor píše všechny
sekce stejně: trochu definice, trochu přehled, trochu názor. Lepší je
vědět, jaký typ sekce právě píšeš.

| Typ sekce | Kdy ji použít | Hlavní otázka | Typický výstup |
|-----------|---------------|---------------|----------------|
| Vymezující | Na začátku kapitoly nebo tématu | Co přesně řešíme a proč? | problém, relevance, scope |
| Definiční | Když potřebuješ stabilizovat pojem | Co tímto pojmem v práci myslíme? | pracovní definice |
| Mapovací / syntetická | Když potřebuješ ukázat landscape přístupů | Jaké existují relevantní pohledy a co z nich plyne pro naši práci? | uspořádaný přehled se syntézou |
| Srovnávací | Když vybíráš mezi přístupy nebo ukazuješ limity | V čem se přístupy liší a proč je to pro nás důležité? | obhájený výběr nebo vymezení |
| Bridge sekce | Na konci bloku nebo kapitoly | Co z právě řečeného plyne pro další kapitolu? | přechod, selekce, zúžení |

### Definiční sekce

Použij ji tehdy, když bez stabilního významu pojmu nejde dál.

V naší BP:

- "AI coding agenti"
- "scaffolding a instrukce"
- "kvalita software"

Nepoužívej ji na pojmy, které jsou jen dekorace. Pokud pojem nepotáhne
další argument, nemá v textu co dělat.

### Mapovací / syntetická sekce

To je typická rešeršní sekce. Její cíl není "ukázat, co všechno jsem
četl", ale "zmapovat relevantní pole tak, aby čtenář pochopil, jaké
možnosti existují a kam se staví tato práce".

V `kap02` to jsou například:

- modely kvality software
- praktiky zajišťování kvality
- přístupy k instrukcím a scaffolding pro agenty
- způsoby hodnocení agentů

### Srovnávací sekce

Použij ji, když opravdu něco porovnáváš kvůli rozhodnutí, ne jen proto,
že "je zajímavé uvést více autorů".

Například:

- benchmarky zaměřené na pass/fail vs. potřeba holističtějšího měření
- obecná pravidla vs. procedurální instrukce vs. verifikační kroky

### Bridge sekce

Bridge bývá podceňovaný, ale drží práci pohromadě. Je to věta nebo
krátký odstavec, který říká:

- co jsme si právě odnesli
- proč to nestačí samo o sobě
- co z toho plyne pro další sekci

Bez bridge text často působí jako série izolovaných mini-esejí.

## 5. Jak budovat bridge mezi kapitolami

### Základní princip

Každá kapitola má zanechat "otevřený závazek", který další kapitola
splní.

U naší práce to vypadá takto:

### `kap01 -> kap02`

`kap01` vymezí problém: benchmarky a dosavadní praxe nestačí, cíle práce
chtějí metriky, iterativní postup a ablace.

`kap02` na to musí reagovat otázkou:

> Jaké teoretické pojmy a empirické poznatky potřebujeme, abychom tyto cíle dokázali obhájit?

Bridge věta může vypadat zhruba takto:

> K obhájení navržených cílů je nejprve nutné vymezit, jak je v kontextu softwarového inženýrství chápána kvalita software, jakými praktikami se zajišťuje a jak se dnes hodnotí AI coding agenti.

### `kap02 -> kap03`

`kap02` nesmí skončit jen tím, že "literatura byla zajímavá". Musí
skončit selekcí:

- které dimenze kvality nás zajímají
- které přístupy k měření jsou pro nás použitelné
- co z teorie převedeme do metodiky

Bridge:

> Předchozí kapitola ukázala, že pro naši úlohu nestačí měřit pouze funkční korektnost a že relevantní je i proces, udržovatelnost a efektivita. Následující kapitola proto tyto dimenze převádí do konkrétní sady metrik a experimentálního designu.

### `kap03 -> kap04`

Tady je přechod z "co a jak budeme měřit" na "co se při bězích stalo".

Bridge:

> Po metodickém vymezení metrik, fixních proměnných a iterativního cyklu nyní následuje provedení případové studie, na níž je tento postup demonstrován.

### `kap04 -> kap05`

Tohle je kritické. `kap04` ukazuje data. `kap05` jim dává význam.

Bridge:

> Předchozí kapitola popsala průběh případové studie a naměřené hodnoty. Sama čísla však ještě neodpovídají na otázku, zda byly naplněny cíle práce a co z výsledků plyne pro návrh instrukcí a metrik.

### Praktické pravidlo

Když dopíšeš sekci nebo kapitolu, zeptej se:

- Co přesně má čtenář po této části nově vědět?
- Jaká nová potřeba z toho vzniká?
- Umí další sekce tuto potřebu opravdu splnit?

Pokud ne, bridge je slabý nebo je špatně zvolený scope.

## 6. Jak volit scope a co nechat venku

### Nejprve správná definice scope

Scope není seznam všeho, co s tématem souvisí. Scope je hranice toho,
co čtenář musí vědět, aby byly cíle, metodika a závěry obhajitelné.

To je důležité hlavně u této BP, protože téma přirozeně svádí k
rozšiřování:

- historie LLM
- prompt engineering obecně
- memory systémy
- agentní frameworky
- benchmarky všeho druhu
- široké přehledy softwarového inženýrství

Velká část z toho je zajímavá. To ale není dostatečný důvod, aby to
bylo ve finálním textu.

### Filtr pro zařazení

Než něco necháš v teorii, zeptej se:

1. Pomůže to vymezit problém?
2. Pomůže to obhájit některou část metodiky?
3. Pomůže to interpretovat výsledky?
4. Objeví se to znovu později jako nosný pojem?

Jestli ne, pravděpodobně to patří pryč nebo do RAW poznámek.

### Co typicky v naší BP patří dovnitř

- taková teorie kvality software, která podpírá výběr metrik
- takové poznatky o instrukcích a scaffolding, které podpírají práci s `AGENTS.md`
- takový přehled benchmarků, který ukazuje gap mezi pass/fail a naším cílem

### Co typicky patří ven nebo jen velmi stručně

- obecné vysvětlování, co je Transformer, pokud dál nepotřebujeme architektonické detaily
- široký přehled memory architektur agentů, pokud je metodicky nepoužíváme
- učebnicové základy softwarového inženýrství, které nemají vazbu na metriky a výsledky
- "zajímavosti" o nástrojích, které nehrají roli v argumentu

### Mini-příklady pro naši BP

`In`:

> ISO 25010 je relevantní, protože pomáhá obhájit, proč nestačí correctness a proč sledujeme i maintainability.

`Out`:

> Dlouhá historie evoluce standardů ISO kvality software od 90. let, pokud z ní dál nic nepoužijeme.

`In`:

> Mao, Breunig, Gloaguen, Lulla a další jsou relevantní, protože podpírají volbu instrukcí jako nezávislé proměnné a iterativní práce s nimi.

`Out`:

> Široký přehled všech frameworků pro autonomní agenty, pokud z nich nevybíráme metodiku ani je neporovnáváme.

### Strukturní varování

Když sekce roste a nevíš, co škrtat, většinou není problém v detailech,
ale v tom, že není dost jasný claim sekce. Jakmile víš, co přesně sekce
má dokázat, nadbytečný materiál začne být vidět sám.

## 7. Jak odlišit teorii od metodiky a diskuse

Tohle je jedna z nejčastějších záměn.

| Vrstva | Hlavní otázka | Typická slovesa | Typická evidence |
|--------|----------------|-----------------|------------------|
| Teorie | Co o problému víme a jaké pojmy potřebujeme? | definuje, rozlišuje, ukazuje, naznačuje | literatura, standardy, přehledové studie |
| Metodika | Jak jsme to v této práci převedli do konkrétního postupu? | volíme, měříme, používáme, nastavujeme | odůvodněný návrh vlastního postupu |
| Výsledky | Co se v bězích stalo? | dosáhl, kleslo, splněno, selhalo | naměřená data, tabulky, artefakty |
| Diskuse | Co to znamená vzhledem k cílům a literatuře? | naznačuje, podporuje, oslabuje, ukazuje limit | interpretace dat, srovnání s literaturou |

### Teorie

Příklad:

> Mutation testing zachycuje slabiny testů, které strukturální coverage nemusí odhalit.

To je teoretické tvrzení opřené o literaturu.

### Metodika

Příklad:

> Z tohoto důvodu v této práci měříme kvalitu agentových testů metrikou Q3 pomocí nástroje Stryker.

To už je metodika. Říkáš, co děláš ty.

### Výsledky

Příklad:

> V běhu B-2 dosáhla Q2 hodnoty 11/42, zatímco Q3 zůstala na 72 %.

Tady jen popisuješ data.

### Diskuse

Příklad:

> Kontrast mezi Q2 a Q3 naznačuje, že agent dokázal napsat testy, které by v korektní implementaci zachytily chyby, ale selhal v samotné implementaci logiky.

To je interpretace. Už neříkáš jen "co se stalo", ale "co to znamená".

### Praktický test

Když si nejsi jistý, do které vrstvy věta patří, zkus se zeptat:

- Je tahle věta pravdivá i bez ohledu na naši konkrétní případovou studii? Pak je to nejspíš teorie.
- Popisuje tahle věta naši konkrétní volbu postupu? Pak je to metodika.
- Popisuje tahle věta konkrétní číslo nebo artefakt z běhu? Pak jsou to výsledky.
- Spojuje tahle věta data s významem nebo s literaturou? Pak je to diskuse.

## 8. Konkrétní mini-příklady pro naši BP

### A. Od topicu k problému

Slabé:

> Tato práce se zabývá AI coding agenty a instrukcemi v AGENTS.md.

Lepší:

> Tato práce řeší problém, že současné benchmarky AI coding agentů typicky zachycují hlavně funkční výsledek, ale neposkytují praktikovi dostatečný obraz o tom, zda agent pracuje procesně disciplinovaně a produkuje udržitelný kód. Proto navrhujeme sadu metrik a iterativní postup návrhu instrukcí.

### B. Od přehledu k syntéze

Slabé:

> ISO 25010 popisuje kvalitu software. Fenton a Bieman rozlišují proces, produkt a zdroje. Benchmarky agentů často používají pass/fail.

Lepší:

> Standard ISO 25010 ukazuje, že kvalitu software nelze redukovat na jedinou charakteristiku, zatímco Fenton a Bieman rozlišují různé typy měřených entit. Ve spojení s tím, že benchmarky agentů často hodnotí hlavně pass/fail výsledek, vzniká argument pro metrický rámec, který vedle correctness zachytí i proces a efektivitu.

### C. Od teorie k metodice

Slabé:

> V literatuře se píše o mutation testingu. V této práci používáme Stryker. Dále používáme ESLint a Vitest.

Lepší:

> Protože literatura ukazuje, že samotná coverage nevypovídá dost o schopnosti testů zachytit chyby, zařazujeme do metodiky mutation testing jako metriku Q3. Analogicky volíme statickou analýzu pro ty aspekty kvality kódu, které lze hodnotit deterministicky.

### D. Bridge mezi `kap02` a `kap03`

Slabé:

> V další kapitole popíšeme metodiku.

Lepší:

> Předchozí kapitola ukázala, že pro naši úlohu jsou klíčové tři dimenze: proces, kvalita produktu a efektivita. Následující kapitola proto tyto dimenze operacionalizuje do konkrétních metrik a popisuje experimentální design, který umožní sledovat pouze vliv instrukcí.

### E. Oponentova otázka na scope

Otázka:

> Proč v teorii vůbec řešíte code review a branching, když případová studie měří hlavně testy a kvalitu kódu?

Dobrá odpověď:

> Protože cílem práce není jen posoudit funkční výsledek, ale navrhnout sadu metrik pokrývající proces i kvalitu. Praktiky jako branching a code review proto nejsou učebnicová vata, ale teoretické východisko pro procesní metriky a pro argument, že benchmark zaměřený jen na correctness zachycuje problém neúplně.

### F. Oponentova otázka na hranici teorie a metodiky

Otázka:

> Proč je část o LLM-as-judge v teorii a část v metodice?

Dobrá odpověď:

> V teorii potřebujeme vysvětlit, proč tento způsob hodnocení vůbec dává smysl a jaké má známé limity. V metodice pak říkáme, jak přesně jsme ho v této práci aplikovali: jaký model, jakou škálu a pro které metriky.

## 9. Praktický pracovní postup pro psaní jedné sekce

Když sedíš nad novou sekcí a nevíš, jak začít, nepiš hned text. Nejdřív
si napiš těchto pět věcí.

### 1. Jaký claim má sekce unést?

Jedna věta. Ne tři odstavce. Jedna věta.

Příklad:

> Pro naši práci nestačí chápat kvalitu software jen jako correctness, protože navrhované metriky mají zachytit i proces a udržovatelnost.

### 2. Jaký problém čtenáři tím pomáhám vyřešit?

Příklad:

> Bez této sekce by nebylo jasné, proč později zavádíme i nefunkční a procesní metriky.

### 3. Jaký typ sekce to je?

Například:

- definiční
- syntetická
- srovnávací
- bridge

To rozhoduje o vnitřní stavbě textu.

### 4. Jaké minimum zdrojů opravdu potřebuji?

Ne "co všechno jsem našel", ale "bez čeho ten claim neobhájím".

### 5. Jak z ní povedu čtenáře dál?

Už při psaní první věty bys měl vědět, na jakou další sekci sekce
navazuje.

## 10. Nejčastější selhání a jak je poznat

### Teorie jako encyklopedie

Příznak:

- hodně definic
- hodně autorů
- po dočtení není jasné, co z toho plyne pro BP

Oprava:

- napiš explicitně, proč je každý blok v textu
- přidej syntetickou větu "z toho pro naši práci plyne..."

### Cíl jako popis textu

Příznak:

- "cílem je popsat", "seznámit", "analyzovat problematiku"

Oprava:

- přepiš cíl na něco, co řeší odborný problém a připouští ověření

### Přeskok z tématu rovnou do metodiky

Příznak:

- čtenář neví, proč zrovna tyto metriky nebo tyto volby

Oprava:

- doplň v `kap02` rámec a argument, ne jen další odstavce v `kap03`

### Diskuse bez opory

Příznak:

- autor vysvětluje výsledky, aniž by předtím připravil potřebné pojmy nebo literaturu

Oprava:

- vrať se a zkontroluj, jestli teorie opravdu připravila půdu pro interpretaci

### Scope creep

Příznak:

- sekce roste, ale neostří claim
- text je "zajímavý", ale metodice ani diskusi nepomáhá

Oprava:

- vrať se k problému a k cíli kapitoly
- neřeš, co je škoda vyhodit
- řeš, co je nutné pro obhajobu

## 11. Krátká mantra pro tuto BP

Pokud si máš z této příručky odnést jen několik vět, tak tyto:

- Téma nestačí. Potřebuješ otázku a problém.
- Relevance není "AI je důležité", ale "co bez této odpovědi neumíme dobře posoudit nebo rozhodnout".
- Teorie nemá být přehled všeho. Má připravit metodiku a diskusi.
- Každá sekce musí mít claim, důkaz a bridge.
- Scope neurčuje zajímavost tématu, ale potřeba argumentu.
- Když si nejsi jistý, ptej se: proč to tady je a co z toho plyne pro další kapitolu?

## 12. Sebekontrola před odevzdáním sekce

Na závěr několik otázek, které odpovídají tomu, co by se pravděpodobně
ptal oponent:

- Jaký problém tato sekce pomáhá řešit?
- Proč nestačilo nechat jen topic a nepřidávat tuto argumentaci?
- Jak přesně tato sekce připravuje půdu pro další kapitolu?
- Které pojmy z této sekce později skutečně používám?
- Který odstavec je zde jen "zajímavý navíc" a mohl by pryč?
- Kde přesně odděluji, co je ze zdrojů, co je moje syntéza a co je interpretace výsledků?
- Kdyby mi oponent řekl "tohle je moc široké", co z této sekce bych obhájil jako nezbytné?

Pokud na dvě nebo tři z těchto otázek neumíš odpovědět, problém obvykle
není v jednotlivých větách, ale v tom, že sekce ještě nemá dost ostrou
roli.
