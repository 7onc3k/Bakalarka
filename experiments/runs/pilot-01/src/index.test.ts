import { describe, it, expect } from 'vitest';
import { initialize, process, DunningState, addBusinessDays, subtractBusinessDays, businessDaysBetween } from './index';

function makeDate(dateStr: string): Date {
  return new Date(dateStr);
}

function createDate(daysFromNow: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(0, 0, 0, 0);
  return d;
}

describe('Business Days Calculator', () => {
  describe('addBusinessDays', () => {
    it('excludes weekends (Saturday, Sunday)', () => {
      const friday = makeDate('2024-01-05');
      const result = addBusinessDays(friday, 1, []);
      expect(result.getDay()).toBe(1);
    });

    it('handles multiple weeks', () => {
      const monday = makeDate('2024-01-01');
      const result = addBusinessDays(monday, 10, []);
      expect(result.toISOString().slice(0, 10)).toBe('2024-01-15');
    });

    it('excludes public holidays', () => {
      const monday = makeDate('2024-01-01');
      const holiday = makeDate('2024-01-02');
      const result = addBusinessDays(monday, 1, [holiday]);
      expect(result.getDay()).toBe(3);
    });
  });

  describe('subtractBusinessDays', () => {
    it('calculates due soon date 7 business days before due date', () => {
      const dueDate = makeDate('2024-01-17');
      const result = subtractBusinessDays(dueDate, 7, []);
      expect(result.toISOString().slice(0, 10)).toBe('2024-01-08');
    });
  });

  describe('businessDaysBetween', () => {
    it('counts only business days between dates', () => {
      const start = makeDate('2024-01-01');
      const end = makeDate('2024-01-08');
      const result = businessDaysBetween(start, end, []);
      expect(result).toBe(5);
    });

    it('excludes holidays from count', () => {
      const start = makeDate('2024-01-01');
      const end = makeDate('2024-01-08');
      const holiday = makeDate('2024-01-02');
      const result = businessDaysBetween(start, end, [holiday]);
      expect(result).toBe(4);
    });
  });
});

