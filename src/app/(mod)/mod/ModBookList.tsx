"use client";

import {approveBook, rejectBook} from "./actions";
import {Card, CardContent} from "@/components/ui/card";
import {ModBookListItem} from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {cn} from "@/lib/utils";


export function ModBookList({books, status,}: {
  books: ModBookListItem[];
  status: "pending" | "approved" | "rejected";
}) {
  if (books.length === 0) {
    return <p className="text-sm text-zinc-500 text-center">No books here.</p>;
  }
  const btnClass = "h-8 px-3 text-xs font-semibold inline-flex items-center justify-center whitespace-nowrap" +
    " rounded-full" +
    " transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background hover:cursor-pointer"
  return (
    <div className="space-y-2">
      {books.map((book) => (
        <Card key={book.id}>
          <CardContent className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium ">
                {book.title}
              </p>
              {book.author_name && (
                <p className="text-xs text-zinc-500">by {book.author_name}</p>
              )}
            </div>
            {status === "pending" && (
              <div className="flex gap-2">

                <form action={rejectBook.bind(null, book.id)}>
                  <AlertDialog>
                    <AlertDialogTrigger type={"submit"} className={cn(btnClass, "bg-red-700 hover:bg-red-900 " +
                      " hover:text-red-100 text-white ")}>

                      Reject
                    </AlertDialogTrigger>

                    <AlertDialogPortal>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            By rejecting this book, you are confirming that it DOES NOT meet one or more of the
                            requirements for approval.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className={'w-full'}>Cancel</AlertDialogCancel>
                          <AlertDialogAction className={"w-full"}>Confirm</AlertDialogAction>
                          {/*</form>*/}
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogPortal>
                  </AlertDialog>

                </form>


                <form action={approveBook.bind(null, book.id)}>

                  <AlertDialog>
                    <AlertDialogTrigger type="submit" className={cn(btnClass, "bg-emerald-600 hover:bg-emerald-700 " +
                      " hover:text-emerald-100 text-white")}>
                      Approve
                    </AlertDialogTrigger>

                    <AlertDialogPortal>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            By approving this book, you are confirming that it meets all the requirements for approval.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className={'w-full'}>Cancel</AlertDialogCancel>
                          <AlertDialogAction className={"w-full"}>Confirm</AlertDialogAction>
                          {/*</form>*/}
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogPortal>
                  </AlertDialog>

                </form>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
