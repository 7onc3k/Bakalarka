=== Analyze: pilot-r2 ===

## P1-P5: Process Compliance

P1 Issues before code: ✅ (issue: 2026-03-05T13:46:44, code: 2026-03-05T13:51:06)
P2 Branch per issue: ❌ (branches: 3, issues: 7)
P3 Test-first commits: ❌ (test: 3, feat: 0)
P4 PRs linked to issues: ✅ (3/3)
P5 No existing test modifications: ✅ ()

## Git Stats (informational)

Total commits: 7

Commit prefixes:
  3 test
  1 Merge pull request #11 from 7onc3k/issue-4
  1 Merge pull request #10 from 7onc3k/issue-3
  1 Merge pull request #9 from 7onc3k/issue-2
  1 chore

Issues: 7 (closed: 3)
PRs: 3 (merged: 3)

## Q1: API Contract Match

**Q1: ✅ Exports createInstance and process**

## Q2: Reference Test Pass Rate

     → expected 'PAID' to be 'WRITTEN_OFF' // Object.is equality
 ❯ tests/_ref_tests/happy-path.test.ts (9 tests | 4 failed) 17ms
   × Happy path escalation > REMINDER_1 → REMINDER_2: 14 business days elapsed 6ms
     → expected 'REMINDER_1' to be 'REMINDER_2' // Object.is equality
   × Happy path escalation > REMINDER_2 → FINAL_NOTICE: 14 business days elapsed 2ms
     → expected 'REMINDER_1' to be 'FINAL_NOTICE' // Object.is equality
   × Happy path escalation > FINAL_NOTICE → SUSPENDED: 7 business days elapsed 1ms
     → expected 'REMINDER_1' to be 'SUSPENDED' // Object.is equality
   × Happy path escalation > SUSPENDED → WRITTEN_OFF: 30 business days elapsed 1ms
     → expected 'REMINDER_2' to be 'WRITTEN_OFF' // Object.is equality

 Test Files  5 failed | 2 passed (7)
      Tests  10 failed | 32 passed (42)
   Start at  13:15:56
   Duration  482ms (transform 310ms, setup 0ms, collect 662ms, tests 80ms, environment 1ms, prepare 717ms)

**Q2: ❌ 32/42 reference tests pass**

## Q3: Mutation Score (Stryker)

Running Stryker (this may take a few minutes)...
-----------------|--------|---------|----------|-----------|------------|----------|----------|
All files        |  68.42 |   76.02 |      121 |         9 |         41 |       19 |      177 |
 businessDays.ts |  84.51 |   84.51 |       51 |         9 |         11 |        0 |       21 |

**Q3: Mutation score: 68.42%**

## Q5: Lint Warnings

**Q5: Warnings: 1, Errors: 0**

## Q6: Typecheck Errors

**Q6: Typecheck errors: 0, `any` occurrences: 0**

## Q7: Code Complexity

**Q7: Complexity violations (>10): 0**

## Agent's Own Tests (informational)

 ✓ tests/types.test.ts (18 tests) 10ms
 ✓ tests/events.test.ts (17 tests) 21ms
 ✓ tests/stateMachine.test.ts (16 tests) 25ms

 Test Files  4 passed (4)
      Tests  70 passed (70)
   Start at  13:16:58
   Duration  485ms (transform 238ms, setup 0ms, collect 432ms, tests 66ms, environment 1ms, prepare 273ms)



## E1-E3: Efficiency

E1 Tokens — input: 339,564, output: 40,545, total: 380,109
E2 Duration — 37.2 min
E3 Completion — Completed, 0 compactions
   Session: ses_341c1a1a7ffetyA9RydgXAevJX

## Behavioral Trace

issuesBatchCreated:       true
firstTestCommitBeforeImpl:true
commitCount:              4
branchCount:              4
issueCount:               8
prCount:                  3
todowriteUsed:            true
blobCommit:               false
tddOrderViolations:       0

==========================================
=== Summary: pilot-r2 ===
==========================================

### Process (P1-P8)
| Metrika | Hodnota | Exit kritérium | Pass? |
|---------|---------|----------------|-------|
| P1 Issues before code | issue: 2026-03-05T13:46:44, code: 2026-03-05T13:51:06 | issues pred kodem | ✅ |
| P2 Branch per issue | branches: 3, issues: 7 | branches>=issues | ❌ |
| P3 Test-first commits | test: 3, feat: 0 | test: pred feat: | ❌ |
| P4 PRs linked to issues | 3/3 | vsechny PR linked | ✅ |
| P5 No existing test modifications | ok | 0 modifikaci | ✅ |
| P6 Commit message quality | 2/3 — All commits have conventional prefixes (test:, chore:) and are atomic with clear descriptions of wha... | ≥2/3 | ✅ |
| P7 Issue description quality | 2/3 — Issues have clear descriptions with acceptance criteria and well-defined scope (one concern per issu... | ≥2/3 | ✅ |
| P8 PR description quality | 3/3 — All three PRs have clear descriptive titles, structured Summary sections with bullet points explaini... | ≥2/3 | ✅ |

### Product Quality (Q1-Q8)
| Metric | Value | Exit criterion | Pass? |
|--------|-------|----------------|-------|
| Q1 API contract | match | match | ✅ |
| Q2 Ref tests | 32/42 | 42/42 | ❌ |
| Q3 Mutation score | 68.42% | ≥70% | ❌ |
| Q4 AC coverage | 24/24 | 24/24 | ✅ |
| Q5 Lint warnings | 1 | 0 | ❌ |
| Q6 Typecheck errors | 0 | 0 | ✅ |
| Q7 Complexity (>10) | 0 | 0 violations | ✅ |
| Q8 Code quality | 1/3 | ≥2/3 | ❌ |

### Efficiency (E1-E3)
(see above)

### Behavioral Trace
| Fact | Value |
|------|-------|
| issuesBatchCreated | true |
| firstTestCommitBeforeImpl | true |
| commitCount | 4 |
| branchCount | 4 |
| issueCount | 8 |
| prCount | 3 |
| todowriteUsed | true |
| blobCommit | false |
| tddOrderViolations | 0 |

Run judge separately: npx tsx judge.ts pilot-r2