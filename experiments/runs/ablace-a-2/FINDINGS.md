=== Analyze: ablace-a-2 ===

## P1-P5: Process Compliance

P1 Issues before code: ✅ (issue: 2026-03-20T21:13:01, code: 2026-03-20T21:16:11)
P2 Branch per issue: ❌ (branches: 5, issues: 10)
P3 Test-first commits: ❌ (test: 4, feat: 0)
P4 PRs linked to issues: ❌ (0/5)
P5 No existing test modifications: ✅ ()

## Git Stats (informational)

Total commits: 11

Commit prefixes:
  4 test
  1 Merge pull request #16 from 7onc3k/issue-jsdoc
  1 docs
  1 Merge pull request #15 from 7onc3k/issue-5
  1 Merge pull request #14 from 7onc3k/issue-4
  1 Merge pull request #13 from 7onc3k/issue-3
  1 Merge pull request #12 from 7onc3k/issue-2
  1 chore

Issues: 10 (closed: 0)
PRs: 5 (merged: 5)

## Q1: API Contract Match

**Q1: ✅ Exports createInstance and process**

## Q2: Reference Test Pass Rate

     → expected 'DUE_SOON' to be 'ISSUED' // Object.is equality
   × Business days calculation — forward (escalation timeouts) > escalation timeout excludes weekends 1ms
     → expected 'GRACE' to be 'OVERDUE' // Object.is equality
   × Business days calculation — forward (escalation timeouts) > escalation timeout excludes holidays 1ms
     → expected 'GRACE' to be 'OVERDUE' // Object.is equality
 ❯ tests/_ref_tests/manual-advance.test.ts (5 tests | 2 failed) 19ms
   × Manual advance > manual advance from ISSUED → DUE_SOON with action 14ms
     → expected 'ISSUED' to be 'DUE_SOON' // Object.is equality
   × Manual advance > manual advance from DUE_SOON → OVERDUE 1ms
     → expected 'DUE_SOON' to be 'OVERDUE' // Object.is equality

 Test Files  2 failed | 5 passed (7)
      Tests  5 failed | 37 passed (42)
   Start at  18:36:39
   Duration  460ms (transform 366ms, setup 0ms, collect 658ms, tests 72ms, environment 1ms, prepare 740ms)

**Q2: ❌ 37/42 reference tests pass**

## Q3: Mutation Score (Stryker)

Installing Stryker (8) for vitest 0.x...
Run `npm audit` for details.
Running Stryker (this may take a few minutes)...

**Q3: Mutation score: ?**

Installing ESLint + TypeScript support...
Run `npm audit` for details.
## Q5: Lint Warnings

**Q5: Warnings: 3, Errors: 0**

## Q6: Typecheck Errors

**Q6: Typecheck errors: 0, `any` occurrences: 0**

## Q7: Code Complexity

**Q7: Complexity violations (>10): 1**

## Agent's Own Tests (informational)

 ✓ tests/businessDays.test.ts (19 tests) 109ms
 ❯ tests/stateMachine.test.ts (27 tests | 2 failed) 236ms
   × Dunning State Machine > Time-based transitions > should transition from ISSUED to DUE_SOON 7 business days before due date 75ms
     → expected 'ISSUED' to be 'DUE_SOON' // Object.is equality
   × Dunning State Machine > Time-based transitions > should transition from GRACE to REMINDER_1 after 7 business days 21ms
     → expected 'GRACE' to be 'REMINDER_1' // Object.is equality
 Test Files  1 failed | 2 passed (3)
      Tests  2 failed | 48 passed (50)
   Start at  18:38:04
   Duration  3.05s (transform 1.28s, setup 0ms, collect 2.64s, tests 398ms, environment 1ms, prepare 2.05s)
npm test failed — informational only
Command failed: npm test
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/stateMachine.test.ts > Dunning State Machine > Time-based transitions > should transition from ISSUED to DUE_SOON 7 business days before due date
AssertionError: expected 'ISSUED' to be 'DUE_SOON' // Object.is equality

Expected: "DUE_SOON"
Received: "ISSUED"

 ❯ tests/stateMachine.test.ts:56:35
     54|       const sevenDaysBefore = addDays(dueDate, -7)
     55|       const result = process(state, { type: 'tick' }, sevenDaysBefore)
     56|       expect(result.state.status).toBe('DUE_SOON')
       |                                   ^
     57|       expect(result.actions).toHaveLength(1)
     58|       expect(result.actions[0]).toEqual({ type: 'send_email', template…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  tests/stateMachine.test.ts > Dunning State Machine > Time-based transitions > should transition from GRACE to REMINDER_1 after 7 business days
AssertionError: expected 'GRACE' to be 'REMINDER_1' // Object.is equality

Expected: "REMINDER_1"
Received: "GRACE"

 ❯ tests/stateMachine.test.ts:90:35
     88|       const after7Days = addDays(state.stateEnteredAt, 7)
     89|       const result = process(state, { type: 'tick' }, after7Days)
     90|       expect(result.state.status).toBe('REMINDER_1')
       |                                   ^
     91|       expect(result.actions).toHaveLength(1)
     92|       expect(result.actions[0]).toEqual({ type: 'send_email', template…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯



## E1-E3: Efficiency

No transcript.json or metrics.csv found

## Behavioral Trace

transcript.json not found — trace unavailable

==========================================
=== Summary: ablace-a-2 ===
==========================================

### Process (P1-P8)
| Metrika | Hodnota | Exit kritérium | Pass? |
|---------|---------|----------------|-------|
| P1 Issues before code | issue: 2026-03-20T21:13:01, code: 2026-03-20T21:16:11 | issues pred kodem | ✅ |
| P2 Branch per issue | branches: 5, issues: 10 | branches>=issues | ❌ |
| P3 Test-first commits | test: 4, feat: 0 | test: pred feat: | ❌ |
| P4 PRs linked to issues | 0/5 | vsechny PR linked | ❌ |
| P5 No existing test modifications | ok | 0 modifikaci | ✅ |
| P6 Commit message quality | judge | ≥2/3 | run judge.ts |
| P7 Issue description quality | judge | ≥2/3 | run judge.ts |
| P8 PR description quality | judge | ≥2/3 | run judge.ts |

### Product Quality (Q1-Q8)
| Metric | Value | Exit criterion | Pass? |
|--------|-------|----------------|-------|
| Q1 API contract | match | match | ✅ |
| Q2 Ref tests | 37/42 | 42/42 | ❌ |
| Q3 Mutation score | ? | ≥70% | ❌ |
| Q4 AC coverage | judge | 24/24 | run judge.ts |
| Q5 Lint warnings | 3 | 0 | ❌ |
| Q6 Typecheck errors | 0 | 0 | ✅ |
| Q7 Complexity (>10) | 1 | 0 violations | ❌ |
| Q8 Code quality | judge | ≥2/3 | run judge.ts |

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
| todowriteUsed | false |
| blobCommit | null |
| tddOrderViolations | 0 |

_Note: transcript.json not found — trace unavailable_

Run judge separately: npx tsx judge.ts ablace-a-2