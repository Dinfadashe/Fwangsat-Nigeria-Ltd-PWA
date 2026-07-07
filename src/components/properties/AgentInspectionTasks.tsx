"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatNaira } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import type { Inspection } from "@/lib/types";

export function AgentInspectionTasks({
  inspections,
}: {
  inspections: (Inspection & { properties?: { title: string; location: string } | null })[];
}) {
  const [completing, setCompleting] = useState<string | null>(null);

  if (inspections.length === 0) {
    return <div className="glass-panel py-16 text-center text-white/40">No inspections assigned to you right now.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {inspections.map((i) => (
        <div key={i.id} className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm font-medium text-white">{i.properties?.title ?? "Property"}</p>
            <p className="text-xs text-white/40">{i.properties?.location}</p>
            <p className="text-xs text-white/50 mt-1">
              {i.visitor_name} · {formatDate(i.preferred_date)} · Fee {formatNaira(i.fee_amount)}
            </p>
            <div className="mt-1.5">
              <Badge tone={i.status === "completed" ? "signal" : "water"}>{i.status}</Badge>
            </div>
          </div>
          <a
            href={`tel:${i.visitor_phone}`}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-white/15 text-white/60 hover:text-signal shrink-0"
          >
            <Phone size={13} /> Call {i.visitor_name.split(" ")[0]}
          </a>
          {i.status !== "completed" && (
            <button
              onClick={() => setCompleting(i.id)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-signal text-ink-950 shrink-0"
            >
              <CheckCircle2 size={13} /> Mark completed
            </button>
          )}
        </div>
      ))}

      <CompleteInspectionModal
        inspectionId={completing}
        onClose={() => setCompleting(null)}
      />
    </div>
  );
}

function CompleteInspectionModal({ inspectionId, onClose }: { inspectionId: string | null; onClose: () => void }) {
  const router = useRouter();
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inspectionId) return;
    setSubmitting(true);
    const supabase = createClient();
    await supabase
      .from("inspections")
      .update({ status: "completed", completion_remark: remark, completed_at: new Date().toISOString() })
      .eq("id", inspectionId);
    setSubmitting(false);
    setRemark("");
    onClose();
    router.refresh();
  }

  return (
    <Modal open={!!inspectionId} onClose={onClose} title="Complete inspection">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label-field">Remark</label>
          <textarea
            required
            rows={4}
            className="input-field resize-none"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="e.g. Visitor was impressed, considering the offer."
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <Loader2 className="animate-spin" size={16} /> : "Save & mark completed"}
        </button>
      </form>
    </Modal>
  );
}
