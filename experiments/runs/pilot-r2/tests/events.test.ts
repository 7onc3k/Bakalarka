import { describe, it, expect } from 'vitest';
import { createInstance, process } from '../src/index.js';
import { addBusinessDays } from '../src/businessDays.js';

function subBusinessDays(date: Date, days: number): Date {
  return addBusinessDays(date, -days);
}

describe('Payment Handling', () => {
  it('should transition to PAID from any active state', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Transition to OVERDUE
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    
    // Payment received
    const result = process(overdueState, { type: 'payment_received' }, new Date());
    
    expect(result.state.status).toBe('PAID');
  });

  it('should return no actions when payment received in non-suspended state', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Transition to OVERDUE
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    
    // Payment received
    const result = process(overdueState, { type: 'payment_received' }, new Date());
    
    expect(result.actions).toHaveLength(0);
  });

  it('should return resume_service action when payment received from SUSPENDED', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Get to SUSPENDED state
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    const graceDate = addBusinessDays(dueDate, 3);
    const graceState = process(overdueState, { type: 'tick' }, graceDate).state;
    const reminder1Date = addBusinessDays(graceDate, 7);
    const reminder1State = process(graceState, { type: 'tick' }, reminder1Date).state;
    const reminder2Date = addBusinessDays(reminder1Date, 14);
    const reminder2State = process(reminder1State, { type: 'tick' }, reminder2Date).state;
    const finalNoticeDate = addBusinessDays(reminder2Date, 14);
    const finalNoticeState = process(reminder2State, { type: 'tick' }, finalNoticeDate).state;
    const suspendedDate = addBusinessDays(finalNoticeDate, 7);
    const suspendedState = process(finalNoticeState, { type: 'tick' }, suspendedDate).state;
    
    expect(suspendedState.status).toBe('SUSPENDED');
    
    // Payment received
    const result = process(suspendedState, { type: 'payment_received' }, new Date());
    
    expect(result.state.status).toBe('PAID');
    expect(result.actions).toContainEqual({ type: 'resume_service' });
  });

  it('should not transition from PAID state', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Transition to PAID
    const paymentResult = process(state, { type: 'payment_received' }, new Date());
    const paidState = paymentResult.state;
    
    // Try to process any event
    const result = process(paidState, { type: 'tick' }, new Date());
    
    expect(result.state.status).toBe('PAID');
    expect(result.actions).toHaveLength(0);
  });

  it('should not transition from WRITTEN_OFF state', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Get to WRITTEN_OFF
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    const graceDate = addBusinessDays(dueDate, 3);
    const graceState = process(overdueState, { type: 'tick' }, graceDate).state;
    const reminder1Date = addBusinessDays(graceDate, 7);
    const reminder1State = process(graceState, { type: 'tick' }, reminder1Date).state;
    const reminder2Date = addBusinessDays(reminder1Date, 14);
    const reminder2State = process(reminder1State, { type: 'tick' }, reminder2Date).state;
    const finalNoticeDate = addBusinessDays(reminder2Date, 14);
    const finalNoticeState = process(reminder2State, { type: 'tick' }, finalNoticeDate).state;
    const suspendedDate = addBusinessDays(finalNoticeDate, 7);
    const suspendedState = process(finalNoticeState, { type: 'tick' }, suspendedDate).state;
    const writtenOffDate = addBusinessDays(suspendedDate, 30);
    const writtenOffState = process(suspendedState, { type: 'tick' }, writtenOffDate).state;
    
    expect(writtenOffState.status).toBe('WRITTEN_OFF');
    
    // Try to process any event
    const result = process(writtenOffState, { type: 'payment_received' }, new Date());
    
    expect(result.state.status).toBe('WRITTEN_OFF');
    expect(result.actions).toHaveLength(0);
  });
});

describe('Invoice Cancellation', () => {
  it('should transition to CANCELLED from active state', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Transition to OVERDUE
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    
    // Cancel invoice
    const result = process(overdueState, { type: 'invoice_cancelled' }, new Date());
    
    expect(result.state.status).toBe('CANCELLED');
  });

  it('should return resume_service when cancelling from SUSPENDED', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Get to SUSPENDED state
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    const graceDate = addBusinessDays(dueDate, 3);
    const graceState = process(overdueState, { type: 'tick' }, graceDate).state;
    const reminder1Date = addBusinessDays(graceDate, 7);
    const reminder1State = process(graceState, { type: 'tick' }, reminder1Date).state;
    const reminder2Date = addBusinessDays(reminder1Date, 14);
    const reminder2State = process(reminder1State, { type: 'tick' }, reminder2Date).state;
    const finalNoticeDate = addBusinessDays(reminder2Date, 14);
    const finalNoticeState = process(reminder2State, { type: 'tick' }, finalNoticeDate).state;
    const suspendedDate = addBusinessDays(finalNoticeDate, 7);
    const suspendedState = process(finalNoticeState, { type: 'tick' }, suspendedDate).state;
    
    expect(suspendedState.status).toBe('SUSPENDED');
    
    // Cancel invoice
    const result = process(suspendedState, { type: 'invoice_cancelled' }, new Date());
    
    expect(result.state.status).toBe('CANCELLED');
    expect(result.actions).toContainEqual({ type: 'resume_service' });
  });

  it('should not transition from CANCELLED state', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Cancel invoice
    const cancelResult = process(state, { type: 'invoice_cancelled' }, new Date());
    const cancelledState = cancelResult.state;
    
    // Try to process any event
    const result = process(cancelledState, { type: 'tick' }, new Date());
    
    expect(result.state.status).toBe('CANCELLED');
    expect(result.actions).toHaveLength(0);
  });
});

