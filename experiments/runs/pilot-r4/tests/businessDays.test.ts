import { describe, it, expect } from 'vitest';
import { addBusinessDays, countBusinessDays, isBusinessDay } from '../src/utils/businessDays.js';

describe('businessDays', () => {
  describe('addBusinessDays', () => {
    it('should add 0 business days to return same date', () => {
      const friday = new Date('2026-01-09'); // Friday
      const result = addBusinessDays(friday, 0);
      expect(result.getTime()).toBe(friday.getTime());
    });

    it('should add 1 business day skipping weekend', () => {
      const friday = new Date('2026-01-09'); // Friday
      const result = addBusinessDays(friday, 1);
      // Should be Monday (Jan 12)
      expect(result.getDay()).toBe(1); // Monday
    });

    it('should add 3 business days skipping weekend', () => {
      const friday = new Date('2026-01-09'); // Friday
      const result = addBusinessDays(friday, 3);
      // Friday + 1 = Monday, + 2 = Tuesday, + 3 = Wednesday
      expect(result.getDay()).toBe(3); // Wednesday
    });

    it('should exclude holidays from business day count', () => {
      const monday = new Date('2026-01-12'); // Monday
      const holidays = [new Date('2026-01-13')]; // Tuesday is a holiday
      const result = addBusinessDays(monday, 1, holidays);
      // Monday + 1 = Tuesday (holiday, skipped) = Wednesday
      expect(result.getDay()).toBe(3); // Wednesday
    });

    it('should use default empty holidays array', () => {
      const friday = new Date('2026-01-09');
      const result = addBusinessDays(friday, 1);
      expect(result.getDay()).toBe(1); // Monday
    });
  });

  describe('countBusinessDays', () => {
    it('should count 0 business days for same day', () => {
      const monday = new Date('2026-01-12');
      const result = countBusinessDays(monday, monday);
      expect(result).toBe(0);
    });

    it('should count business days between Monday and Friday', () => {
      const monday = new Date('2026-01-12');
      const friday = new Date('2026-01-16');
      const result = countBusinessDays(monday, friday);
      expect(result).toBe(4); // Mon, Tue, Wed, Thu (not including Friday)
    });

    it('should count business days from Saturday to Monday as 0', () => {
      const saturday = new Date('2026-01-10');
      const monday = new Date('2026-01-12');
      const result = countBusinessDays(saturday, monday);
      expect(result).toBe(0); // Saturday is not a business day, skipped; Sunday excluded; Monday is end (exclusive)
    });

    it('should count 1 business day from Friday to Monday', () => {
      const friday = new Date('2026-01-09');
      const monday = new Date('2026-01-12');
      const result = countBusinessDays(friday, monday);
      expect(result).toBe(1); // Friday is a business day and is included
    });

    it('should exclude holidays', () => {
      const monday = new Date('2026-01-12');
      const wednesday = new Date('2026-01-14');
      const holidays = [new Date('2026-01-13')]; // Tuesday is holiday
      const result = countBusinessDays(monday, wednesday, holidays);
      expect(result).toBe(1); // Only Monday (Tuesday is holiday)
    });
  });

  describe('isBusinessDay', () => {
    it('should return true for Monday', () => {
      const monday = new Date('2026-01-12');
      expect(isBusinessDay(monday)).toBe(true);
    });

    it('should return false for Saturday', () => {
      const saturday = new Date('2026-01-10');
      expect(isBusinessDay(saturday)).toBe(false);
    });

    it('should return false for Sunday', () => {
      const sunday = new Date('2026-01-11');
      expect(isBusinessDay(sunday)).toBe(false);
    });

    it('should return false for holiday', () => {
      const tuesday = new Date('2026-01-13');
      const holidays = [new Date('2026-01-13')];
      expect(isBusinessDay(tuesday, holidays)).toBe(false);
    });

    it('should return true for non-holiday weekday', () => {
      const tuesday = new Date('2026-01-13');
      const holidays = [new Date('2026-01-14')]; // Wednesday is holiday
      expect(isBusinessDay(tuesday, holidays)).toBe(true);
    });
  });
});