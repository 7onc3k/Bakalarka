# Stylisticky a formatovaci guide thesis

Zivy dokument pro konzistenci napric praci. Nepopisuje, jak psat vedecky obecne;
to resi `notes/jak-psat-vedecky.md`. Tady ukladame lokalni rozhodnuti pro tuto
thesis: jak zapisujeme metriky, vycty, zavorky, cizi terminy, tabulky a audit
trail.

## Role dokumentu

Pouzij pri revizi kapitoly, kdyz se rozhoduje o tvaru textu. Dokument nema byt
sablona na kazdy odstavec. Je to sada rozhodnuti, ktera maji branit tomu, aby se
stejna vec v kap03, kap04 a kap05 zapisovala pokazde jinak.

Zakladni pravidlo: nejdriv rozhodni funkci bloku, potom jeho tvar.

| Funkce bloku | Preferovany tvar |
|---|---|
| Definice pojmu | veta nebo kratky odstavec |
| Operacionalizace metriky | stabilni pattern: co meri, zdroj dat, podminka |
| Kratke dovysvetleni | zavorka |
| Vycteni slozek | dvojtecka + seznam nebo description list |
| Interpretace vysledku | pozorovani, interpretace, implikace |
| Audit trail | ponechat citelny, ale nesjednocovat mechanicky |

## Dvojtecka, zavorky, seznam

Dvojtecka se pouziva, kdyz pred ni stoji cela veta a za ni nasleduje vycet,
podminka, zdroj dat nebo operacionalizace.

Pouzivat:

```tex
Specifikace obsahuje:
```

```tex
Podminka splneni je: vsechna PR tela obsahuji odkaz na issue.
```

Nepouzivat dvojtecku jako nahradu za plynuly akademicky text, pokud za ni
nasleduje jen jedna myslenka, ktera by prirozene patrila do vety.

Zavorky se pouzivaji jen pro kratky alias, preklad, kod metriky, rozsah nebo
odkaz.

Pouzivat:

```tex
funkcni vhodnost (\acs{Q1}--\acs{Q4})
LLM-as-judge (GLM-5)
```

Vyhnout se dlouhym zavorkam, ktere obsahuji samostatne tvrzeni. Takove tvrzeni
ma byt veta.

Spatny signal:

```tex
\acs{Q2} (poměr projitých testů, variabilní, opakovaně problematický)
```

Lepsi tvar:

```tex
\acs{Q2} meri pomer projitych referencnich testu. V datech patri mezi
nejvariabilnejsi produktove metriky.
```

## Citace a zavorky

V teto thesis je `\cite{...}` pres `thesis/biblatex-setup.tex` namapovane na
APA zavorkovou citaci (`\parencite`). Prakticky to znamena: `\cite{key}` samo
vysazi zavorku. Nedavat ho proto dovnitr dalsi zavorky.

Problemovy vzor:

```tex
frameworky ve trech dimenzich (effectiveness, efficiency a overhead
\cite{yin2025agents})
```

Lepsi tvar:

```tex
Yin et al.~\cite{yin2025agents} hodnoti agentni frameworky ve trech
dimenzich: effectiveness, efficiency a overhead.
```

Nebo:

```tex
Agentni frameworky lze hodnotit ve trech dimenzich: effectiveness, efficiency
a overhead~\cite{yin2025agents}.
```

Kdyz je ve vete uz zavorka s vysvetlenim, citace patri mimo ni nebo se veta
preformuluje.

Problemovy vzor:

```tex
LLM-as-judge (automaticke hodnoceni modelem \cite{zheng2023}) ...
```

Lepsi tvar:

```tex
LLM-as-judge oznacuje automaticke hodnoceni modelem~\cite{zheng2023}.
```

Pravidlo: jedna zavorka ma mit jednu funkci. Bud vysvetluje pojem, nebo nese
citaci, nebo obsahuje odkaz na sekci. Pokud by vznikly zavorky v zavorkach,
prepsat vetu.

