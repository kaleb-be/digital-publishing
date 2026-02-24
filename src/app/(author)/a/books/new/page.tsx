import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {createBook} from "./actions";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {BOOK_DESC_MAX, BOOK_TITLE_MAX, CHAPTER_PREFIX_OPTIONS, GENRES,} from "@/lib/constants";
import {CoverSelector} from "./CoverSelector";
import Link from "next/link";

export default async function NewBookPage() {
  const {userId} = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Create a new book</h1>
      <Card>
        <CardHeader>
          <CardTitle>Book details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createBook} className="space-y-6">
            <CoverSelector/>
            <div className="space-y-2">
              <Label htmlFor="title">Title (max {BOOK_TITLE_MAX})</Label>
              <Input
                id="title"
                name="title"
                required
                maxLength={BOOK_TITLE_MAX}
                placeholder="Enter book title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (max {BOOK_DESC_MAX})</Label>
              <Textarea
                id="description"
                name="description"
                maxLength={BOOK_DESC_MAX}
                className="min-h-[100px]"
                placeholder="Brief description of your book"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <select
                id="genre"
                name="genre"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select genre</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="fantasy, adventure, romance"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chapter_prefix">Chapter title prefix</Label>
              <select
                id="chapter_prefix"
                name="chapter_prefix"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {CHAPTER_PREFIX_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit">Create book</Button>
              <Link href="/a">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
