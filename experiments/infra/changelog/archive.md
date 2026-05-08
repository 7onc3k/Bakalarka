# Changelog — archiv (r1–r5)

Archivované iterace z experimentální fáze před pilotními běhy s novými metrikami.
Tyto běhy sloužily k validaci infrastruktury, ne jako systematické pilotní iterace.

---

## r4 → r5 (2026-02-20)

Cílené opravy 3 zbývajících compliance problémů (P3, P4, P5) + CI workflow fix.

### Změna 1: Explicit staging místo `git add -A` (P5)

**Bylo (r4):** `git add -A && git commit -m "test: ..."` / `git add -A && git commit -m "feat: ..."`
**Je (r5):** `git add tests/ && git commit -m "test: ..."` / `git add src/ && git commit -m "feat: ..."`

**Pozorování (r4):** Agent psal test + implementaci, pak commitnul vše najednou přes `git add -A`. Druhý commit ("feat:") neměl co stagovat — vše bylo v prvním commitu. Výsledek: 0 separátních test/feat commitů.
**Diagnóza:** `git add -A` je příliš hrubý nástroj — staguje vše bez rozlišení. Explicit staging (`tests/` vs `src/`) mechanicky vynucuje separaci. FSE 2025: directive styl (explicitní příkazy) efektivnější než intent.
**Literatura:** FSE 2025 (Mao et al.): Directive instructions (87%) > Context instructions (56%). Anthropic 2025 Harness: explicit verification steps.

### Změna 2: Uzavření "interdependency" loophole (P3)

**Bylo (r4):** "Never combine multiple issues into one branch. `issue-3-4-combined` is wrong"
**Je (r5):** "Never combine multiple issues into one branch, even if they seem related or interdependent. `issue-5-11-dunning-core` is wrong — implement `issue-5-createinstance`, merge it, then start `issue-6-transitions` from updated main."

**Pozorování (r4):** Agent zdůvodnil kombinování issues #5-11: "they're all interdependent" a "they're all part of implementing the core functionality". Vytvořil branch `issue-5-11-dunning-core` — přesně anti-pattern z constraint. Agent přečetl constraint ale overridnul vlastním úsudkem.
**Diagnóza:** Breunig 2025: agent "fighting the weights" — efektivnostní bias. Negative example z r3 (`issue-3-4-combined`) byl příliš generický, agent ho neaplikoval na svůj případ. Razavi 2025: targeted clarification z konkrétního run chování je efektivnější.
**Literatura:** Breunig 2025/2026, Razavi 2025, FSE 2025 Finding 4 (exclusion constraints)

### Změna 3: Explicitní recovery direction pro test modifikaci (P4)

**Bylo (r4):** "If a test fails after implementation, fix the implementation."
**Je (r5):** "If a test fails after implementation, fix `src/` — never change `tests/`."

**Pozorování (r4):** Agent modifikoval testy 3× po implementaci (msg 70, 115, 121 v transcriptu). Abstraktní "fix the implementation" nezabránilo modifikaci testů.
**Diagnóza:** SASE MentorScript (Hassan 2025): recovery instrukce musí být specifické — "fix X, not Y" je efektivnější než "fix X". Explicitní cesty (`src/` vs `tests/`) nahrazují abstraktní pojmy.
**Literatura:** Hassan et al. 2025 (SASE), Razavi 2025

### Změna 4: CI pipeline do Step 1 + `gh pr checks --watch` (CI)

**Bylo (r4):** Step 3: "Set up GitHub Actions CI. Write a README." / PR merge bez CI čekání.
**Je (r5):** Step 1: "The first issue must be project setup including CI pipeline." / `gh pr checks --watch` před `gh pr merge`.

**Pozorování (r4):** CI vzniklo jako poslední věc (minuta 23.3 z 25.8). Všech 5 PRs mergnutých bez CI (do 5-12 sekund od vytvoření). CI nikdy neběželo na žádném PR.
**Diagnóza:** CI jako finalizační krok = nikdy neslouží jako quality gate. Přesunout na začátek = všechny následující PRs mají CI. `gh pr checks --watch` = agent čeká na CI pass před merge.
**Literatura:** Anthropic 2025 Harness, SASE (Hassan 2025)

### Změna 5: Odstranění redundantního `gh issue close N`

