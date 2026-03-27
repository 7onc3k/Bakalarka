# Bakalářská práce — text k recenzi
Generováno: 2026-03-26
Soubory: uvod.tex, kap01.tex, kap02.tex, kap03.tex, kap04.tex, kap05.tex, zaver.tex
Poznámka: RAW bloky (poznámky, audit trail) byly odstraněny. Posíláme pouze DRAFT + finální text.

## Statistika (řádky v orig. zdrojích)
- uvod.tex: finální=2, draft=26, raw=0 (odstraněno)
- kap01.tex: finální=5, draft=52, raw=82 (odstraněno)
- kap02.tex: finální=61, draft=0, raw=519 (odstraněno)
- kap03.tex: finální=96, draft=446, raw=195 (odstraněno)
- kap04.tex: finální=93, draft=854, raw=103 (odstraněno)
- kap05.tex: finální=30, draft=416, raw=98 (odstraněno)
- zaver.tex: finální=2, draft=37, raw=0 (odstraněno)

---

\chapter*{Úvod}
\addcontentsline{toc}{chapter}{Úvod}

— [DRAFT] —
AI agenti se stávají součástí softwarového vývoje: dokáží implementovat
funkcionalitu, psát testy, spravovat verzovací historii a komunikovat
prostřednictvím issues a pull requestů. Kvalita jejich výstupu však
závisí na instrukcích, které dostanou — na obsahu souboru
`AGENTS.md` definujícího pracovní postup, omezení a kontext projektu. Jak tyto instrukce
systematicky navrhovat a jak měřit, zda agent dodržuje požadované
praktiky, zůstává otevřenou otázkou.

Tato práce navrhuje sadu 19 metrik ve třech kategoriích — procesní
(P1–P8), produktové (Q1–Q8) a metriky efektivity (E1–E3) —
které měří nejen výsledek, ale i proces a kvalitu práce agenta.
Na případové studii systému upomínek faktur demonstruje iterativní
postup návrhu instrukcí s využitím těchto metrik a komparativními
variacemi (ablacemi) identifikuje, které složky instrukcí
přispívají k měřenému chování agenta. Sadu metrik a postup ověřujeme na případové studii jednoho
projektu [yin2018].

Práce je členěna do pěti kapitol. Kapitola [ref:kap:vymezeni] vymezuje
problém, formuluje tři cíle práce a ohraničuje její rozsah.
Kapitola [ref:kap:teorie] shrnuje teoretická východiska: softwarové
inženýrství a životní cyklus vývoje, AI coding agenty, scaffolding
a instrukce a měření kvality softwaru.
Kapitola [ref:kap:metodika] popisuje metodiku — výzkumný přístup,
sadu metrik, experimentální design a omezení validity.
Kapitola [ref:kap:prakticka-cast] zachycuje průběh případové studie:
pilotní fázi pěti iterací a komparativní variace.
Kapitola [ref:kap:vyhodnoceni] interpretuje výsledky ve vztahu
k cílům práce, porovnává je s existujícím výzkumem a diskutuje limity.
— [/DRAFT] —

---

# Vymezení problému a cílů práce

## Motivace

— [DRAFT] —
AI agenti se používají k vývoji softwaru, ale výsledky ukazují že to není tak
jednoduché jak se čekalo. Randomizovaná studie METR [metr2025] na 246
úlohách ukázala, že s AI nástroji byli vývojáři o 19 % pomalejší. Agent
často produkuje funkční výstup, nedodržuje přitom vývojové praktiky: slučuje
nesouvisející změny, přeskakuje testy, ignoruje specifikaci.

Otázka není jen jestli agent úkol vyřešil, ale jak. Existující benchmarky jako
SWE-bench [swebench2024] měří pouze výsledek: vyřešil agent úkol, ano
nebo ne. Kvalitu práce, transparentnost procesu a možnost řídit chování agenta
v průběhu vývoje tyto benchmarky nepostihují. Agent může hlásit úkol jako
dokončený, přestože implementace pokrývá jen část požadavků, a bez metrik
procesu to není jak systematicky odhalit.

Chování agenta lze přizpůsobit trénováním modelu (fine-tuning) nebo instrukcemi
v kontextovém okně (in-context learning). Shin et al. [shin2025prompt]
ukazují, že automatizované prompty systematicky nepřekonávají
fine-tuned modely, ale iterativní zpřesňování instrukcí výrazně
zlepšuje výsledky na úlohách s kódem. S rostoucí
velikostí kontextových oken se instrukce stávají praktičtější alternativou:
jsou dostupné komukoliv, iterativně upravitelné a neomezují emergentní
schopnosti modelu. Pro trénování modelů existují zavedené postupy; pro
systematické navrhování a vyhodnocování instrukcí obdobný postup dosud nevznikl.

Tato práce navrhuje evaluační systém který měří nejen výsledek, ale i proces
a kvalitu práce agenta, a popisuje postup jak s jeho pomocí iterativně
vylepšovat instrukce.
— [/DRAFT] —

## Cíle práce

— [DRAFT] —

    - Navrhnout sadu metrik která měří proces a kvalitu práce AI agenta,
          ne jen výsledek.
    - Iterativním postupem navrhnout instrukce které dovedou agenta
          k dodržování stanovených exit kritérií.
    - Ablacemi identifikovat, které složky instrukcí přispívají
          k měřenému chování agenta a které jsou redundantní.

— [/DRAFT] —

## Rozsah práce

— [DRAFT] —
Evaluační systém a postup pro návrh instrukcí nelze navrhnout čistě
teoreticky. Je potřeba je ověřit v praxi: ukázat, že metriky skutečně
zachytí rozdíly v chování agenta, když dostane jiné instrukce, a že
iterativní postup vede ke zlepšení. K tomu slouží případová studie, ve
které opakovaně pouštíme agenta s různými variantami instrukcí a pokaždé
měříme, co se změnilo.

Aby bylo možné vliv instrukcí měřit, musí být všechno ostatní stejné:
model, nástroje, specifikace i výchozí stav repozitáře. Jedinou proměnnou
jsou instrukce které agent dostane. Kdyby se měnilo víc věcí najednou,
nebylo by jasné, co způsobilo změnu v chování.

Případová studie probíhá na jednom projektu: systému upomínek faktur. Jde
o projekt s deterministickou logikou, kde stejný vstup vždy dá stejný výstup.
To je důležité, protože výsledky lze ověřit automatizovanými testy, ne
subjektivním posouzením. Agent pracuje od specifikace k implementaci,
tedy od požadavků přes návrh po funkční kód a testy.

Práce neporovnává různé modely ani programovací jazyky a neporovnává agenta
s lidským vývojářem. Navržený evaluační systém a iterativní postup jsou
koncipovány obecně: kdokoli je může vzít a použít na svém projektu s vlastními
prahy. Konkrétní instrukce a naměřené hodnoty platí pro tuto případovou studii.
Zdůvodnění volby projektu a podrobnosti experimentálního designu popisuje
kapitola [ref:kap:metodika].
— [/DRAFT] —

---

# Teoretická východiska

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
## Softwarové inženýrství a životní cyklus

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% === 2.1.1 ===
### Definice a komplexita software

% === 2.1.2 ===
### Fáze životního cyklu

% === 2.1.3 ===
### Modely a metodiky

% === 2.1.4 ===
### Měření kvality software

#### Klasifikace softwarových metrik

#### Testování a mutation testing

#### Statická analýza a složitost kódu

#### LLM-as-judge

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
## AI coding agenti a scaffolding

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% === 2.2.1 ===
### Základní pojmy

% === 2.2.2 ===
### Typy coding agentů

% === 2.2.3 ===
### Jak agenti mění SDLC

% === 2.2.4 ===
### Problém kontextu

% === 2.2.5 ===
### Přístupy k memory a kontextu

% === 2.2.6 ===
### Struktura instrukcí

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
## Evaluace agentů a instrukcí

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% === 2.3.1 ===
### Hodnocení agentů a benchmarky

% === 2.3.2 ===
### Evaluace instrukcí

%% ==========================================================================
%% Audit trail — zrušené sekce
%% ==========================================================================

---

# Metodika

%% ==========================================================================
%% 3.1 Výzkumný přístup
%% ==========================================================================

## Výzkumný přístup

— [DRAFT] —
Navrhujeme sadu metrik a iterativní postup pro hodnocení AI coding
agentů. Ověřujeme je na případové studii systému upomínek faktur:
opakovaně pouštíme agenta s různými variantami instrukcí a pokaždé
měříme, co se změnilo. Tento přístup — navrhovat řešení, ověřovat
ho v praxi a na základě výsledků upravovat — odpovídá iterativnímu
cyklu návrhu a vyhodnocení [hevner2004, peffers2008].

V naší práci tento cyklus realizujeme čtyřmi kroky: Spuštění (spustit
agenta), Měření (změřit výstup), Diagnóza (identifikovat příčiny)
a Úprava (upravit instrukce). Podrobný popis kroků uvádí
sekce [ref:sec:pilotni-iterace]. Postup má dvě fáze: pilotní
iterace, kde cyklus opakujeme dokud agent nesplní stanovená exit
kritéria (sekce [ref:sec:pilotni-iterace]), a komparativní variace,
kde z fungujících instrukcí systematicky odebíráme jednotlivé části
a měříme dopad na chování agenta
(sekce [ref:sec:komparativni-variace]).

Pro ověření jsme zvolili případovou studii na jednom projektu.
Řízený experiment by vyžadoval
dostatečný počet běhů pro statistickou sílu, což je při ceně jednoho
běhu (tisíce tokenů, desítky minut) nepraktické. Případová studie
umožňuje opakované běhy s různými instrukcemi a podrobnou analýzu
každého běhu. Z jednoho projektu nelze statisticky generalizovat;
Yin [yin2018] pro tento typ výzkumu používá pojem analytická
generalizace — na jednom případu ukazujeme princip, který lze
ověřit na dalších projektech. Yin tento design nazývá embedded
single-case: zkoumáme jeden projekt, ale v rámci něj provádíme více
běhů agenta, z nichž každý má vlastní instrukce, git historii
a sadu naměřených metrik.

**Evaluační kritéria cílů.**
Každý cíl z kapitoly [ref:kap:vymezeni] vyžaduje vlastní kritérium,
podle kterého vyhodnotíme jeho splnění
(kapitola [ref:kap:vyhodnoceni]):

    - **Sada metrik** — metriky zachytí rozdíly v chování
          agenta mezi běhy s různými instrukcemi. Pokud by všechny
          metriky zůstaly konstantní bez ohledu na instrukce, sada by
          nebyla užitečná.
    - **Iterativní postup** — po iteracích agent splní více
          exit kritérií než na počátku. Exit kritéria
          (sekce [ref:sec:pilotni-iterace]) definují cíl iterativního
          postupu; evaluační kritérium je, zda postup k tomuto cíli
          prokazatelně směřuje, nikoliv zda jsou exit kritéria splněna
          beze zbytku.
    - **Ablace** — odebrání složky instrukcí způsobí
          měřitelnou změnu alespoň v jedné metrice oproti běhu se
          všemi složkami. Pokud se po odebrání nic nezmění, složka je
          redundantní.

— [/DRAFT] —

%% ==========================================================================
%% 3.2 Sada metrik
%% ==========================================================================

## Sada metrik

%% KOSTRA: Úvod — proč tyto metriky (zdůvodnění volby), odkaz na
%%         Fenton  |  Bieman taxonomii (P/Q/E) z kap02.
%%         U každé metriky: co měří (1 věta), nástroj, práh, odkaz na kap02.
%%         Teorie metrik (co to je, proč je validní) je v kap02.
%%         Subsections: procesní, produktové, efektivita.
%%         LLM-as-judge teorie v kap02, aplikace u P2/Q4/Q8.

— [DRAFT] —
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
          přes kroky — vše v tisících vedle sebe), čas (E2) a stabilitu
          session (E3).
\end{description}

Výběr konkrétních metrik vychází z potřeb případové studie
a dostupných nástrojů; sada si neklade nárok na úplnost.
Teoretické základy jednotlivých metrik (proč jsou validní, jaká
je evidence) popisuje sekce [ref:sec:mereni-kvality]. Tato sekce
se zaměřuje na *jak* konkrétně měříme: jaký nástroj,
s jakou konfigurací, co je vstup a co výstup. U každé metriky
uvádíme v krátkosti co měří a pak podrobně jak.
— [/DRAFT] —

### Procesní metriky (P1–P8)

— [DRAFT] —
Procesní metriky [fenton2014] měří *jak* agent pracuje.
Instrukce v AGENTS.md definují strukturovaný vývojový postup: agent
má odvozovat práci ze specifikace, organizovat ji přes issues
a branches, psát testy před implementací a dokumentovat rozhodnutí
v commit messages a PR descriptions.

\subsubsection*{P1–P5: compliance (binární)}

**P1 (issues before code)** ověřuje, zda agent vytvořil issues
s timestampem před prvním kódovým commitem. Měříme porovnáním
`created\_at` nejstaršího agentova issue (GitHub API)
s časem prvního commitu obsahujícího soubory v `src/`
nebo `tests/`.

**P2 (branch per issue)** ověřuje, zda agent vytvořil pro každé
issue vlastní větev. Měříme počet remote branches (bez `main`)
vůči počtu issues: podmínka *branches \geq issues* je splněna
tehdy, nenastalo-li slučování více issues do jedné větve.

**P3 (test-first commits)** ověřuje, zda agent psal testy před
implementací. Primární indikátor: existuje alespoň jeden commit s prefixem
`test:` a zároveň alespoň jeden `feat:`. Přesnější
měření poskytuje behavioral trace (sekce [ref:sec:iterativni-cyklus]):
počet větví, kde první zápis do `src/` předcházel prvnímu
zápisu do `tests/` (`tddOrderViolations`).

