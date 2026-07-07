"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Meeting } from "@/lib/types";

const STATUS_TONE = { new: "gold", contacted: "water", closed: "signal" } as const;

export function AdminMeetingsTable({ meetings }: { meetings: Meeting[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: Meeting["status"]) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from("meetings").update({ status }).eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  if (meetings.length === 0) {
    return <div className="glass-panel py-16 text-center text-white/40">No meeting requests yet.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {meetings.map((m) => (
        <div key={m.id} className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm font-medium text-white">{m.full_name}</p>
            <p className="text-xs text-white/40">
              {formatDate(m.preferred_date)} {m.preferred_time ? `· ${m.preferred_time}` : ""}
            </p>
            {m.topic && <p className="text-xs text-white/45 mt-1 italic">“{m.topic}”</p>}
            <div className="mt-1.5">
              <Badge tone={STATUS_TONE[m.status]}>{m.status}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a href={`tel:${m.phone}`} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-white/15 text-white/60 hover:text-signal">
              <Phone size={13} /> {m.phone}
            </a>
            {m.email && (
              <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-white/15 text-white/60 hover:text-signal">
                <Mail size={13} />
              </a>
            )}
          </div>

          <select
            disabled={busyId === m.id}
            value={m.status}
            onChange={(e) => setStatus(m.id, e.target.value as Meeting["status"])}
            className="input-field !py-2 !w-auto text-xs shrink-0"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      ))}
    </div>
  );
}
