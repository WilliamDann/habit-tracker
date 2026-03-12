import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { acceptInviteByCode } from "@/actions/buddies";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/invite/${code}`);
  }

  const result = await acceptInviteByCode(code);

  if (result?.error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invite Error</h1>
          <p className="text-stone-500 dark:text-stone-400">{result.error}</p>
          <a
            href="/buddies"
            className="mt-4 inline-block text-emerald-600 hover:text-emerald-700"
          >
            Go to Buddies
          </a>
        </div>
      </div>
    );
  }

  redirect("/buddies");
}
