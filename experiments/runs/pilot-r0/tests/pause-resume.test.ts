import { describe, it, expect } from 'vitest';
import { createDunning, process, DunningState, addBusinessDays } from '../src/index';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function createDate(year: number, month: number, day: number): Date {
  const d = new Date(year, month - 1, day);
  d.setHours(12, 0, 0, 0);
  return d;
}

function advanceToState(state: ReturnType<typeof createDunning>, targetStatus: string, dueDate: Date): ReturnType<typeof createDunning> {
  let currentState = state;
  
  while (currentState.status !== targetStatus) {
    if (currentState.status === 'ISSUED') {
      currentState = process(currentState, 'tick', addDays(dueDate, -7)).state;
    } else if (currentState.status === 'DUE_SOON') {
      currentState = process(currentState, 'tick', dueDate).state;
    } else if (currentState.status === 'OVERDUE') {
      currentState = process(currentState, 'tick', addBusinessDays(currentState.stateEnteredAt, 3)).state;
    } else if (currentState.status === 'GRACE') {
      currentState = process(currentState, 'tick', addBusinessDays(currentState.stateEnteredAt, 7)).state;
    } else if (currentState.status === 'REMINDER_1') {
      currentState = process(currentState, 'tick', addBusinessDays(currentState.stateEnteredAt, 14)).state;
    } else if (currentState.status === 'REMINDER_2') {
      currentState = process(currentState, 'tick', addBusinessDays(currentState.stateEnteredAt, 14)).state;
    } else if (currentState.status === 'FINAL_NOTICE') {
      currentState = process(currentState, 'tick', addBusinessDays(currentState.stateEnteredAt, 7)).state;
    } else if (currentState.status === 'SUSPENDED') {
      currentState = process(currentState, 'tick', addBusinessDays(currentState.stateEnteredAt, 30)).state;
    } else {
      break;
    }
  }
  
  return currentState;
}

describe('Invoice cancellation', () => {
  const dueDate = createDate(2024, 3, 15);

  it('Given an invoice is in any state except PAID, WRITTEN_OFF, and CANCELLED, When an invoice_cancelled event occurs, Then the state transitions to CANCELLED', () => {
    const statesToTest = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED', 'PAUSED'];

    for (const status of statesToTest) {
      let state = createDunning(dueDate);
      state = advanceToState(state, status, dueDate);
      
      if (status === 'PAUSED') {
        state = { ...state, status: 'PAUSED', previousStatus: 'OVERDUE' };
      }
      
      expect(state.status).toBe(status);

      const result = process(state, 'invoice_cancelled', new Date());

      expect(result.state.status).toBe('CANCELLED');
    }
  });

  it('Given an invoice was in SUSPENDED state, When an invoice_cancelled event transitions it to CANCELLED, Then an action descriptor resume_service() is returned', () => {
    let state = createDunning(dueDate);
    state = advanceToState(state, 'SUSPENDED', dueDate);
    expect(state.status).toBe('SUSPENDED');

    const result = process(state, 'invoice_cancelled', new Date());

    expect(result.state.status).toBe('CANCELLED');
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toEqual({ type: 'resume_service' });
  });
});

describe('Pause / Resume (manual override)', () => {
  const dueDate = createDate(2024, 3, 15);

  it('Given an invoice is in any active dunning state (OVERDUE, GRACE, REMINDER_1, REMINDER_2, FINAL_NOTICE, SUSPENDED), When a dunning_paused event occurs, Then the state transitions to PAUSED', () => {
    const activeStates = ['OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];

    for (const status of activeStates) {
      let state = createDunning(dueDate);
      state = advanceToState(state, status, dueDate);
      expect(state.status).toBe(status);

      const result = process(state, 'dunning_paused', new Date());

      expect(result.state.status).toBe('PAUSED');
      expect(result.state.previousStatus).toBe(status);
    }
  });

  it('Given an invoice is in PAUSED state, When a dunning_resumed event occurs, Then the state transitions back to the state it was in before pausing', () => {
    let state = createDunning(dueDate);
    state = advanceToState(state, 'GRACE', dueDate);
    expect(state.status).toBe('GRACE');

    const pauseResult = process(state, 'dunning_paused', new Date());
    expect(pauseResult.state.status).toBe('PAUSED');

    const resumeResult = process(pauseResult.state, 'dunning_resumed', new Date());

    expect(resumeResult.state.status).toBe('GRACE');
    expect(resumeResult.state.previousStatus).toBeUndefined();
  });

  it('Given an invoice is in PAUSED state, When a payment_received event occurs, Then the state transitions to PAID (payment always takes priority)', () => {
    let state = createDunning(dueDate);
    state = advanceToState(state, 'GRACE', dueDate);
    state = process(state, 'dunning_paused', new Date()).state;
    expect(state.status).toBe('PAUSED');

    const result = process(state, 'payment_received', new Date());

    expect(result.state.status).toBe('PAID');
  });

  it('Given an invoice is in PAUSED state, When an invoice_cancelled event occurs, Then the state transitions to CANCELLED', () => {
    let state = createDunning(dueDate);
    state = advanceToState(state, 'GRACE', dueDate);
    state = process(state, 'dunning_paused', new Date()).state;
    expect(state.status).toBe('PAUSED');

    const result = process(state, 'invoice_cancelled', new Date());

    expect(result.state.status).toBe('CANCELLED');
  });
});

describe('Manual advance', () => {
  const dueDate = createDate(2024, 3, 15);

  it('Given an invoice is in any active dunning state, When a manual_advance event occurs, Then the state transitions to the next state in the escalation sequence', () => {
    const transitions = [
      { from: 'ISSUED', to: 'DUE_SOON', action: { type: 'send_email', template: 'due_soon_reminder' } },
      { from: 'DUE_SOON', to: 'OVERDUE', action: null },
      { from: 'OVERDUE', to: 'GRACE', action: null },
      { from: 'GRACE', to: 'REMINDER_1', action: { type: 'send_email', template: 'first_reminder' } },
      { from: 'REMINDER_1', to: 'REMINDER_2', action: { type: 'send_email', template: 'second_reminder' } },
      { from: 'REMINDER_2', to: 'FINAL_NOTICE', action: { type: 'send_email', template: 'final_warning' } },
      { from: 'FINAL_NOTICE', to: 'SUSPENDED', action: { type: 'suspend_service' } },
      { from: 'SUSPENDED', to: 'WRITTEN_OFF', action: { type: 'send_email', template: 'written_off_notice' } }
    ];

    for (const transition of transitions) {
      let state = createDunning(dueDate);
      state = advanceToState(state, transition.from, dueDate);
      expect(state.status).toBe(transition.from);

      const result = process(state, 'manual_advance', new Date());

      expect(result.state.status).toBe(transition.to);
      if (transition.action) {
        expect(result.actions).toContainEqual(transition.action);
      }
    }
  });
});
