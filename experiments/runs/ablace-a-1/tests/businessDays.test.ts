import { describe, it, expect } from 'vitest';
import { isBusinessDay, addBusinessDays } from '../src/businessDays.js';

describe('Business days calculator', () => {
  describe('isBusinessDay', () => {
    it('should return true for Monday', () => {
      const monday = new Date('2024-01-08'); // First Monday of 2024
      expect(isBusinessDay(monday)).toBe(true);
    });

    it('should return true for Tuesday', () => {
      const tuesday = new Date('2024-01-09');
      expect(isBusinessDay(tuesday)).toBe(true);
    });

    it('should return true for Wednesday', () => {
      const wednesday = new Date('2024-01-10');
      expect(isBusinessDay(wednesday)).toBe(true);
    });

    it('should return true for Thursday', () => {
      const thursday = new Date('2024-01-11');
      expect(isBusinessDay(thursday)).toBe(true);
    });

    it('should return true for Friday', () => {
      const friday = new Date('2024-01-12');
      expect(isBusinessDay(friday)).toBe(true);
    });

    it('should return false for Saturday', () => {
      const saturday = new Date('2024-01-13');
      expect(isBusinessDay(saturday)).toBe(false);
    });

    it('should return false for Sunday', () => {
      const sunday = new Date('2024-01-14');
      expect(isBusinessDay(sunday)).toBe(false);
    });

    it('should return false for holiday', () => {
      const newYearsDay = new Date('2024-01-01');
      expect(isBusinessDay(newYearsDay, [newYearsDay])).toBe(false);
    });
  });

  describe('addBusinessDays', () => {
    it('should add 0 business days', () => {
      const friday = new Date('2024-01-12');
      const result = addBusinessDays(friday, 0);
      expect(result.getTime()).toBe(friday.getTime());
    });

    it('should add 1 business day from Friday to Monday', () => {
      const friday = new Date('2024-01-12');
      const result = addBusinessDays(friday, 1);
      const expected = new Date('2024-01-15'); // Next Monday
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should add 1 business day from Thursday to Friday', () => {
      const thursday = new Date('2024-01-11');
      const result = addBusinessDays(thursday, 1);
      const expected = new Date('2024-01-12'); // Friday
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should add 5 business days from Monday to Monday', () => {
      const monday = new Date('2024-01-08');
      const result = addBusinessDays(monday, 5);
      const expected = new Date('2024-01-15'); // Next Monday
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should skip weekend when adding 3 business days from Friday', () => {
      const friday = new Date('2024-01-12');
      const result = addBusinessDays(friday, 3);
      // Friday + 3 business days = Wednesday (Sat, Sun skipped)
      const expected = new Date('2024-01-17');
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should skip holiday when adding business days', () => {
      const friday = new Date('2024-01-12');
      const holiday = new Date('2024-01-15'); // Monday (MLK day)
      const result = addBusinessDays(friday, 1, [holiday]);
      // Friday + 1 business day, but Monday is holiday, so Tuesday
      const expected = new Date('2024-01-16');
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should use custom holidays', () => {
      const monday = new Date('2024-01-08');
      const customHoliday = new Date('2024-01-09'); // Tuesday
      const result = addBusinessDays(monday, 1, [customHoliday]);
      // Monday + 1 business day, but Tuesday is holiday, so Wednesday
      const expected = new Date('2024-01-10');
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it('should handle 14 business days starting on Friday', () => {
      const friday = new Date('2024-01-12');
      const result = addBusinessDays(friday, 14);
      // 14 business days from Friday = 3 weeks later (excluding 4 weekend days)
      // Jan 12 (Fri) + 14 business days = Feb 1 (Thu)
      const expected = new Date('2024-02-01');
      expect(result.toDateString()).toBe(expected.toDateString());
    });
  });
});