---
name: revise-section
description: Revize thesis sekce — first-principles kostra, pak kontext, gap analýza a přepis
disable-model-invocation: false
argument-hint: <sekce např. "5.2" nebo "sec:porovnani-literatura">
---

Revize thesis sekce $ARGUMENTS. Postupuj přesně v tomto pořadí — každý krok je samostatná fáze, nepřeskakuj.

## Fáze 1: First-principles (BEZ čtení aktuálního textu sekce)

### 1a. Validace proti standardům a referencím

Než navrhuješ kostru, zjisti co říkají standardy a jak to dělají ostatní:

1. **Doporučení FIS** (`notes/doporuceni-fis.md`): jaké požadavky klade komise na tuto část práce?
2. **Best practice** — aktivně dohledej relevantní zdroje pro danou sekci (RAG, `thesis/sources/`, web, `notes/`). Co říká literatura o tom jak psát tento typ sekce?
3. **Vzorové BP** (`vzoroveBP/`): jak odpovídající sekci řeší jiné práce? Jaká je typická délka, struktura? Kriticky zhodnoť: co dělají dobře, co špatně. Vzory jsou referenční bod, ne autorita

### 1b. Účel, obsah a vymezení

1. **Účel sekce** — co je její role v kapitole a v celé thesis (jedna věta)
2. **Co tam musí být** — odvozeno z cílů práce, struktury, logiky argumentace. U každého bodu vysvětli *proč* tam patří: jakou otázku čtenáře zodpovídá, jaký argument podpírá, nebo jaký přechod k další sekci vytváří
3. **Co tam NEMÁ být** — co patří jinam. U každého bodu řekni *kam* to patří a *proč* tam, ne sem
4. **Alternativy** — existují jiné legitimní způsoby jak tuto sekci strukturovat? Jaké jsou trade-offy? Zvol jednu variantu a zdůvodni
5. **Navrhni kostru** — tematické bloky, ne odrážky. U každého bloku jedna věta: co tam bude a proč

**Zastav se a diskutuj s uživatelem.** Nepokračuj dokud uživatel neodsouhlasí kostru.

## Fáze 2: Načtení reality (DVĚ paralelní větve)

Teprve po odsouhlasení kostry:

**Větev A — Aktuální text:**
- Přečti sekci v .tex souboru
- Zaznamenej: DRAFT/RAW stav, TODOs, REVIEW značky

**Větev B — Kontext z repo:**
- Sousední sekce (co říkají o stejném tématu — hledáme duplicity)
- Přechody: jak končí předchozí sekce, jak začíná následující (návaznost)
- Data z kap04 (pokud sekce interpretuje výsledky)
- Kap02 (pokud sekce porovnává s literaturou — co už je v teorii, neopisovat)
- MEMORY.md a feedback soubory (rozhodnutí, guardraily)

**Větev C — Srovnání s referencemi:**
- Zkontroluj `notes/doporuceni-fis.md` — splňuje sekce požadavky komise na danou část práce (cíle/metodika/výsledky/závěry)?
- Podívej se do `vzoroveBP/` jak odpovídající sekci řeší jiné BP. Kriticky zhodnoť: co dělají dobře, co špatně, co můžeme převzít. Nekopíruj bezhlavě, posuď jestli to sedí na naši práci
- Pokud je dostupná relevantní best practice z peer-reviewed zdrojů (např. jak psát case study: Runeson & Host 2009), zmíni ji

## Fáze 3: Gap analýza

Porovnej kostru (fáze 1) s realitou (fáze 2). Nejdřív vyřeš co v sekci nemá být (přesunout/smazat), pak teprve co chybí a co je špatně, ať neopravuješ text který tam nakonec nezůstane.

- **Co je navíc** — text který nepatří do této sekce (přesunout/smazat). Kam přesunout?
- **Co chybí** — téma v kostře které v textu není
- **Co je špatně** — factual errors, strawmany, causal claims bez dat, spekulace vydávané za pozorování
- **Duplicity** — co se opakuje z jiných kapitol

**Zastav se a diskutuj s uživatelem.** Nepokračuj dokud uživatel neodsouhlasí gap analýzu.

## Fáze 4: Přepis

- Starý DRAFT přesuň do RAW (audit trail)
- Nový DRAFT nad něj
- Dodržuj pravidla z CLAUDE.md (metriky přes \ac{}, [H] u grafů, hedging pro case study, signpost na začátku sekce)
- Každá věta musí být obhajitelná — citace nebo explicitní "tvrdíme že"
- Spekulace a interpretace jasně oddělené od pozorování

**Self-review před ukázáním uživateli:**
1. Splňuje text kostru z fáze 1? (nic nepřibylo, nic nechybí)
2. Navazuje na předchozí a následující sekci? (přechody)
3. Neobsahuje závorky v závorce (acro problém)?
4. Žádné em dash?

## Fáze 5: Iterace

- Při feedbacku rovnou navrhni opravu, neptej se "chceš to přepsat?"
- Při každé změně zkontroluj jestli nezavádíš novou chybu (factual, duplicita, strawman)
- Pokud feedback mění strukturu (ne jen formulaci), vrať se k fázi 1 a aktualizuj kostru

## Guardraily

- **Neopisuj literaturu z kap02** — v diskuzi jen syntetizuj a porovnávej
- **Neopakuj data z kap04** — odkaz, ne narování
- **Hedging** — "naše data naznačují", ne "potvrzujeme". Case study = feasibility, ne statistická validace
- **Jeden pojem = jeden termín** — zkontroluj TERMINOLOGIE.md
- **Čísla ověřuj** — neříkej z hlavy, podívej se do dat
