import {
  DunningStatus,
  EventType,
  DunningState,
  Action,
  DunningConfig,
  ProcessResult,
  ACTIVE_DUNNING_STATUSES,
  TERMINAL_STATUSES,
  ESCALATION_ORDER,
  SendEmailAction,
  SuspendServiceAction,
  ResumeServiceAction
} from './types';
import { countBusinessDays, addBusinessDays, normalizeDate } from './business-days';
import { getTimeouts, getHolidays } from './timeouts';

export function createDunning(dueDate: Date, config?: DunningConfig): DunningState {
  return {
    status: 'ISSUED',
    dueDate: normalizeDate(dueDate),
    config: config ?? {},
    stateEnteredAt: new Date()
  };
}

export function getNextStatus(currentStatus: DunningStatus): DunningStatus | null {
  const currentIndex = ESCALATION_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= ESCALATION_ORDER.length - 1) {
    return null;
  }
  return ESCALATION_ORDER[currentIndex + 1];
}

export function getTimeoutDays(fromStatus: DunningStatus, timeouts: ReturnType<typeof getTimeouts>): number | null {
  switch (fromStatus) {
    case 'ISSUED':
      return timeouts.dueSoon;
    case 'OVERDUE':
      return timeouts.overdueToGrace;
    case 'GRACE':
      return timeouts.graceToReminder1;
    case 'REMINDER_1':
      return timeouts.reminder1ToReminder2;
    case 'REMINDER_2':
      return timeouts.reminder2ToFinal;
    case 'FINAL_NOTICE':
      return timeouts.finalToSuspended;
    case 'SUSPENDED':
      return timeouts.suspendedToWrittenOff;
    default:
      return null;
  }
}

