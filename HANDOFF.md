# Handoff — stav BP po session 2026-03-25 (aktualizováno odpoledne)

## Celkový stav

| Část | Stav | Poznámka |
|------|------|----------|
| Úvod | ✅ DRAFT | Napsán — kontext, co práce dělá, přehled kapitol |
| kap01 Cíle | ✅ DRAFT | Motivace pokrývá 3 cíle, terminologie sjednocena |
| kap02 Teorie | ⚠️ 84% RAW | **Největší zbývající dluh.** RAW TODO pro emergentní chování/enabling constraints |
| kap03 Metodika | ✅ DRAFT | + RAW TODO poznámky (infra přerámování, eval nástroje, AI disclosure) |
| kap04 Praktická | ✅ DRAFT | Komparativní variace přepracovány, review značky pro pilotní sekce |
| kap05 Vyhodnocení | ✅ DRAFT | Kompletní — mechanismy účinku instrukcí, specificita, enabling constraints |
| Závěr | ✅ DRAFT | Shrnutí + odpovědi na 3 cíle |
| Abstrakt CZ+EN | ✅ DRAFT | 150-250 slov |
| Klíčová slova | ✅ hotovo | CZ + EN |

## Zbývá udělat

### Vysoká priorita
- [ ] **kap02 RAW→DRAFT** — největší dluh. Sekce: SWE+SDLC, AI coding agenti, scaffolding+instrukce, měření kvality SW
- [ ] **kap02 RAW TODO** — emergentní chování, enabling constraints, expertise reversal (5 zdrojů identifikováno)
- [ ] **AI disclosure** — konzultovat s vedoucím, aktivovat větu v zacatek.tex, napsat sekci v kap03
- [ ] **kap04 pilotní sekce** — 5 REVIEW-LAYERS značek (narování tabulek + interpretace jako fakt) k opravě

### Střední priorita
- [ ] **kap03 TODO:** přerámovat popis infrastruktury (README styl → měřicí aparát)
- [ ] **kap03 TODO:** zkrátit DSR sekci 3.1 (čtenář FIS to zná)
- [ ] **kap03 TODO:** zmínit eval nástroje (Langfuse/promptfoo — proč vlastní infra)
- [ ] **kap05 RAW TODO:** AGENTS.md mapping na spektrum specificity (Mao, Searle, Cynefin)
- [ ] **kap05:** přidat Constraints ablaci jako future work
- [ ] **Hassan SASE** — vision paper, ne empirická studie. RAW poznámka v kap03
- [ ] **SkillsBench 16.2pp vs 12.66pp** — rozpor v paperu, zvážit které číslo
- [ ] **Stabilita toolingu** — souhrnný odstavec do kap05 omezení (kolik běhů opakováno, proč)

### Nízká priorita
- [ ] Přílohy (app01-app03) — ověřit kompletnost
- [ ] `generated/` folder na Overleaf — push selhává, vytvořit ručně
- [ ] E1 tokeny z transcriptů (nice to have)
- [ ] **Juarrero 2023 book** — stáhnout přes browser do thesis/sources/

## Co se udělalo v session 2026-03-25 (odpoledne — AI disclosure + metodika)

### Šablona VŠE — update (thesis_update.ZIP)
- [x] Analyzován ZIP od vedoucího — klíčová změna: nový povinný soubor `prohlaseniAI.tex`
- [x] Vytvořen `thesis/prohlaseniAI.tex` — varianta 2 (AI byl použit), 3 kategorie použití
- [x] `zacatek.tex` refaktorován — inline prohlášení → `\input{prohlaseniAI}`
- [x] Vytvořen `thesis/app04.tex` — příloha s podrobným popisem AI použití (4 oblasti)
- [x] `prace.tex` — přidán `\include{app04}`
- [x] `biblatex-setup.tex` a `makra.tex` — naše verze je výrazně modernější, neupravovat
- [ ] **Konzultovat s vedoucím** — granularita přílohy AI, jaká přesnost se očekává

