=== Analyze: pilot-r5 ===

## P1-P5: Process Compliance

P1 Issues before code: ? (could not determine timestamps)
P2 Branch per issue: ❌ (branches: 0, issues: 0)
P3 Test-first commits: ❌ (test: 0, feat: 1)
P4 PRs linked to issues: ❌ (0/0)
P5 No existing test modifications: ✅ ()

## Git Stats (informational)

Total commits: 2

Commit prefixes:
  1 feat
  1 chore

Issues: 0 (closed: 0)
PRs: 0 (merged: 0)

## Q1: API Contract Match

**Q1: ✅ Exports createInstance and process**

## Q2: Reference Test Pass Rate

   × Business days calculation — backward (DUE_SOON) > weekends are excluded from timeout calculation 12ms
     → expected 'DUE_SOON' to be 'ISSUED' // Object.is equality
   × Business days calculation — forward (escalation timeouts) > escalation timeout excludes weekends 2ms
     → expected 'GRACE' to be 'OVERDUE' // Object.is equality
 ❯ tests/_ref_tests/happy-path.test.ts (9 tests | 1 failed) 20ms
   × Happy path escalation > DUE_SOON does NOT transition before due date 10ms
     → expected 'OVERDUE' to be 'DUE_SOON' // Object.is equality
 ❯ tests/_ref_tests/pause-resume.test.ts (9 tests | 1 failed) 23ms
   × Pause / Resume > resume preserves elapsed time — timeout continues from where it left off 10ms
     → expected 'OVERDUE' to be 'GRACE' // Object.is equality

 Test Files  3 failed | 4 passed (7)
      Tests  4 failed | 38 passed (42)
   Start at  13:18:58
   Duration  655ms (transform 541ms, setup 0ms, collect 1.19s, tests 93ms, environment 2ms, prepare 979ms)

**Q2: ❌ 38/42 reference tests pass**

## Q3: Mutation Score (Stryker)

Running Stryker (this may take a few minutes)...

**Q3: Mutation score: ?**

## Q5: Lint Warnings

**Q5: Warnings: 0, Errors: 0**

## Q6: Typecheck Errors

**Q6: Typecheck errors: 0, `any` occurrences: 1**

## Q7: Code Complexity

**Q7: Complexity violations (>10): 0**

## Agent's Own Tests (informational)

   × Time-based transitions - happy path escalation > OVERDUE -> GRACE > should transition to GRACE after 3 business days 1ms
     → expected 'OVERDUE' to be 'GRACE' // Object.is equality
   × Time-based transitions - happy path escalation > GRACE -> REMINDER_1 > should transition to REMINDER_1 after 7 business days 1ms
     → expected 'GRACE' to be 'REMINDER_1' // Object.is equality
   × State transitions preserve data > should preserve dueDate across transitions 0ms
     → expected '2024-01-14T23:00:00.000Z' to be '2024-01-15T00:00:00.000Z' // Object.is equality
 Test Files  1 failed (1)
      Tests  4 failed | 25 passed (29)
   Start at  13:19:10
   Duration  325ms (transform 66ms, setup 0ms, collect 66ms, tests 17ms, environment 0ms, prepare 53ms)
npm test failed — informational only
Command failed: npm test
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/dunning.test.ts > createInstance > should create a dunning instance in ISSUED state
AssertionError: expected '2024-01-14T23:00:00.000Z' to be '2024-01-15T00:00:00.000Z' // Object.is equality