**P4 (PRs linked to issues)** ověřuje, zda každý PR obsahuje
odkaz na issue. GitHub API vrací tělo PR; podmínka: všechna PR těla
obsahují regex `Closes \#N`.

**P5 (no existing test modifications)** ověřuje, že agent
nepřepisoval již existující testové soubory. Metrika zachycuje
`modified` změny (`-{`-diff-filter=M}) na testovacích
souborech, tedy situaci kdy agent dříve vytvořený test později upraví
místo toho, aby opravil implementaci. Nově přidané testy se do P5
nezapočítávají.

\subsubsection*{P6–P8: kvalita procesních artefaktů (LLM-as-judge)}

**P6 (commit message quality)** hodnotí popisnost commit messages:
atomicitu, konvenční prefix a srozumitelnost co a proč bylo změněno.
Hodnocení provádí LLM-as-judge na škále 1–3
(sekce [ref:sec:llm-as-judge-aplikace]).

**P7 (issue description quality)** hodnotí popisnost issue descriptions:
jasnost scope, přítomnost acceptance criteria, dostatečnost pro
implementaci. Hodnocení provádí LLM-as-judge na škále 1–3.

**P8 (PR description quality)** hodnotí popisnost PR descriptions:
přítomnost odkazu na issue, popis co a proč, dostatečnost pro
code review. Hodnocení provádí LLM-as-judge na škále 1–3.
— [/DRAFT] —

### Produktové metriky (Q1–Q8)

— [DRAFT] —
Produktové metriky [fenton2014] měří *co* agent vyrobil.
Pokrývají tři oblasti: funguje implementace správně (Q1–Q2), detekují
agentovy testy skutečné chyby (Q3–Q4) a je kód udržovatelný (Q5–Q8).

\subsubsection*{Funkční korektnost (Q1–Q2)}

**Q1 (API contract match)** ověřuje, zda agentův kód dodržuje
definované rozhraní. Referenční typy se importují a zkompilují proti
agentovu kódu (`tsc`). Výsledek je binární: typy sedí, nebo ne.
Q1 je vstupní podmínkou pro Q2: pokud agentův kód neimplementuje
správné API, referenční testy nelze ani zkompilovat, a výsledek Q2
by byl nesmyslný.

**Q2 (referenční test pass rate)** měří kolik z referenčních
testů projde na agentově implementaci. Vitest spustí 42 testů proti
agentovu kódu; výsledek je počet passing testů z 42. Testy ověřují
chování přes veřejné API (black-box,
sekce [ref:sec:testovani-mutation]), takže je lze spustit na
libovolném běhu nezávisle na interní struktuře. Konstrukce referenční
test suite popisuje sekce [ref:sec:ref-implementace-postup].

\subsubsection*{Kvalita testů (Q3–Q4)}

**Q3 (mutation score)** měří, jestli agentovy testy skutečně
detekují chyby (sekce [ref:sec:testovani-mutation]). Stryker
s konfigurací `-{`-mutate 'src/**/*.ts'} a mutátory pro
TypeScript (conditional, arithmetic, string, logical operators)
systematicky zavádí drobné změny do zdrojového kódu. Vstup: agentovy
testy + zdrojový kód. Výstup: procento zabitých mutantů z celkového
počtu.

**Q4 (AC coverage)** měří, kolik z 25 acceptance criteria má
odpovídající test v agentově test suite. Na rozdíl od Q2 (funguje
implementace?) se Q4 ptá, jestli agent *testoval všechno co měl*.
Judge dostane seznam 25 AC ze specifikace a agentovu test suite. Pro
každé AC určí, zda existuje test který ho pokrývá. Výstup: počet
pokrytých AC z 25. Hodnocení provádí LLM-as-judge
(sekce [ref:sec:llm-as-judge-aplikace]).

\subsubsection*{Kvalita kódu (Q5–Q8)}

**Q5 (lint warnings)** počítá varování a chyby z ESLint
s fixní konfigurací (pravidla: recommended + strict TypeScript rules).
Konfigurace je součástí experimentální infrastruktury, ne agentova
repo — agent ji nemůže měnit. Výstup: celkový počet warnings + errors.

**Q6 (typecheck errors)** počítá chyby z `tsc -{`-noEmit}
ve strict mode. Doplňuje počet explicitních `any` ve zdrojových
souborech (grep v `src/**/*.ts`) jako proxy pro obcházení
typového systému.

**Q7 (složitost kódu)** měří cyklomatickou složitost per funkce.
ESLint `complexity` rule reportuje funkce překračující
nastavený práh. Výstup: maximální složitost across all functions.
Práh \leq 10 per funkce vychází
z McCabe (sekce [ref:sec:staticka-analyza]).

**Q8 (design quality)** hodnotí aspekty které automatizované
nástroje nezachytí: pojmenování, oddělení zodpovědností, idiomatický
TypeScript, kvalita dokumentace a zbytečná komplexita. Hodnocení
provádí LLM-as-judge (sekce [ref:sec:llm-as-judge-aplikace]).
Celkové skóre Q8 je *minimum* pěti dimenzí, nikoliv průměr.
Volba minima je záměrná: jeden slabý rozměr má stáhnout celkový výsledek
dolů, aby slabiny nebyly maskované silnými dimenzemi.
— [/DRAFT] —

### Metriky efektivity (E1–E3)

— [DRAFT] —
Metriky efektivity měří zdroje spotřebované při vývoji. Nemají exit
kritérium a slouží k porovnání nákladů mezi iteracemi.

**E1 (vstup / výstup / Σ cache v tisících)** z exportu
`transcript.json` počítáme tak, aby šlo běhy srovnat:
**výstup** = součet `output`+`reasoning` přes všechny
asistentní kroky (celkově vygenerovaný text a reasoning);
**vstup** = **maximum** na jednom asistentním kroku ze součtu
`input`+`cache.read`+`cache.write`;
**Σ cache** = součet `cache.read`+`cache.write` přes
všechny zúčtované kroky (kumulativní účetnictví v exportu — může být
velké číslo, slouží k porovnání mezi běhy, ne jako jedna špička).
Důvod pro rozdělení: poskytovatel v exportu často **odděluje** část
promptu do `cache.read`; samotné pole `input` pak
podstatně **podhodnocuje** objem kontextu v jednom requestu.
**Součet vstupů přes všechny kroky neuvádíme** — opakovaně by
započítával stejný kontext v každém turnu a mezi běhy by vytvářel
nerealistické skoky (např.\ při delší session).
V tabulkách jsou tři složky v tisících tokenů, zaokrouhlené na celé
číslo (např.\ **115 / 60 / 11 528** u pilot-r1: max.\ vstup
vč. cache \approx115 000 na jednom kroku, součet výstupů
\approx60 000, součet cache \approx11{,}5 mil.\ tokenů).
**Diagnostické** ponecháváme `sumInputTokens` (součet pole
`input`) a `peakInputTokens` (max.\ jen `input`) ve
skriptech; do hlavičky E1 tabulek nepatří.
Pole `tokens.total` v exportu **do E1 nepočítáme** (míchá
promptové a generované tokeny; pro šířku promptu používáme
`input`+`cache`).
Sledování objemu tokenů motivuje zjištění Gloaguen
et al. [gloaguen2025agentsmd], že context files zvyšují inference
cost o více než 20 %.

**E2 (trvání)** měří wall-clock time v minutách od spuštění
agenta po poslední commit.

**E3 (kompakce kontextu)** počítá události, kdy se podle změny
`snapshot` mezi kroky v transcriptu OpenCode provedl zápis
kompakce kontextu (heuristika). Doplňkově sledujeme úspěšné dokončení
beze ztráty session a počet restartů z auto-continue (`metrics.csv`).

Se dvěma běhy per variaci jsou tyto hodnoty deskriptivní,
ne inferenční.
— [/DRAFT] —

### Aplikace LLM-as-judge

— [DRAFT] —
Pět metrik (P6, P7, P8, Q4, Q8) hodnotí vlastnosti které nelze extrahovat
automatizovaným nástrojem. Pro jejich hodnocení používáme metodu
LLM-as-judge (sekce [ref:sec:llm-as-judge]).

**Volba modelu.** Jako judge používáme GLM-5 (Zhipu AI).
Agentní běhy provádí model Minimax — judge je tedy z jiné modelové
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
— [/DRAFT] —

%% ==========================================================================
%% 3.3 Experimentální design
%% ==========================================================================

## Experimentální design

%% KOSTRA: Jak experiment probíhá. Výběr projektu (proč dunning),
%%         fixní proměnné, pilotní cyklus, komparativní variace.

### Výběr projektu

— [DRAFT] —
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
a doménový slovník. Tato kombinace deterministické logiky
a hraničních případů (víkendy, svátky, grace periods) umožňuje
objektivně testovat jak funkční korektnost (Q1, Q2), tak kvalitu testů
(Q3, Q4).
— [/DRAFT] —

### Fixní proměnné

— [DRAFT] —
Aby bylo možné měřit vliv instrukcí, musí být všechno ostatní
konstantní. Jedinou proměnnou mezi běhy je obsah souboru `AGENTS.md`,
procedurálních instrukcí, které definují pracovní postup,
omezení a quality gates. Na rozdíl od generických context files,
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
slovník a out of scope. Jediný vstup který agent dostane kromě
instrukcí.

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
rozšířením nainstalovaným na hostitelském systému. Izolace zaručuje,
že chování agenta je determinováno výhradně obsahem `AGENTS.md`
a specifikací — ne vedlejšími vstupy z prostředí. Sdílený
autentizační svazek zajišťuje konzistentní přístup k API napříč
běhy.

**System prompt agenta** (`build.md`) nahrazuje výchozí
system prompt nástroje OpenCode, jehož instrukce o verzování
konfliktvaly s procesními požadavky experimentu. Vlastní system prompt
obsahuje pouze obecné kódové konvence (styl, bezpečnost, zákaz
komentářů) a odkaz na `AGENTS.md`. Veškeré procesní instrukce
jsou výhradně v `AGENTS.md`, aby procesní chování agenta bylo
řízeno jedinou proměnnou experimentu.
— [/DRAFT] —

### Iterativní cyklus

— [DRAFT] —
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
— [/DRAFT] —

### Pilotní fáze

— [DRAFT] —
Pilotní fáze běží dokud agent nesplní exit kritéria ze sloupce
*Exit kritérium* v tabulce [ref:tab:metriky-prehled].
Kritéria mají dva typy: deterministická (P1–P5, Q1–Q2, Q4–Q6)
mají přirozenou binární hranici — buď splněno nebo ne; minimální
standard (P6–P8, Q3, Q7–Q8) je práh zdůvodněný literaturou.
E1–E3 jsou záznamové metriky bez kritéria, slouží k porovnání
efektivity mezi běhy.

S ohledem na scope práce (jeden projekt, jeden model) stačí jeden
úspěšný běh bez manuálního zásahu. Každá iterace produkuje
aktualizovaný `AGENTS.md`, záznam změn se zdůvodněním
a kompletní P/Q/E metriky.
— [/DRAFT] —

### Komparativní variace

— [DRAFT] —
Z fungující sady instrukcí (výstup pilotní fáze) systematicky odebíráme
jednotlivé složky a měříme dopad na chování agenta. Tento postup —
ablace — odpovídá na otázku: potřebuje agent danou část instrukcí,
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
— [/DRAFT] —

%% ==========================================================================
%% 3.4 Přehled metrik
%% ==========================================================================

## Přehledová tabulka

— [DRAFT] —
Tabulka [ref:tab:metriky-prehled] shrnuje všechny metriky na jednom
místě. Sloupec *typ* rozlišuje deterministická exit kritéria
(přirozená binární hranice), minimální standard (práh zdůvodněný
literaturou) a záznamové metriky (bez kritéria, slouží k porovnání
mezi běhy). Automatizované metriky (P1–P5, Q1–Q3, Q5–Q7, E1–E3)
sbírá jeden skript; kvalitativní metriky (P6–P8, Q4, Q8) hodnotí
LLM-as-judge (sekce [ref:sec:llm-as-judge-aplikace]).
— [/DRAFT] —

\begin{table}[H]
\centering
\caption{Sada metrik: kód, měřená vlastnost, nástroj, exit kritérium a typ}

\footnotesize
\setlength{\tabcolsep}{3pt}
[TABLE START]lllll@{}}
\toprule
**Kód**  |  **Metrika**  |  **Nástroj**  |  **Exit kritérium**  |  **Typ** 
\midrule
\multicolumn{5}{@{}l}{*Procesní (P) — jak agent pracuje*} [2pt]
P1  |  Issues before code             |  git, GitHub API  |  pass  |  deter. 
P2  |  Branch per issue               |  git, GitHub API  |  pass  |  deter. 
P3  |  Test-first commits             |  git log          |  pass  |  deter. 
P4  |  PRs linked to issues           |  GitHub API       |  pass  |  deter. 
P5  |  No existing test modifications  |  git diff        |  pass  |  deter. 
P6  |  Commit message quality         |  LLM-as-judge (GLM-5)  |  \geq 2/3  |  min. 
P7  |  Issue description quality      |  LLM-as-judge (GLM-5)  |  \geq 2/3  |  min. 
P8  |  PR description quality         |  LLM-as-judge (GLM-5)  |  \geq 2/3  |  min. 
\midrule
\multicolumn{5}{@{}l}{*Produktové (Q) — co agent vyrobil*} [2pt]
Q1  |  API contract match          |  tsc (import + typecheck)  |  match  |  deter. 
Q2  |  Referenční test pass rate   |  Vitest (42 testů)        |  42/42  |  deter. 
Q3  |  Mutation score               |  Stryker                  |  \geq 70 %  |  min. 
Q4  |  AC coverage agentových testů (25 krit.)    |  LLM-as-judge (GLM-5)    |  25/25  |  deter. 
Q5  |  Lint warnings                |  ESLint                   |  0  |  deter. 
Q6  |  Typecheck errors             |  tsc `-{`-noEmit}  |  0  |  deter. 
Q7  |  Cyklomatická složitost       |  ESLint (complexity)      |  \leq 10/fn  |  min. 
Q8  |  Design quality               |  LLM-as-judge (GLM-5)    |  \geq 2/3  |  min. 
\midrule
\multicolumn{5}{@{}l}{*Efektivita (E) — za jakou cenu*} [2pt]
E1  |  Vstup / výstup / Σ cache (tis.) z exportu  |  OpenCode export  |  —  |  záznam 
E2  |  Trvání (minuty)              |  session timestamps  |  —  |  záznam 
E3  |  Kompakce + dokončení + restarty  |  transcript + auto-continue  |  —  |  záznam 
\bottomrule
[TABLE END]
\end{table}

