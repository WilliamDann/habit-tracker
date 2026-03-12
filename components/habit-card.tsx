"use client";

import { YearDots } from "./year-dots";
import { toggleCompletion } from "@/actions/completions";
import { deleteHabit } from "@/actions/habits";
import { formatDate } from "@/lib/streaks";
import type { Habit } from "@/lib/types";

interface HabitCardProps {
  habit: Habit;
  completedDates: Set<string>;
  streak: number;
  readOnly?: boolean;
}

export function HabitCard({
  habit,
  completedDates,
  streak,
  readOnly = false,
}: HabitCardProps) {
  const today = formatDate(new Date());
  const isDoneToday = completedDates.has(today);

  return (
    <div className="rounded-lg border border-stone-200 p-4 dark:border-stone-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: habit.color }}
          />
          <h3 className="font-medium">{habit.name}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500 dark:text-stone-400">
            {streak} day streak
          </span>
          {!readOnly && (
            <>
              <button
                onClick={() => toggleCompletion(habit.id, today, isDoneToday)}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                  isDoneToday
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                    : "bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-stone-800 dark:text-stone-400"
                }`}
              >
                {isDoneToday ? "Done" : "Mark Done"}
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this habit?")) deleteHabit(habit.id);
                }}
                className="text-sm text-stone-400 hover:text-red-500"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      <YearDots
        completedDates={completedDates}
        color={habit.color}
        frequency={habit.frequency}
      />
    </div>
  );
}
