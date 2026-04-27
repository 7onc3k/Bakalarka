# Handoff — Kap04 4.1.1 merge + vertikální FSM diagram (2026-04-27)

## Stav

**Sekce 4.1.1 + 4.1.2 sloučená do "Systém upomínek faktur".** Doménová sekce kap04 obsahuje plnohodnotný popis testovacího prostředí: vertikální stavový diagram s guards/effects, API kontrakt, AC ukázku, out-of-scope, referenční implementaci jako strop.

Build čistý: 92 stran, 0 errors, 0 warnings.

## Co tato session udělala

### 1. Sloučení 4.1.1 + 4.1.2 → "Systém upomínek faktur"

Drop "Konstrukce" v 4.1.1, přejmenováno na artefakt-orientovaný název. Bývalé 4.1.2 (Referenční implementace) absorbováno jako poslední `\paragraph{Referenční implementace jako strop měření}`.

Zachovány oba labely přes `\phantomsection`:
- `sec:konstrukce-specifikace` (forward-ref z kap03 ř. 82)
- `sec:ref-implementace-postup` (forward-ref z kap03 ř. 320)

Smazány 3 raw audit trail bloky.

### 2. Stavový diagram — iterace tvaru

Diagram prošel třemi verzemi v této session:

**v1 (snake horizontální):**
- Top row LR + bottom row RL + connector
- Side states pod GRACE — kolize s bottom row v stejné y-zóně
- 2 explicitní "barr" šipky `over→paid`, `rem2→canc` jako reprezentanti
- ❌ Vizuální chaos, side states uprostřed bottom row

**v2 (snake bez kolize):**
- Top row LR + bottom row RL + connector
- Side states v třetí oddělené řadě pod susp
- ❌ Snake U-turn nutí čtenáře číst pravolevě
- ❌ Lineární progrese ve dvou směrech

**v3 (vertikální, finální):**
- Hlavní eskalace shora dolů (9 stavů, 8 přechodů)
- Side panel vpravo (PAID/CANCELLED/PAUSED) s vstupními šipkami `payment/cancel/paused`
- Resumed nota pod PAUSED s dashed šipkou: `status := pausedFrom; stateEnteredAt := now − pausedElapsed`
- ✓ Lineární čtení top-to-bottom, jeden směr šipek
- ✓ Boční stavy oddělené, ne ve flow

### 3. Diagram = Mealy notace s guards a effects

Šipky hlavní eskalace nesou:
- guard: `[elapsed ≥ N bd]` (resp. `[now ≥ due − 7 bd]`, `[now ≥ due]`)
- effect: `/ email`, případně `/ email + suspend_service` (multi-action SUSPENDED přechod)

Tj. odpovídá to UML statechart konvenci `event [guard] / effect`. Event `tick` je implicitní (zmíněno v captionu spolu s `manual_advance`, který v diagramu není zakreslen).

### 4. Caption slim, detail v textu

Caption zkrácen na 2-řádkový identifikátor: "hlavní eskalace shora dolů (vlevo) a tři boční stavy (vpravo). Notaci a zdrojové stavy popisuje text výše." Detaily přesunuty do **Doménová logika** paragraphu:

- Notační klíč `[guard] / effect` + vysvětlení `bd` = business days
- Source-states pro side panel ("z 9 stavů" pro PAID/CANCELLED, "ze 6 aktivních" pro PAUSED)
- Event `tick` při splnění guardu + `manual_advance` bezpodmínečný bypass

Tj. všech 6 eventů z kontraktu pokryto: 4 v diagramu (payment, cancel, paused, resumed) + 2 v Doménová logika prose (tick, manual_advance). `pausedElapsed` semantika je v Implicitní pravidla paragraphu.

Konvence: caption = identifikátor figury, body text = interpretace (sjednocuje s `fig:iterativni-cyklus` v kap03, který má taky 1-větný caption).

