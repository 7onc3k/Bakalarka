#!/usr/bin/env bash
set -euo pipefail

# Creates a new experiment run repository with clean state.
#
# Usage:
#   ./experiments/scripts/new-run.sh <run-name> [--scaffold full|none] [--spec full|minimal]
#
# Examples:
#   ./experiments/scripts/new-run.sh pilot-1
#   ./experiments/scripts/new-run.sh ablation-no-scaffold --scaffold none
#   ./experiments/scripts/new-run.sh ablation-minimal-spec --spec minimal
#
# What it does:
#   1. Creates a new private GitHub repo: bp-billing-reminder-<run-name>
#   2. Pushes code from reference (current main branch snapshot)
#   3. Creates issues from JSON definitions
#   4. Optionally removes scaffolding (AGENTS.md workflow, .opencode/agents/)
#
# Prerequisites:
#   - gh CLI authenticated
#   - Run from Bakalarka root directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REFERENCE_DIR="$(cd "$SCRIPT_DIR/../reference" && pwd)"
GITHUB_ORG="7onc3k"

# --- Parse arguments ---
RUN_NAME="${1:?Usage: $0 <run-name> [--scaffold full|none] [--spec full|minimal]}"
shift

SCAFFOLD="full"
SPEC="full"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --scaffold) SCAFFOLD="$2"; shift 2 ;;
        --spec) SPEC="$2"; shift 2 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

REPO_NAME="bp-billing-reminder-${RUN_NAME}"
REPO_URL="https://github.com/${GITHUB_ORG}/${REPO_NAME}.git"

echo "=== Creating experiment run: ${RUN_NAME} ==="
echo "    Repo: ${GITHUB_ORG}/${REPO_NAME}"
echo "    Scaffold: ${SCAFFOLD}"
echo "    Spec: ${SPEC}"
echo ""

# --- Step 1: Create GitHub repo ---
echo "→ Creating repository..."
if gh repo view "${GITHUB_ORG}/${REPO_NAME}" &>/dev/null; then
    echo "  Repository already exists. Aborting."
    echo "  To delete: gh repo delete ${GITHUB_ORG}/${REPO_NAME} --yes"
    exit 1
fi

gh repo create "${GITHUB_ORG}/${REPO_NAME}" --private --description "Experiment run: ${RUN_NAME}"

# --- Step 2: Push code from reference ---
echo "→ Pushing code from reference..."
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

cd "$REFERENCE_DIR"
git archive HEAD | tar -x -C "$TEMP_DIR"
cd "$TEMP_DIR"

git init -b main
git add -A
git commit -m "chore: initial setup from reference snapshot"
git remote add origin "$REPO_URL"
git push -u origin main

# --- Step 3: Apply ablation (remove scaffolding if requested) ---
if [[ "$SCAFFOLD" == "none" ]]; then
    echo "→ Removing scaffolding..."
    # Remove workflow instructions (keep AGENTS.md project context)
    rm -rf .opencode/agents/
    # Remove CI pipeline
    rm -rf .github/workflows/
    # Remove tooling configs (keep package.json and tsconfig for basic setup)
    rm -f eslint.config.js stryker.config.js vitest.config.ts .prettierrc

    git add -A
    git commit -m "chore: remove scaffolding (ablation condition)"
    git push
fi

if [[ "$SPEC" == "minimal" ]]; then
    echo "→ Minimal spec mode — implementation issues will have reduced AC detail"
    # This flag affects which issue JSON files are used (see Step 4)
fi

# --- Step 4: Create issues ---
echo "→ Creating issues..."

# Create spec issue (#1) first
SPEC_BODY=$(jq -r '.body' "$SCRIPT_DIR/issue-1.json")
SPEC_TITLE=$(jq -r '.title' "$SCRIPT_DIR/issue-1.json")
gh issue create --repo "${GITHUB_ORG}/${REPO_NAME}" \
    --title "$SPEC_TITLE" \
    --body "$SPEC_BODY" \
    --label "spec"

# Create label first
gh label create "spec" --repo "${GITHUB_ORG}/${REPO_NAME}" --color "0075ca" --description "Specification" 2>/dev/null || true

# Recreate spec with label (gh issue create doesn't fail if label missing, just skips it)
# Issues #3-#7 (implementation)
for ISSUE_NUM in 3 4 5 6 7; do
    ISSUE_FILE="$SCRIPT_DIR/issue-${ISSUE_NUM}.json"
    if [[ ! -f "$ISSUE_FILE" ]]; then
        echo "  Warning: $ISSUE_FILE not found, skipping"
        continue
    fi

    ISSUE_TITLE=$(jq -r '.title' "$ISSUE_FILE")
    ISSUE_BODY=$(jq -r '.body' "$ISSUE_FILE")

    gh issue create --repo "${GITHUB_ORG}/${REPO_NAME}" \
        --title "$ISSUE_TITLE" \
        --body "$ISSUE_BODY"

    echo "  Created issue #$((ISSUE_NUM)): $ISSUE_TITLE"
done

# --- Step 5: Summary ---
echo ""
echo "=== Run ready ==="
echo "    Repo: https://github.com/${GITHUB_ORG}/${REPO_NAME}"
echo "    Issues: $(gh issue list --repo "${GITHUB_ORG}/${REPO_NAME}" --json number --jq length)"
echo ""
echo "To start the agent:"
echo "    git clone ${REPO_URL} /tmp/${REPO_NAME}"
echo "    cd /tmp/${REPO_NAME}"
echo "    opencode run -m zai-coding-plan/glm-5 \"Implement all open issues following AGENTS.md\""
echo ""
echo "To delete after analysis:"
echo "    gh repo delete ${GITHUB_ORG}/${REPO_NAME} --yes"
