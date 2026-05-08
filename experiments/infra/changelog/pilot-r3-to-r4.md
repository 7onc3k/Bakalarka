# Changelog: pilot-r3 → pilot-r4

**Datum:** 2026-03-17
**Zdůvodnění:** DIAGNOSIS.md pilot-r3 (revidovaná)

---

### Fix 1: Pre-PR vitest check

**Bylo (Process bod 4):**
```
4. Before every PR, run these checks and fix all issues before opening:
   - `tsc --noEmit` — zero type errors
   - `npx eslint src/ --max-warnings 0` — zero lint warnings (includes complexity violations)
```

**Je:**
```
4. Before every PR, run these checks and fix all issues before opening:
   - `tsc --noEmit` — zero type errors
   - `npx eslint src/ --max-warnings 0` — zero lint warnings (includes complexity violations)
   - `npx vitest run` — zero test failures
```

**Pozorování (r3):** Agent odevzdával kód bez spuštění vlastních testů jako
posledního kroku. Přidání vitest do pre-PR checklistu zajišťuje, že agent
ověří funkčnost svého kódu před odevzdáním.

**Poznámka:** Tento check spouští agentovy vlastní testy, ne referenční testy
(ty se spouští post-hoc skriptem analyze-run.ts a agent je nevidí).

**Literatura:** Lulla 2026 (quality gate těsně před výstupem)

---

### Fix 2: Dodržení API kontraktu — každé pole musí být použito

**Přidáno do Constraints:**
```
- Every field in the API Contract types must be used in your implementation.
  If the spec defines a field (e.g., `pausedElapsed`), your code must read
  and write it — do not invent an alternative approach.
```

**Pozorování (r3):** Q2 = 41/42. Jediné selhání: agent implementoval
pause/resume elapsed time vlastním přístupem (posunutí stateEnteredAt zpět)
místo použití pole `pausedElapsed` definovaného v API kontraktu. Agentův
přístup fungoval pro jednorázové pozastavení, ale selhal při opakovaném
pause/resume. Spec přitom definuje `pausedElapsed?: number` v typu
DunningState — agent měl toto pole použít.

**Diagnóza:** Problém není v procesním workflow (P1-P5 = 5/5) ale v tom,
že agent ignoroval pole z API kontraktu a nahradil ho vlastním řešením.
Breunig 2025: obecné pravidlo "trace back to spec" nestačí — je třeba
explicitně říct že každé pole v kontraktu musí být použito.

**KOREKCE (2026-03-18):** Diagnóza byla příliš silná. Spec definuje pole `pausedElapsed` v typu `DunningState`, ale neříká explicitně jak ho použít v tick výpočtu. Agent implementoval alternativní přístup (posunutí `stateEnteredAt`), který fungoval pro jednorázové pozastavení. Jde spíše o nejednoznačnost specifikace než o ignorování kontraktu. R4 potvrdil, že pravidlo o kontraktu nepomohlo.

**Literatura:** Breunig 2025
