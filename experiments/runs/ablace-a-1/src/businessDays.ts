/**
 * Check if a given date is a business day (excludes weekends and holidays)
 * @param date - The date to check
 * @param holidays - Optional array of holiday dates to exclude
 * @returns true if the date is a business day, false otherwise
 */
export function isBusinessDay(date: Date, holidays?: Date[]): boolean {
  const day = date.getDay();
  
  // Check if it's a weekend (0 = Sunday, 6 = Saturday)
  if (day === 0 || day === 6) {
    return false;
  }
  
  // Check if it's a holiday
  if (holidays) {
    for (const holiday of holidays) {
      if (isSameDay(date, holiday)) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Add business days to a date (excludes weekends and holidays)
 * @param startDate - The starting date
 * @param businessDays - Number of business days to add
 * @param holidays - Optional array of holiday dates to exclude
 * @returns The resulting date after adding business days
 */
export function addBusinessDays(
  startDate: Date,
  businessDays: number,
  holidays?: Date[]
): Date {
  if (businessDays < 0) {
    throw new Error('businessDays must be a non-negative number');
  }
  
  if (businessDays === 0) {
    return new Date(startDate);
  }
  
  const result = new Date(startDate);
  let daysAdded = 0;
  
  while (daysAdded < businessDays) {
    result.setDate(result.getDate() + 1);
    
    if (isBusinessDay(result, holidays)) {
      daysAdded++;
    }
  }
  
  return result;
}

/**
 * Subtract business days from a date
 * @param startDate - The starting date
 * @param businessDays - Number of business days to subtract
 * @param holidays - Optional array of holiday dates to exclude
 * @returns The resulting date after subtracting business days
 */
export function subtractBusinessDays(
  startDate: Date,
  businessDays: number,
  holidays?: Date[]
): Date {
  if (businessDays < 0) {
    throw new Error('businessDays must be a non-negative number');
  }
  
  if (businessDays === 0) {
    return new Date(startDate);
  }
  
  const result = new Date(startDate);
  let daysSubtracted = 0;
  
  while (daysSubtracted < businessDays) {
    result.setDate(result.getDate() - 1);
    
    if (isBusinessDay(result, holidays)) {
      daysSubtracted++;
    }
  }
  
  return result;
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Calculate the number of business days between two dates
 * @param startDate - The starting date
 * @param endDate - The ending date
 * @param holidays - Optional array of holiday dates to exclude
 * @returns The number of business days between the dates
 */
export function getBusinessDaysBetween(
  startDate: Date,
  endDate: Date,
  holidays?: Date[]
): number {
  if (endDate < startDate) {
    return 0;
  }
  
  let count = 0;
  const current = new Date(startDate);
  
  while (current < endDate) {
    current.setDate(current.getDate() + 1);
    if (isBusinessDay(current, holidays)) {
      count++;
    }
  }
  
  return count;
}