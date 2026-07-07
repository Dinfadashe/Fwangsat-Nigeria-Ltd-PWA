"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, CheckCircle2, Loader2, Receipt as ReceiptIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { downloadNodeAsPng } from "@/lib/png-export";
import { formatDate, formatNaira } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { InvoiceTemplate } from "@/components/water/InvoiceTemplate";
import type { WaterInvoice } from "@/lib/types";

export function InvoiceTable({ invoices, canManage }: { invoices: WaterInvoice[]; canManage: boolean }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<WaterInvoice | null>(null);

  async function markPaid(invoiceId: string) {
    setBusyId(invoiceId);
    const supabase = createClient();
    await supabase.rpc("fn_mark_invoice_paid", { p_invoice_id: invoiceId });
    setBusyId(null);
    router.refresh();
  }

  if (invoices.length === 0) {
    return <div className="glass-panel py-16 text-center text-white/40">No invoices yet.</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {invoices.map((inv) => (
          <div key={inv.id} className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-medium text-white">{inv.invoice_no}</p>
              <p className="text-xs text-white/40">{inv.customer_name} · {formatDate(inv.created_at)}</p>
            </div>
            <span className="font-mono text-sm text-white">{formatNaira(inv.total)}</span>
            <Badge tone={inv.status === "paid" ? "signal" : "gold"}>{inv.status}</Badge>

            <div className="flex items-center gap-2 shrink-0">
              {canManage && inv.status === "unpaid" && (
                <button
                  disabled={busyId === inv.id}
                  onClick={() => markPaid(inv.id)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-signal text-ink-950"
                >
                  {busyId === inv.id ? <Loader2 className="animate-spin" size={13} /> : <CheckCircle2 size={13} />}
                  Mark sold / paid
                </button>
              )}
              <button
                onClick={() => setPreviewing(inv)}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-white/15 text-white/60 hover:text-white"
              >
                <ReceiptIcon size={13} /> View
              </button>
            </div>
          </div>
        ))}
      </div>

      <InvoicePreviewModal invoice={previewing} onClose={() => setPreviewing(null)} />
    </>
  );
}

function InvoicePreviewModal({ invoice, onClose }: { invoice: WaterInvoice | null; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const variant = invoice?.status === "paid" ? "receipt" : "invoice";

  async function handleDownload() {
    if (!ref.current || !invoice) return;
    setDownloading(true);
    await downloadNodeAsPng(ref.current, `${variant === "receipt" ? invoice.receipt_no : invoice.invoice_no}`);
    setDownloading(false);
  }

  return (
    <Modal open={!!invoice} onClose={onClose} title={variant === "receipt" ? "Receipt" : "Invoice"} maxWidth="max-w-2xl">
      {invoice && (
        <div className="flex flex-col gap-5">
          <div className="overflow-x-auto rounded-xl">
            <div ref={ref}>
              <InvoiceTemplate invoice={invoice} variant={variant} />
            </div>
          </div>
          <button onClick={handleDownload} disabled={downloading} className="btn-primary w-full">
            {downloading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
            Download as PNG
          </button>
        </div>
      )}
    </Modal>
  );
}
