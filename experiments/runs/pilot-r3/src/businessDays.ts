function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function dateToKey(date: Date): string {
  const normalized = normalizeDate(date);
  return normalized.toISOString().split('T')[0] as string;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Checks if a date is a holiday.
 * 
 * @param date - The date to check
 * @param holidays - Array of holiday dates
 * @returns true if the date is in the holidays array
 */
export function isHoliday(date: Date, holidays: readonly Date[]): boolean {
  const normalized = normalizeDate(date);
  const key = dateToKey(normalized);
  
  return holidays.some(holiday => dateToKey(holiday) === key);
}

/**
 * Checks if a date is a business day (not a weekend and not a holiday).
 * 
 * @param date - The date to check
 * @param holidays - Array of holiday dates to exclude
 * @returns true if the date is a business day
 */
export function isBusinessDay(date: Date, holidays: readonly Date[]): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays);
}

/**
 * Adds the specified number of business days to a date.
 * Weekends and holidays are excluded from the count.
 * 
 * @param startDate - The starting date
 * @param businessDays - Number of business days to add (can be negative)
 * @param holidays - Array of holiday dates to exclude
 * @returns The resulting date after adding business days
 */
export function addBusinessDays(
  startDate: Date,
  businessDays: number,
  holidays: readonly Date[]
): Date {
  const result = new Date(startDate);
  
  if (businessDays === 0) {
    return result;
  }
  
  const direction = businessDays > 0 ? 1 : -1;
  let remaining = Math.abs(businessDays);
  
  while (remaining > 0) {
    result.setDate(result.getDate() + direction);
    
    if (isBusinessDay(result, holidays)) {
      remaining--;
    }
  }
  
  return result;
}

/**
 * Calculates the number of business days between two dates.
 * The start date is not counted; only days after the start up to and including the end.
 * 
 * @param startDate - The starting date
 * @param endDate - The ending date
 * @param holidays - Array of holiday dates to exclude
 * @returns Number of business days between the dates (negative if end < start)
 */
export function businessDaysBetween(
  startDate: Date,
  endDate: Date,
  holidays: readonly Date[]
): number {
  const normalizedStart = normalizeDate(startDate);
  const normalizedEnd = normalizeDate(endDate);
  
  if (normalizedStart.getTime() === normalizedEnd.getTime()) {
    return 0;
  }
  
  const direction = normalizedEnd > normalizedStart ? 1 : -1;
  let count = 0;
  
  const current = new Date(normalizedStart);
  while (current.getTime() !== normalizedEnd.getTime()) {
    current.setDate(current.getDate() + direction);
    
    if (isBusinessDay(current, holidays)) {
      count++;
    }
  }
  
  return count * direction;
}