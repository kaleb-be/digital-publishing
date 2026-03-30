"use client";
// TODO: allow removal of Books
// todo: enforce confirmation on removal of chopters
// todo: enforce confirmation on removal of books

import {useState} from "react";
import {addChapter, deleteChapter, updateBook, updateChapter,} from "./actions";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {EditPencil} from "@/components/ui/edit-pencil";
import {BOOK_DESC_MAX, BOOK_TITLE_MAX, CHAPTER_TITLE_MAX, COVER_PRESETS,} from "@/lib/constants";
import {Checkbox} from "@/components/ui/checkbox";
import TinyEditor from "@/components/editor/TinyEditor";

type Book = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  genre: string | null;
  tags: string[] | null;
  chapter_prefix: string | null;
  approval_status: string | null;
};

type Chapter = {
  id: string;
  title: string;
  order_index: number;
  content_md?: string;
  is_premium: boolean;
  price_credits: number;
};

export function BookEditView({
                               book,
                               chapters: initialChapters,
                             }: {
  book: Book;
  chapters: Chapter[];
}) {
  const [chapters, setChapters] = useState(initialChapters);
  const [editingCover, setEditingCover] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [addingChapter, setAddingChapter] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/*Book cover and title*/}
      <section className="flex gap-6">
        <div className="relative shrink-0">
          <div className="h-64 w-44 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
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
          <EditPencil
            className="absolute right-1 top-1 w-fit px-2 opacity-90"
            onClick={() => setEditingCover(!editingCover)}
            text=" Edit cover"
          />
          {editingCover && (
            <form
              action={async (fd) => {
                await updateBook(book.id, {cover_url: fd.get("cover_url") as string});
                setEditingCover(false);
                window.location.reload();
              }}
              className="absolute left-0 top-0 z-10 flex flex-col gap-2 rounded-lg border bg-white p-2 shadow-lg dark:bg-zinc-900"
            >
              <div className="flex flex-wrap gap-1">
                {COVER_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="submit"
                    name="cover_url"
                    value={p.url}
                    className="overflow-hidden rounded border"
                  >
                    <img src={p.url} alt="" className="h-16 w-12 object-cover"/>
                  </button>
                ))}
              </div>
              <Input
                name="cover_url"
                placeholder="Custom URL"
                className="w-40"
              />
              <Button type="submit" size="sm">
                Set
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditingCover(false)}
              >
                Cancel
              </Button>
            </form>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          {editingTitle ? (
            <form
              action={async (fd) => {
                await updateBook(book.id, {
                  title: (fd.get("title") as string).slice(0, BOOK_TITLE_MAX),
                });
                setEditingTitle(false);
                window.location.reload();
              }}
              className="flex items-center gap-2"
            >
              <Input
                name="title"
                defaultValue={book.title}
                maxLength={BOOK_TITLE_MAX}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                Save
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditingTitle(false)}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{book.title}</h1>
              <EditPencil onClick={() => setEditingTitle(true)}/>
            </div>
          )}
          {editingDesc ? (
            <form
              action={async (fd) => {
                await updateBook(book.id, {
                  description: (fd.get("description") as string).slice(0, BOOK_DESC_MAX),
                });
                setEditingDesc(false);
                window.location.reload();
              }}
              className="space-y-2"
            >
              <Textarea
                name="description"
                defaultValue={book.description ?? ""}
                maxLength={BOOK_DESC_MAX}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingDesc(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-start gap-2">
              <p className="text-sm text-zinc-600 italic">
                {book.description || "No description"}
              </p>
              <EditPencil onClick={() => setEditingDesc(true)}/>
            </div>
          )}
          <p className="text-xs text-zinc-500">
            Status: <span className="font-medium">{book.approval_status}</span>
          </p>
        </div>
      </section>

      <Card className={'border-x-0 border-b-0 rounded-none border-t-[0.5]'}>
        <CardHeader>
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {chapters.map((ch, idx) => (
              <div
                key={ch.id}
                className="flex flex-col gap-3 rounded border p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">#{idx + 1}</span>
                    {editingChapterId !== ch.id && (
                      <>
                        <span className="font-medium">{ch.title}</span>
                        <EditPencil onClick={() => setEditingChapterId(ch.id)}/>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {ch.is_premium && !editingChapterId && (
                      <span className="text-xs text-amber-600">{ch.price_credits} credits</span>
                    )}
                    {!editingChapterId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={async () => {
                          if (confirm("Delete this chapter?")) {
                            await deleteChapter(ch.id);
                            setChapters((prev) => prev.filter((c) => c.id !== ch.id));
                            window.location.reload();
                          }
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                {editingChapterId === ch.id && (
                  <ChapterEditForm
                    chapter={ch}
                    bookId={book.id}
                    onDone={() => {
                      setEditingChapterId(null);
                      window.location.reload();
                    }}
                    onCancel={() => setEditingChapterId(null)}
                  />
                )}
              </div>
            ))}
          </div>
          {addingChapter ? (
            <AddChapterForm
              bookId={book.id}
              nextOrder={
                chapters.length > 0
                  ? Math.max(...chapters.map((c) => c.order_index)) + 1
                  : 1
              }
              onDone={() => {
                setAddingChapter(false);
                window.location.reload();
              }}
              onCancel={() => setAddingChapter(false)}
            />
          ) : (
            <Button type="button" variant="outline" onClick={() => setAddingChapter(true)}>
              Add chapter
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ChapterEditForm({
                           chapter,
                           bookId,
                           onDone,
                           onCancel,
                         }: {
  chapter: Chapter;
  bookId: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(chapter.content_md ?? "");

  return (
    <form
      action={async (fd) => {
        await updateChapter(chapter.id, {
          title: (fd.get("title") as string).slice(0, CHAPTER_TITLE_MAX),
          content: (fd.get("content") as string) || content,
        });
        onDone();
      }}
      className="flex flex-1 flex-col gap-4"
    >
      <Input
        name="title"
        defaultValue={chapter.title}
        maxLength={CHAPTER_TITLE_MAX}
        placeholder="Chapter title"
      />
      <TinyEditor
        name="content"
        defaultValue={chapter.content_md ?? ""}
        onChangeAction={setContent}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function AddChapterForm({
                          bookId,
                          nextOrder,
                          onDone,
                          onCancel,
                        }: {
  bookId: string;
  nextOrder: number;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState("");

  return (
    <form
      action={async (fd) => {
        await addChapter(bookId, {
          title: (fd.get("title") as string).slice(0, CHAPTER_TITLE_MAX),
          content: (fd.get("content") as string) || content,
          order: nextOrder,
          isPremium: fd.get("isPremium") === "on",
          price: Number(fd.get("price") ?? 10),
        });
        onDone();
      }}
      className="space-y-6 rounded border p-4"
    >
      <div className="space-y-2">
        <Label>Chapter title (max {CHAPTER_TITLE_MAX})</Label>
        <Input name="title" maxLength={CHAPTER_TITLE_MAX} placeholder="Chapter title" required/>
      </div>
      <div className="space-y-2">
        <Label>Content</Label>
        <TinyEditor name="content" onChangeAction={setContent}/>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox id="isPremium" name="isPremium"/>
          <Label htmlFor="isPremium" className="font-normal">
            Premium
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Label>Price</Label>
          <Input
            type="number"
            name="price"
            min={1}
            defaultValue={10}
            className="w-20"
          />
          <span className="text-xs text-zinc-500">credits</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Add chapter
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
