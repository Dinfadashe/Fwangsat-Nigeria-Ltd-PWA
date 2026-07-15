"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Printer, CheckCircle2, Loader2, Receipt as ReceiptIcon } from "lucide-react";
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

  async function markPaid(invoice: WaterInvoice) {
    setBusyId(invoice.id);
    const supabase = createClient();
    const { data } = await supabase.rpc("fn_mark_invoice_paid", { p_invoice_id: invoice.id });
    setBusyId(null);

    const updated: WaterInvoice =
      data && Array.isArray(data) && data[0]
        ? { ...invoice, ...data[0] }
        : { ...invoice, status: "paid", paid_at: new Date().toISOString() };

    setPreviewing(updated);
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
                  onClick={() => markPaid(inv)}
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
  const exportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const variant = invoice?.status === "paid" ? "receipt" : "invoice";

  async function handleDownload() {
    if (!exportRef.current || !invoice) return;
    setDownloading(true);
    await downloadNodeAsPng(exportRef.current, `${variant === "receipt" ? invoice.receipt_no : invoice.invoice_no}`);
    setDownloading(false);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <Modal open={!!invoice} onClose={onClose} title={variant === "receipt" ? "Receipt" : "Invoice"} maxWidth="max-w-3xl">
      {invoice && (
        <div className="flex flex-col gap-5">
          {/* Visible, on-screen preview — free to scroll on small screens */}
          <div className="overflow-x-auto rounded-xl">
            <div id="printable-invoice">
              <InvoiceTemplate invoice={invoice} variant={variant} />
            </div>
          </div>

          {/* Hidden, full-size copy used ONLY for PNG export — never clipped or scrolled */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: "-9999px",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <div ref={exportRef}>
              <InvoiceTemplate invoice={invoice} variant={variant} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 print:hidden">
            <button onClick={handlePrint} className="btn-secondary w-full">
              <Printer size={16} /> Print
            </button>
            <button onClick={handleDownload} disabled={downloading} className="btn-primary w-full">
              {downloading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
              Download PNG
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}