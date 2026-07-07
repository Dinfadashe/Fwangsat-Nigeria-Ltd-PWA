"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatNumber } from "@/lib/utils";

interface LowItem {
  id: string;
  name: string;
  quantity_on_hand: number;
}

export function LowStockPopup() {
  const [items, setItems] = useState<LowItem[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data } = await supabase.from("v_low_stock").select("id, name, quantity_on_hand");
      if (data && data.length > 0) {
        setItems(data as LowItem[]);
      }
    }
    check();
  }, []);

  if (items.length === 0 || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm glass-panel !bg-ink-850/95 p-5 border-danger/30 shadow-glass animate-float">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-white/40 hover:text-white"
        aria-label="Dismiss"
      >
        <X size={15} />
      </button>
      <div className="flex items-start gap-3">
        <span className="grid place-items-center h-9 w-9 rounded-lg bg-danger/15 text-danger shrink-0">
          <AlertTriangle size={17} />
        </span>
        <div>
          <p className="text-sm font-medium text-white">Stock running low</p>
          <ul className="mt-2 flex flex-col gap-1">
            {items.slice(0, 4).map((i) => (
              <li key={i.id} className="text-xs text-white/55">
                {i.name} — <span className="text-danger font-mono">{formatNumber(i.quantity_on_hand)} left</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
