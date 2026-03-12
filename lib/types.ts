export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  color: string;
  frequency: number[];
  created_at: string;
}

export interface Completion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  created_at: string;
}

export type BuddyStatus = "pending" | "accepted" | "declined";

export interface BuddyRequest {
  id: string;
  from_user_id: string;
  to_user_id: string | null;
  invite_code: string | null;
  status: BuddyStatus;
  created_at: string;
}
