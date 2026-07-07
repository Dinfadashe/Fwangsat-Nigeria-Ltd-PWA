import { InvoiceBuilder } from "@/components/water/InvoiceBuilder";
import { createClient } from "@/lib/supabase/server";
import type { WaterProduct } from "@/lib/types";

export default async function NewInvoicePage() {
  const supabase = await createClient();
  const { data } = await supabase.from("water_products").select("*").order("name");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow !text-water-light">Swan Water</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Generate invoice</h2>
      </div>
      <InvoiceBuilder products={(data as WaterProduct[]) ?? []} />
    </div>
  );
}
