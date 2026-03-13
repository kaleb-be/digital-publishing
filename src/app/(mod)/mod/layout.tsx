import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { isModerator } from "@/lib/moderation";

export default async function ModLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const mod = await isModerator(userId);
  if (!mod) redirect("/");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-amber-50/95 backdrop-blur ">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/mod" className="text-lg font-semibold tracking-tight">
            Biir · Moderation
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/mod"
              className="text-sm text-zinc-600
              hover:text-orange-900 hover:text-shadow-orange-600 hover:text-shadow-2xs font-bold"
            >
              Pending books
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </nav>
      </header>
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-6">{children}</main>
    </>
  );
}
