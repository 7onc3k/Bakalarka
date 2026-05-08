=== Analyze: ablace-b-2 ===

## P1-P5: Process Compliance

P1 Issues before code: ✅ (issue: 2026-03-20T18:47:05, code: 2026-03-20T18:52:48)
P2 Branch per issue: ❌ (branches: 4, issues: 9)
P3 Test-first commits: ✅ (test: 4, feat: 4)
P4 PRs linked to issues: ✅ (4/4)
P5 No existing test modifications: ❌ (1 files modified)

## Git Stats (informational)

Total commits: 15

Commit prefixes:
  4 feat
  4 test
  1 docs
  1 Merge pull request #14 from 7onc3k/issue-5
  1 fix
  1 Merge pull request #13 from 7onc3k/issue-4
  1 Merge pull request #12 from 7onc3k/issue-3
  1 Merge pull request #11 from 7onc3k/issue-2
  1 chore

Issues: 9 (closed: 0)
PRs: 4 (merged: 4)

## Q1: API Contract Match

**Q1: ✅ Exports createInstance and process**

## Q2: Reference Test Pass Rate

   × Happy path escalation > GRACE → REMINDER_1: 7 business days elapsed 1ms
     → expected 'GRACE' to be 'REMINDER_1' // Object.is equality
   × Happy path escalation > REMINDER_1 → REMINDER_2: 14 business days elapsed 1ms
     → expected 'REMINDER_1' to be 'REMINDER_2' // Object.is equality
   × Happy path escalation > REMINDER_2 → FINAL_NOTICE: 14 business days elapsed 1ms
     → expected 'REMINDER_2' to be 'FINAL_NOTICE' // Object.is equality
   × Happy path escalation > FINAL_NOTICE → SUSPENDED: 7 business days elapsed 1ms
     → expected 'REMINDER_2' to be 'SUSPENDED' // Object.is equality
   × Happy path escalation > SUSPENDED → WRITTEN_OFF: 30 business days elapsed 1ms
     → expected 'FINAL_NOTICE' to be 'WRITTEN_OFF' // Object.is equality

 Test Files  7 failed (7)
      Tests  31 failed | 11 passed (42)
   Start at  18:49:23
   Duration  332ms (transform 219ms, setup 0ms, collect 370ms, tests 75ms, environment 1ms, prepare 492ms)

**Q2: ❌ 11/42 reference tests pass**

## Q3: Mutation Score (Stryker)

Running Stryker (this may take a few minutes)...
----------|--------|---------|----------|-----------|------------|----------|----------|
All files |  71.74 |   76.74 |       91 |         8 |         30 |        9 |      187 |
 index.ts |  71.74 |   76.74 |       91 |         8 |         30 |        9 |      187 |

**Q3: Mutation score: 71.74%**

## Q5: Lint Warnings

**Q5: Warnings: 2, Errors: 0**

## Q6: Typecheck Errors

**Q6: Typecheck errors: 0, `any` occurrences: 1**

## Q7: Code Complexity

**Q7: Complexity violations (>10): 2**

## Agent's Own Tests (informational)

 RUN  v2.1.9 /home/dev/code/Bakalarka/experiments/runs/ablace-b-2

 ✓ tests/index.test.ts (32 tests) 13ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  18:50:06
   Duration  291ms (transform 57ms, setup 0ms, collect 53ms, tests 13ms, environment 0ms, prepare 69ms)



## E1-E3: Efficiency

No transcript.json or metrics.csv found

## Behavioral Trace

transcript.json not found — trace unavailable

==========================================
=== Summary: ablace-b-2 ===
==========================================

### Process (P1-P8)
| Metrika | Hodnota | Exit kritérium | Pass? |
|---------|---------|----------------|-------|
| P1 Issues before code | issue: 2026-03-20T18:47:05, code: 2026-03-20T18:52:48 | issues pred kodem | ✅ |
| P2 Branch per issue | branches: 4, issues: 9 | branches>=issues | ❌ |
| P3 Test-first commits | test: 4, feat: 4 | test: pred feat: | ✅ |
| P4 PRs linked to issues | 4/4 | vsechny PR linked | ✅ |
| P5 No existing test modifications | 1 files modified | 0 modifikaci | ❌ |
| P6 Commit message quality | judge | ≥2/3 | run judge.ts |
| P7 Issue description quality | judge | ≥2/3 | run judge.ts |
| P8 PR description quality | judge | ≥2/3 | run judge.ts |

### Product Quality (Q1-Q8)
| Metric | Value | Exit criterion | Pass? |
|--------|-------|----------------|-------|
| Q1 API contract | match | match | ✅ |
| Q2 Ref tests | 11/42 | 42/42 | ❌ |
| Q3 Mutation score | 71.74% | ≥70% | ✅ |
| Q4 AC coverage | judge | 24/24 | run judge.ts |
| Q5 Lint warnings | 2 | 0 | ❌ |
| Q6 Typecheck errors | 0 | 0 | ✅ |
| Q7 Complexity (>10) | 2 | 0 violations | ❌ |
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

Run judge separately: npx tsx judge.ts ablace-b-2