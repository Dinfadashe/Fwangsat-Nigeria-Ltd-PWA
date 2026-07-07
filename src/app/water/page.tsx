import Link from "next/link";
import { Droplets, Truck, ShieldCheck, PhoneCall } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE } from "@/lib/constants";

export default function WaterPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-water/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 relative">
          <span className="eyebrow !text-water-light">Fwangsat Ventures presents</span>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-white mt-3 max-w-2xl">
            Swan Water — pure, dispatched daily.
          </h1>
          <p className="text-white/50 mt-5 max-w-lg text-sm md:text-base leading-relaxed">
            Table water and bulk supply, produced and distributed from our depot on Zaramaganda Rayfield
            Road, Jos — straight to homes, events, offices and retailers.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-water">
              <PhoneCall size={16} /> Call to order
            </a>
            <Link href="/book-meeting" className="btn-secondary">
              Request bulk supply
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 py-20 grid sm:grid-cols-3 gap-5">
        {[
          { icon: Droplets, title: "Retail & bulk", desc: "Cartons for homes, bulk drums for events and sites." },
          { icon: Truck, title: "Own logistics", desc: "Dispatched daily on our own delivery fleet across Jos." },
          { icon: ShieldCheck, title: "Quality assured", desc: "Consistent sourcing and packaging standards." },
        ].map((f) => (
          <div key={f.title} className="glass-panel p-6 flex flex-col gap-3">
            <span className="grid place-items-center h-11 w-11 rounded-xl bg-water/10 text-water-light">
              <f.icon size={20} />
            </span>
            <h3 className="font-display font-medium text-white">{f.title}</h3>
            <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <div className="glass-panel p-8 md:p-12 text-center bg-water/[0.04]">
          <h2 className="font-display text-2xl font-semibold text-white">Ready to place an order?</h2>
          <p className="text-white/50 mt-2 text-sm max-w-md mx-auto">
            Call {SITE.phone} or send a message — our sales team will confirm pricing and delivery.
          </p>
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-water mt-6 inline-flex">
            <PhoneCall size={16} /> {SITE.phone}
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
