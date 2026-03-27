# Handoff: Metodika, DSR a artefakt — reasoning session 2026-03-25

## Kontext

Diskuse o tom jak pojmenovat a prezentovat metodiku BP. Vyplynulo několik
důležitých rozlišení která ovlivňují jak psát kap03 a kap01.

---

## Klíčové rozlišení: DSR vs APO vs naše metodika

Jsou to tři různé věci na různých vrstvách:

| Vrstva | Co to je | Jak se jmenuje |
|---|---|---|
| Epistemologický rámec | Proč to děláme jako výzkum | DSR (Hevner 2004) |
| Typ optimalizace | Jak technicky manipulujeme s instrukcemi | Human-in-the-loop iterativní optimalizace |
| Automatizovaná varianta | Algoritmus dělá totéž bez člověka | APO (Automatic Prompt Optimization) |

**DSR říká PROČ** — výzkum navrhuje a evaluuje artefakt (Hevner 2004).
**Human-in-the-loop říká JAK** — výzkumník analyzuje metriky a rozhoduje o změnách.

Nejsou v konfliktu — jsou na různých vrstvách.

---

## Proč nejsme APO

APO (Zhou et al. 2022, PromptWizard, DSPy) = algoritmus automaticky:
score → critique → generate → iterate. Bez člověka v rozhodovací smyčce.

Náš přístup:
```
Agent běží → Metriky → Výzkumník + Claude analyzují → Výzkumník rozhoduje → AGENTS.md
```

Claude Opus byl nástroj pro analytickou podporu — jako statistický software.
Finální rozhodnutí vždy na výzkumníkovi.

Správný termín: **human-in-the-loop iterativní optimalizace instrukcí**.

Průmysl dělá plnou automatizaci (MiniMax M2.7 — 100+ kol autonomně, DSPy,
PromptWizard Microsoft). Náš přístup je manuální předstupeň který explicitně
dokumentuje kauzalitu mezi změnou instrukce a výsledkem. To je náš contribution.

---

## Problém s "artefaktem"

Slovo "artefakt" (DSR termín) budí zmatek — čtenář neví na jaké úrovni jsme.
BP se pohybuje na čtyřech úrovních:

```
systém upomínek     = testovací prostředí (nezajímá nás)
agent píše kód      = chování které měříme
instrukce AGENTS.md = nezávislá proměnná
evaluační metoda    = artefakt = výstup BP  ← čtenář sem snadno nezamíří
```

Čtenář snadno zamění artefakt za AGENTS.md nebo za dunning systém.

---

## Navrhované řešení: mluvit jako ML paper

ML papers nepoužívají "artefakt" vůbec. Říkají:
> "We propose X. We evaluate X on Y. Results show Z."

**Konkrétně pro BP:**
> "Navrhujeme sadu metrik a iterační postup pro hodnocení AI coding agentů.
> Postup demonstrujeme na případové studii."

Slovo "artefakt" nechat jen jednou v kap03 u DSR definice — jako technický
termín s vysvětlením. Všude jinde nahradit konkrétním: "sada metrik",
"iterační postup", "evaluační systém".

---

## Co přidat do textu

### kap01 (cíle) — již správně, jen zkontrolovat
Cíle jsou formulovány konkrétně (sada metrik / demonstrovat postup / popsat vliv).
Ujistit se že "artefakt" není v kap01 hlavním slovem.

### kap03 — dvě věci

**1. Explicitní pojmenování přístupu** (RAW TODO přidáno do kap02 sekce 2.3.3):
Naše metodika = human-in-the-loop iterativní optimalizace instrukcí, zasazená
do DSR frameworku. APO nestačí protože: (a) instrukce jsou strukturovaný dokument
ne atomický prompt, (b) jedna iterace = desítky minut, (c) cíl je P/Q/E ne
jedna accuracy metrika, (d) potřebujeme vědět PROČ selhalo.

**2. Čtyři úrovně jako orientační tabulka** pro čtenáře — zvážit přidat na
začátek kap03 nebo kap01:

| Úroveň | Co to je | Role v práci |
|---|---|---|
| Systém upomínek | TypeScript aplikace | testovací prostředí |
| Agent (Minimax) | AI coding agent | objekt měření |
| AGENTS.md | instrukční sada | nezávislá proměnná |
| **Metriky + postup** | **evaluační metoda** | **výstup BP** |

### kap02 (RAW TODO přidáno do sekce evaluace instrukcí)
- Pojmenovat přístup vůči APO
- Citovat Zhou et al. ICLR 2023 (APE, arXiv 2211.01910) — stáhnout do sources
- MiniMax M2.7 jako ilustrativní příklad automatizace (blog, ne peer-reviewed)

---

## Proč DSR stále sedí (pro obhajobu)

V ML je artefakt model nebo architektura. U nás je artefakt **evaluační metoda**
— Hevner to nazývá "Method artifact" a "Instantiation artifact". DSR explicitně
počítá s tímto typem výstupu.

DSR navíc vyžaduje relevance cycle (propojení s praxí) a rigor cycle
(propojení s literaturou) — to APO systémy nemají. Právě proto naše práce
není jen technická zpráva ale výzkum.

Obhajoba: "Proč DSR a ne jen empirical study?"
→ Protože navrhujeme nový evaluační systém (Method artifact), ne jen popisujeme
existující jevy. DSR je pro tento typ výzkumu standardní volba v IS.
