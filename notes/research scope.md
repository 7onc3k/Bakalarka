# Bakalářská Práce: Rámec (Verze 0.1 - Živý Dokument)

## 1. Problém a Motivace

### Problém (CO je špatně?)
* Klíčovým problémem je **fundamentální nesoulad** mezi přirozeností LLM agentů a požadavky **profesionálního softwarového inženýrství (SWE)**. Agenti jsou ze své podstaty **probabilistické** systémy – jsou kreativní, ale jejich chování a výstupy nejsou plně předvídatelné. Naopak, **profesionální softwarové systémy** musí být vysoce **deterministické** – tedy spolehlivé, stabilní, auditovatelné a kontrolovatelné.
* Pokud agentovi chybí jasná pravidla ("plot"), jeho kreativita vytváří **nepředvídatelný chaos**: rozsah dopadu (impact scope) jeho změn je příliš velký, což znemožňuje efektivní kontrolu, validaci a měření skutečného přínosu.
* **Problémem tedy je: Jak "ukotvit" probabilistický systém (agenta) a vnést do něj potřebnou míru determinismu (pomocí pravidel, specifikací a validací), aby jeho přínos byl nejen velký, ale také měřitelný, kontrolovatelný a spolehlivý?**

### Motivace (PROČ to řešit?)
* Motivací je, že pokud tento problém vyřešíme – pokud najdeme způsob, jak agenty "zkrotit" a dát jim efektivní pravidla – **odemkneme bezprecedentní nárůst produktivity** při vývoji a údržbě software.
* Není to jen o zrychlení; je to o tom, že budeme moct tuto novou sílu **bezpečně a spolehlivě** nasadit na **jakýkoli komplexní softwarový projekt**, aniž bychom obětovali stabilitu a kvalitu.

---

## 2. Cíl Práce a Výzkumné Otázky (Co?)

### Hlavní cíl
* Hlavním cílem práce je **provedením rešerše a klasifikace identifikovat** klíčové **informační artefakty** (jako jsou datové kontrakty, mapy kódu, konvence), které slouží jako efektivní 'plot' pro LLM agenty. Následně **empiricky ověřit** (pomocí kontrolovaného experimentu), která kombinace těchto artefaktů má nejlepší **měřitelný dopad** (na úspěšnost, **patch churn** a počet iterací) a nejlépe tak řeší problém nesouladu mezi probabilistickým agentem a deterministickým SWE.

### Výzkumné Otázky (RQ)
- **RQ1 (Klasifikace):** Jak lze klasifikovat klíčové informační artefakty (terminologii, kontrakty, konvence) podle jejich role při "ukotvení" LLM agenta? _(Tato otázka zůstává. Je to ta naše Fáze 0 Rešerše, která nám dá "přísady" pro experiment.)_


- **RQ2 (Minimální kontext):** Jaká je **minimální sada** informačních artefaktů (např. jen popis úkolu + failing test), která je nutná k produkci **použitelného** (test-passing) výstupu? A jaké jsou kvalitativní nedostatky tohoto minimálního výstupu (např. vysoký _patch churn_, ignorování konvencí)?


- **RQ3 (Optimální kontext / Zlatý střed):** Jaký je **optimální "zlatý střed"** detailu kontextu, který nejlépe vyvažuje přínos (vysoká úspěšnost, nízký _patch churn_) a náklady (čas na přípravu)? A které informace, přidané nad rámec minima, se ukázaly jako **nadbytečné** (agent si je dokázal efektivně odvodit sám)?


- **RQ4 (Analýza rizik a selhání):** Jaké specifické situace (např. chybějící datový kontrakt, nejasná mapa kódu, víceznačná terminologie) nejčastěji vedou k **selhání agenta** (např. bezpečnostní díra, porušení architektury, katastrofální chyba)?

---

## 3. Teoretický Rámec (Fáze 0: Rešerše)