%% ==========================================================================
%% Audit trail — starý obsah
%% ==========================================================================

%% ==========================================================================
%% 3.5 Omezení a validita
%% ==========================================================================

## Omezení a validita

— [DRAFT] —
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
\phantomsection%
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
agentova prostředí. Jak se tyto hrozby projevily v praxi —
včetně diagnostické chyby výzkumníka, změn prostředí mezi běhy,
nenastavené temperature modelu a tichých ukončení nástroje —
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
— [/DRAFT] —

%% ==========================================================================
%% Audit trail — starý obsah
%% ==========================================================================

---

# Praktická část

— [DRAFT] —
Tato kapitola popisuje provedení případové studie. Struktura sleduje
chronologii experimentu: nejprve příprava tří výchozích podkladů
(specifikace, referenční implementace, instrukce), pak pilotní iterace
kde se instrukce opakovaně upravují na základě naměřených metrik,
a nakonec komparativní variace kde z fungující sady systematicky
odebíráme jednotlivé části a měříme dopad.
— [/DRAFT] —

%% ================================================================
## Příprava experimentu

%% ================================================================

— [DRAFT] —
Před spuštěním pilotních běhů bylo nutné připravit tři výchozí podklady
každého experimentálního běhu: specifikaci projektu (co má agent
implementovat), referenční implementaci (měřicí nástroj pro
Q2 – referenční test pass rate)
a baseline instrukce (jak má agent pracovat).
— [/DRAFT] —

%% —————————————————————-
### Konstrukce specifikace

— [DRAFT] —
Specifikace definuje *co* má agent implementovat. V této práci
má formu strukturované GitHub issue (Issue \#1), kterou agent dostává
jako zadání. Tato volba navazuje na metodické vymezení fixních vstupů
v sekci [ref:sec:experimentalni-design]: agent kromě instrukcí v souboru
`AGENTS.md` pracuje právě s touto specifikací a žádný další
architektonický návrh nedostává. Issue se skládá ze dvou částí:
**Requirements** (co business potřebuje) a **API Contract**
(co musí implementace exportovat). Behavioral model, state diagram ani
explicitně formulované invarianty nejsou součástí zadání; návrh interní
architektury je ponechán agentovi. API kontrakt, tedy exportované
funkce a typy, představuje jediné technické omezení implementace
a současně slouží jako vstup pro metriku **Q1** (API contract
match).

Podoba specifikace vychází ze tří principů důležitých pro tuto
evaluační úlohu: jednoznačnosti požadavků, jejich testovatelnosti
a omezení interpretační volnosti agenta. Specifikace je proto záměrně
stručná a strukturovaná. Stručnost reaguje na poznatek, že delší
kontext může zhoršovat schopnost jazykového modelu spolehlivě využít
relevantní informaci [liu2024lost]. Současně byla zvolena taková
struktura, která minimalizuje redundantní instrukce a udržuje přímou
vazbu mezi požadavkem, implementací a následným vyhodnocením
[bockeler2025sdd].

Specifikace obsahuje:

    - **25 acceptance criteria** ve formátu Given/When/Then
          s konkrétními hodnotami — eskalační flow (8 stavových
          přechodů), platby, terminální stavy, pause/resume, manuální
          advance, konfigurovatelné timeouty, výpočet pracovních dní
    - **API kontrakt** v TypeScriptu — veřejná funkce
          `process(state, event, now)` vracející nový stav
          a action descriptory; typy pro 12 stavů, 6 událostí,
          3 typy akcí; konfigurační interface pro timeouty a svátky
    - **Doménový slovník** — 9 pojmů definujících business
          doménu (dunning, grace period, business days, action
          descriptor aj.)
    - **Out of scope** — 6 explicitně vyloučených oblastí
          (payment retry, late fees, partial payments, email sending,
          scheduling, persistence)

Formát acceptance criteria přímo ovlivňuje měřitelnost. Struktura
Given/When/Then odděluje výchozí stav, podnět a očekávaný výsledek,
což usnadňuje převod jednotlivých požadavků do testovacích scénářů.
V této práci z ní proto přímo vycházejí referenční testy
(metrika **Q2**) i mapování acceptance criteria na agentem
vytvořené testy (metrika **Q4**). Zvolený formát tak neslouží
jen k zápisu business požadavků, ale i k jejich konzistentnímu
vyhodnocení v rámci experimentu.

Specifikace definuje systém jako pure function: \texttt{process(state,
event, now)} vrací nový stav a action descriptory místo provádění side
effects. Toto rozhodnutí bylo přijato proto, aby bylo možné nad jedním
deterministickým rozhraním konzistentně vyhodnocovat referenční testy
(metrika **Q2**) i mutation testing (metrika **Q3**).
Pevné TypeScript signatury současně zajišťují, že stejné testovací
prostředí lze použít napříč jednotlivými běhy nezávisle na interní
struktuře agentem vytvořeného řešení.

Specifikace obsahuje explicitní sekci out of scope, která vymezuje
6 oblastí mimo zadání. V kontextu této studie tato sekce nevymezuje jen
hranice implementace, ale také omezuje riziko, že agent rozšíří řešení
nad rámec sledovaného zadání a zkomplikuje tak interpretaci výsledků.
— [/DRAFT] —

%% —————————————————————-
### Referenční implementace

— [DRAFT] —
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
LLM-as-judge (**Q8**) ohodnotil design quality na 3/3
ve všech dimenzích. Tyto výsledky validují, že specifikace je
implementovatelná a že exit kritéria
(sekce [ref:sec:pilotni-iterace]) jsou dosažitelná lidským
vývojářem.
— [/DRAFT] —

%% —————————————————————-
### Konstrukce baseline instrukcí

— [DRAFT] —
Baseline verze `AGENTS.md` byla konstruována čistě z literatury.
Cílem bylo vytvořit výchozí bod jehož každá komponenta má opodstatnění
v empirických zjištěních.

Konstrukce proběhla ve třech krocích: smazání předchozí ad-hoc verze,
návrh struktury podle pořadí komponent, které Mao
et al. [mao2025fse] zjistili v analýze 2 163 produkčních
šablon, a mapování tří dimenzí chování
(sekce [ref:sec:sada-metrik]) na konkrétní instrukce. Mao
identifikují sedm typů komponent (Role, Directive, Context,
Workflow, Output, Constraints, Examples); naše baseline sekce
(Role, Goal, Specification, Environment, Process, Package
Quality, Constraints) jsou adaptací tohoto rámce na doménu
případové studie.

Mao et al. zjistili, že v produkčních šablonách se Role
a Directive nejčastěji objevují na začátku dokumentu, zatímco
Constraints na konci. Toto pozorované pořadí tvoří páteř
baseline dokumentu.

Sekce Package Quality definuje očekávání na kvalitu kódu: modulární
struktura (typy, business logika a veřejné API v oddělených souborech),
striktní typový systém bez obcházení (`any`), JSDoc dokumentace
na exportech a jasně definovaný vstupní bod (`index.ts`
re-exportuje pouze veřejné API). Tyto požadavky přímo ovlivňují
metriky **Q5**–**Q8** (lint, typecheck, složitost kódu,
design quality). Lulla et al. [lulla2026]
zjistili, že přítomnost instrukčního souboru je spojena s nižší
mediánovou dobou běhu (-28{,}6 %), ačkoli účinnost jednotlivých
typů obsahu dosud nebyla izolována.

Procesní sekce obsahuje stručné instrukce pro spec-first
TDD [mathews2024], dekompozici do sub-issues, branch-per-issue
a conventional commits. Li et al. [skillsbench2025] ukazují, že
procedurální guidance ("jak pracovat") je efektivnější než popisná
dokumentace ("jak vypadá codebase"). Z procesní sekce byly odstraněny
bash příklady, protože redundantní obsah zvyšuje inference cost
bez benefitu [gloaguen2025agentsmd].

Sekce Constraints obsahuje explicitní zákazy: nekombinovat issues,
nemodifikovat již existující testy, nepřepisovat git historii. Mao
et al. [mao2025fse] zjistili, že exclusion constraints (46 %)
jsou nejčastějším typem omezení v reálných šablonách (46 % výskytů).

Výsledný dokument má 53 řádků a \sim350 slov.
Tabulka [ref:tab:mapovani-instrukci] ukazuje mapování jednotlivých
sekcí na metriky a obrázek [ref:fig:baseline-agents] uvádí kompletní
znění.

[FIGURE: Mapování sekcí baseline `AGENTS.md` na metriky]
— [/DRAFT] —

### Pilot-r2

— [DRAFT] —
Dvě opravy zabraly (P5, Q7), ale dvě klíčové slabiny přetrvaly (P2, P3)
a kvalita kódu se zhoršila (Q2, Q3). Druhý běh ověřoval čtyři změny
instrukcí. Tabulka [ref:tab:pilot-r2-delta] ukazuje metriky kde došlo
ke změně.

\begin{table}[ht]
\centering
\caption{Pilot-r2: metriky s změnou oproti r1}

\small
[TABLE START]llccc@{}}
\toprule
**Kód**  |  **Metrika**  |  **r1**  |  **r2**  |  **Trend** 
\midrule
P5        |  Existující testy nezměněny   |  \times    |  \checkmark   |  opraveno 
Q2        |  Ref.\ test pass rate    |  39/42       |  32/42        |  horší 
Q3        |  Mutation score          |  84 %     |  68 %       |  pod prahem 
Q5        |  Lint warnings           |  2           |  1            |  zlepšení 
Q7        |  Složitost kódu          |  2 viol.     |  0            |  opraveno 
Q8        |  Design quality          |  1/3         |  1/3          |  beze změny 
\midrule
E1        |  Vstup / výstup / Σ cache (tis.)  |  115 / 60 / 11528  |  76 / 41 / 3196  |  záznam 
E2        |  Trvání                  |  32{,}7 min  |  37{,}2 min  |  záznam 
\bottomrule
[TABLE END]
\end{table}

**Diagnostika.**
%% REVIEW: text naruje tabulku — zvážit přepis na interpretaci
P5 a Q7 opraveny, lint warnings sníženy na 1. P2 a P3 přetrvala, ale
jinak než v r1: v r1 agent psal kód bez testů, v r2 naopak sloučil
testy a kód do jednoho commitu s prefixem `test:`. Formálně
konvenci splnil (commit má správný prefix), ale záměr — mít oddělený
commit pro test a pro kód — nesplnil. Q8 = 1/3 zůstala beze změny,
přestože instrukce požadovala JSDoc dokumentaci. Samotný textový
požadavek nestačí; agent potřebuje kontrolní krok, který ho donutí
dokumentaci ověřit [breunig2025].

%% REVIEW: text naruje tabulku — zvážit přepis na interpretaci
Q2 a Q3 se zhoršily (32/42 resp.\ 68 %). Agent napsal víc testů než
v r1 (70 vs.\ 59), ale horší kvality — pravděpodobně proto, že psal
všechny testy najednou ze specifikace místo postupného test-fix cyklu.
Při součtu tokenů přes všechny turny by srovnání zkreslovalo opakované
počítání kontextu. E1 uvádíme jako vstupní a výstupní mezisoučty
(viz kap. [ref:sec:metriky-efektivity]), oba v tisících.
Mezi r1 a r2 **klesá** **max.\ vstup na kroku** (včetně
`cache.read` v exportu, viz kap. [ref:sec:metriky-efektivity])
z 115 na 76 tis.\ tokenů; součet výstupu klesá z 60 na 41 tis.\ — změna
instrukcí tedy v E1 souvisí se špičkou promptové strany v jednom requestu
i s objemem generování (pole `tokens.total` v exportu mezi běhy
nepoužíváme jako jednotnou bázi).

**Změna instrukcí pro r3.**
Z r2 přetrvaly tři slabiny. Každá dostala vlastní opravu:

    - P2 (agent stále kombinoval branches): pracovní postup nově
          začíná příkazem `gh issue list –state open` — agent
          tak vidí další issue a ví odkud začít, místo aby si vymýšlel
          vlastní pořadí
    - P3 (agent stále nepsal testy zvlášť): mezi commit s testy
          a commit s kódem přibyl kontrolní příkaz
          `git log –oneline -3` — agent tak musí ověřit, že
          test commit skutečně existuje dřív než začne implementovat
    - Q8 (agent ignoroval požadavek na JSDoc): instrukce říkala
          "dokumentuj veřejné API", ale agent to přehlížel. Zopakovat
          totéž by nepomohlo [breunig2025]. Požadavek byl proto
          přesunut do kontrolního kroku před pull requestem — agent
          musí ověřit JSDoc dřív než odevzdá kód. Přesun požadavku
          do kontrolního kroku odpovídá vzorci z r1\tor2: obecné
          pravidlo \to konkrétní příkaz v místě
          akce [breunig2025]

