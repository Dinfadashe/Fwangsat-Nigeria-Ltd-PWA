import { redirect } from "next/navigation";
import { LayoutDashboard, Boxes, Receipt, FileCheck2 } from "lucide-react";
import { DashboardSidebar, type NavItem } from "@/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { LowStockPopup } from "@/components/water/LowStockPopup";
import { getCurrentProfile } from "@/lib/auth";

const NAV: NavItem[] = [
  { href: "/sales", label: "Overview", icon: LayoutDashboard },
  { href: "/sales/inventory", label: "Inventory", icon: Boxes },
  { href: "/sales/invoices", label: "Invoices", icon: Receipt },
  { href: "/sales/receipts", label: "Receipts", icon: FileCheck2 },
];

export default async function SalesLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "sales_rep") redirect(profile.role === "admin" ? "/admin" : "/agent");

  return (
    <div className="min-h-screen flex bg-ink-950">
      <DashboardSidebar items={NAV} role={profile.role} name={profile.full_name} />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardTopbar title="Sales dashboard" items={NAV} />
        <main className="flex-1 p-5 md:p-8">{children}</main>
        <LowStockPopup />
      </div>
    </div>
  );
}