### Validace měřicí infrastruktury
- [x] Spuštěn sonnet subagent — manuálně ověřil P1–P5 pro r4 i r5 z raw git/GitHub dat
- [x] Výsledek: **všechny metriky sedí**, žádná diskrepance. Data z r4/r5 jsou validní.
- [x] Přidána věta do kap03 validita: "Správnost analyze-run.ts ověřena pro r4 a r5"
- [x] Zjištění r5: agent nevytvořil žádný issue/branch/PR — vše přišlo jako jeden blob commit

### AI disclosure v textu (RAW — ke konzultaci)
- [x] kap03 Diagnóza: RAW TODO — věta o AI asistenci při diagnostické analýze
- [x] kap03 sekce 3.5: RAW TODO — odstavec o využití Claude při psaní + ref na app04
- [x] Všechny nové věci jsou v RAW, ne v DRAFT — čekají na schválení vedoucím

### Metodologický reasoning (důležité pro příští session)

**APO vs DSR — klíčové rozlišení:**
- Naše metodika = **human-in-the-loop iterativní optimalizace instrukcí** (ne APO)
- APO (Automatic Prompt Optimization) = algoritmus automaticky generuje+testuje+selektuje
- DSR = epistemologický rámec PROČ to děláme jako výzkum (ne JAK technicky)
- Jsou to různé věci na různých vrstvách — nejsou v konfliktu
- Průmysl dělá plnou automatizaci (MiniMax M2.7, DSPy, PromptWizard Microsoft) — náš přístup je manuální předstupeň který dokumentuje kauzalitu

**Artefakt — jak to zjednodušit:**
- Problém: slovo "artefakt" (DSR termín) budí zmatek — čtenář neví na jaké úrovni jsme
- ML papers to řeší elegantně: vůbec nepoužívají "artefakt" — říkají "we propose X, evaluate on Y"
- Doporučení: nahradit "artefakt" konkrétními slovy — "sada metrik", "iterační postup"
- Slovo "artefakt" nechat jen jednou v kap03 u DSR definice
- Čtyři úrovně práce (systém upomínek / agent / instrukce / evaluační metoda) — tabulka by pomohla čtenáři

**Co dělají ostatní papers:**
- ML/AI papers: žádná formální metodika — "propose X, evaluate on Y, compare to baseline"
- IS/SE papers: empirical study, case study (Yin), mixed methods, SLR
- DSR: specifické pro IS kde výstupem je artefakt — sedí pro nás (Method + Instantiation)
- V ML je artefakt model/architektura, u nás je artefakt evaluační metoda

**kap02 — co chybí:**
- RAW TODO přidáno: pojmenovat náš přístup vůči APO — "human-in-the-loop iterativní optimalizace"
- Citace: Zhou et al. ICLR 2023 (APE paper, arXiv 2211.01910) — stáhnout a přidat do sources
- MiniMax M2.7 jako ilustrativní příklad automatizace (blog post, ne peer-reviewed)

## Co se udělalo v session 2026-03-25

### Kap04 komparativní variace — přepracování
- [x] Substituce odstavec smazán (je v kap03)
- [x] Ablace A+B subsekce: úvod zkrácen (duplikace s "Výběr složek pro ablaci")
- [x] Metriky doplněny k Ablaci A očekáváním (Q5, Q6)
- [x] `git log --oneline -3` falešná kauzalita s P5 opravena — kontroluje P3, ne P5
- [x] P5 v Ablaci B: smazán argument přes git log, nahrazen čistým "nedeterminismus jako v pilotech"
- [x] Duplicitní Q2 interpretace v Ablaci B smazána (nedeterminismus vs chybějící kontext — protiřečilo si)
- [x] OpenCode crash odstavec smazán z Ablace A i Závěru (přesunout souhrnně do omezení)
- [x] Závěr komparativní fáze: `git log` odstraněn z výčtu quality checks

