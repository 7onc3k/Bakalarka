#!/usr/bin/env bash
set -uo pipefail

# Post-run analysis for pilot experiments.
#
# Usage:
#   ./experiments/infra/scripts/analyze-run.sh <run-name>
#
# Example:
#   ./experiments/infra/scripts/analyze-run.sh pilot-r1
#
# Outputs structured metrics: P1 (process compliance), Q1-Q7 (product quality),
# E1-E3 (efficiency). For P2, Q4, and Q8 (LLM-as-judge), run judge.sh separately.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXPERIMENTS_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
RUN_NAME="${1:?Usage: $0 <run-name>}"
RUN_DIR="$EXPERIMENTS_DIR/runs/$RUN_NAME"
[[ -d "$RUN_DIR" ]] || RUN_DIR="$EXPERIMENTS_DIR/runs/archive/$RUN_NAME"

[[ -d "$RUN_DIR" ]] || { echo "Error: run directory not found in runs/ or runs/archive/: $RUN_NAME"; exit 1; }

echo "=== Analyze: $RUN_NAME ==="
echo ""

cd "$RUN_DIR"

# ============================================================================
# P1: Process Compliance Checklist (6 items, binary)
# ============================================================================
echo "## P1: Process Compliance Checklist"
echo ""

P1_PASS=0
P1_TOTAL=6

# --- P1.1: Issues before code ---
FIRST_ISSUE_TIME=""
FIRST_CODE_COMMIT_TIME=""
if gh issue list --state all --limit 1 --json createdAt &>/dev/null; then
    FIRST_ISSUE_TIME=$(gh issue list --state all --limit 100 --json number,createdAt 2>/dev/null \
        | python3 -c "import json,sys; data=json.load(sys.stdin); issues=[i for i in data if i['number']>1]; print(min(i['createdAt'] for i in issues) if issues else '')" 2>/dev/null)
    FIRST_CODE_COMMIT_TIME=$(git log --all --diff-filter=A --format="%aI" -- 'src/*.ts' 'src/**/*.ts' 'tests/*.ts' 'tests/**/*.ts' 2>/dev/null | tail -1)
fi
if [[ -n "$FIRST_ISSUE_TIME" && -n "$FIRST_CODE_COMMIT_TIME" ]]; then
    if [[ "$FIRST_ISSUE_TIME" < "$FIRST_CODE_COMMIT_TIME" ]]; then
        echo "P1.1 Issues before code: ✅ (issue: ${FIRST_ISSUE_TIME:0:19}, code: ${FIRST_CODE_COMMIT_TIME:0:19})"
        ((P1_PASS++))
    else
        echo "P1.1 Issues before code: ❌ (issue: ${FIRST_ISSUE_TIME:0:19}, code: ${FIRST_CODE_COMMIT_TIME:0:19})"
    fi
else
    echo "P1.1 Issues before code: ? (could not determine timestamps)"
fi

# --- P1.2: Branch per issue ---
ISSUE_TOTAL=$(gh issue list --state all --limit 100 --json number 2>/dev/null \
    | python3 -c "import json,sys; data=json.load(sys.stdin); print(len([i for i in data if i['number']>1]))" 2>/dev/null || echo "?")
BRANCH_COUNT=$(git branch -a | grep -v HEAD | grep -v 'remotes/origin/main$' | grep -c 'remotes/origin/' || true)
if [[ "$ISSUE_TOTAL" != "?" && "$BRANCH_COUNT" != "?" && "$BRANCH_COUNT" -ge "$ISSUE_TOTAL" ]]; then
    echo "P1.2 Branch per issue: ✅ (branches: $BRANCH_COUNT, issues: $ISSUE_TOTAL)"
    ((P1_PASS++))
else
    echo "P1.2 Branch per issue: ❌ (branches: $BRANCH_COUNT, issues: $ISSUE_TOTAL)"
fi

