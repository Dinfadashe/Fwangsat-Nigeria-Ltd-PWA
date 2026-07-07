import { PropertyForm } from "@/components/properties/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">New listing</span>
        <h2 className="font-display text-xl font-semibold text-white mt-1">Add a property</h2>
        <p className="text-sm text-white/40 mt-1">This will appear on the website immediately after publishing.</p>
      </div>
      <PropertyForm role="admin" redirectTo="/admin/properties" />
    </div>
  );
}
