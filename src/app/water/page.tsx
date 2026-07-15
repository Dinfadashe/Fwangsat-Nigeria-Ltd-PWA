import Link from "next/link";
import Image from "next/image";
import { Droplets, Truck, ShieldCheck, PhoneCall, Handshake, MapPin, Sparkles, Landmark } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE, LOCATIONS, BANK_DETAILS } from "@/lib/constants";

export default function WaterPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <SiteHeader />

      {/* PARTNERSHIP BANNER */}
      <section className="border-b border-white/[0.06] bg-ink-900/60">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-6 flex items-center justify-center gap-6">
          <div className="h-14 w-14 rounded-full bg-white grid place-items-center shrink-0 shadow-lg">
            <Image src="/logo-icon.png" alt={SITE.name} width={40} height={40} className="object-contain" />
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <Handshake size={18} className="text-signal" />
          </div>
          <div className="h-14 w-14 rounded-full bg-white grid place-items-center shrink-0 shadow-lg">
            <Image src="/swan/swan-logo.png" alt="Swan Natural Spring Water" width={40} height={40} className="object-contain" />
          </div>
          <div className="hidden sm:block text-xs md:text-sm text-white/50 font-mono uppercase tracking-wide ml-2">
            Fwangsat Ventures Nigeria Ltd × Swan — Official Distributor
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-water/15 via-transparent to-transparent" />
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-water/20 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow !text-water-light">Official distributor · Nationwide</span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white mt-4 leading-[1.05]">
              Swan Natural Spring Water, delivered fresh across Nigeria.
            </h1>
            <p className="text-white/55 mt-6 max-w-lg text-base md:text-lg leading-relaxed">
              Fwangsat Ventures Nigeria Ltd is a major distributor of Swan Natural Spring Water —
              retail and bulk, dispatched from our depot on Zarmaganda–Rayfield Road, Jos, to homes,
              offices, events and retailers nationwide.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-water">
                <PhoneCall size={16} /> Call to order
              </a>
              <Link href="/book-meeting" className="btn-secondary">
                Request bulk supply
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden glass-panel">
            <div className="relative aspect-square w-full">
              <Image
                src="/swan/swan-lifestyle-green.jpg"
                alt="Swan Natural Spring Water bottle and glass"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* SIZE LINEUP — real product photo */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-24">
        <span className="eyebrow !text-water-light">Available sizes</span>
        <h2 className="font-display text-2xl md:text-4xl font-semibold text-white mt-2 mb-4">
          Three sizes, every need covered
        </h2>
        <p className="text-white/50 text-sm md:text-base max-w-2xl mb-12 leading-relaxed">
          From a quick refill on the move to bulk supply for the whole office — Swan Natural Spring
          Water comes in the size that fits how you drink it.
        </p>

        <div className="grid md:grid-cols-[1fr_1fr] gap-10 items-center">
          <div className="relative rounded-3xl overflow-hidden bg-white">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/swan/swan-sizes-lineup.jpg"
                alt="Swan Natural Spring Water — 50cl, 75cl and 150cl bottles"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {[
              { size: "50cl", use: "On-the-go & personal use" },
              { size: "75cl", use: "Home & office desk supply", featured: true },
              { size: "150cl", use: "Family & bulk-friendly size" },
            ].map((s) => (
              <div
                key={s.size}
                className={`glass-panel p-6 flex items-center justify-between gap-4 ${
                  s.featured ? "!bg-water/[0.08] ring-1 ring-water/30" : ""
                }`}
              >
                <div>
                  <p className="font-display text-2xl font-semibold text-white">{s.size}</p>
                  <p className="text-sm text-water-light mt-1">{s.use}</p>
                </div>
                {s.featured && (
                  <span className="text-[11px] font-mono uppercase tracking-wider text-signal shrink-0">
                    Most ordered
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y border-white/[0.06] bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 grid sm:grid-cols-3 gap-5">
          {[
            { icon: Droplets, title: "Retail & bulk", desc: "Every size available for homes, offices, events and sites." },
            { icon: Truck, title: "Own logistics", desc: "Dispatched daily on our own delivery fleet nationwide." },
            { icon: ShieldCheck, title: "Authentic supply", desc: "Sourced directly as an official Swan distributor." },
          ].map((f) => (
            <div key={f.title} className="flex flex-col gap-3">
              <span className="grid place-items-center h-11 w-11 rounded-xl bg-water/10 text-water-light">
                <f.icon size={20} />
              </span>
              <h3 className="font-display font-medium text-white">{f.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACTION SHOT */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-24">
        <div className="glass-panel relative overflow-hidden grid md:grid-cols-2 items-center bg-water/[0.04]">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full w-full">
            <Image
              src="/swan/swan-pour-blue.jpg"
              alt="Swan Natural Spring Water being poured"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8 md:p-14">
            <span className="eyebrow !text-water-light">Why Swan</span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-3 leading-snug">
              Natural spring water, trusted for years.
            </h2>
            <p className="text-white/50 mt-4 text-sm leading-relaxed">
              Swan Natural Spring Water has built a reputation for consistent quality and taste.
              As an official distributor, Fwangsat Ventures Nigeria Ltd brings that same reliability
              to every delivery, from single bottles to bulk event orders.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                { icon: Droplets, label: "Natural spring source" },
                { icon: Sparkles, label: "Consistent taste" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-sm text-white/70">
                  <f.icon size={16} className="text-water-light shrink-0" />
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <span className="eyebrow !text-water-light">Where to order</span>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 mb-10">
          Order from any of our locations
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {LOCATIONS.map((loc) => (
            <div key={loc.address} className="glass-panel p-6 flex items-start gap-4">
              <span className="grid place-items-center h-10 w-10 rounded-xl bg-water/10 text-water-light shrink-0">
                <MapPin size={18} />
              </span>
              <div>
                <h3 className="font-display font-medium text-white text-sm mb-1">{loc.label}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{loc.address}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAYMENT DETAILS */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <span className="eyebrow !text-water-light">How to pay</span>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 mb-8">
          Bank transfer details
        </h2>
        <div className="glass-panel p-8 grid sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <span className="grid place-items-center h-10 w-10 rounded-xl bg-water/10 text-water-light shrink-0">
              <Landmark size={18} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/40 mb-1">Bank</p>
              <p className="font-display text-lg text-white">{BANK_DETAILS.bankName}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/40 mb-1">Account number</p>
            <p className="font-display text-lg text-white font-mono">{BANK_DETAILS.accountNumber}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/40 mb-1">Account name</p>
            <p className="font-display text-lg text-white">{BANK_DETAILS.accountName}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <div className="glass-panel p-8 md:p-14 text-center bg-water/[0.06]">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-white">Ready to place an order?</h2>
          <p className="text-white/50 mt-3 text-sm max-w-md mx-auto">
            Call {SITE.phone} or send a message — our sales team will confirm pricing, sizes and delivery.
          </p>
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-water mt-7 inline-flex">
            <PhoneCall size={16} /> {SITE.phone}
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}