export function isTerminalStatus(status: DunningStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function isActiveDunningStatus(status: DunningStatus): boolean {
  return ACTIVE_DUNNING_STATUSES.includes(status);
}

export function getActionsForTransition(
  fromStatus: DunningStatus,
  toStatus: DunningStatus
): Action[] {
  const actions: Action[] = [];

  if (toStatus === 'DUE_SOON') {
    actions.push({ type: 'send_email', template: 'due_soon_reminder' } as SendEmailAction);
  } else if (toStatus === 'REMINDER_1') {
    actions.push({ type: 'send_email', template: 'first_reminder' } as SendEmailAction);
  } else if (toStatus === 'REMINDER_2') {
    actions.push({ type: 'send_email', template: 'second_reminder' } as SendEmailAction);
  } else if (toStatus === 'FINAL_NOTICE') {
    actions.push({ type: 'send_email', template: 'final_warning' } as SendEmailAction);
  } else if (toStatus === 'SUSPENDED') {
    actions.push({ type: 'suspend_service' } as SuspendServiceAction);
    actions.push({ type: 'send_email', template: 'service_suspended' } as SendEmailAction);
  } else if (toStatus === 'WRITTEN_OFF') {
    actions.push({ type: 'send_email', template: 'written_off_notice' } as SendEmailAction);
  }

  return actions;
}

export function getDueSoonTargetDate(dueDate: Date, dueSoonDays: number): Date {
  const target = new Date(dueDate);
  target.setDate(target.getDate() - dueSoonDays);
  return target;
}

export function process(state: DunningState, event: EventType, now: Date): ProcessResult {
  const normalizedNow = normalizeDate(now);
  const timeouts = getTimeouts(state.config);
  const holidays = getHolidays(state.config);

  if (isTerminalStatus(state.status)) {
    return { state, actions: [] };
  }

  if (event === 'payment_received') {
    const actions: Action[] = [];
    if (state.status === 'SUSPENDED') {
      actions.push({ type: 'resume_service' } as ResumeServiceAction);
    }
    return {
      state: {
        ...state,
        status: 'PAID',
        stateEnteredAt: normalizedNow
      },
      actions
    };
  }

  if (event === 'invoice_cancelled') {
    const actions: Action[] = [];
    if (state.status === 'SUSPENDED') {
      actions.push({ type: 'resume_service' } as ResumeServiceAction);
    }
    return {
      state: {
        ...state,
        status: 'CANCELLED',
        stateEnteredAt: normalizedNow
      },
      actions
    };
  }

  if (event === 'dunning_paused') {
    if (!isActiveDunningStatus(state.status)) {
      return { state, actions: [] };
    }
    return {
      state: {
        ...state,
        status: 'PAUSED',
        previousStatus: state.status,
        stateEnteredAt: normalizedNow
      },
      actions: []
    };
  }

  if (event === 'dunning_resumed') {
    if (state.status !== 'PAUSED') {
      return { state, actions: [] };
    }
    return {
      state: {
        ...state,
        status: state.previousStatus ?? state.status,
        previousStatus: undefined,
        stateEnteredAt: normalizedNow
      },
      actions: []
    };
  }

  if (event === 'manual_advance') {
    if (!isActiveDunningStatus(state.status) && state.status !== 'ISSUED' && state.status !== 'DUE_SOON') {
      return { state, actions: [] };
    }
    const nextStatus = getNextStatus(state.status);
    if (!nextStatus) {
      return { state, actions: [] };
    }
    const transitionActions = getActionsForTransition(state.status, nextStatus);
    return {
      state: {
        ...state,
        status: nextStatus,
        stateEnteredAt: normalizedNow
      },
      actions: transitionActions
    };
  }

  if (event === 'tick') {
    return processTick(state, normalizedNow, timeouts, holidays);
  }

  return { state, actions: [] };
}

function processTick(
  state: DunningState,
  now: Date,
  timeouts: ReturnType<typeof getTimeouts>,
  holidays: Date[]
): ProcessResult {
  const dueDate = normalizeDate(state.dueDate);

  if (state.status === 'ISSUED') {
    const dueSoonTarget = getDueSoonTargetDate(dueDate, timeouts.dueSoon);
    if (now >= dueSoonTarget) {
      const actions = getActionsForTransition('ISSUED', 'DUE_SOON');
      return {
        state: {
          ...state,
          status: 'DUE_SOON',
          stateEnteredAt: now
        },
        actions
      };
    }
  }

  if (state.status === 'DUE_SOON') {
    if (now >= dueDate) {
      return {
        state: {
          ...state,
          status: 'OVERDUE',
          stateEnteredAt: dueDate
        },
        actions: []
      };
    }
  }

  if (state.status === 'OVERDUE') {
    const targetDate = addBusinessDays(state.stateEnteredAt, timeouts.overdueToGrace, holidays);
    if (now >= targetDate) {
      return {
        state: {
          ...state,
          status: 'GRACE',
          stateEnteredAt: targetDate
        },
        actions: []
      };
    }
  }

  if (state.status === 'GRACE') {
    const targetDate = addBusinessDays(state.stateEnteredAt, timeouts.graceToReminder1, holidays);
    if (now >= targetDate) {
      const actions = getActionsForTransition('GRACE', 'REMINDER_1');
      return {
        state: {
          ...state,
          status: 'REMINDER_1',
          stateEnteredAt: targetDate
        },
        actions
      };
    }
  }

  if (state.status === 'REMINDER_1') {
    const targetDate = addBusinessDays(state.stateEnteredAt, timeouts.reminder1ToReminder2, holidays);
    if (now >= targetDate) {
      const actions = getActionsForTransition('REMINDER_1', 'REMINDER_2');
      return {
        state: {
          ...state,
          status: 'REMINDER_2',
          stateEnteredAt: targetDate
        },
        actions
      };
    }
  }

  if (state.status === 'REMINDER_2') {
    const targetDate = addBusinessDays(state.stateEnteredAt, timeouts.reminder2ToFinal, holidays);
    if (now >= targetDate) {
      const actions = getActionsForTransition('REMINDER_2', 'FINAL_NOTICE');
      return {
        state: {
          ...state,
          status: 'FINAL_NOTICE',
          stateEnteredAt: targetDate
        },
        actions
      };
    }
  }

  if (state.status === 'FINAL_NOTICE') {
    const targetDate = addBusinessDays(state.stateEnteredAt, timeouts.finalToSuspended, holidays);
    if (now >= targetDate) {
      const actions = getActionsForTransition('FINAL_NOTICE', 'SUSPENDED');
      return {
        state: {
          ...state,
          status: 'SUSPENDED',
          stateEnteredAt: targetDate
        },
        actions
      };
    }
  }

  if (state.status === 'SUSPENDED') {
    const targetDate = addBusinessDays(state.stateEnteredAt, timeouts.suspendedToWrittenOff, holidays);
    if (now >= targetDate) {
      const actions = getActionsForTransition('SUSPENDED', 'WRITTEN_OFF');
      return {
        state: {
          ...state,
          status: 'WRITTEN_OFF',
          stateEnteredAt: targetDate
        },
        actions
      };
    }
  }

  return { state, actions: [] };
}
