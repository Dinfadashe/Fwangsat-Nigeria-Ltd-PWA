import { AdminListingsTable } from "@/components/properties/AdminListingsTable";
import { createClient } from "@/lib/supabase/server";
import type { Property, Profile } from "@/lib/types";

export default async function AdminListingsPage() {
  const supabase = await createClient();
  const [{ data: listings }, { data: agents }] = await Promise.all([
    supabase
      .from("properties")
      .select("*, property_media(*)")
      .eq("source", "public_user")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("role", "agent").eq("is_active", true),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">Community submissions</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Public listings</h2>
        <p className="text-sm text-white/40 mt-1">
          Assign an agent to verify, then approve or reject before it appears on the website.
        </p>
      </div>
      <AdminListingsTable listings={(listings as Property[]) ?? []} agents={(agents as Profile[]) ?? []} />
    </div>
  );
}
