=== Analyze: pilot-r4 ===

## P1-P5: Process Compliance

P1 Issues before code: ✅ (issue: 2026-03-17T19:19:18, code: 2026-03-17T19:22:28)
P2 Branch per issue: ❌ (branches: 4, issues: 6)
P3 Test-first commits: ✅ (test: 3, feat: 4)
P4 PRs linked to issues: ✅ (4/4)
P5 No existing test modifications: ❌ (2 files modified)

## Git Stats (informational)

Total commits: 13

Commit prefixes:
  4 feat
  3 test
  1 docs
  1 Merge pull request #11 from 7onc3k/issue-6
  1 Merge pull request #10 from 7onc3k/issue-5
  1 Merge pull request #9 from 7onc3k/issue-4
  1 Merge pull request #8 from 7onc3k/issue-2
  1 chore

Issues: 6 (closed: 4)
PRs: 4 (merged: 4)

## Q1: API Contract Match

**Q1: ✅ Exports createInstance and process**

## Q2: Reference Test Pass Rate

 ✓ tests/_ref_tests/manual-advance.test.ts (5 tests) 8ms
 ❯ tests/_ref_tests/business-days.test.ts (5 tests | 1 failed) 19ms
   × Business days calculation — forward (escalation timeouts) > escalation timeout excludes weekends 12ms
     → expected 'GRACE' to be 'OVERDUE' // Object.is equality
 ❯ tests/_ref_tests/pause-resume.test.ts (9 tests | 1 failed) 27ms
   × Pause / Resume > resume preserves elapsed time — timeout continues from where it left off 17ms
     → expected 'OVERDUE' to be 'GRACE' // Object.is equality
 ❯ tests/_ref_tests/happy-path.test.ts (9 tests | 1 failed) 27ms
   × Happy path escalation > DUE_SOON does NOT transition before due date 18ms
     → expected 'OVERDUE' to be 'DUE_SOON' // Object.is equality

 Test Files  3 failed | 4 passed (7)
      Tests  3 failed | 39 passed (42)
   Start at  13:18:30
   Duration  748ms (transform 402ms, setup 0ms, collect 991ms, tests 103ms, environment 2ms, prepare 1.10s)

**Q2: ❌ 39/42 reference tests pass**

## Q3: Mutation Score (Stryker)

Running Stryker (this may take a few minutes)...

**Q3: Mutation score: ?**

## Q5: Lint Warnings

**Q5: Warnings: 1, Errors: 0**

## Q6: Typecheck Errors

**Q6: Typecheck errors: 0, `any` occurrences: 1**

## Q7: Code Complexity

**Q7: Complexity violations (>10): 1**

## Agent's Own Tests (informational)

 RUN  v2.1.9 /home/dev/code/Bakalarka/experiments/runs/pilot-r4
 ✓ tests/createInstance.test.ts (4 tests) 7ms
 ❯ tests/businessDays.test.ts (15 tests | 1 failed) 20ms
   × businessDays > addBusinessDays > should add 0 business days to return same date 13ms
     → expected 1767913200000 to be 1767916800000 // Object.is equality
 ✓ tests/process.test.ts (27 tests) 26ms
 Test Files  1 failed | 2 passed (3)
      Tests  1 failed | 45 passed (46)
   Start at  13:18:52
   Duration  625ms (transform 246ms, setup 0ms, collect 362ms, tests 53ms, environment 1ms, prepare 298ms)
npm test failed — informational only
Command failed: npm test
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/businessDays.test.ts > businessDays > addBusinessDays > should add 0 business days to return same date
AssertionError: expected 1767913200000 to be 1767916800000 // Object.is equality

- Expected
+ Received

- 1767916800000
+ 1767913200000

 ❯ tests/businessDays.test.ts:9:32
      7|       const friday = new Date('2026-01-09'); // Friday
      8|       const result = addBusinessDays(friday, 0);
      9|       expect(result.getTime()).toBe(friday.getTime());
       |                                ^
     10|     });
     11| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯



## E1-E3: Efficiency

E1 Tokens — input: 1,572,952, output: 36,301, total: 1,609,253
E2 Duration — 25.9 min
E3 Completion — Completed, 0 compactions
   Session: ses_302c3d843ffepZtqNQ4gXxhVfo

## Behavioral Trace

issuesBatchCreated:       true
firstTestCommitBeforeImpl:false
commitCount:              9
branchCount:              4
issueCount:               6
prCount:                  4
todowriteUsed:            true
blobCommit:               false
tddOrderViolations:       1

==========================================
=== Summary: pilot-r4 ===
==========================================

### Process (P1-P8)
| Metrika | Hodnota | Exit kritérium | Pass? |
|---------|---------|----------------|-------|
| P1 Issues before code | issue: 2026-03-17T19:19:18, code: 2026-03-17T19:22:28 | issues pred kodem | ✅ |
| P2 Branch per issue | branches: 4, issues: 6 | branches>=issues | ❌ |
| P3 Test-first commits | test: 3, feat: 4 | test: pred feat: | ✅ |
| P4 PRs linked to issues | 4/4 | vsechny PR linked | ✅ |
| P5 No existing test modifications | 2 files modified | 0 modifikaci | ❌ |
| P6 Commit message quality | 3/3 — All commits use conventional prefixes (feat:, test:, docs:, chore:). Both test: and feat: prefixes a... | ≥2/3 | ✅ |
| P7 Issue description quality | 3/3 — All issues have clear descriptions with context, well-defined acceptance criteria, and focused scope... | ≥2/3 | ✅ |
| P8 PR description quality | 3/3 — All PRs have clear descriptions with bullet points explaining what changed, proper 'Closes #N' refer... | ≥2/3 | ✅ |

### Product Quality (Q1-Q8)
| Metric | Value | Exit criterion | Pass? |
|--------|-------|----------------|-------|
| Q1 API contract | match | match | ✅ |
| Q2 Ref tests | 39/42 | 42/42 | ❌ |
| Q3 Mutation score | ? | ≥70% | ❌ |
| Q4 AC coverage | 24/24 | 24/24 | ✅ |
| Q5 Lint warnings | 1 | 0 | ❌ |
| Q6 Typecheck errors | 0 | 0 | ✅ |
| Q7 Complexity (>10) | 1 | 0 violations | ❌ |
| Q8 Code quality | 2/3 | ≥2/3 | ✅ |

### Efficiency (E1-E3)
(see above)

### Behavioral Trace
| Fact | Value |
|------|-------|
| issuesBatchCreated | true |
| firstTestCommitBeforeImpl | false |
| commitCount | 9 |
| branchCount | 4 |
| issueCount | 6 |
| prCount | 4 |
| todowriteUsed | true |
| blobCommit | false |
| tddOrderViolations | 1 |

Run judge separately: npx tsx judge.ts pilot-r4