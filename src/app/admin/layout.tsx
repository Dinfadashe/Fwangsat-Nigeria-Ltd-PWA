import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { LowStockPopup } from "@/components/water/LowStockPopup";
import { getCurrentProfile } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect(`/${profile.role === "sales_rep" ? "sales" : profile.role}`);
  return (
    <div className="min-h-screen flex bg-ink-950">
      <DashboardSidebar role={profile.role} name={profile.full_name} />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardTopbar title="Admin dashboard" role={profile.role} />
        <main className="flex-1 p-5 md:p-8">{children}</main>
        <LowStockPopup />
      </div>
    </div>
  );
}