import { DunningState, DunningConfig, DunningStatus } from './types.js';

const DEFAULT_TIMEOUTS: Record<DunningStatus, number> = {
  'ISSUED': 0,
  'DUE_SOON': -7,
  'OVERDUE': 3,
  'GRACE': 7,
  'REMINDER_1': 14,
  'REMINDER_2': 14,
  'FINAL_NOTICE': 7,
  'SUSPENDED': 30,
  'WRITTEN_OFF': 0,
  'PAID': 0,
  'PAUSED': 0,
  'CANCELLED': 0
};

/**
 * Creates a new dunning instance for an invoice.
 * 
 * @param dueDate - The invoice due date
 * @param config - Optional configuration for timeouts and holidays
 * @returns Initial dunning state with ISSUED status
 */
export function createInstance(
  dueDate: Date,
  config?: Partial<DunningConfig>
): DunningState {
  const mergedConfig: DunningConfig = {
    timeouts: {
      ...DEFAULT_TIMEOUTS,
      ...config?.timeouts
    },
    holidays: config?.holidays ?? []
  };

  return {
    status: 'ISSUED',
    dueDate,
    stateEnteredAt: new Date(),
    config: mergedConfig
  };
}