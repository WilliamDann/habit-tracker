import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { BuddyCard } from "@/components/buddy-card";
import { AddBuddyDialog } from "@/components/add-buddy-dialog";
import { acceptRequest, declineRequest } from "@/actions/buddies";
import type { Profile, BuddyRequest } from "@/lib/types";

export const metadata = {
  title: "Buddies — Habit Tracker",
};

export default async function BuddiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get accepted buddies
  const { data: requests } = await supabase
    .from("buddy_requests")
    .select("*, from_profile:profiles!buddy_requests_from_user_id_fkey(*), to_profile:profiles!buddy_requests_to_user_id_fkey(*)")
    .or(`from_user_id.eq.${user!.id},to_user_id.eq.${user!.id}`);

  const accepted = (requests || []).filter(
    (r: any) => r.status === "accepted"
  );
  const pendingIncoming = (requests || []).filter(
    (r: any) => r.status === "pending" && r.to_user_id === user!.id
  );

  const buddyProfiles: Profile[] = accepted.map((r: any) =>
    r.from_user_id === user!.id ? r.to_profile : r.from_profile
  ).filter(Boolean);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Buddies</h1>
          <AddBuddyDialog />
        </div>

        {pendingIncoming.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold">Pending Requests</h2>
            <div className="space-y-2">
              {pendingIncoming.map((r: any) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-stone-200 p-3 dark:border-stone-800"
                >
                  <p className="text-sm">
                    <span className="font-medium">
                      {r.from_profile?.display_name || r.from_profile?.username}
                    </span>{" "}
                    wants to be your buddy
                  </p>
                  <div className="flex gap-2">
                    <form action={acceptRequest.bind(null, r.id)}>
                      <button
                        type="submit"
                        className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700"
                      >
                        Accept
                      </button>
                    </form>
                    <form action={declineRequest.bind(null, r.id)}>
                      <button
                        type="submit"
                        className="rounded-md bg-stone-200 px-3 py-1 text-sm text-stone-700 hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-300"
                      >
                        Decline
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {buddyProfiles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400">
              No buddies yet. Add one to stay accountable!
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {buddyProfiles.map((profile) => (
              <BuddyCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
