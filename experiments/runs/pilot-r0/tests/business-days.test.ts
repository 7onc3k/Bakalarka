import { describe, it, expect } from 'vitest';
import { createDunning, process, addBusinessDays, countBusinessDays, isWeekend, isHoliday, isBusinessDay } from '../src/index';

function createDate(year: number, month: number, day: number): Date {
  const d = new Date(year, month - 1, day);
  d.setHours(12, 0, 0, 0);
  return d;
}

describe('Business days calculation', () => {
  describe('isWeekend', () => {
    it('Saturday is a weekend day', () => {
      const saturday = createDate(2024, 3, 16);
      expect(isWeekend(saturday)).toBe(true);
    });

    it('Sunday is a weekend day', () => {
      const sunday = createDate(2024, 3, 17);
      expect(isWeekend(sunday)).toBe(true);
    });

    it('Friday is not a weekend day', () => {
      const friday = createDate(2024, 3, 15);
      expect(isWeekend(friday)).toBe(false);
    });
  });

  describe('isHoliday', () => {
    it('A date in the holidays list is a holiday', () => {
      const holiday = createDate(2024, 12, 25);
      const holidays = [holiday];
      expect(isHoliday(holiday, holidays)).toBe(true);
    });

    it('A date not in the holidays list is not a holiday', () => {
      const holiday = createDate(2024, 12, 25);
      const notHoliday = createDate(2024, 12, 24);
      const holidays = [holiday];
      expect(isHoliday(notHoliday, holidays)).toBe(false);
    });
  });

  describe('countBusinessDays', () => {
    it('Given a timeout of 14 business days starting on a Friday, When the system calculates the target date, Then weekends are excluded from the count', () => {
      const friday = createDate(2024, 3, 15);
      const targetDate = addBusinessDays(friday, 14);
      
      const businessDaysCount = countBusinessDays(friday, targetDate);
      expect(businessDaysCount).toBe(14);
    });

    it('Given a public holiday falls within a timeout period, When the system calculates the target date, Then the public holiday is excluded from the count', () => {
      const friday = createDate(2024, 3, 15);
      const holiday = createDate(2024, 3, 20);
      const holidays = [holiday];
      
      const targetDate = addBusinessDays(friday, 14, holidays);
      const businessDaysCount = countBusinessDays(friday, targetDate, holidays);
      
      expect(businessDaysCount).toBe(14);
    });

    it('Given a custom holiday calendar is provided, When business days are calculated, Then the custom holidays are used', () => {
      const friday = createDate(2024, 3, 15);
      const customHoliday = createDate(2024, 3, 18);
      const holidays = [customHoliday];
      
      const result = addBusinessDays(friday, 5, holidays);
      
      const businessDaysCount = countBusinessDays(friday, result, holidays);
      expect(businessDaysCount).toBe(5);
    });
  });

  describe('isBusinessDay', () => {
    it('Weekdays are business days', () => {
      const monday = createDate(2024, 3, 18);
      expect(isBusinessDay(monday)).toBe(true);
    });

    it('Weekends are not business days', () => {
      const saturday = createDate(2024, 3, 16);
      expect(isBusinessDay(saturday)).toBe(false);
    });

    it('Holidays are not business days', () => {
      const holiday = createDate(2024, 12, 25);
      const holidays = [holiday];
      expect(isBusinessDay(holiday, holidays)).toBe(false);
    });
  });
});

describe('Business days in dunning transitions', () => {
  it('Dunning respects weekend exclusion in timeouts', () => {
    const dueDate = createDate(2024, 3, 15);
    
    let state = createDunning(dueDate);
    state = process(state, 'tick', createDate(2024, 3, 8)).state;
    expect(state.status).toBe('DUE_SOON');
    
    state = process(state, 'tick', dueDate).state;
    expect(state.status).toBe('OVERDUE');
    
    const graceEnd = addBusinessDays(state.stateEnteredAt, 3);
    state = process(state, 'tick', graceEnd).state;
    expect(state.status).toBe('GRACE');
  });

  it('Dunning respects custom holidays in timeouts', () => {
    const dueDate = createDate(2024, 3, 15);
    const holiday = createDate(2024, 3, 20);
    const customConfig = {
      holidays: [holiday]
    };
    
    let state = createDunning(dueDate, customConfig);
    state = process(state, 'tick', createDate(2024, 3, 8)).state;
    expect(state.status).toBe('DUE_SOON');
    
    state = process(state, 'tick', dueDate).state;
    expect(state.status).toBe('OVERDUE');
    
    const graceEnd = addBusinessDays(state.stateEnteredAt, 3, [holiday]);
    state = process(state, 'tick', graceEnd).state;
    expect(state.status).toBe('GRACE');
  });
});
