# Integrace agentních systémů v softwarovém inženýrství

## Motivace

Studie společnosti METR.ORG ukazuje, že LLM zkušené vývojáře spíše zpomaluje. S rychlým vývojem schopností modelů se situace pravděpodobně mění. Ale to neznamená, že je LLM samo o sobě dostatečné k vypracování dlouhotrvajících úkolů. Není to problém pouze LLM, když projekt roste, bývá těžší jej rozšiřovat jak pro člověka, tak i pro LLM. AI programování tenhle problém ještě více prohlubuje. Vývojáři přicházejí o kontext a hlubokou znalost kódové základny (codebase), zatímco velké jazykové modely (LLM) jsou limitovány omezenou pamětí (context window). Jak nastavit harness/scaffolding tak, aby v tom mohli fungovat agenti a lidé to stále měli pod kontrolou?

## Cíle práce

1. Jaká je taxonomie řízení SWE projektů obecně?
2. Jak se řízení SWE mění v kontextu agentních systémů?
3. Co je součástí efektivního harness/scaffolding pro agentní systémy a co je naopak nadbytečné?

## Metodika

1. Rešerše zdrojů k pochopení řízení SWE projektů a současných přístupů k integraci agentních systémů.
2. Návrh a implementace experimentálního prostředí s využitím dostupných nástrojů.
3. Spuštění experimentů s definovanými scénáři.
4. Analýza a interpretace výsledků.

## Vymezení rozsahu

Práce se zaměřuje na:
- Celý SDLC na jednoduchém projektu
- Konfigurace a použití existujících nástrojů (GitHub, CLI agents)

Práce se nezaměřuje na:
- Programování nových nástrojů od nuly
- Testování různých LLM modelů
- Testování různých programovacích jazyků
- Vývoj produkčního nástroje/produktu

## Literatura

*   **BMAD-CODE-ORG.** *BMAD METHOD: Breakthrough Method for Agile AI-Driven Development* [online]. GitHub, 2025 [cit. 2025-11-30]. Dostupné z: https://github.com/bmad-code-org/BMAD-METHOD
*   **Agentic Software Engineering: Foundational Pillars and a Research Roadmap** [online]. arXiv preprint arXiv:2509.06216. 2025 [cit. 2025-12-10]. Dostupné z: https://arxiv.org/abs/2509.06216
*   **IEEE COMPUTER SOCIETY.** *SWEBOK: Guide to the Software Engineering Body of Knowledge*. Version 3.0. IEEE, 2014. Dostupné z: https://www.swebok.org/
*   **LIU, Junwei et al.** *Large Language Model-Based Agents for Software Engineering: A Survey* [online]. arXiv preprint arXiv:2409.02977. 2024 [cit. 2025-12-10]. Dostupné z: https://arxiv.org/abs/2409.02977
*   **METR.** *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity* [online]. 2025 [cit. 2025-12-10]. Dostupné z: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
