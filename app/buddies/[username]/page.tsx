import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { HabitCard } from "@/components/habit-card";
import { Avatar } from "@/components/avatar";
import { calculateStreak } from "@/lib/streaks";
import type { Habit, Completion, Profile } from "@/lib/types";

export default async function BuddyViewPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();
  const p = profile as Profile;

  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", p.id)
    .order("created_at", { ascending: true });

  const { data: completions } = await supabase
    .from("completions")
    .select("*")
    .eq("user_id", p.id);

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
        <div className="mb-6 flex items-center gap-4">
          <Avatar
            url={p.avatar_url}
            name={p.display_name || p.username}
            size={48}
          />
          <div>
            <h1 className="text-2xl font-bold">
              {p.display_name || p.username}
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              @{p.username}
            </p>
          </div>
        </div>

        {(!habits || habits.length === 0) ? (
          <p className="text-stone-500 dark:text-stone-400">
            No habits yet.
          </p>
        ) : (
          <div className="space-y-4">
            {(habits as Habit[]).map((habit) => {
              const dates =
                completionsByHabit.get(habit.id) || new Set<string>();
              const streak = calculateStreak(dates, habit.frequency);
              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  completedDates={dates}
                  streak={streak}
                  readOnly
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
