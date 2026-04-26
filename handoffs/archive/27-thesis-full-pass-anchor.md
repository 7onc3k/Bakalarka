# Thesis Full-Pass Anchor

Datum: 2026-04-22 (posledni revize)

Tento soubor je aktualni strategicka kotva pro dokonceni thesis.
Pred jakoukoli dalsi praci na `thesis/` nejdriv otevri tento soubor.

Pouziti:
- Tento handoff je jediny aktivni steering dokument pro thesis full pass.
- Definuje **jak** se k psani pristupuje (operating procedure) a **jaka pravidla** pri tom plati.
- Aktualni snapshot **stavu** thesis (raw bloky, TODO, hard blockers, master inconsistencies) zije v `handoffs/27-thesis-state-snapshot.md`. V tomto handoffu jsou jen casove neprchave veci.
- Historicke plany a handoffy ber jako audit trail, ne jako aktualni plan.
- Pokud se nova session zacne rozjizdet do vice smeru, vrat se sem.

## Active steering set

Za aktivni steering pro thesis povazuj jen tyto soubory:

- `handoffs/27-thesis-full-pass-anchor.md` — tento soubor (procedure + pravidla)
- `handoffs/27-thesis-state-snapshot.md` — perishable state (overit `Last verified` v hlavicce)
- `AGENTS.md`
- `CLAUDE.md`
- `notes/prirucka-craft-of-research.md`
- `notes/jak-psat-vedecky.md`
- `notes/doporuceni-fis.md`
- `thesis/TERMINOLOGIE.md`
- `thesis/makra.tex`
- aktualni chapter texty v `thesis/`

Vsechno ostatni je bud podklad, nebo historie.
Zejmena `TODO.md`, `HANDOFF.md`, `notes/NEXT STEPS.md`, stare `research-scope` verze a archivni handoffy nesmi ridit smer prace.

## Canonical placement rules

Aby se session znovu neotravily root bordelem, drz toto:

- akademicke papers a citacni podklady patri do `thesis/sources/`
- stare scope a brainstorming materialy patri do `notes/archive/`
- formalni a administrativni podklady patri do `handoffs/assets/`
- binarni downloady a jednorazove utility soubory patri do `docs/archive/` nebo `temp/`
- `zadani.pdf` muze zustat v rootu, je to aktivni formalni dokument
- root nema slouzit jako odkladiste papers ani starych planu

## Craft Of Research anchor

Nesmime ztratit rozdil mezi `topic`, `question` a `problem`.

- `Topic`: AI coding agenti, instrukce, benchmarky.
- `Question`: Jak merit a iterativne zlepsovat chovani AI coding agenta pomoci instrukci?
- `Problem`: Pass/fail benchmarky nestaci pro prakticke rozhodovani o pouzitelnosti agenta a chybi prenositelny postup, jak instrukce systematicky navrhovat a vyhodnocovat.
- `So what`: Praktik jinak muze precenit vystup, ktery projde testy, ale neobstoji procesne nebo kvalitativne.

Tri urovne prace:
- `system upominek faktur` = testovaci prostredi
- `agent pise kod` = pozorovane chovani
- `instrukce` = nezavisla promenna

Prenositelne nejsou konkretni instrukce ani konkretni cisla z behu.
Prenositelne jsou `sada metrik + iterativni postup`.

## Main intent of the thesis

Jednoveta kotva:

Tato prace ma ukazat, jak navrhnout a pouzit sadu metrik, ktera vedle funkcni spravnosti zachyti i proces a kvalitu kodu AI coding agenta, a jak podle techto metrik iterativne navrhovat instrukce.

Prakticky to znamena tri veci:

- navrhnout `sadu metrik` pro proces, kvalitu kodu a efektivitu
- na `pripadove studii` ukazat iterativni postup navrhu instrukci rizeny temito metrikami
- `ablacemi` prozkoumat, ktere slozky instrukci prispivaji a ktere jsou redundantni

Hlavni contribution neni reminder system ani konkretni `AGENTS.md`.
Hlavni contribution je:

- `co merit`
- `jak podle toho iterovat`
- `co z instrukci ma v nasi studii skutecny prinos`

