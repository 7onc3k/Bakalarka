# Handoff — Terminologie operacionalizace a mechanismy instrukcí (2026-05-04)

## Aktuální stav

Pracovní větev: `dev`

Draft PR:
- <https://github.com/7onc3k/Bakalarka/pull/49>

PR už obsahuje čtyři textové vrstvy:

1. Terminologický cleanup:
   - `workflow` → `pracovní postup`
   - `checkpoint` → `kontrolní bod`
   - `kontrolní krok` → `verifikační krok`
   - `instrukční sada` → `instrukce`
   - `pilotní iterace` pro celek → `pilotní fáze`

2. Rámec demonstrace proveditelnosti / analytická generalizace:
   - `feasibility demonstrace` → `demonstrace proveditelnosti`
   - analytická generalizace zůstává metodický rámec pro čtení závěrů z jedné případové studie
   - nejde o synonymum demonstrace proveditelnosti

3. Abstrakt:
   - přepsaný méně technicky
   - méně závorek a kódů metrik
   - jasnější osa problém → metoda → výsledky → limit

4. Přenositelnost vzorce operacionalizace:
   - přenositelný je postup a sada metrik
   - otevřená otázka je, zda vzorec `pravidlo → příkaz → verifikační krok` platí i mimo programování
   - důvod: programování má deterministickou zpětnou vazbu (`test runner`, `lint`, `typecheck`)

## Nový otevřený problém

Řešíme dvojici:

- `vynucení`
- `aktivace`

Uživatel se správně zeptal, zda jde o pojmy z papers, nebo o naši terminologii.

Explorer ověřil lokální zdroje a závěr je:

> `vynucení` / `aktivace` jsou vlastní analytická syntéza práce, ne převzatá taxonomie z papers.

Literatura podporuje dílčí oporu, ale nedává hotovou dvojici:

- `wei2022cot`: prompting může vyvolat / elicituje reasoning.
- `min2022rethinking`: demonstrace v in-context learningu fungují jako strukturální vodítka, ne jen jako přímé příkazy.
- `kim2025detail`, `zi2025specificity`: specificita instrukcí ovlivňuje výkon, ale přílišný detail může omezovat reasoning.
- `razavi2025`: modely jsou citlivé na formulaci promptu.
- `breunig2025`: ignorované pravidlo nemá smysl jen opakovat; je lepší jej přestrukturovat do kontextu nebo pracovního postupu.

Bezpečný status pojmu:

> V této práci používáme `vynucení` a `aktivaci` jako interpretační rozlišení účinku instrukcí. Nejde o převzatou literární taxonomii; jde o syntézu výsledků případové studie opřenou o literaturu o promptingu, in-context demonstracích, specificitě instrukcí a citlivosti modelů na formulaci.

## Intuice pojmů

`Vynucení`:
- instrukce převádí požadavek na ověřitelný krok
- typicky má jasný externí výstup
- příklad: `spusť tsc --noEmit a oprav chyby`, `spusť eslint`, `zkontroluj git log`

`Aktivace`:
- instrukce spíš připomíná nebo vyvolává žádoucí chování, které model pravděpodobně už umí
- nemá tvrdý deterministický výstup
- příklad: `piš modulární kód`, `dbej na dokumentaci`, `odděluj odpovědnosti`

V programování je vynucení silné, protože existují nástroje s jednoznačnou zpětnou vazbou. U designové kvality, dokumentace nebo plánování často zůstáváme blíž aktivaci.

## Kde se s tím pracuje

Hlavní výskyty:

- `thesis/kap02.tex`
  - odstavec `Mechanismy účinku`
  - současná formulace může znít, jako by literatura přímo rozlišovala vynucení a aktivaci

- `thesis/kap05.tex`
  - porovnání s literaturou kolem Package Quality
  - doporučení pro praxi
  - náměty pro další výzkum, odstavec `Mechanismy účinku instrukcí`

- `thesis/TERMINOLOGIE.md`
  - zatím ukotvuje `pravidlo / příkaz / verifikační krok`
  - neukotvuje explicitně `vynucení / aktivace`

## Rozhodnutí před další editací

Nejdřív rozhodnout, jak silně chceme pojmy používat.

### Varianta A — ponechat, ale explicitně jako vlastní syntézu

Doporučená varianta.

Úpravy:
- doplnit `TERMINOLOGIE.md`
- změkčit `kap02`, aby bylo jasné, že literatura podporuje oporu, ale pojmenování je naše
- v `kap05` doplnit formulace typu:
  - `naše data naznačují`
  - `v této práci toto rozlišení používáme interpretačně`
  - `nejde o převzatou taxonomii`

Výhoda:
- zachováme užitečný vysvětlující rámec
- oponent nemůže říct, že podsouváme literatuře pojem, který nepoužívá

Riziko:
- text se může mírně zatížit meta-vysvětlením, pokud to přeženeme

### Varianta B — pojmy zjemnit a méně je pojmenovávat

Úpravy:
- odstranit silná slova `vynucení` / `aktivace` z některých míst
- psát opisně:
  - `verifikační kroky přímo kontrolují výstup`
  - `obecnější konvence spíš připomínají žádoucí směr`

Výhoda:
- menší terminologická zátěž

Riziko:
- ztratíme hezké vysvětlení, proč se Package Quality chovala jinak než verifikační kroky

### Varianta C — nedělat nic

Nedoporučeno.

Riziko:
- oponent se může zeptat, odkud přesně pochází dvojice `vynucení / aktivace`
- současný text místy může znít, že jde o zavedenou literární taxonomii

## Doporučený další krok

Zvolit variantu A.

Minimální patch:

1. `thesis/TERMINOLOGIE.md`
   - přidat sekci nebo řádek:
     - `Vynucení / aktivace`
     - status: vlastní analytické rozlišení této práce
     - opora: Wei, Min, Kim/Zi, Razavi, Breunig
     - explicitně: není převzatá taxonomie z literatury

2. `thesis/kap02.tex`
   - změnit `Chování modelu lze tedy ovlivnit přímým vynucením i aktivací latentních znalostí...`
   - bezpečněji:
     - `Tato literatura podporuje interpretační rozlišení, které používáme v této práci: část instrukcí působí jako přímé vynucení ověřitelného kroku, část jako aktivace nebo připomenutí latentních znalostí.`

3. `thesis/kap05.tex`
   - v místech kolem Package Quality a `Mechanismy účinku instrukcí` doplnit, že jde o interpretaci případové studie
   - nedělat z toho novou obecnou taxonomii

Po patchi:
- spustit grep na `vynucen|aktivac`
- ověřit, že každé použití je buď jasně lokální interpretace, nebo odkazuje na naše rozlišení
- commitnout do PR jako nový commit

## Co teď nedělat

- Neotevírat znovu rámec demonstrace proveditelnosti / analytická generalizace. Ten už je vyřešený.
- Nepsat dlouhou novou teorii do `kap02`.
- Nehledat za každou cenu paper, který používá přesně `enforcement vs activation`; explorer už ukázal, že opora je nepřímá.
- Neclaimovat, že literatura toto rozlišení zavádí.

## Stav pracovního stromu

Před handoffem zůstávaly mimo PR necommitnuté změny:

- nested / experimentální adresáře pod `experiments/`
- `konzultace/07-sedma-schuzka.md`

Tyto změny nejsou součástí terminologického PR a nemají se míchat do dalšího textového commitu bez samostatného rozhodnutí.
