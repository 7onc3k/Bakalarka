import { describe, it, expect } from 'vitest';
import { createInstance } from '../src/index.js';

describe('createInstance', () => {
  it('should return state with ISSUED status', () => {
    const dueDate = new Date('2024-12-31');
    const state = createInstance(dueDate);
    expect(state.status).toBe('ISSUED');
  });

  it('should store dueDate correctly', () => {
    const dueDate = new Date('2024-12-31');
    const state = createInstance(dueDate);
    expect(state.dueDate).toEqual(dueDate);
  });

  it('should set stateEnteredAt to now', () => {
    const before = new Date();
    const state = createInstance(new Date('2024-12-31'));
    const after = new Date();
    expect(state.stateEnteredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(state.stateEnteredAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should store config', () => {
    const config = { holidays: [new Date('2024-01-01')] };
    const state = createInstance(new Date('2024-12-31'), config);
    expect(state.config.holidays).toEqual(config.holidays);
  });

  it('should use custom timeouts from config', () => {
    const config = {
      timeouts: {
        DUE_SOON: 5,
        OVERDUE: 2,
      },
    };
    const state = createInstance(new Date('2024-12-31'), config);
    expect(state.config.timeouts?.DUE_SOON).toBe(5);
    expect(state.config.timeouts?.OVERDUE).toBe(2);
  });

  it('should use custom holidays from config', () => {
    const holidays = [new Date('2024-01-01'), new Date('2024-07-04')];
    const config = { holidays };
    const state = createInstance(new Date('2024-12-31'), config);
    expect(state.config.holidays).toEqual(holidays);
  });

  it('should have empty pausedFrom and pausedElapsed', () => {
    const state = createInstance(new Date('2024-12-31'));
    expect(state.pausedFrom).toBeUndefined();
    expect(state.pausedElapsed).toBeUndefined();
  });
});