import { AdminMeetingsTable } from "@/components/forms/AdminMeetingsTable";
import { createClient } from "@/lib/supabase/server";
import type { Meeting } from "@/lib/types";

export default async function AdminMeetingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("meetings").select("*").order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">Enquiries</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Meeting bookings</h2>
      </div>
      <AdminMeetingsTable meetings={(data as Meeting[]) ?? []} />
    </div>
  );
}
