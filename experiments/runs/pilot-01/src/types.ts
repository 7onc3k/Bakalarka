export type Status =
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

export type DunningEvent =
  | 'tick'
  | 'payment_received'
  | 'invoice_cancelled'
  | 'dunning_paused'
  | 'dunning_resumed'
  | 'manual_advance';

export type EmailTemplate =
  | 'due_soon_reminder'
  | 'first_reminder'
  | 'second_reminder'
  | 'final_warning'
  | 'service_suspended'
  | 'written_off_notice';

export type DunningAction =
  | { type: 'send_email'; template: EmailTemplate }
  | { type: 'suspend_service' }
  | { type: 'resume_service' };

export interface Timeouts {
  dueSoonDays: number;
  overdueToGrace: number;
  graceToReminder1: number;
  reminder1ToReminder2: number;
  reminder2ToFinalNotice: number;
  finalNoticeToSuspended: number;
  suspendedToWrittenOff: number;
}

export interface DunningConfig {
  holidays: Date[];
  timeouts: Timeouts;
}

export interface DunningState {
  status: Status;
  dueDate: Date;
  enteredStateAt: Date;
  previousStatus?: Status;
  pausedAt?: Date;
  configuration: DunningConfig;
}

export const DEFAULT_TIMEOUTS: Timeouts = {
  dueSoonDays: 7,
  overdueToGrace: 3,
  graceToReminder1: 7,
  reminder1ToReminder2: 14,
  reminder2ToFinalNotice: 14,
  finalNoticeToSuspended: 7,
  suspendedToWrittenOff: 30,
};

export const DEFAULT_CONFIG: DunningConfig = {
  holidays: [],
  timeouts: DEFAULT_TIMEOUTS,
};

export const TERMINAL_STATUSES: Status[] = ['PAID', 'WRITTEN_OFF', 'CANCELLED'];

export const PAUSABLE_STATUSES: Status[] = [
  'OVERDUE',
  'GRACE',
  'REMINDER_1',
  'REMINDER_2',
  'FINAL_NOTICE',
  'SUSPENDED',
];
