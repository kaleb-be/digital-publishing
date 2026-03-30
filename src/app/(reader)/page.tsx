import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import {auth} from "@clerk/nextjs/server";
import BookCard from "@/components/BookCard";
import {BookListItem} from "@/lib/types";

type BookCard = {
  id: string;
  title: string;
  description: string | null;
  author_name: string | null;
  cover_url: string | null;
  genre: string | null;
  tags: string[] | null;
};

export default async function ReaderHome() {
  const { data } = await supabase
    .from("books")
    .select("id, title, description, author_name, cover_url, genre, tags")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false })
    .limit(12);

  const { userId } = await auth();
  const isSignedIn = !!userId;

  // const books: BookCard[] = (data as BookCard[]) ?? [];
  const books: BookListItem[] = data as BookListItem[] ?? [];

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Discover your next favorite book
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600 ">
          Biir lets authors publish serialized fiction with rich chapters. Support
          writers with credits.
        </p>
        {!isSignedIn && (
          <div className="flex flex-wrap gap-3 text-sm">
            <Button asChild variant="outline">
              <Link href="/sign-up">Create reader account</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Featured books</h2>
        {books.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No approved books yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              // <BookCard key={id} id={id} title={title} description={description} cover_url={cover_url} approval_status={approval_status}/>

              <Card
            key={book.id}
            className="group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Link href={`/books/${book.id}`} className="block">
              <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl text-zinc-400">
                    📖
                  </div>
                )}
              </div>
              <CardContent className="space-y-1.5 p-3">
                <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-zinc-900 ">
                  {book.title}
                </h3>
                {book.author_name && (
                  <p className="text-xs text-zinc-500">
                    by <span className="font-medium">{book.author_name}</span>
                  </p>
                )}
                {book.genre && (
                  <p className="text-xs text-zinc-500">{book.genre}</p>
                )}
                {book.description && (
                  <p className="line-clamp-3 text-xs text-zinc-600 dark:text-zinc-300">
                    {book.description}
                  </p>
                )}
              </CardContent>
            </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
