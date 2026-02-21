# Design Evolution — Audit Trail

Audit trail myslenkoveho pochodu pri navrhu experimentu. Obsah byl v kap03.tex, presunut sem protoze je to rozhodovaci historie, ne obsah BP.

Presunuto: 2026-02-21

---

## Evoluce designu (Posun 7 → Posun 8)

Puvodni design porovnaval dva instrukcni styly (meta vs. explicit) napric tremi dimenzemi P/O/Q odvozenymi z SASE frameworku a taxonomie Wang et al. Pilotni beh R0 a dve nezavisle literature review (Gemini Deep Research, ChatGPT Deep Research — viz `docs/`) odhalily tri problemy:

1. **Delivery mechanism konflikt:** OpenCode defaultni system prompt (`qwen.txt`) obsahuje "NEVER commit unless asked", coz prebijel nasi instrukci "commit as you progress". Agent v pilotu commitnul jednou na konci. Reseni: `build.md` s `mode: primary` nahrazuje `qwen.txt` (overeno empiricky).

2. **Meta instrukce nebyly meta-prompting:** Nase "meta" instrukce (co + proc) neodpovidaly meta-promptingu ve smyslu Suzgun (suzgun2024metaprompt) (orchestration scaffolding). Byly to soft explicit instrukce — agent je ignoroval stejne jako by ignoroval hard explicit.

3. **Dimenze neodpovidaly empiricke nejistote:** Oba nezavisle research reporty identifikovaly jako oblasti s genuinely uncertain evidence jine dimenze nez P/O/Q. Puvodni dimenze byly odvozeny taxonomicky (SASE, Wang); nove jsou odvozeny z empirickych rozporu v literature.

### Posun 8 — iterativni pilot + ablace/variace (2026-02-19)

Dve metody experimentalnich zmen:

1. **Ablace** — odebrani komponenty instrukce uplne. Meri *nutnost*: funguje agent bez teto instrukce? Priklad: odebrat TDD instrukci → dela agent TDD prirozene?

2. **Komparativni variace** — zmena obsahu komponenty. Meri *efekt obsahu*: ktera varianta produkuje lepsi vysledky? Priklad: TDD instrukce vs. impl-first instrukce → co je lepsi?

Ablace a variace odpovidaji ruznym vyzkumnym otazkam a lze je kombinovat: ablace nejprve ukaze ktere instrukce jsou nutne, variace pak porovna jejich varianty.

### Princip vyberu dimenzi

Experiment testuje aspekty scaffoldingu, kde existuje **konfliktni nebo nedostatecna evidence** — ne ty, kde je vysledek predem jasny. Settled practices (minimalni instrukce, explicit scope constraints, lightweight verification) jsou zafixovany do baseline. Proven anti-patterns (verbose auto-generated context, exhaustive enumeration) jsou vylouceny.

Dimenze byly vybrany na zaklade dvou nezavislych deep research reportu, ktere identifikovaly tri oblasti s nejvetsi empirickou nejistotou a nejvyssim potencialem pro meritelne rozdily.

---

## Stary faktorialni design (R0-R5) — ZASTARALY

**Poznamka:** Tento design byl navrzen v Posunu 7 a opusten v Posunu 8 ve prospech DSR iterativniho pilotu + ablace. Zachovano jako rozhodovaci historie.

### Tri experimentalni dimenze

| Dim. | Nazev | Varianta A | Varianta B |
|------|-------|-----------|-----------|
| P | Planning artifact | Pred kodem vytvor explicitni plan/design doc (moduly, typy, sekvence). | Zadny planovaci artefakt; rovnou iteruj s kodem a testy. |
| T | Testing workflow | Strict TDD: pro kazde AC napis failing test ze spec → implementuj → green → dalsi AC. | Implementuj nejdriv; po stabilizaci napis testy proti spec. |
| C | Constraint density | Minimalni: jen cile a acceptance criteria, agent rozhoduje o procesu. | Komprehensivni: explicit proces, quality gates, lint/typecheck/CI. |

### Zduvodneni per dimenze

**P — Planning artifact.** Jiang et al. (2024, TOSEM) ukazuji +25% Pass@1 pri self-planning code generation. Naopak novejsi evaluace (2025) zjistuji, ze planning-like prompting ztraci benefit na modernich modelech a concise objective-style prompting dosahuje srovnatelne accuracy s mensi spotrebou tokenu. Pro agentic setting s tool use je otazka otevrena.

