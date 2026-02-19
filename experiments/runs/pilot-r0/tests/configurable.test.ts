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

describe('Configurable timeouts', () => {
  it('Given a dunning instance is created with custom timeout configuration, When time-based transitions are evaluated, Then the custom timeouts are used instead of the defaults', () => {
    const dueDate = createDate(2024, 3, 15);
    const customConfig = {
      timeouts: {
        graceToReminder1: 14
      }
    };

    let state = createDunning(dueDate, customConfig);
    state = process(state, 'tick', addDays(dueDate, -7)).state;
    expect(state.status).toBe('DUE_SOON');
    
    state = process(state, 'tick', dueDate).state;
    expect(state.status).toBe('OVERDUE');
    
    state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 3)).state;
    expect(state.status).toBe('GRACE');

    const after14bd = addBusinessDays(state.stateEnteredAt, 14);
    state = process(state, 'tick', after14bd).state;
    expect(state.status).toBe('REMINDER_1');
  });

  it('Given no custom timeout configuration is provided, When a dunning instance is created, Then the default timeouts are used', () => {
    const dueDate = createDate(2024, 3, 15);

    let state = createDunning(dueDate);
    state = process(state, 'tick', addDays(dueDate, -7)).state;
    expect(state.status).toBe('DUE_SOON');
    
    state = process(state, 'tick', dueDate).state;
    expect(state.status).toBe('OVERDUE');
    
    state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 3)).state;
    expect(state.status).toBe('GRACE');

    const after7bd = addBusinessDays(state.stateEnteredAt, 7);
    state = process(state, 'tick', after7bd).state;
    expect(state.status).toBe('REMINDER_1');
  });

  it('Default timeouts are correct', () => {
    const dueDate = createDate(2024, 3, 15);
    const state = createDunning(dueDate);
    
    expect(state.config.timeouts?.dueSoon).toBeUndefined();
    expect(state.config.timeouts?.graceToReminder1).toBeUndefined();
  });
});
