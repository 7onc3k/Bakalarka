# Terminologie BP

Kanonické pojmy pro konzistentní psani a pripravu na obhajobu.

## Metodologie

| Pojem | Definice | Poznamka |
|-------|----------|----------|
| DSR (Design Science Research) | Vyzkumny pristup: navrhujeme artefakt a evaluujeme ho | Peffers 2008, Hevner 2004 |
| Pripadova studie (case study) | Vyzkumna strategie: evaluace na jednom pripadu do hloubky | Yin 2018; NE "experiment" pro celek |
| Experimentalni beh | Jedno spusteni agenta s konkretni verzi instrukci | "run" v infrastrukture |
| Iterace | Jeden cyklus Spusteni/Mereni/Diagnoza/Uprava | |
| Pilotni faze | Cela serie iteraci r1-r5 | NE "pilotni iterace" pro fazi |
| Komparativni variace | Faze kde odebirame/menime slozky instrukci | Umbrella term pro ablace + substituci |
| Ablace | Konkretni technika: odebrani slozky a mereni dopadu | Podtyp komparativni variace |

## Metriky

| Pojem | Definice | Poznamka |
|-------|----------|----------|
| Sada metrik | P1-P8, Q1-Q8, E1-E3 (19 celkem) | Fenton & Bieman: Process/Product/Resource; P/Q/E kody jsou nase adaptace |
| Procesni metriky (P1-P8) | Jak agent pracuje | P1-P5 binarni compliance, P6-P8 LLM-as-judge |
| Produktove metriky (Q1-Q8) | Co agent vyrobil | Q1-Q4 funkcni korektnost, Q5-Q8 kvalita kodu |
| Metriky efektivity (E1-E3) | E1 = max `tokens.total` v exportu; E2 = cas; E3 = kompakce kontextu (+ vedlejsi dokonceni/restarty) | Resource v Fentonove taxonomii |
| Exit kriteria | Meritelne prahy uspesnosti pro kazdou metriku | Patri do pilotni iterace (3.3.3), ne k metrikam |
| ~~evaluacni system~~ | NEPOUZIVAME | Prilis vague, konflikt se "sadou metrik" |

**Pravidlo pro kody metrik:** Pri prvnim vyskytu skupiny v kazde kapitole pridat zavorku s kratkym vysvetlenim. Priklady:
- "procesni metriky P2--P5 (branch per issue, test-first, PRs linkovane, testy nezmeneny)"
- "funkcni korektnost (Q1--Q4)"
- "kvalita kodu (Q5--Q8)"
Pri dalsich vyskytech ve stejne kapitole staci jen kod.

## Instrukce a agent

| Pojem | Definice | Poznamka |
|-------|----------|----------|
| Instrukce | Obecny pojem pro obsah | Kanonicky termin; pri 1. vyskytu per kap: "instrukce v souboru `AGENTS.md`" |
| Soubor `AGENTS.md` | Konkretni soubor | V textu vzdy `\texttt{}`; pouzit kdyz mluvime o souboru, ne o obsahu |
| ~~instrukcni sada~~ | NEPOUZIVAME | Plete se s "sada metrik" |
| ~~instrukcni soubor~~ | NEPOUZIVAME | Zbytecne synonymum |
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
Souvisejici literatura:
- Kim et al. 2025 (DETAIL): specificita zlepsuje vysledky, ale prilis detail omezuje reasoning
- Kalyuga et al. 2003: expertise reversal effect — instrukce pro novacka skodi expertovi
- Breunig 2025: operacionalizace — presturkturovani > opakovani
- Juarrero 2023: enabling constraints — omezeni ktera umoznuji emergentni chovani

**Deklarativni** a **proceduralni** — lze pouzit jako odborne pojmy, ale pri prvnim vyskytu per kapitola vzdy s vysvetlenim:
- deklarativni = pravidla (co ma platit)
- proceduralni = prikazy a verifikacni kroky (co udelat/zkontrolovat)
| Pracovni postup | Cesky pro "workflow" | Anglicky jen pri prvni definici jako `\textit{workflow}` |

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
| instrukcni soubor | Zbytecne synonymum | instrukce |
| instrukcni sada | Plete se s "sada metrik" | instrukce |
| checkpointy | Anglicismus, zamenitelny | verifikacni kroky |
| workflow (v textu) | Anglicismus | pracovni postup |
| experiment (samostatne) | Nejednoznacne | pripadova studie (celek), experimentalni beh (jednotlivy) |
| pilotni iterace (pro fazi) | Matouci — iterace je jeden cyklus | pilotni faze |
