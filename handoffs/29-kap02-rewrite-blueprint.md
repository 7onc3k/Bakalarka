# Kap02 Rewrite Blueprint

**Status:** AKTIVNÍ — primární driver současné fáze (per-section rewrite kap02 dimension-centric).
**Datum:** 2026-04-26 (revize 2). Last verified 2026-04-25.
**Související steering:**
- Trvalá pravidla full passu: memory `thesis_full_pass_rules.md` (chapter contracts, phases, validation gates)
- Předchůdce: `handoffs/archive/28-kap02-1-dimension-restructure.md` (provedeno commitem `49f062c`)
- Operating procedure (archivovaná): `handoffs/archive/27-thesis-full-pass-anchor.md`

**Cíl dokumentu:** Sepsat principy, terminologii a per-subsekcní kostry, podle kterých proběhne systematický rewrite celé kap02. Žádný rewrite nezačne, dokud tento dokument neprojde validací s uživatelem.

**Revize 2:** Přidána Sekce 2 (Holistický pohled a rozhodnutí). Per-subsekcní blueprint byl upraven podle 6 rozhodnutí.

---

## 1. Argumentační oblouk celé kap02

Čtenář přichází z kap01 s problémem („pass/fail nestačí; chybí přenositelný postup, jak instrukce navrhovat") a odchází do kap03, kde se zavádí sada metrik P/Q/E a iterativní postup návrhu instrukcí.

Kap02 musí čtenáři dodat (chapter contract z handoff 27):

> *„co je kvalita software; jak se zajistuje a meri; co se meni u AI agentu; proc instrukce a benchmark gap motivuji P/Q/E"*

Linearní oblouk:

```
Kvalita software je multi-dim (F&B + Brooks + DORA/SPACE = precedent multi-dim)
        ↓
Tradiční SE má pro každou dimenzi etablované měřicí praktiky
        ↓
AI agenti přebírají dimenze, ale s posunem (delta)
        ↓
Existující hodnocení agentů má gap (pass/fail neměří 3 dim)  ← motivuje rámec metrik (kap03)
        ↓
Instrukce jsou hlavní operacionalizovatelná IV
        ↓
Empirie smíšená, mechanismy nejasné, otevřená otázka     ← motivuje iterativní postup (kap03) + ablace (kap04)
```

Žádné odbočky, žádné druhé větve. Každá sekce vrací jeden krok oblouku.

---

## 2. Holistický pohled a rozhodnutí

### 2.1 Block-by-block analýza současného obsahu

Procházím obsah ne podle current struktury, ale jako jednotky sdělení („co tento blok řekne čtenáři a kde nejlépe sedí v argumentu?").

| Blok obsahu | Současně | Říká | Verdikt |
|---|---|---|---|
| F&B 3-entity | 2.1 preamble | Definice taxonomie | ✅ |
| Brooks složitost | 2.1 preamble | Meta: proč obtížné | ✅ (přesunuto sem) |
| ISO 25010 | 2.1.1 opener | Definice produktové dim | ✅ |
| **McCall 1977** | 2.1.1 opener | Historický předchůdce | ❌ **vyhodit** |
| Funkční vhodnost vs udržovatelnost | 2.1.1 opener | Selekce 2 z 8 char | ✅ |
| Mutation testing (Papadakis) | 2.1.1 Testování | Operacionalizace fn vhodnosti | ✅ |
| McCabe + linting | 2.1.1 Stat. analýza | Operacionalizace udrž. | ✅ |
| Meze det. hodnocení | 2.1.1 závěr | Limit + bridge na 2.2.3 | ✅ |
| F&B process attrs | 2.1.2 opener | Definice procesní dim | ✅ |
| VCS / CI / traceability | 2.1.2 | Praktika | ✅ |
| TDD | 2.1.2 | Praktika | ✅ |
| Code review | 2.1.2 | Praktika | ✅ |
| **Diagnostika (Ko & Myers)** | 2.1.2 | Praktika | ❌ **odstranit** — slabý link na P |
| Beller declared vs observed | 2.1.2 závěr | Meta-claim: pozorovat artefakty | ✅ |
| F&B resource attrs | 2.1.3 opener | Definice zdrojové dim | ✅ |
| COCOMO, story points | 2.1.3 | Tradiční proxy | ✅ |
| **DORA, SPACE** | 2.1.3 | Multi-dim productivity rámec | ⚠️ **reframe na cross-dim synthesis** |
| LLM / agent / coding agent | 2.2.1 | Definice | ✅ |
| Jin 2024 survey | 2.2.2 opener | Landscape 6 SE oblastí | ✅ |
| Produktová delta (Li) | 2.2.2 | Změny v produktové dim | ✅ |
| Procesní delta (Watanabe/Ehsani) | 2.2.2 | Změny v procesní dim | ✅ |
| Zdrojová delta (tokens) | 2.2.2 | Změny ve zdrojové dim | ✅ |
| CMMI mention + bridge | 2.2.2 closing | Most na 2.2.3 | ✅ |
| SWE-bench, HumanEval | 2.2.3 | Pass/fail standard | ✅ |
| **METR/Li/Ehsani gap** | 2.2.3 | Empirie gap | ⚠️ **trim — kap01 už nese motivaci** |
| Newer benchmarks | 2.2.3 | Extend ale ne 3 dim | ✅ |
| LLM-as-judge | 2.2.3 | Metoda + biasy | ✅ |
| Test oracle problem | 2.2.3 | Limit agent-gen tests | ✅ |
| Tacit knowledge / SASE | 2.2.4 opener | Motivace scaffoldingu | ✅ |
| Mao 7 komponent | 2.2.4 | Inventář | ✅ |
| Lulla / Gloaguen / SkillsBench | 2.2.4 | Smíšená empirie | ✅ |
| Specifičnost (Kim, Zi) | 2.2.4 | Empirie | ✅ |
| Citlivost (Breunig, Razavi) | 2.2.4 | Empirie | ✅ |
| Mechanismy (Wei, Min) | 2.2.4 | Vynucení vs aktivace | ✅ |
| Otevřená otázka | 2.2.4 closing | Bridge na kap03/04 | ✅ |

### 2.2 Identifikované problémy a rozhodnutí

**Problém 1: DORA/SPACE jsou v 2.1.3 misframed**

DORA má 4 metriky napříč procesem i produktem (lead time = process, fail rate = product, recovery = process). SPACE je explicitně cross-cutting. Ne primárně zdrojové.

**Rozhodnutí:** Reframe v rámci 2.1.3 — DORA/SPACE zůstávají fyzicky, ale framing se přepíše na **cross-dimensional synthesis a precedent multi-dim měření**, který slouží jako bridge do 2.2. Pořadí v 2.1.3: F&B resource attrs → COCOMO/story points → "ale samotné proxy nestačí" → DORA/SPACE jako multi-dim precedent → bridge na 2.2.

**Problém 2: Diagnostika (Ko & Myers) v 2.1.2 nemá silný link**

Není mapovaná na žádný P metrik. Kap03 používá Mao/Hassan/Lulla/Breunig jako diagnostické rámce, ne Ko & Myers.

**Rozhodnutí:** **Odstranit z 2.1.2 prose.** Bib entry `komyers2008debugging` zůstává v `literatura.bib` (nepoužitý ale dostupný). 2.1.2 inventář praktik bude tedy: VCS / TDD / Code review / Beller — 3 praktiky + 1 meta-claim.

**Problém 3: METR/Li/Ehsani duplikace mezi kap01 a kap02.3**

kap01:19-31 už uvádí všechny 3 studie jako gap evidence. kap02.3 to plně opakuje.

**Rozhodnutí:** kap01 zůstává plný motivační detail (3 studie jako gap evidence). kap02.3 jen krátká zpětná reference („tři empirické studie zmíněné v kap01 dokládají, že…") + plný detail na metody, které kap01 nepokrývá: newer benchmarks, LLM-as-judge, test oracle problem.

**Problém 4: Chapter intro nemá thesis statement**

Aktuálně jen roadmap.

**Rozhodnutí:** Přepsat chapter intro na **thesis statement** (1–2 věty co kap02 argumentuje) + krátký roadmap.

**Problém 5: Chapter nemá closing**

Po 2.2.4 closing skok do kap03.

**Rozhodnutí:** Přidat **chapter closing** ~5 řádků: shrne co kap02 ustanovila + bridge na kap03 metody.

**Problém 6: McCall 1977 v 2.1.1 — slabý zdroj**

Jen historická zmínka, kap03 nepoužívá.

**Rozhodnutí:** **Vyhodit.** ISO 25010 stojí samo o sobě.

---

## 3. Cross-cutting principy

### 3.1 Hard rules (CLAUDE.md)

- **0 em-dashů** (`---`) — používat tečky, čárky, závorky nebo přeformulovat
- **0 středníků** (`;`) v hlavním textu — tečka nebo čárka
- **0 cyrilice** v textu — kontrolovat U+0430 vs U+0061
- **Žádné methodology jazyk:** ne „v naší studii", ne „vybíráme", ne „operacionalizujeme my"
- **Žádné P/Q/E kódy** v textu kap02
- **Žádné silné claims:** ne „dokazuje", ne „identifikuje nutné", ne „prokazuje obecně"
- **Žádný popis případové studie** ani konkrétních metrik

### 3.2 Konzistentní terminologie (`thesis/TERMINOLOGIE.md`)

| Pojem | Použít | Nepoužívat |
|---|---|---|
| Obsah souboru | instrukce | instrukční sada, prompt, scaffolding |
| Soubor | `\texttt{AGENTS.md}` | "instrukční soubor" jako synonymum |
| Workflow | pracovní postup | workflow (anglicismus) |
| Verifikace | verifikační krok | checkpoint, kontrolní krok |
| Měření | deterministické metriky | automatizované, binární |
| Judge metrika | judge-based metrika | kvalitativní (vágní) |
| Záznam | záznamová metrika | pomocná, sběrná |
| Projekt | systém upomínek faktur | dunning system |
| Faze | pilotní fáze | pilotní iterace pro fázi |
| Cyklus | iterace | run, kolo |

**První výskyt termínu v kapitole:** termín česky, případně `\textit{anglicky}` v závorce.

**Hierarchie agentů:** *Velký jazykový model* (LLM) → *LLM-based agent* → *autonomní coding agent*.

### 3.3 Citační hierarchie

| Typ | Příklad |
|---|---|
| Standard / definice | ISO 25010, SWEBOK, Fenton & Bieman |
| Syntetický rámec | DORA, SPACE, SASE |
| Empirický výsledek | Beller 2019, METR 2026, Li 2026 |
| Praktické doporučení | McConnell, Humble |
| Seminal | Brooks 1987 |

Pravidla:
- Tvrzení o oboru: peer-reviewed primární zdroj
- Tvrzení o praxi: empirická studie nebo industrial standard
- Definice: standard nebo seminal paper
- Vágní intuice bez citace = odstraněno

**Forward refs:**
- Použít POUZE pro konkrétní downstream usage
- Maximálně 1 forward ref do kap03 za subsekci
- Prefer: bridge na NÁSLEDUJÍCÍ subsekci, ne na vzdálený kap03

### 3.4 Best practices struktury textu

**Topic sentence + TEEL:**

```
Topic sentence    → Co odstavec říká (claim)
Evidence          → Citace, čísla, příklad
Elaborace         → Rozvinutí (nuance, mechanismus)
Link              → Propojení s kap02 argumentem
```

**Microvzory podle typu sdělení:**

| Typ sekce | Pattern |
|---|---|
| Teoretický přehled | Téma → Porovnání přístupů → Syntéza |
| Definice + operacionalizace | Definice → Empirická opora → Limitace |
| Inventář praktik | Téma → Praktika → Empirický fakt |
| Bridge sekce | Co bylo → Co se mění → Proč další sekce |
| Gap analysis | Stav → Empirie ukazující omezení → Co chybí |

### 3.5 Strukturální discipline

- Každý odstavec má JEDNU funkci.
- Před editací: role / claim / evidence / co tam nepatří.
- Validation gates: scope / consistency / source / strength / reader.

**Délka odstavce:** 4–8 vět. Velký → rozdělit, krátký → sloučit nebo doplnit.

**Pořadí odstavců:** od konceptu k operacionalizaci, od obecného ke konkrétnímu.

### 3.6 LaTeX formátování

- `\paragraph{Téma.}` pro rozčlenění subsekce
- `\textit{}` pro první výskyt cizího termínu
- `\texttt{}` pro soubory, kód
- `\cite{key}` přímo u tvrzení
- `\ref{}` jen na existující labely
- Bibliografie a `\begin{raw}...\end{raw}` audit trail bloky se NEMĚNÍ

### 3.7 Bridge architektura

Každá subsekce končí 1–2 větami:
- Shrnou klíčový závěr.
- Mostí na následující subsekci (NIKDY na kap03 dokud to není opravdu motivace pro kap03 — typicky jen 2.2.3 a 2.2.4).

Každá subsekce začíná 1–2 větami:
- Ukotví v předchozím obsahu.
- Ohlásí, co tato subsekce přidá.

---

## 4. Per-blok blueprint

### 4.1 Chapter intro (NEW — thesis statement)

**Role:** Otevřít kap02 thesis statement + krátký roadmap.

**Main claim (kapitoly):** Kvalitu software lze rigorózně vymezit a měřit přes tři dimenze (produkt, proces, zdroje); AI coding agenti tyto dimenze přebírají s posunem v proxy a stopách, ale současné hodnocení agentů pokrývá jen funkční korektnost a instrukce v kontextovém okně jsou hlavní páka pro řízení jejich chování, jejíž systematický návrh zatím není ustanoven.

**Informační tok (1 odstavec):**

1. Thesis statement (1–2 věty): co kap02 argumentuje.
2. Roadmap (2–3 věty): první sekce → tradiční SE; druhá sekce → agenti, hodnocení, instrukce.

**Délka:** ~10 řádků.

---

### 4.2 Section 2.1 preamble

**Role:** Postavit obecný teoretický rámec — kvalita má 3 dimenze, jejich dosažení je obtížné — a přejít na 3 podsekce.

**Main claim:** Kvalita software se neredukuje na jedinou vlastnost. Fenton a Bieman ji dělí na produkt, proces a zdroje, a její dosažení je obtížné kvůli inherentní složitosti software.

**Informační tok (5 odstavců):**

1. **SWE intro + úkol kvality.** SWE jako disciplína; zajištění kvality jako úkol; otázka co se kvalitou rozumí určuje, jaké metriky lze pro agenta navrhnout.
2. **F&B 3-entity taxonomie.** Produkt / proces / zdroje (itemize 3 entit s definicemi).
3. **Kombinovat dimenze.** Každá nese jiný typ evidence; ucelený obraz vzniká kombinací.
4. **Brooks složitost.** Esenciální / akcidentální složitost; výstupy agenta stojí na obojím; akcidentální část bývá zdrojem rozdílu mezi povrchně funkčním a udržitelným řešením.
5. **Roadmap + asymetrie literatury.** Tři subsekce; produktová má zralý standard, procesní rodinu praktik, zdrojová proxy.

**Klíčové citace:** swebok2024, sommerville2016, fenton2014, brooks1987.

**Bridge in:** kap01 končí „pass/fail nestačí". Preamble odpovídá: vymezme kvalitu.

**Bridge out:** Roadmap → 2.1.1.

**Délka:** ~30 řádků.

---

### 4.3 Section 2.1.1 — Produktová kvalita

**Role:** Vymezit produktovou stránku (ISO 25010), zúžit na funkční vhodnost a udržovatelnost, představit jejich operacionalizaci a limity.

**Main claim:** Produktová kvalita je rozložena do osmi charakteristik ISO 25010; pro coding agenta jsou stěžejní funkční vhodnost a udržovatelnost, které vyžadují odlišné typy evidence (testování za běhu vs. čtení kódu).

**Informační tok:**

1. **Opener (2 odstavce, ne 3 jako dnes — McCall odpadá).**
   - SWEBOK definice + multi-stakeholder + proč jeden ukazatel nestačí + ISO 25010 + 8 charakteristik + zaostření na funkční vhodnost a udržovatelnost.
   - Definice obou + odlišný typ evidence + Miguel et al. jako přehled.
2. **¶ Testování.** Funkční vhodnost se ověřuje testováním. Tři úrovně (unit / integrační / akceptační). Coverage jako první vrstva, mutation testing jako druhá. Papadakis pro mutation.
3. **¶ Statická analýza a konvence kódu.** Udržovatelnost se hodnotí čtením kódu. McCabe cyklomatická + práh 10. Linting + typová kontrola. Limity (čitelnost, dekompozice).
4. **¶ Meze deterministického hodnocení.** Vhodnost dekompozice, sémantická srozumitelnost — přesahují deterministické nástroje. Bridge na 2.2.3 LLM-as-judge.

**Změny oproti současnosti:** Vyhodit zmínku McCall 1977 z opener (je to slabý zdroj, neslouží argumentu). 3 odstavce opener → 2.

**Co tam patří:**
- ISO 25010 jako rámec
- Miguel et al. jako přehled
- Mutation testing teorie (Papadakis)
- McCabe cyklomatická + práh
- Linting a typová kontrola
- Limity → expertní hodnocení

**Co tam nepatří:**
- McCall 1977 (vyhodit)
- Brooks (přesunut do 2.1 preamble)
- Naše Q1–Q8 metriky
- Konkrétní nástroje case study

**Klíčové citace:** swebok2024, sommerville2016, iso25010, miguel2014, papadakis2019, mccabe1976, mcconnell2004.

**Bridge in:** Z 2.1 preamble: „produktová stránka má zralý standard". 2.1.1 ukazuje který.

**Bridge out:** Meze det. hodnocení → expertní (LLM-as-judge v 2.2.3).

**Délka:** ~70 řádků (opener ~25 + 3 paragrafy ~12 + 1 paragraf ~7 každý).

---

### 4.4 Section 2.1.2 — Procesní kvalita

**Role:** Vymezit procesní stránku, představit etablované praktiky a empirický fakt, že deklarace ≠ pozorovaná praxe.

**Main claim:** Procesní kvalita se neprojevuje na hotovém produktu, ale v jeho vzniku; rodina etablovaných praktik (VCS, TDD, code review) tvoří páteř pozorovatelné procesní kvality, ale jejich existence v repertoáru ≠ jejich dodržování.

**Informační tok:**

1. **Opener (2 odstavce).**
   - F&B process attrs (effort, duration, conformance, output stability).
   - Význam praktik: dodržování zvyšuje auditovatelnost a spolehlivost.
2. **¶ Správa verzí, integrace a traceability.** Branching, granulární commity, CI, traceability (Shihab, Humble, Gotel).
3. **¶ Test-driven development.** Test-after vs TDD. Beck 2000, Rafique 2013.
4. **¶ Code review.** Bacchelli 2013, Sadowski 2018, McIntosh 2016.
5. **¶ Deklarace vs pozorovaná praxe.** Beller 2019. Princip: hodnotit z pozorovatelných artefaktů.

**Změny oproti současnosti:** **Odstranit `\paragraph{Diagnostika chyb.}` z 2.1.2 prose.** Bib entry zůstává, ale v textu se nepoužívá.

**Co tam patří:**
- F&B procesní atributy
- 3 klíčové praktiky (VCS, TDD, review) s definicí + empirií
- Beller jako uzavírající empirický fakt motivující pozorovatelnost

**Co tam nepatří:**
- Diagnostika (Ko & Myers) — odstraněno
- CMMI/ISO 33020 maturity rámce
- Naše procesní metriky

**Klíčové citace:** fenton2014, sommerville2016, shihab2012, humble2010, gotel1994, beck2000, rafique2013, bacchelli2013, sadowski2018codereview, mcintosh2016, beller2019testing.

**Bridge in:** Z preamble: „procesní stránka stojí na rodině etablovaných praktik".

**Bridge out:** Princip pozorovatelnosti (Beller) motivuje pozorovatelný přístup k procesním metrikám (1 stručná zmínka, ne forward ref).

**Délka:** ~115 řádků (opener ~15 + 4 paragrafy ~22 každý). Po odstranění Diagnostika klesá z ~140.

---

### 4.5 Section 2.1.3 — Zdrojová dimenze + cross-dim synthesis

**Role:** Vymezit zdrojovou stránku (tradiční proxies), pak udělat cross-dim synthesis (DORA, SPACE) jako precedent multi-dim měření a most do 2.2.

**Main claim:** Zdrojová stránka se zachycuje přes proxy nákladů a času, ale tyto proxy samy o sobě nestačí; etablované rámce DORA a SPACE explicitně argumentují pro multi-dimenzionální pohled napříč procesem, produktem a zdroji, čímž poskytují precedent pro rámce, které následující sekce aplikuje na AI coding agenty.

**Informační tok:**

1. **Opener.** Fenton resource attrs (čas, úsilí, nástroje); asymetrie literatury.
2. **¶ Tradiční proxy a odhady pracnosti.** COCOMO, story points, cycle/lead time.
3. **¶ Multi-dimenzionální pohled jako etablovaný princip.**
   - Otevírací věta: "Samotné proxy ovšem nevypovídají o efektivitě vývoje."
   - DORA (4 metriky napříč rychlostí a stabilitou nasazení).
   - SPACE (5 os, explicitně varuje před redukcí na jedinou metriku).
   - Synthesis: "Tento princip multi-dim měření spojuje produkt, proces i zdroje a tvoří precedent pro rámce hodnocení, k nimž se vrací sekce 2.2."

**Změny oproti současnosti:** DORA/SPACE odstavec se reframuje — jeho role není "zdrojová", ale **cross-dim synthesis**. Otevírací věta odstavce explicitně ohlásí přechod od zdrojových proxies k multi-dim principu. Závěr dělá most do 2.2.

**Co tam patří:**
- F&B resource attrs
- COCOMO, story points, cycle/lead time
- DORA jako 4-metric framework
- SPACE jako 5-axis framework
- Synthesis: multi-dim je etablované, transcends single dimension

**Co tam nepatří:**
- Tokeny (do 2.2.2)
- Naše E1–E3

**Klíčové citace:** fenton2014, boehm1981cocomo, forsgren2018, forsgren2021space.

**Bridge in:** Z preamble: „zdrojová dimenze se zachycuje přes proxy".

**Bridge out:** Multi-dim princip se přenáší do hodnocení agentů → 2.2.

**Délka:** ~55 řádků (opener ~10 + tradiční proxy ~15 + multi-dim synthesis ~25 + most na 2.2 ~5).

---

### 4.6 Section 2.2 preamble

**Role:** Most z obecného SE (2.1) na specifika agentů. Stručný bridge.

**Main claim:** AI coding agenti mění výkonný subjekt vývoje a tím i proxy a stopy v každé dimenzi, ale samotné dimenze zůstávají platné.

**Informační tok (1 odstavec):**

1. Bridge ze 2.1: „Předchozí sekce ukázala kvalitu v tradičním vývoji včetně principu multi-dim měření. AI coding agenti tento kontext mění..."

**Změny oproti současnosti:** Zkrátit — chapter intro už má roadmap, takže 2.2 preamble nemusí ho duplikovat. Stačí bridge věta.

**Délka:** ~5 řádků.

---

### 4.7 Section 2.2.1 — Základní pojmy a typy

**Role:** Definovat hierarchii LLM → LLM-based agent → autonomous coding agent.

**Main claim:** Autonomní coding agent je systém založený na LLM rozšířený o tool use a Thought–Action–Observation cyklus, který provádí celý vývojový proces.

**Informační tok (3 odstavce):**

1. **LLM.** Vaswani Transformer, predikce tokenu, generuje text včetně kódu, sám pasivní.
2. **LLM-based agent.** Liu komponenty, Yao ReAct cyklus, Schick tool use.
3. **Autonomní coding agent.** Guo paradigmata, příklady (Claude Code, OpenHands). Rozdíl od asistenčních (Copilot).

**Klíčové citace:** vaswani2017, liu2024llmagents, yao2022react, schick2023toolformer, guo2025benchmarks.

**Bridge in:** Z 2.2 preamble.

**Bridge out:** Schopnosti určují, co agent dělá → 2.2.2.

**Délka:** ~25 řádků.

---

### 4.8 Section 2.2.2 — Jak agenti mění softwarové inženýrství

**Role:** Most mezi obecným SE a specifikou agentů. Ukázat, že 3 dimenze platí dál, ale s posunem.

**Main claim:** AI agenti posouvají SE ve všech třech dimenzích (jiné code patterns, jiné PR style, jiné cost proxies) a etablované rámce dnes single-run hodnocení nepokrývají.

**Informační tok:**

1. **Opener.** Jin 2024 survey — agenti pronikají do 6 oblastí SE; důsledky se však liší.
2. **¶ Produktová delta.** Charakteristiky stejné (ISO 25010), ale typické vzorce kódu jiné. Li 2026.
3. **¶ Procesní delta.** ReAct, SWE-agent, Watanabe acceptance, Ehsani failed PRs.
4. **¶ Zdrojová delta.** Tokeny místo hodin, kontextové okno + rate limit, JetBrains complexity trap.
5. **Closing.** Existující rámce (ISO 25010, CMMI/ISO 33020) operují buď na izolované úloze nebo na organizační zralosti — single-run hodnocení nepokrývají. Bridge na 2.2.3.

**Klíčové citace:** jin2024llmagents, yao2022react, yang2024sweagent, watanabe2025agentprs, ehsani2026failedprs, li2026beyondbugfixes, jetbrains2025complexity, paulk1993cmm, iso33020.

**Bridge in:** Z 2.2.1 — agenti dělají to a to. 2.2.2 — to mění SE takto.

**Bridge out:** Existující rámce single-run nepokrývají → jak se měří dnes (2.2.3).

**Délka:** ~50 řádků.

---

### 4.9 Section 2.2.3 — Hodnocení schopností agentů

**Role:** Stav hodnocení agentů (benchmarky), pojmenovat gap, představit LLM-as-judge a test oracle problem. Motivovat potřebu vlastního metrického rámce.

**Main claim:** Současné benchmarky měří funkční korektnost; literatura (zmíněná v kap01) ukazuje, že to nestačí; LLM-as-judge je etablovaná metoda pro non-deterministic hodnocení, ale má biasy.

**Informační tok:**

1. **Opener (2 odstavce, sloučené benchmarky).**
   - SWE-bench, HumanEval — pass/fail standard. Krátká zpětná reference: „Tři empirické studie zmíněné v kap01 (METR, Li, Ehsani) dokládají, že tento výsledek pro praktickou použitelnost nestačí." Žádné re-narrating, jen ukotvení.
   - Newer benchmarks — SWE-bench Pro, ACE, FeatureBench. Extend ale ne 3-dim.
2. **¶ LLM-as-judge.** Zheng 3 biasy, Panickssery self-pref, Verga PoLL.
3. **¶ Test oracle problem.** Mathews 68 %, Chen 500 úloh. Agent-generované testy jako observační, ne validační.

**Změny oproti současnosti:** Zkrátit METR/Li/Ehsani recap z plného rozboru na 1–2 věty referující kap01. Plný detail je v kap01. Tady jen kotva pro argument.

**Co tam patří:**
- SWE-bench, HumanEval (pass/fail standard)
- Krátká reference na METR/Li/Ehsani z kap01
- Newer benchmarks
- LLM-as-judge teorie + biasy
- Test oracle problem

**Co tam nepatří:**
- Plný detail METR/Li/Ehsani (to je kap01)
- Naše judge volba, rubriky, metriky

**Klíčové citace:** swebench2024, chen2021humaneval, swebenchpro2025, acebench2025, featurebench2026, zheng2023mtbench, panickssery2024, verga2024poll, mathews2024, rethinking2025.

**Bridge in:** Z 2.2.2 — existující rámce nestačí. 2.2.3 ukazuje co dnes existuje.

**Bridge out:** Pro single case study je třeba vlastního metrického rámce → kap03. (Forward ref zde JE na místě.)

**Délka:** ~60 řádků (z ~80 — trim METR/Li/Ehsani recap).

---

### 4.10 Section 2.2.4 — Instrukce jako nezávislá proměnná

**Role:** Představit instrukce jako IV. Empirie smíšená — motivovat potřebu systematického postupu (kap03 + ablace kap04).

**Main claim:** Instrukce jsou hlavní operacionalizovatelná IV pro řízení chování agenta, ale empirie účinnosti je smíšená; otázka, které složky skutečně mění chování, zůstává otevřená.

**Informační tok:**

1. **Opener.** Tacit knowledge problém. Nonaka, Hassan SASE.
2. **¶ Scaffolding a AGENTS.md.** Definice scaffoldingu, instrukční soubory jako living documents.
3. **¶ Empirický inventář komponent.** Mao 7 komponent. SkillsBench procedurální > popisné.
4. **¶ Smíšená empirie účinnosti.** Lulla AGENTS.md present, Gloaguen LLM-generated škodí, SkillsBench curated +16,2 pp.
5. **¶ Specifičnost a citlivost.** Kim DETAIL, Zi. Breunig přestrukturování > opakování. Razavi prompt sensitivity.
6. **¶ Mechanismy účinku.** Vynucení vs aktivace. Wei CoT, Min ICL.
7. **Closing.** Otevřená otázka: jak instrukce systematicky navrhovat a poznat, které složky mění chování. Bridge na kap03 (iterativní postup) + kap04 (ablace).

**Klíčové citace:** nonaka1995, hassan2025sase, mao2025fse, skillsbench2025, lulla2026, gloaguen2025agentsmd, kim2025detail, zi2025specificity, breunig2025, razavi2025, wei2022cot, min2022rethinking.

**Bridge in:** Z 2.2.3 — hodnocení dnes nestačí. 2.2.4 ukazuje druhý nástroj: jak chování ovlivnit.

**Bridge out:** Otevřená otázka motivuje kap03 + kap04.

**Délka:** ~80 řádků.

---

### 4.11 Chapter closing (NEW)

**Role:** Uzavřít kap02 a most do kap03.

**Informační tok (1 odstavec, ~5 řádků):**

1. Co kap02 ustanovila: 3 dimenze, agenti přebírají, dnešní hodnocení gap, instrukce jako IV.
2. Co kap03 dělá: konkrétní operacionalizace + iterativní postup.

**Délka:** ~6 řádků.

---

## 5. Souhrn délek

| Blok | Cíl délky |
|---|---|
| Chapter intro | ~10 řádků |
| 2.1 preamble | ~30 řádků |
| 2.1.1 Produktová | ~70 řádků (z ~80, McCall pryč) |
| 2.1.2 Procesní | ~115 řádků (z ~140, Diagnostika pryč) |
| 2.1.3 Zdrojová + synthesis | ~55 řádků |
| 2.2 preamble | ~5 řádků (z ~15, kratší) |
| 2.2.1 Pojmy | ~25 řádků |
| 2.2.2 Mění SE | ~50 řádků |
| 2.2.3 Hodnocení | ~60 řádků (z ~80, METR/Li/Ehsani trim) |
| 2.2.4 Instrukce | ~80 řádků |
| Chapter closing | ~6 řádků |
| **Celkem (bez raw bloků)** | **~510 řádků** |

Současný stav (bez raw bloků): ~600 řádků. Cíl: ~510 řádků (mírná redukce při tighter argumentu).

---

## 6. Definition of done pro rewrite

- [ ] Každý blok splňuje svou roli a main claim z této blueprint.
- [ ] Žádný odstavec není výhradně lešticí; každý nese funkci v argumentu.
- [ ] Bridges in/out fungují bez forced phrasing.
- [ ] Žádné středníky v hlavním textu.
- [ ] Žádné em-dashy.
- [ ] Žádná cyrilice.
- [ ] Žádné P/Q/E kódy v textu.
- [ ] Žádný methodology jazyk.
- [ ] Termíny konzistentní s `TERMINOLOGIE.md`.
- [ ] První výskyt cizího termínu má `\textit{}`.
- [ ] Citace přímo u tvrzení.
- [ ] Forward refs jen kde čtenáři skutečně pomáhá.
- [ ] LaTeX build prochází bez nových errorů.
- [ ] Všechny existující labely zachovány.
- [ ] Audit trail bloky zachovány.
- [ ] Délka subsekcí v toleranci ~±20 % cílových hodnot.
- [ ] Chapter intro má thesis statement + roadmap.
- [ ] Chapter closing existuje a mostí na kap03.
- [ ] McCall 1977 odstraněn z prose.
- [ ] Diagnostika (Ko & Myers) odstraněn z 2.1.2 prose.
- [ ] DORA/SPACE reframe v 2.1.3 jako cross-dim synthesis.
- [ ] METR/Li/Ehsani v 2.2.3 jen reference na kap01.

---

## 7. Postup rewritu

1. **Validace blueprintu s uživatelem.**
2. **Per-blok rewrite v dependency order:**
   - Chapter intro
   - 2.1 preamble
   - 2.1.1
   - 2.1.2
   - 2.1.3 (vč. synthesis paragraph)
   - 2.2 preamble
   - 2.2.1
   - 2.2.2
   - 2.2.3
   - 2.2.4
   - Chapter closing
3. **Per-blok postup:**
   - Načíst aktuální obsah.
   - Porovnat s blueprintem.
   - Sepsat draft podle informačního toku.
   - Zkontrolovat vůči Definition of done.
   - Edit do souboru.
   - Build check.
4. **Po dokončení:** end-to-end re-read → bridges + konzistence + chapter intro/closing.
5. **Commit + push.**

---

## 8. Mimo scope

- Audit trail `\begin{raw}...\end{raw}` bloky neměníme.
- Bibliografie — přidávat citace jen pokud rewrite vyžaduje (žádné nové předpokládám).
- Pre-existující TikZ error v kap05:407 — out of scope.
- Sekce 2.1 → 2.2 swap (už hotový).
