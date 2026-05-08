function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date: Date, holidays: Set<string>): boolean {
  return holidays.has(toLocalDateString(date));
}

export function isBusinessDay(date: Date, holidays: Date[] = []): boolean {
  const holidaySet = new Set(holidays.map((h) => toLocalDateString(h)));
  return !isWeekend(date) && !isHoliday(date, holidaySet);
}

export function addBusinessDays(
  startDate: Date,
  days: number,
  holidays: Date[] = []
): Date {
  const holidaySet = new Set(holidays.map((h) => toLocalDateString(h)));
  const current = new Date(startDate);

  if (days === 0) {
    return current;
  }

  if (days > 0) {
    let remaining = days;
    while (remaining > 0) {
      current.setDate(current.getDate() + 1);
      const key = toLocalDateString(current);
      if (!isWeekend(current) && !holidaySet.has(key)) {
        remaining--;
      }
    }
  } else {
    let remaining = Math.abs(days);
    while (remaining >= 0) {
      const key = toLocalDateString(current);
      if (!isWeekend(current) && !holidaySet.has(key)) {
        remaining--;
        if (remaining < 0) break;
      }
      current.setDate(current.getDate() - 1);
    }
  }

  return current;
}

export function businessDaysBetween(
  startDate: Date,
  endDate: Date,
  holidays: Date[] = []
): number {
  const holidaySet = new Set(holidays.map((h) => toLocalDateString(h)));
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    return 0;
  }

  let count = 0;
  const current = new Date(start);

  while (current < end) {
    current.setDate(current.getDate() + 1);
    const key = toLocalDateString(current);
    if (!isWeekend(current) && !holidaySet.has(key)) {
      count++;
    }
  }

  return count;
}

export function getTargetDate(
  startDate: Date,
  businessDays: number,
  holidays: Date[] = []
): Date {
  return addBusinessDays(startDate, businessDays, holidays);
}
