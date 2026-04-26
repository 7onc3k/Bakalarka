# Handoff 28 — Restrukturalizace 2.1 na dimension-centric

**Datum:** 2026-04-26
**Scope:** thesis/kap02.tex (sekce 2.1), thesis/literatura.bib, thesis/sources/

## Co se změnilo

### 1. Restrukturalizace 2.1 z role-centric na dimension-centric

**Před:**
```
2.1.1 Kvalita software         (koncept)
2.1.2 Praktiky zajišťování     (jak se zajišťuje)
2.1.3 Měření kvality software  (jak se měří)
```

**Po:**
```
2.1 [PREAMBLE — motivace + F&B taxonomie list + roadmap]

2.1.1 Produktová kvalita
      [koncept: SWEBOK + ISO 25010 + FS/MS pro agenty]
      ¶ Proč je dosažení kvality obtížné       (Brooks)
      ¶ Testování                                (úrovně + coverage + mutation)
      ¶ Statická analýza a konvence kódu        (McCabe + linting + refactoring)
      ¶ Meze deterministického hodnocení        (bridge na kap03)

2.1.2 Procesní kvalita
      [koncept: F&B process attrs + význam praktik]
      ¶ Správa verzí, integrace a traceability  (Shihab + Humble + Gotel)
      ¶ Test-driven development                  (Beck + Rafique)
      ¶ Code review                              (Bacchelli + Sadowski + McIntosh)
      ¶ Diagnostika chyb                         (Ko & Myers)
      ¶ Deklarace versus pozorovaná praxe       (Beller)
      ¶ Rámce procesní zralosti                  (CMMI/ISO 33020 disclaimer)

2.1.3 Zdrojová dimenze
      [koncept: Fenton resource attrs + asymetrie literatury]
      ¶ Tradiční proxy a odhady pracnosti       (COCOMO + story points + cycle/lead time)
      ¶ Produktivita jako multi-dimenzionální    (DORA + SPACE)
      ¶ Od lidských hodin k tokenům             (bridge na 2.2.2)
```

### 2. Důvod restrukturalizace

Identifikovaný overlap mezi původní 2.1.2 (dimenze) a 2.1.3 (praktiky):
- TDD figurovalo 2× (jednou jako dimension content, podruhé jako practice)
- Code review 2× (Bacchelli citován dvakrát)
- CMMI 2× (jednou jako dimenze, podruhé jako maturity disclaimer)

Na single-run úrovni *praktika a měření splývají* (TDD compliance je praktika i signál), takže oddělené sekce vytvářely umělou hranici.

### 3. Strukturální princip pro každý `\paragraph{}` blok

Konzistentní 1-6 vzor:

1. **CO TO JE** — definice (1-2 věty)
2. **PROČ TO MATTERS** — motivace, jaký problém řeší (1-2 věty)
3. **JAK SE TO V PRAXI DĚLÁ** — konkrétní formy (2-4 věty)
4. **EMPIRICKÁ OPORA** — citace + findings (1-3 věty)
5. **JAK SE TO POZORUJE** — observable signals (1-2 věty, kde relevant)
6. **LIMITACE / NUANCE** — caveats (1-2 věty, kde relevant)

Body 1-4 vždy. Body 5-6 podle relevance pro most na kap03.

### 4. Bibliografie — 5 nových citací

| Bib key | Reference | Pro co |
|---|---|---|
| `paulk1993cmm` | Paulk et al. 1993 (IEEE Software) | CMM/CMMI maturity rámec |
| `iso33020` | ISO/IEC 33020:2019 | Process measurement framework |
| `komyers2008debugging` | Ko & Myers 2008 (ICSE) | Diagnostika — 90% wrong-first-guess empirický anchor |
| `sadowski2018codereview` | Sadowski et al. 2018 (ICSE-SEIP) | Code review at Google (komplement k Bacchelli/Microsoft) |
| `beller2019testing` | Beller et al. 2019 (IEEE TSE) | Field study 2,443 dev: deklarace ≠ praxe |
| `boehm1981cocomo` | Boehm 1981 (Prentice-Hall) | COCOMO model |
| `forsgren2021space` | Forsgren et al. 2021 (CACM) | SPACE framework — multi-dim productivity |

Nepoužité v textu, ale v bib pro budoucí potřebu (kap03):
- `basili1994gqm` — GQM (záměrně necitujeme, neaplikujeme formálně)
- `nuseibeh2000reroadmap` — RE roadmap (může se hodit pro spec adherence v kap03)

### 5. PDF zdroje přidané do thesis/sources/

- `boehm-1984-software-engineering-economics.pdf` (2.8 MB) — fallback
  paper version (1981 book paywalled, 1984 IEEE TSE paper publicly available)
- `forsgren-2021-space-developer-productivity.pdf` (328 KB) — direct ACM DL

### 6. Klíčové redakční rozhodnutí

#### A) Brooks ano, Lehman ne
Brooks essential/accidental composition je *uvažování* o tom, proč je kvalita obtížná, a~přímo se aplikuje na AI agenty (jejich výstupy stojí na obojím). Lehman software entropy je o long-term evolution, což není scope naší práce (single experimental run).

