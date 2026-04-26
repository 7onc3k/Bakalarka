# Handoff 16 — Páky & signály, komunikace, issue struktura (diskuze)
Datum: 2026-01-21

## Co uživatel chce (explicitně)
- Zjistit, **co je důležité**, aby se v codebase vyznal **člověk** a především **LLM**, aby:
  - LLM odvedlo práci správně
  - člověk měl nad změnami **kontrolu**
- Najít **páky a signály** pro řízení agenta:
  - **páky**: jaké artefakty / postupy / struktury nejvíc pomůžou agentovi dělat správné kroky
  - **signály**: podle čeho poznat, že agent jde správně / je potřeba zastavit nebo eskalovat

## Upřesnění (co znamená “vyznat se v codebase”)
- Uživatel chce, aby (člověk i agent) byli schopni:
  - chápat **impact** dalšího kroku na systém
  - vidět **výhody / nevýhody**, **alternativy** a **rizika**

## Co znamená “člověk má kontrolu” (explicitně)
- Pokud je potřeba **human decision**, agent to má prezentovat tak, aby člověk chápal:
  - **současný stav**
  - **vliv změny** (impact)
  - **co se v systému děje** a **co se LLM bude snažit udělat**
- Pokud člověk **něčemu nerozumí**, je to špatně a agent by **neměl pokračovat ve změnách** (má eskalovat / dovysvětlit / zastavit).

## Vague requirements → issues (explicitně)
- “Vágní” zadání přichází **od product ownera**.
- **Issues by měl vytvářet agent sám** (tzn. agent převádí vágní zadání do strukturovaného issue + dalších artefaktů).

## Co přesně se má strukturovat (explicitně)
- Uživatel míří na to, jak strukturovat:
  - GitHub **issues**
  - přípravu projektu (repo setup)
  - **milestones** a další GitHub artefakty, které GitHub poskytuje

## Preference směru (explicitně)
- Uživatel chce držet směr z `research-scope-V3`.
- Uživatel se kloní k tomu, že primární osa evaluace je **kvalita komunikace** (ne primárně kvalita kódu).

## Otevřené otázky / nejistoty (explicitně)
- Uživatel si není jistý, jestli je evaluace “kvality komunikace” **měřitelná** pro BP, protože:
  - odpovědi na dotazy/rozhodnutí často dává člověk
  - s časem se člověk zlepšuje (“čím častěji to budu dělat, tím víc to budu chápat”)

## RealWorld experiment (co padlo v diskuzi)
- Uživatel zvažuje, zda RealWorld není “malá aplikace”, a jak to vést:
  - od vágních požadavků až po hotovou aplikaci
  - průběžně dělat QA v jednotlivých fázích
  - zvažuje porovnávání vůči “vzorovému kódu” RealWorld (jako reference)

