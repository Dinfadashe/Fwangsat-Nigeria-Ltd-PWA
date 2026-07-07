import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import type { Property, PropertyMedia } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export function PropertyCard({ property }: { property: Property & { property_media?: PropertyMedia[] } }) {
  const cover = property.property_media?.find((m) => m.kind === "image")?.url;
  const isUnavailable = property.availability !== "available";

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group glass-panel overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-white/20 font-display text-sm">
            No image yet
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge tone={property.purpose === "rent" ? "water" : "signal"}>
            For {property.purpose}
          </Badge>
        </div>
        {isUnavailable && (
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-[2px] grid place-items-center">
            <span className="font-display text-lg tracking-wide uppercase text-white/90">
              {property.availability}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-white leading-snug line-clamp-1">
            {property.title}
          </h3>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-white/45">
          <MapPin size={13} /> {property.location}
        </p>

        <div className="flex items-center gap-4 text-xs text-white/50 font-mono">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath size={13} /> {property.bathrooms}
            </span>
          )}
          {property.size_sqm != null && (
            <span className="flex items-center gap-1">
              <Ruler size={13} /> {property.size_sqm}m²
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-signal">
            {formatNaira(property.price)}
            {property.purpose === "rent" && <span className="text-xs text-white/40"> /yr</span>}
          </span>
          <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
