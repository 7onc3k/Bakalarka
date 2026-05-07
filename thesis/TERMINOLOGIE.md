# Terminologie BP

Kanonické pojmy pro konzistentní psani a pripravu na obhajobu.

## Metodologie

| Pojem | Definice | Poznamka |
|-------|----------|----------|
| DSR (Design Science Research) | Vyzkumny pristup: navrhujeme artefakt a evaluujeme ho | Peffers 2008, Hevner 2004 |
| Pripadova studie (case study) | Vyzkumna strategie: evaluace na jednom pripadu do hloubky | Yin 2018; NE "experiment" pro celek studie |
| Demonstrace proveditelnosti | Prakticke ramovani: pripadova studie ukazuje, ze navrzenou sadu metrik a iterativni postup lze aplikovat na jednom pripadu | NE "feasibility demonstrace" v ceske prose |
| Analyticka generalizace | Metodologicke ramovani pripadove studie podle Yina: z jednoho pripadu lze formulovat principy pro dalsi overeni, ne statisticke tvrzeni o populaci | Neni synonymum demonstrace proveditelnosti; pouzit jen pri diskusi validity a logiky zobecneni |
| Experimentalni beh | Jedno spusteni agenta s konkretni verzi instrukci | "run" v infrastrukture; "beh" v bezne prose |
| Iterace | Jeden cyklus Spusteni/Mereni/Diagnoza/Uprava | |
| Pilotni faze | Cela serie iteraci r1-r5 | NE "pilotni iterace" pro fazi |
| Ablace | Faze kde z fungujici sady systematicky odebirame slozky instrukci a merime dopad | Druha faze pripadove studie (po pilotu); cil 3 |
| ~~Komparativni variace~~ | NEPOUZIVAME | Pouzivali jsme jako umbrella, ale realne delame jen ablace; sjednoceno na "ablace" |

## Metriky

| Pojem | Definice | Poznamka |
|-------|----------|----------|
| Sada metrik | P1-P8, Q1-Q8, E1-E3 (19 celkem) | Fenton & Bieman: Process/Product/Resource; P/Q/E kody jsou nase adaptace |
| Procesni metriky (P1-P8) | Jak agent pracuje | P1-P5 binarni compliance, P6-P8 LLM-as-judge |
| Produktove metriky (Q1-Q8) | Co agent vyrobil | Q1-Q2 funkcni korektnost, Q3-Q4 kvalita testu, Q5-Q8 kvalita kodu |
| Metriky efektivity (E1-E3) | E1 = max prompt na kroku + soucet vystupu + soucet cache; E2 = cas; E3 = pocet kompakci kontextu (z OpenCode DB time_compacting) | Resource v Fentonove taxonomii |
| Exit kriteria | Meritelne prahy uspesnosti pro kazdou metriku | Patri do pilotni faze (3.3.3), ne k metrikam |
| ~~evaluacni system~~ | NEPOUZIVAME | Prilis vague, konflikt se "sadou metrik" |

**Pravidlo pro kody metrik:** Pri prvnim vyskytu skupiny v kazde kapitole pridat zavorku s kratkym vysvetlenim. Priklady:
- "procesni metriky P2--P5 (branch per issue, test-first, PRs linkovane, testy nezmeneny)"
- "funkcni korektnost a kvalita testu (Q1--Q4)"
- "kvalita kodu (Q5--Q8)"
Pri dalsich vyskytech ve stejne kapitole staci jen kod.

### Klasifikace metrik

Tri ortogonalni osy:

1. **Zpusob mereni** — `deterministicka` (skript, regex, log parsing, staticka analyza) vs `judge-based` (LLM judge, GLM-5)
2. **Role v hodnoceni** — `exit kriterium` / `pass/fail kriterium` (ma prah uspesnosti) vs `deskriptivni indikator` (zadny prah, hodnotu jen zaznamenavame)
3. **Kategorie (bucket)** — `procesni (P)` vs `produktove (Q)` vs `zdrojove (E)`

#### Pravidla pouziti

