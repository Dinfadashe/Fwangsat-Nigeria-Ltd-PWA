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
  Boxes,
  FileCheck2,
  ListChecks,
  PlusCircle,
} from "lucide-react";
import type { NavItem } from "@/components/layout/DashboardSidebar";
import type { UserRole } from "@/lib/types";

const ADMIN_NAV: NavItem[] = [
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

const AGENT_NAV: NavItem[] = [
  { href: "/agent", label: "Overview", icon: LayoutDashboard },
  { href: "/agent/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/agent/listings", label: "Listing verification", icon: ListChecks },
  { href: "/agent/properties/new", label: "Add property", icon: PlusCircle },
];

const SALES_NAV: NavItem[] = [
  { href: "/sales", label: "Overview", icon: LayoutDashboard },
  { href: "/sales/inventory", label: "Inventory", icon: Boxes },
  { href: "/sales/invoices", label: "Invoices", icon: Receipt },
  { href: "/sales/receipts", label: "Receipts", icon: FileCheck2 },
];

export function getNavForRole(role: UserRole): NavItem[] {
  if (role === "admin") return ADMIN_NAV;
  if (role === "agent") return AGENT_NAV;
  return SALES_NAV;
}