#### B) Tokens/wall-clock přesunuty z 2.1.2 (zdrojová) do 2.2.2 (agent bridge)
Responsibility split: 2.1.2 = obecná SE dimenze (Fenton attrs), 2.2.2 = delta u agentů (tokeny).

#### C) GQM (Basili) v bib, ale necitujeme
Honest assessment: my GQM formálně nepoužíváme. Cituvat Basiliho jako methodology anchor by byla retroaktivní racionalizace. Bib entry zůstává pro případnou kap03 referenci.

#### D) `\paragraph{}` headings místo `\subsubsection`
Uživatel preferuje plynulý text členěný odstavci, ne hierarchické zanoření. Konzistentní s ostatkem kap02 (2.1.3 původně používala `\paragraph{}` pro "Procesní praktiky", "Testování" atd.).

#### E) F&B taxonomie jako `itemize` list v preamble
Definiční taxonomie zaslouží vizuální oddělení 3 entit. Konzistentní s kap01 (jiné itemize listy v thesis).

### 7. SPACE framework jako theoretical anchor

Forsgren et al. 2021 SPACE explicitně varuje před redukcí produktivity na jedinou metriku (SLOC, count commits) a~argumentuje pro 5-osový multi-dimenzionální pohled. **Tohle je literatura precedens pro náš P/Q/E přístup** — v kap03 / kap05 se na něj můžeme odkázat jako na teoretickou oporu, že multi-dimenzionální měření productivity není naší invencí, ale aplikací zavedeného principu na agentní kontext.

## Co prošlo iteracemi (lessons learned)

### Pattern: kompresní reflex
Při merge/restructure operacích jsem opakovaně kompresoval text bez záměru — odstraňoval pedagogické framing věty, sloučil odstavce které měly samostatnou funkci. Memory note `feedback_thesis_brevity.md` na to varuje.

User pushback 2× v této session:
1. Rozdělení procesního odstavce na 2× → user: „nebudou potřeba"
2. Příliš stručné sekce po dimension-centric merge → user: „why did we shorten"

**Korekce aplikovaná:** Restoration framing vět („Význam X spočívá v tom, že..."), návrat k 1-6 strukturnímu vzoru pro každý paragraph, holistický flow rewrite na konec.

### Pattern: nedostatečné využití originálu
Při mergi jsem nevyužil bohatý původní text z committed state. User upozornil, že máme přístup k původnímu znění přes git, a vyzval k restoration relevantního obsahu (ne blind copy, ale selective restoration s ohledem na scope thesis).

**Korekce:** Vytaženi originál přes `git show HEAD:`, identifikováno co relevant (Brooks, ISO framing, FS/MS context, coverage explanation, McCabe empirical) vs. co tangenciální (Lehman, full McCall 3-perspective).

### Pattern: meta-úrovňové struktury rozhodnutí
Před každou změnou strukturálního charakteru je potřeba **explicitně formulovat best-practice pravidla** (jak má každý `\paragraph{}` blok vypadat, v jakém pořadí, co tam patří). Memory note `feedback_subagent_scope.md` na to varuje pro subagenty, ale platí i pro vlastní práci.

**Korekce:** Articulated 1-6 paragraph structure principle in handoff, applied consistently across all `\paragraph{}` blocks.

## Ověření

- 0 em-dashů v těle 2.1
- 0 středníků v těle 2.1
- 0 cyrilice
- 0 methodology language ("vybíráme", "v naší studii")
- Všechny labely zachovány jako aliasy: `sec:dimenze-kvality`, `sec:mereni-kvality`, `sec:testovani-mutation`, `sec:staticka-analyza`, `sec:praktiky-kvality`, `sec:faze-zivotniho-cyklu`, `sec:modely-metodiky`, `sec:definice-komplexita`, `sec:mereni-kvality-obecne`
- Všechny forward refs z kap03/kap04 fungují

## Známé issues mimo scope

**LaTeX render error (kap05.tex:407):** TikZ figura používá `\\[-2pt]` syntax který failuje při fresh build. **Není z mých kap02 úprav** — pre-existující v committed state. Ne řešeno v této session, prozatím flagged.

## Next steps (návrhy)

1. **Audit 2.2** — v dřívější session jsem ořezal 2.2.1 (Liu, Yao, Schick). Zkontrolovat zda 2.2 nepotřebuje stejnou flow/restoration léčbu.
2. **2.2.2 procesní paragraph** — měl by navazovat na konkrétní praktiky z nové 2.1.2 (jak agenti provádějí TDD/review/diag), ne jen na systémové papery (ReAct, SWE-agent).
3. **Fix kap05 TikZ render error** — `\\[-2pt]` v node potřebuje jiný syntax.
4. **Top-down revize** zbývajících kapitol s nově ustanoveným principem 1-6 paragraph structure.

## Soubory změněné

- `thesis/kap02.tex` — sekce 2.1 přepsána (preamble + 3 podsekce + audit trail)
- `thesis/literatura.bib` — 7 nových bib entries (paulk, iso33020, komyers, sadowski, beller, basili, nuseibeh, boehm, forsgren)
- `thesis/sources/boehm-1984-software-engineering-economics.pdf` — nový
- `thesis/sources/forsgren-2021-space-developer-productivity.pdf` — nový