- `deterministicka metrika` = jen zpusob mereni; NIKDY jako synonymum pro "kriterium s pass/fail prahem"
- `binarni pass/fail kriterium` / `procesni a produktove kriterium s exit prahem` = role v hodnoceni; preferovat per-metric vycet pokud mozno
- `deskriptivni indikator` = metrika bez exit prahu; v teto praci sem patri **cely E bucket** (E1, E2, E3) — pass/fail soud o behu se opira jen o P + Q
- judge-based metrika v pass/fail soudu existuje (Q4, Q8 maji prahy) ale je odlisena od deterministickych; nemichat „deterministicka" a „pass/fail" do jednoho slova

#### E3 specificky

E3 (pocet kompakci kontextu) je **deskriptivni indikator stability runtime**, ne pass/fail kriterium. Cil 0 nema v teto praci roli exit prahu — je to kontextovy fakt, ze kontext zustal celistvy. E bucket je tim homogenne deskriptivni (E1, E2, E3 vsechny bez prahu).

## Instrukce a agent

| Pojem | Definice | Poznamka |
|-------|----------|----------|
| Instrukce | Obecny pojem pro obsah | Kanonicky termin; pri 1. vyskytu per kap: "instrukce v souboru `AGENTS.md`" |
| Soubor `AGENTS.md` | Konkretni soubor | V textu vzdy `\texttt{}`; pouzit kdyz mluvime o souboru, ne o obsahu |
| Instrukcni soubor | Obecne oznaceni fyzickeho souboru s instrukcemi (napr. `AGENTS.md`, `CLAUDE.md`) | Pouzit jen kdyz mluvime o souboru jako artefaktu; default termin pro obsah zustava "instrukce" |
| ~~instrukcni sada~~ | NEPOUZIVAME | Plete se s "sada metrik" |
| ~~checkpointy~~ | NEPOUZIVAME | Anglicismus, zamenitelny s CS terminem |
| ~~kontrolni krok~~ | NEPOUZIVAME | Zamena s "verifikacni krok" |

### Operacionalizace instrukci

**Operacionalizace** = proces prevodu abstraktni instrukce na konkretni akci (Breunig 2025).
Empiricke zjisteni z pilotu: cim konkretnejsi instrukce, tim spolehlivejsi dodrzovani.

Spektrum od nejslabsiho po nejsilnejsi:

| Typ | Co rika | Priklad | Kde v AGENTS.md | V textu |
|-----|---------|---------|-----------------|---------|
| **Pravidlo** | co ma platit (agent si pohlida sam) | "kazde pole musi byt pouzito" | Constraints | "pravidlo" |
| **Prikaz** | co udelat (jednorazova akce) | "napiste testy" | Process (tvurci cast) | "prikaz" |
| **Verifikacni krok** | co zkontrolovat + co udelat kdyz selze | "spust `tsc --noEmit`, oprav vsechny chyby" | Process (pre-PR checklist) | "verifikacni krok" |

Klicove zjisteni z pilotu: agent verifikacni kroky dodrzoval spolehlive, pravidla ignoroval. Prikazy dodrzoval castecne (zavisi na nedeterminismu).

POZOR: Toto je empiricke pozorovani z nasi case study, ne taxonomie z literatury.

**Vynuceni / aktivace**: vlastni interpretacni rozliseni teto prace, pouzivane primarne v diskusi vysledku (kap05), ne teoreticka taxonomie z kap02.
- vynuceni = instrukce prevadi pozadavek na overitelny krok s externi zpetnou vazbou (napr. `tsc`, `eslint`, `git log`)
- aktivace = instrukce pripomina nebo vyvolava chovani, ktere model pravdepodobne umi z treninku (napr. modularita, dokumentace, designove konvence)
- literatura poskytuje neprimo oporu pro oba typy pusobeni instrukci, ale nezavadi tuto dvojici pojmu jako hotovou taxonomii

Souvisejici literatura:
- Kim et al. 2025 (DETAIL): specificita zlepsuje vysledky, ale prilis detail omezuje reasoning
- Kalyuga et al. 2003: expertise reversal effect — instrukce pro novacka skodi expertovi
- Breunig 2025: operacionalizace — presturkturovani > opakovani
- Juarrero 2023: enabling constraints — omezeni ktera umoznuji emergentni chovani

