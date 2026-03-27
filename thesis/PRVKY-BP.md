# Vizuální a typografické prvky BP — kdy co použít

## Tabulka (`table`)
**Kdy:** Strukturované srovnání — čísla vedle sebe, kategorie × hodnoty.
**Kdy NE:** Jeden sloupec, málo dat (→ text), narativní obsah (→ odstavec).
**Pravidlo:** Tabulka musí dávat smysl i bez čtení textu (caption + hlavičky stačí). Text říká co z tabulky plyne, NEOPAKUJE čísla.
**V naší BP:** Cross-run tabulka metrik, delta tabulky r1-r5, mapování instrukcí na metriky.

## Obrázek / Diagram (`figure`)
**Kdy:** Proces, flow, vztahy, architektura — co se těžko popisuje slovem. Vizuální srovnání (diff).
**Kdy NE:** Když stačí věta ("systém má 3 komponenty" nepotřebuje diagram).
**Pravidlo:** Caption popisuje CO je na obrázku, ne proč tam je (to říká text). Grayscale-safe pro tisk.
**V naší BP:** Stavový diagram dunning, pipeline měření, diff obrázky AGENTS.md, pgfplots graf metrik.

## Graf (`pgfplots` / chart)
**Kdy:** Trend přes čas/iterace, srovnání distribucí, korelace.
**Kdy NE:** Málo datových bodů (<4) kde stačí tabulka, kategorická data bez pořadí.
**Pravidlo:** Osy popsané, legenda čitelná, grayscale-safe (rozlišuj tvarem markeru, ne jen barvou).
**V naší BP:** Vývoj P compliance / Q2 / Q5 / Q8 přes 9 běhů.

## Poznámka pod čarou (`\footnote{}`)
**Kdy:** Doplňující info které by přerušilo tok hlavní myšlenky — technický detail, upřesnění, odkaz na přílohu.
**Kdy NE:** Důležitá informace (→ do textu), citace (→ \cite{}), opakovaná poznámka (→ do textu jednou).
**Pravidlo:** Max 2-3 na stránku. Pokud jich je víc, obsah patří do textu.
**V naší BP:** "$^\dagger$ Q3 v A-2 nelze měřit: agentovy testy selhávají..."

## Odrážky / Enumerate (`itemize` / `enumerate`)
**Kdy:** Výčet 3+ položek, kroky postupu, seznam kritérií.
**Kdy NE:** Argumentace, narativ, méně než 3 položky (→ věta s čárkami).
**Pravidlo:** Odrážky pro neřazené výčty, enumerate pro pořadí/kroky. Po výčtu vždy navázat textem.
**V naší BP:** 4 pozorování z pilotu, změny instrukcí per iterace, acceptance criteria.

## Příloha (`\appendix`)
**Kdy:** Velké celky na které text odkazuje ale nepatří do hlavního toku — kompletní kód, data, konfigurace.
**Kdy NE:** Obsah který čtenář potřebuje k pochopení hlavního textu (→ do kapitoly).
**Pravidlo:** Vždy odkazovat z hlavního textu ("viz přílohu X"). Příloha nemá obsahovat nic co se neodkazuje.
**V naší BP:** Kompletní AGENTS.md (baseline), specifikace (Issue #1), rubrics pro judge.

## Citace (`\cite{}`)
**Kdy:** Podpora tvrzení externím zdrojem, přiřazení myšlenky autorovi, srovnání s existující prací.
**Kdy NE:** Vlastní pozorování z experimentu (→ odkaz na tabulku/sekci), obecně známé věci.
**Pravidlo:** Primární zdroj > sekundární > terciární. Citovat konkrétní claim, ne celou knihu.

## Kód / Technické termíny
| Formát | Kdy | Příklad |
|--------|-----|---------|
| `\texttt{}` | Příkazy, soubory, proměnné | `\texttt{npx eslint}`, `\texttt{AGENTS.md}` |
| `\textit{}` | Nový pojem při prvním výskytu | \textit{pracovní postup (workflow)} |
| `\textbf{}` | Kód metriky při prvním výskytu v kapitole | \textbf{Q2} |
| `listings` | Delší bloky kódu (>3 řádky) | Nepoužíváme (máme diff obrázky místo toho) |

## Definice / Box
**Kdy:** Formální definice klíčového pojmu, důležitý závěr který si čtenář má zapamatovat.
**Kdy NE:** Běžný text, opakování z jiné kapitoly.
**V naší BP:** Zatím nepoužíváme. Kandidát: definice "verifikační krok" nebo 4 pozorování z pilotu.

## Co v BP NEPOUŽÍVÁME
- **Rovnice** — nemáme matematický model
- **Algoritmus (pseudokód)** — skripty popisujeme slovně + diagramem
- **Sidebar / marginalia** — šablona to nepodporuje
- **Barvy v textu** — raw/draft prostředí je má, ale finální text ne
