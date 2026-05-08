import {
  DunningStatus,
  DunningEvent,
  DunningConfig,
  DunningState,
  ProcessResult,
  ActionDescriptor,
  DEFAULT_TIMEOUTS,
  ACTIVE_STATUSES,
  TERMINAL_STATUSES,
  ESCALATION_ORDER,
  TRANSITION_ACTIONS,
} from "./types.js";
import { createHolidaySet, getBusinessDaysDifference, addBusinessDays } from "./businessDays.js";

function mergeConfig(config: DunningConfig): Required<DunningConfig> {
  return {
    timeouts: { ...DEFAULT_TIMEOUTS, ...config.timeouts },
    holidays: config.holidays ?? [],
  };
}

function getEffectiveTimeout(
  status: DunningStatus,
  config: Required<DunningConfig>
): number {
  const timeout = config.timeouts[status];
  if (timeout === undefined) {
    return DEFAULT_TIMEOUTS[status] ?? 0;
  }
  return timeout;
}

function getNextStatus(currentStatus: DunningStatus): DunningStatus | null {
  const currentIndex = ESCALATION_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= ESCALATION_ORDER.length - 1) {
    return null;
  }
  return ESCALATION_ORDER[currentIndex + 1];
}

function shouldTransitionToDueSoon(
  dueDate: Date,
  now: Date,
  config: Required<DunningConfig>
): boolean {
  const dueSoonTimeout = getEffectiveTimeout("DUE_SOON", config);
  const targetDate = addBusinessDays(dueDate, dueSoonTimeout, createHolidaySet(config.holidays));
  return now.getTime() >= targetDate.getTime();
}

function shouldTransitionFromIssued(
  state: DunningState,
  now: Date,
  config: Required<DunningConfig>
): boolean {
  return shouldTransitionToDueSoon(state.dueDate, now, config);
}

function shouldTransitionFromDueSoon(
  state: DunningState,
  now: Date,
  _config: Required<DunningConfig>
): boolean {
  const dueDate = normalizeDate(state.dueDate);
  const current = normalizeDate(now);
  return current.getTime() >= dueDate.getTime();
}

function calculateElapsedBusinessDays(
  state: DunningState,
  now: Date,
  config: Required<DunningConfig>
): number {
  const holidays = createHolidaySet(config.holidays);
  const elapsed = getBusinessDaysDifference(state.stateEnteredAt, now, holidays);
  const pausedElapsed = state.pausedElapsed ?? 0;
  return elapsed + pausedElapsed;
}

function shouldTransitionByTimeout(
  state: DunningState,
  now: Date,
  config: Required<DunningConfig>
): boolean {
  const elapsed = calculateElapsedBusinessDays(state, now, config);
  const timeout = getEffectiveTimeout(state.status, config);
  return elapsed >= timeout;
}

