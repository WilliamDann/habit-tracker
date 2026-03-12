import Link from "next/link";
import { Avatar } from "./avatar";
import type { Profile } from "@/lib/types";

interface BuddyCardProps {
  profile: Profile;
}

export function BuddyCard({ profile }: BuddyCardProps) {
  return (
    <Link
      href={`/buddies/${profile.username}`}
      className="flex items-center gap-3 rounded-lg border border-stone-200 p-3 transition-colors hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-900"
    >
      <Avatar
        url={profile.avatar_url}
        name={profile.display_name || profile.username}
      />
      <div>
        <p className="font-medium">
          {profile.display_name || profile.username}
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          @{profile.username}
        </p>
      </div>
    </Link>
  );
}
