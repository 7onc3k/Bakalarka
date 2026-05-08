=== Analyze: ablace-b-1 ===

## P1-P5: Process Compliance

P1 Issues before code: ✅ (issue: 2026-03-20T17:11:20, code: 2026-03-20T17:14:34)
P2 Branch per issue: ✅ (branches: 7, issues: 7)
P3 Test-first commits: ✅ (test: 8, feat: 6)
P4 PRs linked to issues: ❌ (0/7)
P5 No existing test modifications: ❌ (3 files modified)

## Git Stats (informational)

Total commits: 24

Commit prefixes:
  8 test
  6 feat
  1 docs
  1 Merge pull request #15 from 7onc3k/issue-8
  1 Merge pull request #14 from 7onc3k/issue-7
  1 Merge pull request #13 from 7onc3k/issue-6
  1 Merge pull request #12 from 7onc3k/issue-5
  1 Merge branch 'issue-4' into main
  1 Merge pull request #11 from 7onc3k/issue-4
  1 Merge pull request #10 from 7onc3k/issue-3
  1 Merge pull request #9 from 7onc3k/issue-2
  1 chore

Issues: 7 (closed: 0)
PRs: 7 (merged: 7)

## Q1: API Contract Match

**Q1: ✅ Exports createInstance and process**

## Q2: Reference Test Pass Rate

     → expected 'GRACE' to be 'OVERDUE' // Object.is equality
 ✓ tests/_ref_tests/happy-path.test.ts (9 tests) 7ms
 ❯ tests/_ref_tests/manual-advance.test.ts (5 tests | 2 failed) 11ms
   × Manual advance > manual advance from ISSUED → DUE_SOON with action 7ms
     → expected 'ISSUED' to be 'DUE_SOON' // Object.is equality
   × Manual advance > manual advance from DUE_SOON → OVERDUE 1ms
     → expected 'DUE_SOON' to be 'OVERDUE' // Object.is equality
 ❯ tests/_ref_tests/pause-resume.test.ts (9 tests | 1 failed) 12ms
   × Pause / Resume > resume preserves elapsed time — timeout continues from where it left off 6ms
     → expected 'OVERDUE' to be 'GRACE' // Object.is equality

 Test Files  4 failed | 3 passed (7)
      Tests  5 failed | 37 passed (42)
   Start at  18:48:11
   Duration  320ms (transform 204ms, setup 0ms, collect 365ms, tests 56ms, environment 1ms, prepare 467ms)

**Q2: ❌ 37/42 reference tests pass**

## Q3: Mutation Score (Stryker)

Running Stryker (this may take a few minutes)...
------------------|--------|---------|----------|-----------|------------|----------|----------|
All files         |  67.27 |   69.55 |      174 |        11 |         81 |        9 |      228 |
 business-days.ts |  91.30 |   91.30 |       31 |        11 |          4 |        0 |        9 |

**Q3: Mutation score: 67.27%**

## Q5: Lint Warnings

**Q5: Warnings: 2, Errors: 0**

## Q6: Typecheck Errors

**Q6: Typecheck errors: 0, `any` occurrences: 0**

## Q7: Code Complexity

**Q7: Complexity violations (>10): 1**

## Agent's Own Tests (informational)

 ✓ tests/process-tick.test.ts (14 tests) 9ms
 ✓ tests/process-events.test.ts (48 tests) 12ms
 ✓ tests/integration.test.ts (24 tests) 13ms

 Test Files  7 passed (7)
      Tests  129 passed (129)
   Start at  18:49:14
   Duration  406ms (transform 262ms, setup 0ms, collect 561ms, tests 53ms, environment 2ms, prepare 635ms)



## E1-E3: Efficiency

No transcript.json or metrics.csv found

## Behavioral Trace

transcript.json not found — trace unavailable

==========================================
=== Summary: ablace-b-1 ===
==========================================

### Process (P1-P8)
| Metrika | Hodnota | Exit kritérium | Pass? |
|---------|---------|----------------|-------|
| P1 Issues before code | issue: 2026-03-20T17:11:20, code: 2026-03-20T17:14:34 | issues pred kodem | ✅ |
| P2 Branch per issue | branches: 7, issues: 7 | branches>=issues | ✅ |
| P3 Test-first commits | test: 8, feat: 6 | test: pred feat: | ✅ |
| P4 PRs linked to issues | 0/7 | vsechny PR linked | ❌ |
| P5 No existing test modifications | 3 files modified | 0 modifikaci | ❌ |
| P6 Commit message quality | judge | ≥2/3 | run judge.ts |
| P7 Issue description quality | judge | ≥2/3 | run judge.ts |
| P8 PR description quality | judge | ≥2/3 | run judge.ts |

### Product Quality (Q1-Q8)
| Metric | Value | Exit criterion | Pass? |
|--------|-------|----------------|-------|
| Q1 API contract | match | match | ✅ |
| Q2 Ref tests | 37/42 | 42/42 | ❌ |
| Q3 Mutation score | 67.27% | ≥70% | ❌ |
| Q4 AC coverage | judge | 24/24 | run judge.ts |
| Q5 Lint warnings | 2 | 0 | ❌ |
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

Run judge separately: npx tsx judge.ts ablace-b-1