import { describe, it, expect } from 'vitest';
import { 
  createInstance, 
  process,
  DunningStatus,
  DunningEvent,
  DunningState,
  DunningConfig,
  ActionDescriptor,
  ProcessResult,
  countBusinessDays,
  addBusinessDays,
  isBusinessDay
} from '../src/index';

describe('TypeScript types', () => {
  it('should export DunningStatus type', () => {
    const statuses: DunningStatus[] = [
      'ISSUED', 'DUE_SOON', 'OVERDUE', 'GRACE',
      'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE',
      'SUSPENDED', 'WRITTEN_OFF', 'PAID', 'PAUSED', 'CANCELLED'
    ];
    expect(statuses.length).toBe(12);
  });

  it('should create a dunning instance with correct initial state', () => {
    const dueDate = new Date('2024-12-31');
    const state = createInstance(dueDate);
    
    expect(state.status).toBe('ISSUED');
    expect(state.dueDate).toEqual(dueDate);
    expect(state.stateEnteredAt).toBeInstanceOf(Date);
  });

  it('should create instance with custom config', () => {
    const dueDate = new Date('2024-12-31');
    const config: DunningConfig = {
      holidays: [new Date('2024-12-25')],
      timeouts: { REMINDER_1: 10 }
    };
    const state = createInstance(dueDate, config);
    
    expect(state.config.holidays).toHaveLength(1);
    expect(state.config.timeouts?.REMINDER_1).toBe(10);
  });

  it('should return ProcessResult with state and actions', () => {
    const dueDate = new Date('2024-12-31');
    const state = createInstance(dueDate);
    const event: DunningEvent = { type: 'tick' };
    const now = new Date();
    
    const result = process(state, event, now);
    
    expect(result).toHaveProperty('state');
    expect(result).toHaveProperty('actions');
    expect(Array.isArray(result.actions)).toBe(true);
  });
});

describe('Business days calculation', () => {
  it('should count business days between dates excluding weekends', () => {
    const friday = new Date('2024-01-05');
    const monday = new Date('2024-01-08');
    
    const days = countBusinessDays(friday, monday);
    expect(days).toBe(1);
  });

  it('should return 0 for same day', () => {
    const date = new Date('2024-01-05');
    
    const days = countBusinessDays(date, date);
    expect(days).toBe(0);
  });

  it('should exclude Saturday and Sunday', () => {
    const wednesday = new Date('2024-01-03');
    const tuesday = new Date('2024-01-09');
    
    const days = countBusinessDays(wednesday, tuesday);
    expect(days).toBe(4);
  });

  it('should exclude public holidays from count', () => {
    const monday = new Date('2024-01-01');
    const friday = new Date('2024-01-05');
    const holidays = [new Date('2024-01-01')];
    
    const days = countBusinessDays(monday, friday, holidays);
    expect(days).toBe(4);
  });

  it('should add business days to a date excluding weekends', () => {
    const friday = new Date('2024-01-05');
    const result = addBusinessDays(friday, 1);
    
    expect(result.getDay()).toBe(1);
  });

  it('should add business days excluding holidays', () => {
    const thursday = new Date('2024-01-04');
    const holidays = [new Date('2024-01-05')];
    
    const result = addBusinessDays(thursday, 1, holidays);
    
    expect(result.getDay()).toBe(1);
  });

  it('should identify business days', () => {
    expect(isBusinessDay(new Date('2024-01-05'))).toBe(true);
    expect(isBusinessDay(new Date('2024-01-06'))).toBe(false);
    expect(isBusinessDay(new Date('2024-01-07'))).toBe(false);
  });

  it('should identify holidays as non-business days', () => {
    const holidays = [new Date('2024-01-01')];
    
    expect(isBusinessDay(new Date('2024-01-01'), holidays)).toBe(false);
  });
});