**Bylo (r4):** `gh pr create --title "..." --body "Closes #N"` + `gh issue close N` (oba)
**Je (r5):** Pouze `gh pr create --title "..." --body "Closes #N"` (auto-close přes merge)

**Pozorování (r4):** Agent ignoroval `Closes #N` v PR body (použil vlastní summary), pak manuálně zavíral issues přes `gh issue close`. Výsledek: žádný PR↔issue link v GitHub UI.
**Diagnóza:** Dvě instrukce pro stejný účel = agent si vybere jednu (preferuje manuální). Odstranění redundance = `Closes #N` je jediný mechanismus → musí ho použít. AGENTbench 2026: redundance = primary harm vector.
**Literatura:** AGENTbench 2026 (Chatlatanagulchai et al.)

---

## r3 → r4 (2026-02-20)

Přestrukturování AGENTS.md podle literárních frameworků. Poprvé systematická analýza (viz iteration-procedure.md).

### Změna 1: Přestrukturování podle FSE 2025 component order

**Bylo (r3):** Context (Specification) → Workflow → Output → scattered Constraints
**Je (r4):** Goal (Directive) → Specification (Context) → Environment → Project Structure → Workflow → Constraints

**Pozorování (r3):** Directive ("Satisfy all acceptance criteria") buried na řádku 78. Document začíná Context.
**Diagnóza:** FSE 2025 Finding 1: Role/Directive patří na začátek (p=0.87 / p=0.65). Directive = nejfrekventovanější komponenta (86.7%).
**Literatura:** Mao et al. 2025, FSE

### Změna 2: Přidání Project Structure (Lulla 2026)

**Bylo (r3):** Žádná architektura — agent si vymýšlel file structure.
**Je (r4):** `src/index.ts`, `tests/`, `.github/workflows/` — expected layout.

**Pozorování (r3):** Agent vytvořil vše v `src/index.ts` + `src/index.test.ts` (1 soubor pro vše).
**Diagnóza:** Lulla 2026: architecture info = hlavní driver -28% runtime. Snižuje exploratory navigation.
**Literatura:** Lulla et al. 2026, AGENTbench 2026

### Změna 3: LoopScript → Briefing+Loop+Mentor balance (SASE)

**Bylo (r3):** 65% LoopScript (workflow), 16% BriefingScript (what), 4% MentorScript (constraints).
**Je (r4):** Goal sekce (BriefingScript), zkrácený Workflow (LoopScript), Constraints sekce (MentorScript).

**Pozorování (r3):** Agent nemá recovery path — když se odchýlí, nic ho nekoriguje.
**Diagnóza:** SASE (Hassan 2025): efektivní scaffolding kombinuje všechny 3 script typy. MentorScript = guardrails a error recovery.
**Literatura:** Hassan et al. 2025 (SASE), AGENTbench 2026

### Změna 4: Branch-per-issue — přestrukturování (Breunig)

**Bylo (r3):** Constraint embedded v narrativním textu: "Each issue gets its own branch — never combine multiple issues into one branch."
**Je (r4):** Constraint v Constraints sekci, bash blok s OUTER loop, negative example `issue-3-4-combined`, komentář `# THEN start the next issue from main`

**Pozorování (r2 + r3):** Agent ignoroval constraint přes 2 iterace. Branch `issue-3-4-5-...` v r2, všechno na `issue-2-...` v r3.
**Diagnóza:** Breunig 2025: "fighting the weights" — opakování nefunguje, přestrukturovat. 4 konvergující příčiny: lost-in-the-middle pozice, chybějící outer loop, efektivnostní bias modelu, chybějící negative example.
**Literatura:** Breunig 2025/2026, Razavi 2025, FSE 2025 Finding 4, Liu et al. 2024 "Lost in the Middle"

### Změna 5: Odstranění duplikátů (AGENTbench meta-princip)

**Bylo (r3):** TDD popsáno 2× — v bash bloku (kroky 3-4) i v Testing sekci (body 1-5).
**Je (r4):** TDD 1× v Workflow bash bloku. Testing constraints v Constraints sekci.

**Pozorování (r3):** Dvě popisy TDD cyklu s mírně odlišnou formulací — potenciální zdroj zmatenosti.
**Diagnóza:** AGENTbench 2026: redundance zvyšuje tokeny bez benefitu. Meta-princip: "Kdyby řádek chyběl, udělal by agent neočividnou chybu?"
**Literatura:** AGENTbench 2026 (Chatlatanagulchai et al.)

