# Checklist: FIS požadavky vs náš stav v `thesis/`

Zdroje (uložené v repu):
- FIS intranet (snapshot): `handoffs/09-fis-nalezitosti-bakalarske-prace.md`
- Doporučení FIS (PDF→MD): `handoffs/10-fis-doporuceni.md`
- Vzorce/modely (PDF→MD): `handoffs/11-fis-formatovani-vzorcu-a-modelu.md`
- LaTeX šablona FIS (rozbalená): `handoffs/assets/fis/downloads/BP-DP/SablonaBP-DP/`
- Veřejné: opatření děkana + VŠE knihovna: `handoffs/assets/fis/downloads/public/` (+ text: `handoffs/12-...`, `handoffs/13-...`)

---

## Povinné části a struktura práce
- **Titulní strana**: splněno (`thesis/zacatek.tex`, proměnné v `thesis/prace.tex`)
- **Prohlášení**: splněno (`thesis/zacatek.tex`)
- **Poděkování**: splněno jako placeholder (vyplnit v `thesis/prace.tex` v `\\Podekovani`)
- **Abstrakt CZ + klíčová slova CZ**: splněno jako placeholder (vyplnit `\\Abstrakt`, `\\KlicovaSlova`)
- **Abstract EN + keywords EN**: splněno jako placeholder (vyplnit `\\AbstraktEN`, `\\KlicovaSlovaEN`)
- **Obsah**: splněno (`\\tableofcontents` v `thesis/prace.tex`)
- **Kapitoly (kontext → cíl → metodika → výsledky → závěry)**:
  - splněno jako skeleton (TODO kostra): `thesis/uvod.tex`, `thesis/kap01.tex`…`thesis/kap05.tex`, `thesis/zaver.tex`
- **Literatura**: technicky splněno (`thesis/literatura.tex` + `thesis/literatura.bib`), obsah zatím šablonový (doplnit reálné zdroje)
- **Přílohy**: splněno jako kostra (`thesis/app01.tex`, `thesis/app02.tex`)

## Originalita a citace (Doporučení FIS)
- **Citování dle APA7**: rozhodující požadavek v podkladech FIS
  - zdroj: `handoffs/10-fis-doporuceni.md` (*Originalita*: „…v souladu s citační normou APA 7…“)
  - zdroj: `handoffs/assets/fis/downloads/BP-DP/SablonaBP-DP/biblatex-setup.tex` (`style=apa`)
- **Stav u nás**: opraveno → **přepnuto na APA**:
  - nové: `thesis/biblatex-setup.tex`
  - změna: `thesis/makra.tex` teď `\\input{biblatex-setup}`

## Metodika, reprodukovatelnost, výsledky (Doporučení FIS)
Zatím je to skeleton, ale checklistově je dobré hlídat:
- **Metodika odděleně od výsledků**: připravené (`thesis/kap03.tex`)
- **Postup popsaný v krocích (replikovatelný)**: připravené (`thesis/kap03.tex`, `thesis/kap04.tex`)
- **Doložení provedení kroků (kód/data/přílohy)**: připravené konceptuálně (`thesis/kap04.tex`, přílohy), vyžaduje doplnit konkrétní artefakty

## Vzorce a modely
- **Pravidla formátování vzorců/modelů**: máme uložený podklad `handoffs/11-fis-formatovani-vzorcu-a-modelu.md`
- **Stav u nás**: zatím žádné konkrétní vzorce (není co auditovat)

## PDF/A a metadata
- **PDF/A-2u**: splněno technicky (používáte `pdfx` v `thesis/makra.tex`)
- **XMP metadata**: částečně splněno
  - `thesis/prace.xmpdata` má pořád `TODO` v `\\Keywords` a `\\Subject` → před odevzdáním vyplnit

## Zadání práce z InSIS (otevřený bod)
- **Požadavek „vložit zadání do PDF“**: v samotné LaTeX šabloně to explicitně nevidíme; v opatření děkana je popsaný proces zadání přes InSIS, ne sazba dokumentu.
- **Doporučení pro nás**: rozhodnout s vedoucím / podle studijního oddělení, zda finální PDF má obsahovat zadání z InSIS jako vložené stránky.

