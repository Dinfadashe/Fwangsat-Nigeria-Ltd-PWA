import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass-panel flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <span className="grid place-items-center h-12 w-12 rounded-2xl bg-white/5 text-white/40">
        <Icon size={22} />
      </span>
      <h3 className="font-display text-white font-medium">{title}</h3>
      {description && <p className="text-sm text-white/45 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
