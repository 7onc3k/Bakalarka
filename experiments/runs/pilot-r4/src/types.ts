export type DunningStatus =
  | "ISSUED" | "DUE_SOON" | "OVERDUE" | "GRACE"
  | "REMINDER_1" | "REMINDER_2" | "FINAL_NOTICE"
  | "SUSPENDED" | "WRITTEN_OFF" | "PAID" | "PAUSED" | "CANCELLED"

export type EventType =
  | "tick" | "payment_received" | "invoice_cancelled"
  | "dunning_paused" | "dunning_resumed" | "manual_advance"

export interface DunningEvent {
  type: EventType
}

export type ActionType = "send_email" | "suspend_service" | "resume_service"

export interface ActionDescriptor {
  type: ActionType
  template?: string
}

export interface DunningConfig {
  timeouts?: Partial<Record<DunningStatus, number>>
  holidays?: Date[]
}

export interface DunningState {
  status: DunningStatus
  dueDate: Date
  stateEnteredAt: Date
  config: DunningConfig
  pausedFrom?: DunningStatus
  pausedElapsed?: number
}

export interface ProcessResult {
  state: DunningState
  actions: ActionDescriptor[]
}