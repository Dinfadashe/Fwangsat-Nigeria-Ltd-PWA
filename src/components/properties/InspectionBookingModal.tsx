"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";

export function InspectionBookingModal({
  open,
  onClose,
  propertyId,
  propertyTitle,
  inspectionFee,
}: {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  inspectionFee: number;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("Please confirm you agree to pay the inspection fee.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("inspections").insert({
      property_id: propertyId,
      visitor_name: name,
      visitor_phone: phone,
      preferred_date: date,
      fee_amount: inspectionFee,
      fee_agreed: true,
      status: "new",
    });
    setSubmitting(false);
    if (insertError) {
      setError("Something went wrong. Please try again or call us directly.");
      return;
    }
    setDone(true);
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setDone(false);
      setName("");
      setPhone("");
      setDate("");
      setAgreed(false);
      setError(null);
    }, 300);
  }

  return (
    <Modal open={open} onClose={handleClose} title="Book an inspection">
      {done ? (
        <div className="flex flex-col items-center text-center gap-3 py-6">
          <CheckCircle2 className="text-signal" size={40} />
          <p className="font-display text-white font-medium">Inspection request sent</p>
          <p className="text-sm text-white/50">
            An agent will call {phone} to confirm your visit to {propertyTitle}.
          </p>
          <button onClick={handleClose} className="btn-primary mt-2">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-white/50 -mt-2">{propertyTitle}</p>

          <div>
            <label className="label-field">Full name</label>
            <input
              required
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amaka Johnson"
            />
          </div>
          <div>
            <label className="label-field">Phone number</label>
            <input
              required
              type="tel"
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0801 234 5678"
            />
          </div>
          <div>
            <label className="label-field">Preferred inspection date</label>
            <input
              required
              type="date"
              className="input-field"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <label className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/10 p-3.5 text-sm text-white/70 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 accent-signal"
            />
            <span>
              I agree to pay an inspection fee of{" "}
              <span className="text-signal font-semibold">{formatNaira(inspectionFee)}</span> on the day
              of inspection.
            </span>
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-1">
            {submitting ? <Loader2 className="animate-spin" size={16} /> : "Confirm booking"}
          </button>
        </form>
      )}
    </Modal>
  );
}
