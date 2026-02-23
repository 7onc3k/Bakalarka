# P2 — Process Artifacts Quality

You are evaluating the quality of process artifacts (commit messages, issue descriptions, PR descriptions) produced by a coding agent during a development task.

## Context: Agent Instructions

The agent was given these process requirements in AGENTS.md:

- Decompose spec into focused GitHub issues before writing code
- For each issue: branch from main, write tests first, implement, PR with "Closes #N", merge
- Use conventional commits: `test:` for tests, `feat:` for implementation, `docs:` for documentation
- Never combine multiple issues into one branch
- Never implement without a failing test first

## Input

You will receive:
1. A list of git commit messages
2. GitHub issue titles and descriptions
3. GitHub PR titles and descriptions

## Dimensions

Rate each dimension on a 1–3 scale.

### Commit Messages

**1 — Poor:** Generic messages ("fix", "update", "wip"). No conventional prefix. Multiple unrelated changes per commit.

**2 — Acceptable:** Most messages have conventional prefix (feat:, fix:, test:). Describe what changed. Each commit mostly one concern.

**3 — Good:** All messages have conventional prefix. Both `test:` and `feat:` prefixes present (evidence of separate test and implementation commits). Describe what and why. Each commit is atomic.

IMPORTANT: If there are ZERO `test:` commits, the score CANNOT be 3. The agent was required to commit tests separately with `test:` prefix before implementation.

### Issue Descriptions

**1 — Poor:** No description or title-only. No acceptance criteria. Scope unclear.

**2 — Acceptable:** Descriptions with some context. Scope mostly clear. Titles descriptive.

**3 — Good:** Clear description with context. Well-defined scope (one concern per issue). References specification.

### PR Descriptions

**1 — Poor:** No description or auto-generated only. No reference to issue. Generic title.

**2 — Acceptable:** Descriptions explain what changed. Most reference their issue. Titles describe the change.

**3 — Good:** Clear what and why. Each PR closes exactly ONE issue (not multiple). Concise descriptive title.

IMPORTANT: If a single PR closes multiple issues (e.g. "Closes #5 #6 #7 #8"), the score CANNOT be 3. The agent was required to have one branch and one PR per issue.

## Output

Respond with ONLY a JSON object:
```json
{
  "commits": {"score": <1|2|3>, "reasoning": "<1-2 sentences>"},
  "issues": {"score": <1|2|3>, "reasoning": "<1-2 sentences>"},
  "prs": {"score": <1|2|3>, "reasoning": "<1-2 sentences>"},
  "overall": <1|2|3>
}
```

The overall score is the rounded mean of the three dimensions.
