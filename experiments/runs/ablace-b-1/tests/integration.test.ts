import { describe, it, expect } from 'vitest';
import { createInstance, process } from '../src/index.js';
import { addBusinessDays } from '../src/business-days.js';

describe('Dunning System - Full Integration Tests', () => {
  describe('Complete escalation path', () => {
    it('should follow the full escalation path from ISSUED to WRITTEN_OFF', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);

      expect(state.status).toBe('ISSUED');

      let currentState = state;

      currentState = process(
        currentState,
        { type: 'tick' },
        addBusinessDays(dueDate, -7)
      ).state;
      expect(currentState.status).toBe('DUE_SOON');

      currentState = process(
        currentState,
        { type: 'tick' },
        dueDate
      ).state;
      expect(currentState.status).toBe('OVERDUE');

      currentState = process(
        currentState,
        { type: 'tick' },
        addBusinessDays(dueDate, 3)
      ).state;
      expect(currentState.status).toBe('GRACE');

      currentState = process(
        currentState,
        { type: 'tick' },
        addBusinessDays(dueDate, 10)
      ).state;
      expect(currentState.status).toBe('REMINDER_1');

      currentState = process(
        currentState,
        { type: 'tick' },
        addBusinessDays(dueDate, 24)
      ).state;
      expect(currentState.status).toBe('REMINDER_2');

      currentState = process(
        currentState,
        { type: 'tick' },
        addBusinessDays(dueDate, 38)
      ).state;
      expect(currentState.status).toBe('FINAL_NOTICE');

      currentState = process(
        currentState,
        { type: 'tick' },
        addBusinessDays(dueDate, 45)
      ).state;
      expect(currentState.status).toBe('SUSPENDED');

      currentState = process(
        currentState,
        { type: 'tick' },
        addBusinessDays(dueDate, 75)
      ).state;
      expect(currentState.status).toBe('WRITTEN_OFF');
    });
  });

  describe('Payment at various stages', () => {
    it('should resolve to PAID when payment received at any stage', () => {
      const dueDate = new Date('2024-01-15');
      const stages: Array<{ status: string; stateEnteredAtDays: number }> = [
        { status: 'ISSUED', stateEnteredAtDays: 0 },
        { status: 'DUE_SOON', stateEnteredAtDays: -7 },
        { status: 'OVERDUE', stateEnteredAtDays: 0 },
        { status: 'GRACE', stateEnteredAtDays: 3 },
        { status: 'REMINDER_1', stateEnteredAtDays: 10 },
        { status: 'REMINDER_2', stateEnteredAtDays: 24 },
        { status: 'FINAL_NOTICE', stateEnteredAtDays: 38 },
        { status: 'SUSPENDED', stateEnteredAtDays: 45 },
      ];

      for (const stage of stages) {
        const state = createInstance(dueDate);
        state.status = stage.status as any;
        state.stateEnteredAt = addBusinessDays(dueDate, stage.stateEnteredAtDays);

        const result = process(state, { type: 'payment_received' }, new Date());
        expect(result.state.status).toBe('PAID');
      }
    });

    it('should resume service when payment received from SUSPENDED', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = 'SUSPENDED';
      state.stateEnteredAt = addBusinessDays(dueDate, 45);

      const result = process(state, { type: 'payment_received' }, new Date());

      expect(result.state.status).toBe('PAID');
      expect(result.actions).toContainEqual({ type: 'resume_service' });
    });
  });

  describe('Invoice cancellation at various stages', () => {
    it('should transition to CANCELLED when invoice cancelled at any stage', () => {
      const dueDate = new Date('2024-01-15');
      const stages: Array<{ status: string; stateEnteredAtDays: number }> = [
        { status: 'ISSUED', stateEnteredAtDays: 0 },
        { status: 'DUE_SOON', stateEnteredAtDays: -7 },
        { status: 'OVERDUE', stateEnteredAtDays: 0 },
        { status: 'GRACE', stateEnteredAtDays: 3 },
        { status: 'REMINDER_1', stateEnteredAtDays: 10 },
        { status: 'REMINDER_2', stateEnteredAtDays: 24 },
        { status: 'FINAL_NOTICE', stateEnteredAtDays: 38 },
        { status: 'SUSPENDED', stateEnteredAtDays: 45 },
      ];

      for (const stage of stages) {
        const state = createInstance(dueDate);
        state.status = stage.status as any;
        state.stateEnteredAt = addBusinessDays(dueDate, stage.stateEnteredAtDays);

        const result = process(state, { type: 'invoice_cancelled' }, new Date());
        expect(result.state.status).toBe('CANCELLED');
      }
    });

    it('should resume service when cancelling from SUSPENDED', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      state.status = 'SUSPENDED';
      state.stateEnteredAt = addBusinessDays(dueDate, 45);

      const result = process(state, { type: 'invoice_cancelled' }, new Date());

      expect(result.state.status).toBe('CANCELLED');
      expect(result.actions).toContainEqual({ type: 'resume_service' });
    });
  });

  describe('Pause and resume functionality', () => {
    it('should pause and resume dunning correctly', () => {
      const dueDate = new Date('2024-01-15');
      let state = createInstance(dueDate);

      state = process(state, { type: 'tick' }, addBusinessDays(dueDate, -7)).state;
      expect(state.status).toBe('DUE_SOON');

      state = process(state, { type: 'tick' }, dueDate).state;
      expect(state.status).toBe('OVERDUE');

      state = process(state, { type: 'dunning_paused' }, addBusinessDays(dueDate, 2)).state;
      expect(state.status).toBe('PAUSED');
      expect(state.pausedFrom).toBe('OVERDUE');

      state = process(state, { type: 'dunning_resumed' }, addBusinessDays(dueDate, 10)).state;
      expect(state.status).toBe('OVERDUE');
      expect(state.pausedFrom).toBeUndefined();
    });

    it('should allow payment while paused', () => {
      const dueDate = new Date('2024-01-15');
      let state = createInstance(dueDate);

      state = process(state, { type: 'tick' }, dueDate).state;
      state = process(state, { type: 'dunning_paused' }, addBusinessDays(dueDate, 2)).state;

      const result = process(state, { type: 'payment_received' }, new Date());
      expect(result.state.status).toBe('PAID');
    });

    it('should allow cancellation while paused', () => {
      const dueDate = new Date('2024-01-15');
      let state = createInstance(dueDate);

      state = process(state, { type: 'tick' }, dueDate).state;
      state = process(state, { type: 'dunning_paused' }, addBusinessDays(dueDate, 2)).state;

      const result = process(state, { type: 'invoice_cancelled' }, new Date());
      expect(result.state.status).toBe('CANCELLED');
    });
  });

  describe('Manual advance functionality', () => {
    it('should manually advance through all stages', () => {
      const dueDate = new Date('2024-01-15');
      let state = createInstance(dueDate);

      state = process(state, { type: 'tick' }, addBusinessDays(dueDate, -7)).state;
      expect(state.status).toBe('DUE_SOON');

      state = process(state, { type: 'tick' }, dueDate).state;
      expect(state.status).toBe('OVERDUE');

      state = process(state, { type: 'manual_advance' }, new Date()).state;
      expect(state.status).toBe('GRACE');

      state = process(state, { type: 'manual_advance' }, new Date()).state;
      expect(state.status).toBe('REMINDER_1');

      state = process(state, { type: 'manual_advance' }, new Date()).state;
      expect(state.status).toBe('REMINDER_2');

      state = process(state, { type: 'manual_advance' }, new Date()).state;
      expect(state.status).toBe('FINAL_NOTICE');

      state = process(state, { type: 'manual_advance' }, new Date()).state;
      expect(state.status).toBe('SUSPENDED');

      state = process(state, { type: 'manual_advance' }, new Date()).state;
      expect(state.status).toBe('WRITTEN_OFF');
    });
  });

  describe('Custom timeouts', () => {
    it('should use custom timeouts when provided', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate, {
        timeouts: {
          DUE_SOON: -3,
        },
      });

      const result = process(
        state,
        { type: 'tick' },
        addBusinessDays(dueDate, -3)
      );

      expect(result.state.status).toBe('DUE_SOON');
    });
  });

  describe('Holiday handling', () => {
    it('should skip holidays in timeout calculations', () => {
      const holiday = new Date('2024-01-08');
      const dueDate = new Date('2024-01-15');

      const state = createInstance(dueDate, {
        holidays: [holiday],
      });

      const result = process(
        state,
        { type: 'tick' },
        addBusinessDays(dueDate, -7, [holiday])
      );

      expect(result.state.status).toBe('DUE_SOON');
    });
  });

  describe('Terminal states behavior', () => {
    const terminalStates = ['PAID', 'WRITTEN_OFF', 'CANCELLED'];

    for (const status of terminalStates) {
      it(`should not transition from ${status} state on tick`, () => {
        const dueDate = new Date('2024-01-15');
        const state = createInstance(dueDate);
        state.status = status as any;
        state.stateEnteredAt = new Date('2024-01-01');

        const result = process(state, { type: 'tick' }, new Date('2025-01-01'));
        expect(result.state.status).toBe(status);
      });

      it(`should not transition from ${status} state on payment`, () => {
        const dueDate = new Date('2024-01-15');
        const state = createInstance(dueDate);
        state.status = status as any;
        state.stateEnteredAt = new Date('2024-01-01');

        const result = process(state, { type: 'payment_received' }, new Date());
        expect(result.state.status).toBe(status);
      });

      it(`should not transition from ${status} state on cancellation`, () => {
        const dueDate = new Date('2024-01-15');
        const state = createInstance(dueDate);
        state.status = status as any;
        state.stateEnteredAt = new Date('2024-01-01');

        const result = process(state, { type: 'invoice_cancelled' }, new Date());
        expect(result.state.status).toBe(status);
      });

      it(`should not transition from ${status} state on manual advance`, () => {
        const dueDate = new Date('2024-01-15');
        const state = createInstance(dueDate);
        state.status = status as any;
        state.stateEnteredAt = new Date('2024-01-01');

        const result = process(state, { type: 'manual_advance' }, new Date());
        expect(result.state.status).toBe(status);
      });
    }
  });

  describe('Action descriptors are correct', () => {
    it('should return correct actions for each transition', () => {
      const dueDate = new Date('2024-01-15');
      let state = createInstance(dueDate);

      let result = process(state, { type: 'tick' }, addBusinessDays(dueDate, -7));
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'due_soon_reminder' });
      expect(result.state.status).toBe('DUE_SOON');

      state = result.state;
      result = process(state, { type: 'tick' }, dueDate);
      expect(result.state.status).toBe('OVERDUE');

      state = result.state;
      result = process(state, { type: 'tick' }, addBusinessDays(dueDate, 3));
      expect(result.state.status).toBe('GRACE');

      state = result.state;
      result = process(state, { type: 'tick' }, addBusinessDays(dueDate, 10));
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'first_reminder' });
      expect(result.state.status).toBe('REMINDER_1');

      state = result.state;
      result = process(state, { type: 'tick' }, addBusinessDays(dueDate, 24));
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'second_reminder' });
      expect(result.state.status).toBe('REMINDER_2');

      state = result.state;
      result = process(state, { type: 'tick' }, addBusinessDays(dueDate, 38));
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'final_warning' });
      expect(result.state.status).toBe('FINAL_NOTICE');

      state = result.state;
      result = process(state, { type: 'tick' }, addBusinessDays(dueDate, 45));
      expect(result.actions).toContainEqual({ type: 'suspend_service' });
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'service_suspended' });
      expect(result.state.status).toBe('SUSPENDED');

      state = result.state;
      result = process(state, { type: 'tick' }, addBusinessDays(dueDate, 75));
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'written_off_notice' });
      expect(result.state.status).toBe('WRITTEN_OFF');
    });
  });
});