Výřez `git diff` mezi verzemi `AGENTS.md` pro běhy r2 a r3
ukazuje rozsah těchto změn.

[FIGURE: Vizuální diff změn `AGENTS.md` mezi pilot-r2 a pilot-r3]
— [/DRAFT] —

%% —————————————————————-
### Pilot-r3

— [DRAFT] —
%% REVIEW-LAYERS: závěr bez pozorování — lead sentence je závěr ("průlomový běh"), pozorování z tabulky přichází po; buď přeformulovat jako neutrální signpost, nebo až za tabulkou
Průlomový běh: poprvé P1–P5 = 5/5 a Q8 = 3/3.
Třetí běh ověřoval tři změny instrukcí z r2: kontrolní příkaz po commitu
s testy, výběr issue přes `gh issue list` a přesun požadavku
na JSDoc do kontrolního kroku před pull requestem.
Tabulka [ref:tab:pilot-r3-delta] ukazuje metriky s výraznou změnou.

\begin{table}[ht]
\centering
\caption{Pilot-r3: metriky s změnou oproti r2}

\small
[TABLE START]llccc@{}}
\toprule
**Kód**  |  **Metrika**  |  **r2**  |  **r3**  |  **Trend** 
\midrule
P2  |  Branch per issue          |  \times    |  \checkmark   |  opraveno 
P3  |  Test-first commity        |  \times    |  \checkmark   |  opraveno 
P6  |  Kvalita commit zpráv      |  2/3         |  3/3          |  zlepšení 
P7  |  Kvalita issue popisů      |  2/3         |  3/3          |  zlepšení 
Q2  |  Ref.\ test pass rate      |  32/42       |  41/42        |  zlepšení 
Q3  |  Mutation score            |  68 %      |  71 %       |  nad prahem 
Q8  |  Design quality            |  1/3         |  3/3          |  průlom 
\midrule
E1  |  Vstup / výstup / Σ cache (tis.)  |  76 / 41 / 3196  |  62 / 30 / 4770  |  záznam 
E2  |  Trvání                    |  37{,}2 min  |  24{,}8 min  |  záznam 
E3  |  Kompakce kontextu         |  0           |  1            |  záznam 
\bottomrule
[TABLE END]
\end{table}

[FIGURE: Vizuální diff změn `AGENTS.md` mezi pilot-r3 a pilot-r4]
— [/DRAFT] —

%% —————————————————————-
### Pilot-r4

— [DRAFT] —
Regrese oproti r3 — další změny instrukcí nepomohly a nedeterminismus
modelu přidal nové chyby. Čtvrtý běh ověřoval dvě úpravy: přidání
`npx vitest run` do pre-PR checklistu a pravidlo o dodržení API
kontraktu (každé pole v typech musí být použito v implementaci).
Tabulka [ref:tab:pilot-r4-delta] ukazuje metriky s nejvýraznější změnou.

\begin{table}[ht]
\centering
\caption{Pilot-r4: metriky s změnou oproti r3}

\small
[TABLE START]llccc@{}}
\toprule
**Kód**  |  **Metrika**  |  **r3**  |  **r4**  |  **Trend** 
\midrule
P2  |  Branch per issue         |  \checkmark  |  \times     |  regrese 
P5  |  Testy nezměněny          |  \checkmark  |  \times     |  regrese 
P8  |  Kvalita PR popisů        |  3/3         |  1/3          |  regrese 
Q2  |  Ref.\ test pass rate     |  41/42       |  39/42        |  horší 
Q3  |  Mutation score            |  71 %     |  66 %       |  pod prahem 
Q8  |  Design quality           |  3/3         |  2/3          |  horší 
\midrule
E1  |  Vstup / výstup / Σ cache (tis.)  |  62 / 30 / 4770  |  81 / 36 / 5996  |  záznam 
E2  |  Trvání                   |  24{,}8 min  |  25{,}9 min  |  stabilní 
E3  |  Kompakce kontextu        |  1           |  0            |  záznam 
\bottomrule
[TABLE END]
\end{table}

**Diagnostika.**
R4 je regrese oproti r3. Agent vytvořil 7 issues ale zpracoval jen 5 —
dva issues zůstaly bez branch (P2 = 4/6). Upravil dva vlastní testové
soubory po implementaci (P5). PR popisy obsahovaly jen "Closes \#N"
bez popisu změn (P8 = 1/3).

%% REVIEW: text naruje tabulku — zvážit přepis na interpretaci
Q2 se zhoršilo z 41/42 na 39/42: k přetrvávajícímu elapsed time bugu
přibyly dvě nové chyby (výpočet víkendů v eskalaci a boundary
DUE\_SOON přechodu). Pravidlo o dodržení API kontraktu nepomohlo —
agent pole `pausedElapsed` opět nepoužil. Agentův vlastní test
navíc obsahoval timezone bug a přesto agent mergoval kód, přestože
pre-PR checklist zahrnoval `npx vitest run`.

R4 ukazuje dvě věci: (1) deklarativní pravidla v Constraints —
pravidla která říkají *co má platit*, např.\ "každé pole musí
být použito" — nepřinesla zlepšení, ačkoli v předchozích iteracích
procedurální verifikace v Process — konkrétní příkazy které říkají
*co udělat*, např.\ "spusť `tsc –noEmit`" —
fungovala; (2) nedeterminismus modelu způsobuje, že stejné instrukce
v dalším běhu přinesou nové chyby. Obě změny r3\tor4 byly
deklarativní, zatímco úspěšné opravy r1\tor2\tor3 byly
procedurální (konkrétní příkazy s verifikací).

Zbývající selhání r3 nejsou důsledkem nejednoznačné specifikace:
acceptance criteria jednoznačně vyžadují zachování elapsed time
při pause/resume a API kontrakt poskytuje pole
`pausedElapsed` pro tento účel. Agent pole v kontraktu
vidí a správně ho zapisuje při pauzování, ale při obnovení ho
nepoužije a zvolí alternativní přístup. Q5 = 1 je způsobena
složitostí funkce `processTick` (cyklomatická složitost 15,
práh 10), kterou agent nerozložil. Obě selhání jsou kandidáty
na procesní verifikaci — stejný vzorec, který opravil P2, P3
a Q8 v předchozích iteracích.

**Změna instrukcí pro r5.**
Návrat k předchozí verzi instrukcí po neúspěšné iteraci je
standardní postup — iterativní cyklus nepředpokládá monotónní
zlepšování [peffers2008]. R5 proto vychází z r3 (ne z r4)
a cílí na dvě zbývající selhání procedurální verifikací. Obě změny
používají stejný vzorec, který opravil P2, P3 a Q8 v předchozích
iteracích: místo deklarativního pravidla přidáváme verifikační akci
do pre-PR checklistu.

    - Q2 (agent nepoužil `pausedElapsed`): do pre-PR
          checklistu přidán krok "verify that every field in the API
          Contract types is read and written in your implementation —
          if a field exists in the type but is unused, fix it before
          opening the PR." Na rozdíl od r4, kde pravidlo bylo
          v Constraints (deklarativní), je verifikace v Process
          (procedurální) [breunig2025]
    - Q5/Q7 (složitost `processTick`): agent v r3 spustil
          eslint s vlastním configem, který neobsahoval pravidlo
          `complexity` — dostal nula warningů a kód považoval
          za hotový. Experiment měří Q5/Q7 s fixním configem kde
          complexity pravidlo je. Do instrukcí přidán explicitní
          požadavek: "your ESLint config must include
          `complexity: [warn, 10]`"

Výřez `git diff` mezi verzemi `AGENTS.md` pro běhy r3
a r5 ukazuje obě změny: rozšířený pre-PR checklist o API contract
verifikaci a explicitní complexity pravidlo.

[FIGURE: Vizuální diff změn `AGENTS.md` mezi pilot-r3 a pilot-r5]
— [/DRAFT] —

%% —————————————————————-
### Pilot-r5: verifikace kontraktu

— [DRAFT] —
\begingroup
\sloppy
Regrese horší než r4 — agent kompletně ignoroval workflow.
Agent přečetl `AGENTS.md` (v transcriptu potvrzeno), ale místo
`gh issue create` použil interní plánovací nástroj
(`todowrite`) a implementoval vše v jednom `feat:` commitu
bez issues, branches a pull requestů.

\begin{table}[ht]
\centering
\caption{Pilot-r5: metriky s změnou oproti r3}

\small
[TABLE START]llccc@{}}
\toprule
**Kód**  |  **Metrika**  |  **r3**  |  **r5**  |  **Trend** 
\midrule
P2  |  Branch per issue         |  \checkmark  |  \times     |  regrese 
P3  |  Test-first commity       |  \checkmark  |  \times     |  regrese 
P4  |  PRs linked               |  \checkmark  |  \times     |  regrese 
Q2  |  Ref.\ test pass rate     |  41/42       |  38/42        |  horší 
Q5  |  Lint warnings            |  1           |  0            |  opraveno 
Q7  |  Složitost kódu           |  1 viol.     |  0            |  opraveno 
\midrule
E1  |  Vstup / výstup / Σ cache (tis.)  |  62 / 30 / 4770  |  65 / 23 / 3028  |  záznam 
E2  |  Trvání                   |  24{,}8 min  |  13{,}2 min  |  záznam 
E3  |  Kompakce kontextu        |  1           |  0            |  záznam 
\bottomrule
[TABLE END]
\end{table}

**Diagnostika.**
Instrukce r5 se lišily od r3 pouze ve dvou řádcích pre-PR checklistu
(API contract verifikace a ESLint complexity config). Obě cílené opravy
%% REVIEW: text naruje tabulku — zvážit přepis na interpretaci
zabraly: Q5 = 0 a Q7 = 0. Agent konfiguroval ESLint s pravidlem
`complexity` a rozložil funkci `processTick`. Opravu
Q5/Q7 tak způsobila jediná konkrétní instrukce: "your ESLint config
must include `complexity: [warn, 10]`". V r3 agent toto
pravidlo ve svém ESLint configu neměl — spustil eslint, dostal
nula warningů a kód považoval za hotový. Experiment přitom měří Q5/Q7
s fixním configem kde pravidlo je. Agent nemůže opravit problém,
o kterém neví — explicitní požadavek na konkrétní config tento
disconnect odstranil.

Přesto agent ignoroval celý Process workflow — žádné issues,
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
(\sim3/5) — vytvořil issues ale ne pro všechny branch. R5 workflow
ignoroval zcela (\sim1/5). Instrukce se přitom mezi r3 a r5 liší
minimálně (2 řádky v pre-PR checklistu).
%% REVIEW-LAYERS: interpretace jako fakt — "Nedeterminismus modelu je dominantní faktor" je závěr/interpretace prezentovaná jako fakt; chybí hedging ("data naznačují", "pravděpodobně"); navíc chybí explicitní vrstva interpretace PROČ malá změna způsobila tak velký dopad
Nedeterminismus modelu
je dominantní faktor pro dodržování vícekrokových sekvencí.
\endgroup

**Závěr pilotních iterací.**
Pět iterací (r1–r5) přineslo čtyři pozorování:

