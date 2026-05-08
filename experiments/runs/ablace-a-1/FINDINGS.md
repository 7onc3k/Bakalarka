=== Analyze: ablace-a-1 ===

## P1-P5: Process Compliance

P1 Issues before code: ✅ (issue: 2026-03-20T17:49:56, code: 2026-03-20T17:52:59)
P2 Branch per issue: ✅ (branches: 6, issues: 6)
P3 Test-first commits: ✅ (test: 6, feat: 10)
P4 PRs linked to issues: ✅ (6/6)
P5 No existing test modifications: ❌ (1 files modified)

## Git Stats (informational)

Total commits: 17

Commit prefixes:
  10 feat
  6 test
  1 chore

Issues: 6 (closed: 0)
PRs: 6 (merged: 6)

## Q1: API Contract Match

**Q1: ✅ Exports createInstance and process**

## Q2: Reference Test Pass Rate

   × Business days calculation — forward (escalation timeouts) > escalation timeout excludes holidays 1ms
     → expected 'GRACE' to be 'OVERDUE' // Object.is equality
 ❯ tests/_ref_tests/pause-resume.test.ts (9 tests | 2 failed) 12ms
   × Pause / Resume > pause scope: ISSUED cannot be paused 5ms
     → expected 'PAUSED' to be 'ISSUED' // Object.is equality
   × Pause / Resume > pause scope: DUE_SOON cannot be paused 1ms
     → expected 'PAUSED' to be 'DUE_SOON' // Object.is equality
 ❯ tests/_ref_tests/happy-path.test.ts (9 tests | 1 failed) 16ms
   × Happy path escalation > DUE_SOON does NOT transition before due date 7ms
     → expected 'OVERDUE' to be 'DUE_SOON' // Object.is equality

 Test Files  4 failed | 3 passed (7)
      Tests  7 failed | 35 passed (42)
   Start at  18:46:57
   Duration  322ms (transform 182ms, setup 0ms, collect 390ms, tests 69ms, environment 1ms, prepare 487ms)

**Q2: ❌ 35/42 reference tests pass**

## Q3: Mutation Score (Stryker)

Running Stryker (this may take a few minutes)...
-----------------|--------|---------|----------|-----------|------------|----------|----------|
All files        |  61.59 |   63.19 |      183 |        11 |        113 |        8 |      149 |
 businessDays.ts |  67.09 |   72.60 |       42 |        11 |         20 |        6 |       10 |

**Q3: Mutation score: 61.59%**

Installing ESLint + TypeScript support...
Run `npm audit` for details.
## Q5: Lint Warnings

**Q5: Warnings: 4, Errors: 0**

## Q6: Typecheck Errors

**Q6: Typecheck errors: 0, `any` occurrences: 1**

## Q7: Code Complexity

**Q7: Complexity violations (>10): 4**

## Agent's Own Tests (informational)

 ✓ tests/types.test.ts (5 tests) 3ms
 ✓ tests/stateMachine.test.ts (28 tests) 9ms
 ✓ tests/acceptance.test.ts (24 tests) 11ms

 Test Files  4 passed (4)
      Tests  73 passed (73)
   Start at  18:47:59
   Duration  303ms (transform 143ms, setup 0ms, collect 207ms, tests 28ms, environment 1ms, prepare 254ms)



## E1-E3: Efficiency

No transcript.json or metrics.csv found

## Behavioral Trace

transcript.json not found — trace unavailable

==========================================
=== Summary: ablace-a-1 ===
==========================================

### Process (P1-P8)
| Metrika | Hodnota | Exit kritérium | Pass? |
|---------|---------|----------------|-------|
| P1 Issues before code | issue: 2026-03-20T17:49:56, code: 2026-03-20T17:52:59 | issues pred kodem | ✅ |
| P2 Branch per issue | branches: 6, issues: 6 | branches>=issues | ✅ |
| P3 Test-first commits | test: 6, feat: 10 | test: pred feat: | ✅ |
| P4 PRs linked to issues | 6/6 | vsechny PR linked | ✅ |
| P5 No existing test modifications | 1 files modified | 0 modifikaci | ❌ |
| P6 Commit message quality | judge | ≥2/3 | run judge.ts |
| P7 Issue description quality | judge | ≥2/3 | run judge.ts |
| P8 PR description quality | judge | ≥2/3 | run judge.ts |

### Product Quality (Q1-Q8)
| Metric | Value | Exit criterion | Pass? |
|--------|-------|----------------|-------|
| Q1 API contract | match | match | ✅ |
| Q2 Ref tests | 35/42 | 42/42 | ❌ |
| Q3 Mutation score | 61.59% | ≥70% | ❌ |
| Q4 AC coverage | judge | 24/24 | run judge.ts |
| Q5 Lint warnings | 4 | 0 | ❌ |
| Q6 Typecheck errors | 0 | 0 | ✅ |
| Q7 Complexity (>10) | 4 | 0 violations | ❌ |
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

Run judge separately: npx tsx judge.ts ablace-a-1