# Návrh struktury Bakalářské práce

**Téma:** Metodika řízení autonomních AI agentů v softwarovém inženýrství
**Pracovní název:** Framework pro governance a orchestraci LLM agentů při vývoji webových aplikací
**Student:** [Tvé Jméno]

---

## Anotace (Abstract)
Práce se zabývá problematikou spolehlivosti a řiditelnosti (Governance) autonomních AI agentů v procesu vývoje softwaru. Současné přístupy trpí stochastickou povahou LLM modelů, což vede k nekonzistentním výsledkům a "halucinacím". Cílem práce je navrhnout a ověřit metodiku řízení založenou na principech Stigmergie a Design by Contract. Praktická část ověřuje tento framework na experimentu implementace backendové specifikace "RealWorld App", kde porovnává úspěšnost a efektivitu řízeného vs. neřízeného agenta.

---

## Osnova práce

### 1. Úvod
*   1.1 Kontext: Posun od AI jako "Copilota" (nápověda) k AI jako "Agentovi" (autonomní práce).
*   1.2 Problém: "Tragedy of the Commons" v kódu – nekontrolovaní agenti generují technický dluh a bezpečnostní rizika.
*   1.3 Cíle práce: Navrhnout governance framework a změřit jeho dopad na kvalitu výstupu.

### 2. Teoretická východiska (State of the Art)
*   2.1 **Large Language Models v SE:** Aktuální schopnosti a limity (Context window, Reasoning, Hallucinations).
*   2.2 **Software Engineering Management:**
    *   Tradiční modely: CMMI (Maturity Levels), ITIL (Incident Management).
    *   Proč tradiční Agile/Scrum na agenty nefunguje (chybí sociální kontext).
*   2.3 **Teoretické koncepty řešení:**
    *   **Stigmergie:** Koordinace prostřednictvím modifikace prostředí (inspirace z biologie/termistů).
    *   **Design by Contract:** Formální definice vstupů a výstupů jako obrana proti neurčitosti.

### 3. Návrh metodiky (Governance Framework)
*   *Tato kapitola představuje vlastní přínos práce – teoretický model.*
*   3.1 **Architektura Frameworku:**
    *   Vrstva Koordinace (Filesystem structure, Rules).
    *   Vrstva Kontroly (Lintery, Testy jako bariéry).
*   3.2 **Definice "Governed Agenta":** Jak se liší prompt/instrukce pro řízeného agenta oproti standardnímu.

### 4. Praktická implementace (Experiment)
*   4.1 **Design experimentu:**
    *   **Cílová úloha:** Implementace backendu "RealWorld App" (klon Medium.com) podle OpenAPI specifikace.
    *   **Technologie:** Bun, Hono, TypeScript, PostgreSQL.
*   4.2 **Realizace testovacího prostředí (The Harness):**
    *   Popis vyvinutého nástroje pro automatizované spouštění, testování a měření agentů.
*   4.3 **Průběh experimentu:**
    *   Scénář A: Baseline (Agent bez frameworku).
    *   Scénář B: Governed (Agent s frameworkem).

### 5. Vyhodnocení a Diskuze
*   5.1 **Kvantitativní výsledky:**
    *   Úspěšnost (Pass Rate integračních testů).
    *   Efektivita (Počet iterací nutných k opravě chyby).
    *   Náklady (Spotřeba tokenů).
*   5.2 **Kvalitativní analýza:**
    *   Rozbor kódu vygenerovaného v obou scénářích (udržitelnost, čistota).
*   5.3 **Omezení práce:** Na co framework zatím nestačí.

### 6. Závěr
*   Shrnutí přínosu: Governance není brzdou, ale nutnou podmínkou pro autonomii.

---

## Klíčová literatura (Předběžná)
*   Výzkumy o limitech LLM v plánování (Reasoning capabilities).
*   Publikace o Stigmergii v multi-agentních systémech.
*   Standardy CMMI a ITIL.

---

## Realizační plán (LaTeX Kostra)

Cílem je připravit zdrojové soubory v LaTeX šabloně VŠE tak, aby odrážely výše uvedenou osnovu a bylo možné do nich začít psát.

**Kroky:**
1.  **Metadata (`prace.tex`):** Doplnit Název, Abstrakt (CZ/EN) a Klíčová slova podle návrhu.
2.  **Struktura souborů:**
    *   Přejmenovat/Vytvořit soubory `kap01.tex` až `kap06.tex`.
    *   Upravit `prace.tex` (hlavní soubor), aby tyto kapitoly načítal (`\include{kapXX}`).
3.  **Obsah kapitol:**
    *   Do každého souboru `kapXX.tex` vložit nadpis (`\chapter{...}`) a strukturu podkapitol (`\section{...}`) s krátkými poznámkami (bullet points) o tom, co tam má být.
4.  **Kompilace:**
    *   Ověřit, že lze projekt zkompilovat (např. přes Overleaf nebo lokální `pdflatex`).
    *   Výsledné PDF slouží jako podklad pro konzultaci s vedoucím.
