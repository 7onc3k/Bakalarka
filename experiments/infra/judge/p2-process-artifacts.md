# P2 — Process Artifacts Quality

You are evaluating the quality of process artifacts (commit messages, issue descriptions, PR descriptions) produced by a coding agent during a development task.

## Input

You will receive:
1. A list of git commit messages
2. GitHub issue titles and descriptions
3. GitHub PR titles and descriptions

## Dimensions

Rate each dimension on a 1–3 scale.

### Commit Messages

**1 — Poor:** Generic messages ("fix", "update", "wip"). No conventional prefix. Multiple unrelated changes per commit. No description of what or why.

**2 — Acceptable:** Most messages have conventional prefix (feat:, fix:, test:). Describe what changed. Occasional generic messages. Each commit mostly one concern.

**3 — Good:** All messages have conventional prefix. Describe what and why. Each commit is atomic. Concise and specific.

### Issue Descriptions

**1 — Poor:** No description or title-only. No acceptance criteria. Scope unclear. No context.

**2 — Acceptable:** Descriptions with some context. Scope mostly clear. Some have acceptance criteria. Titles descriptive enough.

**3 — Good:** Clear description with context. Well-defined scope (one concern per issue). Acceptance criteria present. References specification.

### PR Descriptions

**1 — Poor:** No description or auto-generated only. No reference to issue. Generic title.

**2 — Acceptable:** Descriptions explain what changed. Most reference their issue. Titles describe the change.

**3 — Good:** Clear what and why. All reference their issue (closes #N). Concise descriptive title. Appropriate detail level.

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
