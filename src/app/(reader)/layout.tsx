import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-amber-200 bg-amber/85 backdrop-blur ">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className=" text-lg font-semibold tracking-tight">
            Biir
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-zinc-600 hover:text-zinc-900 "
            >
              Discover
            </Link>
            <p>|</p>
            <Link
              href="/a"
              className="text-sm text-zinc-600 hover:text-zinc-900 "
            >
              For authors
            </Link>
            <p>|</p>

            <SignedOut>
              <Button asChild variant="outline" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </nav>
      </header>
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-6">{children}</main>
    </>
  );
}
