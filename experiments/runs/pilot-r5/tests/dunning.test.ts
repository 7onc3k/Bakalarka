import { describe, it, expect, beforeEach } from "vitest";
import {
  createInstance,
  process,
  DunningState,
  DunningEvent,
  DunningStatus,
  ProcessResult,
  createHolidaySet,
  addBusinessDays,
} from "../src/index.js";

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addSimpleBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }
  result.setHours(0, 0, 0, 0);
  return result;
}

describe("createInstance", () => {
  it("should create a dunning instance in ISSUED state", () => {
    const dueDate = new Date("2024-01-15");
    const state = createInstance(dueDate);
    
    expect(state.status).toBe("ISSUED");
    expect(state.dueDate.toISOString()).toBe("2024-01-15T00:00:00.000Z");
    expect(state.stateEnteredAt).toBeInstanceOf(Date);
    expect(state.config).toBeDefined();
  });

  it("should accept custom config", () => {
    const dueDate = new Date("2024-01-15");
    const customHolidays = [new Date("2024-01-01")];
    const state = createInstance(dueDate, {
      holidays: customHolidays,
      timeouts: { GRACE: 5 },
    });
    
    expect(state.config.holidays).toEqual(customHolidays);
    expect(state.config.timeouts?.GRACE).toBe(5);
  });
});

