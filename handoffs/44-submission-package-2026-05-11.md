# Submission package — připraveno k InSIS uploadu

Termín: **pondělí 11. 5. 2026, 12:00**

Všechno níže je hotové k copy/paste do InSIS formuláře. LaTeX makra
(`~`, `\\`) musíš odstranit — InSIS chce plain text.

---

## Název CZ (z InSIS, závazný)

```
Návrh a testování běhových prostředí pro autonomní coding agenty v softwarovém vývoji
```

✅ Sjednoceno v PDF (`prace.tex:23`, `prace.xmpdata`, `pdfa.xmpi`).
PDF rebuildí přes `make watch-clean`.

---

## Název EN

```
Design and Testing of Runtime Environments for Autonomous Coding Agents in Software Development
```

(Reflektuje "běhových prostředí" → "Runtime Environments",
"autonomní coding agenty" → "Autonomous Coding Agents".)

---

## Klíčová slova CZ

```
AI coding agent, AGENTS.md, metriky kvality software, iterativní návrh, ablační studie
```

(5 položek; FIS šablona umožňuje 5–7, recent BP měly 5–7.)

---

## Keywords EN

```
AI coding agent, AGENTS.md, software quality metrics, iterative design, ablation study
```

---

## Abstrakt CZ (~241 slov)

```
AI coding agenti dokáží samostatně generovat kód, testy i vývojové
artefakty, ale jejich praktická použitelnost nezávisí jen na tom, zda
výsledný program projde testy. Pro nasazení ve vývoji je důležité také
to, jak agent pracoval, zda zanechal auditovatelnou stopu a jakou
kvalitu má výsledný kód. Současné benchmarky tyto dimenze typicky
nezachycují společně a chybí postup, jak podle nich systematicky
navrhovat instrukce.

Práce proto navrhuje sadu metrik pokrývající proces, kvalitu produktu
a zdroje a ukazuje, jak ji použít k iterativnímu návrhu instrukcí.
Proveditelnost postupu ověřuje případová studie systému upomínek
faktur. Agent opakovaně implementuje stejnou specifikaci, výsledky
jsou vyhodnoceny navrženými metrikami a instrukce jsou mezi běhy
upravovány podle diagnostiky selhání. Následné ablace zkoumají, které
složky instrukcí mají měřitelný přínos.

Výsledky ukazují, že metriky dokáží odlišit funkčně úspěšný výstup od
výstupu vzniklého slabým nebo neauditovatelným procesem. Iterativní
úpravy instrukcí vedly ke zlepšení, ale toto zlepšení nebylo plynulé
napříč běhy. Některé změny způsobily regresi a stejné instrukce vedly
v různých bězích k odlišnému dodržení pracovního postupu. Opakovaným
vzorcem úspěšných úprav byl posun od obecného pravidla ke konkrétnímu
příkazu a nakonec k verifikačnímu kroku. Ablace ukázaly, že
verifikační kroky nejsou redundantní. Odebrání části kódových konvencí
deterministické metriky téměř nezhoršilo, ale zhoršilo designovou
kvalitu hodnocenou LLM-as-judge.

Přínosem práce je ověření proveditelnosti sady metrik a iterativního
postupu návrhu instrukcí na jednom případu. Konkrétní naměřené
hodnoty platí pro daný model, nástroj a projekt. Přenositelný je
postup a sada metrik. Otevřenou otázkou zůstává, zda vzorec
operacionalizace platí i mimo programování.
```

---

## Abstract EN (~264 slov)

```
AI coding agents can autonomously generate code, tests, and other
development artifacts, but their practical usefulness depends on more
than whether the resulting program passes tests. How the agent worked,
whether it left an auditable trace, and the quality of the resulting
code also matter. Existing benchmarks rarely capture these dimensions
together, and no established process exists for designing instructions
against such measurements.

This thesis proposes a metric suite covering process, product quality,
and resources, and shows how it can guide iterative instruction design.
Its feasibility is evaluated on a case study of a billing reminder
system: the agent repeatedly implements the same specification, each
run is evaluated by the proposed metrics, and the instructions are
revised based on diagnosed failures. Subsequent ablations examine
which instruction components contribute measurably.

Results show that the metrics can distinguish a functionally successful
output from one produced by a weak or non-auditable process. Iterative
instruction changes improved agent behavior, though not steadily: some
changes caused regressions, and identical instructions produced
different process adherence across runs. Successful changes followed a
recurring pattern: a shift from general rule to specific command to
verification step. Ablations showed that verification steps are not
redundant; removing part of the code-convention section had little
effect on deterministic metrics but reduced design quality assessed by
an LLM-as-judge.

The contribution is a feasibility evaluation of the metric suite and
instruction-design process on a single case. Specific measured values
are bound to the model, tool, and project; what transfers is the
process and the metric suite. Whether the observed operationalization
pattern holds outside programming remains an open question.
```

---

## PDF k uploadu

`/home/dev/code/Bakalarka/thesis/prace-clean.pdf`

