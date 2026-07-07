"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, ExternalLink } from "lucide-react";
import type { NavItem } from "./DashboardSidebar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function DashboardTopbar({ title, items }: { title: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 h-20 px-5 md:px-8 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="md:hidden grid place-items-center h-9 w-9 rounded-full hover:bg-white/10 text-white"
        >
          <Menu size={18} />
        </button>
        <h1 className="font-display text-lg md:text-xl font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-2 text-xs text-white/50 hover:text-white px-3 py-2 rounded-full hover:bg-white/5"
        >
          <ExternalLink size={14} /> View website
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs text-white/60 hover:text-danger px-3 py-2 rounded-full hover:bg-white/5"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-ink-900 border-r border-white/[0.08] flex flex-col">
            <div className="flex items-center justify-between h-20 px-5 border-b border-white/[0.06]">
              <span className="h-9 w-9 rounded-lg bg-white/95 grid place-items-center">
                <Image src="/logo-icon.png" alt="Fwangsat" width={24} height={24} />
              </span>
              <button onClick={() => setOpen(false)} className="h-9 w-9 grid place-items-center text-white/70">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
              {items.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium",
                      active ? "bg-signal/10 text-signal" : "text-white/60"
                    )}
                  >
                    <Icon size={17} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
