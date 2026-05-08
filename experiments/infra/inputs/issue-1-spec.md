## 1. Requirements

*Problem domain — WHAT the business needs*

### Description

A standalone npm package implementing a dunning system (automated billing reminder workflow) as pure business logic. The system automatically escalates unpaid invoices through a series of states — from a friendly due-soon reminder, through increasingly urgent notices, to service suspension and eventual write-off.

Each invoice has an independent dunning instance. The package contains no infrastructure dependencies — it returns action descriptors (send email, suspend service, schedule next check) rather than performing them. Timeouts are calculated in business days (excluding weekends and public holidays).

The system supports configurable timeouts per dunning instance, configurable public holidays for business day calculations, manual overrides (pause, resume, force advance), and invoice cancellation at any point.

### Technical Requirements

- **Language:** TypeScript (strict mode, ESM — `"type": "module"` in package.json)
- **Runtime:** Node.js (LTS)
- **Test framework:** Vitest (≥2.0)
- **Output:** publishable npm package with type declarations (`.d.ts`)

### Package API

The package must export:

- A function to initialize a new dunning instance given an invoice due date and optional configuration
- A pure function `process(state, event, now)` — takes current dunning state, an event, and current date; returns `{ state, actions }`

**Events:** `tick` (check for time-based transitions), `payment_received`, `invoice_cancelled`, `dunning_paused`, `dunning_resumed`, `manual_advance`

**Returned state** must expose the current status as a string (e.g. `state.status`).

**Action descriptors** must be plain objects with a `type` field (e.g. `{ type: 'send_email', template: '...' }`).

Internal implementation (types, modules, class vs. functional style) is not constrained.

### Acceptance Criteria

**Time-based transitions (happy path escalation):**

- Given an invoice is in ISSUED state
  When 7 business days before the due date is reached
  Then the state transitions to DUE_SOON
  And an action descriptor `send_email(due_soon_reminder)` is returned

- Given an invoice is in DUE_SOON state
  When the due date is reached
  Then the state transitions to OVERDUE

- Given an invoice is in OVERDUE state
  When 3 business days have elapsed
  Then the state transitions to GRACE

- Given an invoice is in GRACE state
  When 7 business days have elapsed
  Then the state transitions to REMINDER_1
  And an action descriptor `send_email(first_reminder)` is returned

- Given an invoice is in REMINDER_1 state
  When 14 business days have elapsed
  Then the state transitions to REMINDER_2
  And an action descriptor `send_email(second_reminder)` is returned

- Given an invoice is in REMINDER_2 state
  When 14 business days have elapsed
  Then the state transitions to FINAL_NOTICE
  And an action descriptor `send_email(final_warning)` is returned

- Given an invoice is in FINAL_NOTICE state
  When 7 business days have elapsed
  Then the state transitions to SUSPENDED
  And action descriptors `suspend_service()` and `send_email(service_suspended)` are returned

- Given an invoice is in SUSPENDED state
  When 30 business days have elapsed
  Then the state transitions to WRITTEN_OFF
  And an action descriptor `send_email(written_off_notice)` is returned

**Payment (resolves dunning at any point):**

- Given an invoice is in any state except WRITTEN_OFF, PAID, and CANCELLED
  When a `payment_received` event occurs
  Then the state transitions to PAID

- Given an invoice was in SUSPENDED state
  When a `payment_received` event transitions it to PAID
  Then an action descriptor `resume_service()` is returned in addition to the transition

**Terminal states:**

- Given an invoice is in PAID state
  When any event occurs
  Then no state transition happens

- Given an invoice is in WRITTEN_OFF state
  When any event occurs
  Then no state transition happens

- Given an invoice is in CANCELLED state
  When any event occurs
  Then no state transition happens

**Invoice cancellation:**

- Given an invoice is in any state except PAID, WRITTEN_OFF, and CANCELLED
  When an `invoice_cancelled` event occurs
  Then the state transitions to CANCELLED

- Given an invoice was in SUSPENDED state
  When an `invoice_cancelled` event transitions it to CANCELLED
  Then an action descriptor `resume_service()` is returned

**Pause / Resume (manual override):**

- Given an invoice is in any active dunning state (OVERDUE, GRACE, REMINDER_1, REMINDER_2, FINAL_NOTICE, SUSPENDED)
  When a `dunning_paused` event occurs
  Then the state transitions to PAUSED
  And the previous state and elapsed time are preserved

- Given an invoice is in PAUSED state
  When a `dunning_resumed` event occurs
  Then the state transitions back to the state it was in before pausing
  And the timeout resumes from where it left off

- Given an invoice is in PAUSED state
  When a `payment_received` event occurs
  Then the state transitions to PAID (payment always takes priority)

- Given an invoice is in PAUSED state
  When an `invoice_cancelled` event occurs
  Then the state transitions to CANCELLED

