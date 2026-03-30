"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { COMMENT_MAX } from "@/lib/constants";

type Comment = {
  id: string;
  content: string;
  clerk_user_id: string;
  created_at: string;
};

export function BookComments({ bookId }: { bookId: string }) {
  const { user, isSignedIn } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    supabase
      .from("book_comments")
      .select("id, content, clerk_user_id, created_at")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setComments((data as Comment[]) ?? []);
        setFetching(false);
      });
  }, [bookId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("book_comments").insert({
      book_id: bookId,
      clerk_user_id: user.id,
      content: newComment.trim().slice(0, COMMENT_MAX),
    });
    setLoading(false);
    if (!error) {
      setNewComment("");
      setComments((prev) => [
        {
          id: crypto.randomUUID(),
          content: newComment.trim().slice(0, COMMENT_MAX),
          clerk_user_id: user.id,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Comments
      </h2>
      {isSignedIn && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value.slice(0, COMMENT_MAX))}
            maxLength={COMMENT_MAX}
            className="min-h-[80px]"
          />
          <p className="text-xs text-zinc-500">
            {newComment.length}/{COMMENT_MAX}
          </p>
          <Button type="submit" size="sm" disabled={loading || !newComment.trim()}>
            Post comment
          </Button>
        </form>
      )}
      {!isSignedIn && (
        <p className="text-sm text-zinc-500">Sign in to leave a comment.</p>
      )}
      {fetching ? (
        <p className="text-sm text-zinc-500">Loading comments...</p>
      ) : (
        <div className="space-y-2">
          {comments.length === 0 ? (
            <p className="text-sm text-zinc-500">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="rounded-md border border-zinc-200 bg-zinc-50 p-2 text-sm "
              >
                <p className="text-zinc-700 ">{c.content}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {new Date(c.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
