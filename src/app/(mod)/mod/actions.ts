"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabaseClient";
import { isModerator } from "@/lib/moderation";

export async function approveBook(bookId: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const mod = await isModerator(userId);
  if (!mod) redirect("/");

  await supabase
    .from("books")
    .update({ approval_status: "approved", updated_at: new Date().toISOString() })
    .eq("id", bookId);
  revalidatePath("/mod");
}

export async function rejectBook(bookId: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const mod = await isModerator(userId);
  if (!mod) redirect("/");

  await supabase
    .from("books")
    .update({ approval_status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", bookId);
  revalidatePath("/mod");
}
