export type DunningStatus =
  | "ISSUED" | "DUE_SOON" | "OVERDUE" | "GRACE"
  | "REMINDER_1" | "REMINDER_2" | "FINAL_NOTICE"
  | "SUSPENDED" | "WRITTEN_OFF" | "PAID" | "PAUSED" | "CANCELLED"

export const DunningStatus: readonly DunningStatus[] = [
  "ISSUED", "DUE_SOON", "OVERDUE", "GRACE",
  "REMINDER_1", "REMINDER_2", "FINAL_NOTICE",
  "SUSPENDED", "WRITTEN_OFF", "PAID", "PAUSED", "CANCELLED"
]

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

import { isBusinessDay, countBusinessDays, addBusinessDays } from './businessDays.js'

export { isBusinessDay, countBusinessDays, addBusinessDays }

const DEFAULT_TIMEOUTS: Record<DunningStatus, number> = {
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
}

function getTimeout(status: DunningStatus, config: DunningConfig): number {
  if (config.timeouts && config.timeouts[status] !== undefined) {
    return config.timeouts[status]
  }
  return DEFAULT_TIMEOUTS[status]
}

function getElapsedDays(state: DunningState, now: Date): number {
  const startOfDay = (d: Date) => {
    const date = new Date(d)
    date.setHours(12, 0, 0, 0)
    return date.getTime()
  }
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.floor((startOfDay(now) - startOfDay(state.stateEnteredAt)) / msPerDay)
}

function getDaysUntilDueDate(state: DunningState, now: Date): number {
  const startOfDay = (d: Date) => {
    const date = new Date(d)
    date.setHours(12, 0, 0, 0)
    return date.getTime()
  }
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.floor((startOfDay(state.dueDate) - startOfDay(now)) / msPerDay)
}

const ACTIVE_STATES: DunningStatus[] = [
  'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'
]

const ESCALATION_SEQUENCE: DunningStatus[] = [
  'OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED', 'WRITTEN_OFF'
]

const TERMINAL_STATES: DunningStatus[] = ['PAID', 'WRITTEN_OFF', 'CANCELLED']

const ACTION_TEMPLATES: Record<DunningStatus, ActionDescriptor[]> = {
  ISSUED: [],
  DUE_SOON: [{ type: 'send_email', template: 'due_soon_reminder' }],
  OVERDUE: [],
  GRACE: [],
  REMINDER_1: [{ type: 'send_email', template: 'first_reminder' }],
  REMINDER_2: [{ type: 'send_email', template: 'second_reminder' }],
  FINAL_NOTICE: [{ type: 'send_email', template: 'final_warning' }],
  SUSPENDED: [
    { type: 'suspend_service' },
    { type: 'send_email', template: 'service_suspended' }
  ],
  WRITTEN_OFF: [{ type: 'send_email', template: 'written_off_notice' }],
  PAID: [],
  PAUSED: [],
  CANCELLED: []
}

function shouldTransition(state: DunningState, now: Date): { should: boolean; targetStatus?: DunningStatus } {
  if (state.status === 'ISSUED') {
    const daysUntilDue = getDaysUntilDueDate(state, now)
    const timeout = getTimeout('ISSUED', state.config)
    if (daysUntilDue >= Math.abs(timeout) && timeout < 0) {
      return { should: true, targetStatus: 'DUE_SOON' }
    }
  }

  if (state.status === 'DUE_SOON') {
    const daysUntilDue = getDaysUntilDueDate(state, now)
    if (daysUntilDue <= 0) {
      return { should: true, targetStatus: 'OVERDUE' }
    }
  }

  if (state.status === 'PAUSED') {
    return { should: false }
  }

  if (ACTIVE_STATES.includes(state.status)) {
    const elapsed = getElapsedDays(state, now)
    const timeout = getTimeout(state.status, state.config)
    if (elapsed >= timeout) {
      const currentIndex = ESCALATION_SEQUENCE.indexOf(state.status)
      if (currentIndex < ESCALATION_SEQUENCE.length - 1) {
        return { should: true, targetStatus: ESCALATION_SEQUENCE[currentIndex + 1] }
      }
    }
  }

  return { should: false }
}