**T — Testing workflow.** TDD ze specifikace brani test oracle problemu (mathews2024). Ale LLM jsou trenovane na code-before-tests distribuci — vynuceni test-first muze produkovat tautologicke testy ("Context Pollution"). V agentic settings extra testing zvysuje cost a muze snizit success rate (AGENTbench 2026). Agentless (xia2024agentless) ukazuje, ze fixni pipeline bez autonomniho planovani dosahuje 32% na SWE-bench Lite.

**C — Constraint density.** Lulla et al. (lulla2026) ukazuji, ze AGENTS.md s explicitnimi informacemi snizuje runtime o 28%. AGENTbench (2026) naopak zjistuje, ze verbose context files snizuji success rate a zvysuji cost o 20%+. Primy rozpor — zalezi na tom CO je v instrukcich, ne jen zda existuji.

### Experimentalni behy (vyvazeny frakcni faktorialni design)

| Run | P | T | C | Popis |
|-----|---|---|---|-------|
| R0 | plan | test-first | minimal | Planovani + TDD, minimum instrukci |
| R1 | plan | impl-first | comprehensive | Planovani + impl-first, detailni instrukce |
| R2 | plan | impl-first | minimal | Planovani + impl-first, minimum |
| R3 | no-plan | test-first | comprehensive | Bez planu + TDD, detailni instrukce |
| R4 | no-plan | test-first | minimal | Bez planu + TDD, minimum |
| R5 | no-plan | impl-first | comprehensive | Bez planu + impl-first, detailni |

Sest behu, single run per podminku. Kazda dimenze testovana presne 3x per uroven (balanced). Design umoznuje parove srovnani per dimenze.

### Fixni promenne (stary design)

- Prazdne GitHub repo (AGENTS.md, .opencode/config.json, .opencode/agents/build.md, auto-continue plugin)
- Specifikace v GitHub Issue #1 — plne acceptance criteria a domenovy glossary, bez architecture layer
- Auto-continue plugin (session.idle hook s pocitadlem restartu a build/test kontrolou)
- Model: GLM-5 pres OpenCode; system prompt build.md (nahrazuje defaultni qwen.txt — kodove konvence, zadne procesni instrukce)
- Fixni hlavicka AGENTS.md: odkaz na specifikaci, popis prostredi, vystupni pozadavek, commit policy, scope constraints

### Confound mitigation — delka instrukci

Delka instrukci sama o sobe ovlivnuje vysledky (IFScale benchmark, lost-in-the-middle efekt). Varianta C-comprehensive je zamerne delsi nez C-minimal — to JE treatment, ne confound. Pro dimenze P a T jsou varianty normalizovany na srovnatelny word count. Prompt sensitivity (razavi2025) je priznana jako limitation.

### Pilot studie

Pred experimentalnimi behy probehne pilotni validace setupu na R0. Pilot identifikuje technicke problemy (timeouty, bugy v orchestraci, nedostatky v sablone) a kalibruje metriky. Iterace na pilotu se nepocitaji do vysledku studie.

### Deployment a Maintenance mimo scope

Experiment meri co agent vytvori; npm package nema realne uzivatele ani provoz.

### Proc tri SDLC faze (bez Testing)

Testing faze se v kontextu TDD rozpada na dve aktivity: psani testu = interpretace requirements (spustitelna specifikace — sommerville2016, swebok2024), spousteni testu = verifikacni feedback loop implementace. Test oracle problem (mathews2024) potvrzuje, ze testy odvozene z kodu (nikoliv ze specifikace) validuji chybne chovani v 68,1% pripadu.

---

## Katalog ablatable komponent (brainstorm)

Nasledujici seznam identifikuje komponenty, ktere lze jednotlive odebrat a merit jejich dopad. Vychazi z empirickych ablacnich studii v literature — SWE-agent (yang2024sweagent) abluje ACI komponenty, CCA (wang2025cca) abluje scaffolding features, Anthropic (anthropic2025harness) identifikuje failure-specific komponenty.

### Specifikace (BriefingScript)

- Architecture vrstva (types, invariants, behavioral model) — specine2025
- Domenovy glossary — domaincodegen2024
- Detail acceptance criteria (konkretni hodnoty vs. obecny popis) — ticoder2024
- Behavioral model / state diagram — sommerville2016

### Instrukce (LoopScript + MentorScript)

- agents.md jako celek — hassan2025sase
- TDD instrukce (testy pred implementaci) — mathews2024
- Git workflow konvence (branching, commits, PR)
- Code quality standardy (strict mode, no-any)
- Code review instrukce

