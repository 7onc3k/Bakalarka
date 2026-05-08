import { countBusinessDays, addBusinessDays } from './business-days.js';
import type { DunningStatus, DunningState, DunningEvent, ActionDescriptor, ProcessResult, DunningConfig } from './index.js';

export const DEFAULT_TIMEOUTS: Record<DunningStatus, number> = {
  ISSUED: 0,
  DUE_SOON: -7,
  OVERDUE: 0,
  GRACE: 3,
  REMINDER_1: 7,
  REMINDER_2: 14,
  FINAL_NOTICE: 14,
  SUSPENDED: 7,
  WRITTEN_OFF: 30,
  PAID: 0,
  PAUSED: 0,
  CANCELLED: 0,
};

const ACTIVE_STATUSES: DunningStatus[] = [
  'ISSUED',
  'DUE_SOON',
  'OVERDUE',
  'GRACE',
  'REMINDER_1',
  'REMINDER_2',
  'FINAL_NOTICE',
  'SUSPENDED',
];

const TERMINAL_STATUSES: DunningStatus[] = ['PAID', 'WRITTEN_OFF', 'CANCELLED'];

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
  if (config.timeouts?.[status] !== undefined) {
    return config.timeouts[status]!;
  }
  return DEFAULT_TIMEOUTS[status];
}

function getNextStatus(currentStatus: DunningStatus): DunningStatus | null {
  const currentIndex = ESCALATION_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= ESCALATION_ORDER.length - 1) {
    return null;
  }
  return ESCALATION_ORDER[currentIndex + 1];
}

