import { CalendarCheck, ListChecks, Building2 } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export default async function AgentOverviewPage() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();

  const [{ count: assignedInspections }, { count: listingsToVerify }, { count: myListings }] = await Promise.all([
    supabase
      .from("inspections")
      .select("*", { count: "exact", head: true })
      .eq("assigned_agent_id", profile?.id)
      .eq("status", "assigned"),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("verification_agent_id", profile?.id)
      .in("public_listing_status", ["assigned_for_verification", "needs_edit"]),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("created_by", profile?.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-white">Welcome back, {profile?.full_name?.split(" ")[0]}</h2>
        <p className="text-sm text-white/40 mt-1">Here&apos;s what needs your attention today.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        <StatCard label="Inspections to run" value={String(assignedInspections ?? 0)} icon={CalendarCheck} />
        <StatCard label="Listings to verify" value={String(listingsToVerify ?? 0)} icon={ListChecks} tone="gold" />
        <StatCard label="Properties you've listed" value={String(myListings ?? 0)} icon={Building2} tone="water" />
      </div>
    </div>
  );
}
