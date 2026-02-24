import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { BookEditView } from "./BookEditView";

type BookEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookEditPage({ params }: BookEditPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const [{ data: book }, { data: chapters }] = await Promise.all([
    supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .eq("author_clerk_id", userId)
      .maybeSingle(),
    supabase
      .from("chapters")
      .select("id, title, order_index, content_md, is_premium, price_credits")
      .eq("book_id", id)
      .order("order_index", { ascending: true }),
  ]);

  if (!book) notFound();

  return (
    <BookEditView
      book={book}
      chapters={chapters ?? []}
    />
  );
}
