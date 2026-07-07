import { PropertyForm } from "@/components/properties/PropertyForm";

export default function AgentNewPropertyPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">New listing</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Add a property</h2>
        <p className="text-sm text-white/40 mt-1">Sent to the admin for approval before it appears on the website.</p>
      </div>
      <PropertyForm role="agent" redirectTo="/agent" />
    </div>
  );
}
