import { Boxes, Receipt, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { formatNaira } from "@/lib/utils";
import { getWaterOverview } from "@/lib/stats";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export default async function SalesOverviewPage() {
  const profile = await getCurrentProfile();
  const water = await getWaterOverview();
  const supabase = await createClient();
  const { count: unpaidCount } = await supabase
    .from("water_invoices")
    .select("*", { count: "exact", head: true })
    .eq("status", "unpaid");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-white">Welcome back, {profile?.full_name?.split(" ")[0]}</h2>
        <p className="text-sm text-white/40 mt-1">Swan Water sales &amp; inventory at a glance.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        <StatCard label="Stock value on hand" value={formatNaira(water.stockValue)} icon={Boxes} tone="water" />
        <StatCard label="Revenue (paid invoices)" value={formatNaira(water.totalRevenue)} icon={Receipt} />
        <StatCard label="Low stock products" value={String(water.lowStockCount)} icon={AlertTriangle} tone="gold" sub={`${unpaidCount ?? 0} unpaid invoices`} />
      </div>
    </div>
  );
}
