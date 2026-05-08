import type {
  DunningStatus,
  DunningEvent,
  DunningState,
  DunningConfig,
  ProcessResult,
  ActionDescriptor,
} from "./types.js";
import { businessDaysBetween } from "./businessDays.js";

const DEFAULT_TIMEOUTS: Record<DunningStatus, number> = {
  ISSUED: 0,
  DUE_SOON: 7,
  OVERDUE: 3,
  GRACE: 7,
  REMINDER_1: 14,
  REMINDER_2: 14,
  FINAL_NOTICE: 7,
  SUSPENDED: 30,
  WRITTEN_OFF: 0,
  PAID: 0,
  PAUSED: 0,
  CANCELLED: 0,
};

const ACTIVE_STATES: DunningStatus[] = [
  "OVERDUE",
  "GRACE",
  "REMINDER_1",
  "REMINDER_2",
  "FINAL_NOTICE",
  "SUSPENDED",
];

const TERMINAL_STATES: DunningStatus[] = ["WRITTEN_OFF", "PAID", "CANCELLED"];

const ESCALATION_ORDER: DunningStatus[] = [
  "ISSUED",
  "DUE_SOON",
  "OVERDUE",
  "GRACE",
  "REMINDER_1",
  "REMINDER_2",
  "FINAL_NOTICE",
  "SUSPENDED",
  "WRITTEN_OFF",
];

function mergeConfig(config?: Partial<DunningConfig>): DunningConfig {
  return {
    timeouts: config?.timeouts
      ? { ...DEFAULT_TIMEOUTS, ...config.timeouts }
      : DEFAULT_TIMEOUTS,
    holidays: config?.holidays ?? [],
  };
}

function getTimeout(
  status: DunningStatus,
  config: DunningConfig
): number {
  return config.timeouts?.[status] ?? DEFAULT_TIMEOUTS[status];
}

function isActiveState(status: DunningStatus): boolean {
  return ACTIVE_STATES.includes(status);
}

function isTerminalState(status: DunningStatus): boolean {
  return TERMINAL_STATES.includes(status);
}

function getNextState(currentStatus: DunningStatus): DunningStatus | null {
  const currentIndex = ESCALATION_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= ESCALATION_ORDER.length - 1) {
    return null;
  }
  return ESCALATION_ORDER[currentIndex + 1];
}

function getActionsForTransition(
  _fromStatus: DunningStatus,
  toStatus: DunningStatus
): ActionDescriptor[] {
  const actions: ActionDescriptor[] = [];

  switch (toStatus) {
    case "DUE_SOON":
      actions.push({ type: "send_email", template: "due_soon_reminder" });
      break;
    case "REMINDER_1":
      actions.push({ type: "send_email", template: "first_reminder" });
      break;
    case "REMINDER_2":
      actions.push({ type: "send_email", template: "second_reminder" });
      break;
    case "FINAL_NOTICE":
      actions.push({ type: "send_email", template: "final_warning" });
      break;
    case "SUSPENDED":
      actions.push({ type: "suspend_service" });
      actions.push({ type: "send_email", template: "service_suspended" });
      break;
    case "WRITTEN_OFF":
      actions.push({ type: "send_email", template: "written_off_notice" });
      break;
  }

  return actions;
}

function calculateBusinessDaysElapsed(
  stateEnteredAt: Date,
  now: Date,
  holidays: Date[]
): number {
  return businessDaysBetween(stateEnteredAt, now, holidays);
}

export function createInstance(
  dueDate: Date,
  config?: Partial<DunningConfig>
): DunningState {
  return {
    status: "ISSUED",
    dueDate: new Date(dueDate),
    stateEnteredAt: new Date(),
    config: mergeConfig(config),
  };
}

