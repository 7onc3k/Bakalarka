import { describe, it, expect, beforeEach } from "vitest";
import { createInstance, process } from "../src/dunning.js";
import type { DunningEvent, DunningState } from "../src/types.js";
import { addBusinessDays as bdAddBusinessDays } from "../src/businessDays.js";

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addBusinessDays(date: Date, days: number): Date {
  return bdAddBusinessDays(date, days);
}

describe("Dunning System", () => {
  describe("createInstance", () => {
    it("should create instance with ISSUED status", () => {
      const dueDate = new Date("2024-12-01");
      const state = createInstance(dueDate);

      expect(state.status).toBe("ISSUED");
      expect(state.dueDate).toEqual(dueDate);
      expect(state.config.timeouts).toBeDefined();
    });

    it("should use default timeouts", () => {
      const dueDate = new Date("2024-12-01");
      const state = createInstance(dueDate);

      expect(state.config.timeouts?.DUE_SOON).toBe(7);
      expect(state.config.timeouts?.OVERDUE).toBe(3);
      expect(state.config.timeouts?.GRACE).toBe(7);
      expect(state.config.timeouts?.REMINDER_1).toBe(14);
      expect(state.config.timeouts?.REMINDER_2).toBe(14);
      expect(state.config.timeouts?.FINAL_NOTICE).toBe(7);
      expect(state.config.timeouts?.SUSPENDED).toBe(30);
    });

    it("should allow custom config", () => {
      const dueDate = new Date("2024-12-01");
      const config = {
        timeouts: { OVERDUE: 5 },
        holidays: [new Date("2024-12-25")],
      };
      const state = createInstance(dueDate, config);

      expect(state.config.timeouts?.OVERDUE).toBe(5);
      expect(state.config.holidays).toHaveLength(1);
    });
  });

  describe("Time-based transitions", () => {
    describe("ISSUED → DUE_SOON", () => {
      it("should transition to DUE_SOON 7 business days before due date", () => {
        const dueDate = new Date("2024-12-10");
        const state = createInstance(dueDate);

        const tickDate = addBusinessDays(dueDate, -7);
        const result = process(state, { type: "tick" }, tickDate);

        expect(result.state.status).toBe("DUE_SOON");
        expect(result.actions).toHaveLength(1);
        expect(result.actions[0]).toEqual({
          type: "send_email",
          template: "due_soon_reminder",
        });
      });

      it("should stay in ISSUED before 7 business days before due date", () => {
        const dueDate = new Date("2024-12-10");
        const state = createInstance(dueDate);

        const tickDate = addBusinessDays(dueDate, -6);
        const result = process(state, { type: "tick" }, tickDate);

        expect(result.state.status).toBe("ISSUED");
        expect(result.actions).toHaveLength(0);
      });
    });

    describe("DUE_SOON → OVERDUE", () => {
      it("should transition to OVERDUE on due date", () => {
        const dueDate = new Date("2024-12-01");
        const state = createInstance(dueDate);

        const overDueDate = addBusinessDays(dueDate, -7);
        let stateAfterDueSoon = process(state, { type: "tick" }, overDueDate);
        stateAfterDueSoon = {
          ...stateAfterDueSoon,
          state: { ...stateAfterDueSoon.state, stateEnteredAt: overDueDate },
        };

        const result = process(
          stateAfterDueSoon.state,
          { type: "tick" },
          dueDate
        );

        expect(result.state.status).toBe("OVERDUE");
        expect(result.actions).toHaveLength(0);
      });
    });

    describe("OVERDUE → GRACE", () => {
      it("should transition to GRACE after 3 business days", () => {
        const dueDate = new Date("2024-12-01");
        const state: DunningState = {
          status: "OVERDUE",
          dueDate,
          stateEnteredAt: dueDate,
          config: {},
        };

        const graceDate = addBusinessDays(dueDate, 3);
        const result = process(
          state,
          { type: "tick" },
          graceDate
        );

        expect(result.state.status).toBe("GRACE");
        expect(result.actions).toHaveLength(0);
      });
    });

    describe("GRACE → REMINDER_1", () => {
      it("should transition to REMINDER_1 after 7 business days", () => {
        const dueDate = new Date("2024-12-01");
        const graceDate = new Date("2024-12-05");
        
        const state: DunningState = {
          status: "GRACE",
          dueDate,
          stateEnteredAt: graceDate,
          config: {},
        };

        const reminder1Date = addBusinessDays(graceDate, 7);
        const result = process(state, { type: "tick" }, reminder1Date);

        expect(result.state.status).toBe("REMINDER_1");
        expect(result.actions).toHaveLength(1);
        expect(result.actions[0]).toEqual({
          type: "send_email",
          template: "first_reminder",
        });
      });
    });

    describe("REMINDER_1 → REMINDER_2", () => {
      it("should transition after 14 business days", () => {
        const dueDate = new Date("2024-12-01");
        const reminder1Date = new Date("2024-12-15");
        
        const state: DunningState = {
          status: "REMINDER_1",
          dueDate,
          stateEnteredAt: reminder1Date,
          config: {},
        };

        const reminder2Date = addBusinessDays(reminder1Date, 14);
        const result = process(state, { type: "tick" }, reminder2Date);

        expect(result.state.status).toBe("REMINDER_2");
        expect(result.actions).toHaveLength(1);
        expect(result.actions[0]).toEqual({
          type: "send_email",
          template: "second_reminder",
        });
      });
    });

    describe("REMINDER_2 → FINAL_NOTICE", () => {
      it("should transition after 14 business days", () => {
        const dueDate = new Date("2024-12-01");
        const reminder2Date = new Date("2025-01-05");
        
        const state: DunningState = {
          status: "REMINDER_2",
          dueDate,
          stateEnteredAt: reminder2Date,
          config: {},
        };

        const finalNoticeDate = addBusinessDays(reminder2Date, 14);
        const result = process(state, { type: "tick" }, finalNoticeDate);

        expect(result.state.status).toBe("FINAL_NOTICE");
        expect(result.actions).toHaveLength(1);
        expect(result.actions[0]).toEqual({
          type: "send_email",
          template: "final_warning",
        });
      });
    });

    describe("FINAL_NOTICE → SUSPENDED", () => {
      it("should transition after 7 business days", () => {
        const dueDate = new Date("2024-12-01");
        const finalNoticeDate = new Date("2025-01-15");
        const state: DunningState = {
          status: "FINAL_NOTICE",
          dueDate,
          stateEnteredAt: finalNoticeDate,
          config: {},
        };

        const suspendedDate = addBusinessDays(finalNoticeDate, 7);
        const result = process(state, { type: "tick" }, suspendedDate);

        expect(result.state.status).toBe("SUSPENDED");
        expect(result.actions).toHaveLength(2);
        expect(result.actions[0]).toEqual({ type: "suspend_service" });
        expect(result.actions[1]).toEqual({
          type: "send_email",
          template: "service_suspended",
        });
      });
    });

    describe("SUSPENDED → WRITTEN_OFF", () => {
      it("should transition after 30 business days", () => {
        const dueDate = new Date("2024-12-01");
        const suspendedDate = new Date("2025-01-25");
        const state: DunningState = {
          status: "SUSPENDED",
          dueDate,
          stateEnteredAt: suspendedDate,
          config: {},
        };

        const writtenOffDate = addBusinessDays(suspendedDate, 30);
        const result = process(state, { type: "tick" }, writtenOffDate);

        expect(result.state.status).toBe("WRITTEN_OFF");
        expect(result.actions).toHaveLength(1);
        expect(result.actions[0]).toEqual({
          type: "send_email",
          template: "written_off_notice",
        });
      });
    });
  });

  describe("Payment handling", () => {
    it("should transition to PAID from any non-terminal state", () => {
      const dueDate = new Date("2024-12-01");
      const activeStates: DunningState["status"][] = [
        "ISSUED",
        "DUE_SOON",
        "OVERDUE",
        "GRACE",
        "REMINDER_1",
        "REMINDER_2",
        "FINAL_NOTICE",
        "SUSPENDED",
        "PAUSED",
      ];

      for (const status of activeStates) {
        const state: DunningState = {
          status,
          dueDate,
          stateEnteredAt: new Date(),
          config: {},
        };
        const result = process(state, { type: "payment_received" }, new Date());

        expect(result.state.status).toBe("PAID");
      }
    });

    it("should return resume_service action when payment from SUSPENDED", () => {
      const dueDate = new Date("2024-12-01");
      const state: DunningState = {
        status: "SUSPENDED",
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
      };

      const result = process(state, { type: "payment_received" }, new Date());

      expect(result.state.status).toBe("PAID");
      expect(result.actions).toContainEqual({ type: "resume_service" });
    });

    it("should not transition from terminal states on payment", () => {
      const dueDate = new Date("2024-12-01");
      const terminalStates: DunningState["status"][] = [
        "PAID",
        "WRITTEN_OFF",
        "CANCELLED",
      ];

      for (const status of terminalStates) {
        const state: DunningState = {
          status,
          dueDate,
          stateEnteredAt: new Date(),
          config: {},
        };
        const result = process(state, { type: "payment_received" }, new Date());

        expect(result.state.status).toBe(status);
        expect(result.actions).toHaveLength(0);
      }
    });
  });

  describe("Invoice cancellation", () => {
    it("should transition to CANCELLED from non-terminal states", () => {
      const dueDate = new Date("2024-12-01");
      const activeStates: DunningState["status"][] = [
        "ISSUED",
        "DUE_SOON",
        "OVERDUE",
        "GRACE",
        "REMINDER_1",
        "REMINDER_2",
        "FINAL_NOTICE",
        "SUSPENDED",
        "PAUSED",
      ];

      for (const status of activeStates) {
        const state: DunningState = {
          status,
          dueDate,
          stateEnteredAt: new Date(),
          config: {},
        };
        const result = process(
          state,
          { type: "invoice_cancelled" },
          new Date()
        );

        expect(result.state.status).toBe("CANCELLED");
      }
    });

    it("should return resume_service action when cancelling from SUSPENDED", () => {
      const dueDate = new Date("2024-12-01");
      const state: DunningState = {
        status: "SUSPENDED",
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
      };

      const result = process(state, { type: "invoice_cancelled" }, new Date());

      expect(result.state.status).toBe("CANCELLED");
      expect(result.actions).toContainEqual({ type: "resume_service" });
    });

    it("should not transition from terminal states on cancellation", () => {
      const dueDate = new Date("2024-12-01");
      const terminalStates: DunningState["status"][] = [
        "PAID",
        "WRITTEN_OFF",
        "CANCELLED",
      ];

      for (const status of terminalStates) {
        const state: DunningState = {
          status,
          dueDate,
          stateEnteredAt: new Date(),
          config: {},
        };
        const result = process(
          state,
          { type: "invoice_cancelled" },
          new Date()
        );

        expect(result.state.status).toBe(status);
        expect(result.actions).toHaveLength(0);
      }
    });
  });

  describe("Pause/Resume", () => {
    it("should transition to PAUSED from active states", () => {
      const dueDate = new Date("2024-12-01");
      const activeStates = ["OVERDUE", "GRACE", "REMINDER_1", "REMINDER_2", "FINAL_NOTICE", "SUSPENDED"] as const;

      for (const status of activeStates) {
        const state: DunningState = {
          status,
          dueDate,
          stateEnteredAt: new Date("2025-01-01"),
          config: {},
        };

        const now = new Date("2025-01-10");
        const result = process(state, { type: "dunning_paused" }, now);

        expect(result.state.status).toBe("PAUSED");
        expect(result.state.pausedFrom).toBe(status);
        expect(result.state.pausedElapsed).toBeGreaterThan(0);
      }
    });

    it("should transition back to previous state on resume", () => {
      const dueDate = new Date("2024-12-01");
      const pausedState: DunningState = {
        status: "PAUSED",
        dueDate,
        stateEnteredAt: new Date("2025-01-10"),
        config: {},
        pausedFrom: "OVERDUE",
        pausedElapsed: 5,
      };

      const result = process(pausedState, { type: "dunning_resumed" }, new Date("2025-01-11"));

      expect(result.state.status).toBe("OVERDUE");
      expect(result.state.pausedFrom).toBeUndefined();
      expect(result.state.pausedElapsed).toBeUndefined();
    });

    it("should prioritize payment over pause state", () => {
      const dueDate = new Date("2024-12-01");
      const pausedState: DunningState = {
        status: "PAUSED",
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
        pausedFrom: "OVERDUE",
        pausedElapsed: 5,
      };

      const result = process(
        pausedState,
        { type: "payment_received" },
        new Date()
      );

      expect(result.state.status).toBe("PAID");
    });

    it("should allow cancellation from paused state", () => {
      const dueDate = new Date("2024-12-01");
      const pausedState: DunningState = {
        status: "PAUSED",
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
        pausedFrom: "OVERDUE",
        pausedElapsed: 5,
      };

      const result = process(
        pausedState,
        { type: "invoice_cancelled" },
        new Date()
      );

      expect(result.state.status).toBe("CANCELLED");
    });
  });

  describe("Manual advance", () => {
    it("should advance to next state", () => {
      const dueDate = new Date("2024-12-01");
      const state: DunningState = {
        status: "GRACE",
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
      };

      const result = process(state, { type: "manual_advance" }, new Date());

      expect(result.state.status).toBe("REMINDER_1");
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0]).toEqual({
        type: "send_email",
        template: "first_reminder",
      });
    });

    it("should not advance from terminal states", () => {
      const dueDate = new Date("2024-12-01");
      const terminalStates: DunningState["status"][] = [
        "PAID",
        "WRITTEN_OFF",
        "CANCELLED",
        "PAUSED",
        "ISSUED",
        "DUE_SOON",
      ];

      for (const status of terminalStates) {
        const state: DunningState = {
          status,
          dueDate,
          stateEnteredAt: new Date(),
          config: {},
        };
        const result = process(state, { type: "manual_advance" }, new Date());

        expect(result.state.status).toBe(status);
      }
    });
  });

  describe("Terminal states", () => {
    it("should not transition from PAID state", () => {
      const dueDate = new Date("2024-12-01");
      const state: DunningState = {
        status: "PAID",
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
      };

      const events: DunningEvent[] = [
        { type: "tick" },
        { type: "payment_received" },
        { type: "invoice_cancelled" },
        { type: "dunning_paused" },
        { type: "dunning_resumed" },
        { type: "manual_advance" },
      ];

      for (const event of events) {
        const result = process(state, event, new Date());
        expect(result.state.status).toBe("PAID");
      }
    });

    it("should not transition from WRITTEN_OFF state", () => {
      const dueDate = new Date("2024-12-01");
      const state: DunningState = {
        status: "WRITTEN_OFF",
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
      };

      const events: DunningEvent[] = [
        { type: "tick" },
        { type: "payment_received" },
        { type: "invoice_cancelled" },
      ];

      for (const event of events) {
        const result = process(state, event, new Date());
        expect(result.state.status).toBe("WRITTEN_OFF");
      }
    });

    it("should not transition from CANCELLED state", () => {
      const dueDate = new Date("2024-12-01");
      const state: DunningState = {
        status: "CANCELLED",
        dueDate,
        stateEnteredAt: new Date(),
        config: {},
      };

      const events: DunningEvent[] = [
        { type: "tick" },
        { type: "payment_received" },
        { type: "invoice_cancelled" },
      ];

      for (const event of events) {
        const result = process(state, event, new Date());
        expect(result.state.status).toBe("CANCELLED");
      }
    });
  });

  describe("Custom timeouts", () => {
    it("should use custom timeouts when provided", () => {
      const dueDate = new Date("2024-12-01");
      const config = {
        timeouts: {
          OVERDUE: 10,
        },
      };
      const state = createInstance(dueDate, config);

      expect(state.config.timeouts?.OVERDUE).toBe(10);
      expect(state.config.timeouts?.GRACE).toBe(7);
    });

    it("should use default timeouts when not provided", () => {
      const dueDate = new Date("2024-12-01");
      const state = createInstance(dueDate);

      expect(state.config.timeouts?.OVERDUE).toBe(3);
    });
  });
});
