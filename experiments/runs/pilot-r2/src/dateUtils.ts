const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MILLISECONDS_PER_DAY);
}

export function subDays(date: Date, days: number): Date {
  return new Date(date.getTime() - days * MILLISECONDS_PER_DAY);
}