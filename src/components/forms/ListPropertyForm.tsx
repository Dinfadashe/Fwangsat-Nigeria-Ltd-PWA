"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MediaUploader, uploadPropertyMedia, type PendingMedia } from "@/components/properties/MediaUploader";

const DEFAULT_INSPECTION_FEE = 15000;

export function ListPropertyForm() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<"sale" | "rent">("sale");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [media, setMedia] = useState<PendingMedia[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("You must accept the listing agreement to continue.");
      return;
    }
    if (media.length === 0) {
      setError("Please add at least one photo of the property.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data: inserted, error: insertError } = await supabase
      .from("properties")
      .insert({
        title,
        location,
        purpose,
        price: Number(price),
        inspection_fee: DEFAULT_INSPECTION_FEE,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        size_sqm: size ? Number(size) : null,
        description,
        source: "public_user",
        status: "pending",
        public_listing_status: "submitted",
        agreement_accepted: true,
        submitter_name: name,
        submitter_phone: phone,
        submitter_email: email || null,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      setSubmitting(false);
      setError("Something went wrong submitting your listing. Please try again.");
      return;
    }

    try {
      await uploadPropertyMedia(inserted.id, media);
    } catch {
      // Property is saved either way — admin can request more media if needed.
    }

    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="glass-panel p-10 flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="text-signal" size={44} />
        <h2 className="font-display text-xl font-semibold text-white">Listing submitted</h2>
        <p className="text-white/50 text-sm max-w-md">
          Our team will verify your property and contact you on {phone}. Once approved, it will appear
          on our website and be marketed by our agents.
        </p>
        <button onClick={() => router.push("/")} className="btn-primary mt-3">
          Back to homepage
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 flex flex-col gap-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="label-field">Property title</label>
          <input required className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 4 Bedroom Duplex, Rayfield" />
        </div>

        <div>
          <label className="label-field">Listing type</label>
          <div className="flex gap-2">
            {(["sale", "rent"] as const).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPurpose(p)}
                className={`flex-1 rounded-xl py-3 text-sm font-medium border transition-colors ${
                  purpose === p ? "bg-signal text-ink-950 border-signal" : "border-white/15 text-white/60"
                }`}
              >
                For {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label-field">Price (₦)</label>
          <input required type="number" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="45000000" />
        </div>

        <div className="sm:col-span-2">
          <label className="label-field">Location</label>
          <input required className="input-field" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Rayfield, Jos" />
        </div>

        <div>
          <label className="label-field">Bedrooms</label>
          <input type="number" className="input-field" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Bathrooms</label>
          <input type="number" className="input-field" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label-field">Size (m²)</label>
          <input type="number" className="input-field" value={size} onChange={(e) => setSize(e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <label className="label-field">Description</label>
          <textarea rows={4} className="input-field resize-none" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the property's features and condition..." />
        </div>
      </div>

      <div>
        <label className="label-field">Photos &amp; videos</label>
        <MediaUploader files={media} onChange={setMedia} />
      </div>

      <div className="border-t border-white/[0.06] pt-6 grid sm:grid-cols-3 gap-4">
        <div>
          <label className="label-field">Your full name</label>
          <input required className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Phone number</label>
          <input required type="tel" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Email (optional)</label>
          <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/10 p-4 text-sm text-white/65 cursor-pointer">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 accent-signal" />
        <span>
          I confirm the information above is accurate. If this property is approved and listed by
          Fwangsat Ventures, I agree that Fwangsat Ventures will handle its sale or rental exclusively
          and is entitled to the standard agent commission on the transaction value.
        </span>
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? <Loader2 className="animate-spin" size={16} /> : "Submit for verification"}
      </button>
    </form>
  );
}
