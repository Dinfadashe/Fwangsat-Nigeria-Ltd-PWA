"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-11 w-11 rounded-xl bg-white/95 grid place-items-center overflow-hidden shrink-0">
            <Image src="/logo-icon.png" alt={SITE.name} width={34} height={34} className="object-contain" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display font-semibold text-white tracking-wide">FWANGSAT</span>
            <span className="text-[10px] tracking-[0.3em] text-signal font-mono uppercase">Ventures</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <Phone size={15} /> {SITE.phone}
          </a>
          <Link href="/login" className="btn-secondary !px-5 !py-2.5 text-sm">
            Staff login
          </Link>
        </div>

        <button
          className="lg:hidden grid place-items-center h-10 w-10 rounded-full hover:bg-white/10 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/[0.06] px-5 py-4 flex flex-col gap-1 bg-ink-950">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-white/75 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm text-signal hover:bg-white/5"
          >
            Staff login
          </Link>
        </div>
      )}
    </header>
  );
}
