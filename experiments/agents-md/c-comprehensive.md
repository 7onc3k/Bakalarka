
## Process

Follow a structured development process:

**Quality gates — run after every meaningful change:**
- Type check: `npx tsc --noEmit`
- Lint: set up and run ESLint with type-aware rules
- Tests: `npx vitest run`
- Fix all errors before proceeding to the next task.

**Code standards:**
- TypeScript strict mode, no `any` types
- Pure functions with explicit inputs and outputs
- Validate inputs at public API boundaries
- Exhaustive handling for all state transitions

**Tooling setup (before business logic):**
- Configure `tsconfig.json` with strict settings
- Set up ESLint and Prettier
- Set up Vitest with coverage reporting
- Aim for high test coverage on business logic modules

**Workflow:**
- Break the specification into sub-tasks ordered by dependency.
- Implement one sub-task at a time; verify before moving on.
- Track progress with clear commit messages per sub-task.
