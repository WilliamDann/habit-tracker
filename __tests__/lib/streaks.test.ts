import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateStreak, formatDate } from "@/lib/streaks";

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatDate(d);
}

describe("calculateStreak", () => {
  it("returns 0 for empty completions", () => {
    expect(calculateStreak(new Set(), [0, 1, 2, 3, 4, 5, 6])).toBe(0);
  });

  it("counts consecutive scheduled days", () => {
    const dates = new Set([dateStr(0), dateStr(1), dateStr(2)]);
    const streak = calculateStreak(dates, [0, 1, 2, 3, 4, 5, 6]);
    expect(streak).toBe(3);
  });

  it("gap breaks streak", () => {
    // Completed today and 2 days ago, but not yesterday
    const dates = new Set([dateStr(0), dateStr(2)]);
    const streak = calculateStreak(dates, [0, 1, 2, 3, 4, 5, 6]);
    expect(streak).toBe(1);
  });

  it("today not yet done does not break streak", () => {
    // Did not complete today but completed yesterday and day before
    const dates = new Set([dateStr(1), dateStr(2)]);
    const streak = calculateStreak(dates, [0, 1, 2, 3, 4, 5, 6]);
    expect(streak).toBe(2);
  });

  it("skips non-scheduled days for weekday-only habit", () => {
    // Find the most recent weekday sequence
    const dates = new Set<string>();
    const today = new Date();
    let count = 0;

    for (let i = 0; i < 14 && count < 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dow = d.getDay();
      if (dow >= 1 && dow <= 5) {
        dates.add(formatDate(d));
        count++;
      }
    }

    const streak = calculateStreak(dates, [1, 2, 3, 4, 5]);
    expect(streak).toBeGreaterThanOrEqual(3);
  });

  it("handles custom frequency", () => {
    // Mon/Wed/Fri only
    const freq = [1, 3, 5];
    const dates = new Set<string>();
    const today = new Date();
    let count = 0;

    for (let i = 0; i < 30 && count < 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dow = d.getDay();
      if (freq.includes(dow)) {
        dates.add(formatDate(d));
        count++;
      }
    }

    const streak = calculateStreak(dates, freq);
    expect(streak).toBeGreaterThanOrEqual(3);
  });
});

describe("formatDate", () => {
  it("formats date as YYYY-MM-DD", () => {
    const d = new Date(2025, 0, 5); // Jan 5, 2025
    expect(formatDate(d)).toBe("2025-01-05");
  });

  it("pads single digit months and days", () => {
    const d = new Date(2025, 2, 9); // Mar 9, 2025
    expect(formatDate(d)).toBe("2025-03-09");
  });
});
