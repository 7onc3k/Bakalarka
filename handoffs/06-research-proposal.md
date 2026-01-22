# Research Proposal: AI Agent Governance Framework
**Datum:** 2026-01-19
**Typ:** Návrh výzkumu pro Bakalářskou práci (Design Science Research)
**Status:** Schváleno k realizaci.

---

## 1. Motivace a Problém

S nástupem LLM (Large Language Models) se software engineering posouvá od "psaní kódu" k "řízení agentů".
Současné přístupy k autonomním agentům (např. AutoGPT, Devin) vykazují vysokou chybovost, neschopnost udržet kontext a tendenci k "halucinacím" při složitějších úlohách.

**Core Problem:** Chybí formalizovaný rámec (Governance Framework), který by umožnil spolehlivé a měřitelné nasazení autonomních agentů v produkčním vývoji softwaru.

---

## 2. Výzkumné Otázky (Research Questions)

Cílem práce není jen "něco vyrobit", ale odpovědět na tyto otázky:

*   **RQ1 (Gap Analysis):** Jaká jsou specifická omezení LLM agentů, která brání jejich spolehlivosti v dlouhodobých úlohách?
*   **RQ2 (Theoretical Transfer):** Které principy z tradičního softwarového inženýrství (CMMI, ITIL) a distribuovaných systémů (Stigmergy) lze adaptovat pro řízení AI?
*   **RQ3 (Artefact Utility):** Zvýší aplikace navrženého "Governance Frameworku" měřitelně úspěšnost agenta při implementaci standardizované specifikace (RealWorld App)?

---

## 3. Metodologie (Design Science Research)

Postupujeme cyklem DSR:

1.  **Explication of Problem:** Definice mezer v současných "agentic" frameworcích (LangChain, AutoGen).
2.  **Design & Development:**
    *   Návrh teoretického modelu (Framework).
    *   Vývoj testovacího prostředí (**The Harness**).
3.  **Demonstration (Experiment):**
    *   Úloha: Implementace backendu "RealWorld App" (Medium clone).
    *   Subjekt: AI Agent (např. Claude 3.5 Sonnet).
    *   Proměnná: Míra řízení (Unmanaged vs. Managed).
4.  **Evaluation:** Kvantitativní vyhodnocení metrik.

---

## 4. Experimentální Design (The Laboratory)

Místo subjektivního hodnocení využijeme průmyslový standard.

### Cílová Aplikace (The Subject)
*   **Specifikace:** RealWorld Backend (OpenAPI/Swagger).
*   **Tech Stack:** Bun, Hono, Drizzle ORM, PostgreSQL.
*   **Proč RealWorld:** Poskytuje fixní, objektivní cíl. Agent buď specifikaci splní, nebo ne.

### Měřící Nástroj (The Harness)
Nebudeme používat externí nástroje (Postman), ale vyvineme vlastní **Test Runner & Linter** v TypeScriptu/Bun.

*   **Funkce:**
    1.  **Context Injection:** Předává agentovi zadání a pravidla.
    2.  **Verification:** Spouští integrační testy proti API agenta.
    3.  **Static Analysis:** Kontroluje kvalitu kódu (typová bezpečnost, architektura).
    4.  **Logging:** Zaznamenává každý krok, chybu a cenu (tokeny).

### Scénáře
*   **Baseline (Control Group):** Agent dostane pouze OpenAPI specifikaci. Bez dalších instrukcí.
*   **Experimental (Treatment Group):** Agent dostane specifikaci + Governance Framework (SOP, Kontrakty, Stigmergy structure).

---

## 5. Metriky Úspěchu

Jak změříme, zda Framework funguje?

1.  **Functional Correctness:** % splněných testů z RealWorld specifikace.
2.  **Efficiency:** Počet iterací (pokusů) nutných k vyřešení endpointu.
3.  **Cost:** Náklady na tokeny (Input/Output).
4.  **Code Quality:** Počet linting errorů, dodržení architektury (Check: "Použil Drizzle správně?").

---

## 6. Roadmapa (Co dělat teď)

1.  **Literature Review (RQ1 & RQ2):** Najít zdroje potvrzující problémy agentů (Context drift, Planning fallacy).
2.  **Build the Harness (RQ3):**
    *   Založit `experiments/realworld-lab`.
    *   Napsat sadu testů pro první endpoint (např. `POST /api/users/login`).
3.  **Run Baseline:** Pustit agenta "na volno" a změřit selhání.
4.  **Design Framework:** Sepsat pravidla (Prompty/Config).
5.  **Run Experiment:** Pustit agenta "pod dohledem" a změřit úspěch.
