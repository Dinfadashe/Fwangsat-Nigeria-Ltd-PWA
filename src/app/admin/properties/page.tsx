import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPropertiesTable } from "@/components/properties/AdminPropertiesTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

async function getProperties(filter?: string): Promise<Property[]> {
  const supabase = await createClient();
  let query = supabase.from("properties").select("*, property_media(*)").order("created_at", { ascending: false });

  if (filter === "pending") query = query.eq("status", "pending");
  else if (filter === "approved") query = query.eq("status", "approved");
  else if (filter === "rejected") query = query.eq("status", "rejected");

  const { data } = await query;
  return (data as Property[]) ?? [];
}

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const properties = await getProperties(filter);

  const tabs = [
    { key: undefined, label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="eyebrow">Real estate</span>
          <h2 className="font-display text-xl font-semibold text-white mt-1">Properties</h2>
        </div>
        <Link href="/admin/properties/new" className="btn-primary !py-2.5 !px-5 text-sm">
          <Plus size={16} /> Add property
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.key ? `/admin/properties?filter=${t.key}` : "/admin/properties"}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
              filter === t.key || (!filter && !t.key)
                ? "bg-signal text-ink-950 border-signal"
                : "border-white/15 text-white/60 hover:text-white"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {properties.length === 0 ? (
        <EmptyState icon={Building2} title="No properties yet" description="Add your first property to get started." />
      ) : (
        <AdminPropertiesTable properties={properties} />
      )}
    </div>
  );
}