Expected: "2024-01-15T00:00:00.000Z"
Received: "2024-01-14T23:00:00.000Z"

 ❯ tests/dunning.test.ts:40:41
     38|     
     39|     expect(state.status).toBe("ISSUED");
     40|     expect(state.dueDate.toISOString()).toBe("2024-01-15T00:00:00.000Z…
       |                                         ^
     41|     expect(state.stateEnteredAt).toBeInstanceOf(Date);
     42|     expect(state.config).toBeDefined();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  tests/dunning.test.ts > Time-based transitions - happy path escalation > OVERDUE -> GRACE > should transition to GRACE after 3 business days
AssertionError: expected 'OVERDUE' to be 'GRACE' // Object.is equality

Expected: "GRACE"
Received: "OVERDUE"

 ❯ tests/dunning.test.ts:107:35
    105|       const result = process(state, { type: "tick" }, now);
    106|       
    107|       expect(result.state.status).toBe("GRACE");
       |                                   ^
    108|       expect(result.actions).toHaveLength(0);
    109|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  tests/dunning.test.ts > Time-based transitions - happy path escalation > GRACE -> REMINDER_1 > should transition to REMINDER_1 after 7 business days
AssertionError: expected 'GRACE' to be 'REMINDER_1' // Object.is equality

Expected: "REMINDER_1"
Received: "GRACE"

 ❯ tests/dunning.test.ts:124:35
    122|       const result = process(state, { type: "tick" }, now);
    123|       
    124|       expect(result.state.status).toBe("REMINDER_1");
       |                                   ^
    125|       expect(result.actions).toContainEqual({
    126|         type: "send_email",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  tests/dunning.test.ts > State transitions preserve data > should preserve dueDate across transitions
AssertionError: expected '2024-01-14T23:00:00.000Z' to be '2024-01-15T00:00:00.000Z' // Object.is equality

Expected: "2024-01-15T00:00:00.000Z"
Received: "2024-01-14T23:00:00.000Z"

 ❯ tests/dunning.test.ts:520:48
    518|     const result = process(state, { type: "tick" }, addSimpleBusinessD…
    519|     
    520|     expect(result.state.dueDate.toISOString()).toBe(dueDate.toISOStrin…
       |                                                ^
    521|   });
    522| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯



## E1-E3: Efficiency

E1 Tokens — input: 902,190, output: 22,725, total: 924,915
E2 Duration — 13.2 min
E3 Completion — Completed, 0 compactions
   Session: ses_2fd01be49ffe5AknlTtw31u05y

## Behavioral Trace

issuesBatchCreated:       null
firstTestCommitBeforeImpl:null
commitCount:              0
branchCount:              0
issueCount:               0
prCount:                  0
todowriteUsed:            true
blobCommit:               null
tddOrderViolations:       0

==========================================
=== Summary: pilot-r5 ===
==========================================

### Process (P1-P8)
| Metrika | Hodnota | Exit kritérium | Pass? |
|---------|---------|----------------|-------|
| P1 Issues before code | could not determine timestamps | issues pred kodem | ? |
| P2 Branch per issue | branches: 0, issues: 0 | branches>=issues | ❌ |
| P3 Test-first commits | test: 0, feat: 1 | test: pred feat: | ❌ |
| P4 PRs linked to issues | 0/0 | vsechny PR linked | ❌ |
| P5 No existing test modifications | ok | 0 modifikaci | ✅ |
| P6 Commit message quality | 2/3 — Both commits use conventional prefixes (feat:, chore:) and describe the changes, but there are zero ... | ≥2/3 | ✅ |
| P7 Issue description quality | 3/3 — Issue has clear structured format with markdown sections (Requirements, Problem domain, Description)... | ≥2/3 | ✅ |
| P8 PR description quality | judge | ≥2/3 | run judge.ts |

### Product Quality (Q1-Q8)
| Metric | Value | Exit criterion | Pass? |
|--------|-------|----------------|-------|
| Q1 API contract | match | match | ✅ |
| Q2 Ref tests | 38/42 | 42/42 | ❌ |
| Q3 Mutation score | ? | ≥70% | ❌ |
| Q4 AC coverage | 23/24 | 24/24 | ❌ |
| Q5 Lint warnings | 0 | 0 | ✅ |
| Q6 Typecheck errors | 0 | 0 | ✅ |
| Q7 Complexity (>10) | 0 | 0 violations | ✅ |
| Q8 Code quality | 2/3 | ≥2/3 | ✅ |

### Efficiency (E1-E3)
(see above)

### Behavioral Trace
| Fact | Value |
|------|-------|
| issuesBatchCreated | null |
| firstTestCommitBeforeImpl | null |
| commitCount | 0 |
| branchCount | 0 |
| issueCount | 0 |
| prCount | 0 |
| todowriteUsed | true |
| blobCommit | null |
| tddOrderViolations | 0 |

Run judge separately: npx tsx judge.ts pilot-r5