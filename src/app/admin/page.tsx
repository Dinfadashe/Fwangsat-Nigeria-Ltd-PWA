import Link from "next/link";
import {
  Building2,
  ClipboardList,
  CalendarCheck,
  Droplets,
  Wallet,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { formatNaira } from "@/lib/utils";
import { getRealEstateOverview, getWaterOverview, getExpensesTotal, getMonthlySeries } from "@/lib/stats";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const [realEstate, water, reExpenses, waterExpenses, reSeries, waterSeries] = await Promise.all([
    getRealEstateOverview(),
    getWaterOverview(),
    getExpensesTotal("real_estate"),
    getExpensesTotal("water"),
    getMonthlySeries("real_estate"),
    getMonthlySeries("water"),
  ]);

  const supabase = await createClient();
  const { count: pendingListings } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("source", "public_user")
    .eq("public_listing_status", "submitted");
  const { count: newInspections } = await supabase
    .from("inspections")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  const reProfit = realEstate.totalRevenue - reExpenses;
  const waterProfit = water.totalRevenue - waterExpenses;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Live listings" value={String(realEstate.totalApproved)} icon={Building2} sub={`${realEstate.availableCount} available now`} />
        <StatCard label="Pending review" value={String(realEstate.pendingCount)} icon={ClipboardList} tone="gold" sub={`${pendingListings ?? 0} from the public`} />
        <StatCard label="New inspections" value={String(newInspections ?? 0)} icon={CalendarCheck} sub="Awaiting agent assignment" />
        <StatCard label="Low stock alerts" value={String(water.lowStockCount)} icon={AlertTriangle} tone="gold" sub="Swan Water products" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="eyebrow">Real Estate</span>
              <h3 className="font-display text-lg font-semibold text-white mt-1">Revenue vs expenses</h3>
            </div>
            <Link href="/admin/reports" className="text-xs text-white/45 hover:text-white flex items-center gap-1">
              Full report <ArrowUpRight size={12} />
            </Link>
          </div>
          <RevenueChart data={reSeries} accent="#C8FF4D" />
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/[0.06] text-sm">
            <div>
              <p className="text-white/40 text-xs mb-1">Revenue</p>
              <p className="text-white font-mono">{formatNaira(realEstate.totalRevenue)}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Expenses</p>
              <p className="text-danger font-mono">{formatNaira(reExpenses)}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Profit</p>
              <p className={`font-mono ${reProfit >= 0 ? "text-signal" : "text-danger"}`}>{formatNaira(reProfit)}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="eyebrow !text-water-light">Swan Water</span>
              <h3 className="font-display text-lg font-semibold text-white mt-1">Revenue vs expenses</h3>
            </div>
            <Link href="/admin/reports" className="text-xs text-white/45 hover:text-white flex items-center gap-1">
              Full report <ArrowUpRight size={12} />
            </Link>
          </div>
          <RevenueChart data={waterSeries} accent="#33C7D9" />
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/[0.06] text-sm">
            <div>
              <p className="text-white/40 text-xs mb-1">Revenue</p>
              <p className="text-white font-mono">{formatNaira(water.totalRevenue)}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Expenses</p>
              <p className="text-danger font-mono">{formatNaira(waterExpenses)}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Profit</p>
              <p className={`font-mono ${waterProfit >= 0 ? "text-water-light" : "text-danger"}`}>{formatNaira(waterProfit)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <StatCard label="Properties sold" value={String(realEstate.soldCount)} icon={TrendingUp} sub={formatNaira(realEstate.soldRevenue)} />
        <StatCard label="Properties rented" value={String(realEstate.rentedCount)} icon={Building2} tone="gold" sub={formatNaira(realEstate.rentRevenue)} />
        <StatCard label="Water stock value" value={formatNaira(water.stockValue)} icon={Droplets} tone="water" sub={`${water.products.length} product lines`} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Link href="/admin/properties/new" className="glass-panel p-6 flex items-center gap-4 hover:bg-white/[0.05] transition-colors">
          <span className="grid place-items-center h-11 w-11 rounded-xl bg-signal/10 text-signal"><Building2 size={20} /></span>
          <div>
            <p className="font-display font-medium text-white">Add a property</p>
            <p className="text-xs text-white/40">Goes live instantly on the website</p>
          </div>
        </Link>
        <Link href="/admin/expenses" className="glass-panel p-6 flex items-center gap-4 hover:bg-white/[0.05] transition-colors">
          <span className="grid place-items-center h-11 w-11 rounded-xl bg-gold/10 text-gold"><Wallet size={20} /></span>
          <div>
            <p className="font-display font-medium text-white">Log an expense</p>
            <p className="text-xs text-white/40">Keeps profit &amp; loss accurate</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
