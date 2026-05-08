/**
 * All possible statuses for a dunning instance
 */
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

/**
 * All possible event types that can trigger state transitions
 */
export type EventType =
  | "tick"
  | "payment_received"
  | "invoice_cancelled"
  | "dunning_paused"
  | "dunning_resumed"
  | "manual_advance";

/**
 * Event that triggers state transitions in the dunning process
 */
export interface DunningEvent {
  type: EventType;
}

/**
 * Types of actions that can be returned by the dunning process
 */
export type ActionType = "send_email" | "suspend_service" | "resume_service";

/**
 * Descriptor for an action that the consuming application should perform
 */
export interface ActionDescriptor {
  type: ActionType;
  template?: string;
}

/**
 * Configuration for a dunning instance
 */
export interface DunningConfig {
  timeouts?: Partial<Record<DunningStatus, number>>;
  holidays?: Date[];
}

/**
 * State of a dunning instance
 */
export interface DunningState {
  status: DunningStatus;
  dueDate: Date;
  stateEnteredAt: Date;
  config: DunningConfig;
  pausedFrom?: DunningStatus;
  pausedElapsed?: number;
}

/**
 * Result of processing an event
 */
export interface ProcessResult {
  state: DunningState;
  actions: ActionDescriptor[];
}