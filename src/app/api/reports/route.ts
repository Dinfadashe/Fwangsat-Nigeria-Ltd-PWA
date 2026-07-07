import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function toCsvRow(cells: (string | number)[]) {
  return cells
    .map((c) => {
      const s = String(c ?? "");
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(",");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business") === "water" ? "water" : "real_estate";
  const period = searchParams.get("period") === "annual" ? "annual" : "monthly";

  const now = new Date();
  const start =
    period === "annual"
      ? new Date(now.getFullYear(), 0, 1)
      : new Date(now.getFullYear(), now.getMonth(), 1);

  const supabase = await createClient();
  const rows: string[] = [];
  rows.push(toCsvRow(["Fwangsat Ventures", business === "water" ? "Swan Water" : "Real Estate", period]));
  rows.push(toCsvRow(["Generated", new Date().toISOString()]));
  rows.push("");

  let totalRevenue = 0;

  if (business === "water") {
    const { data: invoices } = await supabase
      .from("water_invoices")
      .select("invoice_no, customer_name, total, paid_at")
      .eq("status", "paid")
      .gte("paid_at", start.toISOString());

    rows.push(toCsvRow(["Invoice No", "Customer", "Amount", "Paid At"]));
    (invoices ?? []).forEach((i) => {
      totalRevenue += Number(i.total ?? 0);
      rows.push(toCsvRow([i.invoice_no, i.customer_name, i.total, i.paid_at]));
    });
  } else {
    const { data: sold } = await supabase
      .from("properties")
      .select("title, price, sold_at")
      .eq("availability", "sold")
      .gte("sold_at", start.toISOString());
    const { data: rented } = await supabase
      .from("properties")
      .select("title, price, rent_started_at")
      .eq("availability", "rented")
      .gte("rent_started_at", start.toISOString());

    rows.push(toCsvRow(["Property", "Type", "Amount", "Date"]));
    (sold ?? []).forEach((p) => {
      totalRevenue += Number(p.price ?? 0);
      rows.push(toCsvRow([p.title, "Sold", p.price, p.sold_at]));
    });
    (rented ?? []).forEach((p) => {
      totalRevenue += Number(p.price ?? 0);
      rows.push(toCsvRow([p.title, "Rented", p.price, p.rent_started_at]));
    });
  }

  const { data: expenses } = await supabase
    .from("expenses")
    .select("title, amount, incurred_on")
    .eq("business", business)
    .gte("incurred_on", start.toISOString().slice(0, 10));

  rows.push("");
  rows.push(toCsvRow(["Expenses"]));
  rows.push(toCsvRow(["Title", "Amount", "Date"]));
  let totalExpenses = 0;
  (expenses ?? []).forEach((e) => {
    totalExpenses += Number(e.amount ?? 0);
    rows.push(toCsvRow([e.title, e.amount, e.incurred_on]));
  });

  rows.push("");
  rows.push(toCsvRow(["Total Revenue", totalRevenue]));
  rows.push(toCsvRow(["Total Expenses", totalExpenses]));
  rows.push(toCsvRow(["Net Profit / Loss", totalRevenue - totalExpenses]));

  const csv = rows.join("\n");
  const filename = `${business}-${period}-report-${now.toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
