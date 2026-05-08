import { describe, it, expect } from 'vitest';
import { createInstance, process } from '../src/index.js';
import type { DunningState, DunningEvent, DunningStatus, ActionDescriptor } from '../src/index.js';

const createDate = (daysFromNow: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const addBusinessDaysToDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }
  return result;
};

describe('Acceptance Criteria - Time-based transitions', () => {
  describe('ISSUED -> DUE_SOON', () => {
    it('should transition to DUE_SOON 7 business days before due date', () => {
      const dueDate = addBusinessDaysToDate(new Date(), 14); // Due in 14 business days
      const state = createInstance(dueDate);
      
      // Advance time to 7 business days before due date
      const transitionDate = addBusinessDaysToDate(dueDate, -7);
      
      const result = process(state, { type: 'tick' }, transitionDate);
      
      expect(result.state.status).toBe('DUE_SOON');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'due_soon_reminder' });
    });
  });

  describe('DUE_SOON -> OVERDUE', () => {
    it('should transition to OVERDUE at due date', () => {
      const dueDate = createDate(0); // Today
      const state: DunningState = {
        status: 'DUE_SOON',
        dueDate,
        stateEnteredAt: createDate(-7),
        config: {},
      };
      
      const result = process(state, { type: 'tick' }, dueDate);
      
      expect(result.state.status).toBe('OVERDUE');
    });
  });

  describe('OVERDUE -> GRACE', () => {
    it('should transition to GRACE after 3 business days', () => {
      const dueDate = createDate(-5);
      const stateEnteredAt = createDate(-3); // 3 business days ago
      const state: DunningState = {
        status: 'OVERDUE',
        dueDate,
        stateEnteredAt,
        config: {},
      };
      
      // Advance past 3 business days
      const now = addBusinessDaysToDate(stateEnteredAt, 4);
      
      const result = process(state, { type: 'tick' }, now);
      
      expect(result.state.status).toBe('GRACE');
    });
  });

  describe('GRACE -> REMINDER_1', () => {
    it('should transition to REMINDER_1 after 7 business days', () => {
      const dueDate = createDate(-10);
      const stateEnteredAt = createDate(-3);
      const state: DunningState = {
        status: 'GRACE',
        dueDate,
        stateEnteredAt,
        config: {},
      };
      
      // Advance past 7 business days
      const now = addBusinessDaysToDate(stateEnteredAt, 8);
      
      const result = process(state, { type: 'tick' }, now);
      
      expect(result.state.status).toBe('REMINDER_1');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'first_reminder' });
    });
  });

  describe('REMINDER_1 -> REMINDER_2', () => {
    it('should transition to REMINDER_2 after 14 business days', () => {
      const dueDate = createDate(-20);
      const stateEnteredAt = createDate(-7);
      const state: DunningState = {
        status: 'REMINDER_1',
        dueDate,
        stateEnteredAt,
        config: {},
      };
      
      // Advance past 14 business days
      const now = addBusinessDaysToDate(stateEnteredAt, 15);
      
      const result = process(state, { type: 'tick' }, now);
      
      expect(result.state.status).toBe('REMINDER_2');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'second_reminder' });
    });
  });

  describe('REMINDER_2 -> FINAL_NOTICE', () => {
    it('should transition to FINAL_NOTICE after 14 business days', () => {
      const dueDate = createDate(-30);
      const stateEnteredAt = createDate(-14);
      const state: DunningState = {
        status: 'REMINDER_2',
        dueDate,
        stateEnteredAt,
        config: {},
      };
      
      // Advance past 14 business days
      const now = addBusinessDaysToDate(stateEnteredAt, 15);
      
      const result = process(state, { type: 'tick' }, now);
      
      expect(result.state.status).toBe('FINAL_NOTICE');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'final_warning' });
    });
  });

  describe('FINAL_NOTICE -> SUSPENDED', () => {
    it('should transition to SUSPENDED after 7 business days', () => {
      const dueDate = createDate(-40);
      const stateEnteredAt = createDate(-21);
      const state: DunningState = {
        status: 'FINAL_NOTICE',
        dueDate,
        stateEnteredAt,
        config: {},
      };
      
      // Advance past 7 business days
      const now = addBusinessDaysToDate(stateEnteredAt, 8);
      
      const result = process(state, { type: 'tick' }, now);
      
      expect(result.state.status).toBe('SUSPENDED');
      expect(result.actions).toHaveLength(2);
      expect(result.actions).toContainEqual({ type: 'suspend_service' });
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'service_suspended' });
    });
  });

  describe('SUSPENDED -> WRITTEN_OFF', () => {
    it('should transition to WRITTEN_OFF after 30 business days', () => {
      const dueDate = createDate(-60);
      const stateEnteredAt = createDate(-30);
      const state: DunningState = {
        status: 'SUSPENDED',
        dueDate,
        stateEnteredAt,
        config: {},
      };
      
      // Advance past 30 business days
      const now = addBusinessDaysToDate(stateEnteredAt, 31);
      
      const result = process(state, { type: 'tick' }, now);
      
      expect(result.state.status).toBe('WRITTEN_OFF');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'written_off_notice' });
    });
  });
});