\begingroup
\setlength{\emergencystretch}{0.5em}

    - **Verifikační kroky fungují spolehlivě.**
          Jednokrokové příkazy s okamžitým výstupem (`tsc`,
          `eslint`, `git log –oneline -3`) agent dodržoval
          ve všech bězích kde byly přítomny (r3–r5). Cílená oprava
          Q5/Q7 v r5 (explicitní ESLint complexity config) zabrala
          i přes kolaps workflow.
    - **Multi-step workflow je nedeterministický.**\par
          Vícekroková sekvence (issue \to\allowbreak{}
          branch \to\allowbreak{} test \to\allowbreak{}
          implement \to\allowbreak{} PR) se pohybovala od 5/5 (r3)\allowbreak{}
          přes \sim3/5 (r4)\allowbreak{} po \sim1/5 (r5)\allowbreak{}
          při téměř identických instrukcích.
    - **Deklarativní pravidla nepomáhají, procedurální ano.**
          R4 přidalo deklarativní pravidlo v Constraints ("každé pole
          musí být použito") — nepomohlo. R5 přidalo procedurální
          check ("ESLint config musí obsahovat complexity") — zabralo.
          Substituční cyklus r1 \to r3 potvrzuje: obecná pravidla \to
          konkrétní příkazy \to verifikační kroky = zlepšení.
    - **Implementační rozhodnutí instrukce obtížně ovlivňují.**
          Agent v r3 nepoužil pole `pausedElapsed` z API kontraktu
          přesto, že specifikace jednoznačně vyžaduje zachování elapsed
          time a kontrakt pole poskytuje. Agent pole správně zapisoval
          při pauzování, ale při obnovení zvolil vlastní přístup
          (Q2 = 41/42). Deklarativní pravidlo (r4) ani procedurální
          check (r5) toto selhání neopravily — na rozdíl od Q5/Q7,
          kde procedurální check zabral.

\endgroup

Pilotní baseline pro komparativní variace zůstává r3 — jediný běh
kde agent workflow dodržel. Komparativní variace testují, které
z těchto pozorování vydrží cílenou ablaci.

Obrázek [ref:fig:diff-r1-r3] ukazuje souhrnnou evoluci instrukcí
od baseline k nejlepší iteraci — bílé řádky zůstaly z r1, zelené
byly přidány během iterací.

[FIGURE]
— [/DRAFT] —

%% ================================================================
## Komparativní variace

%% ================================================================

— [DRAFT] —
Pilotní iterace demonstrovaly, jak se instrukce navrhují: substituční
cyklus (obecná pravidla \to konkrétní příkazy \to kontrolní kroky)
zlepšil procesní i produktové metriky. Zbývá otázka, které složky
výsledných instrukcí jsou pro chování agenta nezbytné a které lze
odebrat bez dopadu.

Existující studie měří efekt souboru `AGENTS.md` jako celku:
Lulla et al. [lulla2026] zjistili, že jeho přítomnost je spojena
s 28{,}6 % nižším mediánovým runtimem, Gloaguen
et al. [gloaguen2025agentsmd] zjistili marginální zlepšení
úspěšnosti (+4 %). Které složky souboru k tomuto efektu
přispívají, dosud nebylo izolováno — oba autoři to označují
za otevřenou otázku. Naše ablace tuto mezeru částečně vyplňují
na úrovni případové studie.
— [/DRAFT] —

### Výběr složek pro ablaci

— [DRAFT] —
Soubor `AGENTS.md` obsahuje sedm sekcí (Role, Goal,
Specification, Environment, Process, Package Quality, Constraints).
Pro účely výběru ablací je rozlišujeme na sekce definující
*co* implementovat (Role, Goal, Specification, Environment)
a sekce definující *jak* pracovat a jakou kvalitu produkovat
(Process, Package Quality, Constraints). Odebrání kontextových sekcí
by testovalo jinou otázku — zda agent dokáže kontext projektu
získat z jiných zdrojů (issues, README, kód) — a nesouvisí
s naší výzkumnou otázkou o vlivu instrukcí na proces a kvalitu
(sekce [ref:sec:budouci-vyzkum]).

Constraints obsahují zákazy které agent v pilotu dodržoval. Zároveň
je pracovní postup v Process implicitně vynucuje — test-first
workflow znamená, že agent píše testy před kódem a pak na ně nesahá
(P5). Ablace Constraints je námětem pro další výzkum
(sekce [ref:sec:dalsi-vyzkum]).

Zbývají verifikační kroky v Process a sekce Package Quality.
U obou agent v pilotu vykazoval stabilní chování, ale nevíme zda
je řízeno instrukcemi, nebo znalostmi modelu z tréninku —
a to je otázka pro ablaci.

**Ablace A: bez verifikačních kroků.**
\begin{sloppypar}
Agent verifikační příkazy (`tsc –noEmit`,\allowbreak{}
`npx eslint`, `git log –oneline -3`) spouštěl
spolehlivě ve všech pilotních bězích, včetně r5, kde ignoroval zbytek
workflow. Zlepšují ale reálně výstup, nebo by je agent spustil
i bez explicitní instrukce?

*Co odebíráme:* Z Process kroku 4 odebereme `tsc –noEmit`,\allowbreak{}
`npx eslint` a z kroku 2c odebereme `git log –oneline -3`.
Workflow struktura (issue \to\allowbreak{} branch \to\allowbreak{}
test \to\allowbreak{} implement \to\allowbreak{}
PR) zůstane (obrázek [ref:fig:diff-r3-ablace-a]).
\end{sloppypar}

[FIGURE]
\footnotetext{Zelené řádky v diffu neobsahují nový text — vznikly
přečíslováním kroků po odebrání kroku c (Verify).}

*Očekávání:* Verifikační kroky přímo ovlivňují metriky
Q5 (lint warnings) a Q6 (typecheck errors). Pokud agent přesto
spustí typecheck a lint \to verifikační kroky v instrukcích jsou
redundantní. Pokud ne \to explicitní příkazy jsou klíčový
mechanismus a jejich přítomnost v instrukčním souboru přispívá
k efektu, který Lulla et al.\ měřili na úrovni celého souboru.

**Ablace B: bez sekce Package Quality.**
Agent konzistentně produkoval modulární kód
(4 soubory, strict TypeScript, clean API) napříč všemi pilotními
běhy, včetně r5, kde ignoroval celý workflow. Je kvalita kódu řízena
sekcí Package Quality, nebo jde o znalosti z tréninku modelu?

*Co odebíráme:* Celou sekci Package Quality (modulární
architektura, strict TypeScript, JSDoc dokumentace, čisté veřejné
API). Process a Constraints zůstanou beze změny
(obrázek [ref:fig:diff-r3-ablace-b]).

[FIGURE]

*Očekávání:* Pokud Q5, Q7 a Q8 zůstanou na úrovni r3 \to
konvenční instrukce jsou redundantní s tréninkem modelu. Pokud se
zhorší \to explicitní konvence v instrukcích jsou potřeba a přispívají
k celkovému efektu instrukčního souboru.

— [/DRAFT] —

### Ablace A: bez verifikačních kroků

— [DRAFT] —
Tabulka [ref:tab:ablace-a] shrnuje výsledky dvou běhů (A-1, A-2)
ve srovnání s r3.

\begin{table}[H]
\centering
\caption{Ablace A: srovnání s r3 (bez verifikačních kroků)}

\small
[TABLE START]llccc@{}}
\toprule
**Kód**  |  **Metrika**  |  **r3**  |  **A-1**  |  **A-2** 
\midrule
P1  |  Issues before code         |  \checkmark  |  \checkmark  |  \checkmark 
P2  |  Branch per issue           |  \checkmark  |  \checkmark  |  \times 
P3  |  Test-first commits         |  \checkmark  |  \checkmark  |  \times 
P4  |  PRs linked to issues       |  \checkmark  |  \checkmark  |  \times 
P5  |  Testy nezměněny            |  \checkmark  |  \times    |  \checkmark 
P6  |  Commit msg quality         |  3/3         |  2/3         |  2/3 
P7  |  Issue quality              |  3/3         |  2/3         |  3/3 
P8  |  PR quality                 |  3/3         |  3/3         |  1/3 
\midrule
Q1  |  API contract match         |  match       |  match       |  match 
Q2  |  Ref.\ test pass rate       |  41/42       |  35/42       |  37/42 
Q3  |  Mutation score             |  71 %      |  62 %      |  —^\dagger 
Q5  |  Lint warnings              |  1           |  4           |  3 
Q6  |  Typecheck errors           |  0           |  0           |  0 
Q7  |  Complexity violations      |  1           |  4           |  1 
Q8  |  Design quality             |  3/3         |  2/3         |  2/3 
\midrule
E1  |  Vstup / výstup / Σ cache (tis.)  |  62 / 30 / 4770  |  —         |  — 
E2  |  Trvání                     |  25 min      |  39 min      |  24 min 
E3  |  Kompakce kontextu          |  1           |  —         |  — 
\bottomrule
[TABLE END]
\end{table}

^\S Sloupec r3: E1 z pilotního `transcript.json` (62 / 30 / 4770 tis.). U A-1 a A-2 chybí export v lokálním snapshotu — E1 a E3 pro tyto běhy nešly dopočítat.

^\dagger Q3 v A-2 nelze měřit: agentovy vlastní testy selhávají
(test očekává stav `REMINDER\_1`, kód vrací `GRACE`),
Stryker vyžaduje funkční test suite. Bez verifikačních kroků agent
commitl kód s nefunkčními testy.

**Interpretace.**
E1 u ablace nelze z GitHub repozitáře dopočítat (`transcript.json`
v něm není; stejně v lokálním `experiments/runs/ablace-*`).
Po doplnění exportu do lokálního snapshotu stejným postupem jako u pilotů
by se sloupce A-1 / A-2 vyplnily.
Tabulka [ref:tab:ablace-a] ukazuje pokles napříč metrikami kvality
kódu (Q5, Q7) i funkční korektnosti (Q2, Q3). Bez explicitního
příkazu `npx eslint` agent neprovedl kontrolu kvality před
odevzdáním kódu, což naznačuje, že verifikační kroky nejsou
redundantní — agent je bez instrukce nespouští sám.

Procesní metriky vykazují vzorec známý z pilotních iterací: A-1
dodržel workflow kompletně, A-2 nikoliv. Instrukce se mezi běhy
nelišily — variabilita je důsledkem nedeterminismu modelu,
ne ablace.

Agent bez verifikačních kroků spotřeboval přibližně dvakrát více
testovacích cyklů (44 spuštění `vitest` oproti \sim20
u ablace B). To naznačuje, že verifikační kroky plní kromě kontroly
kvality i druhou funkci: fungují jako checkpointy které strukturují
práci agenta a zabraňují cyklickému debugování.
— [/DRAFT] —

### Ablace B: bez Package Quality

— [DRAFT] —
Tabulka [ref:tab:ablace-b] shrnuje výsledky dvou běhů (B-1, B-2)
ve srovnání s r3.

\begin{table}[H]
\centering
\caption{Ablace B: srovnání s r3 (bez sekce Package Quality)}

\small
[TABLE START]llccc@{}}
\toprule
**Kód**  |  **Metrika**  |  **r3**  |  **B-1**  |  **B-2** 
\midrule
P1  |  Issues before code         |  \checkmark  |  \checkmark  |  \checkmark 
P2  |  Branch per issue           |  \checkmark  |  \checkmark  |  \times 
P3  |  Test-first commits         |  \checkmark  |  \checkmark  |  \checkmark 
P4  |  PRs linked to issues       |  \checkmark  |  \times    |  \checkmark 
P5  |  Testy nezměněny            |  \checkmark  |  \times    |  \times 
P6  |  Commit msg quality         |  3/3         |  3/3         |  3/3 
P7  |  Issue quality              |  3/3         |  3/3         |  3/3 
P8  |  PR quality                 |  3/3         |  2/3         |  2/3 
\midrule
Q1  |  API contract match         |  match       |  match       |  match 
Q2  |  Ref.\ test pass rate       |  41/42       |  37/42       |  11/42 
Q3  |  Mutation score             |  71 %      |  67 %      |  72 % 
Q5  |  Lint warnings              |  1           |  2           |  2 
Q6  |  Typecheck errors           |  0           |  0           |  0 
Q7  |  Complexity violations      |  1           |  1           |  2 
Q8  |  Design quality             |  3/3         |  —^*     |  2/3 
\midrule
E1  |  Vstup / výstup / Σ cache (tis.)  |  62 / 30 / 4770  |  —         |  — 
E2  |  Trvání                     |  25 min      |  28 min      |  21 min 
E3  |  Kompakce kontextu          |  1           |  —         |  — 
\bottomrule
[TABLE END]
\end{table}

^* Q8 v B-1: judge nedokončil hodnocení (API timeout).

**Interpretace.**
Stejně jako u tabulky [ref:tab:ablace-a] chybí u ablace export `transcript.json`
v lokálním snapshotu — řádek E1 proto uvádí jen hodnoty pro
baseline r3 (62 / 30 / 4770 tis.); u ablačních běhů E1 dopočítat nejde.

Automatizované metriky kvality kódu (Q5, Q6, Q7) zůstaly na podobné
úrovni jako v r3 (tabulka [ref:tab:ablace-b]). Agent produkoval
modulární kód, striktní TypeScript a v B-1 i JSDoc dokumentaci —
přestože instrukce tyto požadavky neobsahovaly. Jediný pokles
zaznamenalo Q8 (design quality): judge identifikoval chybějící
modularitu (veškerý kód v jednom souboru) a neúplnou dokumentaci.
Data naznačují, že základní kódové konvence jsou u tohoto modelu
řízeny převážně znalostmi z tréninku; strukturální rozhodnutí
(modularita, dokumentace) instrukce pravděpodobně ovlivňují.

Funkční korektnost (Q2) vykazuje extrémní variabilitu: B-1 dosáhl
37/42 (srovnatelné s r3), zatímco B-2 pouze 11/42. Mutation score
zůstal stabilní (67–72 %). Propad Q2 v B-2 není důsledkem ablace
Package Quality — ta neobsahuje žádné instrukce o implementační
logice. Jde o projev nedeterminismu modelu: agent v B-2 implementoval
business day výpočty chybně, což způsobilo kaskádové selhání
eskalačních přechodů. Stejný typ chyby se objevoval i v pilotních
iteracích (r1, r4).

P5 (testy nezměněny) selhalo v obou bězích — agent modifikoval
vlastní testy po implementaci. Stejný problém se objevoval
i v pilotních iteracích (r1, r4) se stejnými instrukcemi,
jde tedy o projev nedeterminismu modelu, ne ablace.
— [/DRAFT] —

### Závěr komparativní fáze

— [DRAFT] —
Dvě ablace testovaly dvě složky instrukcí z r3: verifikační
kroky v Process (ablace A) a sekci Package Quality (ablace B).
Výsledky ukazují odlišný charakter obou složek.

Bez verifikačních kroků (`tsc`, `eslint`)
klesly metriky kvality kódu i funkční korektnosti
(tabulka [ref:tab:ablace-a]). Agent bez kontrolních bodů navíc
spotřeboval přibližně dvakrát více testovacích cyklů. Data
naznačují, že verifikační kroky plní dvojí funkci: zajišťují
kontrolu kvality a fungují jako checkpointy které strukturují
práci agenta.

Bez sekce Package Quality zůstaly automatizované metriky kvality
(Q5–Q7) na srovnatelné úrovni (tabulka [ref:tab:ablace-b]),
avšak Q8 (design quality) kleslo ve všech ablačních bězích —
judge identifikoval chybějící modularitu a neúplnou dokumentaci.
Data jsou konzistentní s hypotézou, že základní kódové konvence
jsou u tohoto modelu řízeny znalostmi z tréninku, zatímco
strukturální rozhodnutí instrukce ovlivňují.

Procesní metriky (P1–P5) vykazovaly v obou ablacích variabilitu
srovnatelnou s pilotními iteracemi (r3 vs.\ r4/r5). Tato variabilita
není důsledkem ablace, ale nedeterminismu modelu: instrukce
pro workflow zůstaly v obou ablacích beze změny.
— [/DRAFT] —

%% ================================================================
## Souhrnné výsledky

%% ================================================================

