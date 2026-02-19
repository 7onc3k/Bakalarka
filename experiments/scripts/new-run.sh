#!/usr/bin/env bash
set -euo pipefail

# Creates a new experiment run.
#
# Usage:
#   ./experiments/scripts/new-run.sh <run-name> [--agents path/to/AGENTS.md]
#
# Examples:
#   ./experiments/scripts/new-run.sh pilot-r1
#   ./experiments/scripts/new-run.sh ablation-no-tdd --agents experiments/infra/variants/no-tdd.md
#
# What it does:
#   1. Creates a new private GitHub repo
#   2. Creates minimal repo locally (AGENTS.md + .opencode only)
#   3. Pushes to GitHub, creates issue #1 (spec)
#   4. Runs OpenCode agent
#   5. Exports session transcript for analysis
#
# Output: experiments/runs/<run-name>/
#   AGENTS.md, .opencode/, transcript.json, .opencode/metrics.csv

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXPERIMENTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
INFRA_DIR="$EXPERIMENTS_DIR/infra"
RUNS_DIR="$EXPERIMENTS_DIR/runs"
GITHUB_ORG="7onc3k"
MODEL="opencode/minimax-m2.5-free"

# --- Parse arguments ---
RUN_NAME="${1:?Usage: $0 <run-name> [--agents path/to/AGENTS.md]}"
shift

AGENTS_MD="$INFRA_DIR/AGENTS.md"
while [[ $# -gt 0 ]]; do
    case "$1" in
        --agents) AGENTS_MD="$2"; shift 2 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

[[ -f "$AGENTS_MD" ]] || { echo "Error: AGENTS.md not found: $AGENTS_MD"; exit 1; }

REPO_NAME="bp-billing-reminder-${RUN_NAME}"
REPO_URL="https://github.com/${GITHUB_ORG}/${REPO_NAME}.git"
RUN_DIR="$RUNS_DIR/$RUN_NAME"

echo "=== Experiment run: ${RUN_NAME} ==="
echo "    Model:  ${MODEL}"
echo "    Agents: ${AGENTS_MD}"
echo "    Repo:   ${GITHUB_ORG}/${REPO_NAME}"
echo "    Dir:    ${RUN_DIR}"
echo ""

# Guard: repo must not exist
if gh repo view "${GITHUB_ORG}/${REPO_NAME}" &>/dev/null; then
    echo "Error: repository already exists."
    echo "To delete: gh repo delete ${GITHUB_ORG}/${REPO_NAME} --yes"
    exit 1
fi

# Guard: run dir must not exist
if [[ -d "$RUN_DIR" ]]; then
    echo "Error: run directory already exists: $RUN_DIR"
    exit 1
fi

# --- Step 1: Create GitHub repo ---
echo "→ Creating repository..."
gh repo create "${GITHUB_ORG}/${REPO_NAME}" \
    --private \
    --description "Experiment run: ${RUN_NAME}"

# --- Step 2: Create local run directory ---
echo "→ Creating local repo..."
mkdir -p "$RUN_DIR/.opencode/plugins" "$RUN_DIR/.opencode/agents"

# .gitignore
cat > "$RUN_DIR/.gitignore" << 'EOF'
node_modules/
dist/
coverage/
.stryker-tmp/
reports/
*.tsbuildinfo
EOF

# .opencode/config.json
cp "$INFRA_DIR/config.json" "$RUN_DIR/.opencode/config.json"

# .opencode/agents/build.md — replaces default qwen.txt system prompt
cp "$INFRA_DIR/build.md" "$RUN_DIR/.opencode/agents/build.md"

# .opencode/plugins/auto-continue.ts
cp "$INFRA_DIR/auto-continue.ts" "$RUN_DIR/.opencode/plugins/auto-continue.ts"

# --- Step 3: Copy AGENTS.md ---
echo "→ Copying AGENTS.md from ${AGENTS_MD}..."
cp "$AGENTS_MD" "$RUN_DIR/AGENTS.md"

# --- Step 4: Push to GitHub ---
echo "→ Pushing to GitHub..."
cd "$RUN_DIR"
git init -b main
git add -A
git commit -m "chore: init run ${RUN_NAME}"
git remote add origin "$REPO_URL"
git push -u origin main

# --- Step 5: Create spec issue #1 ---
echo "→ Creating spec issue..."
gh label create "spec" \
    --repo "${GITHUB_ORG}/${REPO_NAME}" \
    --color "0052CC" \
    --description "Specification issue" 2>/dev/null || true

SPEC_TITLE=$(jq -r '.title' "$SCRIPT_DIR/issue-1-req-only.json")
SPEC_BODY=$(jq -r '.body'  "$SCRIPT_DIR/issue-1-req-only.json")

gh issue create \
    --repo "${GITHUB_ORG}/${REPO_NAME}" \
    --title "$SPEC_TITLE" \
    --body  "$SPEC_BODY" \
    --label "spec"

echo "  Created: $SPEC_TITLE"

# --- Step 6: Run agent ---
echo ""
echo "=== Starting agent ==="
echo ""

opencode run -m "$MODEL" "Work on Issue #1 according to AGENTS.md."

# --- Step 7: Export transcript ---
echo ""
echo "→ Exporting session transcript..."
SESSION_ID=$(opencode session list -n 1 --format json 2>/dev/null | jq -r '.[0].id' 2>/dev/null || echo "")

if [[ -z "$SESSION_ID" || "$SESSION_ID" == "null" ]]; then
    echo "  Warning: could not retrieve session ID — export manually:"
    echo "    opencode session list --format json"
    echo "    opencode export <sessionID> > $RUN_DIR/transcript.json"
    exit 0
fi

opencode export "$SESSION_ID" > "$RUN_DIR/transcript.json"
echo "  Saved: $RUN_DIR/transcript.json"

# Recursively export sub-agent sessions.
collect_sub_sessions() {
    local transcript_file="$1"
    local out_dir="$2"

    local children
    children=$(jq -r '
        .messages[].parts[]?
        | select(.tool == "task")
        | select(.state.status == "completed")
        | .state.metadata.sessionId // empty
    ' "$transcript_file" 2>/dev/null || true)

    for child_id in $children; do
        [[ -z "$child_id" || "$child_id" == "null" ]] && continue
        local child_file="$out_dir/${child_id}.json"
        [[ -f "$child_file" ]] && continue

        echo "  Sub-session: $child_id"
        opencode export "$child_id" > "$child_file"
        collect_sub_sessions "$child_file" "$out_dir"
    done
}

mkdir -p "$RUN_DIR/transcripts"
collect_sub_sessions "$RUN_DIR/transcript.json" "$RUN_DIR/transcripts"

SUB_COUNT=$(find "$RUN_DIR/transcripts" -name "*.json" | wc -l | tr -d ' ')
if [[ "$SUB_COUNT" -gt 0 ]]; then
    echo "  Sub-sessions exported: $SUB_COUNT (in $RUN_DIR/transcripts/)"
fi

echo ""
echo "=== Done ==="
echo "    Repo:         https://github.com/${GITHUB_ORG}/${REPO_NAME}"
echo "    Dir:          ${RUN_DIR}"
echo "    Transcript:   ${RUN_DIR}/transcript.json"
if [[ "$SUB_COUNT" -gt 0 ]]; then
echo "    Sub-sessions: ${RUN_DIR}/transcripts/ ($SUB_COUNT files)"
fi
echo "    Metrics:      ${RUN_DIR}/.opencode/metrics.csv"
