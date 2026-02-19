
## Quality Infrastructure

Set up automated quality feedback using industry-standard tooling
before implementing business logic:

- **Static analysis** — linter with type-aware rules and formatter
  for consistent code style; catch bugs and inconsistencies at write time
- **Test coverage gates** — test runner with enforced coverage thresholds;
  code that is not tested does not ship
- **Continuous integration** — CI pipeline that runs type check, lint,
  format check, tests, and build on every change; broken code cannot
  be merged
- **Mutation testing** — validate that tests actually detect faults,
  not just cover lines; mutation score measures test suite effectiveness
  beyond line coverage

**Constraint:** Do not implement business logic without functioning
automated quality checks.
