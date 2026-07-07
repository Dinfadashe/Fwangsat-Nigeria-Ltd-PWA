"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

export function MarkRentedModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (months: number) => Promise<void>;
}) {
  const [months, setMonths] = useState("12");
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setSubmitting(true);
    await onConfirm(Number(months));
    setSubmitting(false);
  }

  return (
    <Modal open={open} onClose={onClose} title="Mark property as rented">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-white/50">
          The tenancy countdown will start today. Enter the number of months this property is rented for.
        </p>
        <div>
          <label className="label-field">Number of months</label>
          <input
            type="number"
            min={1}
            className="input-field"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
          />
        </div>
        <button onClick={handleConfirm} disabled={submitting} className="btn-primary w-full">
          {submitting ? <Loader2 className="animate-spin" size={16} /> : "Start countdown"}
        </button>
      </div>
    </Modal>
  );
}
