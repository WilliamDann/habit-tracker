"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleCompletion(
  habitId: string,
  date: string,
  isCompleted: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  if (isCompleted) {
    const { error } = await supabase
      .from("completions")
      .delete()
      .eq("habit_id", habitId)
      .eq("completed_date", date)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("completions").insert({
      habit_id: habitId,
      user_id: user.id,
      completed_date: date,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}
