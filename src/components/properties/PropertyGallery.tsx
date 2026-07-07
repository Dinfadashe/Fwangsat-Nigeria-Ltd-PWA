"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import type { PropertyMedia } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PropertyGallery({ media }: { media: PropertyMedia[] }) {
  const [active, setActive] = useState(0);
  const sorted = [...media].sort((a, b) => a.sort_order - b.sort_order);
  const current = sorted[active];

  if (sorted.length === 0) {
    return (
      <div className="aspect-video rounded-2xl bg-ink-800 grid place-items-center text-white/25 font-display">
        No media uploaded yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-ink-800 border border-white/[0.06]">
        {current.kind === "image" ? (
          <Image src={current.url} alt="Property media" fill className="object-cover" priority />
        ) : (
          <video src={current.url} controls className="h-full w-full object-cover" />
        )}

        {sorted.length > 1 && (
          <>
            <button
              onClick={() => setActive((a) => (a - 1 + sorted.length) % sorted.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-ink-950/60 backdrop-blur text-white hover:bg-ink-950/90"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setActive((a) => (a + 1) % sorted.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-ink-950/60 backdrop-blur text-white hover:bg-ink-950/90"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-24 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                i === active ? "border-signal" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              {m.kind === "image" ? (
                <Image src={m.url} alt="" fill className="object-cover" />
              ) : (
                <div className="h-full w-full bg-ink-800 grid place-items-center">
                  <PlayCircle size={20} className="text-white/70" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
