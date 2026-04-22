# TODO (Bakalářka – FIS/VŠE)

Tento soubor je krátký “next steps” checklist pro dokončení práce v repozitáři.

Zdrojové podklady (uložené v repu):
- `handoffs/14-fis-research-sources.md` (rozcestník na FIS/VŠE zdroje)
- `handoffs/15-fis-checklist-vs-thesis.md` (audit: požadavky vs `thesis/`)

---

## Formální věci (před odevzdáním)
- [ ] Vyplnit reálný **abstrakt/klíčová slova/poděkování** v `thesis/prace.tex`
- [ ] Vyplnit **PDF metadata** v `thesis/prace.xmpdata` (hlavně `\\Keywords` a `\\Subject`, ať tam nezůstane `TODO`)
- [ ] Projít “šablonové poznámky” a **nenechat je vytisknout** (v `thesis/` už jsou hlavně komentáře, ale zkontrolovat finální PDF)
- [ ] **Zadání práce z InSIS (PDF) – vyřešit s vedoucím**, jestli má být součástí finálního PDF (a případně kde přesně se vkládá)

## Citace a literatura
- [x] Přepnout citace na **APA** dle FIS podkladů (`thesis/biblatex-setup.tex`, `thesis/makra.tex`)
- [ ] Nahradit šablonové položky v `thesis/literatura.bib` reálnými zdroji
- [ ] Zkontrolovat, že všechny citace v textu mají položku v bib a naopak

## Obsah a struktura práce (to, co budeme doplňovat “chirurgicky”)
- [ ] Sep sat “vědecký kontrakt” práce na 1 stranu (problém → cíl/RQ → artefakt → evaluace) a držet se toho v textu
- [ ] Dopsat experimentální protokol (směr A / test cheating): konfigurace běhů + QA rubriky pro “dobré testy” + definice cheat patternů
- [ ] V `thesis/uvod.tex` doplnit:
  - [ ] motivaci/kontext
  - [ ] vymezení problému
  - [ ] cíle práce (v souladu se zadáním)
  - [ ] stručnou strukturu práce
- [ ] V `thesis/kap01.tex` konkretizovat cíle + případné výzkumné otázky/hypotézy
- [ ] V `thesis/kap02.tex` udělat systematickou rešerši (SoTA) + explicitní “mezery” pro přínos
- [ ] V `thesis/kap03.tex` metodiku: postup v krocích, aby byl reprodukovatelný
- [ ] V `thesis/kap04.tex` praktickou část: návrh/implementace/replikace
- [ ] V `thesis/kap05.tex` vyhodnocení: metriky + diskuse + limity
- [ ] V `thesis/zaver.tex` závěr: míra splnění cílů + přínos + limity + další práce
- [ ] `thesis/zkratky.tex`: doplnit pouze zkratky, které se skutečně používají (jinak sekci vynechat)

## Přílohy / artefakty
- [ ] Přílohy (`thesis/app01.tex`, `thesis/app02.tex`) naplnit pouze věcmi, na které se v textu odkazuje
- [ ] U praktické části rozhodnout, co je “artefakt”: kód, logy, experimentální protokoly, dataset popis

## Praktická část (nově vybraný testbed)
- [ ] Zafixovat scope Billing Reminder Engine (minimální core pro BP):
  - [ ] `DunningStateMachine`
  - [ ] `BusinessDaysCalculator`
  - [ ] (volitelně) `ReminderScheduler`
- [ ] Napsat specifikace komponent (bez implementace) do `specs/` (invarianty, příklady, edge cases)
- [ ] Implementovat domain logiku (vlastní kód) podle spec
- [ ] Nastavit mutation testing (např. Stryker nebo jednoduchý custom harness)
- [ ] Definovat taxonomii “test cheating” + automaticky detekovat základní patterns (triviální asserty, tautologie, hardcode, chybějící negativní testy)
- [ ] Spustit experimenty:
  - [ ] A: agent má implementaci + spec
  - [ ] B1: agent má jen spec
  - [ ] B2: spec + test-plan šablona
  - [ ] B3: spec + adversarial reviewer
- [ ] Vyhodnocení: mutation score + edge-case coverage + negative test ratio + cheat pattern count (a krátká kvalitativní analýza selhání)

