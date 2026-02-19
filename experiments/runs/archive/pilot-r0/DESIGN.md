# Dunning System - Design Document

## 1. Overview

A TypeScript npm package implementing a dunning system (automated billing reminder workflow) as pure business logic. The system manages invoice payment escalation through configurable states, returning action descriptors rather than performing side effects.

## 2. Module Structure

```
src/
├── index.ts          # Main exports (createDunning, process)
├── types.ts          # Type definitions (DunningState, Event, Action, Config)
├── state-machine.ts  # State transition logic
├── business-days.ts  # Business day calculations
└── timeouts.ts       # Default timeouts and configuration
```

## 3. Key Data Types

### States
- `ISSUED` - Initial state, invoice created
- `DUE_SOON` - 7 business days before due date
- `OVERDUE` - Past due date
- `GRACE` - 3 business days after overdue
- `REMINDER_1` - First reminder after grace
- `REMINDER_2` - Second reminder (14bd after REMINDER_1)
- `FINAL_NOTICE` - Final warning (14bd after REMINDER_2)
- `SUSPENDED` - Service suspended (7bd after FINAL_NOTICE)
- `WRITTEN_OFF` - Terminal state
- `PAID` - Terminal state
- `CANCELLED` - Terminal state
- `PAUSED` - Manual override state

### Events
- `tick` - Check for time-based transitions
- `payment_received` - Payment received
- `invoice_cancelled` - Invoice cancelled
- `dunning_paused` - Pause dunning manually
- `dunning_resumed` - Resume dunning
- `manual_advance` - Force advance to next state

### Action Descriptors
```typescript
{ type: 'send_email', template: string }
{ type: 'suspend_service' }
{ type: 'resume_service' }
{ type: 'schedule_next_check', days: number }
```

### Configuration
```typescript
interface DunningConfig {
  timeouts?: {
    dueSoon?: number;           // days before due
    overdueToGrace?: number;    // business days
    graceToReminder1?: number;
    reminder1ToReminder2?: number;
    reminder2ToFinal?: number;
    finalToSuspended?: number;
    suspendedToWrittenOff?: number;
  };
  holidays?: Date[];             // public holidays to exclude
}
```

## 4. Public API

### `createDunning(dueDate: Date, config?: DunningConfig): DunningState`
Creates a new dunning instance in ISSUED state.

### `process(state: DunningState, event: Event, now: Date): ProcessResult`
Pure function that processes an event against current state.
Returns:
```typescript
{
  state: DunningState;
  actions: Action[];
}
```

## 5. State Transitions

### Happy Path (time-based)
```
ISSUED → DUE_SOON → OVERDUE → GRACE → REMINDER_1 → REMINDER_2 → FINAL_NOTICE → SUSPENDED → WRITTEN_OFF
```

### Event Handlers
- **tick**: Check if timeout reached, advance state
- **payment_received**: Transition to PAID (except WRITTEN_OFF, PAID, CANCELLED)
- **invoice_cancelled**: Transition to CANCELLED (except PAID, WRITTEN_OFF, CANCELLED)
- **dunning_paused**: Pause if in active dunning state
- **dunning_resumed**: Resume from PAUSED
- **manual_advance**: Force advance to next state

## 6. Business Days Calculation

- Exclude weekends (Saturday, Sunday)
- Exclude configurable public holidays
- Count only working days between dates

## 7. Default Timeouts

| Transition | Default Value |
|------------|---------------|
| ISSUED → DUE_SOON | 7 days before due |
| DUE_SOON → OVERDUE | 0 days (on due date) |
| OVERDUE → GRACE | 3 business days |
| GRACE → REMINDER_1 | 7 business days |
| REMINDER_1 → REMINDER_2 | 14 business days |
| REMINDER_2 → FINAL_NOTICE | 14 business days |
| FINAL_NOTICE → SUSPENDED | 7 business days |
| SUSPENDED → WRITTEN_OFF | 30 business days |

## 8. Testing Strategy

All acceptance criteria will be implemented as failing unit tests first, then made to pass with minimal implementation.
