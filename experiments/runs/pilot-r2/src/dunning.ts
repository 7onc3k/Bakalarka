import type { DunningStatus, DunningState, DunningConfig, ActionDescriptor } from './types.js';
import { addBusinessDays, getBusinessDaysBetween } from './businessDays.js';

export const DEFAULT_TIMEOUTS: Record<DunningStatus, number> = {
  ISSUED: -7,
  DUE_SOON: 0,
  OVERDUE: 3,
  GRACE: 7,
  REMINDER_1: 14,
  REMINDER_2: 14,
  FINAL_NOTICE: 7,
  SUSPENDED: 30,
  WRITTEN_OFF: Infinity,
  PAID: Infinity,
  PAUSED: Infinity,
  CANCELLED: Infinity
};

export const ESCALATION_ORDER: DunningStatus[] = [
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

export const TERMINAL_STATES: DunningStatus[] = ['PAID', 'WRITTEN_OFF', 'CANCELLED'];

export const PAUSEABLE_STATES: DunningStatus[] = [
  'OVERDUE',
  'GRACE',
  'REMINDER_1',
  'REMINDER_2',
  'FINAL_NOTICE',
  'SUSPENDED'
];

export function getTimeout(status: DunningStatus, config: DunningConfig): number {
  if (config.timeouts && config.timeouts[status] !== undefined) {
    return config.timeouts[status]!;
  }
  return DEFAULT_TIMEOUTS[status];
}

export function getHolidays(config: DunningConfig): readonly Date[] {
  return config.holidays ?? [];
}

export function calculateTargetDate(
  dueDate: Date,
  status: DunningStatus,
  config: DunningConfig
): Date {
  const timeout = getTimeout(status, config);
  const holidays = getHolidays(config);
  
  if (timeout < 0) {
    return addBusinessDays(dueDate, timeout, holidays);
  }
  
  return addBusinessDays(dueDate, timeout, holidays);
}

export function shouldTransition(
  currentStatus: DunningStatus,
  stateEnteredAt: Date,
  now: Date,
  config: DunningConfig,
  dueDate: Date,
  pausedFrom?: DunningStatus,
  pausedElapsed?: number
): boolean {
  if (TERMINAL_STATES.includes(currentStatus)) {
    return false;
  }
  
  const timeout = getTimeout(currentStatus, config);
  
  if (timeout === Infinity) {
    return false;
  }
  
  const holidays = getHolidays(config);
  
  let elapsed: number;
  
  if (pausedFrom !== undefined && pausedElapsed !== undefined) {
    const currentElapsed = getBusinessDaysBetween(stateEnteredAt, now, holidays);
    elapsed = pausedElapsed + currentElapsed;
  } else {
    elapsed = getBusinessDaysBetween(stateEnteredAt, now, holidays);
  }
  
  if (currentStatus === 'ISSUED') {
    const targetDate = calculateTargetDate(dueDate, currentStatus, config);
    return now >= targetDate;
  }
  
  if (currentStatus === 'DUE_SOON') {
    return now >= dueDate;
  }
  
  return elapsed >= timeout;
}

export function getNextStatus(currentStatus: DunningStatus): DunningStatus | null {
  const currentIndex = ESCALATION_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === ESCALATION_ORDER.length - 1) {
    return null;
  }
  return ESCALATION_ORDER[currentIndex + 1];
}

export function canPause(status: DunningStatus): boolean {
  return PAUSEABLE_STATES.includes(status);
}

export function getResumeStatus(state: DunningState): DunningStatus {
  return state.pausedFrom ?? state.status;
}

export function getResumeElapsed(state: DunningState): number | undefined {
  return state.pausedElapsed;
}

export function getPausedElapsed(
  stateEnteredAt: Date,
  now: Date,
  config: DunningConfig
): number {
  const holidays = getHolidays(config);
  return getBusinessDaysBetween(stateEnteredAt, now, holidays);
}

export function getActionsForTransition(_fromStatus: DunningStatus, toStatus: DunningStatus): ActionDescriptor[] {
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

export function createState(
  status: DunningStatus,
  dueDate: Date,
  now: Date,
  config: DunningConfig,
  pausedFrom?: DunningStatus,
  pausedElapsed?: number
): DunningState {
  return {
    status,
    dueDate,
    stateEnteredAt: now,
    config,
    ...(pausedFrom !== undefined && { pausedFrom }),
    ...(pausedElapsed !== undefined && { pausedElapsed })
  };
}