— [DRAFT] —
Tabulka [ref:tab:cross-run] shrnuje deterministické metriky všech
běhů: pět pilotních iterací a čtyři ablační běhy. Pilotní sloupce
ukazují evoluci instrukcí, ablační sloupce ukazují dopad odebrání
jednotlivých složek. Baseline pro srovnání je r3 — jediný pilotní
běh kde agent splnil celý procesní checklist.
Sloupec E1 uvádí vstup (max.\ na kroku včetně `cache` v exportu),
výstup a součet `cache` přes kroky, vše v tisících; stejný přehled
generuje skript `summary.ts` do `experiments/runs/SUMMARY.md`.
— [/DRAFT] —

% Barvy pro heatmap (jemné, tisk-safe)
\definecolor{cGood}{HTML}{D1FAE5}    % světle zelená — splněno / exit
\definecolor{cMid}{HTML}{FEF3C7}     % světle žlutá  — částečně
\definecolor{cBad}{HTML}{FEE2E2}     % světle červená — nesplněno
\definecolor{cNeutral}{HTML}{F3F4F6} % šedá — N/A nebo konstantní

\newcommand{\cmark}{\cellcolor{cGood}\checkmark}
\newcommand{\xmark}{\cellcolor{cBad}\times}
\newcommand{\cgood}[1]{\cellcolor{cGood}#1}
\newcommand{\cmid}[1]{\cellcolor{cMid}#1}
\newcommand{\cbad}[1]{\cellcolor{cBad}#1}
\newcommand{\cna}[1]{\cellcolor{cNeutral}#1}

\begin{table}[H]
\centering
\caption{Souhrnné výsledky všech běhů (pilot + ablace)}

\footnotesize
[TABLE START]l*{5}{c}|*{2}{c}*{2}{c}@{}}
\toprule
  |  \multicolumn{5}{c|}{*Pilotní iterace*}  |  \multicolumn{2}{c}{*Ablace A*}  |  \multicolumn{2}{c}{*Ablace B*} 
**Metrika**  |  **r1**  |  **r2**  |  **r3**  |  **r4**  |  **r5**  |  **A-1**  |  **A-2**  |  **B-1**  |  **B-2** 
\midrule
P1 issues before code    |  \cmark  |  \cmark  |  \cmark  |  \cmark  |  \cmid{?^\dagger}     |  \cmark  |  \cmark  |  \cmark  |  \cmark 
P2 branch per issue      |  \xmark  |  \xmark  |  \cmark  |  \xmark  |  \xmark        |  \cmark  |  \xmark  |  \cmark  |  \xmark 
P3 test-first            |  \xmark  |  \xmark  |  \cmark  |  \cmark  |  \xmark        |  \cmark  |  \xmark  |  \cmark  |  \cmark 
P4 PRs linked            |  \cmark  |  \cmark  |  \cmark  |  \cmark  |  \xmark        |  \cmark  |  \xmark  |  \xmark  |  \cmark 
P5 testy nezměněny       |  \xmark  |  \cmark  |  \cmark  |  \xmark  |  \cmark        |  \xmark  |  \cmark  |  \xmark  |  \xmark 
P6 commit msg quality    |  \cmid{2/3}   |  \cmid{2/3}   |  \cgood{3/3}   |  \cgood{3/3}   |  \cmid{2/3}     |  \cmid{2/3}   |  \cmid{2/3}   |  \cgood{3/3}   |  \cgood{3/3} 
P7 issue quality         |  \cmid{2/3}   |  \cmid{2/3}   |  \cgood{3/3}   |  \cgood{3/3}   |  \cgood{3/3}^\ddagger  |  \cmid{2/3}   |  \cgood{3/3}   |  \cgood{3/3}   |  \cgood{3/3} 
P8 PR quality            |  \cgood{3/3}   |  \cgood{3/3}   |  \cgood{3/3}   |  \cbad{1/3}   |  \cbad{1/3}   |  \cgood{3/3}   |  \cbad{1/3}   |  \cmid{2/3}   |  \cmid{2/3} 
\midrule
Q1 API contract          |  \cna{match}  |  \cna{match}  |  \cna{match}  |  \cna{match}  |  \cna{match}  |  \cna{match}  |  \cna{match}  |  \cna{match}  |  \cna{match} 
Q2 ref.\ testy           |  \cmid{39/42}   |  \cbad{32/42}  |  \cgood{41/42}  |  \cmid{39/42}  |  \cmid{38/42}   |  \cbad{35/42}  |  \cmid{37/42}  |  \cmid{37/42}  |  \cbad{11/42} 
Q3 mutation score        |  \cgood{84 %}  |  \cbad{68 %}  |  \cmid{71 %}  |  \cbad{66 %}  |  \cna{—}  |  \cbad{62 %}  |  \cna{—^*}  |  \cbad{67 %}  |  \cmid{72 %} 
Q4 AC coverage           |  \cgood{25/25}   |  \cgood{25/25}   |  \cgood{25/25}   |  \cmid{23/25}   |  \cmid{23/25}   |  \cgood{24/24}   |  \cgood{24/24}  |  \cgood{24/24}  |  \cmid{22/24} 
Q5 lint warnings         |  \cbad{2}     |  \cmid{1}       |  \cmid{1}       |  \cmid{1}       |  \cgood{0}       |  \cbad{4}     |  \cbad{3}    |  \cbad{2}    |  \cbad{2} 
Q6 typecheck errors      |  \cna{0}      |  \cna{0}      |  \cna{0}      |  \cna{0}      |  \cna{0}      |  \cna{0}      |  \cna{0}     |  \cna{0}     |  \cna{0} 
Q7 složitost             |  \cbad{2}     |  \cgood{0}       |  \cmid{1}       |  \cmid{1}       |  \cgood{0}       |  \cbad{4}     |  \cmid{1}      |  \cmid{1}      |  \cbad{2} 
Q8 design quality        |  \cbad{1/3}   |  \cbad{1/3}   |  \cgood{3/3}    |  \cmid{2/3}     |  \cmid{2/3}     |  \cmid{2/3}     |  \cmid{2/3}    |  \cmid{2/3}    |  \cmid{2/3} 
\midrule
E1 vstup / výstup / Σ cache (tis.)  |  115 / 60 / 11528  |  76 / 41 / 3196  |  62 / 30 / 4770  |  81 / 36 / 5996  |  65 / 23 / 3028  |  \cna{—}  |  \cna{—}  |  \cna{—}  |  \cna{—} 
E2 trvání (min)          |  32{,}7      |  37{,}2      |  24{,}8      |  25{,}9      |  13{,}2      |  39          |  24         |  28         |  21 
E3 kompakce kontextu     |  0           |  0           |  1           |  0           |  0           |  \cna{—}    |  \cna{—}   |  \cna{—}   |  \cna{—} 
\bottomrule
[TABLE END]
\end{table}

— [DRAFT] —
^\S U ablace A/B chybí v lokálním snapshotu export session
(`transcript.json`) — E1 (tokeny) a E3 nešly dopočítat.
Kontrola repozitářů `7onc3k/bp-ablace-a-1`, `bp-ablace-a-2`,
`bp-ablace-b-1`, `bp-ablace-b-2` na GitHubu nenašla
`transcript.json` ve stromu souborů (export zůstává mimo git).

^\dagger P1 v r5 nelze určit — agent nevytvořil issues.

^\ddagger P7 v r5: judge hodnotil specifikační issue \#1 (vytvořenou
infrastrukturou), ne agentovu — viz sekce [ref:sec:omezeni-validita].

^* Stryker v A-2 nedokončil analýzu (timeout).

Q4 používá v rubrice 24 AC místo skutečných 25 (známý nedostatek,
viz sekce [ref:sec:omezeni-validita]); pilotní běhy mají Q4
přepočteno na 25.
— [/DRAFT] —

— [DRAFT] —
Tabulka ukazuje dva vzorce. Za prvé, pilotní iterace potvrzují
že instrukce lze iterativně zlepšovat: r1 (baseline) splnila 4/10
deterministických metrik, r3 (po dvou cyklech úprav) splnila 9/10.
Za druhé, ablace ukazují že ne všechny složky instrukcí přispívají
%% REVIEW: text naruje tabulku — zvážit přepis na interpretaci
stejně: odebrání verifikačních kroků (ablace A) zhoršilo 4 metriky
(Q2, Q3, Q5, Q7), zatímco odebrání sekce Package Quality (ablace B)
ponechalo automatizované metriky kvality na srovnatelné úrovni.

Napříč všemi devíti běhy zůstaly tři metriky stabilní: Q1 (API
contract match), Q6 (typecheck errors = 0) a nízký počet kompaktací
kontextu (E3: 0–1 u pilotů, u ablace neznámé). Nejvyšší variabilitu vykazovaly procesní metriky P2–P5,
které kolísaly i mezi běhy se stejnými instrukcemi (r3 vs.\ r4/r5).
Interpretaci těchto výsledků ve vztahu k cílům práce
a existující literatuře uvádí kapitola [ref:kap:vyhodnoceni].
— [/DRAFT] —

---

# Vyhodnocení a diskuse

— [DRAFT] —
Předchozí kapitola popsala průběh případové studie a naměřená data.
Tato kapitola výsledky interpretuje: nejprve ve vztahu ke třem cílům
práce (sekce [ref:sec:interpretace]), poté v kontextu existujícího
výzkumu (sekce [ref:sec:porovnani-literatura]) a nakonec diskutuje,
jak se metodologická omezení identifikovaná v sekci [ref:sec:omezeni-validita]
projevila v praxi (sekce [ref:sec:limity-vysledky]).
— [/DRAFT] —

%% ================================================================
## Interpretace výsledků

%% ================================================================

— [DRAFT] —
Kapitola [ref:kap:vymezeni] stanovila tři cíle: navrhnout sadu metrik
(cíl 1), iterativním postupem navrhnout instrukce (cíl 2)
a ablacemi identifikovat příspěvek jednotlivých složek (cíl 3).
Následující tři podsekce hodnotí, do jaké míry případová studie
každý cíl naplnila.
— [/DRAFT] —

%% —————————————————————-
### Cíl 1: Sada metrik

— [DRAFT] —
Prvním cílem bylo navrhnout sadu metrik, která měří proces a kvalitu
práce agenta, ne jen výsledek. Otázka pro vyhodnocení zní: zachytily
metriky rozdíly v chování agenta mezi iteracemi a ablacemi?

Tabulka [ref:tab:cross-run] ukazuje, že ano. Deterministické metriky
(P1–P5: procesní compliance, Q1–Q3: funkční korektnost,
Q5–Q7: kvalita kódu) zachytily jak zlepšení při iterativních
úpravách instrukcí (r1 \to r3: ze 4/10 na 9/10 splněných kritérií),
tak regrese při nedeterminismu modelu (r4, r5) i cílené dopady ablací
(Q5: 1 \to 3–4 po odebrání verifikačních kroků v ablaci A).
Metriky LLM-as-judge (P6–P8: kvalita commit zpráv, issue a PR
popisů; Q4: pokrytí acceptance criteria; Q8: design quality) přidaly
kvalitativní dimenzi,
kterou automatizované nástroje nezachytí: Q8 identifikovalo chybějící
JSDoc dokumentaci v r1 a r2, přestože ESLint žádný problém nehlásil.
Kombinace obou typů metrik zachycuje víc než kterýkoliv typ sám —
automatizované metriky neodhalí slabiny designu, judge sám nezachytí
detaily procesní compliance.

Tři metriky zůstaly stabilní napříč všemi devíti běhy: Q1 (API
contract match), Q6 (typecheck errors = 0) a nízký počet kompaktací
kontextu (E3: u pilotů 0–1; u ablace neznámé kvůli chybějícímu exportu).
Neúspěšné běhy způsobené tichým ukončením nástroje OpenCode byly
opakovány, viz sekce [ref:sec:omezeni-validita].
%% REVIEW-LAYERS: interpretace jako fakt — "znamená, že nejsou citlivé na změny instrukcí" a "jde o baseline schopnosti modelu" jsou interpretace prezentované jako přímý důsledek ("znamená"); chybí hedging; alternativní interpretace (např. práh je příliš nízký) není zmíněna
Stabilita těchto metrik znamená,
že nejsou citlivé na změny instrukcí — jde o baseline schopnosti
modelu, ne o efekt instrukcí. Slouží jako kontrolní metriky
které potvrzují, že agent produkuje validní kód nezávisle na
procesních instrukcích.

Nejvyšší variabilitu vykazovaly procesní metriky P2–P5 (branch per
issue, test-first commity, PRs linkované na issues, testy nezměněny
— binární kontroly dodržování pracovního postupu). Ty kolísaly
nejen mezi iteracemi s různými instrukcemi, ale i mezi běhy se
stejnými instrukcemi (r3: 5/5 vs.\ r4: \sim3/5 vs.\ r5:
\sim1/5).
%% REVIEW-LAYERS: interpretace jako fakt — "neodráží slabinu metrik, ale podstatnou vlastnost měřeného systému" je interpretace prezentovaná jako fakt; chybí vrstva PROČ to lze tvrdit (jaké jsou alternativní vysvětlení a proč je vylučujeme); "je nedeterministické" je závěr, ne pozorování
Tato variabilita neodráží slabinu metrik, ale
podstatnou vlastnost měřeného systému: dodržování vícekrokového
pracovního postupu je u tohoto modelu nedeterministické.
Metriky tento fenomén spolehlivě zachytily.

Sada 19 metrik se ukázala jako proveditelná pro opakované měření.
Deterministické metriky se extrahují automatizovaně (skript
`analyze-run.ts`), kvalitativní metriky hodnotí LLM-as-judge
s fixní rubrikou. Jedno kompletní měření trvá řádově minuty, což
umožňuje zpětnou vazbu v rámci jedné iterace.
— [/DRAFT] —

%% —————————————————————-
### Cíl 2: Iterativní postup

— [DRAFT] —
Druhým cílem bylo iterativním postupem navrhnout instrukce, které
dovedou agenta k dodržování stanovených exit kritérií. Otázka zní:
vede cyklus Spuštění/Měření/Diagnóza/Úprava k měřitelnému zlepšení?

Pilotní iterace ukazují, že ano. Baseline (r1) splnila 4 z 10
deterministických kritérií; po dvou cyklech úprav (r3) agent splnil
9 z 10. Každá iterace identifikovala konkrétní selhání, přiřadila mu
příčinu a navrhla cílenou opravu. Diagnostika se přitom opírala
o naměřená data, ne o subjektivní dojem — metriky poskytly
konkrétní vodítka kam zasáhnout.

Analýza průběhu iterací odhalila vzorec, kterým se instrukce
vyvíjely: obecná pravidla (r1: "jedna branch per issue") \to
konkrétní příkazy (r2: `git checkout -b issue-N`) \to
verifikační kroky (r3: `git log –oneline -3` jako kontrola
po commitu). Tento vzorec se opakoval u tří nezávislých selhání
(P2, P3, Q8) a odpovídá zjištění Breunigu [breunig2025], že
opakování ignorovaného pravidla nepomáhá — je třeba ho
přestrukturovat.

Regrese r4 a r5 ukazují limity postupu. R4 přidalo dvě deklarativní
pravidla do Constraints, přesto se zhoršily P2, P5 a Q3. R5 přidalo
dvě procedurální opravy do pre-PR checklistu, obě cílené opravy
zabraly (Q5 = 0, Q7 = 0), ale agent ignoroval celý pracovní postup
(P2–P4 nesplněny). Nedeterminismus modelu znamená, že stejné
instrukce nezaručují stejné výsledky. Návrat k předchozí verzi
instrukcí po neúspěšné iteraci je standardní postup v iterativním
návrhu [peffers2008]. R5 proto vycházel z r3,
ne z r4.

Z hlediska praktické proveditelnosti: každá iterace trvala 25–40
minut (běh agenta) plus řádově desítky minut na diagnostiku
a úpravu instrukcí. Diagnóza se opírala o tabulku metrik
a behaviorální popis z `FINDINGS.md` — postup je tedy
použitelný pro praktika bez specializovaného vybavení.
— [/DRAFT] —

%% —————————————————————-
### Cíl 3: Ablace

— [DRAFT] —
Třetím cílem bylo ablacemi identifikovat, které složky instrukcí
přispívají k měřenému chování agenta a které jsou redundantní.
Dvě ablace testovaly dvě složky s deterministickým chováním
v pilotních iteracích: verifikační kroky (ablace A) a sekci Package
Quality (ablace B).

%% REVIEW-LAYERS: závěr bez pozorování — "Verifikační kroky nejsou redundantní" je závěr jako první věta sekce, před jakýmkoli odkazem na data; pozorování (konkrétní pokles metrik) přichází až v další větě; přehodit pořadí
Verifikační kroky nejsou redundantní. Ablace A odebrala příkazy
`tsc –noEmit`, `npx eslint` a \texttt{git log
–oneline -3} z pracovního postupu. Dopad se projevil v pěti
metrikách: Q2 kleslo z 41/42 na 35–37/42, Q3 z 71 % na 62 %,
Q5 se zhoršilo z 1 na 3–4 warningů, Q7 z 1 na 1–4 violations
a agent spotřeboval přibližně dvakrát více testovacích cyklů.
Verifikační kroky plní dvojí funkci: zajišťují kontrolu kvality
kódu a současně strukturují práci agenta tím, že zabraňují
cyklickému debugování. Bez nich se agent častěji dostal do smyčky
opakovaného spouštění testů, což v jednom běhu vedlo k vyčerpání
kontextového okna.

Sekce Package Quality je pro automatizované metriky převážně
redundantní. Ablace B odebrala celou sekci (modulární struktura,
strict TypeScript, JSDoc, čisté veřejné API). Metriky Q5 (lint),
Q6 (typecheck) a Q7 (složitost) zůstaly na srovnatelné úrovni —
model produkoval kvalitní kód i bez explicitních konvencí. Q8 (design
quality) však kleslo z 3/3 na 2/3 ve všech ablačních bězích kde
judge hodnocení dokončil: chybějící modularita (veškerý kód v jednom
souboru v B-2) a neúplná dokumentace.
%% REVIEW-LAYERS: interpretace jako fakt — "jsou řízeny znalostmi z tréninku" je hypotéza bez hedgingu; "instrukce ovlivňují" je závěr; oba claims potřebují "naznačuje" / "data jsou konzistentní s hypotézou, že"; stejný unhedgovaný claim se opakuje v kap04 ablace-B a závěru ablací
Základní kódové konvence jsou
u tohoto modelu řízeny znalostmi z tréninku; strukturální rozhodnutí
jako modularita a dokumentace instrukce ovlivňují.

Procesní metriky (P1–P5) vykazovaly v obou ablacích variabilitu
srovnatelnou s pilotními iteracemi. Instrukce pro pracovní postup
zůstaly v obou ablacích beze změny — variabilita je důsledkem
nedeterminismu modelu, ne ablace.
%% REVIEW-LAYERS: interpretace jako fakt — "procesní compliance je stochastická vlastnost" je závěr/interpretace prezentovaná jako fakt ("ukazuje, že"); chybí hedging; "variabilita je důsledkem nedeterminismu" je také interpretace bez "naznačuje" — alternativní vysvětlení (např. rozdílný stav repo při každém běhu) není vyloučeno
Tento poznatek je sám o sobě
důležitý: ukazuje, že procesní compliance je u tohoto modelu
stochastická vlastnost, kterou instrukce ovlivňují jen částečně.
— [/DRAFT] —

%% ================================================================
## Porovnání s literaturou

%% ================================================================

— [DRAFT] —
Výsledky případové studie zasazujeme do kontextu šesti existujících
prací, které se zabývají vlivem instrukcí na chování AI agentů.

**Lulla et al. [lulla2026]** zjistili, že přítomnost
souboru `AGENTS.md` koreluje se snížením mediánového runtime
o 28,6 %. Naše data jsou s tímto nálezem kompatibilní: agent
s instrukcemi dokončil všechny běhy v čase 13–39 minut (E2). Naše
studie však přidává rozlišení, které Lulla et al.\ neizolovali: ne
všechen obsah instrukčního souboru přispívá stejně. Verifikační kroky
měly měřitelný dopad na čtyři metriky (Q2 referenční testy,
Q3 mutation score, Q5 lint, Q7 složitost), zatímco
sekce Package Quality ponechala automatizované metriky kvality na
srovnatelné úrovni. Efekt instrukčního souboru jako celku,
měřený Lullou et al., je tedy kompozicí nerovnoměrně přispívajících
složek.

**Gloaguen et al. [gloaguen2025agentsmd]** zjistili
pouze marginální zlepšení úspěšnosti (+4 %) u generických
instrukčních souborů a upozornili na zvýšený inference cost
(+20 %). Naše instrukce jsou procedurální, ne generické —
obsahují konkrétní příkazy a verifikační kroky místo popisu
adresářové struktury. Rozdíl ve výsledcích (naše instrukce
vykazují silnější efekt) podporuje hypotézu, že typ instrukčního
obsahu (procedurální scaffolding vs.\ popisná dokumentace) je
důležitější než samotná přítomnost instrukčního souboru.

**Li et al. [skillsbench2025]** rozlišují kurátorované
a automaticky generované instrukce. Kurátorované přinesly zlepšení
+16{,}2 procentních bodů, automaticky generované naopak mírné
zhoršení (-1{,}3 pp). Naše instrukce odpovídají kategorii
kurátorovaných: byly konstruovány z literatury
(sekce [ref:sec:konstrukce-instrukci]) a iterativně zpřesňovány na
základě naměřených dat. Zlepšení z 4/10 na 9/10 deterministických
kritérií je konzistentní s pozorováním Li et al., že kvalita obsahu
instrukcí je rozhodující.

**Breunig [breunig2025]** formuloval princip "neboř se
s váhami" — opakování ignorované instrukce nepomáhá,
přestrukturování ano. Evoluce instrukcí v naší pilotní fázi tento
princip přímo potvrzuje. R1 obsahovala obecné pravidlo "jedna branch
per issue", agent ho ignoroval. R2 přidala konkrétní příkaz
(`git checkout -b`), agent ho stále nesplnil. Až r3, která
přidala verifikační krok (`git log –oneline -3`) jako
kontrolní bod, dosáhla splnění. Stejný vzorec se opakoval u P3
a Q8. Naše data doplňují Breunigovo pozorování o konkrétní
mechanismus: obecné pravidlo \to konkrétní příkaz \to verifikační
krok jako kontrolní bod. Tento vzorec — postupná operacionalizace
od abstraktního pravidla ke konkrétnímu checkpointu — koresponduje
se širším výzkumem o vlivu specificity instrukcí na chování jazykových
modelů: Kim et al.\ zjistili, že explicitnější instrukce zlepšují
výsledky zejména u procedurálních úloh, ale přílišný detail může
omezit schopnost modelu reagovat na nepředvídané
situace [kim2025detail, zi2025specificity].
Ablace B naznačuje podobný efekt: sekce Package Quality fungovala
jako *enabling constraint* — obecný rámec, v jehož mezích
agent sám volil konkrétní řešení. Její odebrání neovlivnilo
automatizované metriky (Q5–Q7), ale zhoršilo designová rozhodnutí
(Q8), což naznačuje, že některé instrukce nepůsobí přímo, ale
vytvářejí podmínky pro kvalitní emergentní chování.

**Mao et al. [mao2025fse]** identifikovali sedm typů
komponent promptových šablon a zjistili, že Role a Directive se
nejčastěji objevují na začátku, Constraints na konci. Naše baseline
instrukce sledovaly toto pořadí. Ablace ukázala, že Constraints se
částečně překrývají s Process — deklarativní pravidlo v Constraints
(r4: "každé pole musí být použito") nemělo efekt, zatímco totéž
jako procedurální verifikace v Process (r5) ano. To koresponduje
s pozorováním Mao et al., že exclusion constraints jsou nejčastějším
typem omezení (46 % výskytů), ale naše data naznačují, že jejich
efektivita závisí na tom, zda jsou formulovány deklarativně nebo
procedurálně.

**Razavi a Fard [razavi2025]** varují před prompt
sensitivity: malé změny formulace mohou dramaticky změnit chování
modelu. Naše pilotní data toto riziko přímo demonstrují.
Instrukce r3 a r5 se lišily ve dvou řádcích pre-PR checklistu;
procesní compliance se přitom propadla z 5/5 na \sim1/5.
R4 přidalo dvě věty do Constraints a procesní compliance klesla
z 5/5 na \sim3/5. Tyto výkyvy nelze přičítat pouze změnám
instrukcí — jde o kombinaci prompt sensitivity
a nedeterminismu modelu, přesně jak Razavi a Fard predikovali.

**Specificita instrukcí a jejich mechanismus účinku.**
Existující výzkum instrukcí pro AI agenty se soustředí na to, jak
konkrétně agentovi říct co dělat — Mao et al.\ klasifikují
komponenty, Lulla et al.\ měří přítomnost souboru, Breunig doporučuje
operacionalizaci. Implicitní předpoklad je, že instrukce fungují
jako příkazy. Naše data naznačují, že instrukce mohou působit
i jiným mechanismem.

Verifikační kroky — nejkonkrétnější typ instrukce — agent
dodržoval spolehlivě a přímo zlepšovaly měřitelné metriky. Fungují
*vynucením*: kontrolují konkrétní výstup. Konvence v Package
Quality stojí na opačném konci spektra — neříkají *jak*
cíle dosáhnout, pouze *co* je žádoucí ("modulární
struktura", "strict TypeScript"). Jejich odebrání neovlivnilo
automatizované metriky (Q5–Q7), ale zhoršilo designová rozhodnutí
(Q8). Fungují *aktivací*: připomínají modelu znalosti
z tréninku, aniž by předepisovaly konkrétní řešení. Analogie
existuje v prompt engineeringu: chain-of-thought prompting ukazuje,
že minimální nápověda aktivuje latentní schopnost modelu efektivněji
než detailní instrukce [wei2022cot, min2022rethinking].

%% REVIEW-LAYERS: závěr bez pozorování — "neplní ani jednu funkci" je velmi silný závěr; chybí pozorování (jaká konkrétní data to dokládají — Constraints nebyly ablací testovány) a chybí hedging; jde o dedukci z pilotních dat (r4), ne z ablace Constraints
Pravidla v Constraints neplní ani jednu funkci — jsou příliš
abstraktní na vynucení a příliš explicitní na aktivaci. Tento
mechanismus — instrukce jako nápověda podporující emergentní
chování, ne jako příkaz vynucující konkrétní akci — je v kontextu
instrukčních souborů pro coding agenty dosud nepopsaný. Naše data
jsou indikativní (jedna ablace, jeden model); systematické testování
navrhujeme v sekci [ref:sec:dalsi-vyzkum].
— [/DRAFT] —

%% ================================================================
## Limity ve světle výsledků

%% ================================================================

— [DRAFT] —
Sekce [ref:sec:omezeni-validita] identifikovala metodologická
omezení designu studie. Zde diskutujeme, jak se tato omezení
projevila v naměřených datech.

**Nedeterminismus jako dominantní faktor.**
Interní validita studie je nejvíce ohrožena nedeterminismem modelu.
Procesní compliance (P1–P5) kolísala od 5/5 (r3) přes \sim3/5
(r4) po \sim1/5 (r5) při instrukcích, které se lišily minimálně.
Dva běhy per ablační variaci tento problém zmírňují — umožňují
odlišit systematický dopad ablace od náhodného šumu — ale
neposkytují statistickou sílu. Výsledky ablací proto interpretujeme
jako indikace, ne jako statisticky podložené závěry. Tam, kde oba
ablační běhy vykazují stejný trend (Q5 v ablaci A: 4 a 3 oproti
r3: 1), je důvěra v efekt ablace vyšší. Tam, kde se běhy výrazně
liší (Q2 v ablaci B: 37/42 vs.\ 11/42), nelze efekt ablace
spolehlivě odlišit od nedeterminismu.

**Prompt sensitivity potvrzena.**
Razavi a Fard [razavi2025] varují, že drobné změny promptu
mohou mít nepředvídatelné dopady. R4 přidalo dva řádky do
Constraints a procesní compliance se zhoršila, přestože žádná změna
přímo necílila na workflow. Toto pozorování potvrzuje, že změny
instrukcí mohou mít vedlejší efekty, které diagnostika nepředvídá.
V kontextu iterativního postupu to znamená, že každá úprava instrukcí
vyžaduje měření celé sady metrik, ne jen těch, na které úprava
cílila.

**Diagnostická chyba výzkumníka.**
V jedné iteraci došlo k záměně referenčních testů (metrika Q2,
agentovi neviditelné) s agentovými vlastními testy. Na základě
tohoto falešného předpokladu byla navržena instrukční změna, která
vedla k regresi. Chyba byla odhalena při revizi, referenční testy
opraveny na behavioral testy přes veřejné API a metrika Q2
přeměřena (sekce [ref:sec:omezeni-validita]). Tento incident
ukazuje důležitost auditovatelného řetězce rozhodnutí: bez
changelogu a korekčních poznámek v `FINDINGS.md` by chyba
zůstala neodhalena.

**Disconnect ESLint konfigurace.**
Agent v r3 spustil `eslint` s vlastní konfigurací, která
neobsahovala pravidlo `complexity` — dostal nula warningů
a kód považoval za hotový. Experiment přitom měří Q5 a Q7 s fixní
konfigurací, kde pravidlo je. Agent nemůže opravit problém,
o kterém neví. Explicitní požadavek na konkrétní ESLint konfiguraci
v r5 tento disconnect odstranil — jde o příklad situace, kdy
nestačí říct agentovi "spusť lint", ale je třeba specifikovat
i s jakou konfigurací.

**Cohenovo \kappa neprovedeno.**
Jak uvádí sekce [ref:sec:omezeni-validita], pět kvalitativních metrik
(P6–P8, Q4, Q8) slouží jako podpůrné indikátory. Hlavní závěry
studie stojí na deterministických metrikách. Jedinou výjimkou je Q8,
které odhalilo pokles designové kvality v ablacích — tento nález
automatizované metriky nezachytily, ale samotné hodnocení Q8 nelze
bez validace proti lidskému hodnocení považovat za objektivní měření.

**Známé nedostatky měřicí infrastruktury.**
Při validaci byly identifikovány tři nedostatky: (1) metrika Q4
používá v rubrice 24 AC místo skutečných 25 (chybí AC pro
konfiguraci svátků), (2) metrika P7 nefiltruje specifikační
issue vytvořenou infrastrukturou a v bězích bez agentových issues
hodnotí nesprávný artefakt, (3) detekce `any` v Q6
zachytává anglické slovo v komentářích (false positive). Všechny
tři nedostatky jsou konzistentní napříč běhy a neovlivňují
srovnání mezi iteracemi. Dále: u E1 srovnáváme vstupní a výstupní
tokeny ze `transcript.json` (viz
kap. [ref:sec:metriky-efektivity]); u vstupní strany počítáme
`input`+`cache.read`+`cache.write` na krok.
Třetí číslo E1 uvádí součet `cache.read`+`cache.write`
přes kroky (viz kap. [ref:sec:metriky-efektivity]).
Mezi běhy může hrát roli změna reportingu tokenů v OpenCode nebo úprava
`limit.context`.

**Změny prostředí mezi běhy.**
Běhy r1–r2 proběhly bez kontejnerové izolace, od r3 běží agent
v Docker kontejneru. Od r4 byla změněna konfigurace modelu.
Hlavní proměnné (model, instrukce, specifikace) zůstaly
konzistentní. Temperature modelu nebyla explicitně nastavena —
experiment používal výchozí konfiguraci poskytovatele. Nižší
temperature by mohla snížit variabilitu, ale omezila by
ekologickou validitu (praktik typicky používá výchozí nastavení).
OpenCode neukládá obsah `AGENTS.md` do exportovaného
transcriptu — nepřímým důkazem přijetí instrukcí je, že agent
v reasoning části cituje specifický obsah instrukcí.

**Tiché ukončení nástroje.**
Při ablačních bězích se OpenCode v některých případech tiše
ukončil uprostřed práce agenta. Běhy s vyšší spotřebou
kontextového okna (ablace A: \sim44 spuštění testů oproti
\sim20 u ablace B) byly postiženy častěji. Postižené běhy
byly opakovány; příčina nebyla identifikována.

**Generalizovatelnost.**
Omezení plynoucí z jednoho modelu, jednoho projektu
a deterministické specifikace diskutuje
sekce [ref:sec:omezeni-validita]. V praxi se tato omezení projevila
zejména u procesních metrik: variabilita P1–P5 neumožňuje odlišit
efekt instrukcí od nedeterminismu modelu bez většího počtu běhů.
Zda by instrukce fungovaly stejně na projektech s vyšší
nejednoznačností specifikace nebo na jiných modelech, zůstává
otevřenou otázkou (sekce [ref:sec:dalsi-vyzkum]).
— [/DRAFT] —

## Doporučení pro praxi

— [DRAFT] —
Případová studie přinesla poznatky, které mohou využít vývojáři
pracující s AI coding agenty. Následující doporučení vycházejí
z pilotních iterací a ablací; platí pro tento model a typ projektu,
ale principy jsou přenositelné.

**Verifikační kroky jsou klíčové.**
Explicitní příkazy v pracovním postupu (`tsc –noEmit`,
`npx eslint`, `git log –oneline -3`) agent dodržoval
spolehlivě i v bězích kde ignoroval zbytek pracovního postupu.
Bez nich se zhoršila kvalita kódu i funkční korektnost
(sekce [ref:sec:ablace-a]). Doporučení: každý měřitelný požadavek
na kvalitu převést na konkrétní příkaz v pre-PR checklistu.

**Konkrétní instrukce fungují lépe než obecná pravidla.**
Pravidlo ("každé pole musí být použito") v r4 nepomohlo.
Verifikační krok ("spusť eslint a ověř nula warningů") v r3
a r5 fungoval. Vzorec z pilotních iterací: obecné
pravidlo \to konkrétní příkaz \to verifikační krok s okamžitým
výstupem. Breunig [breunig2025] formuloval stejný princip jako
operacionalizaci: když agent pravidlo ignoruje, nepomůže ho
zopakovat — je třeba ho převést na konkrétní akci.

**Konvence kvality kódu jsou z velké části redundantní.**
Sekce Package Quality (modulární struktura, strict TypeScript, JSDoc)
měla minimální vliv na automatizované metriky Q5–Q7 — model
produkoval srovnatelný kód i bez ní (sekce [ref:sec:ablace-b]).
Strukturální rozhodnutí (modularita, dokumentace) se nicméně zhoršila
(Q8). Doporučení: konvence na úrovni kódu zkrátit na minimum,
investovat čas do verifikačních kroků.

**Počítat s nedeterminismem.**
Stejné instrukce vedly k procesní compliance 5/5 (r3), \sim3/5 (r4)
i \sim1/5 (r5). Vícekrokový pracovní postup agent dodržuje
nedeterministicky — nelze spoléhat na jednorázové ověření. Doporučení:
zavést měřitelná exit kritéria a opakované kontroly místo
jednorázového review.

**Minimální efektivní instrukce.**
Na základě ablací lze doporučit soubor `AGENTS.md`, který obsahuje:
(1) kontext projektu (role, cíl, specifikace),
(2) procedurální pracovní postup s konkrétními příkazy,
(3) pre-PR checklist s verifikačními kroky.
Konvence kvality kódu a deklarativní omezení jsou volitelné —
verifikační kroky plní jejich funkci efektivněji.
— [/DRAFT] —

%% ================================================================
## Náměty pro další výzkum

%% ================================================================

— [DRAFT] —
Případová studie otevřela několik otázek, které přesahují rozsah
této práce.

**Nedeterminismus vícekrokového pracovního postupu.**
Agent dodržoval verifikační příkazy (jednokrokové akce)
deterministicky, ale vícekrokový pracovní postup
(issue \to branch \to test \to implement \to PR)
nedeterministicky — r3 kompletně, r5 vůbec, při téměř identických
instrukcích. Možná vysvětlení zahrnují ztrátu pozornosti
v dlouhém kontextovém okně, stochastickou volbu mezi
strukturovaným a nestrukturovaným vývojem z tréninku modelu
a pozici instrukce v kontextu. Granulární ablace pracovního postupu
(které kroky jsou kritické?) a opakované běhy se stejnými
instrukcemi by tento fenomén pomohly lépe pochopit.

**Kontinuita práce mezi agenty.**
Procesní metriky (P1–P8) měří transparentnost artefaktů —
issues, commit zprávy, PR popisy. Otevřená otázka: stačí tato
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
běhu — místo pracovního postupu z `AGENTS.md` použije vlastní
postup odvozený ze specifikace. Ověřitelný checkpoint na začátku
běhu (agent musí explicitně potvrdit přečtení a aktivaci
pracovního postupu před prvním zápisem kódu) by mohl tento problém
adresovat.

**Mechanismy účinku instrukcí.**
Naše data naznačují dva odlišné mechanismy: *vynucení*
(verifikační kroky přímo kontrolují výstup) a *aktivace*
(obecné konvence připomínají modelu znalosti z tréninku). Analogie
existuje v prompt engineeringu: chain-of-thought prompting ukazuje,
že minimální nápověda může aktivovat komplexní latentní schopnost
modelu efektivněji než detailní instrukce. Systematický experiment
s odstupňovanou specificitou instrukcí — od nápověd ("piš
modulární kód") přes pravidla ("každé pole musí být použito")
po verifikační kroky ("spusť `tsc`, oprav chyby") — by
mohl identifikovat, která míra konkrétnosti je pro který typ
požadavku optimální. Otevřená je i otázka, zda se toto optimum
posouvá se schopnostmi modelu — lepší modely by mohly potřebovat
méně specifické instrukce (analogicky k expertise reversal effect
v kognitivní psychologii, kde instrukce účinné pro nováčky
zpomalují experty).

**Rozšíření na další modely a projekty.**
Výsledky platí pro jeden model (Minimax) a jeden typ projektu
(deterministická business logika). Replikace s jinými modely,
nedeterministickými doménami (UI, strojové učení) a většími
projekty by ukázala, které poznatky jsou přenositelné a které
specifické pro tento případ. Zvláště zajímavá je otázka projektů
s vyšší nejednoznačností specifikace (sekce [ref:sec:limity-vysledky]),
kde by obecnější instrukce (enabling constraints) mohly být
efektivnější než detailní příkazy.
— [/DRAFT] —

---

\chapter*{Závěr}
\addcontentsline{toc}{chapter}{Závěr}

— [DRAFT] —
Tato práce se zabývala návrhem sady metrik a iterativního postupu
pro systematické navrhování a vyhodnocování instrukcí pro AI coding
agenty. Oba výstupy byly ověřeny na případové studii systému
upomínek faktur, která zahrnovala pět pilotních iterací a čtyři
ablační běhy.

Prvním cílem bylo navrhnout sadu metrik, která měří proces a kvalitu
práce agenta, ne jen výsledek. Výsledná sada 19 metrik (procesní
P1–P8, produktové Q1–Q8, efektivita E1–E3) pokrývá tři dimenze
odvozené z taxonomie Fentona a Biemana. Metriky zachytily jak
zlepšení při iterativních úpravách instrukcí, tak regrese způsobené
nedeterminismem modelu i cílené dopady ablací. Kombinace
deterministických a kvalitativních metrik (LLM-as-judge) přináší
komplementární pohled — automatizované metriky nezachytí slabiny
designu, kvalitativní samy o sobě nezměří procesní compliance.

Druhým cílem bylo iterativním postupem navrhnout instrukce, které
dovedou agenta k dodržování stanovených exit kritérií. Cyklus
Spuštění/Měření/Diagnóza/Úprava zlepšil procesní compliance ze 4/10
na 9/10 splněných deterministických kritérií ve dvou iteracích.
Analýza průběhu odhalila opakující se vzorec: obecné pravidlo, které
agent ignoroval, bylo nahrazeno konkrétním příkazem a následně
doplněno verifikačním krokem. Každá iterace trvala 25–40 minut,
postup je tedy proveditelný pro praktika bez specializovaného
vybavení.

Třetím cílem bylo ablacemi identifikovat, které složky instrukční
sady přispívají k měřenému chování agenta. Verifikační kroky se
ukázaly jako neredundantní — jejich odebrání zhoršilo čtyři metriky
a vedlo k výrazně vyššímu počtu testovacích cyklů. Sekce Package
Quality byla pro automatizované metriky převážně redundantní, ale
ovlivnila designovou kvalitu hodnocenou LLM-as-judge. Dominantním
faktorem variability procesní compliance byl nedeterminismus modelu,
ne obsah instrukcí.

Hlavním přínosem práce jsou přenositelné výstupy: sada metrik
a iterativní postup, které může kdokoli aplikovat na vlastním projektu
s vlastními prahy. Konkrétní instrukce a naměřené hodnoty platí pro
tuto případovou studii. Práce je omezena na jeden model a jeden
projekt — závěry mají povahu analytické generalizace na teorii,
nikoliv statistické generalizace na populaci.
— [/DRAFT] —