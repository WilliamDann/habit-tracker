import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { HabitCard } from "@/components/habit-card";
import type { Habit } from "@/lib/types";

// Mock server actions
vi.mock("@/actions/completions", () => ({
  toggleCompletion: vi.fn(),
}));
vi.mock("@/actions/habits", () => ({
  deleteHabit: vi.fn(),
}));

const mockHabit: Habit = {
  id: "1",
  user_id: "u1",
  name: "Exercise",
  color: "#10b981",
  frequency: [0, 1, 2, 3, 4, 5, 6],
  created_at: "2025-01-01T00:00:00Z",
};

afterEach(cleanup);

describe("HabitCard", () => {
  it("renders habit name", () => {
    render(
      <HabitCard
        habit={mockHabit}
        completedDates={new Set()}
        streak={5}
      />
    );
    expect(screen.getByText("Exercise")).toBeInTheDocument();
  });

  it("renders streak count", () => {
    render(
      <HabitCard
        habit={mockHabit}
        completedDates={new Set()}
        streak={5}
      />
    );
    expect(screen.getByText("5 day streak")).toBeInTheDocument();
  });

  it("shows Mark Done when not done today", () => {
    render(
      <HabitCard
        habit={mockHabit}
        completedDates={new Set()}
        streak={0}
      />
    );
    expect(screen.getByText("Mark Done")).toBeInTheDocument();
  });

  it("shows Done when completed today", () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const todayStr = `${y}-${m}-${d}`;

    render(
      <HabitCard
        habit={mockHabit}
        completedDates={new Set([todayStr])}
        streak={1}
      />
    );
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("hides toggle and delete in readOnly mode", () => {
    render(
      <HabitCard
        habit={mockHabit}
        completedDates={new Set()}
        streak={0}
        readOnly
      />
    );
    expect(screen.queryByText("Mark Done")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });
});