describe("Time-based transitions - happy path escalation", () => {
  describe("ISSUED -> DUE_SOON", () => {
    it("should transition to DUE_SOON 7 business days before due date", () => {
      const dueDate = new Date("2024-01-15");
      const state = createInstance(dueDate);
      
      const now = addSimpleBusinessDays(dueDate, -7);
      const result = process(state, { type: "tick" }, now);
      
      expect(result.state.status).toBe("DUE_SOON");
      expect(result.actions).toContainEqual({
        type: "send_email",
        template: "due_soon_reminder",
      });
    });
  });

  describe("DUE_SOON -> OVERDUE", () => {
    it("should transition to OVERDUE when due date is reached", () => {
      const dueDate = new Date("2024-01-15");
      const state = createInstance(dueDate);
      
      const stateEnteredAt = addSimpleBusinessDays(dueDate, -7);
      const currentState: DunningState = {
        ...state,
        status: "DUE_SOON",
        stateEnteredAt,
      };
      
      const now = new Date(dueDate);
      const result = process(currentState, { type: "tick" }, now);
      
      expect(result.state.status).toBe("OVERDUE");
      expect(result.actions).toHaveLength(0);
    });
  });

  describe("OVERDUE -> GRACE", () => {
    it("should transition to GRACE after 3 business days", () => {
      const dueDate = new Date("2024-01-15");
      const state: DunningState = {
        ...createInstance(dueDate),
        status: "OVERDUE",
        stateEnteredAt: dueDate,
      };
      
      const now = addSimpleBusinessDays(dueDate, 3);
      const result = process(state, { type: "tick" }, now);
      
      expect(result.state.status).toBe("GRACE");
      expect(result.actions).toHaveLength(0);
    });
  });

  describe("GRACE -> REMINDER_1", () => {
    it("should transition to REMINDER_1 after 7 business days", () => {
      const dueDate = new Date("2024-01-15");
      const state: DunningState = {
        ...createInstance(dueDate),
        status: "GRACE",
        stateEnteredAt: dueDate,
      };
      
      const now = addSimpleBusinessDays(dueDate, 7);
      const result = process(state, { type: "tick" }, now);
      
      expect(result.state.status).toBe("REMINDER_1");
      expect(result.actions).toContainEqual({
        type: "send_email",
        template: "first_reminder",
      });
    });
  });

  describe("REMINDER_1 -> REMINDER_2", () => {
    it("should transition to REMINDER_2 after 14 business days", () => {
      const dueDate = new Date("2024-01-15");
      const graceDate = addSimpleBusinessDays(dueDate, 7);
      const state: DunningState = {
        ...createInstance(dueDate),
        status: "REMINDER_1",
        stateEnteredAt: graceDate,
      };
      
      const now = addSimpleBusinessDays(graceDate, 14);
      const result = process(state, { type: "tick" }, now);
      
      expect(result.state.status).toBe("REMINDER_2");
      expect(result.actions).toContainEqual({
        type: "send_email",
        template: "second_reminder",
      });
    });
  });

  describe("REMINDER_2 -> FINAL_NOTICE", () => {
    it("should transition to FINAL_NOTICE after 14 business days", () => {
      const dueDate = new Date("2024-01-15");
      const reminder1Date = addSimpleBusinessDays(addSimpleBusinessDays(dueDate, 7), 14);
      const state: DunningState = {
        ...createInstance(dueDate),
        status: "REMINDER_2",
        stateEnteredAt: reminder1Date,
      };
      
      const now = addSimpleBusinessDays(reminder1Date, 14);
      const result = process(state, { type: "tick" }, now);
      
      expect(result.state.status).toBe("FINAL_NOTICE");
      expect(result.actions).toContainEqual({
        type: "send_email",
        template: "final_warning",
      });
    });
  });

  describe("FINAL_NOTICE -> SUSPENDED", () => {
    it("should transition to SUSPENDED after 7 business days", () => {
      const dueDate = new Date("2024-01-15");
      const reminder2Date = addSimpleBusinessDays(
        addSimpleBusinessDays(addSimpleBusinessDays(dueDate, 7), 14),
        14
      );
      const state: DunningState = {
        ...createInstance(dueDate),
        status: "FINAL_NOTICE",
        stateEnteredAt: reminder2Date,
      };
      
      const now = addSimpleBusinessDays(reminder2Date, 7);
      const result = process(state, { type: "tick" }, now);
      
      expect(result.state.status).toBe("SUSPENDED");
      expect(result.actions).toContainEqual({ type: "suspend_service" });
      expect(result.actions).toContainEqual({
        type: "send_email",
        template: "service_suspended",
      });
    });
  });

  describe("SUSPENDED -> WRITTEN_OFF", () => {
    it("should transition to WRITTEN_OFF after 30 business days", () => {
      const dueDate = new Date("2024-01-15");
      const suspendedDate = addSimpleBusinessDays(
        addSimpleBusinessDays(
          addSimpleBusinessDays(addSimpleBusinessDays(addSimpleBusinessDays(dueDate, 7), 14), 14),
          7
        ),
        0
      );
      const state: DunningState = {
        ...createInstance(dueDate),
        status: "SUSPENDED",
        stateEnteredAt: suspendedDate,
      };
      
      const now = addSimpleBusinessDays(suspendedDate, 30);
      const result = process(state, { type: "tick" }, now);
      
      expect(result.state.status).toBe("WRITTEN_OFF");
      expect(result.actions).toContainEqual({
        type: "send_email",
        template: "written_off_notice",
      });
    });
  });
});

describe("Payment (resolves dunning at any point)", () => {
  it("should transition to PAID from any active state", () => {
    const dueDate = new Date("2024-01-15");
    const activeStates: DunningStatus[] = [
      "ISSUED",
      "DUE_SOON",
      "OVERDUE",
      "GRACE",
      "REMINDER_1",
      "REMINDER_2",
      "FINAL_NOTICE",
      "SUSPENDED",
    ];
    
    for (const status of activeStates) {
      const state: DunningState = {
        ...createInstance(dueDate),
        status,
        stateEnteredAt: new Date(),
      };
      
      const result = process(state, { type: "payment_received" }, new Date());
      
      expect(result.state.status).toBe("PAID");
    }
  });

  it("should return resume_service action when payment received from SUSPENDED", () => {
    const dueDate = new Date("2024-01-15");
    const state: DunningState = {
      ...createInstance(dueDate),
      status: "SUSPENDED",
      stateEnteredAt: new Date(),
    };
    
    const result = process(state, { type: "payment_received" }, new Date());
    
    expect(result.state.status).toBe("PAID");
    expect(result.actions).toContainEqual({ type: "resume_service" });
  });
});

