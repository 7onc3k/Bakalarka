# Shrnutí Session (19.01.2026)

## Co jsme dokončili

### 1. Teoretický a Vědecký Rámec
*   Definovali jsme finální téma: **Governance Framework pro autonomní agenty**.
*   Schválili jsme experiment: **Implementace RealWorld App (Medium clone)**.
*   Vypracovali jsme **Research Proposal** (`handoffs/07-BP-skeleton-proposal.md`), který slouží jako podklad pro vedoucího práce.

### 2. Příprava Experimentu (Laboratoř)
*   Založili jsme složku `experiments/realworld-lab`.
*   Stáhli/Vytvořili jsme specifikaci:
    *   `spec/requirements.md`: Textové zadání (User Stories) pro Agenta-Analytika.
    *   `spec/Conduit.postman_collection.json`: Zlatý standard pro Agenta-Vývojáře (testy).

### 3. Příprava Dokumentu (LaTeX)
*   Vytvořili jsme čistou kostru práce ve složce `thesis_skeleton`.
*   Konsolidovali jsme strukturu do jednoho souboru `prace.tex` pro snadnější editaci.
*   Zprovoznili jsme kompilaci (nainstalovali `latexmk`, `biber`, `texlive-bibtex-extra`).
*   Ověřili jsme funkčnost generování PDF.

---

## Co zbývá (Plán pro příští session)

### Build Mode: The Harness
Musíme naprogramovat "dozorčího" (TypeScript skript), který:
1.  Načte `requirements.md`.
2.  Zavolá Agenta (přes Anthropic API).
3.  Uloží vygenerovaný kód.
4.  Spustí Postman testy (`newman`) a vyhodnotí úspěšnost.

### Write Mode: Draft
Začít plnit kapitoly v `thesis_skeleton/prace.tex` (minimálně Úvod a Teorie).

---

## Technické poznámky
*   Pro psaní textu používej **Cursor/VS Code** s rozšířením **LaTeX Workshop**.
*   Pro kompilaci stačí uložit soubor (`Ctrl+S`), nebo v terminálu spustit `./build.sh` (pokud jsi si ho vytvořil), případně `latexmk -pdf prace.tex`.