## Citace a claim boundary

Citace patri k presnemu tvrzeni, ktere podpira. Nedavat ji mechanicky na konec
dlouheho odstavce, pokud odstavec obsahuje vice ruznych tvrzeni.

Preferovany tvar:

```tex
Mutation testing hodnoti silu testovaci sady tim, ze sleduje, zda testy
odhali umele vlozene zmeny v kodu~\cite{papadakis2019}.
```

Slaby tvar:

```tex
Testy lze hodnotit mnoha zpusoby. Coverage je bezna, mutation testing je
silnejsi a TDD meni proces vyvoje~\cite{papadakis2019}.
```

Kdyz je autor soucast argumentu nebo srovnani, pouzit autorsky tvar:

```tex
Fenton a Bieman~\cite{fenton2014} rozlisuji proces, produkt a zdroje.
```

Kdyz autor neni dulezity a zdroj jen podporuje tvrzeni, dat citaci na hranici
tvrzeni:

```tex
Metriky softwaru lze rozdelit podle toho, zda meri proces, produkt nebo
zdroje~\cite{fenton2014}.
```

Jedna citace muze podporit souveti, pokud cele souveti nese jeden claim. Pokud
jsou ve vete dve ruzne veci, rozdelit vetu nebo dodat zdroj k obema castem.

## Vycet a description list

Kdyz vycet definuje srovnatelne polozky, vsechny polozky maji mit stejny
gramaticky tvar.

Preferovany tvar pro komponenty artefaktu:

```tex
\begin{description}
    \item[Acceptance criteria.] Popisuji ocekavane chovani ve formatu
    Given/When/Then.
    \item[API kontrakt.] Definuje verejnou funkci a datove typy.
\end{description}
```

V `itemize` nepouzivat stridave:

- `\textbf{Nadpis}: veta`
- `\textbf{Nadpis} veta`
- `\textbf{Nadpis}` a potom fragment bez slovesa

Vyjimka: tabulky a audit trail mohou byt zkracene, pokud nejdou do finalniho
PDF nebo maji jasnou pracovni funkci.

## Metriky a acro makra

V thesis prose nepouzivat bare kody typu `P1`, `Q3`, `E2`. Pouzivat makra z
`thesis/makra.tex`.

Pravidlo:

- `\ac{X}` pri prvnim smysluplnem vyskytu v lokalni sekci.
- `\acs{X}` pri opakovani v blizkem kontextu.
- Skupiny metrik nepretezovat vypoctem kodu, pokud existuje pojmenovana skupina.
- V kap02 nase P/Q/E kody nepouzivat, pokud nejde o audit trail.

V textu neduplikovat vysvetleni, ktere uz nese acro nebo okolni veta.

Problemovy vzor:

```tex
\acs{P5} (testy nezmeneny) selhalo.
```

Lepsi tvar:

```tex
\ac{P5} selhalo: agent upravil vlastni testy po implementaci.
```

U metriky v metodice drzet stabilni pattern:

1. Co metrika meri.
2. Z jakeho artefaktu se pocita.
3. Jak vypada splneni nebo skore.
4. Jakou limitaci ma.

## Nadpisy, paragraphy a mikrosekce

`\section`, `\subsection` a `\subsubsection` pouzivat pro strukturu, ktera patri
do obsahu a ma samostatnou roli v argumentu. `\paragraph{}` pouzivat jen pro
kratke vnitrni cleneni delsi sekce, kdy by dalsi cislovana uroven pusobila
tezce.

Dobry `\paragraph{}`:

```tex
\paragraph{Kvalita testu.}
```

Pouzit, kdyz nasleduje blok, ktery:

- ma vlastni mini-claim,
- je rovnocenny s okolnimi paragraphy,
- pomaha ctenari skenovat delsi interpretaci,
- ale nepotrebuje samostatnou cislovanou sekci.

