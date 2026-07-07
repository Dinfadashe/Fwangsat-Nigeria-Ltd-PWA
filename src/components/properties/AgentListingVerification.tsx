"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Phone, Pencil, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Property, PropertyMedia } from "@/lib/types";

type Row = Property & { property_media?: PropertyMedia[] };

export function AgentListingVerification({ listings }: { listings: Row[] }) {
  const router = useRouter();
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  async function submitVerification(propertyId: string, outcome: "verified" | "rejected") {
    setBusyId(propertyId);
    const supabase = createClient();
    await supabase
      .from("properties")
      .update({
        public_listing_status: outcome,
        verification_remark: remarks[propertyId] ?? "",
      })
      .eq("id", propertyId);
    setBusyId(null);
    router.refresh();
  }

  if (listings.length === 0) {
    return <div className="glass-panel py-16 text-center text-white/40">No listings await your verification.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {listings.map((p) => {
        const cover = p.property_media?.find((m) => m.kind === "image")?.url;
        const busy = busyId === p.id;

        return (
          <div key={p.id} className="glass-panel p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative h-24 w-32 rounded-lg overflow-hidden bg-ink-800 shrink-0">
                {cover && <Image src={cover} alt="" fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-medium text-white">{p.title}</p>
                <p className="text-xs text-white/40">{p.location} · {formatNaira(p.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge tone="water">Awaiting your verification</Badge>
                  <span className="text-xs text-white/40">{p.property_media?.length ?? 0} media files</span>
                </div>
                <a href={`tel:${p.submitter_phone}`} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-signal mt-2">
                  <Phone size={12} /> {p.submitter_name} · {p.submitter_phone}
                </a>
              </div>
              <Link
                href={`/agent/properties/${p.id}`}
                className="flex items-center gap-1.5 text-xs px-3 py-2 h-fit rounded-full border border-white/15 text-white/60 hover:text-white"
              >
                <Pencil size={13} /> Edit content
              </Link>
            </div>

            <textarea
              rows={2}
              className="input-field resize-none text-sm"
              placeholder="Verification remark (what you found on-site)…"
              value={remarks[p.id] ?? ""}
              onChange={(e) => setRemarks((prev) => ({ ...prev, [p.id]: e.target.value }))}
            />

            <div className="flex items-center gap-2 self-end">
              <button
                disabled={busy}
                onClick={() => submitVerification(p.id, "rejected")}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border border-danger/40 text-danger"
              >
                {busy ? <Loader2 className="animate-spin" size={13} /> : <XCircle size={13} />} Does not qualify
              </button>
              <button
                disabled={busy}
                onClick={() => submitVerification(p.id, "verified")}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-signal text-ink-950"
              >
                {busy ? <Loader2 className="animate-spin" size={13} /> : <CheckCircle2 size={13} />} Mark verified
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
