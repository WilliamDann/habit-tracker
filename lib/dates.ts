/**
 * Generate an array of date strings (YYYY-MM-DD) for the given year.
 */
export function getDatesForYear(year: number): string[] {
  const dates: string[] = [];
  const date = new Date(year, 0, 1);

  while (date.getFullYear() === year) {
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    dates.push(`${year}-${m}-${d}`);
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

/**
 * Get the day of week (0=Sun..6=Sat) for a date string.
 */
export function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + "T00:00:00").getDay();
}
