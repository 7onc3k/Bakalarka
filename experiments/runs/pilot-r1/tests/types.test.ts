import { describe, it, expect } from "vitest";
import type {
  DunningStatus,
  EventType,
  DunningEvent,
  ActionType,
  ActionDescriptor,
  DunningConfig,
  DunningState,
  ProcessResult,
} from "../src/types";

describe("Types", () => {
  describe("DunningStatus", () => {
    it("should include all required status values", () => {
      const statuses: DunningStatus[] = [
        "ISSUED",
        "DUE_SOON",
        "OVERDUE",
        "GRACE",
        "REMINDER_1",
        "REMINDER_2",
        "FINAL_NOTICE",
        "SUSPENDED",
        "WRITTEN_OFF",
        "PAID",
        "PAUSED",
        "CANCELLED",
      ];

      expect(statuses).toHaveLength(12);
    });
  });

  describe("EventType", () => {
    it("should include all required event types", () => {
      const eventTypes: EventType[] = [
        "tick",
        "payment_received",
        "invoice_cancelled",
        "dunning_paused",
        "dunning_resumed",
        "manual_advance",
      ];

      expect(eventTypes).toHaveLength(6);
    });
  });

  describe("ActionDescriptor", () => {
    it("should allow send_email action with template", () => {
      const action: ActionDescriptor = {
        type: "send_email",
        template: "due_soon_reminder",
      };

      expect(action.type).toBe("send_email");
      expect(action.template).toBe("due_soon_reminder");
    });

    it("should allow suspend_service action without template", () => {
      const action: ActionDescriptor = {
        type: "suspend_service",
      };

      expect(action.type).toBe("suspend_service");
      expect(action.template).toBeUndefined();
    });

    it("should allow resume_service action without template", () => {
      const action: ActionDescriptor = {
        type: "resume_service",
      };

      expect(action.type).toBe("resume_service");
      expect(action.template).toBeUndefined();
    });
  });

  describe("DunningState", () => {
    it("should allow creating a valid state", () => {
      const state: DunningState = {
        status: "ISSUED",
        dueDate: new Date("2024-12-01"),
        stateEnteredAt: new Date("2024-11-01"),
        config: {},
      };

      expect(state.status).toBe("ISSUED");
      expect(state.pausedFrom).toBeUndefined();
      expect(state.pausedElapsed).toBeUndefined();
    });

    it("should allow paused state with metadata", () => {
      const state: DunningState = {
        status: "PAUSED",
        dueDate: new Date("2024-12-01"),
        stateEnteredAt: new Date("2024-11-15"),
        config: {},
        pausedFrom: "OVERDUE",
        pausedElapsed: 5,
      };

      expect(state.status).toBe("PAUSED");
      expect(state.pausedFrom).toBe("OVERDUE");
      expect(state.pausedElapsed).toBe(5);
    });
  });

  describe("DunningConfig", () => {
    it("should allow empty config", () => {
      const config: DunningConfig = {};

      expect(config.timeouts).toBeUndefined();
      expect(config.holidays).toBeUndefined();
    });

    it("should allow custom timeouts", () => {
      const config: DunningConfig = {
        timeouts: {
          OVERDUE: 5,
          GRACE: 10,
        },
      };

      expect(config.timeouts?.OVERDUE).toBe(5);
      expect(config.timeouts?.GRACE).toBe(10);
    });

    it("should allow custom holidays", () => {
      const config: DunningConfig = {
        holidays: [new Date("2024-12-25"), new Date("2024-01-01")],
      };

      expect(config.holidays).toHaveLength(2);
    });
  });

  describe("ProcessResult", () => {
    it("should allow valid process result", () => {
      const result: ProcessResult = {
        state: {
          status: "ISSUED",
          dueDate: new Date("2024-12-01"),
          stateEnteredAt: new Date("2024-11-01"),
          config: {},
        },
        actions: [],
      };

      expect(result.state.status).toBe("ISSUED");
      expect(result.actions).toHaveLength(0);
    });

    it("should allow process result with actions", () => {
      const result: ProcessResult = {
        state: {
          status: "DUE_SOON",
          dueDate: new Date("2024-12-01"),
          stateEnteredAt: new Date("2024-11-24"),
          config: {},
        },
        actions: [
          {
            type: "send_email",
            template: "due_soon_reminder",
          },
        ],
      };

      expect(result.actions).toHaveLength(1);
      expect(result.actions[0].type).toBe("send_email");
    });
  });
});
