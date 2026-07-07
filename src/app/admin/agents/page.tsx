import { AddStaffForm } from "@/components/forms/AddStaffForm";
import { StaffList } from "@/components/forms/StaffList";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export default async function AdminAgentsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="eyebrow">Team</span>
          <h2 className="font-display text-xl font-semibold text-white mt-1">Staff accounts</h2>
          <p className="text-sm text-white/40 mt-1">Create logins for agents and sales representatives.</p>
        </div>
        <AddStaffForm />
      </div>
      <StaffList staff={(data as Profile[]) ?? []} />
    </div>
  );
}
