import { describe, it, expect } from 'vitest';
import { createDunning, process, DunningState } from '../src/index';

function createDate(year: number, month: number, day: number): Date {
  const d = new Date(year, month - 1, day);
  d.setHours(12, 0, 0, 0);
  return d;
}

describe('Terminal states', () => {
  const dueDate = createDate(2024, 3, 15);

  describe('PAID state', () => {
    it('Given an invoice is in PAID state, When any event occurs, Then no state transition happens', () => {
      const initialState = createDunning(dueDate);
      const paymentResult = process(initialState, 'payment_received', new Date());
      const state = paymentResult.state;
      expect(state.status).toBe('PAID');

      const events: Array<'tick' | 'payment_received' | 'invoice_cancelled' | 'dunning_paused' | 'dunning_resumed' | 'manual_advance'> = 
        ['tick', 'payment_received', 'invoice_cancelled', 'dunning_paused', 'dunning_resumed', 'manual_advance'];

      for (const event of events) {
        const processResult = process(state, event, new Date());
        expect(processResult.state.status).toBe('PAID');
        expect(processResult.actions).toHaveLength(0);
      }
    });
  });

  describe('WRITTEN_OFF state', () => {
    it('Given an invoice is in WRITTEN_OFF state, When any event occurs, Then no state transition happens', () => {
      const state: DunningState = { ...createDunning(dueDate), status: 'WRITTEN_OFF', stateEnteredAt: new Date() };

      const events: Array<'tick' | 'payment_received' | 'invoice_cancelled' | 'dunning_paused' | 'dunning_resumed' | 'manual_advance'> = 
        ['tick', 'payment_received', 'invoice_cancelled', 'dunning_paused', 'dunning_resumed', 'manual_advance'];

      for (const event of events) {
        const result = process(state, event, new Date());
        expect(result.state.status).toBe('WRITTEN_OFF');
        expect(result.actions).toHaveLength(0);
      }
    });
  });

  describe('CANCELLED state', () => {
    it('Given an invoice is in CANCELLED state, When any event occurs, Then no state transition happens', () => {
      const initialState = createDunning(dueDate);
      const cancelResult = process(initialState, 'invoice_cancelled', new Date());
      const state = cancelResult.state;
      expect(state.status).toBe('CANCELLED');

      const events: Array<'tick' | 'payment_received' | 'invoice_cancelled' | 'dunning_paused' | 'dunning_resumed' | 'manual_advance'> = 
        ['tick', 'payment_received', 'invoice_cancelled', 'dunning_paused', 'dunning_resumed', 'manual_advance'];

      for (const event of events) {
        const result = process(state, event, new Date());
        expect(result.state.status).toBe('CANCELLED');
        expect(result.actions).toHaveLength(0);
      }
    });
  });
});
