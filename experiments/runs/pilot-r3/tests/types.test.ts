import { describe, it, expect } from 'vitest';
import type { 
  DunningStatus, 
  EventType, 
  DunningEvent, 
  ActionType, 
  ActionDescriptor, 
  DunningConfig, 
  DunningState, 
  ProcessResult 
} from '../src/types.js';

describe('Types Module', () => {
  describe('DunningStatus', () => {
    it('should include all required status values', () => {
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

  describe('DunningEvent', () => {
    it('should accept valid event types', () => {
      const tickEvent: DunningEvent = { type: 'tick' };
      const paymentEvent: DunningEvent = { type: 'payment_received' };
      const cancelEvent: DunningEvent = { type: 'invoice_cancelled' };
      const pauseEvent: DunningEvent = { type: 'dunning_paused' };
      const resumeEvent: DunningEvent = { type: 'dunning_resumed' };
      const advanceEvent: DunningEvent = { type: 'manual_advance' };

      expect(tickEvent.type).toBe('tick');
      expect(paymentEvent.type).toBe('payment_received');
      expect(cancelEvent.type).toBe('invoice_cancelled');
      expect(pauseEvent.type).toBe('dunning_paused');
      expect(resumeEvent.type).toBe('dunning_resumed');
      expect(advanceEvent.type).toBe('manual_advance');
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
      const action: ActionDescriptor = { type: 'suspend_service' };
      
      expect(action.type).toBe('suspend_service');
      expect(action.template).toBeUndefined();
    });

    it('should allow resume_service without template', () => {
      const action: ActionDescriptor = { type: 'resume_service' };
      
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
      const holidays = [new Date('2024-01-01'), new Date('2024-12-25')];
      const config: DunningConfig = { holidays };
      
      expect(config.holidays).toHaveLength(2);
    });
  });

  describe('DunningState', () => {
    it('should have required fields', () => {
      const now = new Date();
      const dueDate = new Date('2024-12-31');
      const state: DunningState = {
        status: 'ISSUED',
        dueDate,
        stateEnteredAt: now,
        config: {},
      };
      
      expect(state.status).toBe('ISSUED');
      expect(state.dueDate).toBe(dueDate);
      expect(state.stateEnteredAt).toBe(now);
      expect(state.config).toEqual({});
    });

    it('should allow paused state fields', () => {
      const now = new Date();
      const state: DunningState = {
        status: 'PAUSED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: now,
        config: {},
        pausedFrom: 'OVERDUE',
        pausedElapsed: 2,
      };
      
      expect(state.status).toBe('PAUSED');
      expect(state.pausedFrom).toBe('OVERDUE');
      expect(state.pausedElapsed).toBe(2);
    });
  });

  describe('ProcessResult', () => {
    it('should have state and actions', () => {
      const state: DunningState = {
        status: 'ISSUED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result: ProcessResult = {
        state,
        actions: [],
      };
      
      expect(result.state).toBe(state);
      expect(result.actions).toEqual([]);
    });
  });
});