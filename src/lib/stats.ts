import { createClient } from "@/lib/supabase/server";
import type { MonthlyPoint } from "@/components/charts/RevenueChart";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

/** Builds the last `count` months as empty buckets, most recent last. */
function buildMonthBuckets(count: number) {
  const now = new Date();
  const buckets: { key: string; label: string }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: monthKey(d), label: MONTH_LABELS[d.getMonth()] });
  }
  return buckets;
}

export async function getRealEstateOverview() {
  const supabase = await createClient();

  const [{ count: totalApproved }, { count: pendingCount }, { count: rentedCount }, { count: soldCount }, { count: availableCount }, { data: soldProps }, { data: rentedProps }] =
    await Promise.all([
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("availability", "rented"),
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("availability", "sold"),
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("availability", "available").eq("status", "approved"),
      supabase.from("properties").select("price, sold_at").eq("availability", "sold"),
      supabase.from("properties").select("price, rent_started_at").eq("availability", "rented"),
    ]);

  const soldRevenue = (soldProps ?? []).reduce((sum, p) => sum + Number(p.price ?? 0), 0);
  const rentRevenue = (rentedProps ?? []).reduce((sum, p) => sum + Number(p.price ?? 0), 0);

  return {
    totalApproved: totalApproved ?? 0,
    pendingCount: pendingCount ?? 0,
    rentedCount: rentedCount ?? 0,
    soldCount: soldCount ?? 0,
    availableCount: availableCount ?? 0,
    soldRevenue,
    rentRevenue,
    totalRevenue: soldRevenue + rentRevenue,
    soldProps: soldProps ?? [],
    rentedProps: rentedProps ?? [],
  };
}

export async function getWaterOverview() {
  const supabase = await createClient();

  const [{ data: products }, { data: paidInvoices }, { count: lowStockCount }] = await Promise.all([
    supabase.from("water_products").select("*"),
    supabase.from("water_invoices").select("total, paid_at").eq("status", "paid"),
    supabase.from("v_low_stock").select("*", { count: "exact", head: true }),
  ]);

  const stockValue = (products ?? []).reduce((sum, p) => sum + Number(p.unit_price) * p.quantity_on_hand, 0);
  const totalRevenue = (paidInvoices ?? []).reduce((sum, i) => sum + Number(i.total ?? 0), 0);

  return {
    products: products ?? [],
    stockValue,
    totalRevenue,
    lowStockCount: lowStockCount ?? 0,
    paidInvoices: paidInvoices ?? [],
  };
}

export async function getExpensesTotal(business: "real_estate" | "water") {
  const supabase = await createClient();
  const { data } = await supabase.from("expenses").select("amount").eq("business", business);
  return (data ?? []).reduce((sum, e) => sum + Number(e.amount ?? 0), 0);
}

export async function getMonthlySeries(
  business: "real_estate" | "water",
  months = 6
): Promise<MonthlyPoint[]> {
  const supabase = await createClient();
  const buckets = buildMonthBuckets(months);
  const map = new Map(buckets.map((b) => [b.key, { revenue: 0, expenses: 0 }]));

  if (business === "water") {
    const { data: invoices } = await supabase
      .from("water_invoices")
      .select("total, paid_at")
      .eq("status", "paid");
    (invoices ?? []).forEach((inv) => {
      if (!inv.paid_at) return;
      const key = monthKey(new Date(inv.paid_at));
      const bucket = map.get(key);
      if (bucket) bucket.revenue += Number(inv.total ?? 0);
    });
  } else {
    const { data: sold } = await supabase.from("properties").select("price, sold_at").eq("availability", "sold");
    const { data: rented } = await supabase
      .from("properties")
      .select("price, rent_started_at")
      .eq("availability", "rented");
    (sold ?? []).forEach((p) => {
      if (!p.sold_at) return;
      const bucket = map.get(monthKey(new Date(p.sold_at)));
      if (bucket) bucket.revenue += Number(p.price ?? 0);
    });
    (rented ?? []).forEach((p) => {
      if (!p.rent_started_at) return;
      const bucket = map.get(monthKey(new Date(p.rent_started_at)));
      if (bucket) bucket.revenue += Number(p.price ?? 0);
    });
  }

  const { data: expenses } = await supabase.from("expenses").select("amount, incurred_on").eq("business", business);
  (expenses ?? []).forEach((e) => {
    const bucket = map.get(monthKey(new Date(e.incurred_on)));
    if (bucket) bucket.expenses += Number(e.amount ?? 0);
  });

  return buckets.map((b) => ({ month: b.label, ...map.get(b.key)! }));
}
