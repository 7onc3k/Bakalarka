export type {
  DunningStatus,
  EventType,
  ActionType,
  ActionDescriptor,
  DunningConfig,
  DunningState,
  DunningEvent,
  ProcessResult
} from './types.js';

import type { DunningConfig, DunningState, DunningEvent, ProcessResult } from './types.js';
import {
  createState,
  shouldTransition,
  getNextStatus,
  getActionsForTransition,
  TERMINAL_STATES,
  PAUSEABLE_STATES
} from './dunning.js';
import { getBusinessDaysBetween } from './businessDays.js';

export function createInstance(
  dueDate: Date,
  config?: Partial<DunningConfig>
): DunningState {
  const normalizedDueDate = new Date(dueDate);
  normalizedDueDate.setUTCHours(0, 0, 0, 0);
  
  const fullConfig: DunningConfig = {
    timeouts: config?.timeouts,
    holidays: config?.holidays
  };
  
  return createState('ISSUED', normalizedDueDate, new Date(), fullConfig);
}

function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
}

function handlePaymentReceived(
  state: DunningState,
  now: Date
): ProcessResult {
  const currentStatus = state.status;
  
  if (TERMINAL_STATES.includes(currentStatus)) {
    return { state, actions: [] };
  }
  
  if (currentStatus === 'SUSPENDED') {
    return {
      state: createState('PAID', state.dueDate, now, state.config),
      actions: [{ type: 'resume_service' }]
    };
  }
  
  return {
    state: createState('PAID', state.dueDate, now, state.config),
    actions: []
  };
}

function handleInvoiceCancelled(
  state: DunningState,
  now: Date
): ProcessResult {
  const currentStatus = state.status;
  
  if (TERMINAL_STATES.includes(currentStatus)) {
    return { state, actions: [] };
  }
  
  if (currentStatus === 'SUSPENDED') {
    return {
      state: createState('CANCELLED', state.dueDate, now, state.config),
      actions: [{ type: 'resume_service' }]
    };
  }
  
  return {
    state: createState('CANCELLED', state.dueDate, now, state.config),
    actions: []
  };
}

function handleDunningPaused(
  state: DunningState,
  now: Date
): ProcessResult {
  const currentStatus = state.status;
  
  if (!PAUSEABLE_STATES.includes(currentStatus)) {
    return { state, actions: [] };
  }
  
  const pausedElapsed = getBusinessDaysBetween(state.stateEnteredAt, now, state.config.holidays ?? []);
  
  return {
    state: createState('PAUSED', state.dueDate, now, state.config, currentStatus, pausedElapsed),
    actions: []
  };
}

function handleDunningResumed(
  state: DunningState,
  now: Date
): ProcessResult {
  const currentStatus = state.status;
  
  if (currentStatus !== 'PAUSED') {
    return { state, actions: [] };
  }
  
  const resumeStatus = state.pausedFrom ?? state.status;
  
  return {
    state: createState(resumeStatus, state.dueDate, now, state.config),
    actions: []
  };
}

function handleManualAdvance(
  state: DunningState,
  now: Date
): ProcessResult {
  const currentStatus = state.status;
  
  if (TERMINAL_STATES.includes(currentStatus)) {
    return { state, actions: [] };
  }
  
  if (currentStatus === 'PAUSED') {
    return { state, actions: [] };
  }
  
  const nextStatus = getNextStatus(currentStatus);
  
  if (!nextStatus) {
    return { state, actions: [] };
  }
  
  const actions = getActionsForTransition(currentStatus, nextStatus);
  
  return {
    state: createState(nextStatus, state.dueDate, now, state.config),
    actions
  };
}

export function process(
  state: DunningState,
  event: DunningEvent,
  now: Date
): ProcessResult {
  const currentStatus = state.status;
  const config = state.config;
  const normalizedNow = normalizeDate(now);
  
  if (TERMINAL_STATES.includes(currentStatus)) {
    return { state, actions: [] };
  }
  
  switch (event.type) {
    case 'payment_received':
      return handlePaymentReceived(state, normalizedNow);
    
    case 'invoice_cancelled':
      return handleInvoiceCancelled(state, normalizedNow);
    
    case 'dunning_paused':
      return handleDunningPaused(state, normalizedNow);
    
    case 'dunning_resumed':
      return handleDunningResumed(state, normalizedNow);
    
    case 'manual_advance':
      return handleManualAdvance(state, normalizedNow);
    
    case 'tick': {
      const shouldMove = shouldTransition(
        currentStatus,
        state.stateEnteredAt,
        normalizedNow,
        config,
        state.dueDate,
        state.pausedFrom,
        state.pausedElapsed
      );
      
      if (shouldMove) {
        const nextStatus = getNextStatus(currentStatus);
        
        if (nextStatus) {
          const actions = getActionsForTransition(currentStatus, nextStatus);
          const newState = createState(
            nextStatus,
            state.dueDate,
            normalizedNow,
            config
          );
          
          return { state: newState, actions };
        }
      }
      
      return { state, actions: [] };
    }
    
    default:
      return { state, actions: [] };
  }
}