### 5. Nový paragraph "Implicitní pravidla domény"

Past doménová formulace, ne agentův spoiler. Vysvětluje:
1. Proč musí `pausedElapsed` být v kontraktu (trik s posunem `stateEnteredAt` selhává při opakované pauze)
2. Pracovní dny vs. kalendářní (off-by-one zóna na hranici pátek/pondělí)

Forward-ref do `sec:pilot-r3` a `sec:pilot-r4` (kde se to v datech projevilo).

### 6. API kontrakt zkrácen

Trim z `pausedElapsed` deep-dive na shape contract: 12 stavů, 6 eventů, 3 typy akcí, tvar `DunningState`. Past `pausedElapsed` se přesunula do nové sekce "Implicitní pravidla".

### 7. Drobné fixy build errors

- `kap04.tex` `(rem1.south) |- node[...] (rem2.east)` → `(rem1) -- node[right]{...} (rem2)` — neplatná `|-` syntax v TikZ
- `kap05.tex` `\\[-2pt]` → `\\` (3×) — pgf neparsuje optional argument na `\\` v node label
- `kap05.tex` `[yshift=-4.2cm]rule.south west` → `($(rule.south west)+(0,-4.2cm)$)` — calc syntax místo shortcut
- `kap04.tex` `[xshift=-1.4cm]paid.west` → `($(paid.west)+(-1.4cm,0)$)` — same pattern

Fix příčiny: pgf v této verzi neparsuje shortcut `[xshift=…]coord` syntax; vždycky použít explicitní `$(coord)+(dx,dy)$` calc syntax.

### 8. Terminologie cleanup v 4.1.1

- `spec` → `specifikace` (2 výskyty: ř. 148, 553)
- `pure FSM` → `samotného automatu` (anglicismus + redundance, "stavový automat" je výš v textu)
- `spec-first TDD` ponecháno (etablovaný metodologický termín, Mathews 2024)
- Doslovný anglický citát z agentova transcriptu ponechán (ř. 707)

## Klíčová decisions této session

### Vertikální FSM místo snake nebo decision table

User explicitně preferoval vertikální flow ("podsebou") před snake (U-turn). Diskutovány alternativy:
- **Decision table** (state × event → next/action) — denser, systematický, ale "technický manuál" tón
- **Sequence diagram** pause/resume — informativní pro `pausedElapsed`, ale jen jeden scénář
- **UML statechart s composite state** — sémanticky správné pro "z any active state", ale komplikované

Závěr: vertikální FSM s guards/effects + side panel = nejvhodnější pro 4.1.1 (anatomie domény). Past `pausedElapsed` ošetřena prózou.

### TikZ ne mermaid

