
## Work Organization

Organize the implementation using these methods:

- **Feature decomposition** — break the specification into sub-tasks ordered
  by dependency; each sub-task should be independently implementable and
  testable
- **Role separation** — define distinct agent roles with non-overlapping
  responsibilities; separate who writes tests from who writes implementation
  to avoid confirmation bias
- **Spec-first TDD** — for each sub-task, write failing tests derived from
  acceptance criteria before writing implementation code; expected values
  come from the specification, never from observing code behavior
- **Tracked progress** — use issues or similar mechanism to track sub-task
  status, dependencies, and completion

**Constraint:** Do not implement the entire project in a single pass.
Do not derive test expected values from the code.
