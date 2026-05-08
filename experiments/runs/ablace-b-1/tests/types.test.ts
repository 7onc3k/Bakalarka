import { describe, it, expect } from 'vitest';
import type { DunningStatus, EventType, ActionType, ActionDescriptor, DunningConfig, DunningState, ProcessResult } from '../src/index.js';

describe('Types', () => {
  describe('DunningStatus', () => {
    it('should include all required statuses', () => {
      const statuses: DunningStatus[] = [
        'ISSUED',
        'DUE_SOON',
        'OVERDUE',
        'GRACE',
        'REMINDER_1',
        'REMINDER_2',
        'FINAL_NOTICE',
        'SUSPENDED',
        'WRITTEN_OFF',
        'PAID',
        'PAUSED',
        'CANCELLED',
      ];
      expect(statuses).toHaveLength(12);
    });
  });

  describe('EventType', () => {
    it('should include all required event types', () => {
      const eventTypes: EventType[] = [
        'tick',
        'payment_received',
        'invoice_cancelled',
        'dunning_paused',
        'dunning_resumed',
        'manual_advance',
      ];
      expect(eventTypes).toHaveLength(6);
    });
  });

  describe('ActionType', () => {
    it('should include all required action types', () => {
      const actionTypes: ActionType[] = [
        'send_email',
        'suspend_service',
        'resume_service',
      ];
      expect(actionTypes).toHaveLength(3);
    });
  });

  describe('ActionDescriptor', () => {
    it('should allow send_email with template', () => {
      const action: ActionDescriptor = {
        type: 'send_email',
        template: 'due_soon_reminder',
      };
      expect(action.type).toBe('send_email');
      expect(action.template).toBe('due_soon_reminder');
    });

    it('should allow suspend_service without template', () => {
      const action: ActionDescriptor = {
        type: 'suspend_service',
      };
      expect(action.type).toBe('suspend_service');
      expect(action.template).toBeUndefined();
    });

    it('should allow resume_service without template', () => {
      const action: ActionDescriptor = {
        type: 'resume_service',
      };
      expect(action.type).toBe('resume_service');
      expect(action.template).toBeUndefined();
    });
  });

  describe('DunningConfig', () => {
    it('should allow optional timeouts', () => {
      const config: DunningConfig = {};
      expect(config.timeouts).toBeUndefined();
      expect(config.holidays).toBeUndefined();
    });

    it('should allow custom timeouts', () => {
      const config: DunningConfig = {
        timeouts: {
          DUE_SOON: 5,
          OVERDUE: 2,
        },
      };
      expect(config.timeouts?.DUE_SOON).toBe(5);
      expect(config.timeouts?.OVERDUE).toBe(2);
    });

    it('should allow custom holidays', () => {
      const config: DunningConfig = {
        holidays: [new Date('2024-01-01')],
      };
      expect(config.holidays).toHaveLength(1);
    });
  });

  describe('DunningState', () => {
    it('should have required properties', () => {
      const dueDate = new Date('2024-12-31');
      const stateEnteredAt = new Date('2024-01-01');
      const state: DunningState = {
        status: 'ISSUED',
        dueDate,
        stateEnteredAt,
        config: {},
      };
      expect(state.status).toBe('ISSUED');
      expect(state.dueDate).toBe(dueDate);
      expect(state.stateEnteredAt).toBe(stateEnteredAt);
      expect(state.config).toBeDefined();
    });

    it('should allow pausedFrom and pausedElapsed when paused', () => {
      const state: DunningState = {
        status: 'PAUSED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date('2024-01-15'),
        config: {},
        pausedFrom: 'OVERDUE',
        pausedElapsed: 2,
      };
      expect(state.pausedFrom).toBe('OVERDUE');
      expect(state.pausedElapsed).toBe(2);
    });
  });

  describe('ProcessResult', () => {
    it('should have state and actions', () => {
      const result: ProcessResult = {
        state: {
          status: 'ISSUED',
          dueDate: new Date('2024-12-31'),
          stateEnteredAt: new Date('2024-01-01'),
          config: {},
        },
        actions: [],
      };
      expect(result.state).toBeDefined();
      expect(result.actions).toEqual([]);
    });
  });
});