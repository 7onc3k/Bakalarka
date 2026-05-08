=== Analyze: pilot-r3 ===

## P1-P5: Process Compliance

P1 Issues before code: ✅ (issue: 2026-03-05T20:25:10, code: 2026-03-05T20:27:14)
P2 Branch per issue: ✅ (branches: 4, issues: 4)
P3 Test-first commits: ✅ (test: 4, feat: 4)
P4 PRs linked to issues: ✅ (4/4)
P5 No existing test modifications: ✅ ()

## Git Stats (informational)

Total commits: 14

Commit prefixes:
  4 feat
  4 test
  1 docs
  1 Merge pull request #9 from 7onc3k/issue-8
  1 Merge pull request #7 from 7onc3k/issue-6
  1 Merge pull request #5 from 7onc3k/issue-4
  1 Merge pull request #3 from 7onc3k/issue-2
  1 chore

Issues: 4 (closed: 4)
PRs: 4 (merged: 4)

## Q1: API Contract Match

**Q1: ✅ Exports createInstance and process**

## Q2: Reference Test Pass Rate


 ✓ tests/_ref_tests/business-days.test.ts (5 tests) 9ms
 ✓ tests/_ref_tests/configurable-timeouts.test.ts (2 tests) 7ms
 ✓ tests/_ref_tests/happy-path.test.ts (9 tests) 9ms
 ✓ tests/_ref_tests/manual-advance.test.ts (5 tests) 6ms
 ✓ tests/_ref_tests/payment.test.ts (7 tests) 11ms
 ✓ tests/_ref_tests/cancellation.test.ts (5 tests) 16ms
 ❯ tests/_ref_tests/pause-resume.test.ts (9 tests | 1 failed) 16ms
   × Pause / Resume > resume preserves elapsed time — timeout continues from where it left off 8ms
     → expected 'OVERDUE' to be 'GRACE' // Object.is equality

 Test Files  1 failed | 6 passed (7)
      Tests  1 failed | 41 passed (42)
   Start at  13:17:05
   Duration  591ms (transform 457ms, setup 0ms, collect 842ms, tests 74ms, environment 2ms, prepare 798ms)

**Q2: ❌ 41/42 reference tests pass**

## Q3: Mutation Score (Stryker)

Running Stryker (this may take a few minutes)...
-----------------|--------|---------|----------|-----------|------------|----------|----------|
All files        |  71.35 |   75.78 |      108 |        14 |         39 |       10 |      216 |
 businessDays.ts |  90.57 |   90.57 |       34 |        14 |          5 |        0 |       10 |

**Q3: Mutation score: 71.35%**

## Q5: Lint Warnings

**Q5: Warnings: 1, Errors: 0**

## Q6: Typecheck Errors

**Q6: Typecheck errors: 0, `any` occurrences: 0**

## Q7: Code Complexity

**Q7: Complexity violations (>10): 1**

## Agent's Own Tests (informational)

 ✓ tests/types.test.ts (13 tests) 14ms
 ✓ tests/businessDays.test.ts (20 tests) 10ms
 ✓ tests/dunning.test.ts (30 tests) 34ms

 Test Files  4 passed (4)
      Tests  65 passed (65)
   Start at  13:18:22
   Duration  663ms (transform 284ms, setup 0ms, collect 371ms, tests 62ms, environment 1ms, prepare 449ms)



## E1-E3: Efficiency

E1 Tokens — input: 124,035, output: 30,471, total: 154,506
E2 Duration — 24.8 min
E3 Completion — Completed, 1 compaction
   Session: ses_34053819cffeeTc0Qa51qgOnkD

## Behavioral Trace

issuesBatchCreated:       false
firstTestCommitBeforeImpl:true
commitCount:              10
branchCount:              4
issueCount:               4
prCount:                  4
todowriteUsed:            true
blobCommit:               false
tddOrderViolations:       1

==========================================
=== Summary: pilot-r3 ===
==========================================

### Process (P1-P8)
| Metrika | Hodnota | Exit kritérium | Pass? |
|---------|---------|----------------|-------|
| P1 Issues before code | issue: 2026-03-05T20:25:10, code: 2026-03-05T20:27:14 | issues pred kodem | ✅ |
| P2 Branch per issue | branches: 4, issues: 4 | branches>=issues | ✅ |
| P3 Test-first commits | test: 4, feat: 4 | test: pred feat: | ✅ |
| P4 PRs linked to issues | 4/4 | vsechny PR linked | ✅ |
| P5 No existing test modifications | ok | 0 modifikaci | ✅ |
| P6 Commit message quality | 3/3 — All commits use conventional prefixes (feat:, test:, fix:, chore:). Test commits (test:) are consist... | ≥2/3 | ✅ |
| P7 Issue description quality | 3/3 — All issues have clear, descriptive titles with well-structured bodies containing specific acceptance... | ≥2/3 | ✅ |
| P8 PR description quality | 3/3 — All PRs have clear 'Closes #N' references linking to their issues, descriptive summaries explaining ... | ≥2/3 | ✅ |

### Product Quality (Q1-Q8)
| Metric | Value | Exit criterion | Pass? |
|--------|-------|----------------|-------|
| Q1 API contract | match | match | ✅ |
| Q2 Ref tests | 41/42 | 42/42 | ❌ |
| Q3 Mutation score | 71.35% | ≥70% | ✅ |
| Q4 AC coverage | 24/24 | 24/24 | ✅ |
| Q5 Lint warnings | 1 | 0 | ❌ |
| Q6 Typecheck errors | 0 | 0 | ✅ |
| Q7 Complexity (>10) | 1 | 0 violations | ❌ |
| Q8 Code quality | 3/3 | ≥2/3 | ✅ |

### Efficiency (E1-E3)
(see above)

### Behavioral Trace
| Fact | Value |
|------|-------|
| issuesBatchCreated | false |
| firstTestCommitBeforeImpl | true |
| commitCount | 10 |
| branchCount | 4 |
| issueCount | 4 |
| prCount | 4 |
| todowriteUsed | true |
| blobCommit | false |
| tddOrderViolations | 1 |

Run judge separately: npx tsx judge.ts pilot-r3