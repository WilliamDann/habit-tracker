import { describe, it, expect } from "vitest";
import { getDatesForYear, getDayOfWeek } from "@/lib/dates";

describe("getDatesForYear", () => {
  it("returns 365 dates for a non-leap year", () => {
    const dates = getDatesForYear(2025);
    expect(dates).toHaveLength(365);
    expect(dates[0]).toBe("2025-01-01");
    expect(dates[dates.length - 1]).toBe("2025-12-31");
  });

  it("returns 366 dates for a leap year", () => {
    const dates = getDatesForYear(2024);
    expect(dates).toHaveLength(366);
    expect(dates[0]).toBe("2024-01-01");
    expect(dates[59]).toBe("2024-02-29");
  });

  it("all dates are in the correct year", () => {
    const dates = getDatesForYear(2025);
    for (const d of dates) {
      expect(d.startsWith("2025-")).toBe(true);
    }
  });
});

describe("getDayOfWeek", () => {
  it("returns correct day of week", () => {
    // 2025-01-06 is a Monday
    expect(getDayOfWeek("2025-01-06")).toBe(1);
    // 2025-01-05 is a Sunday
    expect(getDayOfWeek("2025-01-05")).toBe(0);
    // 2025-01-11 is a Saturday
    expect(getDayOfWeek("2025-01-11")).toBe(6);
  });
});
