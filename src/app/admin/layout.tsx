import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  CalendarCheck,
  CalendarDays,
  Users,
  Droplets,
  Receipt,
  Wallet,
  BarChart3,
} from "lucide-react";
import { DashboardSidebar, type NavItem } from "@/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { LowStockPopup } from "@/components/water/LowStockPopup";
import { getCurrentProfile } from "@/lib/auth";

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/listings", label: "Public listings", icon: ClipboardList },
  { href: "/admin/inspections", label: "Inspections", icon: CalendarCheck },
  { href: "/admin/meetings", label: "Meetings", icon: CalendarDays },
  { href: "/admin/agents", label: "Team", icon: Users },
  { href: "/admin/water", label: "Water inventory", icon: Droplets },
  { href: "/admin/water/invoices", label: "Water invoices", icon: Receipt },
  { href: "/admin/expenses", label: "Expenses", icon: Wallet },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect(`/${profile.role === "sales_rep" ? "sales" : profile.role}`);

  return (
    <div className="min-h-screen flex bg-ink-950">
      <DashboardSidebar items={NAV} role={profile.role} name={profile.full_name} />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardTopbar title="Admin dashboard" items={NAV} />
        <main className="flex-1 p-5 md:p-8">{children}</main>
        <LowStockPopup />
      </div>
    </div>
  );
}