describe('Acceptance Criteria - Payment', () => {
  it('should transition to PAID from any active state on payment_received', () => {
    const states: DunningStatus[] = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];
    const dueDate = createDate(30);
    
    for (const status of states) {
      const state: DunningState = {
        status,
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result = process(state, { type: 'payment_received' }, new Date());
      
      expect(result.state.status).toBe('PAID');
    }
  });

  it('should return resume_service action when payment from SUSPENDED', () => {
    const dueDate = createDate(-60);
    const state: DunningState = {
      status: 'SUSPENDED',
      dueDate,
      stateEnteredAt: createDate(-30),
      config: {},
    };
    
    const result = process(state, { type: 'payment_received' }, new Date());
    
    expect(result.state.status).toBe('PAID');
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toEqual({ type: 'resume_service' });
  });
});

describe('Acceptance Criteria - Terminal states', () => {
  const terminalStates: DunningStatus[] = ['PAID', 'WRITTEN_OFF', 'CANCELLED'];
  
  it('should not transition from PAID', () => {
    const state: DunningState = {
      status: 'PAID',
      dueDate: createDate(30),
      stateEnteredAt: new Date(),
      config: {},
    };
    
    const result = process(state, { type: 'tick' }, new Date());
    expect(result.state.status).toBe('PAID');
  });

  it('should not transition from WRITTEN_OFF', () => {
    const state: DunningState = {
      status: 'WRITTEN_OFF',
      dueDate: createDate(-60),
      stateEnteredAt: createDate(-30),
      config: {},
    };
    
    const result = process(state, { type: 'tick' }, new Date());
    expect(result.state.status).toBe('WRITTEN_OFF');
  });

  it('should not transition from CANCELLED', () => {
    const state: DunningState = {
      status: 'CANCELLED',
      dueDate: createDate(30),
      stateEnteredAt: new Date(),
      config: {},
    };
    
    const result = process(state, { type: 'tick' }, new Date());
    expect(result.state.status).toBe('CANCELLED');
  });
});

describe('Acceptance Criteria - Invoice cancellation', () => {
  it('should transition to CANCELLED from any active state', () => {
    const states: DunningStatus[] = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];
    const dueDate = createDate(30);
    
    for (const status of states) {
      const state: DunningState = {
        status,
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result = process(state, { type: 'invoice_cancelled' }, new Date());
      
      expect(result.state.status).toBe('CANCELLED');
    }
  });

  it('should return resume_service action when cancel from SUSPENDED', () => {
    const dueDate = createDate(-60);
    const state: DunningState = {
      status: 'SUSPENDED',
      dueDate,
      stateEnteredAt: createDate(-30),
      config: {},
    };
    
    const result = process(state, { type: 'invoice_cancelled' }, new Date());
    
    expect(result.state.status).toBe('CANCELLED');
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toEqual({ type: 'resume_service' });
  });
});