## Holistic-first operating procedure

Tohle je jadro toho, jak se v full passu pracuje. Plati pred jakoukoli per-section editaci.

### Princip

Per-section prace zezdola nahoru je **zakazana**, dokud neni hotova holisticka mapa.

Duvod: bez celkove mapy vznikaji tri problemy:
- nevime, jestli sekce vubec patri tam, kde je
- opravujeme draft, ktery strukturalne nemel vzniknout
- bez kontextu se sklouzne k sycophancy "ano, tahle sekce je ok", i kdyz problem je, ze je cela ve spatne kapitole, nebo ze tam vubec nepatri

Spravny postup je **holistic-first**:

1. Nacti vsechno do main contextu (guidance + cele kapitoly + state snapshot)
2. Z principu odvod ideal structure (co tam ma byt podle Craft of Research, FIS doporuceni, ML papers stylu)
3. Porovnej current → ideal: delta map per sekce (keep / fix / move / delete / missing)
4. Validuj delta map s uzivatelem **predtim, nez zacnes psat**
5. Az pak per-section prace v dependency order, s plnou mapou v kontextu

### Phases

| Faze | Co | Vystup | Exit kriterium |
|------|----|--------|----------------|
| 0 | Steering cleanup | Tento handoff + state snapshot + archive | Soubory existuji a jsou aktualni |
| 1 | Holistic load | Vsechny guidance docs + kap01-zaver + state snapshot v main contextu | Schopnost odpovidat na otazky napric kapitolami bez dalsiho cteni |
| 2 | Ideal structure | Per-kapitola: jake sekce, jaky claim type, jaka evidence — odvozene z principu | Strukturni kostra zachycena (in-context nebo v souboru) |
| 3 | Delta map | Per sekce: status (keep / fix / move / delete / missing) + duvod | Tabulka existuje, pokryva vsechny kapitoly |
| 4 | Alignment | Schvalena delta map, scope rozhodnut s uzivatelem | Uzivatel explicitne souhlasi |
| 5 | Master facts pass | Sjednocene cisla, taxonomie, terminologie, claim strength **na sekcich, ktere prezivaji** | Master inconsistencies v snapshot souboru = 0 polozek |
| 6 | Rewrite v dependency order | kap02 → kap03 → kap04 → kap05 → uvod → zaver → abstrakt | Definition of done splnen pro kazdou kapitolu |
| 7 | Final cleanup | Odstranit interni komentare, FIS/formalia pass | Vsechny review znacky pryc, FIS checklist projit |

Aktualni faze: viz state snapshot.

### Validation loop pro kazdy dotceny blok

Pri prepisu nebo editaci jednoho bloku:

1. **Load context** — dotcena kapitola + sousedni kapitoly + relevant guidance
2. **Check ideal** — podle delta mapy: co ma blok rict, jaky claim type, jaka evidence
3. **Check delta** — blok status (raw / draft / final), planovany prechod (keep / fix / move / delete)
4. **Pre-edit checklist** — zodpovedet 6 otazek (viz nize)
5. **Write / rewrite**
6. **Validation gates** — scope / consistency / source / strength / reader (viz nize)
7. **Verify integration** — navazuje cleanly na sousedy? neopakuje to, co je jinde? sedi terminologie?

Pokud ve kteremkoli kroku zjistis, ze blok se lisi od delta mapy nebo ze delta mapa je spatne, **zastav** a aktualizuj delta map driv, nez pokracujes.

### Stop-the-line triggers

Zastav exekuci a vrat se k re-strategizaci, kdyz:

- Faze 2 (ideal structure) odhali, ze 3 cile thesis nedrzi konceptualne → re-anchor cilu, neignorovat
- Faze 3 (delta map) ukaze rozsah, ktery nesedi do zbyvajiciho casu → scope-down s uzivatelem
- Behem rewrite (Faze 6) najdes konceptualni problem, ktery ovlivnuje vice kapitol → zastav, vyres koncept, pak pokracuj
- Uzivatel rozporuje smer → zastav, realign, neprosazuj svuj plan
- Validacni brana selze opakovane (claim je silnejsi nez data, terminologie nesedi, fakt nelze overit) → zastav, oprav root cause, ne maskuj
- Po 2. neuspesnem pokusu (oprava, hledani, build) → zastav, prejmenuj problem, zvol jiny pristup

