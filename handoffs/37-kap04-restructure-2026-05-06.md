# Handoff 37 — kap04 strukturní revize + terminologie + E3 reframe (2026-05-06)

## Branch
`cleanup/kap04-redundance` (PR #50)

## Cíl session
Pokračování cleanup passu. Začalo dořešením `Z5` z handoff 36, přerostlo do širší revize:
- terminologická konzistence (deterministická vs judge-based, "X z 10" agregát)
- E3 (počet kompakcí) reframe z exit kritéria na deskriptivní indikátor
- strukturní revize r1-r5 v kap04 (findings tabulky)
- konceptuální vyjasnění výzkumného designu (NO DSR, NO MCP)

## Commity (chronologicky)

| Commit | Co |
|---|---|
| `ca0e971` | Sjednocení terminologie a tabulek: odstraněn "X/10" agregát, judge-based vs deterministický, trend slovník delta tabulek 8→4, n/a unifikováno, jazyk metrik v buňkách (P3, P5, P6, Q7), E2 formát |
| `2376e72` | E3 reframe (cíl 0 → deskriptivní), tři osy klasifikace metriky v kap03, terminologie kolem "deterministická vs pass/fail", TERMINOLOGIE.md aktualizován |
| `b76bd1b` | placeins package (build dependency pro `\FloatBarrier`) |
| `24f3ed4` | kap04 strukturní revize r1-r5: findings tabulky (chování / metriky / příčina), merged Závěry + Intervence, r5 = Závěr pilotní fáze |
| `638e531` | findings tabulky: footnotesize + equal-width sloupce (X|p{0.14}|X) |
| `47191d0` | r2 vyhozen triviálně pozitivní řádek; r3 findings tabulka úplně odstraněna (pouze 1 informativní nález → prose); r4 vyhozeny "viz dále" řádky; pokus o zebra |
| `21a6c30` | drop nefunkční `\rowcolors` (konflikt s tabularx) + drop `@{}` na okrajích (couhání ~6pt) |

## Klíčová rozhodnutí

### E3 reframe (z kritéria → deskriptivní indikátor)
- Důvod: E3 = 0 ve všech 9 bězích, nediskriminuje, "kompakce jako kritérium" nedává smysl
- E bucket je nyní homogenně deskriptivní (E1, E2, E3 — všechny bez exit prahu)
- Pass/fail soud o běhu se opírá jen o P + Q
- Updated: kap03 sec metriky-zdroju, tab:e1-e3, tab:metriky-prehled, kap04 tabulky, kap05 interpretace
- Memory: `e3_metric_audit.md` → outdated, viz `e3_descriptive_indicator.md`

### Terminologie metrik (3 ortogonální osy)
1. **Způsob měření**: deterministická vs judge-based
2. **Role v hodnocení**: exit kritérium vs deskriptivní indikátor
3. **Kategorie**: procesní (P) / produktové (Q) / zdrojové (E)

Zakázané formulace (v TERMINOLOGIE.md):
- "X z N deterministických kritérií" → per-metric výčet nebo "binární pass/fail kritéria"
- "kompakce jako kritérium"
- "deterministická kritéria" jako synonymum pro pass/fail

### kap04 anatomie iterace (3 paragraphs)
```
\subsection{Pilot-rN}
[Intro, 1 věta]

[Per-běh / delta tabulka — beze změny]

\paragraph{Diagnostika chování.}
[Findings tabulka: 3 sloupce]

\paragraph{Závěry a intervence pro r_{N+1}.}
[Merged synthesis + intervence + odkaz na diff figure]
```

R5 má místo intervence `\paragraph{Závěr pilotní fáze.}` s bridge na ablace.

### Findings tabulka — pravidlo pro řádky
**Řádek patří do tabulky pokud nese interpretační hodnotu** (chování → metrika → mechanismus). Triviální výsledky ("intervence zafungovala") patří do prosea, ne tabulky.

Současný stav:
- r1: 6 řádků (všechny informativní)
- r2: 4 řádky (po vyhození triviálního pozitivu)
- r3: **žádná findings tabulka** — pouze 1 informativní nález → prose paragraf
- r4: 2 řádky (po vyhození "viz dále" sdílených příčin)
- r5: 4 řádky

Sloupce: `Pozorované chování` | `Metriky` | `Příčina` (NE "Hypotéza" — implikuje dokazování).
Pořadí: behavior → evidence → interpretation (best practice empirický SE / case study).

### Visual styling findings tabulek
- Font: `\footnotesize`
- arraystretch: 1.25
- tabularx s `Xp{0.14\linewidth}X` (equal-width pro chování a příčina)
- Bez zebra (rowcolors konflikt s tabularx + akademicky čistší booktabs-only)
- Bez `@{}` na okrajích (jinak couhá o ~6pt)

## Konceptuální guardraily (NEW, do memory)

### NO DSR vocabulary
Práce JE případová studie podle Yina, NE Design Science Research.
- DSR slovník ("design artifact", "kernel theory") v ČR akademii = těžkopádný
- ML paper styl > DSR styl (CLAUDE.md)
- DSR maximálně jednou v kap03 jako reference, ne jako rámec

### NO MCP
MCP (Model Context Protocol) je Anthropic-specifický. Naše case study používá **OpenCode** s nativními tool calls. Slovo MCP nepatří do thesis.

### Framing výzkumného designu (pro obhajobu)
> "Případová studie podle Yina, jejímž cílem je porozumět chování AI coding agenta na netriviální softwarové úloze. Metrický rámec slouží jako analytický aparát měřící chování ve třech vrstvách (proces, produkt, zdroje). Iterativní postup demonstruje, jak lze tyto metriky využít k řízeným úpravám instrukcí, a ablace ověřují, které části instrukcí jsou pro chování klíčové."

Hlavní cíl = **porozumění chování**, ne "feasibility metrik" (to je vedlejší).

### Tabulky findings = rigor + traceability, ne DSR-specific
Strukturované findings tables existují v obou tradicích (DSR i case study). Pro nás je to nástroj rigoróznosti, ne metodologický commitment.

## Build state
- `prace.pdf`: 78 stran
- `prace-clean.pdf`: 78 stran (pro vedoucího)
- `prace-full.pdf`: 78+ stran (s raw bloky)
- Build čistý, žádné undefined refs
- `make watch-clean` běží na pozadí

## Open items
- **Reading review** — uživatel čte aktuální stav v PDF, může přijít feedback
- `experiments/runs/*` — submodule modified content (mimo scope cleanup PR)
- `notes/daily/2026-05-05.md` — uncommitted, uživatel tracker
- Případně: Ablace A/B mají taky `\paragraph{Interpretace.}` ve volném prose — mohli bychom navést do stejné struktury (findings tabulka). NEJDE po review pilotních.

## Pro budoucí session
- Při full-pass / editaci kap04 → drž anatomii: per-běh tabulka → Diagnostika chování (findings tabulka) → Závěry a intervence
- Sloupec "Příčina" ne "Hypotéza"
- Findings tabulka jen tam kde má interpretační hodnotu (r3 ji nemá)
- E3 = deskriptivní indikátor, ne exit kritérium
- E bucket homogenně deskriptivní
- TERMINOLOGIE.md je živý dokument — držet aktuální při terminologických změnách
