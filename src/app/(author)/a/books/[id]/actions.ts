"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabaseClient";
import {
  BOOK_TITLE_MAX,
  BOOK_DESC_MAX,
  CHAPTER_TITLE_MAX,
} from "@/lib/constants";

export async function updateBook(
  bookId: string,
  updates: Partial<{
    title: string;
    description: string;
    cover_url: string;
    genre: string;
    tags: string[];
    chapter_prefix: string;
  }>
) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { error } = await supabase
    .from("books")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookId)
    .eq("author_clerk_id", userId);

  if (error) console.error("[books] update error", error);
  revalidatePath(`/a/books/${bookId}`);
}

export async function addChapter(
  bookId: string,
  opts: {
    title: string;
    content: string;
    order: number;
    isPremium: boolean;
    price: number;
  }
) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: book } = await supabase
    .from("books")
    .select("id")
    .eq("id", bookId)
    .eq("author_clerk_id", userId)
    .single();

  if (!book) return;

  const title = opts.title.trim().slice(0, CHAPTER_TITLE_MAX) || `Chapter ${opts.order}`;

  const { error } = await supabase.from("chapters").insert({
    book_id: bookId,
    title,
    content_md: opts.content || "",
    order_index: opts.order,
    is_premium: opts.isPremium,
    price_credits: opts.isPremium ? opts.price : 0,
  });

  if (error) console.error("[chapters] add error", error);
  revalidatePath(`/a/books/${bookId}`);
}

export async function deleteChapter(chapterId: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: ch } = await supabase
    .from("chapters")
    .select("book_id, order_index")
    .eq("id", chapterId)
    .single();

  if (!ch) return;

  const { data: book } = await supabase
    .from("books")
    .select("author_clerk_id")
    .eq("id", ch.book_id)
    .single();

  if (!book || book.author_clerk_id !== userId) return;

  await supabase.from("chapters").delete().eq("id", chapterId);

  const { data: remainingChapters } = await supabase
    .from("chapters")
    .select("id")
    .eq("book_id", ch.book_id)
    .gt("order_index", ch.order_index)
    .order("order_index", { ascending: true });

  if (remainingChapters && remainingChapters.length > 0) {
    const updates = remainingChapters.map((c, i) => ({
      id: c.id,
      order_index: ch.order_index + i,
      updated_at: new Date().toISOString(),
    }));

    for (const u of updates) {
      await supabase
        .from("chapters")
        .update({ order_index: u.order_index, updated_at: u.updated_at })
        .eq("id", u.id);
    }
  }

  revalidatePath(`/a/books/${ch.book_id}`);
}

export async function updateChapter(
  chapterId: string,
  opts: { title?: string; content?: string }
) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: ch } = await supabase
    .from("chapters")
    .select("book_id")
    .eq("id", chapterId)
    .single();

  if (!ch) return;

  const { data: book } = await supabase
    .from("books")
    .select("author_clerk_id")
    .eq("id", ch.book_id)
    .single();

  if (!book || book.author_clerk_id !== userId) return;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (opts.title !== undefined)
    updates.title = opts.title.trim().slice(0, CHAPTER_TITLE_MAX);
  if (opts.content !== undefined) updates.content_md = opts.content;

  await supabase.from("chapters").update(updates).eq("id", chapterId);
  revalidatePath(`/a/books/${ch.book_id}`);
}
