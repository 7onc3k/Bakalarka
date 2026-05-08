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

function normalizeDate(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date: Date, holidays: Date[]): boolean {
  const normalized = normalizeDate(date);
  return holidays.some(h => normalizeDate(h).getTime() === normalized.getTime());
}

function isBusinessDayInternal(date: Date, holidays: Date[]): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays);
}

export function countBusinessDays(start: Date, end: Date, holidays: Date[] = []): number {
  const startDate = normalizeDate(start);
  const endDate = normalizeDate(end);
  
  if (startDate.getTime() === endDate.getTime()) {
    return 0;
  }
  
  const [earlier, later] = startDate.getTime() < endDate.getTime() 
    ? [startDate, endDate] 
    : [endDate, startDate];
  
  let count = 0;
  const current = new Date(earlier);
  
  while (current.getTime() < later.getTime()) {
    current.setDate(current.getDate() + 1);
    if (isBusinessDayInternal(current, holidays)) {
      count++;
    }
  }
  
  return count;
}

export function addBusinessDays(date: Date, days: number, holidays: Date[] = []): Date {
  const result = new Date(date);
  let remaining = days;
  
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDayInternal(result, holidays)) {
      remaining--;
    }
  }
  
  return result;
}

export function isBusinessDay(date: Date, holidays: Date[] = []): boolean {
  return isBusinessDayInternal(date, holidays);
}

/**
 * Creates a new dunning instance for an invoice.
 * @param dueDate - The invoice due date
 * @param config - Optional configuration (timeouts, holidays)
 * @returns Initial dunning state starting at ISSUED status
 */
export function createInstance(
  dueDate: Date,
  config?: Partial<DunningConfig>
): DunningState {
  return {
    status: 'ISSUED',
    dueDate,
    stateEnteredAt: new Date(),
    config: config || {}
  };
}

const ACTIVE_STATES: DunningStatus[] = ['OVERDUE', 'GRACE', 'REMINDER_1', 'REMINDER_2', 'FINAL_NOTICE', 'SUSPENDED'];
const TERMINAL_STATES: DunningStatus[] = ['PAID', 'WRITTEN_OFF', 'CANCELLED'];

const DEFAULT_TIMEOUTS: Record<string, number> = {
  DUE_SOON: 7,
  OVERDUE: 3,
  GRACE: 7,
  REMINDER_1: 14,
  REMINDER_2: 14,
  FINAL_NOTICE: 7,
  SUSPENDED: 30
};

const NEXT_STATE: Record<DunningStatus, DunningStatus | null> = {
  'ISSUED': 'DUE_SOON',
  'DUE_SOON': 'OVERDUE',
  'OVERDUE': 'GRACE',
  'GRACE': 'REMINDER_1',
  'REMINDER_1': 'REMINDER_2',
  'REMINDER_2': 'FINAL_NOTICE',
  'FINAL_NOTICE': 'SUSPENDED',
  'SUSPENDED': 'WRITTEN_OFF',
  'WRITTEN_OFF': null,
  'PAID': null,
  'PAUSED': null,
  'CANCELLED': null
};

const ACTIONS_FOR_TRANSITION: Record<DunningStatus, ActionDescriptor[]> = {
  'ISSUED': [],
  'DUE_SOON': [{ type: 'send_email', template: 'due_soon_reminder' }],
  'OVERDUE': [],
  'GRACE': [],
  'REMINDER_1': [{ type: 'send_email', template: 'first_reminder' }],
  'REMINDER_2': [{ type: 'send_email', template: 'second_reminder' }],
  'FINAL_NOTICE': [{ type: 'send_email', template: 'final_warning' }],
  'SUSPENDED': [{ type: 'suspend_service' }, { type: 'send_email', template: 'service_suspended' }],
  'WRITTEN_OFF': [{ type: 'send_email', template: 'written_off_notice' }],
  'PAID': [],
  'PAUSED': [],
  'CANCELLED': []
};

function getElapsedDays(state: DunningState, now: Date): number {
  const holidays = state.config.holidays || [];
  if (state.pausedFrom && state.pausedElapsed !== undefined) {
    const pausedDays = countBusinessDays(state.stateEnteredAt, now, holidays);
    return state.pausedElapsed + pausedDays;
  }
  return countBusinessDays(state.stateEnteredAt, now, holidays);
}

function getTimeout(status: DunningStatus, config: DunningConfig): number | undefined {
  return config.timeouts?.[status] ?? DEFAULT_TIMEOUTS[status];
}

