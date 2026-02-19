
## Planning & Design

Before writing implementation code, design the solution structure using
these principles:

- **Information hiding** — each module exposes a narrow interface and hides
  its implementation details
- **Type-driven design** — define domain types first, then build functions
  around them; types encode invariants that the compiler can check
- **Separation of concerns** — one module per responsibility; pure functions
  with explicit inputs and outputs, no side effects
- **Interface-first** — define public API contracts before implementing
  internals; consumers should not depend on implementation details

Document your design decisions before implementing them.

**Constraint:** Do not start writing implementation code until you have
documented your design decisions.
