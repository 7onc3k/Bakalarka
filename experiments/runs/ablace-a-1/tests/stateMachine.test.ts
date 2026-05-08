import { describe, it, expect } from 'vitest';
import { calculateTransition, getDefaultTimeouts, getNextState, getActionsForTransition } from '../src/stateMachine.js';
import type { DunningStatus, DunningState, DunningEvent, ActionDescriptor } from '../src/index.js';

describe('State machine', () => {
  const defaultTimeouts = getDefaultTimeouts();

  describe('getDefaultTimeouts', () => {
    it('should return correct default timeouts', () => {
      expect(defaultTimeouts.ISSUED).toBeUndefined();
      expect(defaultTimeouts.DUE_SOON).toBe(0); // at due date
      expect(defaultTimeouts.OVERDUE).toBe(3);
      expect(defaultTimeouts.GRACE).toBe(7);
      expect(defaultTimeouts.REMINDER_1).toBe(14);
      expect(defaultTimeouts.REMINDER_2).toBe(14);
      expect(defaultTimeouts.FINAL_NOTICE).toBe(7);
      expect(defaultTimeouts.SUSPENDED).toBe(30);
    });
  });

  describe('getNextState', () => {
    it('should return DUE_SOON for ISSUED when time reached', () => {
      const result = getNextState('ISSUED', 'tick', { DUE_SOON: 7 });
      expect(result).toBe('DUE_SOON');
    });

    it('should return OVERDUE for DUE_SOON when at due date', () => {
      const result = getNextState('DUE_SOON', 'tick', { DUE_SOON: 0 });
      expect(result).toBe('OVERDUE');
    });

    it('should return GRACE for OVERDUE when 3 days elapsed', () => {
      const result = getNextState('OVERDUE', 'tick', { OVERDUE: 3 });
      expect(result).toBe('GRACE');
    });

    it('should return REMINDER_1 for GRACE when 7 days elapsed', () => {
      const result = getNextState('GRACE', 'tick', { GRACE: 7 });
      expect(result).toBe('REMINDER_1');
    });

    it('should return REMINDER_2 for REMINDER_1 when 14 days elapsed', () => {
      const result = getNextState('REMINDER_1', 'tick', { REMINDER_1: 14 });
      expect(result).toBe('REMINDER_2');
    });

    it('should return FINAL_NOTICE for REMINDER_2 when 14 days elapsed', () => {
      const result = getNextState('REMINDER_2', 'tick', { REMINDER_2: 14 });
      expect(result).toBe('FINAL_NOTICE');
    });

    it('should return SUSPENDED for FINAL_NOTICE when 7 days elapsed', () => {
      const result = getNextState('FINAL_NOTICE', 'tick', { FINAL_NOTICE: 7 });
      expect(result).toBe('SUSPENDED');
    });

    it('should return WRITTEN_OFF for SUSPENDED when 30 days elapsed', () => {
      const result = getNextState('SUSPENDED', 'tick', { SUSPENDED: 30 });
      expect(result).toBe('WRITTEN_OFF');
    });

    it('should return PAID for any state on payment_received', () => {
      const states: DunningStatus[] = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];
      for (const state of states) {
        const result = getNextState(state, 'payment_received', {});
        expect(result).toBe('PAID');
      }
    });

    it('should return CANCELLED for non-terminal states on invoice_cancelled', () => {
      const states: DunningStatus[] = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];
      for (const state of states) {
        const result = getNextState(state, 'invoice_cancelled', {});
        expect(result).toBe('CANCELLED');
      }
    });

    it('should not transition from PAID', () => {
      const result = getNextState('PAID', 'tick', {});
      expect(result).toBe('PAID');
    });

    it('should not transition from WRITTEN_OFF', () => {
      const result = getNextState('WRITTEN_OFF', 'tick', {});
      expect(result).toBe('WRITTEN_OFF');
    });

    it('should not transition from CANCELLED', () => {
      const result = getNextState('CANCELLED', 'tick', {});
      expect(result).toBe('CANCELLED');
    });

    it('should return PAUSED for active states on dunning_paused', () => {
      const activeStates: DunningStatus[] = ['OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];
      for (const state of activeStates) {
        const result = getNextState(state, 'dunning_paused', {});
        expect(result).toBe('PAUSED');
      }
    });

    it('should return previous state for PAUSED on dunning_resumed', () => {
      const state: DunningState = {
        status: 'PAUSED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date(),
        config: {},
        pausedFrom: 'OVERDUE',
        pausedElapsed: 1,
      };
      const result = getNextState('PAUSED', 'dunning_resumed', {}, state);
      expect(result).toBe('OVERDUE');
    });

    it('should return PAID for PAUSED on payment_received', () => {
      const result = getNextState('PAUSED', 'payment_received', {});
      expect(result).toBe('PAID');
    });

    it('should return CANCELLED for PAUSED on invoice_cancelled', () => {
      const result = getNextState('PAUSED', 'invoice_cancelled', {});
      expect(result).toBe('CANCELLED');
    });

    it('should advance to next state on manual_advance', () => {
      expect(getNextState('OVERDUE', 'manual_advance', {})).toBe('GRACE');
      expect(getNextState('GRACE', 'manual_advance', {})).toBe('REMINDER_1');
      expect(getNextState('REMINDER_1', 'manual_advance', {})).toBe('REMINDER_2');
      expect(getNextState('REMINDER_2', 'manual_advance', {})).toBe('FINAL_NOTICE');
      expect(getNextState('FINAL_NOTICE', 'manual_advance', {})).toBe('SUSPENDED');
      expect(getNextState('SUSPENDED', 'manual_advance', {})).toBe('WRITTEN_OFF');
    });
  });

  describe('getActionsForTransition', () => {
    it('should return due_soon_reminder action for DUE_SOON transition', () => {
      const actions = getActionsForTransition('ISSUED', 'DUE_SOON');
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({ type: 'send_email', template: 'due_soon_reminder' });
    });

    it('should return first_reminder action for REMINDER_1 transition', () => {
      const actions = getActionsForTransition('GRACE', 'REMINDER_1');
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({ type: 'send_email', template: 'first_reminder' });
    });

    it('should return second_reminder action for REMINDER_2 transition', () => {
      const actions = getActionsForTransition('REMINDER_1', 'REMINDER_2');
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({ type: 'send_email', template: 'second_reminder' });
    });

    it('should return final_warning action for FINAL_NOTICE transition', () => {
      const actions = getActionsForTransition('REMINDER_2', 'FINAL_NOTICE');
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({ type: 'send_email', template: 'final_warning' });
    });

    it('should return suspend_service and service_suspended actions for SUSPENDED transition', () => {
      const actions = getActionsForTransition('FINAL_NOTICE', 'SUSPENDED');
      expect(actions).toHaveLength(2);
      expect(actions).toContainEqual({ type: 'suspend_service' });
      expect(actions).toContainEqual({ type: 'send_email', template: 'service_suspended' });
    });

    it('should return written_off_notice action for WRITTEN_OFF transition', () => {
      const actions = getActionsForTransition('SUSPENDED', 'WRITTEN_OFF');
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({ type: 'send_email', template: 'written_off_notice' });
    });

    it('should return resume_service when payment from SUSPENDED', () => {
      const actions = getActionsForTransition('SUSPENDED', 'PAID');
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({ type: 'resume_service' });
    });

    it('should return resume_service when cancel from SUSPENDED', () => {
      const actions = getActionsForTransition('SUSPENDED', 'CANCELLED');
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({ type: 'resume_service' });
    });

    it('should return empty actions for other transitions', () => {
      expect(getActionsForTransition('ISSUED', 'OVERDUE')).toHaveLength(0);
      expect(getActionsForTransition('DUE_SOON', 'OVERDUE')).toHaveLength(0);
      expect(getActionsForTransition('OVERDUE', 'GRACE')).toHaveLength(0);
      expect(getActionsForTransition('PAID', 'PAID')).toHaveLength(0);
    });
  });
});