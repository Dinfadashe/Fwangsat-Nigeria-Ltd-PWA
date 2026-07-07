import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropertyForm } from "@/components/properties/PropertyForm";
import type { Property } from "@/lib/types";

export default async function AgentEditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("properties").select("*, property_media(*)").eq("id", id).single();

  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">Improve listing</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">{data.title}</h2>
      </div>
      <PropertyForm role="agent" initial={data as Property} redirectTo="/agent/listings" />
    </div>
  );
}
