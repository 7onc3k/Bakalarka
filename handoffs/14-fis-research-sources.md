# Research: „Jak to má být“ (FIS/VŠE) — co máme uložené v repu

Tento soubor je rozcestník na **zdroje požadavků** (formální + obsahové) uložené v repozitáři, aby šlo auditovat `thesis/` offline.

## 1) FIS intranet (primární zdroj pro FIS)
- **Snapshot stránky „Náležitosti bakalářské práce“**: `handoffs/09-fis-nalezitosti-bakalarske-prace.md`
  - Obsahuje odkazy na: doporučení, šablony BP/DP, šablonu autoreferátu, formátování vzorců/modelů, a odkaz na předpis.

## 2) Dokumenty z FIS stránky (stažené CZ verze)
Uloženo pod `handoffs/assets/fis/downloads/` (viz index `handoffs/assets/fis/downloads/INDEX.md`):

- **Doporučení pro tvorbu závěrečných prací na FIS**:
  - PDF: `handoffs/assets/fis/downloads/Doporučení pro tvorbu závěrečných prací na FIS.pdf`
  - Převod do Markdown: `handoffs/10-fis-doporuceni.md`
  - Zdroj (SharePoint, může vyžadovat přihlášení): `https://vse.sharepoint.com/:b:/s/intranet-studenti-FIS/EYILumt5UR1Fv0VV4kuvihAB8xc3Wze5TT91uYmTgFkIzw?e=RAmMsK`
  - Důležitý bod: v části *Originalita* je explicitně uvedeno **citování v souladu s APA 7** a zmínka o pravidlech k použití nástrojů pro generování textu.

- **Formátování vzorců a modelů**:
  - PDF: `handoffs/assets/fis/downloads/Formatovani vzorcu a modelu.pdf`
  - Převod do Markdown: `handoffs/11-fis-formatovani-vzorcu-a-modelu.md`
  - Zdroj (SharePoint, může vyžadovat přihlášení): `https://vse.sharepoint.com/:b:/s/intranet-studenti-FIS/Eex5gunqx99Lt5v4DBcbRcQB-OfGdOir_dXPaBh5fpIAiA?e=zvH22U`

- **Šablona podoby práce (LaTeX) — BP/DP ZIP**:
  - Rozbaleno: `handoffs/assets/fis/downloads/BP-DP/`
  - LaTeX šablona: `handoffs/assets/fis/downloads/BP-DP/SablonaBP-DP/`
  - Důležitý bod: v `.../biblatex-setup.tex` je použito `style=apa`, tj. šablona očekává **APA styl citací**.

- **Šablona autoreferátu (LaTeX) ZIP**:
  - Rozbaleno: `handoffs/assets/fis/downloads/Autoreferat/`

## 3) Veřejné zdroje mimo SharePoint (dohledané a stažené)
Uloženo pod `handoffs/assets/fis/downloads/public/`:

- **Opatření děkana FIS č. 11/2018** (odkazováno z FIS stránky):
  - PDF: `handoffs/assets/fis/downloads/public/Opatreni_2018_11.pdf`
  - Převod do Markdown: `handoffs/12-fis-opatreni-dekana-11-2018.md`
  - Zdroj: `https://fis.vse.cz/wp-content/uploads/page/579/Opatreni_2018_11.pdf`

- **VŠE knihovna — Formální požadavky na závěrečné práce** (veřejná stránka):
  - HTML snapshot: `handoffs/assets/fis/downloads/public/vse-knihovna-formalni-pozadavky.html`
  - Textový snapshot: `handoffs/13-vse-knihovna-formalni-pozadavky.md`

## 4) Co z toho plyne pro náš projekt `thesis/` (rychlé závěry)
- **Citační styl**: oficiální FIS podklady (doporučení + LaTeX šablona) jsou konzistentní v tom, že míří na **APA/APA7**.
  - V aktuálním `thesis/` je nastaven `biblatex` styl `iso-numeric` (číslované ISO 690) → to je pravděpodobný nesoulad k vyřešení.
- **PDF/A**: šablona používá `pdfx` s režimem `a-2u` (PDF/A-2u) a metadatový soubor `prace.xmpdata`.
  - V `thesis/` je potřeba mít vyplněné `Keywords` a `Subject` (ne `TODO`), jinak to půjde do finálních metadat.

## 5) Co ještě typicky v repu chybí (protože je to „tvůj“ artefakt)
- **Zadání práce z InSIS** jako PDF (to není veřejný dokument).
  - Doporučení: uložit ho buď do `thesis/` a vkládat do výsledného PDF, nebo minimálně držet kopii v repu (podle toho, jak to vyžaduje FIS/vedoucí).