function processTick(state: DunningState, now: Date): ProcessResult {
  if (TERMINAL_STATES.includes(state.status) || state.status === 'PAUSED') {
    return { state, actions: [] };
  }

  const holidays = state.config.holidays || [];
  let elapsed: number;

  if (state.status === 'ISSUED') {
    const targetDate = addBusinessDays(state.dueDate, -7, holidays);
    if (now >= targetDate) {
      const newState: DunningState = {
        ...state,
        status: 'DUE_SOON',
        stateEnteredAt: now
      };
      return {
        state: newState,
        actions: ACTIONS_FOR_TRANSITION['DUE_SOON']
      };
    }
    return { state, actions: [] };
  }

  if (state.status === 'DUE_SOON') {
    if (now >= state.dueDate) {
      const newState: DunningState = {
        ...state,
        status: 'OVERDUE',
        stateEnteredAt: now
      };
      return {
        state: newState,
        actions: ACTIONS_FOR_TRANSITION['OVERDUE']
      };
    }
    return { state, actions: [] };
  }

  if (ACTIVE_STATES.includes(state.status)) {
    const timeout = getTimeout(state.status, state.config);
    if (timeout === undefined) {
      return { state, actions: [] };
    }

    elapsed = getElapsedDays(state, now);

    if (elapsed >= timeout) {
      const nextStatus = NEXT_STATE[state.status];
      if (nextStatus === null) {
        return { state, actions: [] };
      }

      const newState: DunningState = {
        ...state,
        status: nextStatus,
        stateEnteredAt: now
      };

      return {
        state: newState,
        actions: ACTIONS_FOR_TRANSITION[nextStatus]
      };
    }
  }

  return { state, actions: [] };
}

function processPayment(state: DunningState): ProcessResult {
  if (TERMINAL_STATES.includes(state.status)) {
    return { state, actions: [] };
  }

  const actions: ActionDescriptor[] = [];
  if (state.status === 'SUSPENDED') {
    actions.push({ type: 'resume_service' });
  }

  const newState: DunningState = {
    ...state,
    status: 'PAID',
    stateEnteredAt: new Date()
  };

  return { state: newState, actions };
}

function processCancellation(state: DunningState): ProcessResult {
  if (['PAID', 'WRITTEN_OFF', 'CANCELLED'].includes(state.status)) {
    return { state, actions: [] };
  }

  const actions: ActionDescriptor[] = [];
  if (state.status === 'SUSPENDED') {
    actions.push({ type: 'resume_service' });
  }

  const newState: DunningState = {
    ...state,
    status: 'CANCELLED',
    stateEnteredAt: new Date()
  };

  return { state: newState, actions };
}

function processPause(state: DunningState, now: Date): ProcessResult {
  if (!ACTIVE_STATES.includes(state.status)) {
    return { state, actions: [] };
  }

  const elapsed = getElapsedDays(state, now);

  const newState: DunningState = {
    ...state,
    status: 'PAUSED',
    pausedFrom: state.status,
    pausedElapsed: elapsed,
    stateEnteredAt: now
  };

  return { state: newState, actions: [] };
}

function processResume(state: DunningState): ProcessResult {
  if (state.status !== 'PAUSED' || !state.pausedFrom) {
    return { state, actions: [] };
  }

  const newState: DunningState = {
    ...state,
    status: state.pausedFrom,
    stateEnteredAt: new Date(),
    pausedFrom: undefined,
    pausedElapsed: undefined
  };

  return { state: newState, actions: [] };
}

function processManualAdvance(state: DunningState): ProcessResult {
  if (!ACTIVE_STATES.includes(state.status)) {
    return { state, actions: [] };
  }

  const nextStatus = NEXT_STATE[state.status];
  if (nextStatus === null) {
    return { state, actions: [] };
  }

  const newState: DunningState = {
    ...state,
    status: nextStatus,
    stateEnteredAt: new Date()
  };

  return {
    state: newState,
    actions: ACTIONS_FOR_TRANSITION[nextStatus]
  };
}

/**
 * Processes a dunning event and returns the new state and any actions to take.
 * @param state - Current dunning state
 * @param event - Event to process (tick, payment_received, invoice_cancelled, dunning_paused, dunning_resumed, manual_advance)
 * @param now - Current date/time
 * @returns New state and list of action descriptors
 */
export function process(
  state: DunningState,
  event: DunningEvent,
  now: Date
): ProcessResult {
  if (TERMINAL_STATES.includes(state.status)) {
    return { state, actions: [] };
  }

  if (state.status === 'PAUSED') {
    if (event.type === 'payment_received') {
      return processPayment(state);
    }
    if (event.type === 'invoice_cancelled') {
      return processCancellation(state);
    }
    if (event.type === 'dunning_resumed') {
      return processResume(state);
    }
    return { state, actions: [] };
  }

  switch (event.type) {
    case 'tick':
      return processTick(state, now);
    case 'payment_received':
      return processPayment(state);
    case 'invoice_cancelled':
      return processCancellation(state);
    case 'dunning_paused':
      return processPause(state, now);
    case 'dunning_resumed':
      return processResume(state);
    case 'manual_advance':
      return processManualAdvance(state);
    default:
      return { state, actions: [] };
  }
}