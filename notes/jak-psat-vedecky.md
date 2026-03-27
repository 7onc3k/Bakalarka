# Jak psát vědecky - Mantra

Dokud to nebudeš znát nazpaměť, vracej se sem.

---

## Rychlá navigace

| Potřebuji... | Jdi na |
|--------------|--------|
| Připomenout základy | → [Zlatá pravidla](#zlatá-pravidla) |
| Vybrat zdroje | → [Zdroje](#zdroje) |
| Napsat text | → [Psaní](#psaní) |
| Zkontrolovat | → [Kontrola](#kontrola) |
| Mantru | → [Mantra](#mantra) |

---

# Zlatá pravidla

1. **Každé tvrzení má oporu** - buď citace, nebo explicitně "tvrdím že..."
2. **Od obecného ke konkrétnímu** - nejdřív kontext, pak detail
3. **Propojuj s prací** - proč to tu je? Jak to souvisí s BP?
4. **Rozlišuj fakt vs. názor** - fakta cituj, názory označ
5. **Piš pro čtenáře** - neví nic, ale není hloupý

---

# Zdroje

## Hierarchie zdrojů

```
🥇 Peer-reviewed (journals, konference)  → nejvyšší váha
🥈 Knihy, monografie                     → dobré pro základy
🥉 Technical reports, standardy          → šedá literatura
⚠️  Weby, blogy, dokumentace              → jen když není alternativa
❌ Wikipedia                             → nikdy necitovat přímo
```

## Jak číst zdroj

**Rychlý průchod (5 min):**
1. Abstract → o čem to je?
2. Conclusion → co zjistili?
3. Headings → kde hledat?
4. References → další zdroje?

**Co extrahovat:**
- Definice (přesné znění)
- Klíčová tvrzení (pro citaci)
- Limity (co autoři přiznávají)

## Dva typy citací

| Typ | Kdy | Příklad |
|-----|-----|---------|
| **Přímá** (v uvozovkách) | Definice, slavné výroky | „systematic approach..." [1, s. 24] |
| **Parafráze** (vlastními slovy) | Většina textu (80-90%) | Systematický přístup k... [1] |

## Syntéza zdrojů

**Špatně (seznam):**
> Brooks říká X. Sommerville říká Y. SWEBOK říká Z.

**Dobře (propojení):**
> Komplexita, kterou Brooks identifikoval, vedla ke vzniku SWE jako disciplíny [Sommerville]. Ta je dnes kodifikována v SWEBOK.

**Techniky:** shoda zdrojů, vývoj myšlenky, různé perspektivy, zobecnění.

---

# Psaní

## Struktura odstavce

```
Topic sentence  → Co tento odstavec říká
Elaborace       → Rozvinutí myšlenky
Evidence        → Citace, příklady
Propojení       → Jak to souvisí s BP
```

## Přechody mezi odstavci

| Vztah | Signální slova |
|-------|----------------|
| Přidání | kromě toho, dále, rovněž |
| Kontrast | naproti tomu, avšak, nicméně |
| Příčina | proto, v důsledku, z tohoto důvodu |
| Příklad | například, konkrétně |
| Shrnutí | celkově, lze tedy říci |

## Úvod sekce

1. O čem sekce je (1 věta)
2. Proč je to důležité pro BP (1 věta)
3. Co probereme (výčet)

## Závěr sekce

1. Co jsme probrali (shrnutí)
2. Klíčový závěr (co si odnést)
3. Přechod k další sekci

## Prezentace dat (tabulky, grafy)

**Tři vrstvy** — vždy v tomto pořadí:

| Vrstva | Co říká | Jazyk | Příklad |
|--------|---------|-------|---------|
| **Pozorování** | Co data ukazují (fakt) | "tabulka ukazuje", "kleslo", "zůstalo stabilní" | "Q5 kleslo ve všech ablačních bězích (tabulka X)." |
| **Interpretace** | Proč se to stalo (výklad) | "naznačuje", "pravděpodobně", "může souviset", "je konzistentní s" | "To naznačuje, že bez explicitního příkazu agent nekontroluje kvalitu." |
| **Závěr** | Co z toho plyne pro výzkumnou otázku | "tedy", "z toho plyne", "potvrzuje" | "Verifikační kroky tedy nejsou redundantní." |

**Pravidla:**
- **Nenaruj tabulku** — čtenář vidí čísla, neopisuj "Q5 z 1 na 3-4, Q7 z 1 na 1-4". Místo toho: závěr + odkaz na tabulku + jen překvapivé číslo s vysvětlením proč.
- **Interpretace ≠ fakt** — "jsou řízeny tréninkem" je interpretace, ne pozorování. Vždy hedging: "data naznačují, že..."
- **Závěr bez pozorování = claim bez evidence** — nejdřív řekni co vidíš, pak co to znamená.
- **Jedno číslo stačí** — když chceš podpořit argument, vyber jedno nejsilnější číslo, ne všechna.

## Mikro-patterny podle typu sekce

Každá sekce v BP má jiný účel → jiný vnitřní vzorec. Vyber podle toho, co zrovna píšeš.

### Teorie / Rešerše: Syntéza

Do středu dej **téma**, ne autora. Nepopisuj kdo co řekl — ukaž jak se přístupy doplňují.

```
Téma/koncept       → O čem se mluví
Porovnání přístupů → A doporučuje X pro..., B upozorňuje že X nezachytí...
Tvoje syntéza      → Z obou plyne... V této práci proto...
```

### Metodika: Obhajoba postupu

Neříkej jen CO jsi udělal — obhaj PROČ. Oponent chce vědět, že to není z prstu.

```
Volba metody       → Zvolili jsme X
Zdůvodnění (proč)  → Protože řeší Y, na rozdíl od Z které...
Provedení (jak)    → Konkrétně: parametry, podmínky, nástroje
Uznání limitů      → Limitem je, že X nezachytí...
```

### Výsledky: Čistá data

Tady **vypínáš interpretaci**. Jen ukazuješ co data říkají, aby je oponent viděl nezávisle.

```
Identifikace trendu → Co se stalo (fakt)
Odkaz na důkaz      → Jak ukazuje tabulka/graf X
Vypíchnutí detailu  → Zajímavé je, že... (anomálie, neočekávané)
```

### Diskuse: Pozorování → Interpretace → Implikace

Bereš surová data z Výsledků a dáváš jim **význam**. Tři vrstvy vždy v tomto pořadí:

```
Pozorování         → Jak bylo uvedeno, X kleslo o Y %
Interpretace       → Pravděpodobným důvodem je... (hedging!)
Konfrontace        → To se shoduje/neshoduje s [Autor], který...
Implikace          → Z toho plyne, že pro design metrik je nutné...
```

### Kdy co použít (cheat sheet)

| Píšu...                | Pattern            | Klíčová otázka               |
|------------------------|--------------------|-------------------------------|
| Teoretický přehled     | Syntéza            | Jak se přístupy doplňují?     |
| Metodické rozhodnutí   | Obhajoba postupu   | Proč zrovna toto?             |
| Tabulku výsledků       | Čistá data          | Co data objektivně ukazují?   |
| Rozbor výsledků        | Pozor→Inter→Impli   | Co to znamená a co z toho plyne? |
| Jakýkoli odstavec      | TEEL (viz výše)    | Tvrzení→Důkaz→Vysvětlení→Propojení |

## Akademický jazyk

Vědecký = přesný, ne složitý. Jednoduchá věta s konkrétním obsahem
je vždy lepší než formální věta s abstraktním obsahem.

| Špatně (formální ale vágní) | Dobře (přesné) |
|-----------------------------|----------------|
| značné množství problémů | 11 z 45 testů selhalo |
| v současné době | (smazat — nic nepřidává) |
| lze konstatovat že | (říct rovnou co konstatujeme) |
| nepřeváděla na konkrétní kroky | neříkala jakým příkazem to udělat |

**Vyhni se:** hovorové výrazy, vágní tvrzení bez citace, absolutní tvrzení (vždy/nikdy).

---

# Kontrola

## Revize - 4 průchody

1. **Obsah** - Říkám co chci? Mám citace?
2. **Struktura** - Plyne to? Fungují přechody?
3. **Jazyk** - Je to srozumitelné? Akademické?
4. **Formát** - Citace správně? Konzistentní?

## Checklist odstavce

- [ ] Má topic sentence?
- [ ] Každé tvrzení má citaci?
- [ ] Propojeno s BP?
- [ ] Navazuje na předchozí?

## Checklist sekce

- [ ] Má úvod (co a proč)?
- [ ] Má závěr (shrnutí, přechod)?
- [ ] Odstavce na sebe navazují?

## Co nedělat

- ❌ Citovat Wikipedii
- ❌ Psát bez citací
- ❌ Skákat mezi tématy bez přechodu
- ❌ Začínat sekci bez úvodu
- ❌ Seznam zdrojů místo syntézy
- ❌ Absolutní tvrzení bez důkazu

---

# Kontext

## BP vs. Disertace

| | BP | Disertace |
|---|---|---|
| **Účel** | Zpracovat téma | Posunout poznání |
| **Zdroje** | 10-30 | 100+ |
| **Přínos** | Syntéza, aplikace | Nová teorie |

**Tvůj přístup:** Metodicky jako disertace, scope jako BP.

## Struktura teoretické kapitoly

```
Obecné → Konkrétní → Propojení s BP

2.1 Široký kontext     ← učebnice
2.2 Užší kontext       ← učebnice + papers
2.3 Ještě užší         ← papers
2.4 Nejužší            ← vlastní syntéza
```

---

# Mantra

> **Píšu pro čtenáře který neví nic, ale není hloupý.**
>
> **Každá věta má účel. Každé tvrzení má oporu.**
>
> **Teorie slouží praxi. Vše propojuji s BP.**
>
> **Text plyne. Odstavce se drží. Sekce mají tvar.**
