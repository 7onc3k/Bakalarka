function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
}

function dateToKey(date: Date): string {
  return normalizeDate(date).toISOString().split("T")[0];
}

function isWeekend(date: Date): boolean {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

function isHoliday(date: Date, holidays: Set<string>): boolean {
  return holidays.has(dateToKey(date));
}

export function createHolidaySet(holidays: Date[] | undefined): Set<string> {
  if (!holidays || holidays.length === 0) {
    return new Set();
  }
  return new Set(holidays.map(dateToKey));
}

export function isBusinessDay(date: Date, holidays: Set<string>): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays);
}

export function countBusinessDays(
  startDate: Date,
  endDate: Date,
  holidays: Set<string>
): number {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  if (start.getTime() === end.getTime()) {
    return 0;
  }

  const direction = end.getTime() > start.getTime() ? 1 : -1;
  let count = 0;
  const current = new Date(start);

  while (current.getTime() !== end.getTime()) {
    current.setUTCDate(current.getUTCDate() + direction);
    if (isBusinessDay(current, holidays)) {
      count++;
    }
  }

  return count;
}

export function addBusinessDays(
  startDate: Date,
  days: number,
  holidays: Set<string>
): Date {
  if (days === 0) {
    return normalizeDate(startDate);
  }

  const normalized = normalizeDate(startDate);
  const direction = days > 0 ? 1 : -1;
  const absoluteDays = Math.abs(days);
  let remaining = absoluteDays;
  const current = new Date(normalized);

  while (remaining > 0) {
    current.setUTCDate(current.getUTCDate() + direction);
    if (isBusinessDay(current, holidays)) {
      remaining--;
    }
  }

  return current;
}

export function getBusinessDaysDifference(
  startDate: Date,
  endDate: Date,
  holidays: Set<string>
): number {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  if (end.getTime() <= start.getTime()) {
    return 0;
  }

  return countBusinessDays(start, end, holidays);
}