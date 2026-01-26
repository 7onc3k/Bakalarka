# Skills pro BP

## Academic Paper Download

### Workflow

1. **Najít paper** (Semantic Scholar / Web Search)
   - Hledat název, autory, nebo téma
   - Získat: název, DOI, IEEE document number (pokud IEEE)
   - Semantic Scholar API je zdarma a má dobré pokrytí

2. **Zkontrolovat dostupnost**
   - Open Access? → stáhnout přímo
   - Placený? → použít VŠE nebo NTK e-zdroje

3. **Stáhnout přes institucionální přístup**
   - Přihlásit se do knihovny (VŠE nebo NTK)
   - Najít databázi (IEEE, ACM, Springer, etc.)
   - Otevřít paper přes proxy → stáhnout PDF

4. **Uložit a citovat**
   - Uložit do `thesis/sources/` jako `autor-rok-kratky-nazev.pdf`
   - Přidat BibTeX citaci do `literatura.bib`

### Pojmenování souborů

```
autor-rok-kratky-nazev.pdf
```

Příklady:
- `mohanani-2020-cognitive-biases-swe.pdf`
- `brooks-1975-mythical-man-month.pdf`
- `wang-2024-llm-agents-se-survey.pdf`

---

## Dostupné e-zdroje

### NTK (Národní technická knihovna)

**Web:** https://www.techlib.cz/cs/2792-e-zdroje

**Přihlášení:** NTK Single Sign-On (čtenářský průkaz)

**Klíčové databáze pro IT/SWE:**
- **IEEE Electronic Library (IEL)** - IEEE Xplore plný přístup ✅
- **ACM Digital Library Open** - via NTK
- **Springer Compact** - knihy a časopisy
- **ScienceDirect (Elsevier)** - časopisy
- **Wiley Online Library** - časopisy
- **Web of Science** - citační databáze
- **Scopus** - citační databáze
- **JSTOR** - archiv časopisů
- **SAGE STM Collection** - vědecké časopisy
- **Taylor & Francis** - časopisy a knihy
- **Cambridge Journals/Textbooks** - akademické zdroje

**Proxy URL pattern:**
```
https://[databaze].ezproxy.techlib.cz/
```

Příklad IEEE:
```
https://ieeexplore-ieee-org.ezproxy.techlib.cz/document/[číslo]
```

---

### VŠE (Vysoká škola ekonomická)

**Web:** https://knihovna.vse.cz/zdroje/

**Přihlášení:** VŠE účet (InSIS credentials)

**Klíčové databáze:**
- **ACM Digital Library** - plný přístup ✅
- **Scopus** - citační databáze ✅
- **Web of Science** - citační databáze ✅
- **ProQuest Central** - disertace, časopisy
- **EBSCO** - business & management
- **Emerald** - management journals
- **SAGE** (Business Cases, Research Methods)
- **Taylor & Francis** - eBooks
- **JSTOR** - archiv časopisů
- **Statista** - statistická data

**Chybí:**
- ❌ IEEE Xplore (není v předplatném VŠE)
- ❌ Springer (pro knihy použij NTK)

**Pro IEEE papery použij NTK!**

---

## Tipy

### Kdy použít kterou knihovnu

| Typ zdroje | Knihovna |
|------------|----------|
| IEEE (TSE, ICSE, etc.) | NTK |
| ACM (TOSEM, CHI, etc.) | VŠE nebo NTK |
| Scopus / Web of Science | VŠE nebo NTK |
| Springer books | NTK |
| Management/Business | VŠE |
| Open Access | přímo (arXiv, ResearchGate) |

### Alternativy pro placené papery

1. **arXiv preprint** - autoři často publikují preprint
2. **ResearchGate** - autoři sdílejí své papery
3. **Autor's website** - osobní stránky akademiků
4. **Google Scholar** - odkaz na PDF verze

### Semantic Scholar API

Free API pro hledání paperů:
```
https://api.semanticscholar.org/graph/v1/paper/search?query=...
```

Vrací: title, authors, year, DOI, citations, abstract

---

## IEEE Document Number

Pro přímý přístup k IEEE paperu potřebuješ document number:

1. Najdi paper na Semantic Scholar nebo Google Scholar
2. URL pattern: `ieeexplore.ieee.org/document/[NUMBER]`
3. Použij číslo v proxy URL: `ieeexplore-ieee-org.ezproxy.techlib.cz/document/[NUMBER]`

Příklad:
- Original: `https://ieeexplore.ieee.org/document/8506423`
- Via NTK: `https://ieeexplore-ieee-org.ezproxy.techlib.cz/document/8506423`
