import { DunningConfig } from './types';

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date: Date, holidays: Date[]): boolean {
  const dateStr = formatDate(date);
  return holidays.some(h => formatDate(h) === dateStr);
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isBusinessDay(date: Date, holidays: Date[]): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays);
}

export function addBusinessDays(startDate: Date, days: number, holidays: Date[]): Date {
  let result = new Date(startDate);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result, holidays)) {
      addedDays++;
    }
  }
  
  return result;
}

export function subtractBusinessDays(startDate: Date, days: number, holidays: Date[]): Date {
  let result = new Date(startDate);
  let subtractedDays = 0;
  
  while (subtractedDays < days) {
    result.setDate(result.getDate() - 1);
    if (isBusinessDay(result, holidays)) {
      subtractedDays++;
    }
  }
  
  return result;
}

export function businessDaysBetween(start: Date, end: Date, holidays: Date[]): number {
  let count = 0;
  let current = new Date(start);
  
  while (formatDate(current) < formatDate(end)) {
    current.setDate(current.getDate() + 1);
    if (isBusinessDay(current, holidays)) {
      count++;
    }
  }
  
  return count;
}

export function isSameDayOrBefore(date: Date, compareToDate: Date): boolean {
  const dateStr = formatDate(date);
  const compareStr = formatDate(compareToDate);
  return dateStr <= compareStr;
}

export function isSameDayOrAfter(date: Date, compareToDate: Date): boolean {
  const dateStr = formatDate(date);
  const compareStr = formatDate(compareToDate);
  return dateStr >= compareStr;
}

export function isSameDay(date: Date, compareToDate: Date): boolean {
  return formatDate(date) === formatDate(compareToDate);
}

export function calculateDueSoonDate(dueDate: Date, dueSoonDays: number, holidays: Date[]): Date {
  return subtractBusinessDays(dueDate, dueSoonDays, holidays);
}

export function hasBusinessDaysElapsed(enteredAt: Date, now: Date, requiredDays: number, holidays: Date[]): boolean {
  const elapsed = businessDaysBetween(enteredAt, now, holidays);
  return elapsed >= requiredDays;
}

export function isDueSoonTriggered(dueDate: Date, dueSoonDays: number, now: Date, holidays: Date[]): boolean {
  const dueSoonDate = calculateDueSoonDate(dueDate, dueSoonDays, holidays);
  return isSameDayOrAfter(now, dueSoonDate);
}

export function isDueDateReached(dueDate: Date, now: Date): boolean {
  return isSameDayOrAfter(now, dueDate);
}
