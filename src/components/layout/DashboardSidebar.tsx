"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLE_LABEL } from "@/lib/constants";
import type { UserRole } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardSidebar({
  items,
  role,
  name,
}: {
  items: NavItem[];
  role: UserRole;
  name: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-white/[0.06] bg-ink-900/60 h-screen sticky top-0">
      <div className="flex items-center gap-3 px-6 h-20 border-b border-white/[0.06]">
        <span className="h-10 w-10 rounded-xl bg-white/95 grid place-items-center shrink-0">
          <Image src="/logo-icon.png" alt="Fwangsat" width={28} height={28} className="object-contain" />
        </span>
        <div className="leading-tight">
          <p className="font-display font-semibold text-white text-sm">Fwangsat</p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-signal">Nexus</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6 flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-signal/10 text-signal border border-signal/20"
                  : "text-white/55 hover:text-white hover:bg-white/[0.05] border border-transparent"
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-5 border-t border-white/[0.06]">
        <div className="glass-panel !bg-white/[0.02] px-3.5 py-3 flex items-center gap-3">
          <span className="h-9 w-9 rounded-full bg-signal/15 text-signal grid place-items-center font-display font-semibold text-sm">
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="leading-tight overflow-hidden">
            <p className="text-sm text-white truncate">{name}</p>
            <p className="text-[11px] text-white/40">{ROLE_LABEL[role]}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
