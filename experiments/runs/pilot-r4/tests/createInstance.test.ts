import { describe, it, expect } from 'vitest';
import { createInstance } from '../src/createInstance.js';
import { DunningConfig } from '../src/types.js';

describe('createInstance', () => {
  it('should create a dunning instance with ISSUED status', () => {
    const dueDate = new Date('2026-02-01');
    const state = createInstance(dueDate);
    
    expect(state.status).toBe('ISSUED');
    expect(state.dueDate).toEqual(dueDate);
    expect(state.stateEnteredAt).toBeInstanceOf(Date);
    expect(state.config.timeouts).toBeDefined();
    expect(state.config.holidays).toEqual([]);
  });

  it('should create a dunning instance with default timeouts', () => {
    const dueDate = new Date('2026-02-01');
    const state = createInstance(dueDate);
    
    expect(state.config.timeouts).toBeDefined();
    expect(state.config.timeouts?.['ISSUED']).toBe(0);
    expect(state.config.timeouts?.['DUE_SOON']).toBe(-7); // 7 days before due
    expect(state.config.timeouts?.['OVERDUE']).toBe(3); // 3 business days after due
    expect(state.config.timeouts?.['GRACE']).toBe(7);
    expect(state.config.timeouts?.['REMINDER_1']).toBe(14);
    expect(state.config.timeouts?.['REMINDER_2']).toBe(14);
    expect(state.config.timeouts?.['FINAL_NOTICE']).toBe(7);
    expect(state.config.timeouts?.['SUSPENDED']).toBe(30);
  });

  it('should allow custom configuration', () => {
    const dueDate = new Date('2026-02-01');
    const config: Partial<DunningConfig> = {
      timeouts: {
        'DUE_SOON': -5,
        'OVERDUE': 5
      },
      holidays: [new Date('2026-01-01')]
    };
    
    const state = createInstance(dueDate, config);
    
    expect(state.config.timeouts?.['DUE_SOON']).toBe(-5);
    expect(state.config.timeouts?.['OVERDUE']).toBe(5);
    expect(state.config.holidays).toHaveLength(1);
  });

  it('should use default timeouts when custom config is partial', () => {
    const dueDate = new Date('2026-02-01');
    const config: Partial<DunningConfig> = {
      holidays: [new Date('2026-01-01')]
    };
    
    const state = createInstance(dueDate, config);
    
    // Default timeouts should still be applied
    expect(state.config.timeouts?.['DUE_SOON']).toBe(-7);
    expect(state.config.timeouts?.['OVERDUE']).toBe(3);
    // But custom holidays should be used
    expect(state.config.holidays).toHaveLength(1);
  });
});