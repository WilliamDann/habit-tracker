"use client";

import { getDatesForYear, getDayOfWeek } from "@/lib/dates";

interface YearDotsProps {
  completedDates: Set<string>;
  color: string;
  frequency: number[];
  year?: number;
}

export function YearDots({
  completedDates,
  color,
  frequency,
  year = new Date().getFullYear(),
}: YearDotsProps) {
  const dates = getDatesForYear(year);
  const freqSet = new Set(frequency);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
        {dates.map((date) => {
          const isScheduled = freqSet.has(getDayOfWeek(date));
          const isCompleted = completedDates.has(date);
          const isToday = date === todayStr;

          return (
            <div
              key={date}
              className="h-[11px] w-[11px] rounded-[2px]"
              title={date}
              style={{
                backgroundColor: isCompleted
                  ? color
                  : isScheduled
                    ? "var(--dot-empty)"
                    : "transparent",
                opacity: !isScheduled ? 0.1 : 1,
                outline: isToday ? `2px solid ${color}` : undefined,
                outlineOffset: isToday ? "1px" : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
