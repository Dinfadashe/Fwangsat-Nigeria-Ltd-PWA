import { notFound } from "next/navigation";
import { MapPin, BedDouble, Bath, Ruler, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { BookInspectionButton } from "@/components/properties/BookInspectionButton";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/utils";
import type { Property } from "@/lib/types";

export const revalidate = 10;

async function getProperty(id: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*, property_media(*)")
    .eq("id", id)
    .eq("status", "approved")
    .single();
  return data as Property | null;
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) notFound();

  const unavailable = property.availability !== "available";

  return (
    <div className="min-h-screen bg-ink-950">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 md:px-8 py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <PropertyGallery media={property.property_media ?? []} />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge tone={property.purpose === "rent" ? "water" : "signal"}>For {property.purpose}</Badge>
              {property.availability === "sold" && <Badge tone="danger">Sold</Badge>}
              {property.availability === "rented" && <Badge tone="gold">Rented</Badge>}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-white">{property.title}</h1>
            <p className="flex items-center gap-1.5 text-sm text-white/45 mt-2">
              <MapPin size={15} /> {property.location}
            </p>

            <div className="flex items-center gap-6 mt-6 text-sm text-white/60 font-mono">
              {property.bedrooms != null && (
                <span className="flex items-center gap-1.5"><BedDouble size={16} /> {property.bedrooms} beds</span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-1.5"><Bath size={16} /> {property.bathrooms} baths</span>
              )}
              {property.size_sqm != null && (
                <span className="flex items-center gap-1.5"><Ruler size={16} /> {property.size_sqm} m²</span>
              )}
            </div>
          </div>

          {property.description && (
            <div>
              <h2 className="font-display text-lg font-medium text-white mb-3">About this property</h2>
              <p className="text-white/55 leading-relaxed whitespace-pre-line text-sm">{property.description}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel p-6 sticky top-28 flex flex-col gap-5">
            <div>
              <p className="eyebrow mb-1">Price</p>
              <p className="font-display text-3xl font-semibold text-signal">
                {formatNaira(property.price)}
                {property.purpose === "rent" && <span className="text-sm text-white/40"> /year</span>}
              </p>
            </div>

            <div className="border-t border-white/[0.06] pt-5">
              <p className="text-xs text-white/40 mb-3">
                Inspection fee: <span className="text-white/70 font-medium">{formatNaira(property.inspection_fee)}</span>
              </p>
              <BookInspectionButton
                propertyId={property.id}
                propertyTitle={property.title}
                inspectionFee={property.inspection_fee}
                disabled={unavailable}
              />
            </div>

            <div className="flex items-start gap-2 text-xs text-white/35 border-t border-white/[0.06] pt-5">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-signal" />
              Listed and verified by Fwangsat Ventures. Inspection fee is payable directly to our agent
              on the day of your visit.
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
