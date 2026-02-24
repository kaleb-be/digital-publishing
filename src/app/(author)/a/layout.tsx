import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { isModerator } from "@/lib/moderation";

export default async function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const mod = await isModerator(userId);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-orange-50">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/a" className="text-lg font-semibold tracking-tight">
            Biir · Author
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/a"
              className="text-sm text-zinc-600
              hover:text-orange-900 hover:text-shadow-orange-600 hover:text-shadow-2xs font-bold"
            >
              My books
            </Link>
            <Link
              href="/"
              className="text-sm text-zinc-600
              hover:text-orange-900 hover:text-shadow-orange-600 hover:text-shadow-2xs font-bold"
            >
              Discover
            </Link>
            <Button asChild size="sm" color="orange" variant='secondary'>
              <Link href="/a/books/new" >New book</Link>
            </Button>
            {mod && (
              <Link
                href="/mod"
                className="text-sm text-zinc-600
              hover:text-orange-900 hover:text-shadow-orange-600 hover:text-shadow-2xs "
              >
                Moderation
              </Link>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </nav>
      </header>
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-6">{children}</main>
    </>
  );
}