**Manual advance:**

- Given an invoice is in any active dunning state
  When a `manual_advance` event occurs
  Then the state transitions to the next state in the escalation sequence
  And the appropriate action descriptors for that transition are returned

**Configurable timeouts:**

- Given a dunning instance is created with custom timeout configuration
  When time-based transitions are evaluated
  Then the custom timeouts are used instead of the defaults

- Given no custom timeout configuration is provided
  When a dunning instance is created
  Then the default timeouts are used (DUE_SOON: 7d before due, OVERDUE→GRACE: 3bd, GRACE→REMINDER_1: 7bd, REMINDER_1→REMINDER_2: 14bd, REMINDER_2→FINAL_NOTICE: 14bd, FINAL_NOTICE→SUSPENDED: 7bd, SUSPENDED→WRITTEN_OFF: 30bd)

**Business days calculation:**

- Given a timeout of 14 business days starting on a Friday
  When the system calculates the target date
  Then weekends (Saturday, Sunday) are excluded from the count

- Given a public holiday falls within a timeout period
  When the system calculates the target date
  Then the public holiday is excluded from the count

- Given a custom holiday calendar is provided
  When business days are calculated
  Then the custom holidays are used

### Domain Glossary

- **Dunning** — the process of escalating unpaid invoices through a series of reminders
- **Dunning instance** — an independent dunning process for a single invoice
- **Grace period** — a waiting period after the due date to account for bank transfer delays (1-3 days)
- **Business days** — working days excluding weekends and public holidays
- **Due date** — the payment deadline on an invoice
- **Suspension** — disabling services for the client as a consequence of non-payment
- **Write-off** — marking a receivable as uncollectible; terminal state handled outside the system
- **Action descriptor** — a plain object describing what the consuming application should do (e.g. send email, suspend service), without performing it
- **Holiday calendar** — a configurable list of public holidays for business day calculations

### Out of Scope

The following are explicitly **not** part of this package:
- **Payment retry** (e.g. Stripe retry) — infrastructure concern
- **Late fees / interest calculation** — separate accounting concern
- **Partial payments** — would require threshold/credit logic, out of scope
- **Email sending** — the package returns action descriptors, not performs them
- **Scheduling / cron** — the consuming application decides when to evaluate timeouts
- **Database persistence** — the consuming application manages state storage


## 2. API Contract

*Implementation contract — WHAT you must export*

Your package must export exactly these functions and types. The names, signatures, and type shapes are fixed — the behavioral test suite depends on them.

### Exported Functions

```typescript
// Initialize a new dunning instance
export function createInstance(
  dueDate: Date,
  config?: Partial<DunningConfig>
): DunningState

// Pure state transition function
export function process(
  state: DunningState,
  event: DunningEvent,
  now: Date
): ProcessResult
```

### Types

```typescript
type DunningStatus =
  | "ISSUED" | "DUE_SOON" | "OVERDUE" | "GRACE"
  | "REMINDER_1" | "REMINDER_2" | "FINAL_NOTICE"
  | "SUSPENDED" | "WRITTEN_OFF" | "PAID" | "PAUSED" | "CANCELLED"

type EventType =
  | "tick" | "payment_received" | "invoice_cancelled"
  | "dunning_paused" | "dunning_resumed" | "manual_advance"

interface DunningEvent {
  type: EventType
}

type ActionType = "send_email" | "suspend_service" | "resume_service"

interface ActionDescriptor {
  type: ActionType
  template?: string  // only for send_email
}

interface DunningConfig {
  timeouts?: Partial<Record<DunningStatus, number>>
  holidays?: Date[]
}

interface DunningState {
  status: DunningStatus
  dueDate: Date
  stateEnteredAt: Date
  config: DunningConfig
  pausedFrom?: DunningStatus   // set when status === "PAUSED"
  pausedElapsed?: number       // business days elapsed before pause
}

interface ProcessResult {
  state: DunningState
  actions: ActionDescriptor[]
}
```

### Action Templates per Transition

| Transition | Actions |
|-----------|---------|
| → DUE_SOON | `{ type: "send_email", template: "due_soon_reminder" }` |
| → REMINDER_1 | `{ type: "send_email", template: "first_reminder" }` |
| → REMINDER_2 | `{ type: "send_email", template: "second_reminder" }` |
| → FINAL_NOTICE | `{ type: "send_email", template: "final_warning" }` |
| → SUSPENDED | `{ type: "suspend_service" }` + `{ type: "send_email", template: "service_suspended" }` |
| → WRITTEN_OFF | `{ type: "send_email", template: "written_off_notice" }` |
| payment from SUSPENDED | also `{ type: "resume_service" }` |
| cancel from SUSPENDED | also `{ type: "resume_service" }` |