### Prostredi (Agent Execution Environment)

- CI pipeline (automaticka kontrola)
- Pre-konfigurovany tooling (tsconfig, eslint, vitest, stryker)
- Project structure (adresarova struktura, package.json)

### Orchestrace a session management

- Session-per-issue granularita — empiricky validovana jako optimalni scope (spotify2025context); agenti selhavaji pri feature-level scope (featurebench2026)
- Issue-based task decomposition — dekompozice ukolu do sub-issues s dependencies; task decomposition jako context management strategie (chainofagents2024)
- Sub-agent delegace — orchestrator deleguje issues na sub-agenty s cistym kontextem; hierarchicka orchestrace dosahuje SOTA (agentorchestra2025); trust calibration mezi delegatorem a delegatem (googledelegation2026)
- Role separation — oddeleni analytickych a exekucnich roli. MASAI (masai2024) definuje 5 specializovanych sub-agentu se structured artifact passing (ne konverzaci); AgentCoder (agentcoder2024) empiricky validuje separaci test designu od implementace (96,3% HumanEval); Agyn (agyn2026) replikuje inzenyrsky tym s dedikovanymy rolemi a dosahuje 72,2% SWE-bench 500. Studie ukazuji, ze organizacni design je stejne dulezity jako schopnosti modelu.
- Single vs. multi-agent trade-off — prinos multi-agent architektury klesa s rostouci schopnosti modelu (singleormulti2025); hybridni pristup (multi-agent jen tam kde je potreba) prinasi +1-12% accuracy pri -88% cost. Multi-agent systemy maji 14 identifikovanych failure modes ve 3 kategoriich (system design, inter-agent misalignment, task verification) (mast2025). Minimalni efektivni rozdeleni = separace testovani od implementace.
- Meta-prompting — misto explicitnich instrukci agent dostane meta-instrukci navrhnout si vlastni workflow; task-agnostic scaffolding pattern (suzgun2024metaprompt); automatizovany design agentnich systemu (hu2024adas)
- Completion verification loop — mechanismus zajistujici, ze agent dokonci cely projekt, ne jen jeden krok. Tri varianty: (1) Ralph Loop — vnejsi cyklus s cistym kontextem per iteraci, stav pres soubory/issues, implementovan v Claude Code i OpenCode; (2) session.idle hook — plugin uvnitr agentniho frameworku, pri ukonceni agenta overi podminku dokonceni (napr. pocet otevrenych issues pres GitHub API) a pokud neni splnena, re-injektuje prompt s aktualnim stavem; pocet restartu slouzi jako metrika autonomie agenta; (3) instruktazni — agent dostane instrukci "neskonci dokud vsechny issues nejsou uzavreny", bez vnejsi kontroly.
- Retry strategie — single-shot vs. fresh-context retry vs. child fix issues; scaffolding a retry jsou nezavisle hodnotne a multiplikativni (neurosymbolic2025)
- Strukturovana dokumentace v issues — zaznam pro nasledujici agent session (co bylo zkuseno, co selhalo, aktualni stav) (anthropic2025harness). Kazda inter-agent zprava je potencialni failure point; chain-style error propagation kaskaduje male nepresnosti do systemovych selhani (agentask2025). Tri validovane mechanismy predavani stavu: (1) progress file + git commity (anthropic2025harness), (2) GitHub issues jako komunikacni kanal (issue → PR → review), (3) structured artifact passing s formalni output specifikaci (masai2024)

### Context window management

- Context window degraduje s delkou, ne jen "dojde" — coding performance klesa z 29% na 3% pri long-context ulohach (longcodebench2025); U-shaped krivka, informace uprostred se ztraci (liu2024lost); nerovnomerna degradace napric 18 modely (contextrot2025)
- Observation masking (skryti detailu tool outputu) je stejne efektivni jako LLM summarization za polovicni cenu (jetbrains2025complexity)

### Mapovani na dimenze

Tento katalog byl pri navrhu experimentu mapovan na tri dimenze vybrane na zaklade empiricke nejistoty v literature: P (Planning artifact) pokryva planovaci a architektonicke rozhodnuti, T (Testing workflow) pokryva testovaci strategii a poradi test/implementace, C (Constraint density) pokryva procesni instrukce, quality gates, tooling a CI. Polozky z katalogu tykajici se specifikace (BriefingScript) jsou fixni promennou — specifikace je stejna pro vsechny behy. Polozky z context window management jsou infrastrukturni a resi je agentni framework (OpenCode).
