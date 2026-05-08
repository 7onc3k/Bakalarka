import type { 
  DunningState, 
  DunningEvent, 
  DunningStatus,
  DunningConfig,
  ActionDescriptor,
  ProcessResult 
} from './types.js';
import { businessDaysBetween, addBusinessDays } from './businessDays.js';

const DEFAULT_TIMEOUTS: Record<DunningStatus, number> = {
  ISSUED: -7, // 7 business days BEFORE due date
  DUE_SOON: 0, // transition when due date reached
  OVERDUE: 3, // 3 business days after due date
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
  'OVERDUE',
  'GRACE', 
  'REMINDER_1',
  'REMINDER_2',
  'FINAL_NOTICE',
  'SUSPENDED',
];

const ESCALATION_ORDER: DunningStatus[] = [
  'ISSUED',
  'DUE_SOON', 
  'OVERDUE',
  'GRACE',
  'REMINDER_1',
  'REMINDER_2',
  'FINAL_NOTICE',
  'SUSPENDED',
  'WRITTEN_OFF',
];

function getTimeout(status: DunningStatus, config: DunningConfig): number {
  return config.timeouts?.[status] ?? DEFAULT_TIMEOUTS[status];
}

function getHolidays(config: DunningConfig): readonly Date[] {
  return config.holidays ?? [];
}

function getActionsForTransition(
  _fromStatus: DunningStatus,
  toStatus: DunningStatus
): ActionDescriptor[] {
  const actions: ActionDescriptor[] = [];
  
  switch (toStatus) {
    case 'DUE_SOON':
      actions.push({ type: 'send_email', template: 'due_soon_reminder' });
      break;
    case 'REMINDER_1':
      actions.push({ type: 'send_email', template: 'first_reminder' });
      break;
    case 'REMINDER_2':
      actions.push({ type: 'send_email', template: 'second_reminder' });
      break;
    case 'FINAL_NOTICE':
      actions.push({ type: 'send_email', template: 'final_warning' });
      break;
    case 'SUSPENDED':
      actions.push({ type: 'suspend_service' });
      actions.push({ type: 'send_email', template: 'service_suspended' });
      break;
    case 'WRITTEN_OFF':
      actions.push({ type: 'send_email', template: 'written_off_notice' });
      break;
  }
  
  return actions;
}

function getNextStatus(currentStatus: DunningStatus): DunningStatus | null {
  const currentIndex = ESCALATION_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= ESCALATION_ORDER.length - 1) {
    return null;
  }
  const nextStatus = ESCALATION_ORDER[currentIndex + 1];
  return nextStatus ?? null;
}

/**
 * Creates a new dunning instance for an invoice.
 * Initializes the dunning process in ISSUED state with the given due date.
 * 
 * @param dueDate - The invoice due date
 * @param config - Optional configuration for timeouts and holidays
 * @returns Initial dunning state in ISSUED status
 */
export function createInstance(
  dueDate: Date,
  config?: Partial<DunningConfig>
): DunningState {
  const resolvedConfig: DunningConfig = {};
  if (config?.timeouts !== undefined) {
    resolvedConfig.timeouts = config.timeouts;
  }
  if (config?.holidays !== undefined) {
    resolvedConfig.holidays = config.holidays;
  }
  
  return {
    status: 'ISSUED',
    dueDate: new Date(dueDate),
    stateEnteredAt: new Date(),
    config: resolvedConfig,
  };
}

function processTick(
  state: DunningState,
  now: Date
): { state: DunningState; actions: ActionDescriptor[] } {
  const { status, dueDate, stateEnteredAt, config } = state;
  const holidays = getHolidays(config);
  
  if (status === 'PAID' || status === 'WRITTEN_OFF' || status === 'CANCELLED') {
    return { state, actions: [] };
  }
  
  if (status === 'PAUSED') {
    return { state, actions: [] };
  }
  
  if (status === 'ISSUED') {
    const timeout = getTimeout(status, config);
    const targetDate = addBusinessDays(dueDate, timeout, holidays);
    
    if (now >= targetDate) {
      const newState: DunningState = {
        ...state,
        status: 'DUE_SOON',
        stateEnteredAt: now,
      };
      const actions = getActionsForTransition('ISSUED', 'DUE_SOON');
      return { state: newState, actions };
    }
    return { state, actions: [] };
  }
  
  if (status === 'DUE_SOON') {
    const targetDate = new Date(dueDate);
    targetDate.setHours(0, 0, 0, 0);
    
    if (now >= targetDate) {
      const newState: DunningState = {
        ...state,
        status: 'OVERDUE',
        stateEnteredAt: now,
      };
      return { state: newState, actions: [] };
    }
    return { state, actions: [] };
  }
  
  // For all other active states
  if (ACTIVE_STATES.includes(status) || status === 'SUSPENDED') {
    const timeout = getTimeout(status, config);
    const targetDate = addBusinessDays(stateEnteredAt, timeout, holidays);
    
    if (now >= targetDate) {
      const nextStatus = getNextStatus(status);
      if (nextStatus && nextStatus !== 'WRITTEN_OFF') {
        const newState: DunningState = {
          ...state,
          status: nextStatus,
          stateEnteredAt: now,
        };
        const actions = getActionsForTransition(status, nextStatus);
        return { state: newState, actions };
      } else if (nextStatus === 'WRITTEN_OFF') {
        const newState: DunningState = {
          ...state,
          status: 'WRITTEN_OFF',
          stateEnteredAt: now,
        };
        const actions = getActionsForTransition(status, 'WRITTEN_OFF');
        return { state: newState, actions };
      }
    }
  }
  
  return { state, actions: [] };
}

