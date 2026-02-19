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

describe('Time-based transitions (happy path escalation)', () => {
  describe('ISSUED -> DUE_SOON', () => {
    it('Given an invoice is in ISSUED state, When 7 business days before the due date is reached, Then the state transitions to DUE_SOON', () => {
      const dueDate = createDate(2024, 3, 15);
      const state = createDunning(dueDate);
      expect(state.status).toBe('ISSUED');

      const now = addDays(dueDate, -7);
      const result = process(state, 'tick', now);

      expect(result.state.status).toBe('DUE_SOON');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'due_soon_reminder' });
    });
  });

  describe('DUE_SOON -> OVERDUE', () => {
    it('Given an invoice is in DUE_SOON state, When the due date is reached, Then the state transitions to OVERDUE', () => {
      const dueDate = createDate(2024, 3, 15);
      let state = createDunning(dueDate);
      state = process(state, 'tick', addDays(dueDate, -7)).state;
      expect(state.status).toBe('DUE_SOON');

      const result = process(state, 'tick', dueDate);

      expect(result.state.status).toBe('OVERDUE');
      expect(result.actions).toHaveLength(0);
    });
  });

  describe('OVERDUE -> GRACE', () => {
    it('Given an invoice is in OVERDUE state, When 3 business days have elapsed, Then the state transitions to GRACE', () => {
      const dueDate = createDate(2024, 3, 15);
      let state = createDunning(dueDate);
      state = process(state, 'tick', addDays(dueDate, -7)).state;
      state = process(state, 'tick', dueDate).state;
      expect(state.status).toBe('OVERDUE');

      const graceDate = addBusinessDays(state.stateEnteredAt, 3);
      const result = process(state, 'tick', graceDate);

      expect(result.state.status).toBe('GRACE');
      expect(result.actions).toHaveLength(0);
    });
  });

  describe('GRACE -> REMINDER_1', () => {
    it('Given an invoice is in GRACE state, When 7 business days have elapsed, Then the state transitions to REMINDER_1', () => {
      const dueDate = createDate(2024, 3, 15);
      let state = createDunning(dueDate);
      state = process(state, 'tick', addDays(dueDate, -7)).state;
      state = process(state, 'tick', dueDate).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 3)).state;
      expect(state.status).toBe('GRACE');

      const reminder1Date = addBusinessDays(state.stateEnteredAt, 7);
      const result = process(state, 'tick', reminder1Date);

      expect(result.state.status).toBe('REMINDER_1');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'first_reminder' });
    });
  });

  describe('REMINDER_1 -> REMINDER_2', () => {
    it('Given an invoice is in REMINDER_1 state, When 14 business days have elapsed, Then the state transitions to REMINDER_2', () => {
      const dueDate = createDate(2024, 3, 15);
      let state = createDunning(dueDate);
      state = process(state, 'tick', addDays(dueDate, -7)).state;
      state = process(state, 'tick', dueDate).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 3)).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 7)).state;
      expect(state.status).toBe('REMINDER_1');

      const reminder2Date = addBusinessDays(state.stateEnteredAt, 14);
      const result = process(state, 'tick', reminder2Date);

      expect(result.state.status).toBe('REMINDER_2');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'second_reminder' });
    });
  });

  describe('REMINDER_2 -> FINAL_NOTICE', () => {
    it('Given an invoice is in REMINDER_2 state, When 14 business days have elapsed, Then the state transitions to FINAL_NOTICE', () => {
      const dueDate = createDate(2024, 3, 15);
      let state = createDunning(dueDate);
      state = process(state, 'tick', addDays(dueDate, -7)).state;
      state = process(state, 'tick', dueDate).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 3)).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 7)).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 14)).state;
      expect(state.status).toBe('REMINDER_2');

      const finalDate = addBusinessDays(state.stateEnteredAt, 14);
      const result = process(state, 'tick', finalDate);

      expect(result.state.status).toBe('FINAL_NOTICE');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'final_warning' });
    });
  });

  describe('FINAL_NOTICE -> SUSPENDED', () => {
    it('Given an invoice is in FINAL_NOTICE state, When 7 business days have elapsed, Then the state transitions to SUSPENDED', () => {
      const dueDate = createDate(2024, 3, 15);
      let state = createDunning(dueDate);
      state = process(state, 'tick', addDays(dueDate, -7)).state;
      state = process(state, 'tick', dueDate).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 3)).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 7)).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 14)).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 14)).state;
      expect(state.status).toBe('FINAL_NOTICE');

      const suspendedDate = addBusinessDays(state.stateEnteredAt, 7);
      const result = process(state, 'tick', suspendedDate);

      expect(result.state.status).toBe('SUSPENDED');
      expect(result.actions).toHaveLength(2);
      expect(result.actions).toContainEqual({ type: 'suspend_service' });
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'service_suspended' });
    });
  });

  describe('SUSPENDED -> WRITTEN_OFF', () => {
    it('Given an invoice is in SUSPENDED state, When 30 business days have elapsed, Then the state transitions to WRITTEN_OFF', () => {
      const dueDate = createDate(2024, 3, 15);
      let state = createDunning(dueDate);
      state = process(state, 'tick', addDays(dueDate, -7)).state;
      state = process(state, 'tick', dueDate).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 3)).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 7)).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 14)).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 14)).state;
      state = process(state, 'tick', addBusinessDays(state.stateEnteredAt, 7)).state;
      expect(state.status).toBe('SUSPENDED');

      const writtenOffDate = addBusinessDays(state.stateEnteredAt, 30);
      const result = process(state, 'tick', writtenOffDate);

      expect(result.state.status).toBe('WRITTEN_OFF');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'written_off_notice' });
    });
  });
});
