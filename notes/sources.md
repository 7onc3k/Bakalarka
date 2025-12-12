# Zdroje a Literatura

Tento seznam slouží jako podklad pro rešeršní část bakalářské práce. Zdroje jsou rozděleny do kategorií dle jejich role v textu.

## 1. Primární zdroje (Frameworky a Metodiky)

*   **GITHUB NEXT.** *Spec Kit: Spec-Driven Development for AI Agents* [online]. 2024 [cit. 2025-11-30]. Dostupné z: https://github.com/github/spec-kit
    *   *Klíčový zdroj pro koncept "Spec-Driven Development".*
*   **BMAD-CODE-ORG.** *BMAD METHOD: Breakthrough Method for Agile AI-Driven Development* [online]. GitHub, 2025 [cit. 2025-11-30]. Dostupné z: https://github.com/bmad-code-org/BMAD-METHOD
    *   *Metodika pro řízení AI agentů v agilním vývoji.*
*   **ANTHROPIC.** *Effective Harnesses for Long-Running Agents* [online]. Anthropic Engineering Blog, 2024 [cit. 2025-11-30]. Dostupné z: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
    *   *Technický popis problémů s dlouhodobou pamětí agentů.*
*   **METR.** *Model Evaluation and Threat Research* [online]. 2024 [cit. 2025-11-30]. Dostupné z: https://metr.org/
    *   *Standardy pro hodnocení bezpečnosti a schopností modelů.*

## 2. Odborné studie (State-of-the-Art ve výzkumu LLM)

### 2.1 Přehledové studie (Surveys) - LLM agenti v SE

*   **LIU, Junwei et al.** *Large Language Model-Based Agents for Software Engineering: A Survey* [online]. arXiv preprint arXiv:2409.02977. 2024 [cit. 2025-12-10]. Dostupné z: https://arxiv.org/abs/2409.02977
    *   *Komplexní přehled 106 prací o LLM agentech v SE, kategorizace z pohledu SE i agentů.*
*   **JIN, Haolin et al.** *From LLMs to LLM-based Agents for Software Engineering: A Survey of Current, Challenges and Future* [online]. arXiv preprint arXiv:2408.02479. 2024 [cit. 2025-12-10]. Dostupné z: https://arxiv.org/abs/2408.02479
    *   *Pokrývá requirements, code generation, testing, maintenance - celý SDLC.*
*   **Comprehensive Survey on Benchmarks and Solutions in Software Engineering of LLM-Empowered Agentic System** [online]. arXiv preprint arXiv:2510.09721. 2025 [cit. 2025-12-10]. Dostupné z: https://arxiv.org/html/2510.09721
    *   *Přes 150 paperů, taxonomie řešení a benchmarků.*
*   **A Survey on Code Generation with LLM-based Agents** [online]. arXiv preprint arXiv:2508.00083. 2025 [cit. 2025-12-10]. Dostupné z: https://arxiv.org/abs/2508.00083
    *   *Single-agent a multi-agent architektury, aplikace napříč SDLC.*

### 2.2 Agentic Software Engineering - Klíčové práce

*   **Agentic Software Engineering: Foundational Pillars and a Research Roadmap** [online]. arXiv preprint arXiv:2509.06216. 2025 [cit. 2025-12-10]. Dostupné z: https://arxiv.org/html/2509.06216v2
    *   *Přehodnocení SE pro spolupráci člověk-agent. Framework podobný SAE úrovním autonomie. Rozlišuje SE 2.0 (AI-augmented) vs SE 3.0 (Agentic SE).*
*   **AKBAR, Muhammad Azeem et al.** *Agentic AI in Software Engineering: Practitioner Perspectives Across the Software Development Life Cycle* [online]. SSRN. 2025 [cit. 2025-12-10]. Dostupné z: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5520159
    *   *Rozhovory s 21 experty, pokrývá celý SDLC. Zjištění: agenti redefinují hranice mezi fázemi SDLC.*
*   **Autonomous Agents in Software Development: A Vision Paper** [online]. Springer, 2024 [cit. 2025-12-10]. Dostupné z: https://link.springer.com/chapter/10.1007/978-3-031-72781-8_2
    *   *12 LLM agentů spolupracujících na celém SDLC.*

