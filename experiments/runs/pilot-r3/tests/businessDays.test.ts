import { describe, it, expect } from 'vitest';
import { addBusinessDays, businessDaysBetween, isBusinessDay, isHoliday } from '../src/businessDays.js';

describe('Business Days Calculation', () => {
  const defaultHolidays: Date[] = [];

  describe('isBusinessDay', () => {
    it('should return true for Monday', () => {
      const monday = new Date('2024-01-08'); // Monday
      expect(isBusinessDay(monday, defaultHolidays)).toBe(true);
    });

    it('should return false for Saturday', () => {
      const saturday = new Date('2024-01-06'); // Saturday
      expect(isBusinessDay(saturday, defaultHolidays)).toBe(false);
    });

    it('should return false for Sunday', () => {
      const sunday = new Date('2024-01-07'); // Sunday
      expect(isBusinessDay(sunday, defaultHolidays)).toBe(false);
    });
  });

  describe('isHoliday', () => {
    it('should return false when no holidays configured', () => {
      const monday = new Date('2024-01-08');
      expect(isHoliday(monday, defaultHolidays)).toBe(false);
    });

    it('should return true for a holiday date', () => {
      const holidays = [new Date('2024-01-01')];
      const newYearsDay = new Date('2024-01-01');
      expect(isHoliday(newYearsDay, holidays)).toBe(true);
    });

    it('should handle holiday at start of day', () => {
      const holidays = [new Date('2024-07-04')];
      const july4 = new Date('2024-07-04T10:30:00');
      expect(isHoliday(july4, holidays)).toBe(true);
    });
  });

  describe('addBusinessDays', () => {
    it('should add 0 business days returns same day', () => {
      const friday = new Date('2024-01-05'); // Friday
      const result = addBusinessDays(friday, 0, defaultHolidays);
      expect(result.getTime()).toBe(friday.getTime());
    });

    it('should add 1 business day from Friday to Monday', () => {
      const friday = new Date('2024-01-05'); // Friday
      const result = addBusinessDays(friday, 1, defaultHolidays);
      const expected = new Date('2024-01-08'); // Monday
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should add 1 business day from Thursday to Friday', () => {
      const thursday = new Date('2024-01-04'); // Thursday
      const result = addBusinessDays(thursday, 1, defaultHolidays);
      const expected = new Date('2024-01-05'); // Friday
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should add 3 business days skipping weekend', () => {
      const friday = new Date('2024-01-05'); // Friday
      const result = addBusinessDays(friday, 3, defaultHolidays);
      const expected = new Date('2024-01-10'); // Wednesday
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should add 7 business days', () => {
      const monday = new Date('2024-01-08'); // Monday
      const result = addBusinessDays(monday, 7, defaultHolidays);
      const expected = new Date('2024-01-17'); // Wednesday (7 business days after Monday)
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should skip holidays in count', () => {
      const holidays = [new Date('2024-01-15')]; // Monday is a holiday
      const friday = new Date('2024-01-12'); // Friday
      const result = addBusinessDays(friday, 1, holidays);
      const expected = new Date('2024-01-16'); // Tuesday (skip Monday holiday)
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should skip multiple holidays', () => {
      const holidays = [
        new Date('2024-01-15'),
        new Date('2024-01-16'),
      ]; // Monday and Tuesday are holidays
      const friday = new Date('2024-01-12'); // Friday
      const result = addBusinessDays(friday, 1, holidays);
      const expected = new Date('2024-01-17'); // Wednesday
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should handle single day timeout before due date (negative)', () => {
      const monday = new Date('2024-01-08'); // Monday
      const result = addBusinessDays(monday, -1, defaultHolidays);
      const expected = new Date('2024-01-05'); // Friday
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should handle negative business days across weekend', () => {
      const monday = new Date('2024-01-08'); // Monday
      const result = addBusinessDays(monday, -3, defaultHolidays);
      const expected = new Date('2024-01-03'); // Wednesday
      expect(result.toDateString()).toBe(expected.toDateString());
    });
  });

  describe('businessDaysBetween', () => {
    it('should return 0 for same day', () => {
      const monday = new Date('2024-01-08');
      expect(businessDaysBetween(monday, monday, defaultHolidays)).toBe(0);
    });

    it('should return 1 for Friday to Monday', () => {
      const friday = new Date('2024-01-05');
      const monday = new Date('2024-01-08');
      expect(businessDaysBetween(friday, monday, defaultHolidays)).toBe(1);
    });

    it('should return 3 for Friday to Wednesday (across weekend)', () => {
      const friday = new Date('2024-01-05');
      const wednesday = new Date('2024-01-10');
      expect(businessDaysBetween(friday, wednesday, defaultHolidays)).toBe(3);
    });

    it('should exclude holidays', () => {
      const holidays = [new Date('2024-01-15')];
      const friday = new Date('2024-01-12');
      const tuesday = new Date('2024-01-16');
      expect(businessDaysBetween(friday, tuesday, holidays)).toBe(1);
    });

    it('should handle negative (start > end)', () => {
      const monday = new Date('2024-01-08');
      const friday = new Date('2024-01-05');
      expect(businessDaysBetween(monday, friday, defaultHolidays)).toBe(-1);
    });
  });
});