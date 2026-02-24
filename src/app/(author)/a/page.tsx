import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getUserCredits } from "@/lib/credits";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";
import { BookListItem } from "@/lib/types";

async function AuthorDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [creditsResult, booksResult] = await Promise.all([
    getUserCredits(userId),
    supabase
      .from("books")
      .select("id, title, description, cover_url, approval_status")
      .eq("author_clerk_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const books: BookListItem[] = booksResult.data ?? [];

  return (
    <div className="space-y-8">
      <section className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My books</h1>
          <p className="text-sm text-zinc-600">
            Create and manage your books. Submit for approval to publish to readers.
          </p>
        </div>
        <Card className="text-sm">
          <CardContent className="py-3">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Your balance
            </div>
            <div className="text-lg font-semibold">{creditsResult} credits</div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <Button asChild>
          <Link href="/a/books/new">Create new book</Link>
        </Button>
        {books.length === 0 ? (
          <p className="text-sm text-zinc-500">You have not created any books yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {books.map(({id, title, description, cover_url, approval_status}) => (
              <BookCard key={id} id={id} title={title} description={description} cover_url={cover_url} approval_status={approval_status}/>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AuthorDashboard;