Nepouzivat `\paragraph{}` jako nahradu za tucne zvyrazneni jedne vety. Kdyz
nadpis neotevira skutecny blok, nechat vetu v plynulem textu.

`\textit{}` nadpisy uvnitr sekci pouzivat jen jako lehci cleneni tam, kde by
`\paragraph{}` bylo prilis silne. V jedne lokalni sekci nemichat bez duvodu
`\paragraph{}` a samostatne `\textit{...}` nadpisy pro stejnou uroven cleneni.

Nazvy paragraphu drzet kratke:

- dobre: `\paragraph{Procesni metriky.}`
- horsi: `\paragraph{Procesni metriky jako hlavni prinos nad existujicimi benchmarky.}`

## Tabulky, grafy a captions

Caption ma rict, co tabulka nebo obrazek ukazuje. Hlavni text ma rict, proc je
to dulezite pro argument.

Caption:

```tex
\caption{Souhrn metrik napric pilotnimi a ablacnimi behy}
```

Text:

```tex
Tabulka~\ref{tab:souhrn} ukazuje, ze nejvyssi variabilitu mely procesni
metriky. To podporuje interpretaci, ze dodrzovani pracovního postupu je
citlivejsi na nedeterminismus modelu nez zakladni staticka kvalita kodu.
```

Neopisovat v textu vsechny radky tabulky. Pokud veta jen opakuje hodnotu, ktera
je z tabulky primo videt, pravdepodobne ma byt smazana nebo nahrazena
interpretaci.

Caption nemá nest metodickou obhajobu, limitaci ani interpretaci, ktera patri do
textu. Vyjimka jsou technicke poznamky nutne pro cteni tabulky, napr. `n/a`,
historicka oprava skore nebo chybejici artefakt.

Odkaz na obrazek nebo tabulku patri pred interpretaci nebo do vety s pozorovanim,
ne az po dlouhem odstavci.

## Cisla, jednotky a specialni hodnoty

Pouzivat konzistentni zapis:

| Typ | Tvar |
|---|---|
| Pocet z celku | `25/25`, `41/42` |
| Procenta | `70\,\%`, `16{,}2\,\%` |
| Minuty | `24{,}8~min` nebo `24{,}8 min` podle okolni tabulky |
| Penize | pokud je castka v USD, drzet `$0,17`; pokud v Kc, pouzit `Kc` jen v pracovnim textu a ve finalu radeji `Kč` |
| Rozsah | `r1--r5`, `P1--P5`, `35--37/42` |
| Neaplikovatelne | `n/a` v tabulkach |
| Chybejici hodnota | `---` v tabulkach, vysvetlit poznamkou pokud ovlivnuje interpretaci |
| Splneno/nesplneno | v tabulce symbol nebo kratke slovo, v textu normalni veta |

V plynulem textu cislo pouzit jen kdyz nese argument. Jinak odkazovat na tabulku.

Rozdil mezi `n/a`, `---` a `0` musi byt vyznamove jasny:

- `0` znamena namerenou nulovou hodnotu.
- `n/a` znamena, ze metrika nedava smysl nebo neni aplikovatelna.
- `---` znamena chybejici nebo nedostupny udaj.

Pokud se specialni hodnota objevi v tabulce a muze ovlivnit zaver, pridat
kratkou poznamku pod tabulku.

## Terminologie

Kanonicke pojmy jsou v `thesis/TERMINOLOGIE.md`. Tento guide resi jen styl
zapisu.

Dulezite lokalni konvence:

| Pouzit | Nepouzivat v hlavnim textu |
|---|---|
| instrukce | instrukcni sada |
| pracovni postup | workflow, pokud nejde o prvni vysvetleni nebo citovany pojem |
| verifikacni krok | checkpoint, kontrolni krok |
| pripadova studie | experiment pro cely vyzkumny design |
| experimentalni beh | run, pokud nejde o infrastrukturu nebo audit trail |
| pilotni faze | pilotni iterace pro celou fazi |
| system upominek faktur | billing reminder, dunning system |