function getActionsForTransition(fromStatus: DunningStatus, toStatus: DunningStatus): ActionDescriptor[] {
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

function isTransitionDue(
  state: DunningState,
  targetStatus: DunningStatus,
  now: Date
): boolean {
  const timeout = getTimeout(targetStatus, state.config);
  const holidays = state.config.holidays ?? [];
  
  const targetDate = getTargetDate(state.dueDate, state.status, targetStatus, timeout, holidays);
  
  if (!targetDate) {
    return false;
  }
  
  return now >= targetDate;
}

function getTargetDate(
  dueDate: Date,
  currentStatus: DunningStatus,
  targetStatus: DunningStatus,
  timeout: number,
  holidays: Date[]
): Date | null {
  let baseDate: Date;
  
  if (targetStatus === 'DUE_SOON') {
    baseDate = dueDate;
  } else {
    return null;
  }
  
  if (timeout < 0) {
    return addBusinessDays(baseDate, timeout, holidays);
  } else if (timeout > 0) {
    return addBusinessDays(baseDate, timeout, holidays);
  }
  
  return baseDate;
}

function getElapsedDays(state: DunningState, now: Date): number {
  const holidays = state.config.holidays ?? [];
  return countBusinessDays(state.stateEnteredAt, now, holidays);
}

function isOverdueTransitionDue(state: DunningState, now: Date): boolean {
  return now >= state.dueDate;
}

function handleTick(state: DunningState, now: Date): { state: DunningState; actions: ActionDescriptor[] } {
  if (TERMINAL_STATUSES.includes(state.status) || state.status === 'PAUSED') {
    return { state: { ...state }, actions: [] };
  }
  
  if (!ACTIVE_STATUSES.includes(state.status)) {
    return { state: { ...state }, actions: [] };
  }
  
  const nextStatus = getNextStatus(state.status);
  if (!nextStatus) {
    return { state: { ...state }, actions: [] };
  }
  
  let shouldTransition = false;
  
  if (state.status === 'ISSUED' && nextStatus === 'DUE_SOON') {
    shouldTransition = isTransitionDue(state, nextStatus, now);
  } else if (state.status === 'DUE_SOON' && nextStatus === 'OVERDUE') {
    shouldTransition = isOverdueTransitionDue(state, now);
  } else if (state.status === 'OVERDUE' && nextStatus === 'GRACE') {
    const elapsed = getElapsedDays(state, now);
    shouldTransition = elapsed >= getTimeout('GRACE', state.config);
  } else if (state.status === 'GRACE' && nextStatus === 'REMINDER_1') {
    const elapsed = getElapsedDays(state, now);
    shouldTransition = elapsed >= getTimeout('REMINDER_1', state.config);
  } else if (state.status === 'REMINDER_1' && nextStatus === 'REMINDER_2') {
    const elapsed = getElapsedDays(state, now);
    shouldTransition = elapsed >= getTimeout('REMINDER_2', state.config);
  } else if (state.status === 'REMINDER_2' && nextStatus === 'FINAL_NOTICE') {
    const elapsed = getElapsedDays(state, now);
    shouldTransition = elapsed >= getTimeout('FINAL_NOTICE', state.config);
  } else if (state.status === 'FINAL_NOTICE' && nextStatus === 'SUSPENDED') {
    const elapsed = getElapsedDays(state, now);
    shouldTransition = elapsed >= getTimeout('SUSPENDED', state.config);
  } else if (state.status === 'SUSPENDED' && nextStatus === 'WRITTEN_OFF') {
    const elapsed = getElapsedDays(state, now);
    shouldTransition = elapsed >= getTimeout('WRITTEN_OFF', state.config);
  }
  
  if (shouldTransition) {
    const actions = getActionsForTransition(state.status, nextStatus);
    return {
      state: {
        ...state,
        status: nextStatus,
        stateEnteredAt: now,
      },
      actions,
    };
  }
  
  return { state: { ...state }, actions: [] };
}

const PAUSEABLE_STATUSES: DunningStatus[] = [
  'OVERDUE',
  'GRACE',
  'REMINDER_1',
  'REMINDER_2',
  'FINAL_NOTICE',
  'SUSPENDED',
];

function handlePaymentReceived(state: DunningState, now: Date): { state: DunningState; actions: ActionDescriptor[] } {
  if (TERMINAL_STATUSES.includes(state.status)) {
    return { state: { ...state }, actions: [] };
  }

  if (state.status === 'PAUSED') {
    return {
      state: {
        ...state,
        status: 'PAID',
        stateEnteredAt: now,
        pausedFrom: undefined,
        pausedElapsed: undefined,
      },
      actions: [],
    };
  }

  const actions: ActionDescriptor[] = [];
  if (state.status === 'SUSPENDED') {
    actions.push({ type: 'resume_service' });
  }

  return {
    state: {
      ...state,
      status: 'PAID',
      stateEnteredAt: now,
    },
    actions,
  };
}

function handleInvoiceCancelled(state: DunningState, now: Date): { state: DunningState; actions: ActionDescriptor[] } {
  if (TERMINAL_STATUSES.includes(state.status)) {
    return { state: { ...state }, actions: [] };
  }

  if (state.status === 'PAUSED') {
    return {
      state: {
        ...state,
        status: 'CANCELLED',
        stateEnteredAt: now,
        pausedFrom: undefined,
        pausedElapsed: undefined,
      },
      actions: [],
    };
  }

  const actions: ActionDescriptor[] = [];
  if (state.status === 'SUSPENDED') {
    actions.push({ type: 'resume_service' });
  }

  return {
    state: {
      ...state,
      status: 'CANCELLED',
      stateEnteredAt: now,
    },
    actions,
  };
}

function handleDunningPaused(state: DunningState, now: Date): { state: DunningState; actions: ActionDescriptor[] } {
  if (state.status === 'PAUSED') {
    return { state: { ...state }, actions: [] };
  }

  if (!PAUSEABLE_STATUSES.includes(state.status)) {
    return { state: { ...state }, actions: [] };
  }

  const elapsed = getElapsedDays(state, now);

  return {
    state: {
      ...state,
      status: 'PAUSED',
      pausedFrom: state.status,
      pausedElapsed: elapsed,
      stateEnteredAt: now,
    },
    actions: [],
  };
}

function handleDunningResumed(state: DunningState, now: Date): { state: DunningState; actions: ActionDescriptor[] } {
  if (state.status !== 'PAUSED' || !state.pausedFrom) {
    return { state: { ...state }, actions: [] };
  }

  const previousStatus = state.pausedFrom;
  const pausedElapsed = state.pausedElapsed ?? 0;

  return {
    state: {
      ...state,
      status: previousStatus,
      stateEnteredAt: new Date(now.getTime() - pausedElapsed * 24 * 60 * 60 * 1000),
      pausedFrom: undefined,
      pausedElapsed: undefined,
    },
    actions: [],
  };
}

function handleManualAdvance(state: DunningState, now: Date): { state: DunningState; actions: ActionDescriptor[] } {
  if (TERMINAL_STATUSES.includes(state.status) || state.status === 'PAUSED' || state.status === 'ISSUED' || state.status === 'DUE_SOON') {
    return { state: { ...state }, actions: [] };
  }

  const nextStatus = getNextStatus(state.status);
  if (!nextStatus) {
    return { state: { ...state }, actions: [] };
  }

  const actions = getActionsForTransition(state.status, nextStatus);

  return {
    state: {
      ...state,
      status: nextStatus,
      stateEnteredAt: now,
    },
    actions,
  };
}

export function processEvent(state: DunningState, event: DunningEvent, now: Date): ProcessResult {
  if (event.type === 'tick') {
    return handleTick(state, now);
  }

  if (event.type === 'payment_received') {
    return handlePaymentReceived(state, now);
  }

  if (event.type === 'invoice_cancelled') {
    return handleInvoiceCancelled(state, now);
  }

  if (event.type === 'dunning_paused') {
    return handleDunningPaused(state, now);
  }

  if (event.type === 'dunning_resumed') {
    return handleDunningResumed(state, now);
  }

  if (event.type === 'manual_advance') {
    return handleManualAdvance(state, now);
  }

  return { state, actions: [] };
}

export const process = processEvent;