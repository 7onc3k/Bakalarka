export type DunningStatus =
  | 'ISSUED'
  | 'DUE_SOON'
  | 'OVERDUE'
  | 'GRACE'
  | 'REMINDER_1'
  | 'REMINDER_2'
  | 'FINAL_NOTICE'
  | 'SUSPENDED'
  | 'WRITTEN_OFF'
  | 'PAID'
  | 'CANCELLED'
  | 'PAUSED';

export type EventType =
  | 'tick'
  | 'payment_received'
  | 'invoice_cancelled'
  | 'dunning_paused'
  | 'dunning_resumed'
  | 'manual_advance';

export type ActionType = 'send_email' | 'suspend_service' | 'resume_service' | 'schedule_next_check';

export interface SendEmailAction {
  type: 'send_email';
  template: 'due_soon_reminder' | 'first_reminder' | 'second_reminder' | 'final_warning' | 'service_suspended' | 'written_off_notice';
}

export interface SuspendServiceAction {
  type: 'suspend_service';
}

export interface ResumeServiceAction {
  type: 'resume_service';
}

export interface ScheduleNextCheckAction {
  type: 'schedule_next_check';
  days: number;
}

export type Action = SendEmailAction | SuspendServiceAction | ResumeServiceAction | ScheduleNextCheckAction;

export interface DunningConfig {
  timeouts?: {
    dueSoon?: number;
    overdueToGrace?: number;
    graceToReminder1?: number;
    reminder1ToReminder2?: number;
    reminder2ToFinal?: number;
    finalToSuspended?: number;
    suspendedToWrittenOff?: number;
  };
  holidays?: Date[];
}

export interface DunningState {
  status: DunningStatus;
  dueDate: Date;
  config: DunningConfig;
  previousStatus?: DunningStatus;
  stateEnteredAt: Date;
}

export interface ProcessResult {
  state: DunningState;
  actions: Action[];
}

export const ACTIVE_DUNNING_STATUSES: DunningStatus[] = [
  'OVERDUE',
  'GRACE',
  'REMINDER_1',
  'REMINDER_2',
  'FINAL_NOTICE',
  'SUSPENDED'
];

export const TERMINAL_STATUSES: DunningStatus[] = [
  'WRITTEN_OFF',
  'PAID',
  'CANCELLED'
];

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
