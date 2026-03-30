import {Card, CardContent} from "@/components/ui/card";
import Link from "next/link";

const BookCard = ({id, title, description, cover_url, approval_status}: {id: string; title: string; description: string; cover_url: string; approval_status: string}) => {
  return (
    <Card key={id} className="overflow-hidden">
      <Link href={`/a/books/${id}`}>
        <div className="aspect-3/4 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 ">
          {cover_url ? (
            <img
              src={cover_url}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-zinc-400">
              📖
            </div>
          )}
        </div>
        <CardContent className="space-y-1 p-3">
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="line-clamp-2 text-xs text-zinc-500">
              {description}
            </p>
          )}
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
              approval_status === "approved"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40"
                : approval_status === "rejected"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/40"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/40"
            }`}
          >
                      {approval_status}
                    </span>
        </CardContent>

      </Link>
    </Card>
  )
}
export default BookCard
