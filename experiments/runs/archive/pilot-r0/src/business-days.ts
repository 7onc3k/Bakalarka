export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}

export function isHoliday(date: Date, holidays: Date[]): boolean {
  const normalizedDate = normalizeDate(date);
  return holidays.some(holiday => isSameDay(normalizedDate, normalizeDate(holiday)));
}

export function countBusinessDays(
  startDate: Date,
  endDate: Date,
  holidays: Date[] = []
): number {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  if (start > end) {
    return 0;
  }

  let count = 0;
  const current = new Date(start);

  while (current < end) {
    current.setDate(current.getDate() + 1);
    if (!isWeekend(current) && !isHoliday(current, holidays)) {
      count++;
    }
  }

  return count;
}

export function addBusinessDays(
  startDate: Date,
  businessDays: number,
  holidays: Date[] = []
): Date {
  const current = normalizeDate(startDate);
  let daysAdded = 0;

  while (daysAdded < businessDays) {
    current.setDate(current.getDate() + 1);
    if (!isWeekend(current) && !isHoliday(current, holidays)) {
      daysAdded++;
    }
  }

  return current;
}

export function isBusinessDay(date: Date, holidays: Date[] = []): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays);
}