### Subagent use

Default je **main context**. Dulezite veci (guidance docs, kapitoly, terminologie, fakta o experimentu) musi byt nactene primo v hlavnim kontextu, aby se s nimi pracovalo s plnym pochopenim.

Subagent (Explore) **jen tehdy**, kdyz:
- Tema je vagne nebo explorativni a generuje hodne sumu (dead ends, irrelevantni vysledky, mnoho falesnych stop)
- V main contextu by ten sum poisonil dalsi praci

Duvod je **prevence context poisoning**, ne offload prace.

| Pripad | Kde |
|--------|-----|
| Nacti `kap03.tex` a over, co rika o Q4 | Main — targeted |
| Najdi v thesis vsechny zminky o pilotni faze | Main — targeted grep |
| Over, ze `experiments/runs/pilot-r3` ma 25 AC | Main — fact check |
| Najdi v thesis kde je rozpor v claim strength | Main — chci cist originalni text |
| Najdi 5 papers o LLM-as-judge kalibraci | Subagent — noisy search |
| Co jine case study BP delaji v sekci limitations | Subagent — vague exploratory |
| Existuje zdroj pro tvrzeni X? Nevim, kde zacit | Subagent jen pokud opravdu nemas startovni bod |

**Anti-pattern**: subagent na "summary kapitoly" — pripravi te o originalni text, ktery potrebujes primo videt.

## Steering requirements in force

Tohle nejsou doporuceni, ale pravidla pro full pass:

### Scope and contribution

- Prace je o `metrikach + postupu`, ne o reminder systemu samotnem.
- `AGENTS.md` je vedlejsi produkt, ne hlavni contribution.
- Case study language musi zustat `feasibility` / `indikativni`, ne silna generalizace.
- Pokud text sklouzne k tomu, ze dokazuje obecnou nutnost nejake slozky instrukci, je to chyba.

### Role of chapters

- Kazda kapitola musi delat jen svou roli z chapter contracts.
- `kap02` nesmi absorbovat metodiku ani diskusi.
- `kap03` nesmi interpretovat vysledky.
- `kap04` nesmi delat rozsahlou argumentaci z literatury.
- `kap05` nesmi predelavat vysledky ani znovu popisovat metodiku.

### Paragraph discipline

- Kazdy odstavec musi mit jednu hlavni funkci.
- Pred psanim nebo prepisem bloku se nejdriv urci:
  - role bloku
  - hlavni claim
  - evidence
  - co do bloku nepatri
- Bez teto mini-specifikace se nema prepisovat.

### Results writing discipline

- V `kap04` a datovych castech `kap05` drzet poradi:
  - fakt
  - pozorovani
  - az pak interpretace
- Zadny zaver pred tabulkou nebo pred daty.
- Zadna interpretace jako fakt.
- Jedna veta nema byt preplnena metrikami; pokud je jich moc, presunout detail do tabulky.

### Truthfulness discipline

- Tvrzeni o projektu, modelech, konfiguraci, metrikach a behovych datech overovat ze souboru nebo z experiment data.
- Tvrzeni o literature opirat o realne zdroje a jejich skutecnou vahou:
  - definice
  - synteticky ramec
  - empiricky vysledek
  - prakticke doporuceni
- Kdyz data neumoznuji silne tvrzeni, text musi zeslabit, ne domyslet.

### Draft and raw discipline

- `raw` a `draft` jsou audit trail, ne zdroj pravdy.
- Nic se nepresouva do finalu mechanicky.
- Kdyz je blok stale konceptualne nejasny, zustane draft / raw a nehraje se na hotovo.

### Terminology discipline

- Drzet jeden termin pro jednu vec.
- Pouzivat:
  - `system upominek faktur`
  - `instrukce`
  - `pilotni faze` pro celou fazi
  - `iterace` pro jednotlive cykly
  - `deterministicke` metriky, ne `automatizovane` nebo `binarni`
- Nase P/Q/E kody nejsou obecna teorie; v `kap02` se s nimi zachazi opatrne.

