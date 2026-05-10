# Handoff: methodological correctness language review

Datum: 2026-05-09  
Branch: `dev`  
PR: #68 `Methodological correctness language review` (`dev` -> `main`)  
Zdroj auditu: `notes/review/claude-review.md`

## Smysl průchodu

Tento průchod není omluva za slabý design práce. Cílem je zpřesnit
jazyk nároků tak, aby odpovídal případové studii: práce ukazuje
proveditelnost, měřitelné změny a indikativní vzorce v jednom
kontrolovaném prostředí, ne statistický kauzální důkaz.

Při dalších úpravách držet tón věcný a sebevědomý. Nepřidávat
defenzivní věty typu „nelze, protože...“, pokud stejnou věc lze říct
přesněji jako vymezení interpretace. Preferovaná formulace je
„interpretace zůstává na úrovni případové studie“ nebo „data jsou
konzistentní s...“, ne opakované omlouvání malého počtu běhů.

## Pracovní pravidla

- Jít checklist v PR #68 bod po bodu.
- U každého bodu nejdřív rozhodnout `change` / `no change`.
- Pokud už je věc pokrytá literaturou nebo limity, nezahlcovat thesis
  další větou. Raději označit bod v PR jako ověřený bez změny.
- Když změna vznikne, má být krátká, lokální a přímo v místě, kde claim
  vzniká. Nepřidávat plošné „limitations“ odstavce jen proto, že audit
  pojmenoval slabinu.
- Hlídat guardraily vedoucího: žádné AI dvojtečkové věty, žádné em dash,
  neosobní/3. osoba, žádné zbytečné opakování citací.
- PR checklist aktualizovat po každém uzavřeném bodu.
- Commitovat malé logické celky na `dev`, stageovat jen scoped soubory.

## Hotové v PR #68

- Causal wording u ablací změkčen.
  - Commit: `299a411 fix: soften ablation causality claims`
  - Změna: `kap05`, `zaver`
  - Claim se přesunul z „přispívají/potvrdila“ na „data jsou
    konzistentní / výsledky byly konzistentní s interpretací“.

- Cíl 2 zarámován jako feasibility evidence, ne důkaz účinku instrukcí.
  - Commit: `862709c fix: frame iterative results as feasibility evidence`
  - Změna: `kap05`
  - Důležité stylistické rozhodnutí: původně defenzivní věta byla
    přepsána na klidnější vymezení „interpretace zůstává na úrovni
    případové studie“.

- Missing no-AGENTS baseline ověřen bez změny textu.
  - Rozhodnutí: `no change`
  - Důvod: literatura už řeší otázku `AGENTS.md` jako celek vs absence
    nebo generický repository-level soubor. Tato práce navazuje otázkou
    složek a operacionalizace uvnitř `AGENTS.md`. Dopisovat další větu
    by zbytečně zvýraznilo vedlejší otázku.

- LLM-as-judge / Q8 ověřeno bez změny textu.
  - Rozhodnutí: `no change`
  - Důvod: metodika, interpretace i limity už explicitně říkají, že Q8
    je podpůrná judge-based metrika bez validace proti lidskému
    hodnocení.

- Volba MiniMax-M2.5 a GLM-5 stručně zdůvodněna.
  - Commit: `98590f5 fix: justify model choices in methodology`
  - Změna: `kap03`, `literatura.bib`
  - MiniMax-M2.5 je odůvodněn nízkou cenou a rychlostí pro opakované
    agentní běhy.
  - GLM-5 je odůvodněn nízkou cenou, nízkou mírou halucinací
    v AA-Omniscience a odlišnou modelovou rodinou vůči agentovi.
  - PDF se nestahovalo. Přidán jen lehký bib záznam na veřejný benchmark.

## Otevřené body v PR #68

- `Check r5 interpretation for cherry-picking risk`
- `Review practical recommendation about shorter measurable workflow`
- `Verify conclusion/abstract consistently avoid validated framework framing`

## Doporučený další krok

Pokračovat bodem r5 cherry-picking.

Nejdřív načíst aktuální text kolem `Pilot-r5` v `kap04` a související
interpretaci v `kap05`. Hlavní otázka není „r5 byl špatně“, ale zda
text vyzdvihuje Q5/Q7 zlepšení tak, že zakrývá procesní regresi a horší
Q2. Správný tón má být: r5 je celkově neúspěšný procesní běh, ale
zároveň ukazuje lokální funkčnost jednokrokových verifikačních příkazů.
Pokud už to text říká dostatečně, označit `no change`. Pokud ne,
upravit jen lokální formulaci v kap04/kap05.
