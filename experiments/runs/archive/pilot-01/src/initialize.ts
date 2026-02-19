import { DunningState, DunningConfig, DEFAULT_CONFIG, Timeouts, DEFAULT_TIMEOUTS } from './types';

export interface InitializeOptions {
  holidays?: Date[];
  timeouts?: Partial<Timeouts>;
}

export function initialize(dueDate: Date, options?: InitializeOptions): DunningState {
  const config: DunningConfig = {
    holidays: options?.holidays ?? DEFAULT_CONFIG.holidays,
    timeouts: {
      ...DEFAULT_TIMEOUTS,
      ...(options?.timeouts ?? {}),
    },
  };
  
  return {
    status: 'ISSUED',
    dueDate: new Date(dueDate),
    enteredStateAt: new Date(),
    configuration: config,
  };
}
