function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

function normalizeDate(date: Date): Date {
  const normalized = new Date(date)
  normalized.setHours(12, 0, 0, 0)
  return normalized
}

function datesEqual(a: Date, b: Date): boolean {
  return normalizeDate(a).getTime() === normalizeDate(b).getTime()
}

function isHoliday(date: Date, holidays: Date[]): boolean {
  return holidays.some(holiday => datesEqual(date, holiday))
}

/**
 * Checks if a given date is a business day (excludes weekends and holidays).
 * @param date - The date to check
 * @param holidays - Optional array of holiday dates to exclude
 * @returns true if the date is a business day, false otherwise
 */
export function isBusinessDay(date: Date, holidays: Date[] = []): boolean {
  if (isWeekend(date)) return false
  if (isHoliday(date, holidays)) return false
  return true
}

/**
 * Counts the number of business days between two dates.
 * @param startDate - Start date (exclusive)
 * @param endDate - End date (exclusive)
 * @param holidays - Optional array of holiday dates to exclude
 * @returns Number of business days between the dates
 */
export function countBusinessDays(
  startDate: Date,
  endDate: Date,
  holidays: Date[] = []
): number {
  const start = normalizeDate(startDate)
  const end = normalizeDate(endDate)

  if (start.getTime() === end.getTime()) {
    return 0
  }

  const [earlier, later] = start.getTime() <= end.getTime() 
    ? [start, end] 
    : [end, start]

  let count = 0
  const current = new Date(earlier)
  
  while (current.getTime() < later.getTime()) {
    current.setDate(current.getDate() + 1)
    if (isBusinessDay(current, holidays)) {
      count++
    }
  }

  return count
}

/**
 * Adds a specified number of business days to a date.
 * @param date - The starting date
 * @param days - Number of business days to add
 * @param holidays - Optional array of holiday dates to exclude
 * @returns New date with business days added
 */
export function addBusinessDays(
  date: Date,
  days: number,
  holidays: Date[] = []
): Date {
  const current = new Date(date)
  
  if (days === 0) {
    if (!isBusinessDay(current, holidays)) {
      while (!isBusinessDay(current, holidays)) {
        current.setDate(current.getDate() + 1)
      }
    }
    return current
  }

  let added = 0
  while (added < days) {
    current.setDate(current.getDate() + 1)
    if (isBusinessDay(current, holidays)) {
      added++
    }
  }

  return current
}