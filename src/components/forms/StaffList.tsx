"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_LABEL } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import type { Profile } from "@/lib/types";

export function StaffList({ staff }: { staff: Profile[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleActive(staffId: string, isActive: boolean) {
    setBusyId(staffId);
    await fetch("/api/admin/toggle-staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId, isActive }),
    });
    setBusyId(null);
    router.refresh();
  }

  if (staff.length === 0) {
    return <div className="glass-panel py-16 text-center text-white/40">No team members yet.</div>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {staff.map((s) => (
        <div key={s.id} className="glass-panel p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-signal/15 text-signal grid place-items-center font-display font-semibold">
              {s.full_name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{s.full_name}</p>
              <p className="text-xs text-white/40">{s.phone ?? "No phone"}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge tone={s.role === "admin" ? "signal" : s.role === "agent" ? "water" : "gold"}>
              {ROLE_LABEL[s.role]}
            </Badge>
            <button
              disabled={busyId === s.id || s.role === "admin"}
              onClick={() => toggleActive(s.id, !s.is_active)}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                s.is_active ? "border-signal/40 text-signal" : "border-white/15 text-white/40"
              }`}
            >
              {s.is_active ? "Active" : "Disabled"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
