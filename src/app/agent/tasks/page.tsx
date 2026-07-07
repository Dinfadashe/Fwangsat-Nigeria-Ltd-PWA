import { AgentInspectionTasks } from "@/components/properties/AgentInspectionTasks";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import type { Inspection } from "@/lib/types";

export default async function AgentTasksPage() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("inspections")
    .select("*, properties(title, location)")
    .eq("assigned_agent_id", profile?.id)
    .order("preferred_date", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">Assigned to you</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Inspection tasks</h2>
      </div>
      <AgentInspectionTasks
        inspections={(data as (Inspection & { properties?: { title: string; location: string } | null })[]) ?? []}
      />
    </div>
  );
}
