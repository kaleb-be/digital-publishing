"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { BOOK_TITLE_MAX, BOOK_DESC_MAX } from "@/lib/constants";

export async function createBook(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const title = String(formData.get("title") ?? "").trim().slice(0, BOOK_TITLE_MAX);
  const description = String(formData.get("description") ?? "")
    .trim()
    .slice(0, BOOK_DESC_MAX);
  const coverUrl = String(formData.get("cover_url") ?? "").trim();
  const coverSource = coverUrl ? "unsplash" : null;
  const genre = String(formData.get("genre") ?? "").trim() || null;
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const chapterPrefix = String(formData.get("chapter_prefix") ?? "").trim() || null;

  if (!title) return;

  const user = await currentUser();

  const authorName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName ?? user?.username ?? null;

  const { data: book, error } = await supabase
    .from("books")
    .insert({
      title,
      description: description || null,
      cover_url: coverUrl || null,
      cover_source: coverSource,
      author_clerk_id: userId,
      author_name: authorName,
      genre,
      tags,
      chapter_prefix: chapterPrefix,
      approval_status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[books] create error", error);
    return;
  }
  redirect(`/a/books/${book.id}`);
}
