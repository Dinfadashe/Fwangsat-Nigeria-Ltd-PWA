"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Phone, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Property, PropertyMedia, Profile } from "@/lib/types";

type Row = Property & { property_media?: PropertyMedia[] };

const STATUS_TONE: Record<string, "gold" | "water" | "signal" | "danger" | "neutral"> = {
  submitted: "gold",
  assigned_for_verification: "water",
  needs_edit: "gold",
  verified: "signal",
  rejected: "danger",
};

export function AdminListingsTable({ listings, agents }: { listings: Row[]; agents: Profile[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function assignAgent(propertyId: string, agentId: string) {
    setBusyId(propertyId);
    const supabase = createClient();
    await supabase
      .from("properties")
      .update({ verification_agent_id: agentId, public_listing_status: "assigned_for_verification" })
      .eq("id", propertyId);

    await supabase.from("tasks").insert({
      kind: "listing_verification",
      reference_id: propertyId,
      assigned_to: agentId,
      title: "Verify submitted property listing",
    });

    setBusyId(null);
    router.refresh();
  }

  async function decide(propertyId: string, approve: boolean) {
    setBusyId(propertyId);
    const supabase = createClient();
    await supabase
      .from("properties")
      .update({
        status: approve ? "approved" : "rejected",
        public_listing_status: approve ? "verified" : "rejected",
      })
      .eq("id", propertyId);
    setBusyId(null);
    router.refresh();
  }

  if (listings.length === 0) {
    return <div className="glass-panel py-16 text-center text-white/40">No public submissions right now.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {listings.map((p) => {
        const cover = p.property_media?.find((m) => m.kind === "image")?.url;
        const busy = busyId === p.id;

        return (
          <div key={p.id} className="glass-panel p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-ink-800 shrink-0">
                {cover && <Image src={cover} alt="" fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-medium text-white truncate">{p.title}</p>
                <p className="text-xs text-white/40 truncate">{p.location} · {formatNaira(p.price)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge tone={STATUS_TONE[p.public_listing_status ?? "submitted"]}>
                    {(p.public_listing_status ?? "submitted").replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col text-xs text-white/50 gap-0.5">
                <span className="text-white/70">{p.submitter_name}</span>
                <a href={`tel:${p.submitter_phone}`} className="flex items-center gap-1.5 hover:text-signal">
                  <Phone size={12} /> {p.submitter_phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-between border-t border-white/[0.06] pt-3">
              <div className="flex items-center gap-2">
                {(p.public_listing_status === "submitted" || p.public_listing_status === "needs_edit") && (
                  <select
                    disabled={busy}
                    onChange={(e) => e.target.value && assignAgent(p.id, e.target.value)}
                    defaultValue=""
                    className="input-field !py-2 !w-auto text-xs"
                  >
                    <option value="" disabled>
                      Assign agent to verify…
                    </option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.full_name}
                      </option>
                    ))}
                  </select>
                )}
                {p.verification_remark && (
                  <p className="text-xs text-white/50 italic max-w-md">“{p.verification_remark}”</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/admin/properties/${p.id}`} className="text-xs px-3 py-2 rounded-full border border-white/15 text-white/60 hover:text-white">
                  Edit listing
                </Link>
                <button
                  disabled={busy}
                  onClick={() => decide(p.id, true)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-signal text-ink-950"
                >
                  <Check size={13} /> Approve
                </button>
                <button
                  disabled={busy}
                  onClick={() => decide(p.id, false)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border border-danger/40 text-danger"
                >
                  <X size={13} /> Reject
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
