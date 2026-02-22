#!/usr/bin/env bash
# LLM-as-judge evaluation using GLM-5
# Usage: ./scripts/judge.sh <run-dir>
# Example: ./scripts/judge.sh runs/pilot-r6
#
# Evaluates P5 (process artifacts) and Q8 (code quality) using
# GLM-5 as judge model (different family from minimax generator).

set -euo pipefail

JUDGE_MODEL="zai-coding-plan/glm-5"
JUDGE_DIR="$(dirname "$0")/../infra/judge"
RUN_DIR="${1:?Usage: judge.sh <run-dir>}"
REPO_DIR="$RUN_DIR/repo"
OUTPUT_DIR="$RUN_DIR"

if [ ! -d "$REPO_DIR" ]; then
  echo "Error: $REPO_DIR not found. Expected cloned repo in run directory."
  exit 1
fi

echo "=== LLM-as-judge evaluation ==="
echo "Run: $RUN_DIR"
echo "Model: $JUDGE_MODEL"
echo ""

# --- P5: Process Artifacts ---
echo "--- P5: Collecting process artifacts ---"

# Collect commit messages
COMMITS=$(cd "$REPO_DIR" && git log --format="%h %s" --no-merges 2>/dev/null || echo "No commits found")

# Collect issues (from GitHub if available, otherwise from local)
ISSUES=$(cd "$REPO_DIR" && gh issue list --state all --json number,title,body --limit 50 2>/dev/null || echo "No issues found (gh not configured)")

# Collect PRs
PRS=$(cd "$REPO_DIR" && gh pr list --state all --json number,title,body --limit 50 2>/dev/null || echo "No PRs found (gh not configured)")

P5_INPUT="## Commit Messages
$COMMITS

## Issue Descriptions
$ISSUES

## PR Descriptions
$PRS"

P5_RUBRIC=$(cat "$JUDGE_DIR/p5-process-artifacts.md")

echo "Calling GLM-5 for P5..."
P5_RESULT=$(cd "$REPO_DIR" && opencode run -m "$JUDGE_MODEL" --format json \
  "$P5_RUBRIC

---

$P5_INPUT" 2>&1 | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        event = json.loads(line)
        if event.get('type') == 'text':
            print(event.get('content', ''), end='')
    except json.JSONDecodeError:
        pass
" 2>/dev/null || echo '{"error": "GLM-5 call failed"}')

echo "$P5_RESULT" > "$OUTPUT_DIR/p5-result.json"
echo "P5 result saved to $OUTPUT_DIR/p5-result.json"
echo "$P5_RESULT"
echo ""

# --- Q8: Code Quality ---
echo "--- Q8: Collecting source code ---"

# Collect all .ts source files (excluding tests, node_modules, dist)
SRC_CODE=$(find "$REPO_DIR/src" -name "*.ts" ! -name "*.test.ts" ! -name "*.spec.ts" -exec echo "// === {} ===" \; -exec cat {} \; 2>/dev/null || echo "No src/ directory found")

Q8_RUBRIC=$(cat "$JUDGE_DIR/q8-code-quality.md")

echo "Calling GLM-5 for Q8..."
Q8_RESULT=$(cd "$REPO_DIR" && opencode run -m "$JUDGE_MODEL" --format json \
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
            print(event.get('content', ''), end='')
    except json.JSONDecodeError:
        pass
" 2>/dev/null || echo '{"error": "GLM-5 call failed"}')

echo "$Q8_RESULT" > "$OUTPUT_DIR/q8-result.json"
echo "Q8 result saved to $OUTPUT_DIR/q8-result.json"
echo "$Q8_RESULT"
echo ""

echo "=== Done ==="
