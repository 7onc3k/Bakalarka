# Tasklist — anotace vedoucího (PDF z 2026-04-27)

**Audit trail** s plnými citacemi anotací. Live tracking probíhá v GitHub:

- **Parent issue:** [#51](https://github.com/7onc3k/Bakalarka/issues/51)
- **PR draft:** [#52](https://github.com/7onc3k/Bakalarka/pull/52) (`review/anotace-vedouci-2026-05-07` → `dev`)
- **Sub-issues:** mapping níže; status check-off **manuálně v issue UI**

Tento dokument je referenční snapshot s plnými citacemi anotací. Číslování odpovídá PDF stranám (viz `08-anotace-vedouci.md`).

## Sub-issues mapping

| Group | Issue | Pokrývá |
|---|---|---|
| **Strategie** | | |
| S1 | [#53](https://github.com/7onc3k/Bakalarka/issues/53) | Framing cíle 2 — „demonstrovat" → ? |
| S2 | [#54](https://github.com/7onc3k/Bakalarka/issues/54) | Exit kritéria + operační prahy zdůvodnit |
| S3 | [#55](https://github.com/7onc3k/Bakalarka/issues/55) | Anticipace výsledků v metodice kap03 |
| S4 | [#56](https://github.com/7onc3k/Bakalarka/issues/56) | AGENTS.md figura vs. kód (rozpor) |
| **Cross-cutting** | | |
| C1 | [#57](https://github.com/7onc3k/Bakalarka/issues/57) | Citace formát X et al. (X et al., 2026) |
| C2 | [#58](https://github.com/7onc3k/Bakalarka/issues/58) | 1. osoba → 3. osoba |
| C3 | [#59](https://github.com/7onc3k/Bakalarka/issues/59) | AI dvojtečkové věty |
| C4 | [#60](https://github.com/7onc3k/Bakalarka/issues/60) | Středníky |
| C5 | [#61](https://github.com/7onc3k/Bakalarka/issues/61) | Forward refs v kap03 |
| C6 | [#62](https://github.com/7onc3k/Bakalarka/issues/62) | Terminologie (19 termínů) |
| **Lokální** | | |
| L-Otevreni | [#63](https://github.com/7onc3k/Bakalarka/issues/63) | Abstract + Úvod (po cross-cutting) |
| L-Kap02 | [#64](https://github.com/7onc3k/Bakalarka/issues/64) | Teoretická východiska (po cross-cutting) |
| L-Kap03 | [#65](https://github.com/7onc3k/Bakalarka/issues/65) | Metodika — zbytek (po S2/S3/cross-cutting) |
| L-Kap04 | [#66](https://github.com/7onc3k/Bakalarka/issues/66) | Případová studie — zbytek (po S4) |

**Legenda statusu** (pro audit trail níže — live status v issues):
- `[ ]` = open
- `[x]` = resolved (commit/PR uveden)
- `[~]` = partial
- `[?]` = to discuss
- `[!]` = rozpor

**Workflow:**
1. Lineárně po stranách PDF; cross-cutting C1 (citace) jako úvodní script pass, ostatní cestou
2. Strategická rozhodnutí (S1–S4) blokují příslušné lokální issues — diskutovat dřív než lokální fix
3. Status check-off v issue UI sub-issue checkbox (manuálně, realtime během sezení)
4. Tento MD slouží jako audit trail (citace anotací, kontext); per-položka status žije v issues

---

## Vrstva 0 — Strategická rozhodnutí (vyřešit první!)

Bez těchto je leštění zbytku naprázdno.

- [ ] **S1 — Framing cíle 2 (demonstrovat → ?)** — anotace str. 13, 62
  - Vedoucí: „demonstrace se špatně měří, zkusme upravit nebo vynechat"
  - Dopad: úvod, kap03 sec 3.1.3, kap05 sec cíl 2, obhajoba
  - Návrh formulací: „prozkoumat / ilustrovat / ověřit proveditelnost iterativního postupu"
- [ ] **S2 — Operační prahy a exit kritéria — zdůvodnění a pořadí zavedení** — anotace str. 26, 31, 35
  - Vedoucí: „nikde se nedočetl o exit kritériu", „z čeho vycházíte u operačních prahů?"
  - Pojmy zavádíme bez kontextu, pak se na ně odkazujeme dopředu
  - Akce: vysvětlit hned při zavedení v kap03 sec 3.1.3
- [ ] **S3 — Anticipace výsledků v metodice (kap03)** — anotace str. 35, 36
  - Vedoucí: „pletete výsledek s metodikou. Předpokládáte určitý výsledek."
  - Týká se hlavně sec 3.5 (Konstruktová validita) a sec 3.3.3 (volba ručního postupu)
  - Akce: přepsat tak, aby tam nebyla zpětná projekce výsledků
- [?] **S4 — AGENTS.md: figura vs. kód-blok** — anotace str. 41
  - Vedoucí: „Nedělal bych to jako obrázek, ale jako text = kód"
  - PR #50 si figuru naopak ponechal (commit 1ca6269, a2847da)
  - Rozhodnutí: souhlasit s vedoucím (čitelnější, vyhledatelný text) NEBO obhájit figuru (layout, konzistence)

---

## Vrstva 1 — Cross-cutting průchody (globální opravy)

Tyto se opakují skoro v každé kapitole. Lépe je řešit jedním passem než per-sekce.

- [ ] **C1 — Citace `X et al. (X et al., 2026)` → `X et al. (2026)`** — anotace str. 12, 17, 18
  - Vedoucí to chytá opakovaně, evidentně problém v textu **i bibstylu**
  - Akce: regex přes `*.tex` + případně úprava `bibstyle`
- [ ] **C2 — První osoba (`necháváme`, `naše`, `známe`, `myslíme`) → 3. osoba** — anotace str. 11, 13, 36
  - Vedoucí: „nepište v 1. osobě, ale ve 3. — v abstraktu bylo totéž"
  - Hotspots: abstrakt, úvod, kap03 sec 3.5
- [ ] **C3 — AI dvojtečkové věty (`Text: vysvětlení`, `LLM je pasivní:`)** — anotace str. 19, 20, 24, 27, 31, 32
  - Vedoucí to zmiňuje ~6× a označuje za **„AI structured věty které mě vytáčí"**
  - Akce: stylistický pass kap02 + úvodní odstavce sekcí v kap03
- [ ] **C4 — Středníky → čárky / tečky** — anotace str. 4, 12, 27
  - „nepoužívejte pokud není potřeba", „kdo tak píše?"
  - Hotspots: abstrakt, kap02–03
- [ ] **C5 — Dopředné odkazy (sekce 5.X / kapitola 5 / sekce 4.3.3 v metodice)** — anotace str. 26, 27, 28, 29, 35, 36, 57
  - Vedoucí: „už žádné odkazy prosím", „nechci se teď dívat na kapitolu 5"
  - PR #50 odstranil agregáty „X z 10", ale dopředné odkazy zůstávají
  - Akce: per-kapitola pass — odstranit nebo nahradit obecnou frází
- [ ] **C6 — Sjednotit terminologii dle anotací**
  - [ ] `popisnost` → `popis` (str. 29)
  - [ ] `oracle` → český výraz (str. 22)
  - [ ] `wall-clock` → česky (str. 19)
  - [ ] `cost models` → česky (str. 19)
  - [ ] `mutanty` → ověřit česky / nahradit (str. 17)
  - [ ] `code smells` → vysvětlit nebo nahradit (str. 20)
  - [ ] `atomicita` → ověřit termín (str. 16)
  - [ ] `maintainer` → česky (str. 16)
  - [ ] `proxy nákladů` → jiný pojem (str. 15)
  - [ ] `rubrika` → ověřit (str. 31)
  - [ ] `behavioral trace` → vysvětlit (str. 28)
  - [ ] `funkční korektnost` → vysvětlit (str. 11)
  - [ ] `hrozby validity` → přeformulovat („validita nikomu nehrozí") (str. 36)
  - [ ] `chybu` → `chybovost` (str. 19)
  - [ ] `mírou` → `míru` (str. 22)
  - [ ] `agentova issue` → `issue vytvořené agentem` (str. 28)
  - [ ] `ze` → `z` (str. 42)
  - [ ] `projitých` → `prošlých` nebo opsat (str. 12)
  - [ ] `naše` → `tato` (str. 13)

---

## Vrstva 2 — Per-kapitola

### Abstract (str. 4) — 7 anotací

- [ ] A1 — Začátek na vlastní stránce
- [ ] A2 — Cíl byl „demonstrovat"? (souvisí s S1)
- [ ] A3 — „ne monotónně" — nesrozumitelné, opsat
- [ ] A4 — „redundantní;" — pryč středník
- [ ] A5 — „Ty věty jsou spíše výstřely než celé rozvité věty" — přepsat abstrakt souvislejším stylem
- [ ] A6 — „konkrétní naměřené hodnoty jsou vázány..." vedoucí zlobí jako AI výstřel
- [ ] A7 — „(vyřešil agent úkol?)" — kontext nejasný

### Úvod (str. 11) — 5 anotací

- [ ] U1 — `funkční korektnost` vysvětlit (C6)
- [ ] U2 — „kvůli nedostatkům v procesu nebo udržovatelnosti" — alespoň trochu rozvést
- [ ] U3 — `proces` → upřesnit, jaký proces (proces práce?)
- [ ] U4 — `necháváme` → 3. osoba (C2)
- [ ] U5 — „mělo by také navrhnout zlepšení" — doplnit do scope

### Motivace + Cíle + Rozsah (str. 12–13) — 8 anotací

- [ ] M1 — `projitých` → `prošlých` (C6)
- [ ] M2 — Citace formát (3×) (C1)
- [ ] M3 — Středník v textu (C4)
- [ ] M4 — `demonstrovat` jako cíl 2 (S1)
- [ ] M5 — `naše` → `tato` (C6)

### Kap02 — Teoretická východiska (str. 14–22) — 22 anotací

- [ ] T1 — sec 2.1: „vývojáři tuto složitost — kterou z nich?"
- [ ] T2 — sec 2.1: „náklady" — promluvit o zdrojích (PR #49 už E-bucket → „zdroje", částečně)
- [ ] T3 — sec 2.1.1: `proxy nákladů` — jiný pojem (C6)
- [ ] T4 — sec 2.1.2: `Atomicita`, `maintainer`, `mutanty` (C6)
- [ ] T5 — sec 2.1.2: ISO/IEC není autor — ověřit citační styl (C1 partial)
- [ ] T6 — sec 2.1.3: Beller et al. citace (C1)
- [ ] T7 — sec 2.1.3: „procesního úhlu... navázání na issue" — zvláštně formulováno
- [ ] T8 — sec 2.2.1: `Cost models`, `wall-clock`, `chybu→chybovost` (C6)
- [ ] T9 — sec 2.2.1 začátek odstavce („Předchozí sekce..."): **AI prose vzor** (C3) — vedoucí: „takto píše pouze AI, přepište"
- [ ] T10 — sec 2.2.1: `sekce` vs `kapitola` — terminologická konzistence
- [ ] T11 — sec 2.2.1: „Tento posun zároveň přináší... omezené kontextové okno, absence implicitní znalosti..." — **AI structured věty** (C3) („vytáčí mě")
- [ ] T12 — sec 2.2.2: `code smells` (C6)
- [ ] T13 — sec 2.2.2: u SWE-agent skloňování / přidat slovo
- [ ] T14 — sec 2.2.2: „Tato práce se zaměřuje na fáze..." — opakuje co bylo výš
- [ ] T15 — sec 2.2.4: `mírou`→`míru`, `oracle` česky (C6)
- [ ] T16 — sec 2.2.5 (str. 24): „Konkrétnost instrukce... shodně ukazují, ale přílišný detail..." — AI struktura (C3)
- [ ] T17 — sec 2.2.5: „ač hlavní páka chování" — divná vsuvka

### Kap03 — Metodika (str. 25–36) — **48 anotací, největší hustota**

#### Sec 3.1 — Výzkumný přístup (str. 25–26)

- [ ] K3-1 — sec 3.1 intro: pozorovat střídání `kapitoly`/`sekce` v textu — terminologická chyba
- [ ] K3-2 — sec 3.1 intro: „Sekce 3.1 zdůvodňuje... Sekce 3.2 definuje..." — **odkazovací odstavec smazat** (str. 25)
- [ ] K3-3 — sec 3.1.2: „Bez pilotu by ablace neměla z čeho vycházet" — divná, asi zbytečná
- [ ] K3-4 — sec 3.1.3: „proti exit kritériím" — **vysvětlit co jsou exit kritéria** (S2)
- [ ] K3-5 — sec 3.1.3: „operační prahy (Q2 ≥ 37/42, Q3 ≥ 70%...)" — **Q kódy zaváděné dopředu** (C5, S2)
- [ ] K3-6 — sec 3.1.3: „barevné kódování souhrnné tabulky a vizualizací v kapitole 5" — **forward ref** (C5)
- [ ] K3-7 — sec 3.1.3: „kapitola 5, počty X z 10" — již **VYŘEŠENO** PR #50 (commit ca0e971)
  - [x] resolved-by: ca0e971
- [ ] K3-8 — sec 3.1.3: „další iterace by přinášely jen drobné lokální úpravy" — zaručeno jak?
- [ ] K3-9 — sec 3.1.3: „Tato definice odpovídá proveditelnosti..." — přeformulovat
- [ ] K3-10 — sec 3.1.3: „...redundantní?" — věta s dvojtečkou (C3) („vidíte co říkám?")
- [ ] K3-11 — sec 3.1.3: středník `předem;` (C4)
- [ ] K3-12 — sec 3.1.3: „I se dvěma běhy nelze dosáhnout..." — **vedoucí říká „strašně důležitá věta i pro obhajobu"** — zachovat, případně zvýraznit
- [ ] K3-13 — sec 3.1.3: `ověřit cíl 2` → `splnit cíl 2` (cíle se plní, hypotézy se ověřují) — **systematicky projít celou práci**
- [ ] K3-14 — sec 3.1.3: „Iterativní cyklus..." dlouhý odstavec — zjednodušit

#### Sec 3.2 — Sada metrik (str. 27–30)

- [ ] K3-15 — „Z fungující sady... potřebuje agent danou část, nebo je redundantní?" — věta s dvojtečkou (C3)
- [ ] K3-16 — sec 3.2 intro: „Teoretické základy popisuje sekce 2.1" — **redundance** (C5) („čtenář už četl, uberte odkazy")
- [ ] K3-17 — `agentova issue` → `issue vytvořené agentem` (C6)
- [ ] K3-18 — `Behavioral trace` — vysvětlit (C6)
- [ ] K3-19 — sec procesní metriky: „na souborech v tests/; nově přidané..." — nezačínat pokynem
- [ ] K3-20 — sec 3.2.2 produkt: `Popisnost` → `popis`? (C6)
- [ ] K3-21 — sec 3.2.2: „bezpečnost, výkonnost, kompatibilita..." — proč nelze měřit, vysvětlit
- [ ] K3-22 — sec 3.2.2: `detekují agentovy testy` → `zda detekují...`
- [ ] K3-23 — sec 3.2.2: „typy sedí, nebo ne." — bez čárky?
- [ ] K3-24 — sec 3.2.2 Q1: „Shoda s API kontraktem" — to je jediné měřítko? (vysvětlit)
- [ ] K3-25 — sec 3.2.2: `Vitest` překlep
- [ ] K3-26 — sec 3.2.2: „Testy ověřují přes veřejné API (black-box, sekce 2.1.2). Konstrukci popisuje sekce 4.1.1." — **forward ref + back ref** (C5)
- [ ] K3-27 — sec 3.2.2: „Poznámka: Q1 je vstupní podmínkou pro Q2..." → **footnote**
- [ ] K3-28 — sec 3.2.3 efektivita: „Stryker" — v této kapitole o něm nemluvíte (přidat / odstranit)
- [ ] K3-29 — sec 3.2.3: „procento zabitých mutantů" — sem se hodí AJ + příklad
- [ ] K3-30 — sec 3.2.3: `Cyklomatická` ověřit
- [ ] K3-31 — sec 3.2.3: „Práh 10 per funkci pro Q7 vychází z McCabe (sekce 2.1.2)" — **redundance** („to víme")
- [ ] K3-32 — sec 3.2.3: „Poznámka:" → footnote, ale **MIN je důležitá** — vytáhnout do hlavního textu

#### Sec 3.3 — Operační detail (str. 31–34)

- [ ] K3-33 — sec 3.3.1: `exit kritérium` se objevuje bez vysvětlení (S2)
- [ ] K3-34 — sec 3.3.1: „Se dvěma běhy... deskriptivní, ne inferenční" — rozepsat
- [ ] K3-35 — sec 3.3.1: **MiniMax-M2.5 zaveden poprvé až tady** — „mělo by se objevovat téměř od začátku práce"
- [ ] K3-36 — sec 3.3.1: „Důvod: model" — nepište takto
- [ ] K3-37 — sec 3.3.2: „Hodnocení probíhá na škále 1–3..." — **AI formát** (C3)
- [ ] K3-38 — sec 3.3.2: `Rubrika` ověřit (C6)
- [ ] K3-39 — sec 3.3.2: „Interpretace výsledků. LLM-as-judge..." — **mělo by být zavedeno na začátku, ne tady** — strategicky důležité
- [ ] K3-40 — sec 3.3 intro: „Tato sekce navazuje operačním detailem: jaké proměnné držíme fixní (sekce 3.3.1)..." — **AI formát** (C3)
- [ ] K3-41 — sec 3.3.3: zmínit obecnou strukturu projektu před výčtem souborů
- [ ] K3-42 — sec 3.3.3: kurzíva u otázky „Kdyby tento řádek chyběl..." — proč kurzívou?
- [ ] K3-43 — sec 3.3.3: „Hranice mezi typy příčin... Roli AI asistence popisuje sekce 3.5" — **redundantní popis + forward ref** (C5)
- [ ] K3-44 — sec 3.3.3: zdroje na „přestrukturování instrukcí má přednost" — v metodice už zbytečné

#### Sec 3.4 + 3.5 (str. 35–36)

- [ ] K3-45 — sec 3.5 intro: **„pletete výsledek s metodikou"** (S3) — Schnabel/Neville/PromptWizard pasáž — přepsat
- [ ] K3-46 — `Tabulka 3.10` — číslování s prefixem kapitoly: **vedoucí komentuje, ale to je FIS šablona** — odpovědět (Vrstva 4)
- [ ] K3-47 — `operační prahy` jako termín — odkud (S2)
- [ ] K3-48 — sec 3.4: „Způsob sběru odpovídá rozlišení... v kapitole 2" — back ref redundance (C5)
- [ ] K3-49 — `hrozby validity` — formulačně (C6)
- [ ] K3-50 — `známe` → 3. osoba (C2)
- [ ] K3-51 — „Jak se hrozby projevily v sekci 5.3" — forward ref (C5)
- [ ] K3-52 — „(měříme to, co chceme měřit?)" — patří dovnitř textu
- [ ] K3-53 — Konstruktová validita: zdroje opakované (C5)
- [ ] K3-54 — Konstruktová validita: „popisujete metriky" — redundance s sec 3.2
- [ ] K3-55 — „U metriky Q4 byly historicky uložené judge běhy..." — **stálo by za výrazně větší komentář**
- [ ] K3-56 — Konstruktová validita: **„mluvíte o výsledcích, které ještě nejsou známé"** (S3)
- [ ] K3-57 — „(jsou závěry podložené daty?)" — patří dovnitř (jako K3-52)
- [ ] K3-58 — Externí validita: rozepsat svými slovy „na základě toho a toho můžeme říct, že..."

### Kap04 — Případová studie (str. 37–42, 57) — 17 anotací

- [x] K4-1 — Specifikace (str. 37) „Lze se podívat?" — přesunuto do kap03 sec 3.1.2
  - resolved-by: a8d19d8 (PR #50)
- [x] K4-2 — sec 4.1.1 „API Contract popsáno dříve" — přesunuto do kap03
  - resolved-by: a8d19d8 (PR #50)
- [x] K4-3 — Specifikace „spíše metodika" — přesunuto do kap03
  - resolved-by: a8d19d8 (PR #50)
- [x] K4-4 — sec 4.1.2 „Toto mapování zakládá metodologickou otázku" — odstraněno
  - resolved-by: 226b794 (PR #50)
- [x] K4-5 — sec 4.1.2 „Specifikace, ref. impl. a baseline tvoří výchozí bod" — meta-bridge odstraněn
  - resolved-by: e6aa8c9 (PR #50)
- [x] K4-6 — sec 4.2 r1: „cyklus Spuštění/Měření..." duplikace — sweep 2/3 redukoval
  - resolved-by: 50067d3, e701736 (PR #50)
  - **CHECK:** anotace stále kritizuje — potvrdit že současný text už nemá problém
- [!] K4-7 — sec 4.1.2 „AGENTS.md jako obrázek" — **PR #50 si figuru ponechal** (S4)
- [ ] K4-8 — sec 4.1.2: „mapování tří dimenzí na konkrétní instrukce" — vizuál + konkrétnost
- [ ] K4-9 — sec 4.1.2: „Sekce... má 53 řádků, ~350 slov" — „šlo by ukázat celé"
- [ ] K4-10 — sec 4.2 r1 dlouhý odstavec o cyklu — AI obecné popisy místo konkrétního, co se dělalo
- [ ] K4-11 — sec 4.2 r1: `Ze` → `z`
- [ ] K4-12 — sec 5.1 cíl 1 (str. 57): zdroje na **P/E metriky** doplnit (vedoucí: „máte zdroje jen na Q")
- [ ] K4-13 — sec 5.1 cíl 1 (str. 57): „již žádné odkazy" — odstranit (sekce 5.1, sekce 5.2, sekce 5.3, sekce 3.5) (C5)

### Kap05 (str. 62) — 1 anotace

- [ ] K5-1 — Cíl 2 „demonstrace": **vedoucí: „nejsem si jistý že proběhla, špatně se měří. Cíl upravit nebo vynechat"** (S1) — strategický bod

---

## Verify pass — review hotových (2026-05-07)

Items označené `[x]` byly ověřeny proti aktuálnímu stavu `thesis/kap03.tex` a `thesis/kap04.tex`. Výsledek:

- **K4-1, K4-2, K4-3** — Specifikace přesunutá do kap03 sec 3.1.2 (`thesis/kap03.tex` ř. 84–247): FSM diagram, API kontrakt, doménová logika, 25 AC, out of scope, referenční testy. **Verified ✅**
  - **POZN:** ~130 řádků nového obsahu, který **vedoucí v anotacích neviděl** (PR #50 mergnut po jeho buildu). Při průchodu ve Vrstvě 2 dát zvýšenou pozornost (Given/When/Then v angličtině je v textu, AI prose vzorce, terminologie).
- **K4-4** — „Toto mapování zakládá metodologickou otázku" pasáž odstraněna. **Verified ✅**
- **K4-5** — Meta-bridge „Specifikace, ref. impl. a baseline tvoří výchozí bod" odstraněn. **Verified ✅**
- **K4-6** — Duplicita „Každá iterace sleduje cyklus..." na začátku pilotních iterací odstraněna. **Verified ✅**
- **K3-7** — Agregát „X z 10 deterministických" odstraněn napříč prací. **Verified ✅**

**Verify nálezy (negativní — items, které mají v tasklist `[ ]`):**
- **K3-5** (Q kódy zaváděné dopředně v sec 3.1.3) — stále v `thesis/kap03.tex` ř. 268–270 (operační prahy `Q2 ≥ 37/42, Q3 ≥ 70%, Q4 ≥ 24/25, Q5 ≤ 1, Q7 ≤ 1`). Anotace vedoucího potvrzená, **OPEN**.
- **K3-6** (forward ref „vizualizací v kapitole 5") — stále v `thesis/kap03.tex` ř. 272 a 274 (`\ref{kap:vyhodnoceni}`, `\ref{kap:vysledky}`). **OPEN**.

---

## Vrstva 3 — Vyřešeno před vedoucího PDF (informativní pro obhajobu)

Tyto PR byly mergnuté po datu PDF (27.4.) — vedoucí o nich neví. Lze připomenout na příští konzultaci, že část jeho výtek už byla adresována.

### PR #49 — Draft thesis terminology cleanup (mergnuto 2026-05-05)

- E-bucket renamed `efektivita` → `zdroje` (Fenton fidelity) — částečně řeší str. 14 anotace „hodilo by se promluvit o zdrojích"
- Q-bucket renamed na `kvalita produktu`
- Drop Typ column, det/judge-based naming sjednoceno
- Workflow / pracovní postup / checkpoint / kontrolní bod / verifikační krok — sjednoceno
- Branch count discrepancy fix v pilot-r1 diagnostics
- Cross-chapter consistency audit (handoff 35)

### PR #50 — Kap04 cleanup pass (mergnuto 2026-05-07)

- ✅ Specifikace (FSM, API, AC) přesunuta z kap04 do kap03 sec 3.1.2
- ✅ Závěr pilotních iterací (duplikoval kap05 sec 5.1.2) odstraněn
- ✅ Závěr ablací (duplikoval kap05 sec 5.1.3) odstraněn
- ✅ Meta-bridges (Z1, Z2, Z4) odstraněny
- ✅ Tautology defense (P metriky vs instrukce) přepsána na auditovatelné artefakty
- ✅ Findings tabulky (Pozorované chování / Metriky / Příčina) napříč r1–r5
- ✅ E1 ablace data restore z opencode.db
- ✅ Sweep 1: strategic acronym expansion
- ✅ Sweep 2: IMRaD refactor r3/r4/r5 (evidence-first)
- ✅ Sweep 3: redundance „přechod k ablacím"
- ✅ Agregáty „X z 10 deterministických" odstraněny
- ✅ E3 reframe na deskriptivní indikátor
- ✅ Terminologie napříč kap03–05 sjednocena

---

## Vrstva 4 — Body k odpovědi vedoucímu (ne přepis textu)

Pravděpodobně FIS šablona / nelze měnit / koncepční rozdíl.

- [?] Vrstva-4-1 — `Tabulka 3.10` číslování s prefixem kapitoly — **FIS šablona to vyžaduje**, sdělit vedoucímu
- [?] Vrstva-4-2 — Citace formát: stojí za to ověřit jestli `apa` styl v dpcite/biblatex skutečně produkuje duplikát, nebo jestli to jde nastavit
- [?] Vrstva-4-3 — AGENTS.md figura — pokud se rozhodneme nesouhlasit (S4), připravit argument

---

## Postupový workflow

Viz „Sub-issues mapping" nahoře. Pořadí práce:

1. **Strategie (S1–S4)** — diskuse + rozhodnutí (blokují lokální issues)
2. **C1 (citace)** — úvodní script pass přes celou bibliografii a `*.tex`
3. **Lineárně po stranách PDF** — Abstract → Úvod → Kap02 → Kap03 → Kap04 → Kap05
   - Ostatní cross-cutting (C2–C6) řešíme cestou per stránka
   - Lokální issues (L-*) se uzavírají postupně, jak procházíme stránky

Cílem je projít vše do následující konzultace s tím, že strategická rozhodnutí budou domluvená s vedoucím, cross-cutting passy budou jako evidence systematické práce, a lokální fixy budou postupně commitovány na branch `review/anotace-vedouci-2026-05-07`.
