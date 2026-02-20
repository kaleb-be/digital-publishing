import { supabase } from "./supabaseClient";

// Minimal credit helper layer. This assumes a `profiles` table:
// id (uuid, primary key) | clerk_user_id (text, unique) | credits (int4, default 0)

export async function getUserCredits(clerkUserId: string): Promise<number> {
  const { data, error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) {
    console.error("[credits] getUserCredits error", error);
    return 0;
  }

  return data?.credits ?? 0;
}

export async function addCredits(
  clerkUserId: string,
  amount: number
): Promise<number> {
  const { data, error } = await supabase.rpc("add_credits", {
    p_clerk_user_id: clerkUserId,
    p_amount: amount,
  });

  if (error) {
    console.error("[credits] addCredits error", error);
    throw error;
  }

  return data as number;
}

export async function spendCredits(
  clerkUserId: string,
  amount: number
): Promise<number> {
  const { data, error } = await supabase.rpc("spend_credits", {
    p_clerk_user_id: clerkUserId,
    p_amount: amount,
  });

  if (error) {
    console.error("[credits] spendCredits error", error);
    throw error;
  }

  return data as number;
}

