import { supabase } from "./supabaseClient";

export async function isModerator(clerkUserId: string): Promise<boolean> {
  const { data } = await supabase
    .from("moderators")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();
  return !!data;
}