Anglicke industry terminy mohou zustat, kdyz jsou presnejsi nez ceska nahrada:
pull request, commit, issue, branch, LLM-as-judge, mutation testing. Pri prvnim
vyskytu v kapitole je vhodne pridat kratke vysvetleni, pokud neni pojem zrejmy
z kontextu.

## Anglictina vs cestina

Zakladni veta ma byt cesky. Anglicke terminy ponechat, kdyz jde o industry
standard nebo nazev artefaktu/nastroje, kde cesky preklad zhorsuje presnost.

Ponechat anglicky:

- issue, commit, branch, pull request
- LLM-as-judge
- mutation testing
- acceptance criteria, pokud se mluvi o konkretnim formatu v issue
- API contract, pokud odkazuje na pojmenovanou cast specifikace
- Package Quality, Process, Constraints, pokud jde o nazvy sekci v `AGENTS.md`

Prekladat nebo cesky vysvetlit:

- workflow -> pracovni postup, pokud nejde o citovany/nazvovy kontext
- checkpoint -> verifikacni krok, pokud nejde o novy future-work mechanismus,
  ktery se teprve definuje
- billing reminder / dunning system -> system upominek faktur
- experiment -> pripadova studie pro celek, experimentalni beh pro jednotlive
  spusteni

Pri prvnim vyskytu terminu v kapitole:

```tex
pracovni postup (\textit{workflow})
```

Pak uz pouzivat cesky termin, pokud neni duvod drzet anglicky nazev.

Nazvy sekci v `AGENTS.md` neprekladat, kdyz se mluvi o konkretni sekci:

```tex
Sekce Process obsahuje verifikacni kroky.
```

Kdyz se mluvi obecne o typu obsahu, prelozit:

```tex
Procesni cast instrukci obsahuje verifikacni kroky.
```

## Cizi terminy a zvyrazneni

`\textit{}` pouzivat pro prvni zavedeni ciziho nebo odborného terminu, ne jako
obecne zvyraznovatko.

`\texttt{}` pouzivat pro:

- soubory: `\texttt{AGENTS.md}`
- prikazy: `\texttt{tsc --noEmit}`
- kodove identifikatory: `\texttt{process(state, event, now)}`
- vystupy nastroju nebo nazvy poli

`\textbf{}` v hlavnim textu pouzivat stridme. Patri hlavne do pracovnich
poznamek, nadpisu polozek nebo tabulek, ne do plynule akademicke prozy.

## Textova prace s cisly

Text nema opisovat celou tabulku. Text ma vybrat trend nebo jednu hodnotu,
ktera nese argument.

Preferovany pattern:

```tex
Odebrani verifikacnich kroku zhorsilo procesni stabilitu. V jednom ze dvou
behu agent prestal dodrzovat pracovni postup, prestoze instrukce mimo
verifikacni kroky zustaly stejne (tabulka~\ref{...}).
```

Ne:

```tex
P2 bylo splneno v A-1 a nesplneno v A-2, P3 bylo...
```

Cisla patri do textu, kdyz:

- jsou rozhodujici pro claim,
- ukazuji kontrast,
- opravuji intuici,
- nebo jsou potrebna pro replikovatelnost.

Jinak patri do tabulky.

## Pozorovani, interpretace, implikace

Ve vysledcich a diskuzi drzet tri vrstvy oddelene:

1. Pozorovani: co data ukazuji.
2. Interpretace: proc se to pravdepodobne stalo.
3. Implikace: co to znamena pro cil prace nebo dalsi postup.

Dobry tvar:

```tex
V obou ablacnich behach bez Package Quality zustaly automatizovane metriky
kodu na podobne urovni, ale \ac{Q8} klesla. To naznacuje, ze sekce Package
Quality ovlivnila hlavne strukturální vlastnosti, ktere lint a typecheck
nezachycuji. Zaver je proto zalozen na judge-based metrice a ma podpurnou,
ne definitivni vahu.
```

Slaby tvar:

```tex
Package Quality je dulezita pro design.
```

Kdyz jde o spekulaci, oznacit ji jako interpretaci nebo alternativni vysvetleni.
Kdyz jde o fakt z dat, nehedgovat zbytecne.

## Claim strength

Case study claims formulovat jako indikativni zjisteni, ne jako obecny dukaz.

Pouzivat:

- data naznacuji
- je konzistentni s
- v teto pripadove studii
- na teto uloze
- podporuje interpretaci
- ukazalo se jako informativni

Vyhnout se:

- dokazuje
- prokazuje obecne
- nutne vede k
- jednoznacne potvrzuje
- univerzalne plati

Kdyz zavěr stoji na judge-based metrice, rict to explicitne a zeslabit claim.

## RAW, DRAFT a audit trail

`raw` a `draft` jsou audit trail, ne zdroj pravdy. Nesjednocovat je mechanicky
jen kvuli stylu. Resit jen kdyz:

- blok omylem leze do finalniho textu,
- obsahuje aktualni rozpor s thesis truth,
- nebo mate ctenare/validatora, protoze vypada jako finalni tvrzeni.

Ve finalnim textu nesmi zustat pracovni zkratky typu `HOTOVO`, `DOPLNIT`,
`PRO`, `PROTI`, pokud nejsou uvnitr skryteho audit trailu.

## Final-clean gate

Pred odevzdanim nebo clean buildem nesmi ve finalnim textu zustat:

- `TODO`, `DOPLNIT`, `HOTOVO`, `PRO`, `PROTI`
- raw formulace mimo `raw`/`draft`
- bare metriky v plynule proze, kde maji byt acro makra
- dlouhe vysvetlovaci zavorky s vlastnim claimem
- citace uvnitr vysvetlovaci zavorky
- silne generalizace bez opory
- `workflow`, `checkpoint`, `instrukcni sada`, pokud nejde o povolenou vyjimku
- popis tabulky misto interpretace
- nadpis, ktery neotevira skutecny blok
- metodicke sliby typu "bude popsano pozdeji" bez konkretniho odkazu nebo bridge

Kontrolovat hlavne clean export, ne raw pracovni soubory. `raw`/`draft` bloky
jsou audit trail, ale nesmi vypadat jako finalni thesis truth, pokud se nekdy
zobrazi v draft buildu.

## Odkazy a kapitoly

Forward reference pouzit jen tehdy, kdyz ctenar potrebuje vedet, kde se vec
později operacionalizuje nebo vyhodnocuje. Nepouzivat ho jako nahradu za
logicky bridge.

Dobry odkaz:

```tex
Operationalizaci techto metrik popisuje sekce~\ref{sec:sada-metrik}.
```

Slaby odkaz:

```tex
Toto bude dulezite v kapitole~\ref{kap:metodika}.
```

## Rychla kontrola pri revizi

Pred dokoncenim sekce projit:

1. Ma kazdy blok jasnou funkci?
2. Neobsahuje zavorka samostatny claim?
3. Neni citace schovana uvnitr vysvetlovaci zavorky?
4. Jsou vycty gramaticky paralelni?
5. Je citace umistena u presneho claimu?
6. Jsou metriky psane pres acro makra?
7. Neopisuje text tabulku misto interpretace?
8. Jsou cisla a specialni hodnoty zapsane konzistentne?
9. Neni claim silnejsi nez data?
10. Nepouziva se pojem, ktery `TERMINOLOGIE.md` zakazuje?
11. Neni v kap02 zaneseny jazyk kap03/kap04?
12. Nezbyly ve finalnim textu pracovni znacky?
