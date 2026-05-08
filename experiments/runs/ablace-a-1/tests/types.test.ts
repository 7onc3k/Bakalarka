import { describe, it, expect } from 'vitest';
import {
  createInstance,
  process,
} from '../src/index.js';

describe('API exports', () => {
  it('should export createInstance function', () => {
    expect(typeof createInstance).toBe('function');
  });

  it('should export process function', () => {
    expect(typeof process).toBe('function');
  });
});

describe('TypeScript types', () => {
  it('should create instance with correct initial state', () => {
    const dueDate = new Date('2024-12-31');
    const state = createInstance(dueDate);
    expect(state.status).toBe('ISSUED');
    expect(state.dueDate).toEqual(dueDate);
  });

  it('should create instance with custom config', () => {
    const dueDate = new Date('2024-12-31');
    const config = { timeouts: { DUE_SOON: 5 } };
    const state = createInstance(dueDate, config);
    expect(state.config.timeouts?.DUE_SOON).toBe(5);
  });

  it('should process tick event', () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    const state = createInstance(dueDate);
    const result = process(state, { type: 'tick' }, new Date());
    expect(result.state).toBeDefined();
    expect(result.actions).toBeDefined();
  });
});