import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { NAV_LINKS, SITE, LOCATIONS } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink-950 mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-11 w-11 rounded-xl bg-white/95 grid place-items-center">
              <Image src="/logo-icon.png" alt={SITE.name} width={34} height={34} className="object-contain" />
            </span>
            <span className="font-display font-semibold text-white">Fwangsat Ventures Nigeria Ltd</span>
          </div>
          <p className="text-sm text-white/45 max-w-sm leading-relaxed">
            Affordable housing, road construction, borehole drilling, and Swan
            Water — serving rural and urban communities across Nigeria since 2023.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Navigate</p>
          <ul className="flex flex-col gap-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Reach us</p>
          <ul className="flex flex-col gap-3 text-sm text-white/55 mb-6">
            <li className="flex items-start gap-2">
              <Phone size={15} className="mt-0.5 shrink-0" /> {SITE.phone}
            </li>
            <li className="flex items-start gap-2">
              <Mail size={15} className="mt-0.5 shrink-0" /> {SITE.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06] mx-auto max-w-7xl px-5 md:px-8 py-8">
        <p className="eyebrow mb-4">Our locations</p>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {LOCATIONS.map((loc) => (
            <div key={loc.address} className="flex items-start gap-2 text-sm text-white/45">
              <MapPin size={15} className="mt-0.5 shrink-0 text-signal" />
              <span><span className="text-white/65">{loc.label}:</span> {loc.address}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06] py-5 text-center text-xs text-white/30">
        © {new Date().getFullYear()} Fwangsat Ventures Nigeria Ltd. All rights reserved.
      </div>
    </footer>
  );
}