describe('Dunning System - Time-based Transitions', () => {
  it('ISSUED -> DUE_SOON: 7 business days before due date', () => {
    const dueDate = makeDate('2024-01-17');
    const initialState = initialize(dueDate);
    const now = makeDate('2024-01-08');
    
    const result = process(initialState, 'tick', now);
    
    expect(result.state.status).toBe('DUE_SOON');
    expect(result.actions).toEqual([
      { type: 'send_email', template: 'due_soon_reminder' },
    ]);
  });

  it('DUE_SOON -> OVERDUE: on due date', () => {
    const dueDate = makeDate('2024-01-17');
    let state = initialize(dueDate);
    state = {
      ...state,
      status: 'DUE_SOON',
      enteredStateAt: makeDate('2024-01-08'),
    };
    
    const now = makeDate('2024-01-17');
    const result = process(state, 'tick', now);
    
    expect(result.state.status).toBe('OVERDUE');
    expect(result.actions).toEqual([]);
  });

  it('OVERDUE -> GRACE: after 3 business days', () => {
    const dueDate = makeDate('2024-01-17');
    const baseConfig = initialize(dueDate).configuration;
    let state: DunningState = {
      status: 'OVERDUE',
      dueDate,
      enteredStateAt: makeDate('2024-01-17'),
      configuration: baseConfig,
    };
    
    const now = addBusinessDays(makeDate('2024-01-17'), 3, []);
    const result = process(state, 'tick', now);
    
    expect(result.state.status).toBe('GRACE');
    expect(result.actions).toEqual([]);
  });

  it('GRACE -> REMINDER_1: after 7 business days', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'GRACE',
      dueDate,
      enteredStateAt: makeDate('2024-01-22'),
      configuration: initialize(dueDate).configuration,
    };
    
    const now = addBusinessDays(makeDate('2024-01-22'), 7, []);
    const result = process(state, 'tick', now);
    
    expect(result.state.status).toBe('REMINDER_1');
    expect(result.actions).toEqual([
      { type: 'send_email', template: 'first_reminder' },
    ]);
  });

  it('REMINDER_1 -> REMINDER_2: after 14 business days', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'REMINDER_1',
      dueDate,
      enteredStateAt: makeDate('2024-01-31'),
      configuration: initialize(dueDate).configuration,
    };
    
    const now = addBusinessDays(makeDate('2024-01-31'), 14, []);
    const result = process(state, 'tick', now);
    
    expect(result.state.status).toBe('REMINDER_2');
    expect(result.actions).toEqual([
      { type: 'send_email', template: 'second_reminder' },
    ]);
  });

  it('REMINDER_2 -> FINAL_NOTICE: after 14 business days', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'REMINDER_2',
      dueDate,
      enteredStateAt: makeDate('2024-02-21'),
      configuration: initialize(dueDate).configuration,
    };
    
    const now = addBusinessDays(makeDate('2024-02-21'), 14, []);
    const result = process(state, 'tick', now);
    
    expect(result.state.status).toBe('FINAL_NOTICE');
    expect(result.actions).toEqual([
      { type: 'send_email', template: 'final_warning' },
    ]);
  });

  it('FINAL_NOTICE -> SUSPENDED: after 7 business days', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'FINAL_NOTICE',
      dueDate,
      enteredStateAt: makeDate('2024-03-12'),
      configuration: initialize(dueDate).configuration,
    };
    
    const now = addBusinessDays(makeDate('2024-03-12'), 7, []);
    const result = process(state, 'tick', now);
    
    expect(result.state.status).toBe('SUSPENDED');
    expect(result.actions).toEqual([
      { type: 'suspend_service' },
      { type: 'send_email', template: 'service_suspended' },
    ]);
  });

  it('SUSPENDED -> WRITTEN_OFF: after 30 business days', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'SUSPENDED',
      dueDate,
      enteredStateAt: makeDate('2024-03-21'),
      configuration: initialize(dueDate).configuration,
    };
    
    const now = addBusinessDays(makeDate('2024-03-21'), 30, []);
    const result = process(state, 'tick', now);
    
    expect(result.state.status).toBe('WRITTEN_OFF');
    expect(result.actions).toEqual([
      { type: 'send_email', template: 'written_off_notice' },
    ]);
  });
});

describe('Dunning System - Payment', () => {
  it('payment_received transitions to PAID from any non-terminal state', () => {
    const dueDate = makeDate('2024-01-17');
    const states = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED', 'PAUSED'] as const;
    
    for (const status of states) {
      let state: DunningState = {
        status,
        dueDate,
        enteredStateAt: makeDate('2024-01-01'),
        configuration: initialize(dueDate).configuration,
        previousStatus: status === 'PAUSED' ? 'OVERDUE' : undefined,
      };
      
      const result = process(state, 'payment_received', makeDate('2024-01-15'));
      expect(result.state.status).toBe('PAID');
    }
  });

  it('payment_received from SUSPENDED includes resume_service action', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'SUSPENDED',
      dueDate,
      enteredStateAt: makeDate('2024-01-01'),
      configuration: initialize(dueDate).configuration,
    };
    
    const result = process(state, 'payment_received', makeDate('2024-01-15'));
    
    expect(result.state.status).toBe('PAID');
    expect(result.actions).toContainEqual({ type: 'resume_service' });
  });

  it('payment_received from PAUSED transitions to PAID', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'PAUSED',
      previousStatus: 'REMINDER_1',
      dueDate,
      enteredStateAt: makeDate('2024-01-01'),
      pausedAt: makeDate('2024-01-10'),
      configuration: initialize(dueDate).configuration,
    };
    
    const result = process(state, 'payment_received', makeDate('2024-01-15'));
    
    expect(result.state.status).toBe('PAID');
  });
});

