import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { YearDots } from "@/components/year-dots";

describe("YearDots", () => {
  it("renders correct number of dots for a year", () => {
    const { container } = render(
      <YearDots
        completedDates={new Set()}
        color="#10b981"
        frequency={[0, 1, 2, 3, 4, 5, 6]}
        year={2025}
      />
    );
    const dots = container.querySelectorAll("[title]");
    expect(dots).toHaveLength(365);
  });

  it("renders 366 dots for leap year", () => {
    const { container } = render(
      <YearDots
        completedDates={new Set()}
        color="#10b981"
        frequency={[0, 1, 2, 3, 4, 5, 6]}
        year={2024}
      />
    );
    const dots = container.querySelectorAll("[title]");
    expect(dots).toHaveLength(366);
  });

  it("applies color to completed dots", () => {
    const { container } = render(
      <YearDots
        completedDates={new Set(["2025-01-01"])}
        color="#3b82f6"
        frequency={[0, 1, 2, 3, 4, 5, 6]}
        year={2025}
      />
    );
    const jan1 = container.querySelector('[title="2025-01-01"]') as HTMLElement;
    // jsdom converts hex to rgb
    expect(jan1.style.backgroundColor).toBe("rgb(59, 130, 246)");
  });

  it("non-scheduled dots are transparent", () => {
    // Weekdays only, check a Saturday
    const { container } = render(
      <YearDots
        completedDates={new Set()}
        color="#10b981"
        frequency={[1, 2, 3, 4, 5]}
        year={2025}
      />
    );
    // 2025-01-04 is a Saturday
    const sat = container.querySelector('[title="2025-01-04"]') as HTMLElement;
    expect(sat.style.backgroundColor).toBe("transparent");
  });
});