describe('Time-based state transitions', () => {
  describe('ISSUED → DUE_SOON', () => {
    it('should transition from ISSUED to DUE_SOON at 7 business days before due date', () => {
      const dueDate = new Date('2024-01-15');
      const state = createInstance(dueDate);
      
      const sevenBusinessDaysBefore = addBusinessDays(dueDate, -7);
      const event: DunningEvent = { type: 'tick' };
      const result = process(state, event, sevenBusinessDaysBefore);
      
      expect(result.state.status).toBe('DUE_SOON');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'due_soon_reminder' });
    });
  });

  describe('DUE_SOON → OVERDUE', () => {
    it('should transition from DUE_SOON to OVERDUE at due date', () => {
      const dueDate = new Date('2024-01-15');
      const state: DunningState = {
        status: 'DUE_SOON',
        dueDate,
        stateEnteredAt: addBusinessDays(dueDate, -7),
        config: {}
      };
      
      const event: DunningEvent = { type: 'tick' };
      const result = process(state, event, dueDate);
      
      expect(result.state.status).toBe('OVERDUE');
      expect(result.actions).toHaveLength(0);
    });
  });

  describe('OVERDUE → GRACE', () => {
    it('should transition from OVERDUE to GRACE after 3 business days', () => {
      const dueDate = new Date('2024-01-15');
      const stateEnteredAt = new Date('2024-01-15');
      const state: DunningState = {
        status: 'OVERDUE',
        dueDate,
        stateEnteredAt,
        config: {}
      };
      
      const threeBusinessDaysLater = addBusinessDays(stateEnteredAt, 3);
      const event: DunningEvent = { type: 'tick' };
      const result = process(state, event, threeBusinessDaysLater);
      
      expect(result.state.status).toBe('GRACE');
      expect(result.actions).toHaveLength(0);
    });
  });

  describe('GRACE → REMINDER_1', () => {
    it('should transition from GRACE to REMINDER_1 after 7 business days', () => {
      const dueDate = new Date('2024-01-15');
      const stateEnteredAt = addBusinessDays(dueDate, 3);
      const state: DunningState = {
        status: 'GRACE',
        dueDate,
        stateEnteredAt,
        config: {}
      };
      
      const sevenBusinessDaysLater = addBusinessDays(stateEnteredAt, 7);
      const event: DunningEvent = { type: 'tick' };
      const result = process(state, event, sevenBusinessDaysLater);
      
      expect(result.state.status).toBe('REMINDER_1');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'first_reminder' });
    });
  });

  describe('REMINDER_1 → REMINDER_2', () => {
    it('should transition from REMINDER_1 to REMINDER_2 after 14 business days', () => {
      const dueDate = new Date('2024-01-15');
      const stateEnteredAt = addBusinessDays(dueDate, 10);
      const state: DunningState = {
        status: 'REMINDER_1',
        dueDate,
        stateEnteredAt,
        config: {}
      };
      
      const fourteenBusinessDaysLater = addBusinessDays(stateEnteredAt, 14);
      const event: DunningEvent = { type: 'tick' };
      const result = process(state, event, fourteenBusinessDaysLater);
      
      expect(result.state.status).toBe('REMINDER_2');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'second_reminder' });
    });
  });

  describe('REMINDER_2 → FINAL_NOTICE', () => {
    it('should transition from REMINDER_2 to FINAL_NOTICE after 14 business days', () => {
      const dueDate = new Date('2024-01-15');
      const stateEnteredAt = addBusinessDays(dueDate, 24);
      const state: DunningState = {
        status: 'REMINDER_2',
        dueDate,
        stateEnteredAt,
        config: {}
      };
      
      const fourteenBusinessDaysLater = addBusinessDays(stateEnteredAt, 14);
      const event: DunningEvent = { type: 'tick' };
      const result = process(state, event, fourteenBusinessDaysLater);
      
      expect(result.state.status).toBe('FINAL_NOTICE');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'final_warning' });
    });
  });

  describe('FINAL_NOTICE → SUSPENDED', () => {
    it('should transition from FINAL_NOTICE to SUSPENDED after 7 business days', () => {
      const dueDate = new Date('2024-01-15');
      const stateEnteredAt = addBusinessDays(dueDate, 38);
      const state: DunningState = {
        status: 'FINAL_NOTICE',
        dueDate,
        stateEnteredAt,
        config: {}
      };
      
      const sevenBusinessDaysLater = addBusinessDays(stateEnteredAt, 7);
      const event: DunningEvent = { type: 'tick' };
      const result = process(state, event, sevenBusinessDaysLater);
      
      expect(result.state.status).toBe('SUSPENDED');
      expect(result.actions).toHaveLength(2);
      expect(result.actions).toContainEqual({ type: 'suspend_service' });
      expect(result.actions).toContainEqual({ type: 'send_email', template: 'service_suspended' });
    });
  });

  describe('SUSPENDED → WRITTEN_OFF', () => {
    it('should transition from SUSPENDED to WRITTEN_OFF after 30 business days', () => {
      const dueDate = new Date('2024-01-15');
      const stateEnteredAt = addBusinessDays(dueDate, 45);
      const state: DunningState = {
        status: 'SUSPENDED',
        dueDate,
        stateEnteredAt,
        config: {}
      };
      
      const thirtyBusinessDaysLater = addBusinessDays(stateEnteredAt, 30);
      const event: DunningEvent = { type: 'tick' };
      const result = process(state, event, thirtyBusinessDaysLater);
      
      expect(result.state.status).toBe('WRITTEN_OFF');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({ type: 'send_email', template: 'written_off_notice' });
    });
  });

  describe('Terminal states', () => {
    it('should not transition from PAID state', () => {
      const dueDate = new Date('2024-01-15');
      const state: DunningState = {
        status: 'PAID',
        dueDate,
        stateEnteredAt: new Date(),
        config: {}
      };
      
      const farFuture = addBusinessDays(new Date(), 100);
      const event: DunningEvent = { type: 'tick' };
      const result = process(state, event, farFuture);
      
      expect(result.state.status).toBe('PAID');
    });

    it('should not transition from WRITTEN_OFF state', () => {
      const dueDate = new Date('2024-01-15');
      const state: DunningState = {
        status: 'WRITTEN_OFF',
        dueDate,
        stateEnteredAt: new Date(),
        config: {}
      };
      
      const farFuture = addBusinessDays(new Date(), 100);
      const event: DunningEvent = { type: 'tick' };
      const result = process(state, event, farFuture);
      
      expect(result.state.status).toBe('WRITTEN_OFF');
    });

    it('should not transition from CANCELLED state', () => {
      const dueDate = new Date('2024-01-15');
      const state: DunningState = {
        status: 'CANCELLED',
        dueDate,
        stateEnteredAt: new Date(),
        config: {}
      };
      
      const farFuture = addBusinessDays(new Date(), 100);
      const event: DunningEvent = { type: 'tick' };
      const result = process(state, event, farFuture);
      
      expect(result.state.status).toBe('CANCELLED');
    });
  });
});

