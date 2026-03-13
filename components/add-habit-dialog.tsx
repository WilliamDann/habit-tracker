"use client";

import { useRef, useState } from "react";
import { createHabit } from "@/actions/habits";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PRESETS = {
  daily: [0, 1, 2, 3, 4, 5, 6],
  weekdays: [1, 2, 3, 4, 5],
  weekends: [0, 6],
};

export function AddHabitDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [preset, setPreset] = useState<"daily" | "weekdays" | "weekends" | "custom">("daily");
  const [customDays, setCustomDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  function getFrequency() {
    if (preset === "custom") return customDays;
    return PRESETS[preset];
  }

  function toggleDay(day: number) {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createHabit(name.trim(), color, getFrequency());
    setName("");
    setColor(COLORS[0]);
    setPreset("daily");
    setCustomDays([0, 1, 2, 3, 4, 5, 6]);
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Add Habit
      </button>

      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 text-stone-900 shadow-lg backdrop:bg-black/50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
      >
        <h2 className="mb-4 text-lg font-semibold">New Habit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="habit-name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="habit-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-stone-700 dark:bg-stone-800"
              placeholder="e.g. Exercise"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    color === c ? "scale-110 ring-2 ring-offset-2 ring-stone-400" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Frequency</label>
            <div className="flex gap-2 mb-2">
              {(["daily", "weekdays", "weekends", "custom"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreset(p)}
                  className={`rounded-md px-3 py-1 text-sm capitalize ${
                    preset === p
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {DAY_LABELS.map((label, i) => {
                const activeDays = preset === "custom" ? customDays : PRESETS[preset];
                const isActive = activeDays.includes(i);
                const isCustom = preset === "custom";
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (!isCustom) {
                        setPreset("custom");
                        setCustomDays(
                          isActive
                            ? activeDays.filter((d) => d !== i)
                            : [...activeDays, i].sort()
                        );
                      } else {
                        toggleDay(i);
                      }
                    }}
                    className={`rounded-md px-2 py-1 text-xs ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-200/50 text-stone-400 dark:bg-stone-800/50 dark:text-stone-600"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-md px-4 py-2 text-sm text-stone-600 hover:text-stone-800 dark:text-stone-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Create
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
