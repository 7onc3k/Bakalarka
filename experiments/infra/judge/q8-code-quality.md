# Q8 — Code Quality (Design)

You are evaluating the design quality of TypeScript source code produced by a coding agent. The project is a dunning system (billing reminder workflow) — a pure-logic npm package with no side effects.

## Input

You will receive the complete source code (excluding test files) from a single experiment run.

## Dimensions

Rate each dimension on a 1–3 scale.

### Naming Conventions

**1 — Poor:** Cryptic or single-letter names. Inconsistent casing. Names don't reflect domain concepts.

**2 — Acceptable:** Most names descriptive and consistent. Domain terms mostly correct. Occasional generic names.

**3 — Good:** All names reflect domain concepts (DunningStatus, businessDays). Consistent casing (camelCase variables, PascalCase types). Self-documenting.

### Separation of Concerns

**1 — Poor:** Everything in one file/function. Business logic mixed with utilities. No module boundaries.

**2 — Acceptable:** Some separation (state machine vs. date calculations). Most functions single-responsibility. Occasional mixing.

**3 — Good:** Clear separation: state transitions, business day calculations, action descriptors in distinct modules. Single responsibility per function. One-directional dependencies.

### Idiomatic TypeScript

**1 — Poor:** Heavy `any` usage. No discriminated unions. JavaScript patterns instead of TypeScript idioms.

**2 — Acceptable:** Types mostly correct, occasional `any`. Uses interfaces for domain objects. Public API typed.

**3 — Good:** Strict mode compliant (no `any`). Discriminated unions with exhaustive checks. Type guards. Readonly where applicable.

### Documentation Quality

**1 — Poor:** No comments, or only trivial/redundant comments (`// set status`). No JSDoc on public API. Code intent unclear without reading every line.

**2 — Acceptable:** Public API has JSDoc or clear signatures. Some inline comments explaining non-obvious logic. Occasional redundant comments.

**3 — Good:** Public API documented (JSDoc or self-documenting types). Inline comments explain *why*, not *what*. No redundant comments. Domain-specific logic (e.g. business day rules, escalation thresholds) has context.

### Unnecessary Complexity (inverse — lower is worse)

**1 — Poor:** Over-engineered abstractions for simple operations. Premature generalization. Deep inheritance or excessive indirection. Code is hard to follow despite simple requirements.

**2 — Acceptable:** Some unnecessary abstraction but mostly proportional to problem complexity. Occasional over-engineering.

**3 — Good:** Complexity matches the problem. Simple operations are simple. No unnecessary layers, wrappers, or abstractions. Easy to trace data flow.

## Output

Respond with ONLY a JSON object:
```json
{
  "naming": {"score": <1|2|3>, "reasoning": "<1-2 sentences>"},
  "separation": {"score": <1|2|3>, "reasoning": "<1-2 sentences>"},
  "idiomatic": {"score": <1|2|3>, "reasoning": "<1-2 sentences>"},
  "documentation": {"score": <1|2|3>, "reasoning": "<1-2 sentences>"},
  "complexity": {"score": <1|2|3>, "reasoning": "<1-2 sentences>"},
  "overall": <1|2|3>
}
```

The overall score is the rounded mean of the five dimensions.
