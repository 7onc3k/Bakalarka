#!/usr/bin/env bash
set -euo pipefail

# Creates a new experiment run.
#
# Usage:
#   ./experiments/scripts/new-run.sh <run-name> --run R0|R1|R2|R3|R4|R5
#
# Balanced fractional factorial (3 meta, 3 explicit per dimension):
#
#   Run  P         O         Q
#   R0   meta      meta      meta       ← all meta baseline
#   R1   meta      meta      explicit
#   R2   meta      explicit  explicit
#   R3   explicit  meta      meta
#   R4   explicit  explicit  meta
#   R5   explicit  explicit  explicit   ← all explicit baseline
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
AGENTS_MD_DIR="$EXPERIMENTS_DIR/agents-md"
INFRA_DIR="$EXPERIMENTS_DIR/infra"
RUNS_DIR="$EXPERIMENTS_DIR/runs"
GITHUB_ORG="7onc3k"

# --- Parse arguments ---
RUN_NAME="${1:?Usage: $0 <run-name> --run R0|R1|R2|R3|R4|R5}"
shift

RUN_TYPE=""
while [[ $# -gt 0 ]]; do
    case "$1" in
        --run) RUN_TYPE="$2"; shift 2 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

[[ -z "$RUN_TYPE" ]] && { echo "Error: --run is required (R0-R5)"; exit 1; }

# Determine instruction type per dimension
case "$RUN_TYPE" in
    R0) P=meta;     O=meta;     Q=meta     ;;
    R1) P=meta;     O=meta;     Q=explicit ;;
    R2) P=meta;     O=explicit; Q=explicit ;;
    R3) P=explicit; O=meta;     Q=meta     ;;
    R4) P=explicit; O=explicit; Q=meta     ;;
    R5) P=explicit; O=explicit; Q=explicit ;;
    *)  echo "Error: --run must be R0, R1, R2, R3, R4, or R5"; exit 1 ;;
esac

REPO_NAME="bp-billing-reminder-${RUN_NAME}"
REPO_URL="https://github.com/${GITHUB_ORG}/${REPO_NAME}.git"
RUN_DIR="$RUNS_DIR/$RUN_NAME"

echo "=== Experiment run: ${RUN_NAME} ==="
echo "    Type: ${RUN_TYPE} (P=${P}, O=${O}, Q=${Q})"
echo "    Repo: ${GITHUB_ORG}/${REPO_NAME}"
echo "    Dir:  ${RUN_DIR}"
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
    --description "Experiment ${RUN_TYPE}: ${RUN_NAME}"

# --- Step 2: Create local run directory ---
echo "→ Creating local repo..."
mkdir -p "$RUN_DIR/.opencode/plugins"

# .gitignore
cat > "$RUN_DIR/.gitignore" << 'EOF'
node_modules/
dist/
coverage/
.stryker-tmp/
reports/
*.tsbuildinfo
EOF

# .opencode/config.json — GLM-5 via zai-coding-plan
cat > "$RUN_DIR/.opencode/config.json" << 'EOF'
{"$schema": "https://opencode.ai/config.json", "model": "zai-coding-plan/glm-5"}
EOF

# .opencode/plugins/auto-continue.ts
cp "$INFRA_DIR/auto-continue.ts" "$RUN_DIR/.opencode/plugins/auto-continue.ts"

# --- Step 3: Compose AGENTS.md ---
echo "→ Composing AGENTS.md (P=${P}, O=${O}, Q=${Q})..."
cat "$AGENTS_MD_DIR/header.md"     > "$RUN_DIR/AGENTS.md"
cat "$AGENTS_MD_DIR/p-${P}.md"   >> "$RUN_DIR/AGENTS.md"
cat "$AGENTS_MD_DIR/o-${O}.md"   >> "$RUN_DIR/AGENTS.md"
cat "$AGENTS_MD_DIR/q-${Q}.md"   >> "$RUN_DIR/AGENTS.md"

# --- Step 4: Push to GitHub ---
echo "→ Pushing to GitHub..."
cd "$RUN_DIR"
git init -b main
git add -A
git commit -m "chore: init experiment ${RUN_TYPE} (P=${P}, O=${O}, Q=${Q})"
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

opencode run "Implement the dunning system according to AGENTS.md and Issue #1."

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
# Sub-agents get their own sessionID (parent_id in SQLite). They appear in the
# parent transcript as ToolParts with tool=="task" and state.metadata.sessionId.
# opencode export only returns the single session — children must be fetched separately.
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
        [[ -f "$child_file" ]] && continue  # already exported (avoid loops)

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
