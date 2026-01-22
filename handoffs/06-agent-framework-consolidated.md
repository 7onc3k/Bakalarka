# Konsolidovaný Rámec: Agent Governance & Operating Framework
**Datum:** 2026-01-19
**Status:** Finální zadání pro Bakalářskou práci a Praktický projekt.
**Kontext:** Syntéza teorie (Stigmergy, ITIL, CMMI) a praktického experimentu (RealWorld App).

---

## 1. Motivace: The "Why" (Filosofický přesah)

### Tragedy of the Commons (Tragédie obecní pastviny)
Současný stav AI ("Level 1") směřuje k zahlcení digitálního prostoru nekvalitním, halucinovaným a nebezpečným obsahem/kódem.
*   **Pastvina:** Internet, firemní codebase, open-source repozitáře.
*   **Hrozba:** Agenti bez řízení (Governance) tuto pastvinu zničí (spam, tech debt, security holes).
*   **Řešení:** Musíme definovat **"Licence to Operate"** – sadu pravidel a mechanismů, které zaručí, že agent je "civilizovaný" a přináší hodnotu, ne chaos.

---

## 2. Teoretický Rámec (The "How")

Tento rámec je odvozen metodou "First Principles" (dekompozice problémů software engineeringu vs. specifika AI).

| Dimenze Řízení | Problém (AI Gap) | Řešení (Teoretický model) | Implementace v Experimentu |
| :--- | :--- | :--- | :--- |
| **1. Koordinace** | Agent je epizodický, nemá paměť týmu. | **STIGMERGIE** | Koordinace přes prostředí (Filesystem, `.cursorrules`, TODOs), ne přes chat. |
| **2. Komunikace** | Vágní zadání vede k halucinacím. | **DESIGN BY CONTRACT** | Issue #136. Explicitní definice `Input` -> `Process` -> `Output`. |
| **3. Kvalita** | AI je stochastická (náhodná). | **CMMI (Maturity)** | Měření spolehlivosti procesu. Schopnost opakovat úspěch. |
| **4. Udržitelnost** | Když agent selže, neví co dál. | **ITIL (Incident Mgmt)** | Standardizované logování chyb a "Self-healing" procedury. |

---

## 3. Praktický Projekt: "The RealWorld Experiment"

Cílem není vyvinout novou aplikaci, ale demonstrovat dopad Governance Frameworku na vývoj standardizované aplikace.

### Cíl
Implementovat backend specifikaci **RealWorld (Conduit)** – klon Medium.com.
*   **Stack:** Bun, Hono, Drizzle ORM, PostgreSQL.
*   **Specifikace:** OpenAPI (Swagger) definující endpointy (`/api/users`, `/api/articles`...).

### Metodika Experimentu
Budeme porovnávat efektivitu agenta ve dvou režimech (A/B testing konfigurací):

#### Skupina A: "Unmanaged" (Chaos / Level 1)
*   **Instrukce:** Jednoduchý prompt ("Implementuj tento endpoint podle specifikace").
*   **Omezení:** Žádná. Agent si dělá co chce.
*   **Očekávání:** Rychlý start, ale vysoká chybovost, "špagety" kód, selhání v integračních testech.

#### Skupina B: "Governed" (Order / Level 3-5)
*   **Instrukce:** Plná sada Governance pravidel (System Prompts).
    *   *Stigmergy:* Vynucená struktura souborů.
    *   *Contract:* Musí validovat vstupy/výstupy.
    *   *Test-First:* Musí nejprve napsat test, pak kód.
*   **Očekávání:** Pomalejší start, vyšší spotřeba tokenů (režie), ale **100% pass rate** v testech a udržitelný kód.

### Metriky (Co měříme do BP)
1.  **Compliance:** Prošel kód Postman testy? (Pass/Fail)
2.  **Efficiency:** Počet nutných iterací (oprav) k dosažení cíle.
3.  **Cost:** Cena v tokenech (USD).
4.  **Quality:** Statická analýza (Linting errors, Complexity).

---

## 4. Akční Plán (Roadmap)

1.  **Příprava Prostředí (The Bench):**
    *   Stáhnout RealWorld specifikaci a Postman testy.
    *   Připravit prázdné repo s Digital Fusion stackem (Bun/Hono).
2.  **Definice Frameworku (The Rules):**
    *   Sepsat `.cursorrules` a systémové prompty pro "Governed" režim.
3.  **Experiment:**
    *   Spustit Agenta (Skupina A). Změřit.
    *   Reset.
    *   Spustit Agenta (Skupina B). Změřit.
4.  **Vyhodnocení:**
    *   Porovnat data, vytvořit grafy, sepsat závěr do BP.

---

**Poznámka:** Tento projekt slouží jako "Proof of Concept" pro Epic #51 (Autonomous Engineering) v Digital Fusion. Co se naučíme na RealWorldu, aplikujeme na reálné klienty.
