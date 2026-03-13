import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { HabitCard } from "@/components/habit-card";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { calculateStreak } from "@/lib/streaks";
import type { Habit, Completion } from "@/lib/types";

export const metadata = {
  title: "Dashboard — Habit Tracker",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  const { data: completions } = await supabase
    .from("completions")
    .select("*")
    .eq("user_id", user!.id);

  const completionsByHabit = new Map<string, Set<string>>();
  (completions as Completion[] | null)?.forEach((c) => {
    if (!completionsByHabit.has(c.habit_id)) {
      completionsByHabit.set(c.habit_id, new Set());
    }
    completionsByHabit.get(c.habit_id)!.add(c.completed_date);
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Habits</h1>
          <AddHabitDialog />
        </div>

        {(!habits || habits.length === 0) ? (
          <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400">
              No habits yet. Add one to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(habits as Habit[]).map((habit) => {
              const dates = completionsByHabit.get(habit.id) || new Set<string>();
              const streak = calculateStreak(dates, habit.frequency);
              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  completedDates={dates}
                  streak={streak}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