function isTerminalStatus(status: DunningStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

function isActiveStatus(status: DunningStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}

function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function getTransitionActions(newStatus: DunningStatus): ActionDescriptor[] {
  return TRANSITION_ACTIONS[newStatus] ?? [];
}

/**
 * Initialize a new dunning instance for an invoice.
 * @param dueDate - The invoice due date
 * @param config - Optional configuration (timeouts, holidays)
 * @returns A new DunningState in ISSUED status
 */
export function createInstance(
  dueDate: Date,
  config?: Partial<DunningConfig>
): DunningState {
  const mergedConfig = mergeConfig(config ?? {});
  return {
    status: "ISSUED",
    dueDate: normalizeDate(dueDate),
    stateEnteredAt: new Date(),
    config: {
      timeouts: mergedConfig.timeouts,
      holidays: mergedConfig.holidays,
    },
  };
}

/**
 * Process a dunning event and return the new state and any actions to take.
 * This is a pure function that does not mutate the input state.
 * @param state - The current dunning state
 * @param event - The event to process (tick, payment_received, etc.)
 * @param now - The current date/time for evaluating time-based transitions
 * @returns A ProcessResult containing the new state and action descriptors
 */
export function process(
  state: DunningState,
  event: DunningEvent,
  now: Date
): ProcessResult {
  const normalizedNow = normalizeDate(now);
  const config = mergeConfig(state.config);

  if (isTerminalStatus(state.status)) {
    return { state, actions: [] };
  }

  if (state.status === "PAUSED") {
    return processPausedState(state, event, normalizedNow, config);
  }

  switch (event.type) {
    case "tick":
      return processTick(state, normalizedNow, config);
    case "payment_received":
      return processPayment(state, config);
    case "invoice_cancelled":
      return processCancellation(state, config);
    case "dunning_paused":
      return processPause(state, config);
    case "dunning_resumed":
      return processResume(state, config);
    case "manual_advance":
      return processManualAdvance(state, config);
    default:
      return { state, actions: [] };
  }
}

function processTick(
  state: DunningState,
  now: Date,
  config: Required<DunningConfig>
): ProcessResult {
  if (state.status === "ISSUED" && shouldTransitionFromIssued(state, now, config)) {
    return transitionTo(state, "DUE_SOON", now, config);
  }

  if (state.status === "DUE_SOON" && shouldTransitionFromDueSoon(state, now, config)) {
    return transitionTo(state, "OVERDUE", now, config);
  }

  if (shouldTransitionByTimeout(state, now, config)) {
    const nextStatus = getNextStatus(state.status);
    if (nextStatus) {
      return transitionTo(state, nextStatus, now, config);
    }
  }

  return { state, actions: [] };
}

function processPayment(
  state: DunningState,
  _config: Required<DunningConfig>
): ProcessResult {
  const actions: ActionDescriptor[] = [];
  if (state.status === "SUSPENDED") {
    actions.push({ type: "resume_service" });
  }

  const newState: DunningState = {
    ...state,
    status: "PAID",
    stateEnteredAt: new Date(),
  };

  return { state: newState, actions };
}

function processCancellation(
  state: DunningState,
  _config: Required<DunningConfig>
): ProcessResult {
  const actions: ActionDescriptor[] = [];
  if (state.status === "SUSPENDED") {
    actions.push({ type: "resume_service" });
  }

  const newState: DunningState = {
    ...state,
    status: "CANCELLED",
    stateEnteredAt: new Date(),
  };

  return { state: newState, actions };
}

function processPause(
  state: DunningState,
  config: Required<DunningConfig>
): ProcessResult {
  if (!isActiveStatus(state.status)) {
    return { state, actions: [] };
  }

  const elapsed = calculateElapsedBusinessDays(state, new Date(), config);

  const newState: DunningState = {
    ...state,
    status: "PAUSED",
    pausedFrom: state.status,
    pausedElapsed: elapsed,
    stateEnteredAt: new Date(),
  };

  return { state: newState, actions: [] };
}

function processResume(
  state: DunningState,
  _config: Required<DunningConfig>
): ProcessResult {
  if (state.status !== "PAUSED" || !state.pausedFrom) {
    return { state, actions: [] };
  }

  const newState: DunningState = {
    ...state,
    status: state.pausedFrom,
    pausedFrom: undefined,
    pausedElapsed: undefined,
    stateEnteredAt: new Date(),
  };

  return { state: newState, actions: [] };
}

function processManualAdvance(
  state: DunningState,
  config: Required<DunningConfig>
): ProcessResult {
  if (!isActiveStatus(state.status) && state.status !== "ISSUED" && state.status !== "DUE_SOON" && state.status !== "GRACE") {
    return { state, actions: [] };
  }

  const nextStatus = getNextStatus(state.status);
  if (!nextStatus) {
    return { state, actions: [] };
  }

  const now = new Date();
  return transitionTo(state, nextStatus, now, config);
}

function transitionTo(
  state: DunningState,
  newStatus: DunningStatus,
  now: Date,
  _config: Required<DunningConfig>
): ProcessResult {
  const actions = getTransitionActions(newStatus);

  const newState: DunningState = {
    ...state,
    status: newStatus,
    stateEnteredAt: now,
  };

  return { state: newState, actions };
}

function processPausedState(
  state: DunningState,
  event: DunningEvent,
  _now: Date,
  config: Required<DunningConfig>
): ProcessResult {
  switch (event.type) {
    case "payment_received":
      return processPayment(state, config);
    case "invoice_cancelled":
      return processCancellation(state, config);
    case "dunning_resumed":
      return processResume(state, config);
    default:
      return { state, actions: [] };
  }
}