### Source hierarchy

- Priorita pri rozhodovani:
  1. aktualni stav thesis
  2. repo a experiment data
  3. primarni literatura
  4. sekundarni literatura a standardy
  5. starsi brainstorming / historicke poznamky
- Kdyz je konflikt mezi starou poznamkou a aktualni thesis, vyhrava aktualni thesis.

## Chapter contracts

| Kapitola | Role | Co musi rict | Co tam nema delat |
|----------|------|--------------|-------------------|
| `kap01` | Vymezit problem, cile, scope | proc pass/fail nestaci; 3 cile; proc je case study smysluplna | nepopisovat metodiku ani vysledky |
| `kap02` | Postavit teoreticky argument | co je kvalita software; jak se zajistuje a meri; co se meni u AI agentu; proc instrukce a benchmark gap motivuji P/Q/E | nesklouznout do encyklopedie ani do metodiky |
| `kap03` | Prevest teorii do mereni | jak z teorie vznikla sada metrik, design studie, fixni promenne, iterativni cyklus, limity validity | neinterpretovat vysledky ani nenarovat implementacni detaily |
| `kap04` | Ukazat, co se stalo | priprava artefaktu, pilotni faze, ablace, souhrn dat | nedelat rozsahlou diskusi proc to znamena X |
| `kap05` | Rict, co vysledky znamenaji | odpoved na 3 cile, srovnani s literaturou, omezeni v praxi, doporuceni a dalsi vyzkum | netvrdit vic, nez data z jedne case study unesou |
| `uvod` | Otevrit problem a smer | problem, gap, co prace dela, jak je postavena | nebyt jen obecny hype uvod |
| `zaver` | Uzavrit praci | co bylo dosazeno, co je prenositelne, jaka jsou omezeni | neprehanet kauzalitu ani generalizaci |

## Pre-edit checklist for any block

Pred kazdou vetsi editaci musi byt zodpovezeno:

1. V jake kapitole a roli ten blok je?
2. Jakou jednu vec ma ten blok ctenari sdelit?
3. Jaka evidence ji nese?
4. Je to fakt, interpretace, nebo implikace?
5. Co do toho bloku nepatri, i kdyz je to zajimave?
6. Je tvrzeni primerene silne vzhledem k typu studie?

Pokud na nektery bod nejde odpovedet, nema se blok prepisovat naslepo.

## Validation gates for touched text

Kazdy dotceny blok musi pred uzavrenim projit pres tyto brany:

- `scope gate`: patri to opravdu do teto kapitoly?
- `consistency gate`: sedi to s terminologii, cisly a ostatnimi kapitolami?
- `source gate`: ma to odpovidajici oporu v datech nebo literature?
- `strength gate`: neprehanime silu tvrzeni?
- `reader gate`: je jasne, proc ten blok existuje a jak navazuje?

## Global writing rules for the full pass

- Nejdriv sjednotit `pravdu`, az potom psat krasne vety.
- Kazda sekce musi mit explicitni roli, claim a evidenci.
- `kap02` ma budovat most do `kap03`, ne bobtnat do encyklopedie.
- `kap04` se drzi rezimu `Fakt → Pozorovani`; silnejsi interpretace patri do `kap05`.
- `kap05` pouziva case-study language:
  - `ukazuje`
  - `naznacuje`
  - `je konzistentni s hypotezou`
  - ne `dokazuje`, `identifikuje nutne`, `ma primy kauzalni efekt`
- `Q8` a dalsi judge metriky jsou podpurne indikatory, ne hlavni dukazni osa.
- V `kap02` se nemaji volne rozsirovat nase vlastni P/Q/E kody jako obecna teorie.
- Nic z `raw` nebo `draft` se nepresouva do finalu jen proto, ze to uz nejak existuje.

## Definition of done for any touched chapter

Kapitolu povazuj za hotovou jen kdyz plati vsechno:

- nema otevrene `TODO(craft)` nebo `REVIEW-LAYERS` v dotcenem bloku
- nema znama ciselna nebo terminologicka rozporna mista
- je jasne, proc ta kapitola v praci je
- tvrzeni neprekroci to, co data a literatura unesou
- navazuje ciste na predchozi kapitolu a pripravuje dalsi

