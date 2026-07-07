import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

export const revalidate = 15;

async function getProperties(purpose?: string): Promise<Property[]> {
  const supabase = await createClient();
  let query = supabase
    .from("properties")
    .select("*, property_media(*)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (purpose === "sale" || purpose === "rent") {
    query = query.eq("purpose", purpose);
  }

  const { data } = await query;
  return (data as Property[]) ?? [];
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ purpose?: string }>;
}) {
  const { purpose } = await searchParams;
  const properties = await getProperties(purpose);

  const filters = [
    { key: undefined, label: "All" },
    { key: "sale", label: "For Sale" },
    { key: "rent", label: "For Rent" },
  ];

  return (
    <div className="min-h-screen bg-ink-950">
      <SiteHeader />

      <section className="bg-mesh-emerald border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-14">
          <span className="eyebrow">Verified inventory</span>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mt-2">
            Properties for sale &amp; rent
          </h1>
          <p className="text-white/45 mt-2 max-w-lg text-sm">
            Every listing here has passed our admin review — no self-listed unverified properties.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 py-10">
        <div className="flex items-center gap-2 mb-8">
          <SlidersHorizontal size={15} className="text-white/40 mr-1" />
          {filters.map((f) => (
            <Link
              key={f.label}
              href={f.key ? `/properties?purpose=${f.key}` : "/properties"}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                purpose === f.key || (!purpose && !f.key)
                  ? "bg-signal text-ink-950 border-signal"
                  : "border-white/15 text-white/60 hover:text-white hover:border-white/30"
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {properties.length === 0 ? (
          <div className="glass-panel py-20 text-center text-white/40">
            No properties match this filter yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
