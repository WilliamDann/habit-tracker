import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { ProfileForm } from "@/components/profile-form";
import { Avatar } from "@/components/avatar";
import type { Profile } from "@/lib/types";

export const metadata = {
  title: "Profile — Habit Tracker",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const p = profile as Profile;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Profile</h1>
        <div className="mb-6 flex items-center gap-4">
          <Avatar
            url={p.avatar_url}
            name={p.display_name || p.username}
            size={64}
          />
          <div>
            <p className="font-medium">
              {p.display_name || p.username}
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              @{p.username}
            </p>
          </div>
        </div>
        <ProfileForm profile={p} />
      </main>
    </>
  );
}
