import { WaterInventoryManager } from "@/components/water/WaterInventoryManager";
import { createClient } from "@/lib/supabase/server";
import type { WaterProduct } from "@/lib/types";

export default async function SalesInventoryPage() {
  const supabase = await createClient();
  const [{ data: products }, { data: settings }] = await Promise.all([
    supabase.from("water_products").select("*").order("created_at", { ascending: false }),
    supabase.from("app_settings").select("water_low_stock_threshold").single(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow !text-water-light">Swan Water</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Inventory</h2>
      </div>
      <WaterInventoryManager
        products={(products as WaterProduct[]) ?? []}
        globalThreshold={settings?.water_low_stock_threshold ?? 20}
      />
    </div>
  );
}