export function process(
  state: DunningState,
  event: DunningEvent,
  now: Date
): ProcessResult {
  const { status, config, stateEnteredAt, pausedFrom, pausedElapsed } = state;

  if (isTerminalState(status)) {
    return { state, actions: [] };
  }

  switch (event.type) {
    case "tick": {
      const holidays = config.holidays ?? [];
      const dueDate = state.dueDate;

      if (status === "ISSUED") {
        const businessDaysLeft = businessDaysBetween(now, dueDate, holidays);
        if (businessDaysLeft === getTimeout("DUE_SOON", config)) {
          return {
            state: {
              ...state,
              status: "DUE_SOON",
              stateEnteredAt: now,
            },
            actions: getActionsForTransition("ISSUED", "DUE_SOON"),
          };
        }
      }

      if (status === "DUE_SOON") {
        if (now >= new Date(dueDate)) {
          return {
            state: {
              ...state,
              status: "OVERDUE",
              stateEnteredAt: now,
            },
            actions: [],
          };
        }
      }

      if (status === "OVERDUE" || status === "GRACE") {
        const effectiveElapsed =
          pausedElapsed ??
          calculateBusinessDaysElapsed(stateEnteredAt, now, holidays);
        const timeout = getTimeout(status, config);

        if (effectiveElapsed >= timeout) {
          const nextStatus = getNextState(status);
          if (nextStatus) {
            return {
              state: {
                ...state,
                status: nextStatus,
                stateEnteredAt: now,
              },
              actions: getActionsForTransition(status, nextStatus),
            };
          }
        }
      }

      if (
        status === "REMINDER_1" ||
        status === "REMINDER_2" ||
        status === "FINAL_NOTICE" ||
        status === "SUSPENDED"
      ) {
        const effectiveElapsed =
          pausedElapsed ??
          calculateBusinessDaysElapsed(stateEnteredAt, now, holidays);
        const timeout = getTimeout(status, config);

        if (effectiveElapsed >= timeout) {
          const nextStatus = getNextState(status);
          if (nextStatus) {
            return {
              state: {
                ...state,
                status: nextStatus,
                stateEnteredAt: now,
              },
              actions: getActionsForTransition(status, nextStatus),
            };
          }
        }
      }

      return { state, actions: [] };
    }

    case "payment_received": {
      const actions: ActionDescriptor[] = [];

      if (status === "SUSPENDED") {
        actions.push({ type: "resume_service" });
      }

      return {
        state: {
          ...state,
          status: "PAID",
          stateEnteredAt: now,
        },
        actions,
      };
    }

    case "invoice_cancelled": {
      const actions: ActionDescriptor[] = [];

      if (status === "SUSPENDED") {
        actions.push({ type: "resume_service" });
      }

      return {
        state: {
          ...state,
          status: "CANCELLED",
          stateEnteredAt: now,
        },
        actions,
      };
    }

    case "dunning_paused": {
      if (!isActiveState(status)) {
        return { state, actions: [] };
      }

      const elapsed = calculateBusinessDaysElapsed(
        stateEnteredAt,
        now,
        config.holidays ?? []
      );

      return {
        state: {
          ...state,
          status: "PAUSED",
          pausedFrom: status,
          pausedElapsed: elapsed,
          stateEnteredAt: now,
        },
        actions: [],
      };
    }

    case "dunning_resumed": {
      if (status !== "PAUSED" || !pausedFrom) {
        return { state, actions: [] };
      }

      return {
        state: {
          ...state,
          status: pausedFrom,
          pausedFrom: undefined,
          pausedElapsed: undefined,
          stateEnteredAt: now,
        },
        actions: [],
      };
    }

    case "manual_advance": {
      if (!isActiveState(status) || isTerminalState(status)) {
        return { state, actions: [] };
      }

      const nextStatus = getNextState(status);
      if (!nextStatus) {
        return { state, actions: [] };
      }

      return {
        state: {
          ...state,
          status: nextStatus,
          stateEnteredAt: now,
        },
        actions: getActionsForTransition(status, nextStatus),
      };
    }

    default:
      return { state, actions: [] };
  }
}
