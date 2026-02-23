#!/usr/bin/env bash
# LLM-as-judge evaluation using GLM-5
# Usage: ./experiments/infra/scripts/judge.sh <run-name>
# Example: ./experiments/infra/scripts/judge.sh pilot-r1
#
# Evaluates P2 (process artifacts), Q4 (AC coverage), and Q8 (code quality) using
# GLM-5 as judge model (different family from minimax generator).

set -euo pipefail

JUDGE_MODEL="zai-coding-plan/glm-5"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JUDGE_DIR="$SCRIPT_DIR/../judge"
EXPERIMENTS_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
RUN_NAME="${1:?Usage: judge.sh <run-name>}"
RUN_DIR="$EXPERIMENTS_DIR/runs/$RUN_NAME"
[[ -d "$RUN_DIR" ]] || RUN_DIR="$EXPERIMENTS_DIR/runs/archive/$RUN_NAME"
OUTPUT_DIR="$RUN_DIR"

if [ ! -d "$RUN_DIR" ]; then
  echo "Error: run directory not found in runs/ or runs/archive/: $RUN_NAME"
  exit 1
fi

if [ ! -d "$RUN_DIR/src" ]; then
  echo "Error: $RUN_DIR/src not found. Agent code expected directly in run directory."
  exit 1
fi

echo "=== LLM-as-judge evaluation ==="
echo "Run: $RUN_DIR"
echo "Model: $JUDGE_MODEL"
echo ""

# --- P2: Process Artifacts ---
echo "--- P2: Collecting process artifacts ---"

# Collect commit messages
COMMITS=$(cd "$RUN_DIR" && git log --format="%h %s" --no-merges 2>/dev/null || echo "No commits found")

# Collect issues (from GitHub if available, otherwise from local)
ISSUES=$(cd "$RUN_DIR" && gh issue list --state all --json number,title,body --limit 50 2>/dev/null || echo "No issues found (gh not configured)")

# Collect PRs
PRS=$(cd "$RUN_DIR" && gh pr list --state all --json number,title,body --limit 50 2>/dev/null || echo "No PRs found (gh not configured)")

P2_INPUT="## Commit Messages
$COMMITS

## Issue Descriptions
$ISSUES

## PR Descriptions
$PRS"

P2_RUBRIC=$(cat "$JUDGE_DIR/p2-process-artifacts.md")

echo "Calling GLM-5 for P2..."
P2_RESULT=$(cd "$RUN_DIR" && opencode run -m "$JUDGE_MODEL" --format json \
  "$P2_RUBRIC

---

$P2_INPUT" 2>&1 | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        event = json.loads(line)
        if event.get('type') == 'text':
            print(event.get('part', {}).get('text', ''), end='')
    except json.JSONDecodeError:
        pass
" 2>/dev/null || echo '{"error": "GLM-5 call failed"}')

echo "$P2_RESULT" > "$OUTPUT_DIR/p2-result.json"
echo "P2 result saved to $OUTPUT_DIR/p2-result.json"
echo "$P2_RESULT"
echo ""

# --- Q4: AC Coverage ---
echo "--- Q4: Collecting acceptance criteria and test code ---"

# Extract AC list from spec
SPEC_FILE="$SCRIPT_DIR/../issue-1-req-only.json"
if [[ ! -f "$SPEC_FILE" ]]; then
  echo "Warning: $SPEC_FILE not found, skipping Q4"
else
  AC_TEXT=$(python3 -c "
import json
with open('$SPEC_FILE') as f:
    body = json.load(f)['body']
# Extract the Acceptance Criteria section
start = body.find('### Acceptance Criteria')
end = body.find('### Domain Glossary')
if start == -1: start = 0
if end == -1: end = len(body)
section = body[start:end]

# Number each AC (each Given block)
import re
acs = re.split(r'\n(?=- Given)', section)
acs = [a.strip() for a in acs if a.strip().startswith('- Given') or a.strip().startswith('Given')]
for i, ac in enumerate(acs, 1):
    # Clean up leading dash
    ac_clean = ac.lstrip('- ').strip()
    print(f'AC{i}: {ac_clean}')
    print()
")

  # Collect agent's test files (exclude node_modules, .stryker-tmp, dist, _ref_tests)
  TEST_CODE=$(find "$RUN_DIR" \( -name "*.test.ts" -o -name "*.spec.ts" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/.stryker-tmp/*" \
    -not -path "*/dist/*" \
    -not -path "*/_ref_tests/*" | while read tf; do
    echo "// === $(basename "$tf") ==="
    cat "$tf"
  done 2>/dev/null || echo "No test files found")

  Q4_RUBRIC=$(cat "$JUDGE_DIR/q4-ac-coverage.md")

  echo "Calling GLM-5 for Q4..."
  Q4_RESULT=$(cd "$RUN_DIR" && opencode run -m "$JUDGE_MODEL" --format json \
    "$Q4_RUBRIC

---

## Acceptance Criteria

$AC_TEXT

## Agent Test Code

$TEST_CODE" 2>&1 | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        event = json.loads(line)
        if event.get('type') == 'text':
            print(event.get('part', {}).get('text', ''), end='')
    except json.JSONDecodeError:
        pass
" 2>/dev/null || echo '{"error": "GLM-5 call failed"}')

  echo "$Q4_RESULT" > "$OUTPUT_DIR/q4-result.json"
  echo "Q4 result saved to $OUTPUT_DIR/q4-result.json"
  echo "$Q4_RESULT"
  echo ""
fi


# --- Q8: Code Quality ---
echo "--- Q8: Collecting source code ---"

# Collect all .ts source files (excluding tests, node_modules, dist)
SRC_CODE=$(find "$RUN_DIR/src" -name "*.ts" ! -name "*.test.ts" ! -name "*.spec.ts" -exec echo "// === {} ===" \; -exec cat {} \; 2>/dev/null || echo "No src/ directory found")

Q8_RUBRIC=$(cat "$JUDGE_DIR/q8-code-quality.md")

echo "Calling GLM-5 for Q8..."
Q8_RESULT=$(cd "$RUN_DIR" && opencode run -m "$JUDGE_MODEL" --format json \
  "$Q8_RUBRIC

---

$SRC_CODE" 2>&1 | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        event = json.loads(line)
        if event.get('type') == 'text':
            print(event.get('part', {}).get('text', ''), end='')
    except json.JSONDecodeError:
        pass
" 2>/dev/null || echo '{"error": "GLM-5 call failed"}')

echo "$Q8_RESULT" > "$OUTPUT_DIR/q8-result.json"
echo "Q8 result saved to $OUTPUT_DIR/q8-result.json"
echo "$Q8_RESULT"
echo ""

echo "=== Done ==="
