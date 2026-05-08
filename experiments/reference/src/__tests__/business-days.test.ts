import { describe, it, expect } from "vitest";
import { createInstance, process } from "../index.js";
import type { DunningState } from "../index.js";

function tick(state: DunningState, now: Date) {
  return process(state, { type: "tick" }, now);
}

function businessDaysAfter(from: Date, days: number, holidays: Date[] = []): Date {
  const result = new Date(from);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    const isHoliday = holidays.some(
      (h) => h.toDateString() === result.toDateString()
    );
    if (day !== 0 && day !== 6 && !isHoliday) added++;
  }
  return result;
}

describe("Business days calculation — backward (DUE_SOON)", () => {
  it("weekends are excluded from timeout calculation", () => {
    // Due date: Friday 2025-03-14
    // 7 business days before = Thursday 2025-03-05
    const dueDate = new Date("2025-03-14");
    const instance = createInstance(dueDate);

    // Tuesday 2025-03-04 — 8 business days before, should NOT trigger
    const tooEarly = new Date("2025-03-04");
    const noTransition = tick(instance, tooEarly);
    expect(noTransition.state.status).toBe("ISSUED");

    // Thursday 2025-03-05 — exactly 7 business days before
    const sevenBdBefore = new Date("2025-03-05");
    const result = tick(instance, sevenBdBefore);
    expect(result.state.status).toBe("DUE_SOON");
  });

  it("public holidays are excluded from timeout calculation", () => {
    // Due date: Wednesday 2025-03-12
    // Normal: 7 business days before = Monday 2025-03-03
    // With holiday on 2025-03-03: should be Friday 2025-02-28
    const dueDate = new Date("2025-03-12");
    const instance = createInstance(dueDate, {
      holidays: [new Date("2025-03-03")],
    });

    const withHoliday = new Date("2025-02-28");
    const result = tick(instance, withHoliday);
    expect(result.state.status).toBe("DUE_SOON");
  });

  it("custom holiday calendar is used for business day calculations", () => {
    const dueDate = new Date("2025-03-12");
    const instance = createInstance(dueDate, {
      holidays: [new Date("2025-03-04"), new Date("2025-03-05")],
    });

    const withHolidays = new Date("2025-02-27");
    const result = tick(instance, withHolidays);
    expect(result.state.status).toBe("DUE_SOON");
  });
});

describe("Business days calculation — forward (escalation timeouts)", () => {
  it("escalation timeout excludes weekends", () => {
    // OVERDUE → GRACE: 3 business days
    // Due date: Wednesday 2025-03-12, enter OVERDUE on due date
    const dueDate = new Date("2025-03-12");
    const instance = createInstance(dueDate);
    const dueSoon = tick(instance, new Date("2025-03-03")).state;
    const overdue = tick(dueSoon, dueDate).state;

    // 3 business days after Wed 2025-03-12 = Mon 2025-03-17
    // (Thu 13, Fri 14, skip Sat+Sun, Mon 17)
    const threeBd = businessDaysAfter(dueDate, 3);
    const result = tick(overdue, threeBd);
    expect(result.state.status).toBe("GRACE");

    // 1 day before should still be OVERDUE
    const oneDayBefore = new Date(threeBd);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    const tooEarly = tick(overdue, oneDayBefore);
    expect(tooEarly.state.status).toBe("OVERDUE");
  });

  it("escalation timeout excludes holidays", () => {
    // OVERDUE → GRACE: 3 business days, with a holiday
    const holidays = [new Date("2025-03-13")];
    const dueDate = new Date("2025-03-12");
    const instance = createInstance(dueDate, { holidays });
    const dueSoon = tick(instance, new Date("2025-03-03")).state;
    const overdue = tick(dueSoon, dueDate).state;

    // 3 business days after Wed 2025-03-12, skipping holiday Thu 2025-03-13:
    // Fri 14 (1bd), skip Sat+Sun, Mon 17 (2bd), Tue 18 (3bd)
    const threeBdWithHoliday = businessDaysAfter(dueDate, 3, holidays);
    const result = tick(overdue, threeBdWithHoliday);
    expect(result.state.status).toBe("GRACE");

    // Without the holiday it would be Mon 2025-03-17 — with holiday, should still be OVERDUE
    const withoutHoliday = businessDaysAfter(dueDate, 3);
    const tooEarly = tick(overdue, withoutHoliday);
    expect(tooEarly.state.status).toBe("OVERDUE");
  });
});
