# 24 — Reading list: co číst z thesis/sources/

**Kontext:** V sources/ je 100+ zdrojů. Tady je prioritizovaný seznam co skutečně přečíst vs. jen citovat.

## Vzorové práce (struktura, ne obsah)

Stažené v `docs/vzorove-prace/`:

- **Gregor & Hevner 2013** — "Positioning and Presenting DSR for Maximum Impact" (26 stran) — jak strukturovat DSR práci, Tabulka 2 = checklist sekcí
- **Offermann et al. 2009** — "Outline of a DSR Process" (11 stran) — kompaktní DSR flowchart, model pro kap03
- **Runeson & Höst 2009** — "Guidelines for Case Study Research in SE" (47 stran) — checklist pro case study reporting (Tabulka 6), ověřit kap04 proti tomu
- **Venable 2016** (FEDS) — nestažen (paywall), stáhnout přes ResearchGate login nebo VŠE knihovnu

Tyto NEINDEXOVAT do RAG — jsou vzory pro strukturu psaní, ne zdroje k citování.

## Tier 1 — Přečíst celé (jádro argumentace BP)

| Paper | Proč |
|-------|------|
| `lulla-2026-agents-md-impact.pdf` | Přímo o AGENTS.md, -28.6% runtime. Nejbližší related work. |
| `gloaguen-2025-evaluating-agents-md.pdf` | Hodnocení AGENTS.md — přímá evidence že instrukce mají vliv. |
| `swe-bench-2024.pdf` | Benchmark proti kterému arguješ (měří jen výsledek). Musíš vědět co měří a co ne. |
| `hevner-2004-design-science-is-research.pdf` | Tvoje metodologie. Guidelines 1-7, build-evaluate cyklus. |
| `papadakis-2019-mutation-testing-survey.pdf` | Teoretický základ pro Q3 (mutation score). |
| `shin-2025-prompt-vs-finetuning.pdf` | Evidence že instrukce fungují — podpírá motivaci BP. |

## Tier 2 — Přečíst klíčové sekce (podpůrné argumenty)

| Paper | Co z toho potřebuješ |
|-------|---------------------|
| `llm-as-judge-survey-2024.pdf` | Metodologie LLM-as-judge, biasy, škálování — základ pro P2/Q8. |
| `razavi-2025-prompt-sensitivity.pdf` | Prompt sensitivity = hlavní omezení BP. Přečti findings. |
| `liu-2025-agentic-se-benchmarks-survey.pdf` | Přehled benchmarků — artikulace gapu (co chybí). |
| `context-engineering-survey-2025.pdf` | Kontextové inženýrství jako emerging field — zarámování kap02. |
| `jin-2024-llm-agents-swe-survey.pdf` | Přehled agentů v SWE — základ pro sekci 2.2. |
| `confucius-scaffold-ablation-2025.pdf` | Ablační studie scaffoldingu — relevantní pro experimentální design. |

## Tier 3 — Proletět abstrakt + conclusions (citace, ne čtení)

| Paper | Na co |
|-------|-------|
| `rosa-2026-spec-driven-codegen.pdf` | Spec-driven development — related work |
| `breunig-2025-fighting-the-weights.html` | System prompts a agent behavior — kap02.3 |
| `breunig-2026-system-prompts-agent-behavior.html` | Dtto |
| `ace-agentic-context-engineering-2025.pdf` | Context engineering framework |
| `structured-context-engineering-2026.pdf` | Dtto |
| `failed-agent-prs-msr-2026.pdf` | Evidence že agenti selhávají — motivace v kap01 |

## Doporučený postup

1. Začít Tier 1 — 6 paperů, většina 10-15 stran
2. Lulla + Gloaguen první (přímo o tom co děláš)
3. SWE-bench abys věděl proti čemu arguješ
4. Hevner pro metodologii (pokud ještě nečteno)
5. Tier 2 průběžně podle toho na které kapitole pracuješ
