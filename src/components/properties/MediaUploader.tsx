"use client";

import { useRef, useState } from "react";
import { ImagePlus, Film, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MAX_VIDEO_BYTES, bytesToMB } from "@/lib/utils";

export interface PendingMedia {
  file: File;
  kind: "image" | "video";
  previewUrl: string;
}

/**
 * Lets the user stage images/videos client-side (with a 50MB video cap),
 * then exposes an `upload()` method via ref-less pattern: parent calls
 * `uploadAll(propertyId)` after the property row exists.
 */
export function MediaUploader({
  files,
  onChange,
}: {
  files: PendingMedia[];
  onChange: (files: PendingMedia[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setError(null);
    const next: PendingMedia[] = [];

    for (const file of selected) {
      const isVideo = file.type.startsWith("video/");
      if (isVideo && file.size > MAX_VIDEO_BYTES) {
        setError(`"${file.name}" is ${bytesToMB(file.size)}MB — videos must be 50MB or smaller.`);
        continue;
      }
      next.push({
        file,
        kind: isVideo ? "video" : "image",
        previewUrl: URL.createObjectURL(file),
      });
    }
    onChange([...files, ...next]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(idx: number) {
    onChange(files.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleSelect}
        className="hidden"
        id="media-upload-input"
      />
      <label
        htmlFor="media-upload-input"
        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 py-8 cursor-pointer hover:border-signal/40 hover:bg-white/[0.02] transition-colors text-center"
      >
        <div className="flex items-center gap-2 text-white/50">
          <ImagePlus size={18} /> <Film size={18} />
        </div>
        <p className="text-sm text-white/60">Click to add photos &amp; videos</p>
        <p className="text-xs text-white/30">Videos up to 50MB each</p>
      </label>

      {error && <p className="text-xs text-danger">{error}</p>}

      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {files.map((m, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-ink-800 group">
              {m.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.previewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <video src={m.previewUrl} className="h-full w-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1.5 right-1.5 h-6 w-6 grid place-items-center rounded-full bg-ink-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={13} />
              </button>
              {m.kind === "video" && (
                <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-ink-950/80 px-1.5 py-0.5 rounded text-white/70">
                  video
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Uploads staged files to Supabase Storage and inserts property_media rows. */
export async function uploadPropertyMedia(propertyId: string, files: PendingMedia[]) {
  const supabase = createClient();

  for (let i = 0; i < files.length; i++) {
    const { file, kind } = files[i];
    const path = `${propertyId}/${Date.now()}-${i}-${file.name.replace(/\s+/g, "-")}`;

    const { error: uploadError } = await supabase.storage.from("property-media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage.from("property-media").getPublicUrl(path);

    const { error: insertError } = await supabase.from("property_media").insert({
      property_id: propertyId,
      kind,
      url: publicUrl.publicUrl,
      size_bytes: file.size,
      sort_order: i,
    });
    if (insertError) throw insertError;
  }
}
