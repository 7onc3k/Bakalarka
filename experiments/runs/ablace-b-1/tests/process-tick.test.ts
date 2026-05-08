import { describe, it, expect } from 'vitest';
import { createInstance, process } from '../src/index.js';
import { addBusinessDays } from '../src/business-days.js';

const DEFAULT_TIMEOUTS = {
  DUE_SOON: -7, // 7 business days BEFORE due date
  OVERDUE: 0,   // at due date
  GRACE: 3,     // 3 business days after due date
  REMINDER_1: 7,
  REMINDER_2: 14,
  FINAL_NOTICE: 14,
  SUSPENDED: 7,
  WRITTEN_OFF: 30,
};

describe('process function - tick events (time-based transitions)', () => {
  describe('ISSUED → DUE_SOON', () => {
    it('should transition to DUE_SOON 7 business days before due date', () => {
      const dueDate = addBusinessDays(new Date('2024-01-01'), 10); // Jan 15 (after weekend)
      const state = createInstance(dueDate);
      const transitionDate = addBusinessDays(dueDate, DEFAULT_TIMEOUTS.DUE_SOON);
      
      const result = process(state, { type: 'tick' }, transitionDate);
      
      expect(result.state.status).toBe('DUE_SOON');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'due_soon_reminder' });
    });

    it('should not transition before 7 business days before due date', () => {
      const dueDate = addBusinessDays(new Date('2024-01-01'), 10);
      const state = createInstance(dueDate);
      const checkDate = addBusinessDays(dueDate, DEFAULT_TIMEOUTS.DUE_SOON - 2);
      
      const result = process(state, { type: 'tick' }, checkDate);
      
      expect(result.state.status).toBe('ISSUED');
      expect(result.actions).toHaveLength(0);
    });
  });

  describe('DUE_SOON → OVERDUE', () => {
    it('should transition to OVERDUE at due date', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      const stateEnteredAt = addBusinessDays(dueDate, DEFAULT_TIMEOUTS.DUE_SOON);
      state.status = 'DUE_SOON';
      state.stateEnteredAt = stateEnteredAt;
      
      const result = process(state, { type: 'tick' }, dueDate);
      
      expect(result.state.status).toBe('OVERDUE');
      expect(result.actions).toHaveLength(0);
    });
  });

  describe('OVERDUE → GRACE', () => {
    it('should transition to GRACE after 3 business days', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = 'OVERDUE';
      state.stateEnteredAt = dueDate;
      
      const graceDate = addBusinessDays(dueDate, 3);
      const result = process(state, { type: 'tick' }, graceDate);
      
      expect(result.state.status).toBe('GRACE');
      expect(result.actions).toHaveLength(0);
    });
  });

  describe('GRACE → REMINDER_1', () => {
    it('should transition to REMINDER_1 after 7 business days', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = 'GRACE';
      state.stateEnteredAt = dueDate;
      
      const reminderDate = addBusinessDays(dueDate, 7);
      const result = process(state, { type: 'tick' }, reminderDate);
      
      expect(result.state.status).toBe('REMINDER_1');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'first_reminder' });
    });
  });

  describe('REMINDER_1 → REMINDER_2', () => {
    it('should transition to REMINDER_2 after 14 business days', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = 'REMINDER_1';
      state.stateEnteredAt = dueDate;
      
      const reminderDate = addBusinessDays(dueDate, 14);
      const result = process(state, { type: 'tick' }, reminderDate);
      
      expect(result.state.status).toBe('REMINDER_2');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'second_reminder' });
    });
  });

  describe('REMINDER_2 → FINAL_NOTICE', () => {
    it('should transition to FINAL_NOTICE after 14 business days', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = 'REMINDER_2';
      state.stateEnteredAt = dueDate;
      
      const finalDate = addBusinessDays(dueDate, 14);
      const result = process(state, { type: 'tick' }, finalDate);
      
      expect(result.state.status).toBe('FINAL_NOTICE');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'final_warning' });
    });
  });

  describe('FINAL_NOTICE → SUSPENDED', () => {
    it('should transition to SUSPENDED after 7 business days', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = 'FINAL_NOTICE';
      state.stateEnteredAt = dueDate;
      
      const suspendedDate = addBusinessDays(dueDate, 7);
      const result = process(state, { type: 'tick' }, suspendedDate);
      
      expect(result.state.status).toBe('SUSPENDED');
      expect(result.actions).toHaveLength(2);
      expect(result.actions).toContainEqual({ type: 'suspend_service' });
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'service_suspended' });
    });
  });

  describe('SUSPENDED → WRITTEN_OFF', () => {
    it('should transition to WRITTEN_OFF after 30 business days', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = 'SUSPENDED';
      state.stateEnteredAt = dueDate;
      
      const writtenOffDate = addBusinessDays(dueDate, 30);
      const result = process(state, { type: 'tick' }, writtenOffDate);
      
      expect(result.state.status).toBe('WRITTEN_OFF');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'written_off_notice' });
    });
  });

  describe('terminal states', () => {
    it('should not transition from PAID state', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = 'PAID';
      state.stateEnteredAt = new Date('2024-01-01');
      
      const result = process(state, { type: 'tick' }, new Date('2024-02-01'));
      
      expect(result.state.status).toBe('PAID');
      expect(result.actions).toHaveLength(0);
    });

    it('should not transition from WRITTEN_OFF state', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = 'WRITTEN_OFF';
      state.stateEnteredAt = new Date('2024-01-01');
      
      const result = process(state, { type: 'tick' }, new Date('2024-02-01'));
      
      expect(result.state.status).toBe('WRITTEN_OFF');
      expect(result.actions).toHaveLength(0);
    });

    it('should not transition from CANCELLED state', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = 'CANCELLED';
      state.stateEnteredAt = new Date('2024-01-01');
      
      const result = process(state, { type: 'tick' }, new Date('2024-02-01'));
      
      expect(result.state.status).toBe('CANCELLED');
      expect(result.actions).toHaveLength(0);
    });
  });

  describe('custom timeouts', () => {
    it('should use custom timeout when provided', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate, { timeouts: { DUE_SOON: -3 } });
      
      const transitionDate = addBusinessDays(dueDate, -3);
      const result = process(state, { type: 'tick' }, transitionDate);
      
      expect(result.state.status).toBe('DUE_SOON');
    });
  });

  describe('business days with holidays', () => {
    it('should skip holidays in timeout calculation', () => {
      const holiday = new Date('2024-01-08');
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate, { holidays: [holiday] });
      
      const transitionDate = addBusinessDays(dueDate, -7, [holiday]);
      const result = process(state, { type: 'tick' }, transitionDate);
      
      expect(result.state.status).toBe('DUE_SOON');
    });
  });
});