describe('Dunning System - Terminal States', () => {
  it('PAID state does not transition on any event', () => {
    const dueDate = makeDate('2024-01-17');
    const events = ['tick', 'payment_received', 'invoice_cancelled', 'dunning_paused', 'manual_advance'] as const;
    
    for (const event of events) {
      let state: DunningState = {
        status: 'PAID',
        dueDate,
        enteredStateAt: makeDate('2024-01-15'),
        configuration: initialize(dueDate).configuration,
      };
      
      const result = process(state, event, makeDate('2024-02-01'));
      expect(result.state.status).toBe('PAID');
      expect(result.actions).toEqual([]);
    }
  });

  it('WRITTEN_OFF state does not transition on any event', () => {
    const dueDate = makeDate('2024-01-17');
    const events = ['tick', 'payment_received', 'invoice_cancelled', 'dunning_paused', 'manual_advance'] as const;
    
    for (const event of events) {
      let state: DunningState = {
        status: 'WRITTEN_OFF',
        dueDate,
        enteredStateAt: makeDate('2024-01-15'),
        configuration: initialize(dueDate).configuration,
      };
      
      const result = process(state, event, makeDate('2024-02-01'));
      expect(result.state.status).toBe('WRITTEN_OFF');
      expect(result.actions).toEqual([]);
    }
  });

  it('CANCELLED state does not transition on any event', () => {
    const dueDate = makeDate('2024-01-17');
    const events = ['tick', 'payment_received', 'invoice_cancelled', 'dunning_paused', 'manual_advance'] as const;
    
    for (const event of events) {
      let state: DunningState = {
        status: 'CANCELLED',
        dueDate,
        enteredStateAt: makeDate('2024-01-15'),
        configuration: initialize(dueDate).configuration,
      };
      
      const result = process(state, event, makeDate('2024-02-01'));
      expect(result.state.status).toBe('CANCELLED');
      expect(result.actions).toEqual([]);
    }
  });
});

describe('Dunning System - Invoice Cancellation', () => {
  it('invoice_cancelled transitions to CANCELLED from non-terminal states', () => {
    const dueDate = makeDate('2024-01-17');
    const states = ['ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED', 'PAUSED'] as const;
    
    for (const status of states) {
      let state: DunningState = {
        status,
        dueDate,
        enteredStateAt: makeDate('2024-01-01'),
        configuration: initialize(dueDate).configuration,
        previousStatus: status === 'PAUSED' ? 'OVERDUE' : undefined,
      };
      
      const result = process(state, 'invoice_cancelled', makeDate('2024-01-15'));
      expect(result.state.status).toBe('CANCELLED');
    }
  });

  it('invoice_cancelled from SUSPENDED includes resume_service action', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'SUSPENDED',
      dueDate,
      enteredStateAt: makeDate('2024-01-01'),
      configuration: initialize(dueDate).configuration,
    };
    
    const result = process(state, 'invoice_cancelled', makeDate('2024-01-15'));
    
    expect(result.state.status).toBe('CANCELLED');
    expect(result.actions).toContainEqual({ type: 'resume_service' });
  });

  it('invoice_cancelled from PAID does not transition', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'PAID',
      dueDate,
      enteredStateAt: makeDate('2024-01-15'),
      configuration: initialize(dueDate).configuration,
    };
    
    const result = process(state, 'invoice_cancelled', makeDate('2024-01-20'));
    expect(result.state.status).toBe('PAID');
  });
});

