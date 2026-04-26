# Systematická dedukce teoretického rámce BP

Datum: 2026-01-18
Navazuje na: `04-issue-136-paky.md`
Klíčový posun: Od nahodilého brainstormingu k logické struktuře researche.

---

## 1. Kontext a Problém
V předchozích diskuzích jsme identifikovali řadu zajímavých konceptů (ITIL, CMMI, Stigmergie, Contracts, #136).
**Problém:** Tyto koncepty byly přiřazeny k cílům práce pouze sémanticky ("zní to podobně"), chyběla **logická kauzalita** a **hierarchie**.
**Cíl:** Vybudovat teoretický rámec systematicky, metodou "First Principles".

---

## 2. Metodologie dedukce (Myšlenkový proces)

Abychom obhájili výběr konkrétních modelů, musíme postupovat ve třech krocích:
1.  **Dekompozice SWE:** Co jsou univerzální problémy řízení softwaru (bez ohledu na to, kdo ho tvoří)?
2.  **Gap Analysis:** Kde specificky selhává lidský přístup, když ho aplikujeme na AI agenty?
3.  **Výběr modelu:** Který teoretický rámec logicky řeší identifikovanou mezeru?

---

## 3. Výsledná matice (Struktura researche)

Tato matice tvoří kostru teoretické části BP.

### Dimenze 1: KOORDINACE (Kdo co dělá a kdy?)
*   **Lidský přístup:** Synchronní (meetingy, standupy), sociální vazby, implicitní paměť týmu.
*   **AI Gap:** Agenti jsou epizodičtí (zapomínají), nemají sociální vazby, neúčastní se standupů.
*   **Logické řešení:** Koordinace musí být *asynchronní* a uložená v *prostředí*.
*   **Zvolený model:** **STIGMERGIE** (Biologická inspirace)
    *   *Princip:* Nepřímá koordinace skrze stopy v prostředí (kód, docs).

### Dimenze 2: KOMUNIKACE (Předání záměru)
*   **Lidský přístup:** Přirozený jazyk, kontextuální domýšlení, vágní zadání ("fix login").
*   **AI Gap:** AI potřebuje explicitní kontext. Vágní zadání vede k halucinacím. Chybí "selský rozum".
*   **Logické řešení:** Komunikace musí být *High-Bandwidth* a *bez ztráty informace*.
*   **Zvolený model:** **DESIGN BY CONTRACT / PÁKY (#136)**
    *   *Princip:* Issue jako smlouva (Pre-conditions, Context, Post-conditions).

### Dimenze 3: KVALITA A DŮVĚRA (Je to správně?)
*   **Lidský přístup:** Důvěra v senioritu ("Franta to umí"). Subjektivní hodnocení.
*   **AI Gap:** AI je stochastická (náhodná) a "Black Box". Nelze jí věřit jako člověku.
*   **Logické řešení:** Potřebujeme objektivní *měření spolehlivosti* procesu, ne důvěru.
*   **Zvolený model:** **CMMI (Maturity Models)**
    *   *Princip:* Měření zralosti zadání (Confidence Index) a procesu (Level 1-5).

### Dimenze 4: UDRŽITELNOST (Co když se to rozbije?)
*   **Lidský přístup:** Hrdinství ("Zavolej Pepovi"). Ad-hoc řešení.
*   **AI Gap:** Agenti neumí improvizovat mimo své instrukce. Potřebují algoritmický postup.
*   **Logické řešení:** Explicitní procedury pro řešení incidentů a změn.
*   **Zvolený model:** **ITIL (Incident & Change Management)**
    *   *Princip:* Standardizovaná workflow pro řešení problémů a řízení změn.

---

## 4. Závěr pro BP
Tato struktura odpovídá na Cíle práce definované ve V3:
*   **Cíl 1 (Taxonomie):** Sloupec "Dimenze" a "Lidský přístup".
*   **Cíl 2 (Změna v kontextu AI):** Sloupec "AI Gap".
*   **Cíl 3 (Harness/Scaffolding):** Sloupec "Zvolený model" a jeho implementace.

Tímto je teoretický rámec vědecky podložený a obhajitelný.
