import { cn } from "@/lib/utils";
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
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        {Icon && (
          <span className={cn("grid place-items-center h-8 w-8 rounded-lg", toneMap[tone])}>
            <Icon size={16} strokeWidth={2} />
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-display font-semibold text-white">{value}</span>
        {trend && (
          <span className={cn("text-xs font-mono", trend.positive ? "text-signal" : "text-danger")}>
            {trend.positive ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-white/40">{sub}</p>}
    </div>
  );
}
