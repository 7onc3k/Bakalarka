import { DunningState, DunningEvent, DunningAction, Status } from './types';
import { evaluateTickTransition, getNextStatus, getActionsForTransition, isTerminal, isPausable } from './transitions';

export interface ProcessResult {
  state: DunningState;
  actions: DunningAction[];
}

export function process(
  state: DunningState,
  event: DunningEvent,
  now: Date
): ProcessResult {
  const currentState = { ...state, enteredStateAt: new Date(state.enteredStateAt), dueDate: new Date(state.dueDate) };
  
  if (isTerminal(currentState.status)) {
    return { state: currentState, actions: [] };
  }
  
  switch (event) {
    case 'payment_received': {
      return handlePaymentReceived(currentState, now);
    }
    
    case 'invoice_cancelled': {
      return handleInvoiceCancelled(currentState, now);
    }
    
    case 'dunning_paused': {
      return handleDunningPaused(currentState, now);
    }
    
    case 'dunning_resumed': {
      return handleDunningResumed(currentState, now);
    }
    
    case 'manual_advance': {
      return handleManualAdvance(currentState, now);
    }
    
    case 'tick': {
      return handleTick(currentState, now);
    }
    
    default:
      return { state: currentState, actions: [] };
  }
}

function handlePaymentReceived(state: DunningState, now: Date): ProcessResult {
  const previousStatus = state.status === 'PAUSED' ? state.previousStatus : state.status;
  const newStatus: Status = 'PAID';
  const actions = getActionsForTransition(previousStatus || state.status, newStatus);
  
  return {
    state: {
      ...state,
      status: newStatus,
      enteredStateAt: now,
      previousStatus: undefined,
      pausedAt: undefined,
    },
    actions,
  };
}

function handleInvoiceCancelled(state: DunningState, now: Date): ProcessResult {
  if (state.status === 'PAID') {
    return { state, actions: [] };
  }
  
  const previousStatus = state.status === 'PAUSED' ? state.previousStatus : state.status;
  const newStatus: Status = 'CANCELLED';
  const actions = getActionsForTransition(previousStatus || state.status, newStatus);
  
  return {
    state: {
      ...state,
      status: newStatus,
      enteredStateAt: now,
      previousStatus: undefined,
      pausedAt: undefined,
    },
    actions,
  };
}

function handleDunningPaused(state: DunningState, now: Date): ProcessResult {
  if (!isPausable(state.status)) {
    return { state, actions: [] };
  }
  
  return {
    state: {
      ...state,
      previousStatus: state.status,
      status: 'PAUSED',
      pausedAt: now,
    },
    actions: [],
  };
}

function handleDunningResumed(state: DunningState, now: Date): ProcessResult {
  if (state.status !== 'PAUSED' || !state.previousStatus) {
    return { state, actions: [] };
  }
  
  return {
    state: {
      ...state,
      status: state.previousStatus,
      previousStatus: undefined,
      pausedAt: undefined,
    },
    actions: [],
  };
}

function handleManualAdvance(state: DunningState, now: Date): ProcessResult {
  if (state.status === 'PAUSED') {
    return { state, actions: [] };
  }
  
  const nextStatus = getNextStatus(state.status);
  if (!nextStatus) {
    return { state, actions: [] };
  }
  
  const actions = getActionsForTransition(state.status, nextStatus);
  
  return {
    state: {
      ...state,
      status: nextStatus,
      enteredStateAt: now,
    },
    actions,
  };
}

function handleTick(state: DunningState, now: Date): ProcessResult {
  if (state.status === 'PAUSED') {
    return { state, actions: [] };
  }
  
  const transition = evaluateTickTransition(state, now);
  if (!transition) {
    return { state, actions: [] };
  }
  
  return {
    state: {
      ...state,
      status: transition.status,
      enteredStateAt: now,
    },
    actions: transition.actions,
  };
}