function processPaymentReceived(
  state: DunningState
): { state: DunningState; actions: ActionDescriptor[] } {
  const { status } = state;
  
  if (status === 'PAID' || status === 'WRITTEN_OFF' || status === 'CANCELLED') {
    return { state, actions: [] };
  }
  
  const actions: ActionDescriptor[] = [];
  
  if (status === 'SUSPENDED') {
    actions.push({ type: 'resume_service' });
  }
  
  const newState: DunningState = {
    ...state,
    status: 'PAID',
    stateEnteredAt: new Date(),
  };
  
  return { state: newState, actions };
}

function processInvoiceCancelled(
  state: DunningState
): { state: DunningState; actions: ActionDescriptor[] } {
  const { status } = state;
  
  if (status === 'PAID' || status === 'WRITTEN_OFF' || status === 'CANCELLED') {
    return { state, actions: [] };
  }
  
  const actions: ActionDescriptor[] = [];
  
  if (status === 'SUSPENDED') {
    actions.push({ type: 'resume_service' });
  }
  
  const newState: DunningState = {
    ...state,
    status: 'CANCELLED',
    stateEnteredAt: new Date(),
  };
  
  return { state: newState, actions };
}

function processDunningPaused(
  state: DunningState,
  now: Date
): { state: DunningState; actions: ActionDescriptor[] } {
  const { status, stateEnteredAt, config } = state;
  
  if (!ACTIVE_STATES.includes(status)) {
    return { state, actions: [] };
  }
  
  const holidays = getHolidays(config);
  const elapsed = businessDaysBetween(stateEnteredAt, now, holidays);
  
  const newState: DunningState = {
    ...state,
    status: 'PAUSED',
    stateEnteredAt: now,
    pausedFrom: status,
    pausedElapsed: elapsed,
  };
  
  return { state: newState, actions: [] };
}

function processDunningResumed(
  state: DunningState
): { state: DunningState; actions: ActionDescriptor[] } {
  const { status, pausedFrom, pausedElapsed, dueDate, config } = state;
  
  if (status !== 'PAUSED' || !pausedFrom) {
    return { state, actions: [] };
  }
  
  const newStateEnteredAt = new Date();
  
  // Adjust stateEnteredAt to account for time already elapsed before pause
  // We subtract the elapsed days so the timeout resumes from where it left off
  const holidays = getHolidays(config);
  const adjustedStartDate = addBusinessDays(newStateEnteredAt, -(pausedElapsed ?? 0), holidays);
  
  const newState: DunningState = {
    status: pausedFrom,
    dueDate,
    stateEnteredAt: adjustedStartDate,
    config,
  };

  return { state: newState, actions: [] };
}

function processManualAdvance(
  state: DunningState
): { state: DunningState; actions: ActionDescriptor[] } {
  const { status } = state;
  
  if (status === 'PAID' || status === 'WRITTEN_OFF' || status === 'CANCELLED' || status === 'PAUSED') {
    return { state, actions: [] };
  }
  
  if (!ACTIVE_STATES.includes(status) && status !== 'ISSUED' && status !== 'DUE_SOON') {
    return { state, actions: [] };
  }
  
  const nextStatus = getNextStatus(status);
  if (!nextStatus) {
    return { state, actions: [] };
  }
  
  const newState: DunningState = {
    ...state,
    status: nextStatus,
    stateEnteredAt: new Date(),
  };
  
  const actions = getActionsForTransition(status, nextStatus);
   
  return { state: newState, actions };
}

/**
 * Processes a dunning event and returns the new state and actions.
 * This is a pure function that evaluates state transitions based on the event type.
 * 
 * @param state - Current dunning state
 * @param event - Event to process (tick, payment_received, invoice_cancelled, dunning_paused, dunning_resumed, manual_advance)
 * @param now - Current date/time for evaluating time-based transitions
 * @returns ProcessResult containing the new state and action descriptors
 */
export function process(
  state: DunningState,
  event: DunningEvent,
  now: Date
): ProcessResult {
  let result: { state: DunningState; actions: ActionDescriptor[] };
  
  switch (event.type) {
    case 'tick':
      result = processTick(state, now);
      break;
    case 'payment_received':
      result = processPaymentReceived(state);
      break;
    case 'invoice_cancelled':
      result = processInvoiceCancelled(state);
      break;
    case 'dunning_paused':
      result = processDunningPaused(state, now);
      break;
    case 'dunning_resumed':
      result = processDunningResumed(state);
      break;
    case 'manual_advance':
      result = processManualAdvance(state);
      break;
    default:
      result = { state, actions: [] };
  }
  
  return result;
}