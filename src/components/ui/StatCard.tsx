import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  tone = "signal",
  sub,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  tone?: "signal" | "water" | "gold";
  sub?: string;
}) {
  const toneMap = {
    signal: "text-signal bg-signal/10",
    water: "text-water-light bg-water/10",
    gold: "text-gold bg-gold/10",
  };

  return (
    <div className="glass-panel p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="eyebrow">{label}</span>
        {Icon && (
          <span className={cn("grid place-items-center h-8 w-8 rounded-lg shrink-0", toneMap[tone])}>
            <Icon size={16} strokeWidth={2} aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2 flex-wrap">
        <span className="text-2xl font-display font-semibold text-white break-words">{value}</span>
        {trend && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-mono shrink-0",
              trend.positive ? "text-signal" : "text-danger"
            )}
          >
            {trend.positive ? (
              <TrendingUp size={12} aria-hidden="true" />
            ) : (
              <TrendingDown size={12} aria-hidden="true" />
            )}
            {trend.value}
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-white/40">{sub}</p>}
    </div>
  );
}