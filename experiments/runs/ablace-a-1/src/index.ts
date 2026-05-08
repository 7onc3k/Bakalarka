import type { DunningConfig, DunningState, DunningEvent, ProcessResult } from "./types.js";
import { getNextState as getNextStateFromMachine, calculateTransition, getActionsForTransition } from "./stateMachine.js";
import { getBusinessDaysBetween } from "./businessDays.js";

export type { DunningStatus, EventType, DunningEvent } from "./types.js";
export type { ActionType, ActionDescriptor } from "./types.js";
export type { DunningConfig, DunningState, ProcessResult } from "./types.js";

/**
 * Initialize a new dunning instance for an invoice
 * @param dueDate - The invoice due date
 * @param config - Optional configuration for timeouts and holidays
 * @returns The initial dunning state
 */
export function createInstance(
  dueDate: Date,
  config?: Partial<DunningConfig>
): DunningState {
  const now = new Date();
  return {
    status: "ISSUED",
    dueDate,
    stateEnteredAt: now,
    config: config ?? {},
  };
}

/**
 * Process a dunning event and return the new state and actions
 * @param state - The current dunning state
 * @param event - The event to process
 * @param now - The current date/time
 * @returns The new state and any actions to perform
 */
export function process(
  state: DunningState,
  event: DunningEvent,
  now: Date
): ProcessResult {
  const timeouts = state.config.timeouts ?? {};
  
  // Check for pause state - need to track elapsed time
  if (state.status === 'PAUSED') {
    const nextStatus = getNextStateFromMachine(state.status, event.type, timeouts, state);
    
    if (nextStatus !== 'PAUSED') {
      const fromStatus = state.pausedFrom ?? 'OVERDUE';
      const actions = getActionsForTransition(fromStatus, nextStatus);
      
      // Clear pause fields when resuming
      const newState: DunningState = {
        ...state,
        status: nextStatus,
        stateEnteredAt: now,
        pausedFrom: undefined,
        pausedElapsed: undefined,
      };
      
      return { state: newState, actions };
    }
    
    return { state, actions: [] };
  }
  
  // Check for time-based transition (tick event)
  let nextStatus: string | null = null;
  if (event.type === 'tick') {
    nextStatus = calculateTransition(state, now);
  }
  
  // Get event-based transition
  let eventStatus = getNextStateFromMachine(state.status, event.type, timeouts, state);
  
  // If both time and event could cause transition, prefer event-based
  // (except for manual_advance which should always take priority)
  if (event.type === 'manual_advance' || (eventStatus !== state.status && eventStatus !== nextStatus)) {
    // Event-based transition takes priority for manual_advance
  } else if (nextStatus && nextStatus !== state.status) {
    eventStatus = nextStatus as typeof eventStatus;
  }
  
  // Handle no transition
  if (eventStatus === state.status) {
    return { state, actions: [] };
  }
  
  // Get actions for the transition
  const actions = getActionsForTransition(state.status, eventStatus);
  
  // Handle pause state
  let newState: DunningState;
  if (eventStatus === 'PAUSED') {
    newState = {
      ...state,
      status: eventStatus,
      stateEnteredAt: now,
      pausedFrom: state.status,
      pausedElapsed: getBusinessDaysBetween(state.stateEnteredAt, now, state.config.holidays ?? []),
    };
  } else {
    newState = {
      ...state,
      status: eventStatus,
      stateEnteredAt: now,
    };
  }
  
  return { state: newState, actions };
}