### Změna 6: Zkrácení celkové délky

**Bylo (r3):** 80 řádků, ~500 slov
**Je (r4):** 60 řádků, ~350 slov

**Diagnóza:** Agent READMEs 2025: median AGENTS.md délka 335-535 slov. Lulla 2026: efektivita je z information density, ne z délky.
**Literatura:** Chatlatanagulchai et al. 2025, Lulla et al. 2026

---

## r2 → r3 (2026-02-20)

### Změna 1: Per-issue cyklus jako kompletní bash sekvence

**Bylo (r2):** Slovní popis "for each issue: create branch, follow TDD, open PR, merge, close"
**Je (r3):** Kompletní bash blok s `git checkout main`, branch creation, test commit, impl commit, PR create, merge, close.

**Pozorování (r2):** Agent provedl git workflow správně pro issue #2, ale necommitl po TDD cyklech na druhé branch. Slovní instrukce "Commit after each test-implementation cycle" ignorována.
**Literatura:** FSE 2025 (Directive > Context), Anthropic 2025 Harness

### Změna 2: "ONE issue per branch" constraint

**Bylo (r2):** Implicitní — "for each issue: create a feature branch" ale bez explicitního zákazu kombinování.
**Je (r3):** "Each issue gets its own branch — never combine multiple issues into one branch."

**Pozorování (r2):** Agent vytvořil branch `issue-3-4-5-types-business-days-createinstance` — sloučil 3 issues do jedné branch.
**Literatura:** Lulla 2026 (explicit scope constraints)

### Změna 3: Oddělené commity pro test a implementaci

**Bylo (r2):** "Commit both the test and implementation"
**Je (r3):** Dva separátní commity v bash bloku — `git commit -m "test: ..."` po red phase, `git commit -m "feat: ..."` po green phase.

**Pozorování (r2):** Agent necommitl vůbec po TDD cyklech. Instrukce "commit both" je ambigní (najednou? zvlášť?).
**Literatura:** RGRC pattern, Pham & Ghaleb 2026

### Změna 4: "NEVER modify a test to match implementation"

**Bylo (r2):** Jen "derive expected values from the spec, not from code" (pozitivní instrukce).
**Je (r3):** Explicitní zákaz: "Never modify a test to make it match your implementation. If a test fails, fix the implementation — not the test."

**Pozorování (r2):** Message 46 — agent upravil failující test assertion aby matchoval output implementace. Porušil test oracle princip.
**Literatura:** Mathews 2024, FSE 2025, AGENTbench 2026

### Změna 5: Explicitní `git checkout main && git pull` na začátku cyklu

**Bylo (r2):** Není — agent pokračoval na stejné branch.
**Je (r3):** `git checkout main && git pull` jako první krok per-issue cyklu.

**Pozorování (r2):** Agent nepřepnul na main mezi issues — pokračoval na sloučené branch.
**Literatura:** Anthropic Harness 2025 (clean state princip)

---

## r1 → r2 (2026-02-19)

### Změna 1: Explicitní `gh issue create` bash ukázka

**Bylo (r1):** "Decompose the spec into sub-issues — decide yourself how to break up the work"
**Je (r2):** Bash blok s `gh issue create --title "..." --body "..."`

**Pozorování (r1):** Agent interpretoval "decompose" jako mentální operaci (todowrite), ne GitHub akci.
**Výsledek (r2):** ✅ Agent vytvořil 12 issues přes `gh issue create`.

### Změna 2: Silnější TDD directive

**Bylo (r1):** "Follow Test-Driven Development from the specification"
**Je (r2):** "Do not write any implementation code until you have a failing test for it." + explicitní `npm test` verify kroky

**Pozorování (r1):** impl-first navzdory TDD instrukci.
**Výsledek (r2):** ⬆ Částečně test-first.

### Změna 3: Vitest do spec (Issue #1)

**Bylo (r1):** Framework nespecifikován.
**Je (r2):** "Use Vitest for testing (not Jest). Use TypeScript with ESM." přidáno do Issue #1 Technical Requirements.

**Pozorování (r1):** Agent zvolil Jest.
**Výsledek (r2):** ✅ Agent použil Vitest.