describe('Payment handling', () => {
  it('should transition to PAID from any active state', () => {
    const dueDate = new Date('2024-01-15');
    const state: DunningState = {
      status: 'OVERDUE',
      dueDate,
      stateEnteredAt: addBusinessDays(dueDate, 3),
      config: {}
    };
    
    const event: DunningEvent = { type: 'payment_received' };
    const now = new Date();
    const result = process(state, event, now);
    
    expect(result.state.status).toBe('PAID');
  });

  it('should return resume_service action when payment received from SUSPENDED', () => {
    const dueDate = new Date('2024-01-15');
    const state: DunningState = {
      status: 'SUSPENDED',
      dueDate,
      stateEnteredAt: addBusinessDays(dueDate, 45),
      config: {}
    };
    
    const event: DunningEvent = { type: 'payment_received' };
    const now = new Date();
    const result = process(state, event, now);
    
    expect(result.state.status).toBe('PAID');
    expect(result.actions).toContainEqual({ type: 'resume_service' });
  });
});

describe('Invoice cancellation', () => {
  it('should transition to CANCELLED from any non-terminal state', () => {
    const dueDate = new Date('2024-01-15');
    const state: DunningState = {
      status: 'GRACE',
      dueDate,
      stateEnteredAt: addBusinessDays(dueDate, 3),
      config: {}
    };
    
    const event: DunningEvent = { type: 'invoice_cancelled' };
    const now = new Date();
    const result = process(state, event, now);
    
    expect(result.state.status).toBe('CANCELLED');
  });

  it('should return resume_service when cancelling from SUSPENDED', () => {
    const dueDate = new Date('2024-01-15');
    const state: DunningState = {
      status: 'SUSPENDED',
      dueDate,
      stateEnteredAt: addBusinessDays(dueDate, 45),
      config: {}
    };
    
    const event: DunningEvent = { type: 'invoice_cancelled' };
    const now = new Date();
    const result = process(state, event, now);
    
    expect(result.state.status).toBe('CANCELLED');
    expect(result.actions).toContainEqual({ type: 'resume_service' });
  });
});

