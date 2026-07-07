import { AgentListingVerification } from "@/components/properties/AgentListingVerification";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import type { Property } from "@/lib/types";

export default async function AgentListingsPage() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*, property_media(*)")
    .eq("verification_agent_id", profile?.id)
    .in("public_listing_status", ["assigned_for_verification", "needs_edit"])
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">Community submissions</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Listings to verify</h2>
        <p className="text-sm text-white/40 mt-1">Visit the property, fix any weak content, then record your findings.</p>
      </div>
      <AgentListingVerification listings={(data as Property[]) ?? []} />
    </div>
  );
}