function handlePayment(state: DunningState): { newStatus: DunningStatus; actions: ActionDescriptor[] } {
  const actions: ActionDescriptor[] = []
  if (state.status === 'SUSPENDED') {
    actions.push({ type: 'resume_service' })
  }
  return { newStatus: 'PAID', actions }
}

function handleCancellation(state: DunningState): { newStatus: DunningStatus; actions: ActionDescriptor[] } {
  const actions: ActionDescriptor[] = []
  if (state.status === 'SUSPENDED') {
    actions.push({ type: 'resume_service' })
  }
  return { newStatus: 'CANCELLED', actions }
}

function handlePause(state: DunningState, now: Date): DunningState {
  const elapsed = getElapsedDays(state, now)
  return {
    ...state,
    status: 'PAUSED',
    pausedFrom: state.status,
    pausedElapsed: elapsed,
    stateEnteredAt: now
  }
}

function handleResume(state: DunningState): DunningState {
  const previousStatus = state.pausedFrom
  if (!previousStatus) {
    return state
  }
  return {
    ...state,
    status: previousStatus,
    pausedFrom: undefined,
    pausedElapsed: undefined,
    stateEnteredAt: new Date()
  }
}

function handleManualAdvance(state: DunningState): { newStatus: DunningStatus; actions: ActionDescriptor[] } {
  const currentIndex = ESCALATION_SEQUENCE.indexOf(state.status)
  if (currentIndex < ESCALATION_SEQUENCE.length - 1) {
    const newStatus = ESCALATION_SEQUENCE[currentIndex + 1]
    return {
      newStatus,
      actions: [...ACTION_TEMPLATES[newStatus]]
    }
  }
  return { newStatus: state.status, actions: [] }
}

function processEvent(
  state: DunningState,
  event: DunningEvent,
  now: Date
): ProcessResult {
  if (event.type === 'tick') {
    const transition = shouldTransition(state, now)
    if (transition.should && transition.targetStatus) {
      const newStatus = transition.targetStatus
      return {
        state: {
          ...state,
          status: newStatus,
          stateEnteredAt: now
        },
        actions: [...ACTION_TEMPLATES[newStatus]]
      }
    }
    return { state, actions: [] }
  }

  if (event.type === 'payment_received') {
    if (TERMINAL_STATES.includes(state.status)) {
      return { state, actions: [] }
    }
    const result = handlePayment(state)
    return {
      state: {
        ...state,
        status: result.newStatus,
        stateEnteredAt: now
      },
      actions: result.actions
    }
  }

  if (event.type === 'invoice_cancelled') {
    if (['PAID', 'WRITTEN_OFF', 'CANCELLED'].includes(state.status)) {
      return { state, actions: [] }
    }
    const result = handleCancellation(state)
    return {
      state: {
        ...state,
        status: result.newStatus,
        stateEnteredAt: now
      },
      actions: result.actions
    }
  }

  if (event.type === 'dunning_paused') {
    if (!ACTIVE_STATES.includes(state.status)) {
      return { state, actions: [] }
    }
    const newState = handlePause(state, now)
    return { state: newState, actions: [] }
  }

  if (event.type === 'dunning_resumed') {
    if (state.status !== 'PAUSED') {
      return { state, actions: [] }
    }
    const newState = handleResume(state)
    return { state: newState, actions: [] }
  }

  if (event.type === 'manual_advance') {
    if (!ACTIVE_STATES.includes(state.status)) {
      return { state, actions: [] }
    }
    const result = handleManualAdvance(state)
    if (result.newStatus === state.status) {
      return { state, actions: [] }
    }
    return {
      state: {
        ...state,
        status: result.newStatus,
        stateEnteredAt: now
      },
      actions: result.actions
    }
  }

  return { state, actions: [] }
}

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
      holidays: config?.holidays
    }
  }
}

/**
 * Processes a dunning event and returns the new state and actions.
 * @param state - Current dunning state
 * @param event - Event to process (tick, payment_received, invoice_cancelled, dunning_paused, dunning_resumed, manual_advance)
 * @param now - Current date/time for evaluating time-based transitions
 * @returns ProcessResult containing new state and action descriptors
 */
export function process(
  state: DunningState,
  event: DunningEvent,
  now: Date
): ProcessResult {
  return processEvent(state, event, now)
}