describe('Dunning System - Pause/Resume', () => {
  it('dunning_paused from active dunning state transitions to PAUSED', () => {
    const dueDate = makeDate('2024-01-17');
    const pausableStates = ['OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'] as const;
    
    for (const status of pausableStates) {
      let state: DunningState = {
        status,
        dueDate,
        enteredStateAt: makeDate('2024-01-01'),
        configuration: initialize(dueDate).configuration,
      };
      
      const result = process(state, 'dunning_paused', makeDate('2024-01-15'));
      expect(result.state.status).toBe('PAUSED');
      expect(result.state.previousStatus).toBe(status);
    }
  });

  it('dunning_paused preserves previous state and elapsed time', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'REMINDER_1',
      dueDate,
      enteredStateAt: makeDate('2024-01-01'),
      configuration: initialize(dueDate).configuration,
    };
    
    const result = process(state, 'dunning_paused', makeDate('2024-01-15'));
    
    expect(result.state.status).toBe('PAUSED');
    expect(result.state.previousStatus).toBe('REMINDER_1');
    expect(result.state.enteredStateAt).toEqual(makeDate('2024-01-01'));
  });

  it('dunning_resumed from PAUSED returns to previous state', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'PAUSED',
      previousStatus: 'REMINDER_1',
      dueDate,
      enteredStateAt: makeDate('2024-01-01'),
      pausedAt: makeDate('2024-01-10'),
      configuration: initialize(dueDate).configuration,
    };
    
    const result = process(state, 'dunning_resumed', makeDate('2024-01-15'));
    
    expect(result.state.status).toBe('REMINDER_1');
    expect(result.state.previousStatus).toBeUndefined();
  });

  it('dunning_resumed continues timeout from where it left off', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'PAUSED',
      previousStatus: 'REMINDER_1',
      dueDate,
      enteredStateAt: makeDate('2024-01-31'),
      pausedAt: makeDate('2024-02-05'),
      configuration: initialize(dueDate).configuration,
    };
    
    const resumedState = process(state, 'dunning_resumed', makeDate('2024-02-10'));
    expect(resumedState.state.status).toBe('REMINDER_1');
    
    const elapsedBeforePause = 3;
    const remainingDays = 14 - elapsedBeforePause;
    const now = addBusinessDays(makeDate('2024-02-05'), remainingDays, []);
    
    const tickResult = process(resumedState.state, 'tick', now);
    expect(tickResult.state.status).toBe('REMINDER_2');
  });

  it('dunning_paused from ISSUED does not transition', () => {
    const dueDate = makeDate('2024-01-17');
    let state = initialize(dueDate);
    
    const result = process(state, 'dunning_paused', makeDate('2024-01-10'));
    expect(result.state.status).toBe('ISSUED');
  });

  it('payment_received from PAUSED transitions to PAID', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'PAUSED',
      previousStatus: 'REMINDER_1',
      dueDate,
      enteredStateAt: makeDate('2024-01-01'),
      pausedAt: makeDate('2024-01-10'),
      configuration: initialize(dueDate).configuration,
    };
    
    const result = process(state, 'payment_received', makeDate('2024-01-15'));
    expect(result.state.status).toBe('PAID');
  });

  it('invoice_cancelled from PAUSED transitions to CANCELLED', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'PAUSED',
      previousStatus: 'REMINDER_1',
      dueDate,
      enteredStateAt: makeDate('2024-01-01'),
      pausedAt: makeDate('2024-01-10'),
      configuration: initialize(dueDate).configuration,
    };
    
    const result = process(state, 'invoice_cancelled', makeDate('2024-01-15'));
    expect(result.state.status).toBe('CANCELLED');
  });
});

describe('Dunning System - Manual Advance', () => {
  it('manual_advance transitions to next state in escalation sequence', () => {
    const dueDate = makeDate('2024-01-17');
    const transitions: [string, string][] = [
      ['ISSUED', 'DUE_SOON'],
      ['DUE_SOON', 'OVERDUE'],
      ['OVERDUE', 'GRACE'],
      ['GRACE', 'REMINDER_1'],
      ['REMINDER_1', 'REMINDER_2'],
      ['REMINDER_2', 'FINAL_NOTICE'],
      ['FINAL_NOTICE', 'SUSPENDED'],
      ['SUSPENDED', 'WRITTEN_OFF'],
    ];
    
    for (const [from, to] of transitions) {
      let state: DunningState = {
        status: from as any,
        dueDate,
        enteredStateAt: makeDate('2024-01-01'),
        configuration: initialize(dueDate).configuration,
      };
      
      const result = process(state, 'manual_advance', makeDate('2024-01-15'));
      expect(result.state.status).toBe(to);
    }
  });

  it('manual_advance returns appropriate action descriptors', () => {
    const dueDate = makeDate('2024-01-17');
    
    let state: DunningState = {
      status: 'FINAL_NOTICE',
      dueDate,
      enteredStateAt: makeDate('2024-01-01'),
      configuration: initialize(dueDate).configuration,
    };
    
    const result = process(state, 'manual_advance', makeDate('2024-01-15'));
    
    expect(result.state.status).toBe('SUSPENDED');
    expect(result.actions).toEqual([
      { type: 'suspend_service' },
      { type: 'send_email', template: 'service_suspended' },
    ]);
  });

  it('manual_advance from PAUSED does nothing', () => {
    const dueDate = makeDate('2024-01-17');
    let state: DunningState = {
      status: 'PAUSED',
      previousStatus: 'REMINDER_1',
      dueDate,
      enteredStateAt: makeDate('2024-01-01'),
      pausedAt: makeDate('2024-01-10'),
      configuration: initialize(dueDate).configuration,
    };
    
    const result = process(state, 'manual_advance', makeDate('2024-01-15'));
    expect(result.state.status).toBe('PAUSED');
    expect(result.actions).toEqual([]);
  });
});

