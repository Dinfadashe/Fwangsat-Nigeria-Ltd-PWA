import { Download } from "lucide-react";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { formatNaira } from "@/lib/utils";
import { getRealEstateOverview, getWaterOverview, getExpensesTotal, getMonthlySeries } from "@/lib/stats";

export default async function AdminReportsPage() {
  const [realEstate, water, reExpenses, waterExpenses, reSeries, waterSeries] = await Promise.all([
    getRealEstateOverview(),
    getWaterOverview(),
    getExpensesTotal("real_estate"),
    getExpensesTotal("water"),
    getMonthlySeries("real_estate", 12),
    getMonthlySeries("water", 12),
  ]);

  const businesses = [
    {
      key: "real_estate",
      label: "Real Estate",
      accent: "#C8FF4D",
      revenue: realEstate.totalRevenue,
      expenses: reExpenses,
      series: reSeries,
    },
    {
      key: "water",
      label: "Swan Water",
      accent: "#33C7D9",
      revenue: water.totalRevenue,
      expenses: waterExpenses,
      series: waterSeries,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="eyebrow">Finance</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Reports &amp; statistics</h2>
        <p className="text-sm text-white/40 mt-1">Download monthly or annual figures for either business.</p>
      </div>

      {businesses.map((b) => {
        const profit = b.revenue - b.expenses;
        return (
          <div key={b.key} className="glass-panel p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="font-display text-lg font-semibold text-white">{b.label}</h3>
              <div className="flex items-center gap-2">
                <a
                  href={`/api/reports?business=${b.key}&period=monthly`}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-white/15 text-white/60 hover:text-white"
                >
                  <Download size={13} /> Monthly CSV
                </a>
                <a
                  href={`/api/reports?business=${b.key}&period=annual`}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-signal text-ink-950 font-medium"
                >
                  <Download size={13} /> Annual CSV
                </a>
              </div>
            </div>

            <RevenueChart data={b.series} accent={b.accent} />

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] text-sm">
              <div>
                <p className="text-white/40 text-xs mb-1">Total revenue</p>
                <p className="text-white font-mono">{formatNaira(b.revenue)}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1">Total expenses</p>
                <p className="text-danger font-mono">{formatNaira(b.expenses)}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1">Net profit / loss</p>
                <p className={`font-mono ${profit >= 0 ? "text-signal" : "text-danger"}`}>{formatNaira(profit)}</p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="glass-panel p-6">
        <h3 className="font-display text-lg font-semibold text-white mb-4">Swan Water stock value</h3>
        <p className="text-3xl font-display font-semibold text-water-light">{formatNaira(water.stockValue)}</p>
        <p className="text-xs text-white/40 mt-2">{water.products.length} product lines currently in inventory</p>
      </div>
    </div>
  );
}