User navrhl mermaid (existuje v issue #38 pro měřicí infrastrukturu). Důvody pro TikZ:
- Konzistence s ostatními thesis diagramy (`fig:iterativni-cyklus` v kap03, `fig:operacionalizace` v kap05)
- Žádný externí build dependency (mermaid-cli vyžaduje Node + headless Chrome)
- Vektor + Latin Modern font matching
- Nativní `\ref{}`/label

Mermaid pro stavový automat upomínek **v repu nikde neexistuje** (issue #38 je pro pipeline `new-run.ts`/`analyze-run.ts`, ne pro doménu). Diagram je první vizualizace tohoto typu pro tuto doménu.

### "Konstrukce" v 4.1.3 NEDROP

Handoff 32 doporučoval drop "Konstrukce" jako mechanický rename. Po přečtení obsahu sekce ale: 4.1.3 reálně popisuje proces vzniku baseline (3 kroky: ad-hoc removal → Mao FSE struktura → mapování dimenzí). Drop by zastřel primární argument sekce. **Ponechat "Konstrukce baseline instrukcí"**.

Asymetrie 4.1.1 (artefakt) vs 4.1.3 (proces) je věrnou reflexí rozdílného obsahu, není pravidlo paralelních názvů.

### Implicitní past formulace, ne spoiler

User řekl: "diagram vypadá triviálně, kde modelka selhává?". Past patří **do 4.1.1 jako vlastnost domény**, ne do kap04 jako pozorování. Důvod: kontrakt vyžaduje `pausedElapsed` field — to je vlastnost spec, ne agentovo pochybení. Že na tom agent v r3-r5 selhal je pozorování (kap04). Formulace v 4.1.1 zachovává kap03/kap04 split: "spec klade pravidlo X" vs "agent v r3 zvolil trik".

## Otevřené body (mimo 4.1.1)

### V kap04 ke cleanupu

- `\begin{raw}` audit trail bloky napříč 4.2/4.3 (~9 výskytů)
- `% TODO(acro):` na ř. 960 (`\acs{P5}` fix)
- `^\S` footnote na ř. 859 bez source-marker v tabulce
- `fig:baseline-agents` ověřit existenci PNG (`img/generated/app03-baseline-single.png`)
- Konzistence terminologie po renamu "Komparativní variace" → "Ablace" (kontrola)
- 4.2.x stylistické: r1–r5 monotónnost (5 iterací identický template), zvážit úvod k pilotu

### V kap05

- 3 zaver TODOs (prinos, scope, meta) — přesunuto z kap03 v handoff 32
- `fig:operacionalizace` má teď fixy `\\[-2pt]` → `\\` a `[yshift]` → calc, ale obsahově nezměněn
- Spektrum operacionalizace: definice + citace literatury (declarative/imperative + self-verification literature)

### V kap02

- `TODO(kap02-hodnoceni)` — Yin et al. 2025 (arXiv:2511.00872)

## Plán dalších kroků

1. **4.1.3 cleanup** — raw bloky, TODO acro, ref check (`app:agents-md` neexistuje, smazaný app02)
2. **4.2 / 4.3 cleanup** — raw bloky, drobnosti
3. **Stylistický pass r1-r5** — úvod k pilotu, zvážit zkrácení r4/r5 detailů
4. **Tabulky deltas — barvy?** — konzistence se souhrnnou heatmapou (rozhodnout)
5. **Kap05** — 3 zaver TODOs, spektrum operacionalizace
6. **Kap02** — Yin 2025

## Pravidla zachované z handoff 32

- Em-dash nepoužívat
- Doménové termíny česky ("specifikace", ne "spec"; "ablace", ne "komparativní variace")
- TikZ shortcut `[xshift=…]coord` **NEPOUŽÍVAT**, vždy `$(coord)+(dx,dy)$` calc syntax
- TikZ `\\[-Npt]` v node label **NEPOUŽÍVAT**, použít `\\` (pgf nepustí optional arg)
- Před editem subsekce ověřit forward-refs

## Snapshot

- Datum: 2026-04-27
- Lokace: `thesis/` (Overleaf-připojené, build via `make watch`)
- Repo HEAD: `efff6dc` (handoff 32 push), pracovní změny necommitnuté
- PDF: 92 stran (z 93 — figura kap04 je nyní vyšší o cca 1 stránku, nebo se text přerovnal)

## Co NEDĚLAT

- Nepoužívat TikZ shortcut syntax `[xshift=…]coord` — pgf v této verzi to neparsuje, fatal error `Missing number, treated as zero`
- Nepoužívat `\\[-Npt]` v TikZ node label — stejný problém
- Nepřidávat do `fig:dunning-fsm` 24 dalších šipek pro source states side panelu — caption to říká
- Nepřejmenovávat 4.1.3 na "Baseline instrukce" — sekce popisuje proces, drop "Konstrukce" by zastřel argument
- Nepoužívat mermaid pro thesis diagramy — TikZ je standard, mermaid by zavedl externí build dependency
- Nepřidávat plný stavový automat za přechod (24 šipek `→PAID` apod.) — caption nese "z 9 stavů"
