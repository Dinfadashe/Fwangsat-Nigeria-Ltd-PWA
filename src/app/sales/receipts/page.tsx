import { InvoiceTable } from "@/components/water/InvoiceTable";
import { createClient } from "@/lib/supabase/server";
import type { WaterInvoice } from "@/lib/types";

export default async function SalesReceiptsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("water_invoices")
    .select("*, water_invoice_items(*)")
    .eq("status", "paid")
    .order("paid_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow !text-water-light">Swan Water</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Receipts</h2>
        <p className="text-sm text-white/40 mt-1">Every completed sale, ready to view or download as PNG.</p>
      </div>
      <InvoiceTable invoices={(data as WaterInvoice[]) ?? []} canManage={false} />
    </div>
  );
}
