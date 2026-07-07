import { AdminInspectionsTable } from "@/components/properties/AdminInspectionsTable";
import { createClient } from "@/lib/supabase/server";
import type { Inspection, Profile } from "@/lib/types";

export default async function AdminInspectionsPage() {
  const supabase = await createClient();
  const [{ data: inspections }, { data: agents }] = await Promise.all([
    supabase
      .from("inspections")
      .select("*, properties(title)")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("role", "agent").eq("is_active", true),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">Real estate</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Inspection requests</h2>
        <p className="text-sm text-white/40 mt-1">Assign each request to an agent — it appears under their Tasks.</p>
      </div>
      <AdminInspectionsTable
        inspections={(inspections as (Inspection & { properties?: { title: string } | null })[]) ?? []}
        agents={(agents as Profile[]) ?? []}
      />
    </div>
  );
}
