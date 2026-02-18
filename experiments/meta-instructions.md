# Meta-instrukce pro ablační experiment

Šablona: CÍL/KONTEXT/VÝSTUP/OMEZENÍ
(z FSE 2025 "From Prompts to Templates": Directive 87%, Context 56%, Output 40%, Constraints 36%)

## P — Planning/Design (technický design)

```
[CÍL]: Navrhni architekturu řešení před implementací — datové typy,
       moduly, rozhraní mezi nimi.
[KONTEXT]: Upfront design decisions zabraňují ad-hoc rozhodnutím
       během kódování. Bez explicitního designu vzniká
       nekonzistentní struktura kterou je těžké refaktorovat.
[VÝSTUP]: Design decisions zaznamenané v GitHub issues — typy,
       moduly, API contracts, návrhové vzory.
[OMEZENÍ]: Nezačínej psát implementační kód dokud nemáš
       zdokumentovaný design. Neskákej rovnou na kód.
```

Literární opora:
- Brooks 1975: architecture/implementation/realization jako distinct phases
- Clean Code (Martin): "good upfront design ≠ BDUF"
- Perry & Wolf 1992: software architecture foundations
- Fighting the weights: code-first bias (modely skáčou rovnou na implementaci)

## O — Organization (organizace práce)

```
[CÍL]: Zorganizuj si práci — rozděl specifikaci na menší části
       s jasnými dependencies, definuj kdo co dělá, nastav
       testovací strategii (testy ze specifikace před implementací).
[KONTEXT]: Feature-level úlohy mají výrazně nižší úspěšnost než
       izolované sub-úlohy. Separace testování od implementace
       zabraňuje tomu, aby testy validovaly chybné chování místo
       jeho odhalení. Explicitní proces zajišťuje konzistenci.
[VÝSTUP]: Sub-issues v GitHub s dependencies, definice rolí/agentů,
       workflow pravidla v AGENTS.md.
[OMEZENÍ]: Neimplementuj celý projekt v jednom průchodu.
       Neodvozuj expected values testů z kódu — vždy ze specifikace.
       Nedělej procesní rozhodnutí ad-hoc.
```

Literární opora:
- FeatureBench 2026: 11% na feature-level úlohách
- SWE-EVO 2025: 21% na multi-issue evolučních úlohách
- Mathews 2024: test oracle problem — 68.1% testů validuje chybné chování
- AgentCoder 2024: separace test/impl → 96.3% HumanEval
- Wang 2024: 59.7% SE agentů je multi-agent
- Beck & Fowler 2000: "dependencies dominate planning"
- Fighting the weights: monolithic bias + self-validation bias

## Q — Quality (quality infrastruktura)

```
[CÍL]: Nastav si quality feedback mechanismy — linting, formátování,
       testy, CI pipeline, případně mutation testing.
[KONTEXT]: Automatizované quality gates zachytí problémy dříve než
       manuální review. Bez nich se chyby kumulují a agent nemá
       feedback jestli jeho kód funguje správně.
[VÝSTUP]: Nakonfigurované nástroje — linter, formatter, test runner,
       CI pipeline s automatickými kontrolami.
[OMEZENÍ]: Neimplementuj business logiku bez funkčních quality gates.
       Nepřeskakuj konfiguraci nástrojů "protože to jde i bez nich."
```

Literární opora:
- Papadakis 2019: mutation score silnější prediktor než coverage
- Meta 2025 (Harman): 70% mutantů neodhaleno i při plném coverage
- Lulla 2026: AGENTS.md s konvencemi → -28% runtime, -20% tokens
- Fighting the weights: get-it-done bias (modely přeskakují setup)

---

## Fixní hlavička (stejná pro všechny běhy)

Obsahuje:
- Role definition (jsi coding agent, implementuješ podle specifikace)
- Tool instructions (jak používat GitHub, git, OpenCode nástroje)
- Output format (jak reportovat výsledky)
- Fighting-the-weights instrukce (nepřidávej komentáře, paralelní tool calls, etc.)
- Reference na spec issue #1

## Ablační běhy

| Run | P | O | Q | Co měříme |
|-----|---|---|---|-----------|
| R0  | ✓ | ✓ | ✓ | Baseline — plný meta-prompt |
| R1  | - | ✓ | ✓ | Přínos design instrukce |
| R2  | ✓ | - | ✓ | Přínos organizační instrukce |
| R3  | ✓ | ✓ | - | Přínos quality instrukce |

## Zdůvodnění výběru dimenzí

Tři dimenze vychází ze systematické analýzy:
1. SASE framework (Hassan 2025): BriefingScript (fixed) + LoopScript → O + MentorScript/AEE → Q + architectural → P
2. Wang 2024 agent taxonomy: Team Organization → O, Decision Making → P, Testing/QA → Q
3. Breunig 2026 common categories: workflow guidance (P+O), model calibration (fixed)
4. Independence: P, O, Q operují na různých úrovních (co stavět / jak pracovat / čím kontrolovat)
5. Pozorovatelnost: každá produkuje distinktní artefakty

Korelované proměnné (M1-M5) byly sloučeny do O na základě:
- Decomposition, role separation, workflow, TDD jsou facety organizace práce (What/Who/How/When)
- Nejsou nezávislé — agent který dekomponuje dobře typicky i separuje role
- RepairAgent (Bouzenia 2025) abloval funkčně nezávislé komponenty — náš design to respektuje
