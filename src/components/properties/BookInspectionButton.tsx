"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { InspectionBookingModal } from "@/components/properties/InspectionBookingModal";

export function BookInspectionButton({
  propertyId,
  propertyTitle,
  inspectionFee,
  disabled,
}: {
  propertyId: string;
  propertyTitle: string;
  inspectionFee: number;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        <CalendarCheck size={16} />
        {disabled ? "Not available for inspection" : "Book inspection"}
      </button>
      {!disabled && (
        <InspectionBookingModal
          open={open}
          onClose={() => setOpen(false)}
          propertyId={propertyId}
          propertyTitle={propertyTitle}
          inspectionFee={inspectionFee}
        />
      )}
    </>
  );
}
