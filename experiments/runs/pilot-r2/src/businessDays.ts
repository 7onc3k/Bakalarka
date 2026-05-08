const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
}

function datesEqual(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

function isHoliday(date: Date, holidays: readonly Date[]): boolean {
  const normalized = normalizeDate(date);
  return holidays.some(holiday => datesEqual(normalized, normalizeDate(holiday)));
}

export function isBusinessDay(date: Date, holidays?: readonly Date[]): boolean {
  if (isWeekend(date)) {
    return false;
  }
  if (holidays && holidays.length > 0) {
    if (isHoliday(date, holidays)) {
      return false;
    }
  }
  return true;
}

export function normalize(date: Date): Date {
  return normalizeDate(date);
}

function getNextBusinessDay(date: Date, holidays: readonly Date[]): Date {
  const next = new Date(date.getTime() + MILLISECONDS_PER_DAY);
  if (isBusinessDay(next, holidays)) {
    return next;
  }
  return getNextBusinessDay(next, holidays);
}

function getPreviousBusinessDay(date: Date, holidays: readonly Date[]): Date {
  const previous = new Date(date.getTime() - MILLISECONDS_PER_DAY);
  if (isBusinessDay(previous, holidays)) {
    return previous;
  }
  return getPreviousBusinessDay(previous, holidays);
}

export function addBusinessDays(
  startDate: Date,
  businessDays: number,
  holidays: readonly Date[] = []
): Date {
  if (businessDays === 0) {
    return normalizeDate(startDate);
  }
  
  let current = normalizeDate(startDate);
  
  if (businessDays > 0) {
    let daysAdded = 0;
    while (daysAdded < businessDays) {
      current = getNextBusinessDay(current, holidays);
      daysAdded++;
    }
  } else {
    let daysAdded = 0;
    const absDays = Math.abs(businessDays);
    while (daysAdded < absDays) {
      current = getPreviousBusinessDay(current, holidays);
      daysAdded++;
    }
  }
  
  return current;
}

export function getBusinessDaysBetween(
  startDate: Date,
  endDate: Date,
  holidays: readonly Date[] = []
): number {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);
  
  if (start.getTime() === end.getTime()) {
    return 0;
  }
  
  const [earlier, later] = start.getTime() < end.getTime() 
    ? [start, end] 
    : [end, start];
  
  let count = 0;
  let current = new Date(earlier.getTime() + MILLISECONDS_PER_DAY);
  
  while (current.getTime() <= later.getTime()) {
    if (isBusinessDay(current, holidays)) {
      count++;
    }
    current = new Date(current.getTime() + MILLISECONDS_PER_DAY);
  }
  
  return count;
}