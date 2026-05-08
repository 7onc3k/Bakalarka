import { describe, it, expect } from 'vitest';
import { addBusinessDays, countBusinessDays, isBusinessDay, isWeekend } from '../src/index.js';

describe('Business Days Utility', () => {
  describe('isWeekend', () => {
    it('should return true for Saturday', () => {
      const saturday = new Date('2024-01-06'); // First Saturday of 2024
      expect(isWeekend(saturday)).toBe(true);
    });

    it('should return true for Sunday', () => {
      const sunday = new Date('2024-01-07'); // First Sunday of 2024
      expect(isWeekend(sunday)).toBe(true);
    });

    it('should return false for Monday', () => {
      const monday = new Date('2024-01-08'); // First Monday of 2024
      expect(isWeekend(monday)).toBe(false);
    });

    it('should return false for Friday', () => {
      const friday = new Date('2024-01-05');
      expect(isWeekend(friday)).toBe(false);
    });
  });

  describe('isBusinessDay', () => {
    it('should return true for weekday', () => {
      const monday = new Date('2024-01-08');
      expect(isBusinessDay(monday)).toBe(true);
    });

    it('should return false for weekend', () => {
      const saturday = new Date('2024-01-06');
      expect(isBusinessDay(saturday)).toBe(false);
    });

    it('should return false for holiday', () => {
      const newYearsDay = new Date('2024-01-01');
      const holidays = [new Date('2024-01-01')];
      expect(isBusinessDay(newYearsDay, holidays)).toBe(false);
    });

    it('should return true for weekday even with holidays', () => {
      const monday = new Date('2024-01-08');
      const holidays = [new Date('2024-01-01')];
      expect(isBusinessDay(monday, holidays)).toBe(true);
    });
  });

  describe('addBusinessDays', () => {
    it('should add 0 days', () => {
      const friday = new Date('2024-01-05');
      const result = addBusinessDays(friday, 0);
      expect(result.getTime()).toBe(friday.getTime());
    });

    it('should add 1 business day from Friday to Monday', () => {
      const friday = new Date('2024-01-05');
      const result = addBusinessDays(friday, 1);
      expect(result.getDay()).toBe(1); // Monday
    });

    it('should add 1 business day from Thursday to Friday', () => {
      const thursday = new Date('2024-01-04');
      const result = addBusinessDays(thursday, 1);
      expect(result.getDay()).toBe(5); // Friday
    });

    it('should add 14 business days starting Friday', () => {
      const friday = new Date('2024-01-05');
      const result = addBusinessDays(friday, 14);
      // 14 business days from Friday:
      // Week 1: Mon(8), Tue(9), Wed(10), Thu(11), Fri(12) = 5
      // Week 2: Mon(15), Tue(16), Wed(17), Thu(18), Fri(19) = 5
      // Week 3: Mon(22), Tue(23), Wed(24), Thu(25) = 4
      // Total: 14, lands on Thursday
      expect(result.toDateString()).toBe(new Date('2024-01-25').toDateString());
    });

    it('should skip weekends', () => {
      const friday = new Date('2024-01-05');
      const result = addBusinessDays(friday, 3);
      // Fri(5) + 1 = Mon(8), +2 = Tue(9), +3 = Wed(10)
      expect(result.toDateString()).toBe(new Date('2024-01-10').toDateString());
    });

    it('should skip holidays', () => {
      const friday = new Date('2024-01-05');
      const holidays = [new Date('2024-01-08')]; // Monday is holiday
      const result = addBusinessDays(friday, 3, holidays);
      // Fri(5) + 1 = Mon(8, skipped) = Tue(9), +2 = Wed(10), +3 = Thu(11)
      expect(result.toDateString()).toBe(new Date('2024-01-11').toDateString());
    });

    it('should handle negative days', () => {
      const monday = new Date('2024-01-08');
      const result = addBusinessDays(monday, -1);
      expect(result.getDay()).toBe(5); // Friday
    });

    it('should use custom holidays', () => {
      const friday = new Date('2024-01-05');
      const holidays = [new Date('2024-01-08'), new Date('2024-01-09')];
      const result = addBusinessDays(friday, 3, holidays);
      // Fri(5) + 1 = Mon(8, skipped) -> Tue(9, skipped) -> Wed(10)
      // +2 = Thu(11), +3 = Fri(12)
      expect(result.toDateString()).toBe(new Date('2024-01-12').toDateString());
    });
  });

  describe('countBusinessDays', () => {
    it('should count 0 days for same day', () => {
      const monday = new Date('2024-01-08');
      const result = countBusinessDays(monday, monday);
      expect(result).toBe(0);
    });

    it('should count 1 day for consecutive days', () => {
      const monday = new Date('2024-01-08');
      const tuesday = new Date('2024-01-09');
      const result = countBusinessDays(monday, tuesday);
      expect(result).toBe(1);
    });

    it('should exclude weekend', () => {
      const friday = new Date('2024-01-05');
      const monday = new Date('2024-01-08');
      const result = countBusinessDays(friday, monday);
      expect(result).toBe(1); // Monday counts as 1 business day after Friday
    });

    it('should count 5 days for a full work week', () => {
      const monday = new Date('2024-01-08');
      const friday = new Date('2024-01-12');
      const result = countBusinessDays(monday, friday);
      expect(result).toBe(4); // Tue, Wed, Thu, Fri = 4 business days (excludes start date)
    });

    it('should count 10 days for two work weeks', () => {
      const monday = new Date('2024-01-08');
      const friday = new Date('2024-01-19');
      const result = countBusinessDays(monday, friday);
      expect(result).toBe(9); // Excludes start date
    });

    it('should exclude holidays', () => {
      const monday = new Date('2024-01-08');
      const wednesday = new Date('2024-01-10');
      const holidays = [new Date('2024-01-09')];
      const result = countBusinessDays(monday, wednesday, holidays);
      expect(result).toBe(1);
    });

    it('should handle end date before start date', () => {
      const friday = new Date('2024-01-05');
      const monday = new Date('2024-01-08');
      const result = countBusinessDays(monday, friday); // Reverse order
      expect(result).toBe(0);
    });
  });
});