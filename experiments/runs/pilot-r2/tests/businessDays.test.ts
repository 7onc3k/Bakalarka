import { describe, it, expect } from 'vitest';
import { addBusinessDays, getBusinessDaysBetween, isBusinessDay, normalize } from '../src/businessDays.js';

describe('Business Days Utility', () => {
  describe('addBusinessDays', () => {
    it('should add 0 business days', () => {
      const start = new Date('2024-01-01'); // Monday
      const result = addBusinessDays(start, 0);
      expect(result.getDate()).toBe(1);
    });

    it('should add 1 business day to Monday', () => {
      const start = new Date('2024-01-01'); // Monday
      const result = addBusinessDays(start, 1);
      expect(result.getDate()).toBe(2); // Tuesday
    });

    it('should skip weekend when adding business days', () => {
      const friday = new Date('2024-01-05'); // Friday
      const result = addBusinessDays(friday, 1);
      expect(result.getDate()).toBe(8); // Next Monday
    });

    it('should skip entire weekend when adding multiple days', () => {
      const friday = new Date('2024-01-05'); // Friday
      const result = addBusinessDays(friday, 3);
      expect(result.getDate()).toBe(10); // Wednesday
    });

    it('should handle starting on Saturday', () => {
      const saturday = new Date('2024-01-06'); // Saturday
      const result = addBusinessDays(saturday, 1);
      expect(result.getDate()).toBe(8); // Monday
    });

    it('should handle starting on Sunday', () => {
      const sunday = new Date('2024-01-07'); // Sunday
      const result = addBusinessDays(sunday, 1);
      expect(result.getDate()).toBe(8); // Monday
    });
  });

  describe('addBusinessDays with holidays', () => {
    it('should skip holidays', () => {
      const monday = new Date('2024-01-01'); // Monday
      const holidays = [new Date('2024-01-02')]; // Tuesday is a holiday
      const result = addBusinessDays(monday, 1, holidays);
      expect(result.getDate()).toBe(3); // Wednesday
    });

    it('should skip multiple holidays', () => {
      const monday = new Date('2024-01-01'); // Monday
      const holidays = [
        new Date('2024-01-02'), // Tuesday
        new Date('2024-01-03')  // Wednesday
      ];
      const result = addBusinessDays(monday, 1, holidays);
      expect(result.getDate()).toBe(4); // Thursday
    });

    it('should skip holiday on Friday and not double-count weekend', () => {
      const thursday = new Date('2024-01-04'); // Thursday
      const holidays = [new Date('2024-01-05')]; // Friday is a holiday
      const result = addBusinessDays(thursday, 1, holidays);
      expect(result.getDate()).toBe(8); // Monday
    });
  });

  describe('getBusinessDaysBetween', () => {
    it('should return 0 for same day', () => {
      const date = new Date('2024-01-01');
      const result = getBusinessDaysBetween(date, date);
      expect(result).toBe(0);
    });

    it('should count 1 business day between Monday and Tuesday', () => {
      const monday = new Date('2024-01-01');
      const tuesday = new Date('2024-01-02');
      const result = getBusinessDaysBetween(monday, tuesday);
      expect(result).toBe(1);
    });

    it('should exclude weekend in count', () => {
      const friday = new Date('2024-01-05');
      const monday = new Date('2024-01-08');
      const result = getBusinessDaysBetween(friday, monday);
      expect(result).toBe(1); // Only counts Monday
    });

    it('should count full week as 5 days', () => {
      const monday = new Date('2024-01-01');
      const nextMonday = new Date('2024-01-08');
      const result = getBusinessDaysBetween(monday, nextMonday);
      expect(result).toBe(5);
    });
  });

  describe('getBusinessDaysBetween with holidays', () => {
    it('should exclude holidays from count', () => {
      const monday = new Date('2024-01-01');
      const wednesday = new Date('2024-01-03');
      const holidays = [new Date('2024-01-02')]; // Tuesday is a holiday
      const result = getBusinessDaysBetween(monday, wednesday, holidays);
      expect(result).toBe(1); // Only Monday counts
    });
  });

  describe('isBusinessDay', () => {
    it('should return true for Monday', () => {
      const monday = new Date('2024-01-01');
      expect(isBusinessDay(monday)).toBe(true);
    });

    it('should return false for Saturday', () => {
      const saturday = new Date('2024-01-06');
      expect(isBusinessDay(saturday)).toBe(false);
    });

    it('should return false for Sunday', () => {
      const sunday = new Date('2024-01-07');
      expect(isBusinessDay(sunday)).toBe(false);
    });

    it('should return false for holiday', () => {
      const monday = new Date('2024-01-01');
      const holidays = [new Date('2024-01-01')];
      expect(isBusinessDay(monday, holidays)).toBe(false);
    });
  });

  describe('normalize', () => {
    it('should normalize to midnight UTC', () => {
      const date = new Date('2024-01-01T15:30:00');
      const normalized = normalize(date);
      expect(normalized.getUTCHours()).toBe(0);
      expect(normalized.getUTCMinutes()).toBe(0);
      expect(normalized.getUTCSeconds()).toBe(0);
      expect(normalized.getUTCMilliseconds()).toBe(0);
    });
  });
});