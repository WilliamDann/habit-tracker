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
  const allDates = getDatesForYear(year);
  const freqSet = new Set(frequency);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
        {Array.from({ length: getDayOfWeek(allDates[0]) }, (_, i) => (
          <div key={`spacer-${i}`} className="h-[11px] w-[11px]" />
        ))}
        {allDates.map((date) => {
          const isScheduled = freqSet.has(getDayOfWeek(date));
          const isCompleted = completedDates.has(date);
          const isToday = date === todayStr;

          return (
            <div
              key={date}
              className="h-[11px] w-[11px] rounded-[2px]"
              title={date}
              style={{
                backgroundColor: isCompleted ? color : "var(--dot-empty)",
                opacity: isScheduled ? 1 : 0.3,
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