describe('Pause/Resume functionality', () => {
  it('should transition to PAUSED from active dunning state', () => {
    const dueDate = new Date('2024-01-15');
    const state: DunningState = {
      status: 'OVERDUE',
      dueDate,
      stateEnteredAt: addBusinessDays(dueDate, 3),
      config: {}
    };
    
    const event: DunningEvent = { type: 'dunning_paused' };
    const now = new Date();
    const result = process(state, event, now);
    
    expect(result.state.status).toBe('PAUSED');
    expect(result.state.pausedFrom).toBe('OVERDUE');
  });

  it('should resume to previous state on dunning_resumed', () => {
    const dueDate = new Date('2024-01-15');
    const state: DunningState = {
      status: 'PAUSED',
      dueDate,
      stateEnteredAt: new Date(),
      config: {},
      pausedFrom: 'OVERDUE',
      pausedElapsed: 2
    };
    
    const event: DunningEvent = { type: 'dunning_resumed' };
    const now = new Date();
    const result = process(state, event, now);
    
    expect(result.state.status).toBe('OVERDUE');
    expect(result.state.pausedFrom).toBeUndefined();
    expect(result.state.pausedElapsed).toBeUndefined();
  });

  it('should prioritize payment over pause state', () => {
    const dueDate = new Date('2024-01-15');
    const state: DunningState = {
      status: 'PAUSED',
      dueDate,
      stateEnteredAt: new Date(),
      config: {},
      pausedFrom: 'OVERDUE',
      pausedElapsed: 2
    };
    
    const event: DunningEvent = { type: 'payment_received' };
    const now = new Date();
    const result = process(state, event, now);
    
    expect(result.state.status).toBe('PAID');
  });
});

describe('Manual advance', () => {
  it('should advance to next state on manual_advance', () => {
    const dueDate = new Date('2024-01-15');
    const state: DunningState = {
      status: 'GRACE',
      dueDate,
      stateEnteredAt: addBusinessDays(dueDate, 3),
      config: {}
    };
    
    const event: DunningEvent = { type: 'manual_advance' };
    const now = new Date();
    const result = process(state, event, now);
    
    expect(result.state.status).toBe('REMINDER_1');
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toEqual({ type: 'send_email', template: 'first_reminder' });
  });
});

describe('Configurable timeouts', () => {
  it('should use custom timeout when provided', () => {
    const dueDate = new Date('2024-01-15');
    const state: DunningState = {
      status: 'GRACE',
      dueDate,
      stateEnteredAt: addBusinessDays(dueDate, 3),
      config: { timeouts: { REMINDER_1: 10 } }
    };
    
    const tenBusinessDaysLater = addBusinessDays(state.stateEnteredAt, 10);
    const event: DunningEvent = { type: 'tick' };
    const result = process(state, event, tenBusinessDaysLater);
    
    expect(result.state.status).toBe('REMINDER_1');
  });
});