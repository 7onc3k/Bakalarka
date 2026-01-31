# Session: Kapitola 2 - Struktura a psaní

## Co jsme udělali

### 1. Restrukturalizace kapitoly 2

Nová struktura:
- **2.1 Softwarové inženýrství** (definice, komplexita)
- **2.2 Životní cyklus a metodiky** (fáze, modely, nástroje, artefakty, role)
- **2.3 Agentic coding** (raw náčrt)
- **2.4 Scaffolding pro agenty** (raw náčrt)

Pořadí v 2.2 (varianta E - co-jak-čím-kdo):
1. Fáze životního cyklu
2. Modely a metodiky
3. Nástroje
4. Artefakty
5. Role a komunikace

### 2. Pořadí v 2.1

Změněno na:
- 2.1.1 Definice a vymezení oboru
- 2.1.2 Historický kontext (nově - vývoj abstrakcí)
- 2.1.3 Komplexita software

### 3. Napsali jsme draft 2.1.1

```latex
\begin{draft}
Softwarové inženýrství je disciplína, která se zabývá celým životním
cyklem software -- od specifikace až po údržbu \cite[s.~xxxvii]{swebok2024}.

Na rozdíl od programování, které se soustředí na implementaci a technické
aspekty jako algoritmy a datové struktury, softwarové inženýrství přistupuje
k vývoji software holisticky -- zahrnuje nejen technickou stránku, ale i
organizační aspekty jako řízení projektů a rozpočty \cite[s.~21]{sommerville2016}.
\end{draft}
```

### 4. Vytvořili jsme dokumenty

- **notes/jak-psat-vedecky.md** - mantra pro akademické psaní
- **CLAUDE.md** - přidány sekce:
  - Styl a ambice BP
  - Metody společného psaní (A, B, D)
  - Pravidla pro práci se zdroji

### 5. Metoda B - Rozhovor

Vyzkoušeli jsme metodu psaní:
- Claude se ptá otázky
- Uživatel odpovídá vlastními slovy
- Když neví → Claude otevře zdroj: `evince -p [strana] [soubor]`
- Pozor: PDF stránka ≠ číslo v knize (RAG vrací PDF stránku)

### 6. Literatura

Přidáno do literatura.bib:
- swebok2024
- sommerville2016

GitHub issue #9: Hledat literaturu (Conway's Law, CSCW, Coordination Theory)

## Myšlenka k rozpracování

Historický kontext (2.1.2) - vývoj abstrakcí:
- Hardware (mechanické, tranzistory) → explicitní, kontrolovatelné
- Kompilátory, vysokoúrovňové jazyky → deterministické
- AI/ML modely → ztráta kontroly, "black box"

Potřeba najít akademické zdroje na toto.

## TODO

- [ ] Najít zdroje pro historický kontext (vývoj abstrakcí)
- [ ] Rozšířit 2.1.1 (1-2 odstavce)
- [ ] Napsat 2.1.2 Historický kontext
- [ ] Napsat 2.1.3 Komplexita software
- [ ] Ověřit citaci Sommerville s. 21
