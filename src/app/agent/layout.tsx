import { redirect } from "next/navigation";
import { LayoutDashboard, ClipboardList, ListChecks, PlusCircle } from "lucide-react";
import { DashboardSidebar, type NavItem } from "@/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { getCurrentProfile } from "@/lib/auth";

const NAV: NavItem[] = [
  { href: "/agent", label: "Overview", icon: LayoutDashboard },
  { href: "/agent/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/agent/listings", label: "Listing verification", icon: ListChecks },
  { href: "/agent/properties/new", label: "Add property", icon: PlusCircle },
];

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "agent") redirect(profile.role === "admin" ? "/admin" : "/sales");

  return (
    <div className="min-h-screen flex bg-ink-950">
      <DashboardSidebar items={NAV} role={profile.role} name={profile.full_name} />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardTopbar title="Agent dashboard" items={NAV} />
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
