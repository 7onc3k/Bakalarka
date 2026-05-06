# Handoff 38 — kap04 e2e konzistence (findings/delta/ablace) — 2026-05-06

## Branch
`cleanup/kap04-redundance` (PR #50)

## Co bylo uděláno

E2E konzistence kap04: findings ↔ delta tabulky ↔ závěry ↔ ablace prose.

### A. Findings tabulky

- **r1 findings**: sloučeno Q5+Q7 (sdílí mechanismus = lint nespouštěný), přidáno samostatné Q4 (AC pokrytí); pokrývá teď všech 5 Q selhání + 3 P selhání
- **r5 findings**: vyhozeny 2 pozitivní řádky (Q5/Q7 zabrala, Q5/Q6 dodrženy); P1+P2+P3+P4+P8 sloučené
- **r4 findings**: přidány 2 řádky — P2+P5 (mezi-běhová variabilita), Q8 (JSDoc na utility funkcích — mechanismus z judge artefaktu)

### B. Delta tabulky (nová struktura)

- **r2 delta**: restrukturalizace na 3 bloky:
  ```
  [Přetrvávající selhání: P2, P3, Q8]
  [Změna proti r1: Q2/Q3 regrese, P5/Q5/Q7 zlepšení]
  [Záznam: E1, E2]
  ```
- **r3 delta**: přidán Q7 (mírná regrese 0→1)
- **r4 delta**: přidána poznámka pod tab — *"Q3 = n/a, agentovy testy selhávají, Stryker vyžaduje funkční suite"* (oprava chybného "timeout")
- **r5 delta**: přidány P1, P8, Q3 regrese + analogická Q3 poznámka

### C. Závěry/intervence (konzistence findings ↔ závěry)

- **r1 závěry**: doplněno Q4 + Q8 — proč zůstávají deklarativní (vyhodnotí se v r2)
- **r2 závěry**: doplněna věta o Q2/Q3 — nepřímý efekt přes test-fix cyklus z kontrolního git logu
- **r3 závěry**: doplněna věta o Q7 mírné regrese (variabilita, neřešíme samostatně)
- **r5 závěr pilotní fáze**: doplněna věta o ESLint pravidle (jednokrokové verifikace zafungovaly i při selhání procesu)

### D. Ablace prose (restrukturalizace + faktické opravy)

- **Ablace A interpretace**: 4 odstavce
  1. Q5/Q7/Q2/Q3 pokles → eslint nespouští sám
  2. **NEW** Q8 mechanismy (A-1: type bypass `as unknown`, A-2: monolitní + duplicitní helpery)
  3. Procesní variabilita — **faktická oprava** "A-1 dodržel kompletně" → "kromě modifikace testů (P5=×)"
  4. Test cykly — **číselná oprava** "44 vs ~20" → "A-1: 25, A-2: 20, B-1: 20, B-2: 12; ~40% více" (ověřeno z `.opencode/opencode.db` per-běh)

- **Ablace B interpretace**: 5 odstavců
  1. Q5/Q6/Q7 stabilní → konvence z tréninku
  2. **NEW** Q8 split: B-2 single-file monolith, B-1 judge timeout
  3. Q2 variabilita 37 vs 11 → nedeterminismus
  4. **NEW** P2/P4 procesní variabilita + sdílená P8 regrese (3/3→2/3)
  5. P5 selhání → nedeterminismus

### E. Cross-run heatmap

- Q3 footnote sjednoceno — "Stryker nedokončil analýzu, agentovy testy selhávají" pro r4, r5, A-2 (jeden marker `$^*$`, jedno vysvětlení)

### F. Stylistické / terminologické

- "**Litera**" → "**formálně**" (2 výskyty: findings line 242, závěry line 251) — odstranění idiomu, uživatel ho nezná
- "**API contract**" (EN inline) → "**API kontrakt**" (line 422)
- "**veřejném API**" → "**veřejných funkcích z API kontraktu**" (Q8 finding line 162) — unifikace na "API kontrakt"
- **E1 hodnoty komprimovány**: `115 / 60 / 11528` → `115/60/11528` (7 řádků; sed regex `[0-9]+ / [0-9]+ / [0-9]+`); header "Vstup / výstup / cache" zachován

### G. Layout

- **Obrázek 4.5** (`fig:agents-diff-r3-r5`): `[tbp]` → `[H]` (force here = na konec odstavce)

## Subagenty použité

1. **Stryker Q3 r4/r5 investigation** — zjistil že "timeout" v r4/r5 byl můj omyl; skutečný důvod = nefunkční testy (stejný mechanismus jako Ablace A-2)
2. **Q8 mechanism + vitest count verification** — Q8 mechanismy potvrzené per-běh (r4: JSDoc, A-1: type bypass, A-2: monolit, B-2: single-file, B-1: judge timeout); vitest count NEVĚŘIL — ověřil jsem sám sql query do `.opencode/opencode.db`

## Vitest count verifikace (skript pro repro)

```ts
// /tmp/vitest-count.ts
import { Database } from "bun:sqlite";
const sessions = {
  "ablace-a-1": "ses_2f3a26720ffectwX9QDmHi0bjw",
  "ablace-a-2": "ses_2f2e8427dffeJb2IrltRj90ht4",
  "ablace-b-1": "ses_2f3c5c1bdffeIuzqSepFFvp6Zr",  // 2nd most recent
  "ablace-b-2": "ses_2f36e0388ffeZV2KffhEaga5m0",
};
// Query bash tool calls, count vitest|npm test invocations
```

Výsledky:
| Run | bash | test_any | vitest | npm test | tsc | eslint |
|---|---|---|---|---|---|---|
| A-1 | 82 | **25** | 4 | 21 | 0 | 0 |
| A-2 | 86 | **20** | 5 | 16 | 0 | 0 |
| B-1 | 107 | **20** | 20 | 0 | 12 | 17 |
| B-2 | 73 | **12** | 2 | 10 | 9 | 1 |

Interpretace: A bez verifikace průměr 22.5 testů, B s verifikací průměr 16. Ratio ~1.4× (ne 2× jak text tvrdil). B používá chained `tsc && eslint && vitest` pattern — to vysvětluje strukturní funkci.

## Nedodělané věci

### 🔴 Blokující commit/release — nic

### 🟡 K dořešení později (jednotlivé otevřené body)

1. **Memory update**: `~/.claude/projects/-home-dev-code-Bakalarka/memory/kap04_iteration_anatomy.md`
   - Stale column order: memory tvrdí `Pozorované chování | Metriky | Příčina`, skutečnost je `Metriky | Pozorované chování | Příčina`
   - Doplnit nové pravidlo: **Delta tabulka = vývoj sledovaných metrik** se 3 bloky (Přetrvávající selhání / Změna proti rN-1 / Záznam)
   - Doplnit pravidlo "přetrvávající" = *předchozí iterace identifikovala finding + tato iterace hodnotu nezměnila*
   - Doplnit pragmatické pravidlo pro "kdy přidat řádek" do findings tabulky

2. **Underfull hboxy** v PDF (~9 ks na řádcích 388, 469, 608, 612, 685 atd.) — kosmetika tabularx layoutu po editech, neblokuje obsah

3. **Q1 barva** v cross-run heatmap (`\cna{match}` neutral) vs r1 main tabulka (`\checkmark` v sloupci "Splněno?") — drobnost, dvě prezentace stejné metriky vypadají jinak. Buď harmonizovat na exit (`\cgood{match}` v cross-run), nebo na deskriptivní (vyhodit `\checkmark` z r1 main).

4. **P6 v r1 main tabulce = n/a** — pozůstatek z původního judge selhání. Předtím "to je v pořádku pro teď". Visí to jako otevřená drobnost.

5. **Ablace findings tabulky** (strukturální otázka) — currently prose (5 odstavců A, 5 odstavců B). Nebylo požadováno převést na findings tabulky. Pokud later chceš plnou paralelu s pilotem, je to možnost.

### 🟢 Volitelné drobnosti

- **r5 závěr pilotní fáze**: zmínka že "Q5/Q7 ESLint pravidlo zabralo" (přidána touto session) — možná by stálo zkontrolovat tón vůči pravidlu *"no positive changes in findings/závěry pure"*. Aktuálně OK protože je to v interpretaci úspěchu intervence.

- **r3 prose pozitivní bridge** — "Tři změny zabraly" — diskutovali jsme, výsledek: nechat (prose smí, tabulka ne). Pokud chceš ještě sjednotit tón, viz handoff 36 / 37.

## Subagent reporty (raw)

Uloženy v session transcriptu. Klíčová zjištění extracted výše.
