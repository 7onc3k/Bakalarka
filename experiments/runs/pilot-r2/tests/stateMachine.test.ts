import { describe, it, expect } from 'vitest';
import { createInstance, process } from '../src/index.js';
import { addBusinessDays } from '../src/businessDays.js';

function subBusinessDays(date: Date, days: number): Date {
  return addBusinessDays(date, -days);
}

function advanceToStatus(state: ReturnType<typeof createInstance>, targetStatus: string, dueDate: Date): ReturnType<typeof process> extends (s: infer S, ...args: unknown[]) => { state: infer R } ? R : never {
  let currentState = state;
  let currentDate = new Date(dueDate);
  
  while (currentState.status !== targetStatus) {
    currentDate = addBusinessDays(currentDate, 1);
    const result = process(currentState, { type: 'tick' }, currentDate);
    currentState = result.state;
    if (result.actions.length > 0 && currentState.status !== targetStatus) {
      // If there are actions, we might have skipped a state, so let's step more carefully
      break;
    }
    if (currentState.status === targetStatus) {
      return currentState;
    }
  }
  
  return currentState;
}

describe('State Machine - Time-based Transitions', () => {
  describe('ISSUED -> DUE_SOON', () => {
    it('should transition to DUE_SOON 7 business days before due date', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      expect(state.status).toBe('ISSUED');
      
      const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
      const result = process(state, { type: 'tick' }, sevenBusinessDaysBefore);
      
      expect(result.state.status).toBe('DUE_SOON');
    });

    it('should return send_email action for DUE_SOON transition', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
      const result = process(state, { type: 'tick' }, sevenBusinessDaysBefore);
      
      expect(result.actions).toContainEqual({
        type: 'send_email',
        template: 'due_soon_reminder'
      });
    });

    it('should NOT transition before 7 business days before due date', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      const eightBusinessDaysBefore = subBusinessDays(dueDate, 8);
      const result = process(state, { type: 'tick' }, eightBusinessDaysBefore);
      
      expect(result.state.status).toBe('ISSUED');
      expect(result.actions).toHaveLength(0);
    });
  });

  describe('DUE_SOON -> OVERDUE', () => {
    it('should transition to OVERDUE at due date', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      // First transition to DUE_SOON (7 business days before due)
      const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
      const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
      
      expect(dueSoonState.status).toBe('DUE_SOON');
      
      // Then transition to OVERDUE at due date
      const result = process(dueSoonState, { type: 'tick' }, dueDate);
      
      expect(result.state.status).toBe('OVERDUE');
    });

    it('should NOT transition before due date', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      // First transition to DUE_SOON
      const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
      const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
      
      // Try to transition 1 calendar day before due date
      const dayBeforeDue = subBusinessDays(dueDate, 1);
      const result = process(dueSoonState, { type: 'tick' }, dayBeforeDue);
      
      expect(result.state.status).toBe('DUE_SOON');
    });
  });

  describe('OVERDUE -> GRACE', () => {
    it('should transition to GRACE after 3 business days', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      // Transition to DUE_SOON first
      const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
      const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
      
      // Then transition to OVERDUE at due date
      const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
      
      expect(overdueState.status).toBe('OVERDUE');
      
      // After 3 business days from OVERDUE
      const threeBusinessDaysLater = addBusinessDays(dueDate, 3);
      const result = process(overdueState, { type: 'tick' }, threeBusinessDaysLater);
      
      expect(result.state.status).toBe('GRACE');
    });
  });

  describe('GRACE -> REMINDER_1', () => {
    it('should transition to REMINDER_1 after 7 business days', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      // Get to GRACE state
      const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
      const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
      const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
      const graceDate = addBusinessDays(dueDate, 3);
      const graceState = process(overdueState, { type: 'tick' }, graceDate).state;
      
      expect(graceState.status).toBe('GRACE');
      
      // Then to REMINDER_1 after 7 business days
      const sevenBusinessDaysLater = addBusinessDays(graceDate, 7);
      const result = process(graceState, { type: 'tick' }, sevenBusinessDaysLater);
      
      expect(result.state.status).toBe('REMINDER_1');
    });

    it('should return send_email action for REMINDER_1 transition', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      // Get to GRACE state
      const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
      const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
      const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
      const graceDate = addBusinessDays(dueDate, 3);
      const graceState = process(overdueState, { type: 'tick' }, graceDate).state;
      
      // Transition to REMINDER_1
      const sevenBusinessDaysLater = addBusinessDays(graceDate, 7);
      const result = process(graceState, { type: 'tick' }, sevenBusinessDaysLater);
      
      expect(result.actions).toContainEqual({
        type: 'send_email',
        template: 'first_reminder'
      });
    });
  });

  describe('REMINDER_1 -> REMINDER_2', () => {
    it('should transition to REMINDER_2 after 14 business days', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      // Get to REMINDER_1 state
      const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
      const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
      const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
      const graceDate = addBusinessDays(dueDate, 3);
      const graceState = process(overdueState, { type: 'tick' }, graceDate).state;
      const reminder1Date = addBusinessDays(graceDate, 7);
      const reminder1State = process(graceState, { type: 'tick' }, reminder1Date).state;
      
      expect(reminder1State.status).toBe('REMINDER_1');
      
      // Transition to REMINDER_2 after 14 business days
      const fourteenBusinessDaysLater = addBusinessDays(reminder1Date, 14);
      const result = process(reminder1State, { type: 'tick' }, fourteenBusinessDaysLater);
      
      expect(result.state.status).toBe('REMINDER_2');
    });

    it('should return send_email action for REMINDER_2 transition', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      // Get to REMINDER_1 state
      const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
      const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
      const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
      const graceDate = addBusinessDays(dueDate, 3);
      const graceState = process(overdueState, { type: 'tick' }, graceDate).state;
      const reminder1Date = addBusinessDays(graceDate, 7);
      const reminder1State = process(graceState, { type: 'tick' }, reminder1Date).state;
      
      // Transition to REMINDER_2
      const fourteenBusinessDaysLater = addBusinessDays(reminder1Date, 14);
      const result = process(reminder1State, { type: 'tick' }, fourteenBusinessDaysLater);
      
      expect(result.actions).toContainEqual({
        type: 'send_email',
        template: 'second_reminder'
      });
    });
  });

  describe('REMINDER_2 -> FINAL_NOTICE', () => {
    it('should transition to FINAL_NOTICE after 14 business days', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      // Get to REMINDER_2 state
      const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
      const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
      const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
      const graceDate = addBusinessDays(dueDate, 3);
      const graceState = process(overdueState, { type: 'tick' }, graceDate).state;
      const reminder1Date = addBusinessDays(graceDate, 7);
      const reminder1State = process(graceState, { type: 'tick' }, reminder1Date).state;
      const reminder2Date = addBusinessDays(reminder1Date, 14);
      const reminder2State = process(reminder1State, { type: 'tick' }, reminder2Date).state;
      
      expect(reminder2State.status).toBe('REMINDER_2');
      
      // Transition to FINAL_NOTICE after 14 business days
      const fourteenBusinessDaysLater = addBusinessDays(reminder2Date, 14);
      const result = process(reminder2State, { type: 'tick' }, fourteenBusinessDaysLater);
      
      expect(result.state.status).toBe('FINAL_NOTICE');
    });

    it('should return send_email action for FINAL_NOTICE transition', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      // Get to REMINDER_2 state
      const sevenBusinessDaysBefore = subBusinessDays(dueDate, 7);
      const dueSoonState = process(state, { type: 'tick' }, sevenBusinessDaysBefore).state;
      const overdueState = process(dueSoonState, { type: 'tick' }, dueDate).state;
      const graceDate = addBusinessDays(dueDate, 3);
      const graceState = process(overdueState, { type: 'tick' }, graceDate).state;
      const reminder1Date = addBusinessDays(graceDate, 7);
      const reminder1State = process(graceState, { type: 'tick' }, reminder1Date).state;
      const reminder2Date = addBusinessDays(reminder1Date, 14);
      const reminder2State = process(reminder1State, { type: 'tick' }, reminder2Date).state;
      
      // Transition to FINAL_NOTICE
      const fourteenBusinessDaysLater = addBusinessDays(reminder2Date, 14);
      const result = process(reminder2State, { type: 'tick' }, fourteenBusinessDaysLater);
      
      expect(result.actions).toContainEqual({
        type: 'send_email',
        template: 'final_warning'
      });
    });
  });

  describe('FINAL_NOTICE -> SUSPENDED', () => {
    it('should transition to SUSPENDED after 7 business days', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      // Get to FINAL_NOTICE state
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
      
      expect(finalNoticeState.status).toBe('FINAL_NOTICE');
      
      // Transition to SUSPENDED after 7 business days
      const sevenBusinessDaysLater = addBusinessDays(finalNoticeDate, 7);
      const result = process(finalNoticeState, { type: 'tick' }, sevenBusinessDaysLater);
      
      expect(result.state.status).toBe('SUSPENDED');
    });

    it('should return suspend_service and send_email actions for SUSPENDED transition', () => {
      const dueDate = new Date('2024-02-01');
      const state = createInstance(dueDate);
      
      // Get to FINAL_NOTICE state
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
      
      // Transition to SUSPENDED
      const sevenBusinessDaysLater = addBusinessDays(finalNoticeDate, 7);
      const result = process(finalNoticeState, { type: 'tick' }, sevenBusinessDaysLater);
      
      expect(result.actions).toContainEqual({ type: 'suspend_service' });
      expect(result.actions).toContainEqual({
        type: 'send_email',
        template: 'service_suspended'
      });
    });
  });

  describe('SUSPENDED -> WRITTEN_OFF', () => {
    it('should transition to WRITTEN_OFF after 30 business days', () => {
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
      
      // Transition to WRITTEN_OFF after 30 business days
      const thirtyBusinessDaysLater = addBusinessDays(suspendedDate, 30);
      const result = process(suspendedState, { type: 'tick' }, thirtyBusinessDaysLater);
      
      expect(result.state.status).toBe('WRITTEN_OFF');
    });

    it('should return send_email action for WRITTEN_OFF transition', () => {
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
      
      // Transition to WRITTEN_OFF
      const thirtyBusinessDaysLater = addBusinessDays(suspendedDate, 30);
      const result = process(suspendedState, { type: 'tick' }, thirtyBusinessDaysLater);
      
      expect(result.actions).toContainEqual({
        type: 'send_email',
        template: 'written_off_notice'
      });
    });
  });
});