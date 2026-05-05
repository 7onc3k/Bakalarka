# Handoff — Konzistenční audit thesis (2026-05-05)

Stav: dev branch, thesis builduje. Cleanup pass, Overleaf-připojeno.

Tento handoff drží nálezy z auditu konzistence napříč všemi kapitolami.
Audit pokrýval tři osy: terminologie, argumentace/fakta, jazykové
zkomoleniny (ČJ + AJ míchání mimo zavedené odborné termíny).

Diskuse s uživatelem probíhá per-položku v pořadí závažnosti.

## Stav řešení (2026-05-05 progress)

- ✅ **A1** — vyřešeno (commit `6badcfa`): rozpor 5→4 větve v pilot-r1
- ✅ **A2** — vyřešeno (commit `dca928e`): kvalita kódu → kvalita produktu
- ✅ **A3** — vyřešeno (commit `db774a4` + `951b938`): efektivita → zdroje;
  argumentace posunu Fenton (lidské úsilí) → agent (tokeny + čas + kontext)
- ✅ **bonus: Drop Typ sloupec + sjednocení det/judge** (čeká commit):
  - `\mmet{zaz}` smazáno (mrtvý kód, nikdo nepoužíval)
  - `\mmet{qual}` přejmenováno: "kvalitativní metriky" → "judge-based metriky"
  - `tab:metriky-prehled` zbavena Typ sloupce (5 sloupců → 4)
  - "automatizované metriky" → "deterministické metriky" (sjednocení)
  - "kvalitativní metriky" → "judge-based metriky" (sjednocení)
  - Tím vyřešena i terminologická tenze: "deterministické metriky"
    teď ve všech kontextech znamená sběr automatizovaný, ne přítomnost
    exit kritéria

- ⏳ **A4** — vyřešeno bonusem výše (forward ref kap03 → kap02 zmizela
  s drop Typ sloupce; trichotomie det/qual/zaz neexistuje, není co
  mostit)
- ⏳ **A5** — neřešeno (diagnostické rámce kap03 vs aplikace kap04)
- ⏳ **T1** — neřešeno ("Závěr pilotních iterací" → "pilotní fáze")
- ⏳ **T2** — neřešeno (multi-label hygiena, debt)
- ⏳ **Z1–Z9** — neřešeno (jazykové zkomoleniny)
- ⏳ **D1–D5** — neřešeno (diskutabilní)

## Pořadí řešení

Nejdřív vážné argumentační/faktické (A1–A5), pak terminologické
nesoulady (T1–T3), pak jazykové zkomoleniny (Z1–Z9). Diskutabilní
úroveň (D1–D5) až nakonec.

---

## A — Argumentační / faktické

### A1. Vnitřní rozpor v počtu větví u pilot-r1

**Místo:** `thesis/kap04.tex` cca řádek 344–348 (sekce `sec:pilot-r1`).

```
Agent vytvořil 11 issues hromadně … rozložil implementaci do 4 větví,
každá s vlastním pull requestem. Větve agregovaly související issues,
takže P2 selhala v poměru 5 větví na 11 issues.
```

První věta říká **4 větve**, druhá **5 větví**. Buď oprava na "5 větví"
v první větě, nebo vysvětlit (4 feature větve + main, ale main se do
P2 podle definice v kap03 nepočítá).

### A2. „Kvalita kódu" jako label pro celou Q skupinu

**Místa:** abstrakt CZ (`prace.tex:75`), úvod (`uvod.tex:24`), kap01 cíl 1
(`kap01.tex:60`), zaver (`zaver.tex:13`).

V kap03 je Q rozděleno na funkční korektnost (Q1–Q2), kvalitu testů
(Q3–Q4) a kvalitu kódu (Q5–Q8 v užším smyslu). Ale v abstraktu, úvodu,
cíli 1 i závěru se celá osa Q nazývá "kvalita kódu". Tím se cíl 1
v kap01 a v kap03 pojmově nekryjí.

**Doporučení:** sjednotit na "kvalitu produktu" / "kvalitu výstupu"
(souznívá s kap03 i Fentonem) a "kvalitu kódu" nechat jen pro Q5–Q8.

### A3. Třetí dimenze nese tři jména napříč kapitolami

| Kapitola | Termín |
|---|---|
| Abstrakt, úvod, kap01, zaver | „efektivita" |
| kap02 (sec:zdrojova-dimenze) | „zdrojová dimenze" (Fenton) |
| kap03 (sec:metriky-efektivity) | „efektivita (E1–E3)" |

Most v kap02 (sec:zdrojova-dimenze závěr) existuje implicitně, ale
explicitně neřekne „zdrojovou dimenzi v naší sadě nazýváme efektivitou".

