import { Badge } from "@/components/ui/Badge";
import type { Property } from "@/lib/types";

export function PropertyAvailabilityBadge({ property }: { property: Property }) {
  if (property.availability === "sold") return <Badge tone="danger">Sold</Badge>;
  if (property.availability === "rented") return <Badge tone="gold">Rented</Badge>;
  return <Badge tone="signal">Available</Badge>;
}

export function PropertyModerationBadge({ property }: { property: Property }) {
  if (property.status === "pending") return <Badge tone="gold">Pending review</Badge>;
  if (property.status === "rejected") return <Badge tone="danger">Rejected</Badge>;
  return <Badge tone="signal">Approved</Badge>;
}
