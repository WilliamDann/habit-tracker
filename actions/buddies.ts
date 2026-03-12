"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendBuddyRequest(username: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: target } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (!target) return { error: "User not found" };
  if (target.id === user.id) return { error: "Cannot add yourself" };

  const { error } = await supabase.from("buddy_requests").insert({
    from_user_id: user.id,
    to_user_id: target.id,
  });

  if (error) {
    if (error.code === "23505") return { error: "Request already sent" };
    return { error: error.message };
  }

  revalidatePath("/buddies");
  return {};
}

export async function acceptRequest(requestId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("buddy_requests")
    .update({ status: "accepted" })
    .eq("id", requestId);

  if (error) throw new Error(error.message);
  revalidatePath("/buddies");
}

export async function declineRequest(requestId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("buddy_requests")
    .update({ status: "declined" })
    .eq("id", requestId);

  if (error) throw new Error(error.message);
  revalidatePath("/buddies");
}

export async function removeBuddy(requestId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("buddy_requests")
    .delete()
    .eq("id", requestId);

  if (error) throw new Error(error.message);
  revalidatePath("/buddies");
}

export async function createInviteCode() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const code = Math.random().toString(36).substring(2, 8);

  const { error } = await supabase.from("buddy_requests").insert({
    from_user_id: user.id,
    invite_code: code,
  });

  if (error) return { error: error.message };
  return { code };
}

export async function acceptInviteByCode(code: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: request } = await supabase
    .from("buddy_requests")
    .select("*")
    .eq("invite_code", code)
    .eq("status", "pending")
    .single();

  if (!request) return { error: "Invalid or expired invite" };
  if (request.from_user_id === user.id)
    return { error: "Cannot accept your own invite" };

  const { error } = await supabase
    .from("buddy_requests")
    .update({ to_user_id: user.id, status: "accepted" })
    .eq("id", request.id);

  if (error) return { error: error.message };
  revalidatePath("/buddies");
  return {};
}
