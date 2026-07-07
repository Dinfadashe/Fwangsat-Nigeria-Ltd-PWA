import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "signal" | "gold" | "water" | "danger" | "muted";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-white/10 text-white/80 border-white/15",
  signal: "bg-signal/15 text-signal border-signal/30",
  gold: "bg-gold/15 text-gold border-gold/30",
  water: "bg-water/15 text-water-light border-water/30",
  danger: "bg-danger/15 text-danger border-danger/30",
  muted: "bg-white/5 text-white/45 border-white/10",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
