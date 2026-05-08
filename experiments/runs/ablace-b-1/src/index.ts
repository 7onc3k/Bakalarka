export type DunningStatus =
  | "ISSUED" | "DUE_SOON" | "OVERDUE" | "GRACE"
  | "REMINDER_1" | "REMINDER_2" | "FINAL_NOTICE"
  | "SUSPENDED" | "WRITTEN_OFF" | "PAID" | "PAUSED" | "CANCELLED"

export type EventType =
  | "tick" | "payment_received" | "invoice_cancelled"
  | "dunning_paused" | "dunning_resumed" | "manual_advance"

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

export interface DunningEvent {
  type: EventType
}

export interface ProcessResult {
  state: DunningState
  actions: ActionDescriptor[]
}

export { addBusinessDays, countBusinessDays, isBusinessDay, isWeekend } from './business-days.js'
export { process } from './dunning.js'

/**
 * Initializes a new dunning instance for an invoice.
 * @param dueDate - The invoice due date
 * @param config - Optional configuration with custom timeouts and holidays
 * @returns Initial dunning state with ISSUED status
 */
export function createInstance(
  dueDate: Date,
  config?: Partial<DunningConfig>
): DunningState {
  return {
    status: 'ISSUED',
    dueDate: new Date(dueDate),
    stateEnteredAt: new Date(),
    config: {
      timeouts: config?.timeouts,
      holidays: config?.holidays,
    },
  }
}