## What not to do

- Nezacit dalsi session rovnou prepisem `kap05`, dokud neni vycisteny truth layer.
- Nezacinat per-section editaci pred dokoncenim holistic-first phases 1-4 (load → ideal → delta → alignment).
- Nedelat lokalni beautification jedne sekce bez navaznosti na ostatni.
- Nepouzivat stare scope / planning poznamky jako aktualni smer.
- Nevracet do hry stare experimentni plany typu `test cheating`, `Billing Reminder Engine` jako hlavni framing.
- Nepouzivat subagent na summary kapitoly nebo na "ulehceni si prace" — viz Subagent use.
- Neusilovat o per-block dokonalost driv, nez je hotova alignment na delta mape.

## Anti-poison session bootstrap

Nova session ma zacit presne takto:

1. Otevrit tento handoff (procedure + pravidla).
2. Otevrit `handoffs/27-thesis-state-snapshot.md` a overit `Last verified` v hlavicce. Pokud je starsi nez 3 dny, naplanuj re-audit jako prvni krok.
3. Otevrit `thesis/prace.tex` jako chapter map.
4. Otevrit `notes/prirucka-craft-of-research.md`.
5. Otevrit `notes/jak-psat-vedecky.md` a `notes/doporuceni-fis.md`.
6. Otevrit `thesis/TERMINOLOGIE.md` a `thesis/makra.tex`.
7. Otevrit aktualni chapter texty, kterych se session dotkne.
8. Az potom delat plan nebo editaci — postupovat dle holistic-first procedure.

Pred zacatkem editace se musi explicitne ignorovat:

- `TODO.md` jako zdroj smeru
- `HANDOFF.md` v rootu jako zdroj smeru
- `notes/NEXT STEPS.md` jako zdroj smeru
- stare `research-scope` dokumenty
- brainstorming poznamky v archivu
- stare handoffy, pokud nejdou po konkretni audit trail informaci

Kdyz session narazi na starsi dokument se silnym, ale zastaralym framingem, nema ho obnovovat do ziveho planu bez porovnani s timto handoffem.

## First move in the next session

V nove session udelej jen toto:

1. Otevri tento handoff (procedure + pravidla).
2. Otevri state snapshot a over `Last verified`. Pokud >3 dny, re-audit.
3. Potvrd chapter map, Craft-of-Research anchor a Main intent.
4. Zkontroluj, kde jsme v Phases (sekce "Phases" v tomto handoffu, polozka "Aktualni faze" v snapshot souboru).
5. Pokud holistic-first phases 1-4 jeste nebyly udelane: zacni Fazi 1 (holistic load).
6. Pokud uz delta map existuje a je validovana: pokracuj v Phases 5-7 v dependency order.
7. Teprve potom zacni full-pass rewrite.

## Current state pointer

Aktualni snapshot stavu thesis (raw bloky, otevrene TODO, hard blockers, master inconsistencies, aktualni faze) zije v:

→ `handoffs/27-thesis-state-snapshot.md`

**Dulezite**: pred tim, nez z snapshot souboru cokoli vyvodis, zkontroluj `Last verified` v jeho hlavicce. Pokud je starsi nez **3 dny**, znovu zauditovat (nebo aktualizovat behem fazi 1-3) — stale snapshot muze byt horsi nez zadny snapshot.

## Archived steering files

Historicky obsah, ktery uz nema ridit dalsi session:

- `handoffs/archive/TODO-legacy-2026-04-22.md`
- `handoffs/archive/HANDOFF-root-legacy-2026-04-22.md`
- `handoffs/archive/HANDOFF-2026-03-29.md`
- `handoffs/archive/HANDOFF-2026-04-03.md`
- `handoffs/archive/HANDOFF-2026-04-04.md`
- `handoffs/archive/HANDOFF-2026-04-04-b.md`
- `handoffs/archive/CHANGES-MAP-2026-03-04.md`
- `notes/archive/NEXT-STEPS-legacy-2026-04-22.md`
- `notes/archive/BP-notes-root-legacy.md`
- `notes/archive/root-uvod-empty-legacy.tex`
