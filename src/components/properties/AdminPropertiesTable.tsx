"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, X, KeyRound, Tags, Pencil, RotateCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatNaira, formatDate } from "@/lib/utils";
import { CountdownRing } from "@/components/ui/CountdownRing";
import { Badge } from "@/components/ui/Badge";
import { MarkRentedModal } from "@/components/properties/MarkRentedModal";
import type { Property, PropertyMedia } from "@/lib/types";

type Row = Property & { property_media?: PropertyMedia[] };

export function AdminPropertiesTable({ properties }: { properties: Row[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rentModalFor, setRentModalFor] = useState<string | null>(null);

  async function updateProperty(id: string, patch: Record<string, unknown>) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from("properties").update(patch).eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {properties.map((p) => {
        const cover = p.property_media?.find((m) => m.kind === "image")?.url;
        const busy = busyId === p.id;

        return (
          <div key={p.id} className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative h-16 w-20 rounded-lg overflow-hidden bg-ink-800 shrink-0">
                {cover && <Image src={cover} alt="" fill className="object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm font-medium text-white truncate">{p.title}</p>
                <p className="text-xs text-white/40 truncate">{p.location}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge tone={p.purpose === "rent" ? "water" : "signal"}>{p.purpose}</Badge>
                  <Badge tone={p.status === "pending" ? "gold" : p.status === "rejected" ? "danger" : "neutral"}>
                    {p.status}
                  </Badge>
                  {p.status === "approved" && (
                    <Badge tone={p.availability === "sold" ? "danger" : p.availability === "rented" ? "gold" : "signal"}>
                      {p.availability}
                    </Badge>
                  )}
                  <span className="text-xs text-white/35 font-mono">{formatNaira(p.price)}</span>
                </div>
              </div>
            </div>

            {p.availability === "rented" && p.rent_started_at && p.rent_ends_at && (
              <CountdownRing startedAt={p.rent_started_at} endsAt={p.rent_ends_at} size={64} />
            )}

            <div className="flex items-center gap-2 flex-wrap justify-end">
              {p.status === "pending" && (
                <>
                  <button
                    disabled={busy}
                    onClick={() => updateProperty(p.id, { status: "approved" })}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-signal text-ink-950"
                  >
                    <Check size={13} /> Approve
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => updateProperty(p.id, { status: "rejected" })}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border border-danger/40 text-danger"
                  >
                    <X size={13} /> Reject
                  </button>
                </>
              )}

              {p.status === "approved" && p.availability === "available" && (
                <>
                  <button
                    disabled={busy}
                    onClick={() => setRentModalFor(p.id)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border border-gold/40 text-gold"
                  >
                    <KeyRound size={13} /> Mark rented
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => updateProperty(p.id, { availability: "sold" })}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border border-danger/40 text-danger"
                  >
                    <Tags size={13} /> Mark sold
                  </button>
                </>
              )}

              {p.status === "approved" && p.availability === "rented" && (
                <button
                  disabled={busy}
                  onClick={() => updateProperty(p.id, { availability: "available" })}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border border-signal/40 text-signal"
                >
                  <RotateCcw size={13} /> Mark vacant
                </button>
              )}

              {p.status === "approved" && p.availability === "sold" && (
                <button
                  disabled={busy}
                  onClick={() => updateProperty(p.id, { availability: "available", sold_at: null })}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border border-white/20 text-white/60"
                >
                  <RotateCcw size={13} /> Revert
                </button>
              )}

              <Link
                href={`/admin/properties/${p.id}`}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border border-white/15 text-white/60 hover:text-white"
              >
                <Pencil size={13} /> Edit
              </Link>
            </div>

            <MarkRentedModal
              open={rentModalFor === p.id}
              onClose={() => setRentModalFor(null)}
              onConfirm={async (months) => {
                await updateProperty(p.id, {
                  availability: "rented",
                  rent_months: months,
                  rent_started_at: new Date().toISOString(),
                });
                setRentModalFor(null);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