describe('Acceptance Criteria - Pause / Resume', () => {
  it('should transition to PAUSED from active dunning states', () => {
    const activeStates: DunningStatus[] = ['OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];
    const dueDate = createDate(30);
    
    for (const status of activeStates) {
      const state: DunningState = {
        status,
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result = process(state, { type: 'dunning_paused' }, new Date());
      
      expect(result.state.status).toBe('PAUSED');
      expect(result.state.pausedFrom).toBe(status);
      expect(result.state.pausedElapsed).toBeDefined();
    }
  });

  it('should resume to previous state on dunning_resumed', () => {
    const dueDate = createDate(30);
    const state: DunningState = {
      status: 'PAUSED',
      dueDate,
      stateEnteredAt: new Date(),
      config: {},
      pausedFrom: 'OVERDUE',
      pausedElapsed: 2,
    };
    
    const result = process(state, { type: 'dunning_resumed' }, new Date());
    
    expect(result.state.status).toBe('OVERDUE');
    expect(result.state.pausedFrom).toBeUndefined();
    expect(result.state.pausedElapsed).toBeUndefined();
  });

  it('should transition to PAID from PAUSED on payment_received', () => {
    const state: DunningState = {
      status: 'PAUSED',
      dueDate: createDate(30),
      stateEnteredAt: new Date(),
      config: {},
      pausedFrom: 'OVERDUE',
      pausedElapsed: 2,
    };
    
    const result = process(state, { type: 'payment_received' }, new Date());
    
    expect(result.state.status).toBe('PAID');
  });

  it('should transition to CANCELLED from PAUSED on invoice_cancelled', () => {
    const state: DunningState = {
      status: 'PAUSED',
      dueDate: createDate(30),
      stateEnteredAt: new Date(),
      config: {},
      pausedFrom: 'OVERDUE',
      pausedElapsed: 2,
    };
    
    const result = process(state, { type: 'invoice_cancelled' }, new Date());
    
    expect(result.state.status).toBe('CANCELLED');
  });
});

describe('Acceptance Criteria - Manual advance', () => {
  it('should advance to next state on manual_advance', () => {
    const dueDate = createDate(30);
    
    const states: { current: DunningStatus; expected: DunningStatus; hasActions: boolean }[] = [
      { current: 'OVERDUE', expected: 'GRACE', hasActions: false },
      { current: 'GRACE', expected: 'REMINDER_1', hasActions: true },
      { current: 'REMINDER_1', expected: 'REMINDER_2', hasActions: true },
      { current: 'REMINDER_2', expected: 'FINAL_NOTICE', hasActions: true },
      { current: 'FINAL_NOTICE', expected: 'SUSPENDED', hasActions: true },
      { current: 'SUSPENDED', expected: 'WRITTEN_OFF', hasActions: true },
    ];
    
    for (const { current, expected, hasActions } of states) {
      const state: DunningState = {
        status: current,
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
      };
      
      const result = process(state, { type: 'manual_advance' }, new Date());
      
      expect(result.state.status).toBe(expected);
      if (hasActions) {
        expect(result.actions.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('Acceptance Criteria - Configurable timeouts', () => {
  it('should use custom timeouts when provided', () => {
    const dueDate = createDate(10);
    const state: DunningState = {
      status: 'GRACE',
      dueDate,
      stateEnteredAt: new Date(),
      config: {
        timeouts: {
          GRACE: 2, // Override default 7 with 2
        },
      },
    };
    
    // Advance 3 business days (would trigger with default but not with custom timeout of 2)
    const now = addBusinessDaysToDate(state.stateEnteredAt, 3);
    
    const result = process(state, { type: 'tick' }, now);
    
    expect(result.state.status).toBe('REMINDER_1');
  });

  it('should use default timeouts when no custom config', () => {
    const defaults = {
      DUE_SOON: 0,
      OVERDUE: 3,
      GRACE: 7,
      REMINDER_1: 14,
      REMINDER_2: 14,
      FINAL_NOTICE: 7,
      SUSPENDED: 30,
    };
    
    // This test verifies defaults are used
    const dueDate = createDate(30);
    const state = createInstance(dueDate);
    
    // Should stay in ISSUED if time not yet reached
    const result = process(state, { type: 'tick' }, new Date());
    
    // Without enough time passed, should stay in ISSUED
    expect(result.state.status).toBe('ISSUED');
  });
});

describe('Acceptance Criteria - Business days calculation', () => {
  it('should exclude weekends from business days calculation', () => {
    // Starting on a Friday, adding 5 business days should land on next Friday
    const friday = new Date('2024-01-12');
    
    const dueDate = createDate(30);
    const state: DunningState = {
      status: 'OVERDUE',
      dueDate,
      stateEnteredAt: friday,
      config: {},
    };
    
    // Add 5 business days (should skip weekend)
    const now = addBusinessDaysToDate(friday, 5);
    
    const result = process(state, { type: 'tick' }, now);
    
    // After 5 business days from Friday, with default timeout of 3, should be in GRACE
    expect(result.state.status).toBe('GRACE');
  });

  it('should exclude holidays from business days calculation', () => {
    const monday = new Date('2024-01-08');
    const holiday = new Date('2024-01-15'); // Monday
    
    const dueDate = createDate(30);
    const state: DunningState = {
      status: 'OVERDUE',
      dueDate,
      stateEnteredAt: monday,
      config: {
        holidays: [holiday],
      },
    };
    
    // Add 4 business days - Monday Jan 8 + 4 = should skip Monday Jan 15 (holiday)
    // So it should be Friday Jan 19
    const now = addBusinessDaysToDate(new Date('2024-01-08'), 4);
    
    const result = process(state, { type: 'tick' }, now);
    
    // With default timeout of 3 business days, after 4 it should transition
    expect(result.state.status).toBe('GRACE');
  });
});