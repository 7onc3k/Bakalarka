=== Analyze: pilot-r1 ===

## P1-P5: Process Compliance

P1 Issues before code: ✅ (issue: 2026-02-23T10:40:08, code: 2026-02-23T11:43:22)
P2 Branch per issue: ❌ (branches: 4, issues: 11)
P3 Test-first commits: ❌ (test: 0, feat: 4)
P4 PRs linked to issues: ✅ (4/4)
P5 No existing test modifications: ❌ (1 files modified)

## Git Stats (informational)

Total commits: 9

Commit prefixes:
  4 feat
  1 Merge pull request #16 from 7onc3k/feature/state-machine
  1 Merge pull request #15 from 7onc3k/feature/business-day-calculator
  1 Merge pull request #14 from 7onc3k/feature/core-types
  1 Merge pull request #13 from 7onc3k/setup/project-typescript-vitest
  1 chore

Issues: 11 (closed: 4)
PRs: 4 (merged: 4)

## Q1: API Contract Match

**Q1: ✅ Exports createInstance and process**

## Q2: Reference Test Pass Rate

 ✓ tests/_ref_tests/cancellation.test.ts  (5 tests) 6ms
 ✓ tests/_ref_tests/payment.test.ts  (7 tests) 6ms
 ❯ tests/_ref_tests/manual-advance.test.ts  (5 tests | 2 failed) 10ms
   ❯ tests/_ref_tests/manual-advance.test.ts > Manual advance > manual advance from ISSUED → DUE_SOON with action
     → expected 'ISSUED' to be 'DUE_SOON' // Object.is equality
   ❯ tests/_ref_tests/manual-advance.test.ts > Manual advance > manual advance from DUE_SOON → OVERDUE
     → expected 'DUE_SOON' to be 'OVERDUE' // Object.is equality
 ❯ tests/_ref_tests/pause-resume.test.ts  (9 tests | 1 failed) 20ms
   ❯ tests/_ref_tests/pause-resume.test.ts > Pause / Resume > resume preserves elapsed time — timeout continues from where it left off
     → expected 'OVERDUE' to be 'GRACE' // Object.is equality

 Test Files  2 failed | 5 passed (7)
      Tests  3 failed | 39 passed (42)
   Start at  13:14:48
   Duration  776ms (transform 523ms, setup 0ms, collect 920ms, tests 56ms, environment 1ms, prepare 1.18s)

**Q2: ❌ 39/42 reference tests pass**

## Q3: Mutation Score (Stryker)

Running Stryker (this may take a few minutes)...
-----------------|--------|---------|----------|-----------|------------|----------|----------|
All files        |  84.02 |   85.03 |      127 |        15 |         25 |        2 |      178 |
 businessDays.ts |  86.11 |   86.11 |       47 |        15 |         10 |        0 |       16 |

**Q3: Mutation score: 84.02%**

## Q5: Lint Warnings

**Q5: Warnings: 2, Errors: 0**

## Q6: Typecheck Errors

**Q6: Typecheck errors: 0, `any` occurrences: 0**

## Q7: Code Complexity

**Q7: Complexity violations (>10): 2**

## Agent's Own Tests (informational)

 ✓ tests/types.test.ts  (12 tests) 6ms
 ✓ tests/businessDays.test.ts  (18 tests) 7ms
 ✓ tests/dunning.test.ts  (29 tests) 13ms

 Test Files  3 passed (3)
      Tests  59 passed (59)
   Start at  13:15:49
   Duration  537ms (transform 166ms, setup 0ms, collect 240ms, tests 26ms, environment 1ms, prepare 286ms)



## E1-E3: Efficiency

E1 Tokens — input: 83,036, output: 60,240, total: 143,276
E2 Duration — 32.7 min
E3 Completion — Completed, 0 compactions
   Session: ses_375eb5affffe4Oef97kBXCo9Hb

## Behavioral Trace

issuesBatchCreated:       true
firstTestCommitBeforeImpl:false
commitCount:              4
branchCount:              5
issueCount:               11
prCount:                  4
todowriteUsed:            true
blobCommit:               false
tddOrderViolations:       4

==========================================
=== Summary: pilot-r1 ===
==========================================

### Process (P1-P8)
| Metrika | Hodnota | Exit kritérium | Pass? |
|---------|---------|----------------|-------|
| P1 Issues before code | issue: 2026-02-23T10:40:08, code: 2026-02-23T11:43:22 | issues pred kodem | ✅ |
| P2 Branch per issue | branches: 4, issues: 11 | branches>=issues | ❌ |
| P3 Test-first commits | test: 0, feat: 4 | test: pred feat: | ❌ |
| P4 PRs linked to issues | 4/4 | vsechny PR linked | ✅ |
| P5 No existing test modifications | 1 files modified | 0 modifikaci | ❌ |
| P6 Commit message quality | judge | ≥2/3 | run judge.ts |
| P7 Issue description quality | 3/3 — All issues have clear descriptions, well-defined scope (one concern per issue), and structured forma... | ≥2/3 | ✅ |
| P8 PR description quality | 2/3 — PR descriptions are well-structured with clear summaries and changes sections. Most PRs properly clo... | ≥2/3 | ✅ |

### Product Quality (Q1-Q8)
| Metric | Value | Exit criterion | Pass? |
|--------|-------|----------------|-------|
| Q1 API contract | match | match | ✅ |
| Q2 Ref tests | 39/42 | 42/42 | ❌ |
| Q3 Mutation score | 84.02% | ≥70% | ✅ |
| Q4 AC coverage | judge | 24/24 | run judge.ts |
| Q5 Lint warnings | 2 | 0 | ❌ |
| Q6 Typecheck errors | 0 | 0 | ✅ |
| Q7 Complexity (>10) | 2 | 0 violations | ❌ |
| Q8 Code quality | 1/3 | ≥2/3 | ❌ |

### Efficiency (E1-E3)
(see above)

### Behavioral Trace
| Fact | Value |
|------|-------|
| issuesBatchCreated | true |
| firstTestCommitBeforeImpl | false |
| commitCount | 4 |
| branchCount | 5 |
| issueCount | 11 |
| prCount | 4 |
| todowriteUsed | true |
| blobCommit | false |
| tddOrderViolations | 4 |

Run judge separately: npx tsx judge.ts pilot-r1