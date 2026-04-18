import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isModerator } from "@/lib/moderation";
import { ModBookList } from "./ModBookList";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default async function ModDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const mod = await isModerator(userId);
  if (!mod) redirect("/");

  const { data: pending } = await supabase
    .from("books")
    .select("id, title, author_name, created_at")
    .eq("approval_status", "pending")
    .order("created_at", { ascending: false });

  const { data: approved } = await supabase
    .from("books")
    .select("id, title, author_name, created_at")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: rejected } = await supabase
    .from("books")
    .select("id, title, author_name, created_at")
    .eq("approval_status", "rejected")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Moderation dashboard</h1>
      <Tabs defaultValue="pending">
        <TabsList className={"flex gap-1 w-fit"}>
          <TabsTrigger value="pending" className={"hover:bg-orange-200 hover:text-amber-700"}>Pending approval ({pending?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="approved" className={"hover:bg-orange-200 hover:text-orange-500"}>Approved ({approved?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="rejected" className={"hover:bg-orange-200 hover:text-orange-500"}>Rejected ({rejected?.length ?? 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <ModBookList books={pending ?? []} status="pending" />
        </TabsContent>
        <TabsContent value="approved">
          <ModBookList books={approved ?? []} status="approved" />
        </TabsContent>
        <TabsContent value="rejected">
          <ModBookList books={rejected ?? []} status="rejected" />
        </TabsContent>

      </Tabs>

    </div>
  );
}
