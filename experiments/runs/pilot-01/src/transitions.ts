import { Status, DunningState, DunningAction, TERMINAL_STATUSES, PAUSABLE_STATUSES } from './types';
import { hasBusinessDaysElapsed, isDueSoonTriggered, isDueDateReached, isSameDay } from './business-days';

export interface TransitionResult {
  status: Status;
  actions: DunningAction[];
}

export function getNextStatus(current: Status): Status | null {
  const sequence: Status[] = [
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
  
  const index = sequence.indexOf(current);
  if (index === -1 || index === sequence.length - 1) {
    return null;
  }
  return sequence[index + 1];
}

export function getActionsForTransition(from: Status, to: Status): DunningAction[] {
  const actions: DunningAction[] = [];
  
  if (to === 'DUE_SOON') {
    actions.push({ type: 'send_email', template: 'due_soon_reminder' });
  } else if (to === 'REMINDER_1') {
    actions.push({ type: 'send_email', template: 'first_reminder' });
  } else if (to === 'REMINDER_2') {
    actions.push({ type: 'send_email', template: 'second_reminder' });
  } else if (to === 'FINAL_NOTICE') {
    actions.push({ type: 'send_email', template: 'final_warning' });
  } else if (to === 'SUSPENDED') {
    actions.push({ type: 'suspend_service' });
    actions.push({ type: 'send_email', template: 'service_suspended' });
  } else if (to === 'WRITTEN_OFF') {
    actions.push({ type: 'send_email', template: 'written_off_notice' });
  } else if (to === 'PAID' && from === 'SUSPENDED') {
    actions.push({ type: 'resume_service' });
  } else if (to === 'CANCELLED' && from === 'SUSPENDED') {
    actions.push({ type: 'resume_service' });
  }
  
  return actions;
}

export function isTerminal(status: Status): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function isPausable(status: Status): boolean {
  return PAUSABLE_STATUSES.includes(status);
}

export function evaluateTickTransition(state: DunningState, now: Date): TransitionResult | null {
  const { status, dueDate, enteredStateAt, configuration } = state;
  const { holidays, timeouts } = configuration;
  
  if (isTerminal(status) || status === 'PAUSED') {
    return null;
  }
  
  switch (status) {
    case 'ISSUED': {
      if (isDueSoonTriggered(dueDate, timeouts.dueSoonDays, now, holidays)) {
        const nextStatus: Status = 'DUE_SOON';
        return {
          status: nextStatus,
          actions: getActionsForTransition(status, nextStatus),
        };
      }
      return null;
    }
    
    case 'DUE_SOON': {
      if (isDueDateReached(dueDate, now)) {
        return { status: 'OVERDUE', actions: [] };
      }
      return null;
    }
    
    case 'OVERDUE': {
      if (hasBusinessDaysElapsed(enteredStateAt, now, timeouts.overdueToGrace, holidays)) {
        return { status: 'GRACE', actions: [] };
      }
      return null;
    }
    
    case 'GRACE': {
      if (hasBusinessDaysElapsed(enteredStateAt, now, timeouts.graceToReminder1, holidays)) {
        const nextStatus: Status = 'REMINDER_1';
        return {
          status: nextStatus,
          actions: getActionsForTransition(status, nextStatus),
        };
      }
      return null;
    }
    
    case 'REMINDER_1': {
      if (hasBusinessDaysElapsed(enteredStateAt, now, timeouts.reminder1ToReminder2, holidays)) {
        const nextStatus: Status = 'REMINDER_2';
        return {
          status: nextStatus,
          actions: getActionsForTransition(status, nextStatus),
        };
      }
      return null;
    }
    
    case 'REMINDER_2': {
      if (hasBusinessDaysElapsed(enteredStateAt, now, timeouts.reminder2ToFinalNotice, holidays)) {
        const nextStatus: Status = 'FINAL_NOTICE';
        return {
          status: nextStatus,
          actions: getActionsForTransition(status, nextStatus),
        };
      }
      return null;
    }
    
    case 'FINAL_NOTICE': {
      if (hasBusinessDaysElapsed(enteredStateAt, now, timeouts.finalNoticeToSuspended, holidays)) {
        const nextStatus: Status = 'SUSPENDED';
        return {
          status: nextStatus,
          actions: getActionsForTransition(status, nextStatus),
        };
      }
      return null;
    }
    
    case 'SUSPENDED': {
      if (hasBusinessDaysElapsed(enteredStateAt, now, timeouts.suspendedToWrittenOff, holidays)) {
        const nextStatus: Status = 'WRITTEN_OFF';
        return {
          status: nextStatus,
          actions: getActionsForTransition(status, nextStatus),
        };
      }
      return null;
    }
    
    default:
      return null;
  }
}