describe("Terminal states", () => {
  const terminalStates: DunningStatus[] = ["PAID", "WRITTEN_OFF", "CANCELLED"];
  
  it("should not transition from PAID state", () => {
    const dueDate = new Date("2024-01-15");
    const state: DunningState = {
      ...createInstance(dueDate),
      status: "PAID",
      stateEnteredAt: new Date(),
    };
    
    const result = process(state, { type: "tick" }, new Date());
    expect(result.state.status).toBe("PAID");
  });

  it("should not transition from WRITTEN_OFF state", () => {
    const dueDate = new Date("2024-01-15");
    const state: DunningState = {
      ...createInstance(dueDate),
      status: "WRITTEN_OFF",
      stateEnteredAt: new Date(),
    };
    
    const result = process(state, { type: "tick" }, new Date());
    expect(result.state.status).toBe("WRITTEN_OFF");
  });

  it("should not transition from CANCELLED state", () => {
    const dueDate = new Date("2024-01-15");
    const state: DunningState = {
      ...createInstance(dueDate),
      status: "CANCELLED",
      stateEnteredAt: new Date(),
    };
    
    const result = process(state, { type: "tick" }, new Date());
    expect(result.state.status).toBe("CANCELLED");
  });
});

describe("Invoice cancellation", () => {
  it("should transition to CANCELLED from any active state", () => {
    const dueDate = new Date("2024-01-15");
    const activeStates: DunningStatus[] = [
      "ISSUED",
      "DUE_SOON",
      "OVERDUE",
      "GRACE",
      "REMINDER_1",
      "REMINDER_2",
      "FINAL_NOTICE",
      "SUSPENDED",
    ];
    
    for (const status of activeStates) {
      const state: DunningState = {
        ...createInstance(dueDate),
        status,
        stateEnteredAt: new Date(),
      };
      
      const result = process(state, { type: "invoice_cancelled" }, new Date());
      
      expect(result.state.status).toBe("CANCELLED");
    }
  });

  it("should return resume_service when cancelling from SUSPENDED", () => {
    const dueDate = new Date("2024-01-15");
    const state: DunningState = {
      ...createInstance(dueDate),
      status: "SUSPENDED",
      stateEnteredAt: new Date(),
    };
    
    const result = process(state, { type: "invoice_cancelled" }, new Date());
    
    expect(result.state.status).toBe("CANCELLED");
    expect(result.actions).toContainEqual({ type: "resume_service" });
  });
});

describe("Pause / Resume (manual override)", () => {
  it("should transition to PAUSED from active dunning states", () => {
    const dueDate = new Date("2024-01-15");
    const activeStates: DunningStatus[] = [
      "OVERDUE",
      "GRACE",
      "REMINDER_1",
      "REMINDER_2",
      "FINAL_NOTICE",
      "SUSPENDED",
    ];
    
    for (const status of activeStates) {
      const state: DunningState = {
        ...createInstance(dueDate),
        status,
        stateEnteredAt: new Date(),
      };
      
      const result = process(state, { type: "dunning_paused" }, new Date());
      
      expect(result.state.status).toBe("PAUSED");
      expect(result.state.pausedFrom).toBe(status);
      expect(result.state.pausedElapsed).toBeGreaterThanOrEqual(0);
    }
  });

  it("should resume to previous state on dunning_resumed", () => {
    const dueDate = new Date("2024-01-15");
    const state: DunningState = {
      ...createInstance(dueDate),
      status: "PAUSED",
      pausedFrom: "OVERDUE",
      pausedElapsed: 2,
      stateEnteredAt: new Date(),
    };
    
    const result = process(state, { type: "dunning_resumed" }, new Date());
    
    expect(result.state.status).toBe("OVERDUE");
    expect(result.state.pausedFrom).toBeUndefined();
    expect(result.state.pausedElapsed).toBeUndefined();
  });

  it("should prioritize payment over pause state", () => {
    const dueDate = new Date("2024-01-15");
    const state: DunningState = {
      ...createInstance(dueDate),
      status: "PAUSED",
      pausedFrom: "OVERDUE",
      pausedElapsed: 2,
      stateEnteredAt: new Date(),
    };
    
    const result = process(state, { type: "payment_received" }, new Date());
    
    expect(result.state.status).toBe("PAID");
  });

  it("should allow cancellation from PAUSED state", () => {
    const dueDate = new Date("2024-01-15");
    const state: DunningState = {
      ...createInstance(dueDate),
      status: "PAUSED",
      pausedFrom: "OVERDUE",
      pausedElapsed: 2,
      stateEnteredAt: new Date(),
    };
    
    const result = process(state, { type: "invoice_cancelled" }, new Date());
    
    expect(result.state.status).toBe("CANCELLED");
  });
});

