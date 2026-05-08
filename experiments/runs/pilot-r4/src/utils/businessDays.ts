function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function normalizeDate(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function datesEqual(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

function isHoliday(date: Date, holidays: Date[]): boolean {
  const normalizedDate = normalizeDate(date);
  return holidays.some(h => datesEqual(normalizeDate(h), normalizedDate));
}

export function isBusinessDay(date: Date, holidays: Date[] = []): boolean {
  if (isWeekend(date)) {
    return false;
  }
  if (isHoliday(date, holidays)) {
    return false;
  }
  return true;
}

export function addBusinessDays(startDate: Date, businessDays: number, holidays: Date[] = []): Date {
  let currentDate = normalizeDate(startDate);
  
  if (businessDays === 0) {
    return currentDate;
  }

  // Move to first business day if starting from non-business day
  if (businessDays > 0 && !isBusinessDay(currentDate, holidays)) {
    while (!isBusinessDay(currentDate, holidays)) {
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
  } else if (businessDays < 0 && !isBusinessDay(currentDate, holidays)) {
    while (!isBusinessDay(currentDate, holidays)) {
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    }
  }

  let daysAdded = 0;
  let result = new Date(currentDate);

  if (businessDays > 0) {
    while (daysAdded < businessDays) {
      result = new Date(result.getTime() + 24 * 60 * 60 * 1000);
      if (isBusinessDay(result, holidays)) {
        daysAdded++;
      }
    }
  } else {
    // Negative - subtract business days
    while (daysAdded > businessDays) {
      result = new Date(result.getTime() - 24 * 60 * 60 * 1000);
      if (isBusinessDay(result, holidays)) {
        daysAdded--;
      }
    }
  }

  return result;
}

export function countBusinessDays(startDate: Date, endDate: Date, holidays: Date[] = []): number {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  if (start.getTime() === end.getTime()) {
    return 0;
  }

  const [earlier, later] = start.getTime() < end.getTime() ? [start, end] : [end, start];
  
  let count = 0;
  let current = new Date(earlier);

  // Move past non-business days at the start
  while (current.getTime() < later.getTime() && !isBusinessDay(current, holidays)) {
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }

  while (current.getTime() < later.getTime()) {
    if (isBusinessDay(current, holidays)) {
      count++;
    }
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }

  return count;
}