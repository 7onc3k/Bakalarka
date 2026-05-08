export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isBusinessDay(date: Date, holidays: Date[] = []): boolean {
  if (isWeekend(date)) {
    return false;
  }
  const dateStr = date.toDateString();
  for (const holiday of holidays) {
    if (holiday.toDateString() === dateStr) {
      return false;
    }
  }
  return true;
}

export function addBusinessDays(startDate: Date, days: number, holidays: Date[] = []): Date {
  const date = new Date(startDate);
  const direction = days >= 0 ? 1 : -1;
  let remaining = Math.abs(days);
  
  while (remaining > 0) {
    date.setDate(date.getDate() + direction);
    if (isBusinessDay(date, holidays)) {
      remaining--;
    }
  }
  
  return date;
}

export function countBusinessDays(startDate: Date, endDate: Date, holidays: Date[] = []): number {
  if (endDate <= startDate) {
    return 0;
  }
  
  let count = 0;
  const current = new Date(startDate);
  
  while (current < endDate) {
    if (isBusinessDay(current, holidays)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}