**Doporučení:** přidat jednu spojovací větu na konec
`sec:zdrojova-dimenze` v kap02:

> „V tomto kontextu nazýváme tuto dimenzi efektivita; podrobnou
>  operacionalizaci uvádí kapitola 3."

### A4. Forward ref kap03 → kap02 na rozlišení det/qual/zaz

**Místo:** kap03 sec:prehledova-tabulka (cca řádek 749–750):

> „Způsob sběru odpovídá rozlišení \mmet{det}, \mmet{qual} a \mmet{zaz}
>  zavedenému v kapitole \ref{kap:teorie}."

Kap02 ale tuto trichotomii s těmito jmény explicitně nezavádí —
mluví o deterministických nástrojích, peer review a LLM-as-judge,
ale neřadí je do tří pojmenovaných tříd. Trichotomie vzniká až
v kap03 přes makro `\mmet`.

**Doporučení:** buď doplnit trichotomii do kap02 (1 odstavec na konci
sekce 2.1.2), nebo v kap03 změnit ref („uplatňované v této kapitole
vychází z deterministických nástrojů popsaných v kap02 a metody
LLM-as-judge zavedené v sec:llm-as-judge").

### A5. Diagnostické rámce kap03 vs aplikace kap04

Kap03 zavádí 5 rámců (Mao, Hassan, Razavi+Breunig, Lulla, filter
Skillsbench) a `tab:diagnostika-mapa` mapuje typ příčiny → rámec →
typ opravy. Kap04 v r1→r2, r2→r3, r3→r4, r4→r5 diagnostikuje, ale
rámce explicitně neodkazuje. Slabší tah cíle 2.

**Doporučení:** buď přidat krátkou anotaci u 1–2 iterací
(„Diagnóza opřená o Razavi+Breunig: pravidlo se přesouvá do
verifikačního kroku"), nebo v kap03 změkčit nárok rámců na
„heuristický mentální checklist, ne formální klasifikátor".

---

## T — Terminologie

### T1. „Závěr pilotních iterací" v kap04

**Místo:** `kap04.tex:650` paragraph header.

TERMINOLOGIE.md explicitně: „pilotní iterace pro fázi → NEPOUŽÍVAT,
použít pilotní fáze."

**Patch:** `\textbf{Závěr pilotní fáze.}`

### T2. Multi-label hygiena v kap02

Sekce v kap02 mají 2–5 labelů (zachovává historické forward refs):

- `sec:procesni-kvalita` + `sec:praktiky-kvality` + `sec:faze-zivotniho-cyklu`
- `sec:produktova-kvalita` + 4 další
- `sec:hodnoceni-ai-agentu` + 4 další
- `sec:scaffolding` + 3 další

Funkčně OK, ale debt. Případně dohledat unused labely a smazat.
**Není kritické pro odevzdání.**

### T3. Vynucení / aktivace

Per handoff 34 vyřešeno: TERMINOLOGIE.md má sekci pojmů, kap05 je
jasně rámuje jako vlastní rozlišení. **Žádná akce nepotřebná.**

---

## Z — Jazykové zkomoleniny (ČJ + AJ míchání)

Vyloučeno: zavedené odborné termíny per TERMINOLOGIE.md
(commit, branch, issue, pull request, harness, AGENTS.md, LLM-as-judge,
session, transcript, atd.).

### Z1. „mergoval kód" — slovesný anglicismus

**Místo:** `kap04.tex:558`

> „agent mergoval kód, přestože pre-PR checklist zahrnoval `npx vitest run`"

**Patch:** „agent kód začlenil" / „agent merge provedl" /
„agent kód zařadil do main".

### Z2. „commitl kód" — nečitelné slovesné komolení

**Místo:** `kap04.tex:798`

> „Bez verifikačních kroků agent commitl kód s nefunkčními testy."

„commitl" je chybný tvar (commit + l). Buď „commitnul"
(zaužívanější, ale stále anglicismus), nebo přepsat:
„agent vytvořil commit s nefunkčními testy" / „agent uložil
commit s nefunkčními testy".

### Z3. „Out of scope" / „out of scope" — anglický nadpis a fráze

**Místa:**
- `kap04.tex:166` paragraph header `\paragraph{Out of scope.}`
- `kap04.tex:169` „Sekce out of scope omezuje riziko..."
- `kap03.tex:539` „doménový slovník a out of scope"

V kontextu specifikace je „Out of scope" název sekce v Issue#1
(která je v EN). Ale v české próze je nekonzistentní.

**Doporučení:**
- Nadpis odstavce přeložit na „Mimo rozsah" nebo „Vyloučení".
- Když odkazujeme na anglickou sekci spec, dát kurzívou:
  `\textit{out of scope}` při prvním výskytu, pak česky.

### Z4. „přinesla použitelný insight"

**Místo:** `kap05.tex:201`

> „pouze E1 přinesla použitelný insight"

**Patch:** „přinesla užitečné zjištění" / „přinesla užitečnou
informaci".

### Z5. „pre-PR self-check"

**Místo:** `kap05.tex:770`

> „například jako pre-PR self-check (`spusť tsc --noEmit`...)"

**Patch:** buď celé kurzívou jako citace návrhu, nebo přeložit:
„automatickou kontrolu před otevřením PR" / „pre-PR ověření".

### Z6. „context files" / „inference cost" / „quality gates" — bez kurzívy

**Místa:**
- `kap03.tex:447` „context files zvyšují inference cost o..."
- `kap03.tex:525` „Na rozdíl od generických context files"
- `kap03.tex:716` „redundantní obsah zvyšuje inference cost"
- `kap03.tex:522` „pracovní postup, omezení a quality gates"

Anglické termíny použité jako česká substantiva bez kurzívy.

**Doporučení:**
- „context files" → „kontextové soubory" (nebo `\textit{context files}`
  při prvním výskytu).
- „inference cost" → „náklady na inferenci".
- „quality gates" → buď přeložit „kontrolní body kvality", nebo
  kurzíva. Pozn.: „quality gates" je technický termín z CI/CD.

### Z7. „audit log" / „Behavioral trace" / „reasoning kroků"

**Místa:**
- `kap02.tex:354` „audit log běhu agenta"
- `kap03.tex:256` „Behavioral trace `tddOrderViolations`"
- `kap02.tex:450, 451` „reasoning kroků" / „trasu reasoning kroků"

**Doporučení:**
- „audit log" → „auditní záznam" / „auditovatelný záznam".
- „Behavioral trace" → „behaviorální stopa" (nebo kurzíva).
- „reasoning kroků" → „kroků uvažování" nebo `\textit{reasoning}`
  kroků.

### Z8. „jasnost scope" — anglické substantivum

**Místo:** `kap03.tex:289` v rubrice P7

> „1--3 (jasnost scope, přítomnost acceptance criteria...)"

**Patch:** „jasnost rozsahu" / „jasnost vymezení".

### Z9. „chain-of-thought prompting" — bez kurzívy

**Místo:** `kap05.tex:728`

> „existuje v prompt engineeringu: chain-of-thought prompting ukazuje..."

**Patch:** `\textit{chain-of-thought prompting}` jednou, pak normálně.
Pozn.: termín je v `wei2022cot` v kap02; v kap02 se mluví o „nápovědě
think step by step" — most na chain-of-thought v kap05 by měl být
explicitnější.

---

## D — Diskutabilní (estetické, ne nutné)

### D1. „debugování"

**Místa:** `kap04.tex:818`, `kap05.tex:176`, `kap05.tex:385`

Anglicismus s českou koncovkou. Standardně rozšířený v IT komunitě.
Čistší: „ladění" / „cyklické ladění".

### D2. „baseline" jako české substantivum

Hojně použito v kap03, kap04, kap05 bez kurzívy. V ML/SE komunitě
zaužívané. Čistší: „výchozí stav" / „výchozí bod" / `\textit{baseline}`.

Pokud zůstane, doporučuji kurzívu při prvním výskytu v kap04 a pak
ponechat jako rozšířený termín.

### D3. „fixní" → „pevný"

Místa: kap03 (fixní proměnné, fixní rubrika, fixní napříč běhy),
kap05 (fixní sada metrik). „Pevný" je čistší český ekvivalent,
ale „fixní" je čitelné a srozumitelné.

### D4. „tool calls" konzistence kurzívy

V kap02 první výskyt s kurzívou (sec:zakladni-pojmy), v kap02
další výskyty bez kurzívy (OK), v kap03 (řádky 592, 620) bez
kurzívy. Standardní praxe: kurzíva při definici, normální
později. Současný stav OK.

### D5. „diffem" / „vizuální diff"

Technický termín, zaužívaný. OK ponechat. Případně kurzíva
při prvním výskytu.

---

## Co teď nedělat

- Needitovat hromadně. Postupovat per-položku po diskusi s uživatelem.
- Nedotýkat se vyřešených oblastí (vynucení/aktivace, demonstrace
  proveditelnosti, analytická generalizace).
- Nepřesouvat audit trail bloky (raw/draft) — to je samostatná fáze
  cleanup pass.

## Stav konverzace v okamžiku vzniku handoffu

Uživatel dostal souhrnný report a kvalifikoval pořadí: nejvážnější
nejdřív. Diskuse per-položku zatím neproběhla, žádná editace.
