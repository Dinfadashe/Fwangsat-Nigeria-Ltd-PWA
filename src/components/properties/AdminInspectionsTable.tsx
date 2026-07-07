"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatNaira } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Inspection, Profile } from "@/lib/types";

const STATUS_TONE = {
  new: "gold",
  assigned: "water",
  completed: "signal",
  cancelled: "danger",
} as const;

export function AdminInspectionsTable({
  inspections,
  agents,
}: {
  inspections: (Inspection & { properties?: { title: string } | null })[];
  agents: Profile[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function assignAgent(inspectionId: string, agentId: string) {
    setBusyId(inspectionId);
    const supabase = createClient();
    await supabase
      .from("inspections")
      .update({ assigned_agent_id: agentId, status: "assigned" })
      .eq("id", inspectionId);

    await supabase.from("tasks").insert({
      kind: "inspection",
      reference_id: inspectionId,
      assigned_to: agentId,
      title: "Conduct property inspection",
    });

    setBusyId(null);
    router.refresh();
  }

  if (inspections.length === 0) {
    return <div className="glass-panel py-16 text-center text-white/40">No inspection requests yet.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {inspections.map((i) => (
        <div key={i.id} className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm font-medium text-white truncate">
              {i.properties?.title ?? "Property"}
            </p>
            <p className="text-xs text-white/40">
              {i.visitor_name} · {formatDate(i.preferred_date)} · Fee {formatNaira(i.fee_amount)}
            </p>
            <div className="mt-1.5">
              <Badge tone={STATUS_TONE[i.status]}>{i.status}</Badge>
            </div>
            {i.completion_remark && (
              <p className="text-xs text-white/45 italic mt-1.5">“{i.completion_remark}”</p>
            )}
          </div>

          <a
            href={`tel:${i.visitor_phone}`}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-white/15 text-white/60 hover:text-signal shrink-0"
          >
            <Phone size={13} /> {i.visitor_phone}
          </a>

          {(i.status === "new" || i.status === "assigned") && (
            <select
              disabled={busyId === i.id}
              defaultValue={i.assigned_agent_id ?? ""}
              onChange={(e) => e.target.value && assignAgent(i.id, e.target.value)}
              className="input-field !py-2 !w-auto text-xs shrink-0"
            >
              <option value="" disabled>
                Assign agent…
              </option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  );
}