describe('Dunning System - Configurable Timeouts', () => {
  it('uses custom timeouts when provided', () => {
    const dueDate = makeDate('2024-01-31');
    const state = initialize(dueDate, {
      timeouts: {
        dueSoonDays: 3,
        overdueToGrace: 1,
        graceToReminder1: 2,
        reminder1ToReminder2: 5,
        reminder2ToFinalNotice: 5,
        finalNoticeToSuspended: 3,
        suspendedToWrittenOff: 10,
      },
    });
    
    const dueSoonDate = subtractBusinessDays(dueDate, 3, []);
    const result = process(state, 'tick', dueSoonDate);
    
    expect(result.state.status).toBe('DUE_SOON');
  });

  it('uses default timeouts when not provided', () => {
    const dueDate = makeDate('2024-01-17');
    const state = initialize(dueDate);
    
    const dueSoonDate = subtractBusinessDays(dueDate, 7, []);
    const result = process(state, 'tick', dueSoonDate);
    
    expect(result.state.status).toBe('DUE_SOON');
  });
});

describe('Dunning System - Business Days with Holidays', () => {
  it('uses custom holiday calendar for business day calculations', () => {
    const dueDate = makeDate('2024-01-17');
    const holidays = [
      makeDate('2024-01-08'),
      makeDate('2024-01-09'),
    ];
    
    const state = initialize(dueDate, { holidays });
    
    const dueSoonDate = subtractBusinessDays(dueDate, 7, holidays);
    const result = process(state, 'tick', dueSoonDate);
    
    expect(result.state.status).toBe('DUE_SOON');
    expect(dueSoonDate.toISOString().slice(0, 10)).toBe('2024-01-04');
  });

  it('excludes public holiday from timeout period', () => {
    const dueDate = makeDate('2024-01-15');
    const holiday = makeDate('2024-01-08');
    
    const state = initialize(dueDate, { holidays: [holiday] });
    
    const dueSoonDate = subtractBusinessDays(dueDate, 7, [holiday]);
    
    const beforeDueSoon = new Date(dueSoonDate);
    beforeDueSoon.setDate(beforeDueSoon.getDate() - 1);
    
    const result = process(state, 'tick', beforeDueSoon);
    expect(result.state.status).toBe('ISSUED');
    
    const result2 = process(state, 'tick', dueSoonDate);
    expect(result2.state.status).toBe('DUE_SOON');
  });
});

describe('Dunning System - Initialize', () => {
  it('creates initial state with ISSUED status', () => {
    const dueDate = makeDate('2024-01-17');
    const state = initialize(dueDate);
    
    expect(state.status).toBe('ISSUED');
    expect(state.dueDate).toEqual(dueDate);
  });

  it('merges custom config with defaults', () => {
    const dueDate = makeDate('2024-01-17');
    const state = initialize(dueDate, {
      timeouts: {
        dueSoonDays: 5,
      },
    });
    
    expect(state.configuration.timeouts.dueSoonDays).toBe(5);
    expect(state.configuration.timeouts.overdueToGrace).toBe(3);
  });
});
