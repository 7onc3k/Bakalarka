import { DunningState, DunningEvent, ProcessResult, DunningStatus, ActionDescriptor } from './types.js';
import { addBusinessDays, countBusinessDays } from './utils/businessDays.js';

const STATE_ORDER: DunningStatus[] = [
  'ISSUED',
  'DUE_SOON',
  'OVERDUE',
  'GRACE',
  'REMINDER_1',
  'REMINDER_2',
  'FINAL_NOTICE',
  'SUSPENDED',
  'WRITTEN_OFF'
];

const TERMINAL_STATES: DunningStatus[] = ['PAID', 'WRITTEN_OFF', 'CANCELLED'];

const PAUSABLE_STATES: DunningStatus[] = ['OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];

function getNextState(currentStatus: DunningStatus): DunningStatus | null {
  const currentIndex = STATE_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= STATE_ORDER.length - 1) {
    return null;
  }
  return STATE_ORDER[currentIndex + 1];
}

function getTransitionTimeout(status: DunningStatus, config: { timeouts?: Partial<Record<DunningStatus, number>> }): number {
  return config.timeouts?.[status] ?? 0;
}

function getTransitionActions(toStatus: DunningStatus): ActionDescriptor[] {
  const actions: ActionDescriptor[] = [];

  if (toStatus === 'DUE_SOON') {
    actions.push({ type: 'send_email', template: 'due_soon_reminder' });
  } else if (toStatus === 'REMINDER_1') {
    actions.push({ type: 'send_email', template: 'first_reminder' });
  } else if (toStatus === 'REMINDER_2') {
    actions.push({ type: 'send_email', template: 'second_reminder' });
  } else if (toStatus === 'FINAL_NOTICE') {
    actions.push({ type: 'send_email', template: 'final_warning' });
  } else if (toStatus === 'SUSPENDED') {
    actions.push({ type: 'suspend_service' });
    actions.push({ type: 'send_email', template: 'service_suspended' });
  } else if (toStatus === 'WRITTEN_OFF') {
    actions.push({ type: 'send_email', template: 'written_off_notice' });
  }

  return actions;
}

function shouldTransitionToNextState(state: DunningState, now: Date): boolean {
  const { status, dueDate, config, stateEnteredAt, pausedFrom, pausedElapsed } = state;
  
  const holidays = config.holidays ?? [];

  if (status === 'ISSUED') {
    const dueSoonTimeout = getTransitionTimeout('DUE_SOON', config);
    const targetDate = addBusinessDays(dueDate, dueSoonTimeout, holidays);
    return now.getTime() >= targetDate.getTime();
  }

  if (pausedFrom !== undefined && pausedElapsed !== undefined) {
    const currentTimeout = getTransitionTimeout(status, config);
    const elapsedWhenPaused = pausedElapsed;
    const additionalDays = countBusinessDays(stateEnteredAt, now, holidays);
    const totalElapsed = elapsedWhenPaused + additionalDays;
    return totalElapsed >= currentTimeout;
  }

  const currentTimeout = getTransitionTimeout(status, config);
  const elapsedDays = countBusinessDays(stateEnteredAt, now, holidays);
  return elapsedDays >= currentTimeout;
}

function handleTickEvent(state: DunningState, now: Date): ProcessResult {
  if (TERMINAL_STATES.includes(state.status) || state.status === 'PAUSED') {
    return { state, actions: [] };
  }

  if (shouldTransitionToNextState(state, now)) {
    const nextStatus = getNextState(state.status);
    if (nextStatus) {
      const actions = getTransitionActions(nextStatus);
      return {
        state: {
          ...state,
          status: nextStatus,
          stateEnteredAt: now
        },
        actions
      };
    }
  }

  return { state, actions: [] };
}

function handlePaymentReceived(state: DunningState): ProcessResult {
  if (TERMINAL_STATES.includes(state.status)) {
    return { state, actions: [] };
  }

  const actions: ActionDescriptor[] = [];
  if (state.status === 'SUSPENDED') {
    actions.push({ type: 'resume_service' });
  }

  return {
    state: {
      ...state,
      status: 'PAID',
      stateEnteredAt: new Date()
    },
    actions
  };
}

function handleInvoiceCancelled(state: DunningState): ProcessResult {
  if (TERMINAL_STATES.includes(state.status)) {
    return { state, actions: [] };
  }

  const actions: ActionDescriptor[] = [];
  if (state.status === 'SUSPENDED') {
    actions.push({ type: 'resume_service' });
  }

  return {
    state: {
      ...state,
      status: 'CANCELLED',
      stateEnteredAt: new Date()
    },
    actions
  };
}

function handleDunningPaused(state: DunningState): ProcessResult {
  if (!PAUSABLE_STATES.includes(state.status)) {
    return { state, actions: [] };
  }

  const now = new Date();
  const holidays = state.config.holidays ?? [];
  const elapsedDays = countBusinessDays(state.stateEnteredAt, now, holidays);

  return {
    state: {
      ...state,
      status: 'PAUSED',
      pausedFrom: state.status,
      pausedElapsed: elapsedDays,
      stateEnteredAt: now
    },
    actions: []
  };
}

function handleDunningResumed(state: DunningState): ProcessResult {
  if (state.status !== 'PAUSED' || !state.pausedFrom) {
    return { state, actions: [] };
  }

  const previousStatus = state.pausedFrom;
  const now = new Date();

  return {
    state: {
      ...state,
      status: previousStatus,
      pausedFrom: undefined,
      pausedElapsed: undefined,
      stateEnteredAt: now
    },
    actions: []
  };
}

function handleManualAdvance(state: DunningState): ProcessResult {
  if (TERMINAL_STATES.includes(state.status) || state.status === 'PAUSED') {
    return { state, actions: [] };
  }

  if (!STATE_ORDER.includes(state.status)) {
    return { state, actions: [] };
  }

  const nextStatus = getNextState(state.status);
  if (!nextStatus) {
    return { state, actions: [] };
  }

  const actions = getTransitionActions(nextStatus);

  return {
    state: {
      ...state,
      status: nextStatus,
      stateEnteredAt: new Date()
    },
    actions
  };
}

/**
 * Processes a dunning event and returns the new state and any resulting actions.
 * This is a pure function that does not modify the input state.
 * 
 * @param state - The current dunning state
 * @param event - The event to process
 * @param now - The current date/time for evaluating timeouts
 * @returns A new state and list of action descriptors
 */
export function process(
  state: DunningState,
  event: DunningEvent,
  now: Date
): ProcessResult {
  switch (event.type) {
    case 'tick':
      return handleTickEvent(state, now);
    case 'payment_received':
      return handlePaymentReceived(state);
    case 'invoice_cancelled':
      return handleInvoiceCancelled(state);
    case 'dunning_paused':
      return handleDunningPaused(state);
    case 'dunning_resumed':
      return handleDunningResumed(state);
    case 'manual_advance':
      return handleManualAdvance(state);
    default:
      return { state, actions: [] };
  }
}