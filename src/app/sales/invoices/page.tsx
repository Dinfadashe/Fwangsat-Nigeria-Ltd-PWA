import Link from "next/link";
import { Plus } from "lucide-react";
import { InvoiceTable } from "@/components/water/InvoiceTable";
import { createClient } from "@/lib/supabase/server";
import type { WaterInvoice } from "@/lib/types";

export default async function SalesInvoicesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("water_invoices")
    .select("*, water_invoice_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="eyebrow !text-water-light">Swan Water</span>
          <h2 className="font-display text-xl font-semibold text-white mt-1">Invoices</h2>
        </div>
        <Link href="/sales/invoices/new" className="btn-primary !py-2.5 !px-5 text-sm">
          <Plus size={16} /> New invoice
        </Link>
      </div>
      <InvoiceTable invoices={(data as WaterInvoice[]) ?? []} canManage={true} />
    </div>
  );
}
