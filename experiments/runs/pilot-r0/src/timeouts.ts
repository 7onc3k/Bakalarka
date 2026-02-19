import { DunningConfig } from './types';

export const DEFAULT_TIMEOUTS = {
  dueSoon: 7,
  overdueToGrace: 3,
  graceToReminder1: 7,
  reminder1ToReminder2: 14,
  reminder2ToFinal: 14,
  finalToSuspended: 7,
  suspendedToWrittenOff: 30
};

export function getTimeouts(config: DunningConfig | undefined): typeof DEFAULT_TIMEOUTS {
  if (!config || !config.timeouts) {
    return { ...DEFAULT_TIMEOUTS };
  }
  return {
    dueSoon: config.timeouts.dueSoon ?? DEFAULT_TIMEOUTS.dueSoon,
    overdueToGrace: config.timeouts.overdueToGrace ?? DEFAULT_TIMEOUTS.overdueToGrace,
    graceToReminder1: config.timeouts.graceToReminder1 ?? DEFAULT_TIMEOUTS.graceToReminder1,
    reminder1ToReminder2: config.timeouts.reminder1ToReminder2 ?? DEFAULT_TIMEOUTS.reminder1ToReminder2,
    reminder2ToFinal: config.timeouts.reminder2ToFinal ?? DEFAULT_TIMEOUTS.reminder2ToFinal,
    finalToSuspended: config.timeouts.finalToSuspended ?? DEFAULT_TIMEOUTS.finalToSuspended,
    suspendedToWrittenOff: config.timeouts.suspendedToWrittenOff ?? DEFAULT_TIMEOUTS.suspendedToWrittenOff
  };
}

export function getHolidays(config: DunningConfig | undefined): Date[] {
  return config?.holidays ?? [];
}
