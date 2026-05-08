import { describe, it, expect } from 'vitest';
import { createInstance, process } from '../src/index.js';

describe('process function - payment events', () => {
  const PAID_TRANSITION_STATUSES = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED', 'PAUSED'];

  PAID_TRANSITION_STATUSES.forEach((status) => {
    it(`should transition to PAID from ${status} state`, () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = status as any;
      state.stateEnteredAt = new Date('2024-01-01');

      const result = process(state, { type: 'payment_received' }, new Date());

      expect(result.state.status).toBe('PAID');
    });
  });

  it('should return resume_service action when paying from SUSPENDED', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'SUSPENDED';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'payment_received' }, new Date());

    expect(result.state.status).toBe('PAID');
    expect(result.actions).toContainEqual({ type: 'resume_service' });
  });

  it('should not transition from PAID state', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'PAID';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'payment_received' }, new Date());

    expect(result.state.status).toBe('PAID');
    expect(result.actions).toHaveLength(0);
  });

  it('should not transition from WRITTEN_OFF state', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'WRITTEN_OFF';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'payment_received' }, new Date());

    expect(result.state.status).toBe('WRITTEN_OFF');
    expect(result.actions).toHaveLength(0);
  });

  it('should not transition from CANCELLED state', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'CANCELLED';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'payment_received' }, new Date());

    expect(result.state.status).toBe('CANCELLED');
    expect(result.actions).toHaveLength(0);
  });
});

describe('process function - invoice cancellation', () => {
  const CANCEL_TRANSITION_STATUSES = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED', 'PAUSED'];

  CANCEL_TRANSITION_STATUSES.forEach((status) => {
    it(`should transition to CANCELLED from ${status} state`, () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = status as any;
      state.stateEnteredAt = new Date('2024-01-01');

      const result = process(state, { type: 'invoice_cancelled' }, new Date());

      expect(result.state.status).toBe('CANCELLED');
    });
  });

  it('should return resume_service action when cancelling from SUSPENDED', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'SUSPENDED';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'invoice_cancelled' }, new Date());

    expect(result.state.status).toBe('CANCELLED');
    expect(result.actions).toContainEqual({ type: 'resume_service' });
  });

  it('should not transition from PAID state', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'PAID';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'invoice_cancelled' }, new Date());

    expect(result.state.status).toBe('PAID');
    expect(result.actions).toHaveLength(0);
  });

  it('should not transition from WRITTEN_OFF state', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'WRITTEN_OFF';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'invoice_cancelled' }, new Date());

    expect(result.state.status).toBe('WRITTEN_OFF');
    expect(result.actions).toHaveLength(0);
  });

  it('should not transition from CANCELLED state', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'CANCELLED';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'invoice_cancelled' }, new Date());

    expect(result.state.status).toBe('CANCELLED');
    expect(result.actions).toHaveLength(0);
  });
});

describe('process function - pause/resume', () => {
  const PAUSE_STATUSES: ('OVERDUE' | 'GRACE' | 'REMINDER_1' | 'REMINDER_2' | 'FINAL_NOTICE' | 'SUSPENDED')[] = [
    'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'
  ];

  PAUSE_STATUSES.forEach((status) => {
    it(`should transition to PAUSED from ${status} state`, () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = status;
      state.stateEnteredAt = new Date('2024-01-01');

      const result = process(state, { type: 'dunning_paused' }, new Date('2024-01-10'));

      expect(result.state.status).toBe('PAUSED');
      expect(result.state.pausedFrom).toBe(status);
    });
  });

  it('should not allow pause from ISSUED state', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'ISSUED';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'dunning_paused' }, new Date());

    expect(result.state.status).toBe('ISSUED');
    expect(result.state.pausedFrom).toBeUndefined();
  });

  it('should not allow pause from DUE_SOON state', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'DUE_SOON';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'dunning_paused' }, new Date());

    expect(result.state.status).toBe('DUE_SOON');
    expect(result.state.pausedFrom).toBeUndefined();
  });

  it('should transition back to previous state on resume', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'PAUSED';
    state.pausedFrom = 'OVERDUE';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'dunning_resumed' }, new Date('2024-01-10'));

    expect(result.state.status).toBe('OVERDUE');
    expect(result.state.pausedFrom).toBeUndefined();
  });

  it('should not allow resume from non-PAUSED state', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'OVERDUE';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'dunning_resumed' }, new Date());

    expect(result.state.status).toBe('OVERDUE');
  });

  it('should prioritize payment over pause', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'PAUSED';
    state.pausedFrom = 'OVERDUE';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'payment_received' }, new Date());

    expect(result.state.status).toBe('PAID');
    expect(result.actions).not.toContainEqual({ type: 'resume_service' });
  });

  it('should allow cancellation from PAUSED state', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'PAUSED';
    state.pausedFrom = 'OVERDUE';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'invoice_cancelled' }, new Date());

    expect(result.state.status).toBe('CANCELLED');
  });
});

describe('process function - manual advance', () => {
  const ACTIVE_STATUSES = ['OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];

  ACTIVE_STATUSES.forEach((status) => {
    it(`should manually advance from ${status} to next state`, () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = status as any;
      state.stateEnteredAt = new Date('2024-01-01');

      const result = process(state, { type: 'manual_advance' }, new Date());

      const nextStatus = getNextStatus(status);
      if (nextStatus) {
        expect(result.state.status).toBe(nextStatus);
      }
    });
  });

  it('should not allow manual advance from terminal states', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'WRITTEN_OFF';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'manual_advance' }, new Date());

    expect(result.state.status).toBe('WRITTEN_OFF');
  });

  it('should not allow manual advance from PAID', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'PAID';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'manual_advance' }, new Date());

    expect(result.state.status).toBe('PAID');
  });

  it('should not allow manual advance from CANCELLED', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'CANCELLED';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'manual_advance' }, new Date());

    expect(result.state.status).toBe('CANCELLED');
  });

  it('should return actions for manual advance transition', () => {
    const dueDate = new Date('2024-01-15');
    const state = createInstance(dueDate);
    state.status = 'SUSPENDED';
    state.stateEnteredAt = new Date('2024-01-01');

    const result = process(state, { type: 'manual_advance' }, new Date());

    expect(result.state.status).toBe('WRITTEN_OFF');
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toEqual({ type: 'send_email', template: 'written_off_notice' });
  });
});

function getNextStatus(current: string): string | null {
  const order = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED', 'WRITTEN_OFF'];
  const idx = order.indexOf(current);
  if (idx === -1 || idx >= order.length - 1) return null;
  return order[idx + 1];
}