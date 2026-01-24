# Návrh a testování běhových prostředí pro autonomni coding agenty v softwarovém vývoji

## Motivace

Studie společnosti METR.ORG ukazuje, že LLM zkušené vývojáře spíše zpomaluje. S rychlým vývojem schopností modelů se situace pravděpodobně mění. Ale to neznamená, že je LLM samo o sobě dostatečné k vypracování dlouhotrvajících úkolů. Není to problém pouze LLM, když projekt roste, bývá těžší jej rozšiřovat jak pro člověka, tak i pro LLM. AI programování tenhle problém ještě více prohlubuje. Vývojáři přicházejí o kontext a hlubokou znalost kódové základny (codebase), zatímco velké jazykové modely (LLM) jsou limitovány omezenou pamětí (context window). Jak nastavit harness/scaffolding tak, aby v tom mohli fungovat agenti a lidé to stále měli pod kontrolou?

## Cíle práce

1. Popsat jak se řízení SWE projektů mění v kontextu agentních systémů (teoretický rámec)
2. Navrhnout a implementovat experimentální prostředí (case study: Billing Reminder Engine)
3. Prozkoumat vliv různých nastavení scaffoldingu na schopnost agenta provést kvalitní práci
4. Identifikovat jaký kontext je pro agenty klíčový a jak instrukce/procesy ovlivňují schopnost agenta tento kontext vytvářet a využívat

## Metodika

### Fáze 1: Teoretický rámec
- Rešerše taxonomie řízení SWE projektů (SWEBOK, odborná literatura)
- Rešerše současných přístupů k AI agentům v SE (arxiv papers)
- Rešerše spec-driven development jako přístupu pro agentní vývoj (BMAD, OpenSpec, SpecKit a další)
- Rešerše metrik pro hodnocení připravenosti prostředí pro agenty

### Fáze 2: Referenční implementace
- Vlastní vývoj Billing Reminder Engine se všemi náležitostmi SWE:
  - Specifikace a dokumentace
  - Implementace (TypeScript)
  - Testy (unit, integration)
  - Git workflow (issues, commits, PR conventions)
  - Quality gates (linting, type checking)
- Tato implementace slouží jako "ground truth" pro porovnání

### Fáze 3: Experimenty
- Příprava různých nastavení scaffoldingu pro agenty:
  - Instrukce a procesy (jak má agent postupovat)
  - Git automatizace a skripty
  - Kontext který má agent k dispozici a který si vytváří
  - Nastavení odvozená z literatury a spec-driven development přístupů
- Spuštění agentů s různými nastaveními scaffoldingu na stejném zadání
- Zaznamenání průběhu a výstupů

### Fáze 4: Analýza
- Měření výstupů proti referenční implementaci:
  - **Completeness**: Kolik požadované funkcionality agent dokončil
  - **Quality**: Jaká je kvalita výstupu? (konkrétní metriky budou upřesněny na základě rešerše)
  - **Transparentnost**: Jsou artefakty strukturované a dohledatelné? Může člověk porozumět co agent udělal a proč? (issues, dokumentace, code review, commit messages)
- Identifikace vzorů - která nastavení scaffoldingu vedla k lepším výsledkům

**Poznámka k metodologii měření:** Konkrétní metriky pro hodnocení výstupu agentů jsou aktivní oblast výzkumu. V rámci práce bude provedena dodatečná rešerše dostupných akademických přístupů.

## Vymezení rozsahu

### Práce se zaměřuje na:
- Celý SDLC na jednoduchém projektu (Billing Reminder Engine)
- Nastavení a použití existujících nástrojů (GitHub, CLI agents)
- Exploratory case study - hledání vzorů a doporučení

### Práce se nezaměřuje na:
- Programování nových nástrojů od nuly
- Porovnávání různých LLM modelů
- Porovnávání různých programovacích jazyků
- Vývoj produkčního nástroje/produktu
- Statisticky signifikantní závěry (omezený počet běhů)

## Očekávané výstupy

1. **Teoretický rámec**: Popis jak se SDLC mění s AI agenty, role scaffoldingu
2. **Referenční implementace**: Billing Reminder Engine s dokumentací a všemi SWE náležitostmi
3. **Experimentální data**: Záznamy z běhů agentů s různými nastaveními scaffoldingu
4. **Analýza a doporučení**: Jaký scaffolding vede ke kvalitní práci agenta a umožňuje člověku porozumět výstupům

## Výběr projektu pro case study

### Požadavky na projekt

Práce se zaměřuje na řízení a scaffolding - jde více do šířky než do hloubky. Proto potřebujeme menší projekt, na kterém můžeme spustit více běhů s různými nastaveními scaffoldingu a měřit výsledky.

Pro experiment potřebujeme projekt který:
- **Hard logic** - jasná business pravidla, ne subjektivní výstupy (např. generování textu)
- **Jasné invarianty** - deterministické chování, matematicky ověřitelné správnost
- **Testovatelné** - lze objektivně měřit kvalitu výstupu
- **Přiměřená velikost** - menší projekt umožňuje více experimentálních běhů
- **Reálný use case** - prakticky využitelné, ne umělý příklad

### Billing Reminder Engine

Systém pro automatické připomínky nezaplacených faktur a správu dunning flow. Obsahuje:
- State machine pro stavy faktur
- Časové výpočty (business days, grace periods)
- Eskalační pravidla
- Scheduling připomínek

| Požadavek | Splnění |
|-----------|---------|
| Hard logic | State machine, časové výpočty, business days |
| Jasné invarianty | Deterministické, matematicky ověřitelné |
| Testovatelné | Lze objektivně měřit kvalitu výstupu |
| Přiměřená velikost | Menší projekt, umožňuje více běhů |
| Reálný use case | Prakticky využitelné (integrace do DigitalFusion) |

## Literatura

### Akademické zdroje
- **IEEE COMPUTER SOCIETY.** *SWEBOK: Guide to the Software Engineering Body of Knowledge*. Version 3.0. IEEE, 2014. Dostupné z: https://www.swebok.org/
- **LIU, Junwei et al.** *Large Language Model-Based Agents for Software Engineering: A Survey*. arXiv:2409.02977. 2024.
- **Agentic Software Engineering: Foundational Pillars and a Research Roadmap**. arXiv:2509.06216. 2025.

### Industry zdroje
- **METR.** *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*. 2025. Dostupné z: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- **BMAD-CODE-ORG.** *BMAD METHOD: Breakthrough Method for Agile AI-Driven Development*. GitHub, 2025.

### K doplnění (rešerše měření agentů)
- Metriky pro hodnocení AI-generovaného kódu
- Mutation tesing literatura
- Case study metodologie

---

*Verze: V4.1 (2025-01-23)*
*Status: Draft pro konzultaci s vedoucím*
