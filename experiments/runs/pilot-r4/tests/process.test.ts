import { describe, it, expect } from 'vitest';
import { createInstance } from '../src/createInstance.js';
import { process } from '../src/process.js';
import { DunningEvent, DunningStatus, ActionDescriptor } from '../src/types.js';

const createEvent = (type: DunningEvent['type']): DunningEvent => ({ type });

describe('process', () => {
  describe('Time-based transitions (tick event)', () => {
    it('should transition from ISSUED to DUE_SOON 7 business days before due date', () => {
      const dueDate = new Date('2026-02-01');
      const state = createInstance(dueDate);
      
      const sevenDaysBefore = new Date('2026-01-21'); // 7 business days before Feb 1
      const tickEvent = createEvent('tick');
      const result = process(state, tickEvent, sevenDaysBefore);
      
      expect(result.state.status).toBe('DUE_SOON');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'due_soon_reminder' });
    });

    it('should transition from DUE_SOON to OVERDUE when due date is reached', () => {
      const dueDate = new Date('2026-02-01');
      const state = createInstance(dueDate);
      
      // First transition to DUE_SOON
      const sevenDaysBefore = new Date('2026-01-21');
      const afterIssued = process(state, createEvent('tick'), sevenDaysBefore);
      
      // Then transition to OVERDUE at due date
      const onDueDate = new Date('2026-02-01');
      const result = process(afterIssued.state, createEvent('tick'), onDueDate);
      
      expect(result.state.status).toBe('OVERDUE');
      expect(result.actions).toHaveLength(0);
    });

    it('should transition from OVERDUE to GRACE after 3 business days', () => {
      const dueDate = new Date('2026-02-01');
      const state = createInstance(dueDate);
      
      // Move to OVERDUE
      const onDueDate = new Date('2026-02-01');
      const afterDueSoon = process(process(state, createEvent('tick'), new Date('2026-01-21')).state, createEvent('tick'), onDueDate);
      
      // Now advance 3 business days to GRACE
      const threeBusinessDaysLater = new Date('2026-02-06'); // Feb 6 is Friday, 3 business days after Feb 1 (Mon, Tue, Wed)
      const result = process(afterDueSoon.state, createEvent('tick'), threeBusinessDaysLater);
      
      expect(result.state.status).toBe('GRACE');
      expect(result.actions).toHaveLength(0);
    });

    it('should transition from GRACE to REMINDER_1 after 7 business days', () => {
      const dueDate = new Date('2026-02-01');
      const state = createInstance(dueDate);
      
      // Advance to GRACE
      const gracedState = process(
        process(
          process(state, createEvent('tick'), new Date('2026-01-21')).state,
          createEvent('tick'),
          new Date('2026-02-01')
        ).state,
        createEvent('tick'),
        new Date('2026-02-06')
      );
      
      // Advance 7 business days to REMINDER_1
      const sevenBusinessDaysLater = new Date('2026-02-17');
      const result = process(gracedState.state, createEvent('tick'), sevenBusinessDaysLater);
      
      expect(result.state.status).toBe('REMINDER_1');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'first_reminder' });
    });

    it('should transition from REMINDER_1 to REMINDER_2 after 14 business days', () => {
      const dueDate = new Date('2026-02-01');
      const state = createInstance(dueDate);
      
      // Move to REMINDER_1
      const reminder1State = process(
        process(
          process(
            process(state, createEvent('tick'), new Date('2026-01-21')).state,
            createEvent('tick'),
            new Date('2026-02-01')
          ).state,
          createEvent('tick'),
          new Date('2026-02-06')
        ).state,
        createEvent('tick'),
        new Date('2026-02-17')
      );
      
      // Advance 14 business days to REMINDER_2
      const fourteenBusinessDaysLater = new Date('2026-03-10'); // Approx 14 business days
      const result = process(reminder1State.state, createEvent('tick'), fourteenBusinessDaysLater);
      
      expect(result.state.status).toBe('REMINDER_2');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'second_reminder' });
    });

    it('should transition from REMINDER_2 to FINAL_NOTICE after 14 business days', () => {
      const dueDate = new Date('2026-02-01');
      const state = createInstance(dueDate);
      
      // Advance to FINAL_NOTICE state through the state machine
      // (Simplified - just check the final transition)
      const currentState = {
        ...createInstance(dueDate),
        status: 'REMINDER_2' as DunningStatus,
        stateEnteredAt: new Date('2026-02-01')
      };
      
      const fourteenBusinessDaysLater = new Date('2026-03-10');
      const result = process(currentState, createEvent('tick'), fourteenBusinessDaysLater);
      
      expect(result.state.status).toBe('FINAL_NOTICE');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'final_warning' });
    });

    it('should transition from FINAL_NOTICE to SUSPENDED after 7 business days', () => {
      const dueDate = new Date('2026-02-01');
      const currentState = {
        ...createInstance(dueDate),
        status: 'FINAL_NOTICE' as DunningStatus,
        stateEnteredAt: new Date('2026-02-01')
      };
      
      const sevenBusinessDaysLater = new Date('2026-02-12');
      const result = process(currentState, createEvent('tick'), sevenBusinessDaysLater);
      
      expect(result.state.status).toBe('SUSPENDED');
      expect(result.actions).toHaveLength(2);
      expect(result.actions).toContainEqual({ type: 'suspend_service' });
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'service_suspended' });
    });

    it('should transition from SUSPENDED to WRITTEN_OFF after 30 business days', () => {
      const dueDate = new Date('2026-02-01');
      const currentState = {
        ...createInstance(dueDate),
        status: 'SUSPENDED' as DunningStatus,
        stateEnteredAt: new Date('2026-02-01')
      };
      
      const thirtyBusinessDaysLater = new Date('2026-03-17');
      const result = process(currentState, createEvent('tick'), thirtyBusinessDaysLater);
      
      expect(result.state.status).toBe('WRITTEN_OFF');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'written_off_notice' });
    });
  });

  describe('Payment handling', () => {
    it('should transition to PAID from any active state on payment_received', () => {
      const dueDate = new Date('2026-02-01');
      const activeStates: DunningStatus[] = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];
      
      for (const status of activeStates) {
        const currentState = {
          ...createInstance(dueDate),
          status,
          stateEnteredAt: new Date()
        };
        
        const result = process(currentState, createEvent('payment_received'), new Date());
        expect(result.state.status).toBe('PAID');
      }
    });

    it('should return resume_service action when payment received from SUSPENDED', () => {
      const dueDate = new Date('2026-02-01');
      const suspendedState = {
        ...createInstance(dueDate),
        status: 'SUSPENDED' as DunningStatus,
        stateEnteredAt: new Date()
      };
      
      const result = process(suspendedState, createEvent('payment_received'), new Date());
      
      expect(result.state.status).toBe('PAID');
      expect(result.actions).toContainEqual({ type: 'resume_service' });
    });

    it('should not transition from terminal states on payment', () => {
      const dueDate = new Date('2026-02-01');
      const terminalStates: DunningStatus[] = ['PAID', 'WRITTEN_OFF', 'CANCELLED'];
      
      for (const status of terminalStates) {
        const currentState = {
          ...createInstance(dueDate),
          status,
          stateEnteredAt: new Date()
        };
        
        const result = process(currentState, createEvent('payment_received'), new Date());
        expect(result.state.status).toBe(status);
      }
    });
  });

  describe('Invoice cancellation', () => {
    it('should transition to CANCELLED from any non-terminal state on invoice_cancelled', () => {
      const dueDate = new Date('2026-02-01');
      const nonTerminalStates: DunningStatus[] = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED', 'PAUSED'];
      
      for (const status of nonTerminalStates) {
        const currentState = {
          ...createInstance(dueDate),
          status,
          stateEnteredAt: new Date()
        };
        
        const result = process(currentState, createEvent('invoice_cancelled'), new Date());
        expect(result.state.status).toBe('CANCELLED');
      }
    });

    it('should return resume_service when cancelling from SUSPENDED', () => {
      const dueDate = new Date('2026-02-01');
      const suspendedState = {
        ...createInstance(dueDate),
        status: 'SUSPENDED' as DunningStatus,
        stateEnteredAt: new Date()
      };
      
      const result = process(suspendedState, createEvent('invoice_cancelled'), new Date());
      
      expect(result.state.status).toBe('CANCELLED');
      expect(result.actions).toContainEqual({ type: 'resume_service' });
    });

    it('should not transition from terminal states on cancellation', () => {
      const dueDate = new Date('2026-02-01');
      const terminalStates: DunningStatus[] = ['PAID', 'WRITTEN_OFF', 'CANCELLED'];
      
      for (const status of terminalStates) {
        const currentState = {
          ...createInstance(dueDate),
          status,
          stateEnteredAt: new Date()
        };
        
        const result = process(currentState, createEvent('invoice_cancelled'), new Date());
        expect(result.state.status).toBe(status);
      }
    });
  });

  describe('Pause / Resume', () => {
    it('should transition to PAUSED from active dunning states on dunning_paused', () => {
      const dueDate = new Date('2026-02-01');
      const pausableStates: DunningStatus[] = ['OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];
      
      for (const status of pausableStates) {
        const currentState = {
          ...createInstance(dueDate),
          status,
          stateEnteredAt: new Date()
        };
        
        const result = process(currentState, createEvent('dunning_paused'), new Date());
        expect(result.state.status).toBe('PAUSED');
        expect(result.state.pausedFrom).toBe(status);
      }
    });

    it('should not allow pause from non-active states', () => {
      const dueDate = new Date('2026-02-01');
      const nonPausableStates: DunningStatus[] = ['ISSUED', 'DUE_SOON', 'WRITTEN_OFF', 'PAID', 'CANCELLED', 'PAUSED'];
      
      for (const status of nonPausableStates) {
        const currentState = {
          ...createInstance(dueDate),
          status,
          stateEnteredAt: new Date()
        };
        
        const result = process(currentState, createEvent('dunning_paused'), new Date());
        expect(result.state.status).toBe(status);
      }
    });

    it('should resume to previous state on dunning_resumed', () => {
      const dueDate = new Date('2026-02-01');
      const previousStatus: DunningStatus = 'GRACE';
      const currentState = {
        ...createInstance(dueDate),
        status: 'PAUSED' as DunningStatus,
        pausedFrom: previousStatus,
        pausedElapsed: 2,
        stateEnteredAt: new Date()
      };
      
      const result = process(currentState, createEvent('dunning_resumed'), new Date());
      
      expect(result.state.status).toBe(previousStatus);
      expect(result.state.pausedFrom).toBeUndefined();
      expect(result.state.pausedElapsed).toBeUndefined();
    });

    it('should transition to PAID on payment_received from PAUSED', () => {
      const dueDate = new Date('2026-02-01');
      const currentState = {
        ...createInstance(dueDate),
        status: 'PAUSED' as DunningStatus,
        pausedFrom: 'GRACE',
        pausedElapsed: 2,
        stateEnteredAt: new Date()
      };
      
      const result = process(currentState, createEvent('payment_received'), new Date());
      
      expect(result.state.status).toBe('PAID');
    });

    it('should transition to CANCELLED on invoice_cancelled from PAUSED', () => {
      const dueDate = new Date('2026-02-01');
      const currentState = {
        ...createInstance(dueDate),
        status: 'PAUSED' as DunningStatus,
        pausedFrom: 'GRACE',
        pausedElapsed: 2,
        stateEnteredAt: new Date()
      };
      
      const result = process(currentState, createEvent('invoice_cancelled'), new Date());
      
      expect(result.state.status).toBe('CANCELLED');
    });
  });

  describe('Manual advance', () => {
    it('should advance to next state on manual_advance', () => {
      const dueDate = new Date('2026-02-01');
      const stateTransitions: Array<[DunningStatus, DunningStatus, string?]> = [
        ['ISSUED', 'DUE_SOON', 'due_soon_reminder'],
        ['DUE_SOON', 'OVERDUE'],
        ['OVERDUE', 'GRACE'],
        ['GRACE', 'REMINDER_1', 'first_reminder'],
        ['REMINDER_1', 'REMINDER_2', 'second_reminder'],
        ['REMINDER_2', 'FINAL_NOTICE', 'final_warning'],
        ['FINAL_NOTICE', 'SUSPENDED'],
        ['SUSPENDED', 'WRITTEN_OFF', 'written_off_notice'],
      ];
      
      for (const [fromStatus, toStatus, expectedTemplate] of stateTransitions) {
        const currentState = {
          ...createInstance(dueDate),
          status: fromStatus,
          stateEnteredAt: new Date()
        };
        
        const result = process(currentState, createEvent('manual_advance'), new Date());
        
        expect(result.state.status).toBe(toStatus);
        
        if (expectedTemplate) {
          expect(result.actions).toContainEqual({ type: 'send_email', template: expectedTemplate });
        }
        
        if (toStatus === 'SUSPENDED') {
          expect(result.actions).toContainEqual({ type: 'suspend_service' });
        }
      }
    });

    it('should not advance from terminal states', () => {
      const dueDate = new Date('2026-02-01');
      const terminalStates: DunningStatus[] = ['PAID', 'WRITTEN_OFF', 'CANCELLED', 'PAUSED'];
      
      for (const status of terminalStates) {
        const currentState = {
          ...createInstance(dueDate),
          status,
          stateEnteredAt: new Date()
        };
        
        const result = process(currentState, createEvent('manual_advance'), new Date());
        expect(result.state.status).toBe(status);
      }
    });
  });

  describe('Terminal states', () => {
    it('should not transition from PAID state', () => {
      const dueDate = new Date('2026-02-01');
      const currentState = {
        ...createInstance(dueDate),
        status: 'PAID' as DunningStatus,
        stateEnteredAt: new Date()
      };
      
      const events: DunningEvent['type'][] = ['tick', 'payment_received', 'invoice_cancelled', 'dunning_paused', 'dunning_resumed', 'manual_advance'];
      
      for (const eventType of events) {
        const result = process(currentState, createEvent(eventType), new Date());
        expect(result.state.status).toBe('PAID');
      }
    });

    it('should not transition from WRITTEN_OFF state', () => {
      const dueDate = new Date('2026-02-01');
      const currentState = {
        ...createInstance(dueDate),
        status: 'WRITTEN_OFF' as DunningStatus,
        stateEnteredAt: new Date()
      };
      
      const events: DunningEvent['type'][] = ['tick', 'payment_received', 'invoice_cancelled', 'dunning_paused', 'dunning_resumed', 'manual_advance'];
      
      for (const eventType of events) {
        const result = process(currentState, createEvent(eventType), new Date());
        expect(result.state.status).toBe('WRITTEN_OFF');
      }
    });

    it('should not transition from CANCELLED state', () => {
      const dueDate = new Date('2026-02-01');
      const currentState = {
        ...createInstance(dueDate),
        status: 'CANCELLED' as DunningStatus,
        stateEnteredAt: new Date()
      };
      
      const events: DunningEvent['type'][] = ['tick', 'payment_received', 'invoice_cancelled', 'dunning_paused', 'dunning_resumed', 'manual_advance'];
      
      for (const eventType of events) {
        const result = process(currentState, createEvent(eventType), new Date());
        expect(result.state.status).toBe('CANCELLED');
      }
    });
  });

  describe('Configurable timeouts', () => {
    it('should use custom timeout configuration', () => {
      const dueDate = new Date('2026-02-01');
      const config = {
        timeouts: {
          'DUE_SOON': -3, // 3 days before instead of 7
          'OVERDUE': 5,   // 5 business days instead of 3
        }
      };
      
      const state = createInstance(dueDate, config);
      
      // Transition to DUE_SOON after 3 days (custom timeout)
      const threeDaysBefore = new Date('2026-01-29');
      const result = process(state, createEvent('tick'), threeDaysBefore);
      
      expect(result.state.status).toBe('DUE_SOON');
    });
  });

  describe('Business days calculation', () => {
    it('should exclude weekends from timeout calculations', () => {
      const dueDate = new Date('2026-02-02'); // Monday
      const state = createInstance(dueDate);
      
      // Due date is Monday, so 3 business days later is Thursday
      const thursday = new Date('2026-02-05');
      const result = process(
        process(state, createEvent('tick'), new Date('2026-01-26')).state, // DUE_SOON
        createEvent('tick'),
        thursday
      );
      
      // Should be OVERDUE (not GRACE yet - need 3 business days)
      expect(result.state.status).toBe('OVERDUE');
    });

    it('should exclude holidays from timeout calculations', () => {
      const dueDate = new Date('2026-02-02');
      const holiday = new Date('2026-02-04');
      const config = { holidays: [holiday] };
      
      const state = createInstance(dueDate, config);
      
      // Move to OVERDUE at due date
      const afterDueSoon = process(state, createEvent('tick'), new Date('2026-01-26'));
      const afterDueDate = process(afterDueSoon.state, createEvent('tick'), new Date('2026-02-02'));
      
      // 3 business days later but one is a holiday
      // Feb 2 (Mon) + 1 = Feb 3 (Tue), + 2 = Feb 4 (Wed - holiday), + 3 = Feb 5 (Thu)
      const threeBusinessDaysLater = new Date('2026-02-05');
      const result = process(afterDueDate.state, createEvent('tick'), threeBusinessDaysLater);
      
      // Should still be OVERDUE because holiday was excluded
      expect(result.state.status).toBe('OVERDUE');
    });
  });
});