describe('Pause/Resume', () => {
  it('should transition to PAUSED from active state', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Get to OVERDUE
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    
    expect(overdueState.status).toBe('OVERDUE');
    
    // Pause
    const result = process(overdueState, { type: 'dunning_paused' }, new Date());
    
    expect(result.state.status).toBe('PAUSED');
    expect(result.state.pausedFrom).toBe('OVERDUE');
  });

  it('should preserve pausedFrom when paused', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Get to GRACE
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    const graceDate = addBusinessDays(dueDate, 3);
    const graceState = process(overdueState, { type: 'tick' }, graceDate).state;
    
    // Pause
    const result = process(graceState, { type: 'dunning_paused' }, new Date());
    
    expect(result.state.status).toBe('PAUSED');
    expect(result.state.pausedFrom).toBe('GRACE');
  });

  it('should resume to previous state', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Get to OVERDUE and pause
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    const pausedResult = process(overdueState, { type: 'dunning_paused' }, new Date());
    const pausedState = pausedResult.state;
    
    // Resume
    const result = process(pausedState, { type: 'dunning_resumed' }, new Date());
    
    expect(result.state.status).toBe('OVERDUE');
    expect(result.state.pausedFrom).toBeUndefined();
  });

  it('should take priority over pause when payment received', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Get to OVERDUE and pause
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    const pausedResult = process(overdueState, { type: 'dunning_paused' }, new Date());
    const pausedState = pausedResult.state;
    
    // Payment received while paused
    const result = process(pausedState, { type: 'payment_received' }, new Date());
    
    expect(result.state.status).toBe('PAID');
  });

  it('should allow cancellation while paused', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Get to OVERDUE and pause
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    const pausedResult = process(overdueState, { type: 'dunning_paused' }, new Date());
    const pausedState = pausedResult.state;
    
    // Cancel while paused
    const result = process(pausedState, { type: 'invoice_cancelled' }, new Date());
    
    expect(result.state.status).toBe('CANCELLED');
  });
});

describe('Manual Advance', () => {
  it('should advance to next state manually', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Get to OVERDUE
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    
    expect(overdueState.status).toBe('OVERDUE');
    
    // Manual advance
    const result = process(overdueState, { type: 'manual_advance' }, new Date());
    
    expect(result.state.status).toBe('GRACE');
  });

  it('should return actions for manual advance transition', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Get to GRACE
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    const graceDate = addBusinessDays(dueDate, 3);
    const graceState = process(overdueState, { type: 'tick' }, graceDate).state;
    
    // Manual advance to REMINDER_1
    const result = process(graceState, { type: 'manual_advance' }, new Date());
    
    expect(result.state.status).toBe('REMINDER_1');
    expect(result.actions).toContainEqual({
      type: 'send_email',
      template: 'first_reminder'
    });
  });
});

describe('Configurable Timeouts', () => {
  it('should use custom timeouts when provided', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate, {
      timeouts: {
        OVERDUE: 1,
        GRACE: 1
      }
    });
    
    // Get to OVERDUE
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    
    expect(overdueState.status).toBe('OVERDUE');
    
    // 1 business day later should transition to GRACE (custom timeout)
    const oneBusinessDayLater = addBusinessDays(dueDate, 1);
    const result = process(overdueState, { type: 'tick' }, oneBusinessDayLater);
    
    expect(result.state.status).toBe('GRACE');
  });

  it('should use default timeouts when not provided', () => {
    const dueDate = new Date('2024-02-01');
    const state = createInstance(dueDate);
    
    // Get to OVERDUE
    const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
    const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
    const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
    
    // 1 business day later should NOT transition (default is 3 days)
    const oneBusinessDayLater = addBusinessDays(dueDate, 1);
    const result = process(overdueState, { type: 'tick' }, oneBusinessDayLater);
    
    expect(result.state.status).toBe('OVERDUE');
  });
});