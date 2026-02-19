import { describe, it, expect } from 'vitest';
import { createDunning, process, addBusinessDays } from '../src/index';

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

describe('Payment (resolves dunning at any point)', () => {
  const dueDate = createDate(2024, 3, 15);

  it('Given an invoice is in any state except WRITTEN_OFF, PAID, and CANCELLED, When a payment_received event occurs, Then the state transitions to PAID', () => {
    const statesToTest = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];

    for (const status of statesToTest) {
      let state = createDunning(dueDate);
      state = advanceToState(state, status, dueDate);
      expect(state.status).toBe(status);

      const result = process(state, 'payment_received', new Date());

      expect(result.state.status).toBe('PAID');
    }
  });

  it('Given an invoice was in SUSPENDED state, When a payment_received event transitions it to PAID, Then an action descriptor resume_service() is returned in addition to the transition', () => {
    let state = createDunning(dueDate);
    state = advanceToState(state, 'SUSPENDED', dueDate);
    expect(state.status).toBe('SUSPENDED');

    const result = process(state, 'payment_received', new Date());

    expect(result.state.status).toBe('PAID');
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toEqual({ type: 'resume_service' });
  });
});