### 2.3 Evaluace a produktivita

*   **METR.** *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity* [online]. 2025 [cit. 2025-12-10]. Dostupné z: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
    *   *RCT studie: zkušení vývojáři s AI jsou o 19% pomalejší - překvapivé zjištění.*

### 2.4 Základní LLM studie

*   **JIMENEZ, Carlos E. et al.** *SWE-bench: Can Language Models Resolve Real-world Github Issues?* [online]. In: The Twelfth International Conference on Learning Representations (ICLR). 2024 [cit. 2025-11-30]. Dostupné z: https://arxiv.org/abs/2310.06770
    *   *Hlavní benchmark pro hodnocení schopností programovacích agentů.*
*   **LIU, Nelson F. et al.** *Lost in the Middle: How Language Models Use Long Contexts* [online]. arXiv preprint arXiv:2307.03172. 2023 [cit. 2025-11-30]. Dostupné z: https://arxiv.org/abs/2307.03172
    *   *Klíčová studie vysvětlující, proč pouhé zvětšení kontextového okna nestačí.*
*   **VASWANI, Ashish et al.** *Attention Is All You Need* [online]. Advances in Neural Information Processing Systems, 2017 [cit. 2025-11-30]. Dostupné z: https://arxiv.org/abs/1706.03762
    *   *Základní paper definující Transformer architekturu a mechanismus pozornosti (self-attention).*
*   **WEI, Jason et al.** *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models* [online]. Advances in Neural Information Processing Systems, 2022 [cit. 2025-11-30]. Dostupné z: https://arxiv.org/abs/2201.11903
    *   *Základ pro techniky prompt engineeringu používané v práci.*

## 3. Teorie Softwarového Inženýrství a Architektury

*   **RICHARDS, Mark a FORD, Neal.** *Fundamentals of Software Architecture: An Engineering Approach*. O'Reilly Media, 2020. ISBN 978-1492043454.
    *   *Moderní přehled architektonických stylů a charakteristik ("ilities").*
*   **FOWLER, Martin.** *Patterns of Enterprise Application Architecture*. Addison-Wesley Professional, 2002. ISBN 978-0321127426.
    *   *Katalog základních návrhových vzorů pro podnikové aplikace.*
*   **KHONONOV, Vlad.** *Learning Domain-Driven Design: Aligning Software Architecture and Business Strategy*. 1. vyd. O'Reilly Media, 2021. ISBN 978-1098100131.
    *   *Definuje pojmy jako "Bounded Context" a "Ubiquitous Language", které jsou analogií pro kontext LLM.*
*   **ISO/IEC.** *ISO/IEC/IEEE 42010:2011 Systems and software engineering — Architecture description*. 2011.
    *   *Mezinárodní standard definující základní pojmy popisu architektury.*
*   **IEEE COMPUTER SOCIETY.** *SWEBOK: Guide to the Software Engineering Body of Knowledge*. Version 3.0. IEEE, 2014. Dostupné z: https://www.swebok.org/
    *   *Standardní taxonomie softwarového inženýrství.*
*   **BROWN, Simon.** *The C4 model for visualising software architecture* [online]. 2024 [cit. 2025-11-30]. Dostupné z: https://c4model.com/
    *   *Metodika pro hierarchický popis architektury, vhodná pro strojové zpracování.*
*   **ARC42.** *arc42 Template for Software Architecture Documentation* [online]. 2024 [cit. 2025-11-30]. Dostupné z: https://arc42.org/
    *   *Pragmatická šablona pro strukturování architektonické dokumentace.*

## 4. Další zdroje (Historický kontext a Procesy)

*   **NATO SCIENCE COMMITTEE.** *Software Engineering: Report on a conference sponsored by the NATO Science Committee*. Garmisch, Germany, 1968.
    *   *Historický kontext vzniku disciplíny.*
*   **KAUR, Rupinder a SENGUPTA, Jyotsna.** *Software Process Models and Analysis on Failure of Software Development Projects*. In: arXiv preprint arXiv:1306.1068. 2013.
