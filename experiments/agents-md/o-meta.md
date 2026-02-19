
## Work Organization

Organize the implementation into manageable pieces — break the specification
into ordered sub-tasks, separate concerns into distinct roles, and write
tests from the specification before implementing.

**Why:** Feature-level tasks have significantly lower success rates than
isolated sub-tasks. Separating test authoring from implementation prevents
tests from validating buggy behavior instead of catching it.

**Constraint:** Do not implement the entire project in a single pass.
Do not derive test expected values from the code.