* **Analýza nositelů informací (Terminologie):**
    * [Zde doplnit: Např. "Systémová analýza (Thinking in Systems)", "DDD - Ubiquitous Language"]
* **Standardy pro specifikace (Primitiva):**
    * [Zde doplnit: Např. "Datové kontrakty (OpenAPI, JSON Schema)", "Architektonické záznamy (ADRs, C4 Model)"]
* **Existující Spec-Driven Frameworky (Inspirace):**
    * [Zde doplnit: Např. "GitHub Spec-Kit", "BMAD"]
* **IT Governance (Zarámování procesu):**
    * [Zde doplnit: Např. "ITIL Change Enablement"]
* **Metodiky měření LLM (Inspirace pro metriky):**
    * [Zde doplnit: Např. "SWE-Bench", "METR"]

---

## 4. Metodika Experimentu (Jak?)

### Design Experimentu
* [Zde doplnit: Např. "Kvantitativní experiment porovnávající výkon LLM agenta na sadě úloh při použití různých 'informačních balíčků' (receptů)."]

### Fixní Proměnné (Co se nemění)
* **LLM Model:** [Zde doplnit: Např. GPT-4o]
* **Nástroje Agenta:** [Zde doplnit: Např. Přístup k souborům, spouštění testů, ...]

### Nezávislé Proměnné (Co měním - "Recepty")
* **Balíček A (Minimum):** [Zde doplnit: Např. Popis úkolu + Failing Test]
* **Balíček B (Data-Focus):** [Zde doplnit: Např. Balíček A + Datové kontrakty (OpenAPI, DB Schéma)]
* **Balíček C (Arch-Focus):** [Zde doplnit: Např. Balíček A + Mapa kódu + Konvence]
* **(Volitelně) Balíček D:** [Zde doplnit...]

### Dataset Úloh (Na čem měřím)
* **Greenfield (Testbed):** [Zde doplnit: Např. "6 úloh ve vlastním mini-repo (TypeScript, 1 DB tabulka)"]
* **Brownfield (OSS Replay):** [Zde doplnit: Např. "6 bug fixů replikovaných z existujících OSS projektů (např. Vite, NestJS)"]

### Závislé Proměnné (Co měřím - Metriky)
1.  **Úspěšnost:** [Zde doplnit: Např. Ano / Ne (prošly všechny testy?)]
2.  **Kvalita:** [Zde doplnit: Např. Patch Churn (% zbytečných změn kódu)]
3.  **Efektivita:** [Zde doplnit: Např. Počet iterací / pokusů agenta]

---

## 5. Vymezení Rozsahu (Co NEBUDU dělat)

* [Zde doplnit: Např. "Práce nebude porovnávat různé LLM modely (GPT vs. Claude)."]
* [Zde doplnit: Např. "Práce nebude porovnávat celé frameworky (Spec-Kit vs. BMAD)."]
* [Zde doplnit: Např. "Práce nebude stavět velký ERP systém."]
* [Zde doplnit: Např. "Práce nebude řešit celý ITIL proces, pouze technickou část implementace."]
* [Zde doplnit: Např. "Práce nebude testovat každé 'primitivum' zvlášť, ale pouze ucelené 'balíčky'."]

---

## 6. Očekávané Výstupy a Přínos

### Očekávané Výstupy
1.  [Zde doplnit: Např. "Taxonomie 'informačních primitiv' (výsledek Fáze 0 Rešerše)."]
2.  [Zde doplnit: Např. "Repozitář s 'Evaluačním Harnessem' (skripty, dataset úloh, 'balíčky')."]
3.  [Zde doplnit: Např. "Analýza výsledků s doporučením, která 'informační nádoba' má největší přínos."]

### Přínos
* [Zde doplnit: Např. "Poskytnutí daty podloženého doporučení pro SW týmy, jak strukturovat specifikace pro efektivní spolupráci s LLM agenty."]