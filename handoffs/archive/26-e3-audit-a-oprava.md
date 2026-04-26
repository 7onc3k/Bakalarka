# 26 — E3 audit a oprava měření

**Datum:** 2026-04-04

## Co se udělalo

### E3 metrika — audit a oprava

**Problém:** E3 (kompakce kontextu) používala snapshot heuristiku — porovnávala `snapshot` hash mezi `step-finish` a `step-start` v `transcript.json`. Zjistili jsme, že `snapshot` sleduje **stav filesystému** (koreluje s `patch.hash`), ne stav konverzačního kontextu. Metrika měřila něco jiného, než tvrdila.

**Ověření:** Prozkoumali jsme OpenCode databázi (`opencode.db`) — tabulka `session` má sloupec `time_compacting` (timestamp kdy kompakce nastala). Výsledek: **`NULL` ve všech session, ve všech 9 bězích** (pilot-r1–r5 + 4 ablace). Potvrzeno i z `opencode.log` (`service=session.compaction pruned=0 total=0`).

**Závěr:** Ke kompakci kontextu nedošlo v žádném běhu. Sessiony byly dostatečně krátké. Hodnota "1" u pilot-r3 byla false positive ze špatné heuristiky.

### Provedené změny v thesis

| Soubor | Co |
|--------|----|
| **makra.tex** | Acro E3: "kompakce kontextu" → "stabilita session" |
| **kap03.tex** (4 místa) | Definice: snapshot heuristika → dotaz do OpenCode DB (`time_compacting`); pipeline, tabulka, RAW TODO |
| **kap04.tex** (8 míst) | Všechny per-run tabulky: "Kompakce kontextu / 0\|1" → "Stabilita session / dokončeno"; souhrnná landscape tabulka: všechny hodnoty "ok"; footnote opravena |
| **kap05.tex** (4 místa) | Efektivita: doplněno DB ověření; Omezení: snapshot→DB; Stabilní metriky: "0–1"→"žádná"; Audit trail aktualizován |
| **TERMINOLOGIE.md** | Popis E3 aktualizován |

### Co se NEZMĚNILO (infra skripty)

Experimentální skripty (`efficiency-from-transcript.ts`, `analyze-run.ts`, `summary.ts`, `shared.ts`) stále obsahují starou snapshot heuristiku. Neopravovali jsme je — výsledky všech běhů jsou finální a skripty se znovu pouštět nebudou.

## Klíčové rozhodnutí

- **E3 přejmenováno** na "stabilita session" — přesnější pro to co metrika skutečně měří (dokončení + absence kompakce)
- **False positive opraven** — r3 "1 kompakce" byla artefakt chybné heuristiky, ne skutečná kompakce
- **DB jako autoritativní zdroj** — `session.time_compacting` je přímý signál od OpenCode, ne heuristika přes transcript

## Technické detaily (pro referenci)

### OpenCode DB schema (relevantní)
```sql
session.time_compacting  -- INTEGER, NULL = žádná kompakce
```

### OpenCode log signál
```
INFO  service=session.compaction pruning
INFO  service=session.compaction pruned=0 total=0 found
```

### Transcript part types
- `step-start` / `step-finish` — lifecycle markers, `snapshot` = filesystem state hash
- `tool` — tool invocation
- `patch` — file changes, `hash` koreluje se `snapshot`
- `text` / `reasoning` — LLM output

### DB dostupnost per run
- **Mají DB:** pilot-r5, ablace-a-1, ablace-a-2, ablace-b-1, ablace-b-2
- **Nemají DB:** pilot-r1–r4 (starší exporty, jen config+transcript)
- Všechny dostupné DB: `time_compacting = NULL`
