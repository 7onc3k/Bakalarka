import { describe, it, expect } from 'vitest';
import type {
  DunningStatus,
  EventType,
  ActionType,
  ActionDescriptor,
  DunningConfig,
  DunningState,
  DunningEvent,
  ProcessResult
} from '../src/types.js';

describe('Core Types', () => {
  describe('DunningStatus', () => {
    it('should include all required states', () => {
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
        'CANCELLED'
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
        'manual_advance'
      ];
      
      expect(eventTypes).toHaveLength(6);
    });
  });

  describe('ActionType', () => {
    it('should include all required action types', () => {
      const actionTypes: ActionType[] = [
        'send_email',
        'suspend_service',
        'resume_service'
      ];
      
      expect(actionTypes).toHaveLength(3);
    });
  });

  describe('ActionDescriptor', () => {
    it('should allow send_email with template', () => {
      const action: ActionDescriptor = {
        type: 'send_email',
        template: 'due_soon_reminder'
      };
      
      expect(action.type).toBe('send_email');
      expect(action.template).toBe('due_soon_reminder');
    });

    it('should allow suspend_service without template', () => {
      const action: ActionDescriptor = {
        type: 'suspend_service'
      };
      
      expect(action.type).toBe('suspend_service');
      expect(action.template).toBeUndefined();
    });

    it('should allow resume_service without template', () => {
      const action: ActionDescriptor = {
        type: 'resume_service'
      };
      
      expect(action.type).toBe('resume_service');
      expect(action.template).toBeUndefined();
    });
  });

  describe('DunningConfig', () => {
    it('should allow optional timeouts configuration', () => {
      const config: DunningConfig = {
        timeouts: {
          DUE_SOON: 5,
          OVERDUE: 2
        }
      };
      
      expect(config.timeouts).toBeDefined();
      expect(config.timeouts?.DUE_SOON).toBe(5);
    });

    it('should allow optional holidays configuration', () => {
      const holiday = new Date('2024-01-01');
      const config: DunningConfig = {
        holidays: [holiday]
      };
      
      expect(config.holidays).toBeDefined();
      expect(config.holidays).toHaveLength(1);
    });

    it('should allow empty config', () => {
      const config: DunningConfig = {};
      
      expect(config.timeouts).toBeUndefined();
      expect(config.holidays).toBeUndefined();
    });
  });

  describe('DunningState', () => {
    it('should have required properties', () => {
      const dueDate = new Date('2024-12-31');
      const stateEnteredAt = new Date('2024-01-01');
      const config: DunningConfig = {};
      
      const state: DunningState = {
        status: 'ISSUED',
        dueDate,
        stateEnteredAt,
        config
      };
      
      expect(state.status).toBe('ISSUED');
      expect(state.dueDate).toBe(dueDate);
      expect(state.stateEnteredAt).toBe(stateEnteredAt);
      expect(state.config).toBe(config);
      expect(state.pausedFrom).toBeUndefined();
      expect(state.pausedElapsed).toBeUndefined();
    });

    it('should allow paused state properties', () => {
      const state: DunningState = {
        status: 'PAUSED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date('2024-01-15'),
        config: {},
        pausedFrom: 'OVERDUE',
        pausedElapsed: 2
      };
      
      expect(state.status).toBe('PAUSED');
      expect(state.pausedFrom).toBe('OVERDUE');
      expect(state.pausedElapsed).toBe(2);
    });
  });

  describe('DunningEvent', () => {
    it('should allow tick event', () => {
      const event: DunningEvent = { type: 'tick' };
      expect(event.type).toBe('tick');
    });

    it('should allow payment_received event', () => {
      const event: DunningEvent = { type: 'payment_received' };
      expect(event.type).toBe('payment_received');
    });

    it('should allow invoice_cancelled event', () => {
      const event: DunningEvent = { type: 'invoice_cancelled' };
      expect(event.type).toBe('invoice_cancelled');
    });

    it('should allow dunning_paused event', () => {
      const event: DunningEvent = { type: 'dunning_paused' };
      expect(event.type).toBe('dunning_paused');
    });

    it('should allow dunning_resumed event', () => {
      const event: DunningEvent = { type: 'dunning_resumed' };
      expect(event.type).toBe('dunning_resumed');
    });

    it('should allow manual_advance event', () => {
      const event: DunningEvent = { type: 'manual_advance' };
      expect(event.type).toBe('manual_advance');
    });
  });

  describe('ProcessResult', () => {
    it('should have state and actions', () => {
      const state: DunningState = {
        status: 'ISSUED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date('2024-01-01'),
        config: {}
      };
      
      const actions: ActionDescriptor[] = [
        { type: 'send_email', template: 'due_soon_reminder' }
      ];
      
      const result: ProcessResult = { state, actions };
      
      expect(result.state).toBe(state);
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0].type).toBe('send_email');
    });
  });
});