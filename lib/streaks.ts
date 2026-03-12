/**
 * Calculate the current streak for a habit, counting only scheduled days.
 * Walks backwards from today through scheduled days and counts consecutive completions.
 */
export function calculateStreak(
  completedDates: Set<string>,
  frequency: number[]
): number {
  if (completedDates.size === 0) return 0;

  const freqSet = new Set(frequency);
  let streak = 0;
  const date = new Date();
  // Start from today
  date.setHours(0, 0, 0, 0);

  // Walk backwards up to 365 days
  for (let i = 0; i < 365; i++) {
    const dayOfWeek = date.getDay();

    if (freqSet.has(dayOfWeek)) {
      const dateStr = formatDate(date);
      if (completedDates.has(dateStr)) {
        streak++;
      } else {
        // Today not yet done is okay — don't break streak
        if (i === 0) {
          // skip today, don't break
        } else {
          break;
        }
      }
    }

    date.setDate(date.getDate() - 1);
  }

  return streak;
}

/** Format a Date as YYYY-MM-DD */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
