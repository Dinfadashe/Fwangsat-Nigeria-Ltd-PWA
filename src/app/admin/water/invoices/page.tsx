import { InvoiceTable } from "@/components/water/InvoiceTable";
import { createClient } from "@/lib/supabase/server";
import type { WaterInvoice } from "@/lib/types";

export default async function AdminWaterInvoicesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("water_invoices")
    .select("*, water_invoice_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow !text-water-light">Swan Water</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">All invoices</h2>
      </div>
      <InvoiceTable invoices={(data as WaterInvoice[]) ?? []} canManage={false} />
    </div>
  );
}
