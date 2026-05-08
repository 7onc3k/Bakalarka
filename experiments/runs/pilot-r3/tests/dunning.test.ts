import { describe, it, expect } from 'vitest';
import { createInstance, process } from '../src/dunning.js';
import type { DunningState, DunningEvent, ProcessResult } from '../src/types.js';

describe('Dunning System', () => {
  const defaultHolidays: Date[] = [];

  describe('createInstance', () => {
    it('should create instance in ISSUED state', () => {
      const dueDate = new Date('2024-12-31');
      const state = createInstance(dueDate);
      
      expect(state.status).toBe('ISSUED');
      expect(state.dueDate).toEqual(dueDate);
    });

    it('should store default config', () => {
      const dueDate = new Date('2024-12-31');
      const state = createInstance(dueDate);
      
      expect(state.config).toBeDefined();
      expect(state.config.timeouts).toBeUndefined();
      expect(state.config.holidays).toBeUndefined();
    });

    it('should allow custom config', () => {
      const dueDate = new Date('2024-12-31');
      const customHolidays = [new Date('2024-12-25')];
      const state = createInstance(dueDate, {
        holidays: customHolidays,
        timeouts: { OVERDUE: 5 },
      });
      
      expect(state.config.holidays).toEqual(customHolidays);
      expect(state.config.timeouts?.OVERDUE).toBe(5);
    });

    it('should set stateEnteredAt to now', () => {
      const before = new Date();
      const dueDate = new Date('2024-12-31');
      const state = createInstance(dueDate);
      const after = new Date();
      
      expect(state.stateEnteredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(state.stateEnteredAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('Time-based transitions - tick event', () => {
    describe('ISSUED -> DUE_SOON', () => {
      it('should transition to DUE_SOON 7 business days before due date', () => {
        const dueDate = new Date('2024-01-15'); // Monday
        const state = createInstance(dueDate);
        
        // 7 business days before due date = previous week Monday Jan 8
        const now = new Date('2024-01-08'); // 7 business days before
        const result = process(state, { type: 'tick' }, now);
        
        expect(result.state.status).toBe('DUE_SOON');
        expect(result.actions).toContainEqual({
          type: 'send_email',
          template: 'due_soon_reminder',
        });
      });
    });

    describe('DUE_SOON -> OVERDUE', () => {
      it('should transition to OVERDUE when due date is reached', () => {
        const dueDate = new Date('2024-01-15');
        const state: DunningState = {
          status: 'DUE_SOON',
          dueDate,
          stateEnteredAt: new Date('2024-01-08'),
          config: {},
        };
        
        const now = new Date('2024-01-15'); // due date
        const result = process(state, { type: 'tick' }, now);
        
        expect(result.state.status).toBe('OVERDUE');
        expect(result.actions).toHaveLength(0);
      });
    });

    describe('OVERDUE -> GRACE', () => {
      it('should transition to GRACE after 3 business days', () => {
        const dueDate = new Date('2024-01-15');
        const state: DunningState = {
          status: 'OVERDUE',
          dueDate,
          stateEnteredAt: new Date('2024-01-15'), // entered OVERDUE on due date
          config: {},
        };
        
        // 3 business days later = Thursday (Mon->Tue=1, Tue->Wed=2, Wed->Thu=3)
        const now = new Date('2024-01-18');
        const result = process(state, { type: 'tick' }, now);
        
        expect(result.state.status).toBe('GRACE');
        expect(result.actions).toHaveLength(0);
      });
    });

    describe('GRACE -> REMINDER_1', () => {
      it('should transition to REMINDER_1 after 7 business days', () => {
        const dueDate = new Date('2024-01-15');
        const state: DunningState = {
          status: 'GRACE',
          dueDate,
          stateEnteredAt: new Date('2024-01-18'), // Thursday
          config: {},
        };
        
        // 7 business days later -> following Thursday
        const now = new Date('2024-01-29');
        const result = process(state, { type: 'tick' }, now);
        
        expect(result.state.status).toBe('REMINDER_1');
        expect(result.actions).toContainEqual({
          type: 'send_email',
          template: 'first_reminder',
        });
      });
    });

    describe('REMINDER_1 -> REMINDER_2', () => {
      it('should transition after 14 business days', () => {
        const dueDate = new Date('2024-01-15');
        const state: DunningState = {
          status: 'REMINDER_1',
          dueDate,
          stateEnteredAt: new Date('2024-01-29'),
          config: {},
        };
        
        const now = new Date('2024-02-16'); // 14 business days later
        const result = process(state, { type: 'tick' }, now);
        
        expect(result.state.status).toBe('REMINDER_2');
        expect(result.actions).toContainEqual({
          type: 'send_email',
          template: 'second_reminder',
        });
      });
    });

    describe('REMINDER_2 -> FINAL_NOTICE', () => {
      it('should transition after 14 business days', () => {
        const dueDate = new Date('2024-01-15');
        const state: DunningState = {
          status: 'REMINDER_2',
          dueDate,
          stateEnteredAt: new Date('2024-02-16'),
          config: {},
        };
        
        const now = new Date('2024-03-07'); // 14 business days later
        const result = process(state, { type: 'tick' }, now);
        
        expect(result.state.status).toBe('FINAL_NOTICE');
        expect(result.actions).toContainEqual({
          type: 'send_email',
          template: 'final_warning',
        });
      });
    });

    describe('FINAL_NOTICE -> SUSPENDED', () => {
      it('should transition after 7 business days with suspend and email actions', () => {
        const dueDate = new Date('2024-01-15');
        const state: DunningState = {
          status: 'FINAL_NOTICE',
          dueDate,
          stateEnteredAt: new Date('2024-03-07'),
          config: {},
        };
        
        const now = new Date('2024-03-18'); // 7 business days later
        const result = process(state, { type: 'tick' }, now);
        
        expect(result.state.status).toBe('SUSPENDED');
        expect(result.actions).toContainEqual({ type: 'suspend_service' });
        expect(result.actions).toContainEqual({
          type: 'send_email',
          template: 'service_suspended',
        });
      });
    });

    describe('SUSPENDED -> WRITTEN_OFF', () => {
      it('should transition after 30 business days', () => {
        const dueDate = new Date('2024-01-15');
        const state: DunningState = {
          status: 'SUSPENDED',
          dueDate,
          stateEnteredAt: new Date('2024-03-18'),
          config: {},
        };
        
        const now = new Date('2024-05-01'); // ~30 business days later
        const result = process(state, { type: 'tick' }, now);
        
        expect(result.state.status).toBe('WRITTEN_OFF');
        expect(result.actions).toContainEqual({
          type: 'send_email',
          template: 'written_off_notice',
        });
      });
    });
  });

  describe('Payment handling', () => {
    it('should transition to PAID from any non-terminal state', () => {
      const states: DunningState['status'][] = [
        'ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE',
        'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED',
      ];
      
      for (const status of states) {
        const state: DunningState = {
          status,
          dueDate: new Date('2024-12-31'),
          stateEnteredAt: new Date(),
          config: {},
        };
        
        const result = process(state, { type: 'payment_received' }, new Date());
        
        expect(result.state.status).toBe('PAID');
      }
    });

    it('should not transition from PAID state', () => {
      const state: DunningState = {
        status: 'PAID',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result = process(state, { type: 'payment_received' }, new Date());
      
      expect(result.state.status).toBe('PAID');
    });

    it('should not transition from WRITTEN_OFF state', () => {
      const state: DunningState = {
        status: 'WRITTEN_OFF',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result = process(state, { type: 'payment_received' }, new Date());
      
      expect(result.state.status).toBe('WRITTEN_OFF');
    });

    it('should not transition from CANCELLED state', () => {
      const state: DunningState = {
        status: 'CANCELLED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result = process(state, { type: 'payment_received' }, new Date());
      
      expect(result.state.status).toBe('CANCELLED');
    });

    it('should resume service when payment received from SUSPENDED', () => {
      const state: DunningState = {
        status: 'SUSPENDED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result = process(state, { type: 'payment_received' }, new Date());
      
      expect(result.state.status).toBe('PAID');
      expect(result.actions).toContainEqual({ type: 'resume_service' });
    });
  });

  describe('Invoice cancellation', () => {
    it('should transition to CANCELLED from any non-terminal state', () => {
      const states: DunningState['status'][] = [
        'ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE',
        'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED',
      ];
      
      for (const status of states) {
        const state: DunningState = {
          status,
          dueDate: new Date('2024-12-31'),
          stateEnteredAt: new Date(),
          config: {},
        };
        
        const result = process(state, { type: 'invoice_cancelled' }, new Date());
        
        expect(result.state.status).toBe('CANCELLED');
      }
    });

    it('should not transition from PAID, WRITTEN_OFF, or CANCELLED', () => {
      const states: DunningState['status'][] = ['PAID', 'WRITTEN_OFF', 'CANCELLED'];
      
      for (const status of states) {
        const state: DunningState = {
          status,
          dueDate: new Date('2024-12-31'),
          stateEnteredAt: new Date(),
          config: {},
        };
        
        const result = process(state, { type: 'invoice_cancelled' }, new Date());
        
        expect(result.state.status).toBe(status);
      }
    });

    it('should resume service when cancelling from SUSPENDED', () => {
      const state: DunningState = {
        status: 'SUSPENDED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result = process(state, { type: 'invoice_cancelled' }, new Date());
      
      expect(result.state.status).toBe('CANCELLED');
      expect(result.actions).toContainEqual({ type: 'resume_service' });
    });
  });

  describe('Pause/Resume', () => {
    it('should transition to PAUSED from active dunning states', () => {
      const states: DunningState['status'][] = [
        'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2',
        'FINAL_NOTICE', 'SUSPENDED',
      ];
      
      for (const status of states) {
        const state: DunningState = {
          status,
          dueDate: new Date('2024-12-31'),
          stateEnteredAt: new Date('2024-01-01'),
          config: {},
        };
        
        const result = process(state, { type: 'dunning_paused' }, new Date());
        
        expect(result.state.status).toBe('PAUSED');
        expect(result.state.pausedFrom).toBe(status);
      }
    });

    it('should not pause from ISSUED or DUE_SOON', () => {
      const states: DunningState['status'][] = ['ISSUED', 'DUE_SOON'];
      
      for (const status of states) {
        const state: DunningState = {
          status,
          dueDate: new Date('2024-12-31'),
          stateEnteredAt: new Date(),
          config: {},
        };
        
        const result = process(state, { type: 'dunning_paused' }, new Date());
        
        expect(result.state.status).toBe(status);
      }
    });

    it('should resume to previous state with preserved elapsed time', () => {
      const state: DunningState = {
        status: 'PAUSED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date('2024-01-20'),
        config: {},
        pausedFrom: 'OVERDUE',
        pausedElapsed: 2,
      };
      
      const result = process(state, { type: 'dunning_resumed' }, new Date());
      
      expect(result.state.status).toBe('OVERDUE');
      expect(result.state.pausedFrom).toBeUndefined();
      expect(result.state.pausedElapsed).toBeUndefined();
    });

    it('should prioritize payment over pause', () => {
      const state: DunningState = {
        status: 'PAUSED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date(),
        config: {},
        pausedFrom: 'OVERDUE',
        pausedElapsed: 2,
      };
      
      const result = process(state, { type: 'payment_received' }, new Date());
      
      expect(result.state.status).toBe('PAID');
    });

    it('should cancel from paused state', () => {
      const state: DunningState = {
        status: 'PAUSED',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date(),
        config: {},
        pausedFrom: 'OVERDUE',
        pausedElapsed: 2,
      };
      
      const result = process(state, { type: 'invoice_cancelled' }, new Date());
      
      expect(result.state.status).toBe('CANCELLED');
    });
  });

  describe('Manual advance', () => {
    it('should advance to next state in escalation', () => {
      const state: DunningState = {
        status: 'GRACE',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result = process(state, { type: 'manual_advance' }, new Date());
      
      expect(result.state.status).toBe('REMINDER_1');
      expect(result.actions).toContainEqual({
        type: 'send_email',
        template: 'first_reminder',
      });
    });

    it('should advance from FINAL_NOTICE to SUSPENDED', () => {
      const state: DunningState = {
        status: 'FINAL_NOTICE',
        dueDate: new Date('2024-12-31'),
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result = process(state, { type: 'manual_advance' }, new Date());
      
      expect(result.state.status).toBe('SUSPENDED');
      expect(result.actions).toContainEqual({ type: 'suspend_service' });
      expect(result.actions).toContainEqual({
        type: 'send_email',
        template: 'service_suspended',
      });
    });
  });

  describe('Configurable timeouts', () => {
    it('should use custom timeouts when provided', () => {
      const dueDate = new Date('2024-01-15');
      const state: DunningState = {
        status: 'OVERDUE',
        dueDate,
        stateEnteredAt: new Date('2024-01-15'),
        config: {
          timeouts: {
            OVERDUE: 1, // 1 business day instead of 3
          },
        },
      };
      
      // 1 business day later
      const now = new Date('2024-01-16');
      const result = process(state, { type: 'tick' }, now);
      
      expect(result.state.status).toBe('GRACE');
    });

    it('should use default timeouts when not provided', () => {
      const dueDate = new Date('2024-01-15');
      const state: DunningState = {
        status: 'OVERDUE',
        dueDate,
        stateEnteredAt: new Date('2024-01-15'),
        config: {},
      };
      
      // 2 business days - should NOT transition yet (default is 3)
      const now = new Date('2024-01-17');
      const result = process(state, { type: 'tick' }, now);
      
      expect(result.state.status).toBe('OVERDUE');
    });
  });

  describe('Business days with holidays', () => {
    it('should exclude holidays from business day count', () => {
      const holidays = [new Date('2024-01-17')]; // Wednesday
      const dueDate = new Date('2024-01-15');
      const state: DunningState = {
        status: 'OVERDUE',
        dueDate,
        stateEnteredAt: new Date('2024-01-15'),
        config: { holidays },
      };
      
      // 3 business days later, but one is a holiday (Wed)
      // Mon->Tue=1, Tue->Wed=holiday, Wed->Thu=2, Thu->Fri=3
      const now = new Date('2024-01-19');
      const result = process(state, { type: 'tick' }, now);
      
      expect(result.state.status).toBe('GRACE');
    });
  });
});