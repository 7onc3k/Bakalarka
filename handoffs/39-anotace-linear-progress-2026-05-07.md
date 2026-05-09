# Handoff: lineární průchod anotací vedoucího

Datum: 2026-05-07  
Branch: `review/anotace-vedouci-2026-05-07`  
Primární checklist: `konzultace/10-linear-checklist-anotace.md`

## Pracovní pravidlo

Nepracovat jen podle zaškrtávátka. Při vstupu do nové kapitoly nebo sekce
nejdřív načíst aktuální text kapitoly/sekce, až potom hodnotit anotace.
Checklist říká, co vedoucí označil v PDF; aktuální thesis text rozhoduje,
zda je bod ještě otevřený.

Proaktivita v tomto průchodu znamená dohledat kontext, vysvětlit problém
a nabídnout konkrétní řešení. Do textu sahat až po domluvě, pokud nejde
o jednoznačnou technickou opravu.

Když anotace ukáže nevhodný termín, neřešit jen lokální výskyt. Projít
výskyty napříč thesis i semanticky podobné formulace, rozhodnout
konzistentní termín a podle potřeby ho zapsat do `thesis/TERMINOLOGIE.md`.

## Commitnuté

- `a3194a4 fix: address opening annotations`
  - vytvořen `konzultace/10-linear-checklist-anotace.md`
  - vyřešena str. 4: abstract + anglický abstract na vlastní stránce
  - vyřešena str. 11: úvod, 1. osoba, „funkční korektnost“, signpost doporučení
  - doplněn workflow do `AGENTS.md`
- `4de8cd8 fix: address motivation annotations`
  - vyřešena str. 12: motivace, citační formát, „projitých“, středník
  - zpřesněny guardraily pro středníky a dvojtečky v `AGENTS.md`

## Rozpracováno, zatím necommitnuto

Soubory v aktuálním rozpracovaném celku:
- `AGENTS.md`
- `konzultace/10-linear-checklist-anotace.md`
- `thesis/kap01.tex`
- `thesis/kap02.tex`
- `thesis/TERMINOLOGIE.md`

Neplést s ostatním dirty stavem repo: `CLAUDE.md`, PDF/watch výstupy,
experimentální submoduly, `notes/daily/*`, `notes/obhajoba/`, `presentation/`
a `thesis/prace.bbl-SAVE-ERROR` nejsou součástí tohoto celku.

## Hotové v rozpracovaném celku

### str. 13 — Rozsah práce (#63)

- `p13-01` „demonstrovat“: už bylo věcně vyřešené aktuálním cílem 2
  jako „ověřit proveditelnost“.
- `p13-02` „naše“: opraveno na „Tato práce“ a okolí přepsáno
  do neosobního stylu.

### str. 14 — Kvalita software a její měření (#64)

- `p14-01` „vývojáři tuto složitost“: opraveno na „tuto kombinaci
  složitostí“, bez zavádění nových pojmů.
- `p14-02` „náklady“: věta převedena na spotřebované zdroje
  a zbytečnou nákladnost řešení.

### str. 15 — Procesní kvalita (#64)

- `p15-01` „proxy nákladů“: ve shrnující větě nahrazeno za
  „nepřímé ukazatele spotřeby zdrojů“.
- Technické „proxy“ zůstává v sekci `Zdrojová dimenze`, kde se pojem
  skutečně vysvětluje.

### str. 16 — Produktová kvalita / procesní část kap02 (#64)

- `p16-01` „Atomicita“: rozhodnutí po kontrole opory Humble & Farley.
  Nepoužívat českou „atomicitu“ jako hlavní pojem; v textu použít
  „malé commity“ a „malé a časté commity“, protože lépe odpovídají
  Continuous Delivery.
- `thesis/TERMINOLOGIE.md` doplněno:
  - `Zdroje / naklady`
  - `Male a caste commity`

Mimo checklist, ale v kap02 upraveno podle globálního guardrailu:
- dvojtečka po Beller et al. nahrazena tečkou ve větě o field study
  sledující 2 443 vývojářů.

## Důležitá terminologická rozhodnutí

- `zdroje` je název dimenze/kategorie.
- `náklady` používat pro interpretaci ceny nebo spotřeby zdrojů,
  typicky když věta odpovídá na „za jakou cenu“.
- `spotřeba zdrojů` je vhodný most mezi oběma.
- `proxy` je v pořádku jako technický pojem v pasáži, kde se vysvětluje;
  v přehledových větách raději „nepřímé ukazatele“.
- `atomicita` nepoužívat jako český hlavní termín pro commity.
  Pro Humble & Farley / Continuous Delivery používat „malé commity“
  nebo „malé a časté commity“.

## Další krok

Pokračovat položkou:

- `p16-02` (#64) **HL:** maintainer
  - Vedoucí: „zkuste najít lepší slovo“

Aktuální okolí v `thesis/kap02.tex`:

```tex
zatímco vývojář a~maintainer hodnotí čitelnost a~modifikovatelnost
kódu, se kterým budou dál pracovat~\cite{kitchenham1996}.
```

Pravděpodobné řešení k diskusi:
- nahradit `maintainer` českým „správce kódu“ nebo „udržovatel kódu“.
- V akademické češtině je srozumitelnější „vývojář, který kód dále udržuje“.
  Navržená minimální formulace:

```tex
zatímco vývojář, který kód dále udržuje, hodnotí čitelnost
a~modifikovatelnost ...
```

Před editem zkontrolovat výskyty `maintainer` v celé thesis a případně
zapsat termín do `TERMINOLOGIE.md`, pokud se opakuje.

## Před commitem

Před dalším commitem zkontrolovat diff jen těchto scoped souborů:

```bash
git diff -- AGENTS.md konzultace/10-linear-checklist-anotace.md thesis/kap01.tex thesis/kap02.tex thesis/TERMINOLOGIE.md handoffs/39-anotace-linear-progress-2026-05-07.md
```

Pokud bude commit uzavírat tento celek, vhodná message:

```text
fix: address early kap02 annotations

Refs #64
Refs #63
```

