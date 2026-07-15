import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { getCurrentProfile } from "@/lib/auth";

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "agent") redirect(profile.role === "admin" ? "/admin" : "/sales");
  return (
    <div className="min-h-screen flex bg-ink-950">
      <DashboardSidebar role={profile.role} name={profile.full_name} />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardTopbar title="Agent dashboard" role={profile.role} />
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}