⚠️ **Před uploadem ověř, že má aktuální datum** (po dnešních editech)
a otevři ho jednou pro vizuální kontrolu klíčových míst:
- úvod (3. odst.: "metrik pokrývající proces, kvalitu produktu a zdroje")
- abstract page (CZ + EN)
- kap03 tabulka metrik (Q7 = "Porušení složitosti")
- kap05 sekce limity (3 přepsané věty bez "nelze")
- app01 příloha ("návrh a úpravu" + MiniMax disclosure)

---

## Workflow zítra ráno (KIT instrukce)

### KROK 1 — Registrace mimosemestrálního předmětu pro SZZ

**MUSÍ být uděláno PŘED odesláním emailu sekretářce KIT.**

V InSIS si zapsat:
- **Kód: 4AIN**
- Název: Aplikovaná informatika
- Pracoviště: KIT
- Garant: O. Novotný

### KROK 2 — Odevzdání práce v InSIS

1. Přihlásit se do InSIS
2. Portál studenta → Závěrečná práce → "Vložit doplňující informace"
3. Vyplnit: jazyk (CZ), název CZ, název EN, abstrakt CZ, abstrakt EN,
   klíčová slova CZ (5×), keywords EN (5×)
4. Upload PDF (`prace-clean.pdf`)
5. Označit k odevzdání
6. **Ověřit zelený check** u "Operace studenta" — bez něj práce není
   odevzdaná

### KROK 3 — Email sekretářce KIT (Renata Hertlová)

**Adresát:** renata.hertlova@vse.cz
**Termín:** bezprostředně po odevzdání v InSIS, nejpozději 11. 5. 2026 12:00

**Co musí email obsahovat:**
- Jméno a příjmení (Thanh An Nguyen)
- Program studia: AI (Aplikovaná informatika)
- Informace o registraci mimosemestrálního předmětu pro SZZ
  + **ident kurzu** (4AIN nebo AIN)
- ⚠️ Pokud je to **opakovací pokus** — uvést (předpokládám že není)
- **Jméno a email oponenta** — vedoucí stanovuje a zakládá v InSIS
- Případná omezení pro období SZZ (vyšetření, svatba apod.)

⚠️ **Oponent:** vedoucí (Ing. Jiří Korčák) má založit oponenta v InSIS
**nejpozději v den odevzdání**. Pokud zatím není v InSIS, kontaktovat
vedoucího urgentně. Email Reně Hertlové slouží jako **kontrola** —
oponent musí být v InSIS, email jen reportuje.

### KROK 4 — 3 pracovní dny před SZZ

Splnit všechny studijní povinnosti (mimo samotnou SZZ + obhajobu).

### Rozpis SZZ

Nejpozději 14 dní před zahájením SZZ — rozpis termínů + otevření
odevzdáváren v InSIS pro prezentace.

---

## Backup kontakty

- Studijní oddělení FIS bachelor: **fisbachelor@vse.cz**, **+420 224 095 464**
- Po+St 8:30–11:30 a 13:00–15:00, NB 412
- Vedoucí práce: Ing. Jiří Korčák
- Sekretářka KIT: **Renata Hertlová** — renata.hertlova@vse.cz

---

## Draft emailu pro Renatu Hertlovou

**Předmět:** Odevzdání BP — Thanh An Nguyen, Aplikovaná informatika

**Tělo:**

```
Dobrý den,

odevzdal jsem v InSIS svou bakalářskou práci a hlásím se k SZZ
v aktuálním období.

Jméno: Thanh An Nguyen
Program studia: Aplikovaná informatika (AI)

Mimosemestrální předmět pro SZZ jsem zaregistroval v InSIS:
ident kurzu: 4AIN

Vedoucí práce: Ing. Jiří Korčák (Katedra systémové analýzy)
Oponent práce: Ing. Richard Antonín Novák, Ph.D.
Kontakt na oponenta: <email>    ← doplnit z InSIS

Práce: "Návrh a testování běhových prostředí pro autonomní coding agenty v softwarovém vývoji"
Odevzdána v InSIS dne 11. 5. 2026.

[volitelně:]
V období SZZ mám následující omezení: <vyšetření / svatba / žádná>

S pozdravem
Thanh An Nguyen
<kontaktní email + telefon>
```

**Před odesláním zkontroluj:**
1. Email oponenta doplněný (z InSIS — kontakty oponenta jsou tam
   po jeho založení vedoucím)
2. Práce skutečně označená k odevzdání (zelený check) v InSIS
3. Případná omezení v období SZZ — pokud žádná, řádek smazat

---

## Repo state

- Branch `dev`: `c7093b6` (pre-submission cleanup pushed)
- Branch `release/thesis-final`: `5f67391` (artifacts-only snapshot, pushed)
- Tag `thesis-final`: `5f67391` (pushed)
- GitHub URL `https://github.com/7onc3k/Bakalarka/tree/thesis-final`
  ukazuje pouze `experiments/`, `README.md`, `.gitmodules`, `.gitignore`
