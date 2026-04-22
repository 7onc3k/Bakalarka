# Thesis State Snapshot

Last verified: 2026-04-22

Tento soubor obsahuje **perishable state** o aktualnim stavu thesis.
Meni se po kazde vetsi pracovni session.

**Pravidlo cerstvosti**: Pokud je `Last verified` starsi nez 3 dny, znovu auditovat **predtim**, nez z toho cokoli vyvodis. Stale snapshot muze byt horsi nez zadny snapshot — vede k rozhodnutim na nepravdivych datech.

Hlavni pravidla a procedura zijou v `handoffs/27-thesis-full-pass-anchor.md`.

## Current phase position

Aktualni faze v Phases (z handoffu 27): **Faze 1-4 dokonceny v kontextu, Faze 6 probiha**.

Holistic load, ideal structure a delta map byly provedeny v hlavnim kontextu a nasledovala rewrite pass na `kap02` az `kap05`, `uvod`, `kap01`, `zaver` a abstrakt v `prace.tex`.

## Truthful current state

Stav po holistic loadu, rewrite passu a mechanickem count checku (k datu `Last verified`):

| Soubor | Pravdivy stav |
|--------|---------------|
| `thesis/kap01.tex` | zaklad drzi; 6 raw bloku a 2 otevrena TODO/REVIEW mista, hlavni scope claim uz zeslaben |
| `thesis/kap02.tex` | teorie je v normalnim textu bez draft wrapperu; stale 16 raw bloku a 14 otevrenych TODO/REVIEW mist |
| `thesis/kap03.tex` | metodika byla srovnana s argumentem prace; 16 raw bloku a 9 otevrenych TODO/REVIEW mist |
| `thesis/kap04.tex` | vysledkova kapitola uz neni draft-heavy, ale stale obsahuje 10 raw bloku a 16 otevrenych TODO/REVIEW mist, hlavne kolem detailnich tabulek a bridge do ablaci |
| `thesis/kap05.tex` | diskuse byla vyrazne srovnana a 5.2 uz neni RAW kostra; stale 9 raw bloku a 9 otevrenych TODO/REVIEW mist |
| `thesis/uvod.tex` | finalni text bez draft wrapperu; 1 raw blok, bez otevreneho TODO/REVIEW |
| `thesis/zaver.tex` | finalni text bez draft wrapperu; 1 raw blok, bez otevreneho TODO/REVIEW |

## Hard blockers before any polishing

Tyto veci se musi vyresit driv, nez zacneme prevadet drafty do finalu:

1. **`kap04` a `kap05` jeste potrebuji finalni consistency pass.**
   Nejvetsi zbyvajici riziko je nesoulad mezi tabulkami, textem a experiment artefakty v detailnich radcich.

2. **Q4 reporting je v thesis doreseny, ale infra vrstva jeste ne.**
   Specifikace obsahuje 25 AC a thesis uz reportuje 25 po doplneni drive zapomenuteho AC25. Ulozene judge behy a skripty ale stale nesou 24bodovy format, takze bude vhodne je pozdeji srovnat i v tooling vrstve.

3. **Zdrojovy cleanup jeste neni dokoncen.**
   Finalni text uz neni ve `draft` wrapperu, ale stale existuji raw audit bloky a komentare `TODO/REVIEW`, ktere je treba pred uplnym uzavrenim znovu projit.

## Master inconsistencies to fix first

First-pass truth checklist. Plati pred Fazi 6 (rewrite). Razeno orientacne podle dopadu (semantic > mechanical):

- **`Q4` tooling a terminologie jeste nejsou zcela srovnane.** *(semantic, vysoky dopad)*
  Thesis uz reportuje 25 AC po doplneni drive nezapocitaneho AC25, ale infra skripty a ulozene judge vysledky stale nesou 24bodovy format a `TERMINOLOGIE.md` jeste drzi starsi seskupeni `Q1-Q4`.

- **Sila tvrzeni je nestabilni.** *(semantic, vysoky dopad)*
  Text misty rika `feasibility`, jinde mluvi o `primem kauzalnim efektu` nebo `neredundantnich` slozkach, i kdyz data jsou z jedne case study a dvou replik na variaci.

- **`r1 → r3` zlepseni neni sjednocene.** *(numeric, stredni dopad)*
  Hlavni viditelne vrstvy uz byly srovnany na `4/10 → 7/10`, ale stale je potreba finalni sweep pres vsechny tabulky, audit commentary a zbytkove formulace.

## How to refresh this snapshot

Pri auditu thesis state:

1. Pro kazdou kapitolu spocitat pocet:
   - raw bloku: `grep -c '\begin{raw}' thesis/kapXX.tex`
   - draft bloku: `grep -c '\begin{draft}' thesis/kapXX.tex`
   - otevrenych TODO/REVIEW znacek: `grep -cE 'TODO|REVIEW' thesis/kapXX.tex`
2. Pro kazdy hard blocker overit, jestli stale plati nebo byl vyresen.
3. Pro kazdou inconsistency overit, jestli stale existuje (grep terminu napric kapitolami).
4. Aktualizovat `Last verified` na dnesni datum.
5. Pokud novy blocker / inconsistency objeven: pridat do prislusne sekce.
6. Pokud blocker / inconsistency vyresen: smazat (toto je perishable state, ne audit log — historie zije v git logu).
7. Aktualizovat `Current phase position`, pokud se faze posunula.
