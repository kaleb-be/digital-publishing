import { auth } from "@clerk/nextjs/server";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getUserCredits, spendCredits, addCredits } from "@/lib/credits";
import { Button } from "@/components/ui/button";
import useContentProtection from "@/hooks/useContentProtection";
import ContentProtectionWrapper from "@/components/ContentProtectionWrapper";
import {injectWatermark} from "@/lib/watermark";

type ChapterPageProps = {
  params: Promise<{ id: string; cid: string }>;
};
// TODO: UPDATE chapter list to have a unlocked indicator instead of just required credits
// todo: when going prod, make sure to only render html chapter content, not markdown

async function purchaseChapter(chapterId: string, price: number, authorClerkId: string) {
  "use server";
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const credits = await getUserCredits(userId);
  if (credits < price) return;
  await spendCredits(userId, price);
  await supabase.from("chapter_purchases").insert({
    chapter_id: chapterId,
    clerk_user_id: userId,
  });
  // Add credits to the author
  await addCredits(authorClerkId, price);
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { userId } = await auth();
  const { id: bookId, cid: chapterId } = await params;
  const [
    { data: chapter },
    { data: book },
    { data: purchases },
  ] = await Promise.all([
    supabase
      .from("chapters")
      .select("id, title, content_md, order_index, is_premium, price_credits, book_id, content_html")
      .eq("id", chapterId)
      .maybeSingle(),
    supabase.from("books").select("id, title, chapter_prefix, approval_status, author_clerk_id").eq("id", bookId).maybeSingle(),
    userId
      ? supabase
          .from("chapter_purchases")
          .select("id")
          .eq("chapter_id", chapterId)
          .eq("clerk_user_id", userId)
      : Promise.resolve({ data: null } as { data: unknown }),
  ]);

  if (!chapter || !book || book.approval_status !== "approved") {
    notFound();
  }

  const protectedHtml =
    chapter.content_html && userId
      ? injectWatermark(chapter.content_html, userId)
      : chapter.content_html;

  const hasPurchased = Boolean(purchases && Array.isArray(purchases) && purchases.length > 0);
  const shouldGate =
    chapter.is_premium && !hasPurchased && (chapter.price_credits ?? 0) > 0;

  const order = (chapter as { order_index?: number }).order_index ?? 1;
  const displayTitle = book.chapter_prefix
    ? `${book.chapter_prefix} ${order}. ${chapter.title}`
    : chapter.title;

  async function handlePurchase() {
    "use server";
    await purchaseChapter(chapterId, chapter!.price_credits ?? 0, book!.author_clerk_id);
    revalidatePath(`/book/${bookId}`);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          <Link href={`/books/${bookId}`} className="hover:underline">
            {book.title}
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{displayTitle}</h1>
      </div>

      {shouldGate ? (
        <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p>
            This is a premium chapter. Unlock it for{" "}
            <span className="font-semibold">{chapter.price_credits} credits</span>.
          </p>
          <div className="flex flex-wrap gap-2">
            {userId && (
              <form action={handlePurchase}>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-amber-600 text-xs font-semibold text-white hover:bg-amber-100 hover:text-amber-600"
                >
                  Unlock chapter
                </Button>
              </form>
            )}
            {!userId && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-amber-400 text-xs bg-amber-50 text-amber-900 hover:bg-amber-100/60 "
              >
                <Link href="/sign-in">Sign in to purchase</Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <ContentProtectionWrapper>
          <article className="prose max-w-none rounded-lg border border-zinc-200 bg-white p-4 text-sm">
            {chapter.content_html ? (
              <div dangerouslySetInnerHTML={{ __html: protectedHtml ?? `<>Chapter is empty...</>` }} />
            ) : (
              <ReactMarkdown>{chapter.content_md ?? ""}</ReactMarkdown>
            )}
          </article>
        </ContentProtectionWrapper>
      )}
    </div>
  );
}
