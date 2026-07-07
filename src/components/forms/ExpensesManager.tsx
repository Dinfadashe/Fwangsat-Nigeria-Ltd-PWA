"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatNaira } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import type { BusinessUnit, Expense } from "@/lib/types";

export function ExpensesManager({ expenses }: { expenses: Expense[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<BusinessUnit | "all">("all");

  async function remove(id: string) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from("expenses").delete().eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  const filtered = filter === "all" ? expenses : expenses.filter((e) => e.business === filter);
  const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          {(["all", "real_estate", "water"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                filter === f ? "bg-signal text-ink-950 border-signal" : "border-white/15 text-white/60"
              }`}
            >
              {f === "all" ? "All" : f === "real_estate" ? "Real Estate" : "Swan Water"}
            </button>
          ))}
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary !py-2.5 !px-5 text-sm">
          <Plus size={16} /> Log expense
        </button>
      </div>

      <div className="glass-panel p-5 flex items-center justify-between">
        <span className="text-sm text-white/50">Total for selection</span>
        <span className="font-mono text-lg text-danger">{formatNaira(total)}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel py-16 text-center text-white/40">No expenses recorded yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((e) => (
            <div key={e.id} className="glass-panel p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{e.title}</p>
                <p className="text-xs text-white/40">{formatDate(e.incurred_on)} {e.note ? `· ${e.note}` : ""}</p>
              </div>
              <Badge tone={e.business === "water" ? "water" : "signal"}>
                {e.business === "water" ? "Swan Water" : "Real Estate"}
              </Badge>
              <span className="font-mono text-sm text-danger">{formatNaira(e.amount)}</span>
              <button
                disabled={busyId === e.id}
                onClick={() => remove(e.id)}
                className="text-white/30 hover:text-danger"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ExpenseModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function ExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [business, setBusiness] = useState<BusinessUnit>("real_estate");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("expenses").insert({
      business,
      title,
      amount: Number(amount),
      note: note || null,
      incurred_on: date,
      created_by: user?.id ?? null,
    });
    setSubmitting(false);
    setTitle("");
    setAmount("");
    setNote("");
    onClose();
    router.refresh();
  }

  return (
    <Modal open={open} onClose={onClose} title="Log an expense">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label-field">Business</label>
          <div className="flex gap-2">
            {(["real_estate", "water"] as const).map((b) => (
              <button
                type="button"
                key={b}
                onClick={() => setBusiness(b)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-colors ${
                  business === b ? "bg-signal text-ink-950 border-signal" : "border-white/15 text-white/60"
                }`}
              >
                {b === "real_estate" ? "Real Estate" : "Swan Water"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label-field">Title</label>
          <input required className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Fuel for site visit" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Amount (₦)</label>
            <input required type="number" className="input-field" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Date</label>
            <input required type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label-field">Note (optional)</label>
          <input className="input-field" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <Loader2 className="animate-spin" size={16} /> : "Save expense"}
        </button>
      </form>
    </Modal>
  );
}
