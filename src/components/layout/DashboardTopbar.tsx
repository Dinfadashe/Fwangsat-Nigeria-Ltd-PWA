"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, ExternalLink } from "lucide-react";
import { getNavForRole } from "@/lib/dashboard-nav";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

export function DashboardTopbar({ title, role }: { title: string; role: UserRole }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Lock background scroll while the mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
    }
    return () => document.body.classList.remove("scroll-locked");
  }, [open]);

  // Close the menu automatically on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
          className="md:hidden grid place-items-center h-11 w-11 rounded-full hover:bg-white/10 text-white"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="dashboard-mobile-nav"
        >
          <Menu size={18} aria-hidden="true" />
        </button>
        <h1 className="font-display text-lg md:text-xl font-semibold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-2 text-xs text-white/50 hover:text-white px-3 py-2 rounded-full hover:bg-white/5"
        >
          <ExternalLink size={14} aria-hidden="true" /> View website
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs text-white/60 hover:text-danger px-3 py-2 rounded-full hover:bg-white/5"
        >
          <LogOut size={14} aria-hidden="true" /> Sign out
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] md:hidden h-dvh w-screen">
          <div
            className="absolute inset-0 bg-ink-950/90 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="dashboard-mobile-nav"
            aria-label="Dashboard navigation"
            className="absolute left-0 top-0 h-dvh w-72 max-w-[85vw] bg-ink-900 border-r border-white/[0.08] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between h-20 px-5 border-b border-white/[0.06] shrink-0">
              <span className="h-9 w-9 rounded-lg bg-white/95 grid place-items-center">
                <Image src="/logo-icon.png" alt="Fwangsat" width={24} height={24} />
              </span>
              <button
                onClick={() => setOpen(false)}
                className="h-11 w-11 grid place-items-center text-white/70"
                aria-label="Close menu"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
              {getNavForRole(role).map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium min-h-[44px]",
                      active ? "bg-signal/10 text-signal" : "text-white/60"
                    )}
                  >
                    <Icon size={17} aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}