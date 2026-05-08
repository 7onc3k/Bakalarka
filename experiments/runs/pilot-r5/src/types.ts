export type DunningStatus =
  | "ISSUED"
  | "DUE_SOON"
  | "OVERDUE"
  | "GRACE"
  | "REMINDER_1"
  | "REMINDER_2"
  | "FINAL_NOTICE"
  | "SUSPENDED"
  | "WRITTEN_OFF"
  | "PAID"
  | "PAUSED"
  | "CANCELLED";

export type EventType =
  | "tick"
  | "payment_received"
  | "invoice_cancelled"
  | "dunning_paused"
  | "dunning_resumed"
  | "manual_advance";

export interface DunningEvent {
  type: EventType;
}

export type ActionType = "send_email" | "suspend_service" | "resume_service";

export interface ActionDescriptor {
  type: ActionType;
  template?: string;
}

export interface DunningConfig {
  timeouts?: Partial<Record<DunningStatus, number>>;
  holidays?: Date[];
}

export interface DunningState {
  status: DunningStatus;
  dueDate: Date;
  stateEnteredAt: Date;
  config: DunningConfig;
  pausedFrom?: DunningStatus;
  pausedElapsed?: number;
}

export interface ProcessResult {
  state: DunningState;
  actions: ActionDescriptor[];
}

export const DEFAULT_TIMEOUTS: Record<DunningStatus, number> = {
  ISSUED: -7,
  DUE_SOON: 0,
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

export const ACTIVE_STATUSES: DunningStatus[] = [
  "OVERDUE",
  "GRACE",
  "REMINDER_1",
  "REMINDER_2",
  "FINAL_NOTICE",
  "SUSPENDED",
];

export const TERMINAL_STATUSES: DunningStatus[] = [
  "WRITTEN_OFF",
  "PAID",
  "CANCELLED",
];

export const ESCALATION_ORDER: DunningStatus[] = [
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

export const TRANSITION_ACTIONS: Record<DunningStatus, ActionDescriptor[]> = {
  ISSUED: [],
  DUE_SOON: [{ type: "send_email", template: "due_soon_reminder" }],
  OVERDUE: [],
  GRACE: [],
  REMINDER_1: [{ type: "send_email", template: "first_reminder" }],
  REMINDER_2: [{ type: "send_email", template: "second_reminder" }],
  FINAL_NOTICE: [{ type: "send_email", template: "final_warning" }],
  SUSPENDED: [
    { type: "suspend_service" },
    { type: "send_email", template: "service_suspended" },
  ],
  WRITTEN_OFF: [{ type: "send_email", template: "written_off_notice" }],
  PAID: [],
  PAUSED: [],
  CANCELLED: [],
};