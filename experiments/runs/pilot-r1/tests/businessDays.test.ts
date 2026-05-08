import { describe, it, expect } from "vitest";
import {
  isBusinessDay,
  addBusinessDays,
  businessDaysBetween,
  getTargetDate,
} from "../src/businessDays";

describe("Business Days", () => {
  describe("isBusinessDay", () => {
    it("should return true for Monday", () => {
      const monday = new Date("2024-11-04");
      expect(isBusinessDay(monday)).toBe(true);
    });

    it("should return false for Saturday", () => {
      const saturday = new Date("2024-11-02");
      expect(isBusinessDay(saturday)).toBe(false);
    });

    it("should return false for Sunday", () => {
      const sunday = new Date("2024-11-03");
      expect(isBusinessDay(sunday)).toBe(false);
    });

    it("should exclude custom holidays", () => {
      const christmas = new Date("2024-12-25");
      expect(isBusinessDay(christmas, [christmas])).toBe(false);
    });

    it("should include regular weekdays", () => {
      const tuesday = new Date("2024-11-05");
      const wednesday = new Date("2024-11-06");
      const thursday = new Date("2024-11-07");
      const friday = new Date("2024-11-08");

      expect(isBusinessDay(tuesday)).toBe(true);
      expect(isBusinessDay(wednesday)).toBe(true);
      expect(isBusinessDay(thursday)).toBe(true);
      expect(isBusinessDay(friday)).toBe(true);
    });
  });

  describe("addBusinessDays", () => {
    it("should add 0 days to Friday and return Friday", () => {
      const friday = new Date("2024-11-01");
      const result = addBusinessDays(friday, 0);
      expect(result.getDay()).toBe(5);
    });

    it("should add 1 business day from Friday to Monday", () => {
      const friday = new Date("2024-11-01");
      const result = addBusinessDays(friday, 1);
      expect(result.getDay()).toBe(1);
    });

    it("should add 14 business days starting Friday excluding weekend", () => {
      const friday = new Date("2024-11-01");
      const result = addBusinessDays(friday, 14);

      const startKey = friday.toISOString().split("T")[0];
      const endKey = result.toISOString().split("T")[0];

      let businessDays = 0;
      const current = new Date(friday);
      while (current < result) {
        current.setDate(current.getDate() + 1);
        if (current.getDay() !== 0 && current.getDay() !== 6) {
          businessDays++;
        }
      }

      expect(businessDays).toBe(14);
    });

    it("should exclude holidays from count", () => {
      const friday = new Date("2024-11-01");
      const holiday = new Date("2024-11-04");
      const result = addBusinessDays(friday, 1, [holiday]);

      expect(result.getDay()).toBe(2);
    });

    it("should handle negative days for subtracting business days", () => {
      const monday = new Date("2024-11-04");
      const result = addBusinessDays(monday, -2);
      expect(result.getDay()).toBe(4);
    });
  });

  describe("businessDaysBetween", () => {
    it("should return 0 for same date", () => {
      const monday = new Date("2024-11-04");
      expect(businessDaysBetween(monday, monday)).toBe(0);
    });

    it("should return 1 business day from Friday to Monday", () => {
      const friday = new Date("2024-11-01");
      const monday = new Date("2024-11-04");
      expect(businessDaysBetween(friday, monday)).toBe(1);
    });

    it("should exclude weekends", () => {
      const wednesday = new Date("2024-11-06");
      const nextWednesday = new Date("2024-11-13");
      expect(businessDaysBetween(wednesday, nextWednesday)).toBe(5);
    });

    it("should exclude holidays from count", () => {
      const monday = new Date("2024-11-04");
      const tuesday = new Date("2024-11-05");
      const holiday = new Date("2024-11-04");
      expect(businessDaysBetween(monday, tuesday, [holiday])).toBe(1);
    });

    it("should return 0 when end is before start", () => {
      const monday = new Date("2024-11-04");
      const friday = new Date("2024-11-01");
      expect(businessDaysBetween(monday, friday)).toBe(0);
    });
  });

  describe("getTargetDate", () => {
    it("should return same date for 0 business days", () => {
      const friday = new Date("2024-11-01");
      const result = getTargetDate(friday, 0);
      expect(dateToYMD(result)).toBe(dateToYMD(friday));
    });

    it("should calculate correct target date for 7 business days", () => {
      const friday = new Date("2024-11-01");
      const result = getTargetDate(friday, 7);

      let businessDays = 0;
      const current = new Date(friday);
      while (current < result) {
        current.setDate(current.getDate() + 1);
        if (current.getDay() !== 0 && current.getDay() !== 6) {
          businessDays++;
        }
      }

      expect(businessDays).toBe(7);
    });

    it("should handle custom holidays in target date calculation", () => {
      const friday = new Date("2024-11-01");
      const mondayHoliday = new Date("2024-11-04");
      const result = getTargetDate(friday, 1, [mondayHoliday]);

      expect(result.getDay()).toBe(2);
    });
  });
});

function dateToYMD(date: Date): string {
  return date.toISOString().split("T")[0];
}
