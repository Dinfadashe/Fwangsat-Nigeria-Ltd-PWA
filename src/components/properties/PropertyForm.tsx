"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MediaUploader, uploadPropertyMedia, type PendingMedia } from "@/components/properties/MediaUploader";
import type { Property } from "@/lib/types";

const DEFAULT_INSPECTION_FEE = 15000;

export function PropertyForm({
  role,
  initial,
  redirectTo,
}: {
  role: "admin" | "agent";
  initial?: Property;
  redirectTo: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [purpose, setPurpose] = useState<"sale" | "rent">(initial?.purpose ?? "sale");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [inspectionFee, setInspectionFee] = useState(initial?.inspection_fee?.toString() ?? String(DEFAULT_INSPECTION_FEE));
  const [location, setLocation] = useState(initial?.location ?? "");
  const [bedrooms, setBedrooms] = useState(initial?.bedrooms?.toString() ?? "");
  const [bathrooms, setBathrooms] = useState(initial?.bathrooms?.toString() ?? "");
  const [size, setSize] = useState(initial?.size_sqm?.toString() ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [media, setMedia] = useState<PendingMedia[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const supabase = createClient();

    const payload = {
      title,
      purpose,
      price: Number(price),
      inspection_fee: Number(inspectionFee),
      location,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      size_sqm: size ? Number(size) : null,
      description,
    };

    if (isEdit && initial) {
      const { error: updateError } = await supabase.from("properties").update(payload).eq("id", initial.id);
      if (updateError) {
        setSubmitting(false);
        setError("Could not save changes.");
        return;
      }
      if (media.length > 0) {
        try {
          await uploadPropertyMedia(initial.id, media);
        } catch {
          /* non-fatal */
        }
      }
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: inserted, error: insertError } = await supabase
        .from("properties")
        .insert({
          ...payload,
          source: role,
          status: role === "admin" ? "approved" : "pending",
          availability: "available",
          created_by: user?.id ?? null,
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        setSubmitting(false);
        setError("Could not create property.");
        return;
      }
      if (media.length > 0) {
        try {
          await uploadPropertyMedia(inserted.id, media);
        } catch {
          /* non-fatal */
        }
      }
    }

    setSubmitting(false);
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 flex flex-col gap-6 max-w-3xl">
      {role === "agent" && !isEdit && (
        <div className="rounded-xl bg-gold/10 border border-gold/25 text-gold text-sm px-4 py-3">
          This listing will be sent to the admin for approval before it appears on the website.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="label-field">Property title</label>
          <input required className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
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
          <input required type="number" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <label className="label-field">Location</label>
          <input required className="input-field" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div>
          <label className="label-field">Bedrooms</label>
          <input type="number" className="input-field" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Bathrooms</label>
          <input type="number" className="input-field" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Size (m²)</label>
          <input type="number" className="input-field" value={size} onChange={(e) => setSize(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Inspection fee (₦)</label>
          <input required type="number" className="input-field" value={inspectionFee} onChange={(e) => setInspectionFee(e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <label className="label-field">Description</label>
          <textarea rows={4} className="input-field resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label-field">{isEdit ? "Add more photos & videos" : "Photos & videos"}</label>
        <MediaUploader files={media} onChange={setMedia} />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto self-start">
        {submitting ? <Loader2 className="animate-spin" size={16} /> : isEdit ? "Save changes" : "Publish property"}
      </button>
    </form>
  );
}