**Deklarativni** a **proceduralni** — lze pouzit jako odborne pojmy, ale pri prvnim vyskytu per kapitola vzdy s vysvetlenim:
- deklarativni = pravidla (co ma platit)
- proceduralni = prikazy a verifikacni kroky (co udelat/zkontrolovat)
| Pracovni postup | Cesky pro "workflow" | Anglicky jen pri prvni definici jako `\textit{workflow}` |

## Testovani

| Pojem | Definice | Poznamka |
|-------|----------|----------|
| Black-box testovani | Testovani pres verejne rozhrani, bez znalosti vnitrni struktury implementace | Klasicka dichotomie black-box vs white-box (Ammann & Offutt 2016); zavedeno v kap02 sec:testovani-mutation |
| White-box testovani | Testovani vychazejici ze znalosti kodu (cesty, vetve) | Protiklad black-box; zminujeme jen pro kontext |
| Behavior-driven test | Test odvozeny ze specifikace chovani (typicky AC nebo Given/When/Then), pracujici black-box pres rozhrani | Pouzivano v kap04 (42 behavioral testu); definovano v kap02 sec:testovani-mutation |
| Acceptance criteria (AC) | Popisy ocekavaneho chovani v zadani, typicky ve formatu Given/When/Then | 25 AC v case study; zdroj ocekavani pro behavioral testy a metriku Q4 |
| Spec-first TDD | TDD varianta kde expected values v testech pochazi ze specifikace, ne z pozorovani kodu | Obrana proti test oracle problemu (Mathews 2024); diskutovano v kap02 sec:procesni-kvalita |
| Mutation testing | Sileni testovaci sady pomoci zavadeni drobnych zmen (mutantu) do kodu a sledovani kolik test odhali | Papadakis 2019; metrika Q3 |
| Coverage (line/branch) | Podil kodu vykonaneho testy | Sama o sobe nekoreluje silne s detekci chyb (Inozemtseva & Holmes 2014) |

## Projekt

| Pojem | Definice | Poznamka |
|-------|----------|----------|
| System upominek faktur | Testovaci projekt (pripadova studie) | NE "dunning system", NE "billing reminder" |
| Agent | AI coding agent | Po definici zkracene "agent" |

## Urovne vyzkumu (pro prezentaci)

```
DSR (pristup)          --> CO delame (navrhujeme metriky + postup, evaluujeme)
  +-- Pripadova studie --> JAK evaluujeme (jeden pripad do hloubky)
       +-- Experimentalni behy --> DATA
           +-- Metriky         --> MERENI
```

## Nepouzivame a proc

| Termin | Proc ne | Misto toho |
|--------|---------|------------|
| evaluacni system | Nedefinovany, vague | sada metrik |
| instrukcni soubor jako synonymum obsahu instrukci | Mate soubor a obsah | instrukce |
| instrukcni sada | Plete se s "sada metrik" | instrukce |
| checkpointy | Anglicismus, zamenitelny | verifikacni kroky |
| workflow (v textu) | Anglicismus | pracovni postup |
| experiment (samostatne) | Nejednoznacne | pripadova studie (celek), experimentalni beh (jednotlivy) |
| pilotni iterace (pro fazi) | Matouci — iterace je jeden cyklus | pilotni faze |
| feasibility demonstrace | Hybridni anglicismus | demonstrace proveditelnosti |
| „X z N deterministickych kriterii" | Slovo „deterministickych" je nadbytecne nebo zavadejici (mate zpusob mereni a roli v hodnoceni) | per-metric vycet, nebo „X binarnich pass/fail kriterii" |
| „kompakce jako kriterium" / „cil E3 = 0" | E3 je deskriptivni indikator stability runtime, ne pass/fail kriterium; cil 0 nema v teto praci roli exit prahu | „E3 = 0 potvrzuje, ze kontext zustal celistvy" |
| „deterministicka kriteria" jako synonymum pass/fail | Mate zpusob mereni (det vs judge) a roli v hodnoceni (exit vs deskriptivni) | „pass/fail kriteria" / „kriteria s exit prahem" |