describe("Manual advance", () => {
  it("should advance to next state on manual_advance", () => {
    const dueDate = new Date("2024-01-15");
    const state: DunningState = {
      ...createInstance(dueDate),
      status: "GRACE",
      stateEnteredAt: new Date(),
    };
    
    const result = process(state, { type: "manual_advance" }, new Date());
    
    expect(result.state.status).toBe("REMINDER_1");
    expect(result.actions).toContainEqual({
      type: "send_email",
      template: "first_reminder",
    });
  });

  it("should not advance from terminal states", () => {
    const dueDate = new Date("2024-01-15");
    const terminalStates: DunningStatus[] = ["PAID", "WRITTEN_OFF", "CANCELLED"];
    
    for (const status of terminalStates) {
      const state: DunningState = {
        ...createInstance(dueDate),
        status,
        stateEnteredAt: new Date(),
      };
      
      const result = process(state, { type: "manual_advance" }, new Date());
      expect(result.state.status).toBe(status);
    }
  });
});

describe("Configurable timeouts", () => {
  it("should use custom timeouts when provided", () => {
    const dueDate = new Date("2024-01-15");
    const state = createInstance(dueDate, {
      timeouts: {
        OVERDUE: 5,
        GRACE: 10,
      },
    });
    
    const issuedState: DunningState = {
      ...state,
      status: "ISSUED",
      stateEnteredAt: new Date(),
    };
    
    const now = addSimpleBusinessDays(dueDate, -7);
    const result = process(issuedState, { type: "tick" }, now);
    expect(result.state.status).toBe("DUE_SOON");
  });
});

describe("Business days calculation", () => {
  it("should exclude weekends from business day count", () => {
    const startDate = new Date("2024-01-12");
    const holidays: Date[] = [];
    
    const result = addSimpleBusinessDays(startDate, 14, new Set());
    
    const dayOfWeek = result.getDay();
    expect([1, 2, 3, 4, 5]).toContain(dayOfWeek);
  });

  it("should exclude public holidays from business day count", () => {
    const startDate = new Date("2024-01-02T00:00:00Z");
    const holiday = new Date("2024-01-05T00:00:00Z");
    
    const result = addBusinessDays(startDate, 3, createHolidaySet([holiday]));
    
    expect(result.getUTCDate()).toBe(8);
  });

  it("should use custom holiday calendar", () => {
    const startDate = new Date("2024-01-02T00:00:00Z");
    const customHoliday = new Date("2024-01-04T00:00:00Z");
    
    const result = addBusinessDays(startDate, 2, createHolidaySet([customHoliday]));
    
    expect(result.getUTCDate()).toBeGreaterThan(4);
  });
});

describe("State transitions preserve data", () => {
  it("should preserve dueDate across transitions", () => {
    const dueDate = new Date("2024-01-15");
    const state = createInstance(dueDate);
    
    const result = process(state, { type: "tick" }, addSimpleBusinessDays(dueDate, -7));
    
    expect(result.state.dueDate.toISOString()).toBe(dueDate.toISOString());
  });

  it("should preserve config across transitions", () => {
    const dueDate = new Date("2024-01-15");
    const customHolidays = [new Date("2024-01-01")];
    const state = createInstance(dueDate, { holidays: customHolidays });
    
    const result = process(state, { type: "tick" }, addSimpleBusinessDays(dueDate, -7));
    
    expect(result.state.config.holidays).toEqual(customHolidays);
  });
});