
## Testing

Follow strict Test-Driven Development from the specification:

For each acceptance criterion:
1. Write a failing unit test derived from the spec (expected values
   come from acceptance criteria, not from code).
2. Run the test and verify it fails.
3. Write the minimum implementation to make it pass.
4. Refactor if needed, then move to the next criterion.

**Constraint:** Do not write implementation code without a corresponding
failing test. Do not derive expected values from observing code behavior.