# --- P1.3: Test commit before implementation ---
TEST_COMMITS=$(git log --all --oneline --format="%s" | grep -c '^test:' || true)
FEAT_COMMITS=$(git log --all --oneline --format="%s" | grep -c '^feat:' || true)
# Check if at least one test: commit exists before first feat: commit
FIRST_TEST_POS=$(git log --all --oneline --format="%s" | grep -n '^test:' | tail -1 | cut -d: -f1 || echo 999)
FIRST_FEAT_POS=$(git log --all --oneline --format="%s" | grep -n '^feat:' | tail -1 | cut -d: -f1 || echo 0)
if [[ "$TEST_COMMITS" -gt 0 && "$FEAT_COMMITS" -gt 0 ]]; then
    echo "P1.3 Test-first commits: ✅ (test: $TEST_COMMITS, feat: $FEAT_COMMITS)"
    ((P1_PASS++))
else
    echo "P1.3 Test-first commits: ❌ (test: $TEST_COMMITS, feat: $FEAT_COMMITS)"
fi

# --- P1.4: PRs linked to issues ---
PR_LINKED=0
PR_TOTAL_COUNT=$(gh pr list --state all --json number 2>/dev/null \
    | python3 -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")
if [[ "$PR_TOTAL_COUNT" -gt 0 ]]; then
    PR_LINKED=$(gh pr list --state all --json body 2>/dev/null \
        | python3 -c "import json,sys,re; data=json.load(sys.stdin); print(sum(1 for pr in data if re.search(r'[Cc]loses? #\d+', pr.get('body','') or '')))" 2>/dev/null || echo "0")
fi
if [[ "$PR_TOTAL_COUNT" -gt 0 && "$PR_LINKED" == "$PR_TOTAL_COUNT" ]]; then
    echo "P1.4 PRs linked to issues: ✅ ($PR_LINKED/$PR_TOTAL_COUNT)"
    ((P1_PASS++))
else
    echo "P1.4 PRs linked to issues: ❌ ($PR_LINKED/$PR_TOTAL_COUNT)"
fi

# --- P1.5: Did not modify existing test assertions ---
# Check if any test files were modified (not just added) across all branches
TEST_MODIFICATIONS=$(git log --all --diff-filter=M --name-only --format="" -- 'tests/**' 'src/**/*.test.ts' '__tests__/**' 2>/dev/null | sort -u | wc -l | tr -d ' ')
if [[ "$TEST_MODIFICATIONS" -eq 0 ]]; then
    echo "P1.5 No test modifications: ✅"
    ((P1_PASS++))
else
    echo "P1.5 No test modifications: ❌ ($TEST_MODIFICATIONS files modified)"
fi

# --- P1.6: Typecheck passes ---
if [[ -f "package.json" ]]; then
    TSC_OUTPUT=$(npx tsc --noEmit 2>&1 || true)
    TSC_ERRORS=$(echo "$TSC_OUTPUT" | grep -c "error TS" || true)
    if [[ "$TSC_ERRORS" -eq 0 ]]; then
        echo "P1.6 Typecheck passes: ✅"
        ((P1_PASS++))
    else
        echo "P1.6 Typecheck passes: ❌ ($TSC_ERRORS errors)"
    fi
else
    echo "P1.6 Typecheck passes: ? (no package.json)"
fi

echo ""
echo "**P1 score: $P1_PASS/$P1_TOTAL**"
echo ""

# ============================================================================
# Git Stats (informational, feeds into P1)
# ============================================================================
echo "## Git Stats (informational)"
echo ""
COMMIT_COUNT=$(git log --oneline --all | wc -l | tr -d ' ')
echo "Total commits: $COMMIT_COUNT"
echo ""
echo "Commit prefixes:"
git log --all --oneline --format="%s" | sed 's/:.*//' | sort | uniq -c | sort -rn | sed 's/^/  /'
echo ""

echo "Issues: $ISSUE_TOTAL (closed: $(gh issue list --state closed --limit 100 --json number 2>/dev/null | python3 -c "import json,sys; data=json.load(sys.stdin); print(len([i for i in data if i['number']>1]))" 2>/dev/null || echo "?"))"
PR_MERGED=$(gh pr list --state merged --json number 2>/dev/null \
    | python3 -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?")
echo "PRs: $PR_TOTAL_COUNT (merged: $PR_MERGED)"
echo ""

# ============================================================================
# Q1: Reference Test Pass Rate
# ============================================================================
echo "## Q1: Reference Test Pass Rate"
echo ""
REF_DIR="$EXPERIMENTS_DIR/reference"
REF_PASSED="?"
REF_TOTAL="?"
# Count expected total from reference test files
REF_EXPECTED=$(grep -r 'it(' "$REF_DIR/src/__tests__/" 2>/dev/null | wc -l | tr -d ' ')
REF_EXPECTED=${REF_EXPECTED:-0}

if [[ -d "$REF_DIR/src/__tests__" && -f "src/index.ts" ]]; then
    mkdir -p tests/_ref_tests
    for tf in "$REF_DIR"/src/__tests__/*.test.ts; do
        # Rewrite import paths: ref tests import from "../*.js" (e.g. "../index.js",
        # "../business-days.js"). In tests/_ref_tests/ the correct path is "../../src/*.js".
        sed 's|from "\.\./\([^"]*\)"|from "../../src/\1"|g' "$tf" > "tests/_ref_tests/$(basename "$tf")"
    done

    REF_OUTPUT=$(npx vitest run tests/_ref_tests/ 2>&1 || true)
    echo "$REF_OUTPUT" | tail -15
    echo ""

    REF_PASSED=$(echo "$REF_OUTPUT" | grep -oP '\d+(?= passed)' | tail -1 || true)
    REF_PASSED=${REF_PASSED:-0}
    REF_TOTAL=${REF_EXPECTED}

    rm -rf tests/_ref_tests

    if [[ "$REF_PASSED" -eq "$REF_TOTAL" && "$REF_TOTAL" -gt 0 ]]; then
        echo "**Q1: ✅ ${REF_PASSED}/${REF_TOTAL} reference tests pass**"
    else
        echo "**Q1: ❌ ${REF_PASSED}/${REF_TOTAL} reference tests pass**"
    fi
else
    echo "⚠️  Reference tests or src/index.ts not found — skipping"
fi
echo ""

# ============================================================================
# Q2: API Contract Match
# ============================================================================
echo "## Q2: API Contract Match"
echo ""
if [[ -f "src/index.ts" ]]; then
    HAS_CREATE=$(grep -c 'export.*function.*createInstance\|export.*createInstance' src/index.ts || true)
    HAS_PROCESS=$(grep -c 'export.*function.*process\|export.*process' src/index.ts || true)
    if [[ "$HAS_CREATE" -gt 0 && "$HAS_PROCESS" -gt 0 ]]; then
        echo "**Q2: ✅ Exports createInstance and process**"
    else
        echo "**Q2: ❌ Missing exports (createInstance: $HAS_CREATE, process: $HAS_PROCESS)**"
    fi
else
    echo "⚠️  No src/index.ts found"
fi
echo ""

# ============================================================================
# Q3: Mutation Score (Stryker)
# ============================================================================
echo "## Q3: Mutation Score (Stryker)"
echo ""
MUTATION_SCORE="?"
if [[ -f "package.json" && -f "src/index.ts" ]]; then
    if ! npx stryker --version &>/dev/null; then
        # Detect vitest version to pick compatible Stryker
        VITEST_VER=$(npx vitest --version 2>/dev/null | grep -oP '^\d+' || echo "0")
        if [[ "$VITEST_VER" -ge 2 ]]; then
            STRYKER_TAG="latest"   # Stryker 9.x for vitest >=2
        else
            STRYKER_TAG="8"        # Stryker 8.x for vitest <2
        fi
        echo "Installing Stryker (${STRYKER_TAG}) for vitest ${VITEST_VER}.x..."
        npm install --save-dev "@stryker-mutator/core@${STRYKER_TAG}" "@stryker-mutator/vitest-runner@${STRYKER_TAG}" "@stryker-mutator/typescript-checker@${STRYKER_TAG}" --legacy-peer-deps 2>&1 | tail -1
    fi

    if [[ ! -f "stryker.config.json" && ! -f "stryker.config.js" ]]; then
        cat > stryker.config.json << 'STRYKER_EOF'
{
  "$schema": "https://raw.githubusercontent.com/stryker-mutator/stryker/master/packages/core/schema/stryker-core.schema.json",
  "testRunner": "vitest",
  "checkers": ["typescript"],
  "tsconfigFile": "tsconfig.json",
  "mutate": ["src/**/*.ts", "!src/**/*.test.ts", "!src/__tests__/**"],
  "reporters": ["clear-text"]
}
STRYKER_EOF
    fi

    echo "Running Stryker (this may take a few minutes)..."
    STRYKER_OUTPUT=$(npx stryker run 2>&1 || true)

    MUTATION_SCORE=$(echo "$STRYKER_OUTPUT" | grep -oP 'All files\s*\|\s*\K[\d.]+' | head -1 || echo "?")
    echo "$STRYKER_OUTPUT" | grep -A1 'All files' | head -3
    echo ""
    echo "**Q3: Mutation score: ${MUTATION_SCORE}%**"
else
    echo "⚠️  No package.json or src/index.ts — skipping"
fi
echo ""

# ============================================================================
# ESLint setup (shared by Q5 and Q7)
# Always use fixed config from infra for consistent measurement across runs.
# ============================================================================
ESLINT_AVAILABLE=false
FIXED_LINT_CONFIG="$SCRIPT_DIR/../eslint-fixed.config.mjs"
if [[ -f "package.json" && -f "src/index.ts" ]]; then
    # Ensure eslint + TS support are locally installed
    NEED_INSTALL=false
    node -e "require.resolve('eslint')" &>/dev/null || NEED_INSTALL=true
    node -e "require.resolve('@typescript-eslint/parser')" &>/dev/null || NEED_INSTALL=true
    node -e "require.resolve('@typescript-eslint/eslint-plugin')" &>/dev/null || NEED_INSTALL=true
    if [[ "$NEED_INSTALL" == "true" ]]; then
        echo "Installing ESLint + TypeScript support..."
        npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser --legacy-peer-deps 2>&1 | tail -1
    fi

    # Copy fixed config to CWD (ESLint resolves plugins from config location)
    cp "$FIXED_LINT_CONFIG" eslint.config.mjs 2>/dev/null

    # Verify ESLint works with fixed config
    ESLINT_CHECK=$(npx eslint src/index.ts --format json 2>&1 || true)
    if echo "$ESLINT_CHECK" | python3 -c "import json,sys; json.load(sys.stdin)" &>/dev/null; then
        ESLINT_AVAILABLE=true
    else
        echo "⚠️  ESLint could not run: $(echo "$ESLINT_CHECK" | head -1)"
    fi
fi

# ============================================================================
# Q5: Lint Warnings
# ============================================================================
echo "## Q5: Lint Warnings"
echo ""
LINT_WARNINGS="?"
LINT_ERRORS="?"
if [[ "$ESLINT_AVAILABLE" == "true" ]]; then
    LINT_OUTPUT=$(npx eslint 'src/**/*.ts' --format json 2>&1 || true)
    if echo "$LINT_OUTPUT" | python3 -c "import json,sys; json.load(sys.stdin)" &>/dev/null; then
        LINT_WARNINGS=$(echo "$LINT_OUTPUT" | python3 -c "import json,sys; data=json.load(sys.stdin); print(sum(r.get('warningCount',0) for r in data))")
        LINT_ERRORS=$(echo "$LINT_OUTPUT" | python3 -c "import json,sys; data=json.load(sys.stdin); print(sum(r.get('errorCount',0) for r in data))")
        echo "**Q5: Warnings: $LINT_WARNINGS, Errors: $LINT_ERRORS**"
    else
        echo "**Q5: Could not parse ESLint output**"
    fi
else
    echo "⚠️  ESLint not available — skipping Q5"
fi
echo ""

# ============================================================================
# Q6: Typecheck Errors
# ============================================================================
echo "## Q6: Typecheck Errors"
echo ""
if [[ -f "package.json" ]]; then
    # Reuse TSC_OUTPUT from P1.6 if available, otherwise run again
    if [[ -z "${TSC_OUTPUT:-}" ]]; then
        TSC_OUTPUT=$(npx tsc --noEmit 2>&1 || true)
        TSC_ERRORS=$(echo "$TSC_OUTPUT" | grep -c "error TS" || true)
    fi
    ANY_COUNT=$(grep -r --include='*.ts' '\bany\b' src/ 2>/dev/null | grep -v 'node_modules' | wc -l | tr -d ' ')
    echo "**Q6: Typecheck errors: $TSC_ERRORS, \`any\` occurrences: $ANY_COUNT**"
else
    echo "⚠️  No package.json — skipping"
fi
echo ""

# ============================================================================
# Q7: Code Complexity
# ============================================================================
echo "## Q7: Code Complexity"
echo ""
COMPLEXITY_VIOLATIONS="?"
if [[ "$ESLINT_AVAILABLE" == "true" ]]; then
    # Fixed config already includes complexity: ["warn", 10] — reuse Q5 output
    COMPLEXITY_OUTPUT=$(npx eslint 'src/**/*.ts' --format json 2>&1 || true)
    if echo "$COMPLEXITY_OUTPUT" | python3 -c "import json,sys; json.load(sys.stdin)" &>/dev/null; then
        COMPLEXITY_VIOLATIONS=$(echo "$COMPLEXITY_OUTPUT" | python3 -c "
import json,sys
data=json.load(sys.stdin)
violations = [msg for f in data for msg in f.get('messages',[])
              if 'complexity' in (msg.get('ruleId','') or '').lower()]
print(len(violations))
")
        echo "**Q7: Complexity violations (>10): $COMPLEXITY_VIOLATIONS**"
    else
        echo "**Q7: Could not parse ESLint output**"
    fi
else
    echo "⚠️  ESLint not available — skipping Q7"
fi
echo ""

# Clean up copied ESLint config
rm -f eslint.config.mjs 2>/dev/null

# ============================================================================
# Agent's own tests (informational, not a metric code)
# ============================================================================
echo "## Agent's Own Tests (informational)"
echo ""
TESTS_COUNT="?"
if [[ -f "package.json" ]]; then
    TEST_OUTPUT=$(npm test 2>&1 || true)
    echo "$TEST_OUTPUT" | tail -10
    TESTS_COUNT=$(echo "$TEST_OUTPUT" | grep -oP '\d+(?= passed)' | head -1 || echo "?")
    echo ""
fi
echo ""

# ============================================================================
# E1-E3: Efficiency
# ============================================================================
echo "## E1-E3: Efficiency"
echo ""
if [[ -f "transcript.json" ]]; then
    python3 -c "
import json
with open('transcript.json') as f:
    data = json.load(f)
msgs = data.get('messages', [])
info = data.get('info', {})

total_in = 0
total_out = 0
for m in msgs:
    t = m.get('info', {}).get('tokens', {})
    total_in += t.get('input', 0)
    total_out += t.get('output', 0)

time_info = info.get('time', {})
created = time_info.get('created', 0)
updated = time_info.get('updated', 0)
duration_min = (updated - created) / 60000 if created and updated else 0

last_msg = msgs[-1] if msgs else {}
last_tokens = last_msg.get('info', {}).get('tokens', {})
crashed = last_tokens.get('input', 1) == 0 and last_tokens.get('output', 1) == 0

print(f'E1 Tokens — input: {total_in:,}, output: {total_out:,}, total: {total_in + total_out:,}')
print(f'E2 Duration — {duration_min:.1f} min')
crash_str = 'CRASHED' if crashed else 'Completed'
print(f'E3 Completion — {crash_str}')
print(f'   Session: {info.get(\"id\", \"?\")}')
" 2>/dev/null || echo "Could not parse transcript.json"
elif ls .opencode/metrics.csv &>/dev/null; then
    echo "No transcript.json, checking metrics.csv..."
    tail -1 .opencode/metrics.csv 2>/dev/null || echo "No metrics found"
else
    echo "No transcript.json or metrics.csv found"
fi

# Restart count from auto-continue
if [[ -f ".opencode/metrics.csv" ]]; then
    RESTART_COUNT=$(wc -l < .opencode/metrics.csv | tr -d ' ')
    echo "   Restarts (auto-continue): $RESTART_COUNT"
fi
echo ""

# ============================================================================
# Summary
# ============================================================================
echo "=========================================="
echo "=== Summary: $RUN_NAME ==="
echo "=========================================="
echo ""
echo "### Process (P1)"
echo "P1 score: $P1_PASS/$P1_TOTAL"
echo "P2 (judge): run judge.sh separately"
echo ""
echo "### Product Quality (Q1-Q8)"
echo "| Metric | Value | Exit criterion | Pass? |"
echo "|--------|-------|----------------|-------|"
echo "| Q1 Ref tests | ${REF_PASSED:-?}/${REF_TOTAL:-?} | ${REF_EXPECTED}/$(echo $REF_EXPECTED) | $([ "${REF_PASSED:-0}" == "${REF_TOTAL:-1}" ] && echo "✅" || echo "❌") |"
echo "| Q2 API contract | $([ "${HAS_CREATE:-0}" -gt 0 ] && [ "${HAS_PROCESS:-0}" -gt 0 ] && echo "match" || echo "no match") | match | $([ "${HAS_CREATE:-0}" -gt 0 ] && [ "${HAS_PROCESS:-0}" -gt 0 ] && echo "✅" || echo "❌") |"
echo "| Q3 Mutation score | ${MUTATION_SCORE:-?}% | ≥70% | $(python3 -c "print('✅' if float('${MUTATION_SCORE:-0}') >= 70 else '❌')" 2>/dev/null || echo "?") |"
echo "| Q4 AC coverage | judge | 24/24 | run judge.sh |"
echo "| Q5 Lint warnings | ${LINT_WARNINGS:-?} | 0 | $([ "${LINT_WARNINGS:-1}" == "0" ] && echo "✅" || echo "❌") |"
echo "| Q6 Typecheck errors | ${TSC_ERRORS:-?} | 0 | $([ "${TSC_ERRORS:-1}" == "0" ] && echo "✅" || echo "❌") |"
echo "| Q7 Complexity (>10) | ${COMPLEXITY_VIOLATIONS:-?} | 0 violations | $([ "${COMPLEXITY_VIOLATIONS:-1}" == "0" ] && echo "✅" || echo "❌") |"
echo "| Q8 Code quality | judge | ≥2/3 | run judge.sh |"
echo ""
echo "### Efficiency (E1-E3)"
echo "(see above)"
echo ""
echo "### Not measured here"
echo "- P2 (process artifacts): ./experiments/infra/scripts/judge.sh $RUN_NAME"
echo "- Q4 (AC coverage): ./experiments/infra/scripts/judge.sh $RUN_NAME"
echo "- Q8 (code quality): ./experiments/infra/scripts/judge.sh $RUN_NAME"
