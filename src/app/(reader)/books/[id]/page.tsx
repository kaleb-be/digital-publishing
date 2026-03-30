import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { BookComments } from "./BookComments";

type BookPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;

  const [{ data: book }, { data: chapters }] = await Promise.all([
    supabase
      .from("books")
      .select("id, title, description, author_name, cover_url, genre, tags, approval_status")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("chapters")
      .select("id, title, order_index, is_premium, price_credits")
      .eq("book_id", id)
      .order("order_index", { ascending: true }),
  ]);

  if (!book || book.approval_status !== "approved") {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="flex gap-6">
        <div className="h-64 w-44 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl text-zinc-400">
              📖
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{book.title}</h1>
          {book.author_name && (
            <p className="text-sm text-zinc-500">
              by <span className="font-medium">{book.author_name}</span>
            </p>
          )}
          {book.genre && (
            <p className="text-sm text-zinc-500">{book.genre}</p>
          )}
          {book.tags && book.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {book.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs "
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {book.description && (
            <p className="max-w-2xl text-sm text-zinc-600 ">
              {book.description}
            </p>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Chapters
        </h2>
        {chapters && chapters.length > 0 ? (
          <div className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white ">
            {chapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/books/${book.id}/chapters/${ch.id}`}
                className="flex items-center justify-between px-3 py-2 text-sm hover:bg-zinc-50 "
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">#{ch.order_index}</span>
                  <span className="font-medium">{ch.title}</span>
                </div>
                {ch.is_premium ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700 ">
                    Premium · {ch.price_credits} credits
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700 ">
                    Free
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No chapters yet.</p>
        )}
      </section>

      <BookComments bookId={book.id} />
    </div>
  );
}
