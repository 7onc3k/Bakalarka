# Handoff 12: Pilot-r4 Findings + Otevřené otázky

**Datum:** 2026-02-20
**Kontext:** Po pilot-r4 runu, analýze a opravě infrastruktury

---

## Co se stalo v r4

### Velký pokrok oproti r3
- **Branch-per-issue částečně funguje** — issues #2, #3, #4, #12 měly vlastní branch+PR+merge+close
- **Issues #5-11 combined** do `issue-5-11-dunning-core` — agent zdůvodnil "interdependencí"
- **PR workflow funguje** — 5 PRs merged, 11 issues closed
- **O 49% méně tokenů** (107k vs 209k) — kratší AGENTS.md = efektivnější (Lulla potvrzena)
- **68 testů pass**, ale 10 referenčních testů FAIL (agent má bugy)

### Compliance score: 3/7 ✅, 3/7 ⚠️, 1/7 ❌
- P1 ✅, P2 ✅, P6 ✅
- P3 ⚠️ (combined #5-11), P4 ⚠️ (test modifikace 3×), P7 ⚠️ (blob na combined branch)
- P5 ❌ (separátní commity — `git add -A` bug v AGENTS.md)

### Kritický nález: test oracle problem
- Agent má 68 testů ale AC18 (pause/resume elapsed time) bug prošel nezachycen
- Referenční testy (40, psané člověkem) odhalily 10 bugů
- Mathews 2024 potvrzeno: agent generované testy validují chybné chování

---

## Infrastruktura hotová

### Opravené referenční testy (40 testů, bylo 37)
- Přidány negativní assertions (payment/cancellation non-SUSPENDED nemá resume_service)
- Přidány boundary testy (resume na non-PAUSED, manual_advance na PAUSED, DUE_SOON before due date)
- Stryker config fixnut (nemutuje test soubory)
- Nový baseline: process.ts 91.36%, celkový 74.32%

### analyze-run.sh rozšířen
- **A5: referenční testy** — kopíruje ref testy, adjustuje importy, spustí proti agent kódu
- **A1: Stryker** — nainstaluje pokud chybí, spustí, parsuje score
- Summary tabulka rozšířena o ref tests a mutation score

### Pipeline teď měří
- P2-P7 automaticky (git stats, issues, PRs)
- F1-F3 automaticky (npm test, tsc)
- M1-M4 automaticky (transcript parsing)
- **A5 referenční testy** (NOVÉ)
- **A1 mutation score** (NOVÉ, parsing ještě potřebuje doladit)

---

## Identifikované fixy pro r5

1. **P5: Separátní commity** — explicitní staging (`git add tests/` → commit → `git add src/` → commit) místo `git add -A`
2. **P4: Test modifikace** — MentorScript recovery: "If test fails after implementation, fix src/ not tests/"
3. **P3: Branch combining** — uzavřít rationalization loophole: "Even if issues seem interdependent, implement on separate branches. Each PR builds on the previous."

---

## Otevřené otázky k diskuzi

### 1. Agent issue management — trackuje problémy správně?

Otázky k prozkoumání:
- Když agent narazí na problém při implementaci, vytváří nový issue? Nebo to ignoruje?
- Loguje agent problémy/blockers do issues?
- Jsou issue descriptions dostatečně detailní?
- Jak agent řeší dependencies mezi issues? (v r4 zdůvodnil combined branch "interdependencí" — ale měl si vytvořit dependency graph?)
- Měli bychom v AGENTS.md požadovat: "If you encounter a bug or blocker, create a new issue for it"?
- Issue decomposition kvalita — jsou issues příliš granulární (7 issues pro process())? Nebo je to ok?

### 2. CI/CD a automated review

Otázky k diskuzi:
- **CI přišlo pozdě** — workflow vznikl v poslední PR (#17), předchozí PRs (#13-#16) mergnuty bez CI
- Měl by agent nastavit CI jako první krok (v issue #2: project setup)?
- Měl by `gh pr merge` čekat na CI pass? (V private repo s jedním "developerem" to je formální, ale pro auditovatelnost...)

**Otázka automated review:**
- Měli bychom předem nastavit GitHub Action která spustí review agenta (jiný LLM?) na každý PR?
- Nebo by si to agent měl nastavit sám jako součást CI pipeline?
- Nebo je to mimo scope experimentu? (experiment = jeden agent, ne multi-agent)

**Pro/proti review agent:**
- PRO: reálnější workflow, catch bugy dřív, další data point
- PROTI: komplikuje experiment (další proměnná), agent nečeká na review, free tier limity

### 3. `Closes #N` v PR body

Snadný fix — přidat do AGENTS.md bash bloku:
```bash
gh pr create --title "..." --body "Closes #N"
```
Zlepší traceability PR↔issue. Minimální effort, měřitelný benefit.

### 4. DESIGN.md jako artefakt?

- V r0 agent vytvořil DESIGN.md (bylo požadované v AGENTS.md)
- V r4 to nepožadujeme a agent to nevytvořil
- Je DESIGN.md užitečný artefakt pro experiment? Pro thesis?
- Nebo je to overhead — agent by měl implementovat, ne psát dokumentaci?

---

## Stav experimentu

```
Pilot iterace: r0 → r1 → r2 (crash) → r3 → r4 → r5 (připravuje se)
                                                   ↑ jsme tady

Exit kritérium: 80%+ compliance (7/9)
Aktuální: 5/9 ✅ (+ 3 ⚠️ + 1 ❌)
Potřebujeme: P3, P4, P5 posunout z ⚠️/❌ na ✅
```

### Další kroky
1. Diskutovat otevřené otázky (issue management, CI/CD review, DESIGN.md)
2. Rozhodnout co přidat/nepřidat do AGENTS.md r5
3. Implementovat r5 fixy (P3, P4, P5 + rozhodnuté otevřené otázky)
4. Spustit r5
5. Doladit Stryker parsing v analyze-run.sh