### Prezentace dat — systematický review
- [x] **8× REVIEW: text naruje tabulku** — značky přidány v kap04 (agent)
- [x] **16× REVIEW-LAYERS** — pozorování/interpretace/závěr vrstvy označeny v kap04 (10) + kap05 (6)
- [x] 3 narování tabulek opraveny v komparativní variaci (#5, #6, #7)
- [x] 3 "interpretace jako fakt" opraveny — hedging přidán ("naznačuje", "data jsou konzistentní s")
- [x] Zbývá 5 REVIEW značek v pilotních sekcích (r2, r4, r5) + 1 v souhrnných výsledcích

### Terminologie
- [x] "instrukční sada" → "instrukce" / "soubor AGENTS.md" (celá thesis, předchozí subsession)
- [x] Deklarativní/procedurální vysvětleno s příklady v kap04
- [x] Operacionalizace instrukcí — spektrum v TERMINOLOGIE.md

### Literature & research (předchozí subsession)
- [x] 10 nových BibTeX záznamů (Kim, Zi, Lou, Jiang, Qi, Wallace, Wei, Min, Park, Juarrero)
- [x] 9 papers staženo do thesis/sources/
- [x] Dva mechanismy účinku instrukcí: vynucení (enforcement) vs aktivace (activation)
- [x] Enabling constraints (Juarrero/Cynefin) — Package Quality jako příklad
- [x] Expertise reversal effect (Kalyuga 2003)
- [x] Specification entropy jako limit benchmarků

### Kap05 — nové sekce (předchozí subsession)
- [x] Specificita instrukcí + mechanismus účinku (5.2)
- [x] Enabling constraints odstavec (5.2)
- [x] Nízká entropie specifikace jako limit (5.3)
- [x] Mechanismy účinku instrukcí (5.5 future work)

### Best practices
- [x] `jak-psat-vedecky.md` — nová sekce "Prezentace dat (tabulky, grafy)" s třemi vrstvami
- [x] `feedback_review_workflow.md` — first-principles review approach uložen do memory
- [x] `make watch` / `make watch-draft` / `make watch-clean` pro auto-rebuild

## Review značky v kap04 (zbývající)

### REVIEW: text naruje tabulku (5 zbývajících)
1. ~ř. 454 — pilot r2: "P5 a Q7 opraveny, lint warnings sníženy na 1"
2. ~ř. 464 — pilot r2: "Q2 a Q3 se zhoršily (32/42 resp. 68%)"
3. ~ř. 632 — pilot r4: "Q2 se zhoršilo z 41/42 na 39/42"
4. ~ř. 735 — pilot r5: "Q5=0 a Q7=0"
5. ~ř. 1200 — souhrnné výsledky: "zhoršilo 4 metriky (Q2, Q3, Q5, Q7)"

### REVIEW-LAYERS (zbývající v kap04+kap05)
- Viz komentáře přímo v souborech

## Opraveno (předchozí sessions)

<details>
<summary>Session 2026-03-24</summary>

- [x] kap05 kompletní DRAFT (5.1-5.5)
- [x] kap04 diagnostiky přepsány na interpretace + graf metrik
- [x] kap01 motivace pokrývá 3 cíle, terminologie sjednocena
- [x] kap03 diagramy (stavový, pipeline), substituce→ablace, empirické limity→kap05
- [x] Terminologie: 6 oprav + TERMINOLOGIE.md + PRVKY-BP.md
- [x] Úvod, závěr, abstrakt CZ+EN — DRAFT
- [x] Overleaf push kompletní
</details>

<details>
<summary>Session 2026-03-23</summary>

- [x] kap03 opravy (P1-P6→P1-P5, dva běhy, OpenCode hang)
- [x] kap04 Mao adaptace, kap05 "19 metrik"
- [x] kap04 ablace A+B DRAFT + souhrnná tabulka
- [x] Citační opravy, literature verification
</details>
