import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Building2, Droplets, ShieldCheck, Home as HomeIcon, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import { SITE } from "@/lib/constants";

export const revalidate = 30;

async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*, property_media(*)")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(6);
  return (data as Property[]) ?? [];
}

export default async function HomePage() {
  const properties = await getFeaturedProperties();

  return (
    <div className="min-h-screen bg-ink-950">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-mesh-emerald">
        <div className="absolute inset-0 bg-grid-lines bg-grid opacity-30 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-5 md:px-8 pt-20 pb-28 relative">
          <div className="flex items-center gap-2 mb-6">
            <span className="eyebrow">Jos · Plateau State · Est. 2023</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.05] max-w-4xl">
            Land, buildings, and{" "}
            <span className="text-signal">clean water</span> — one company you can verify.
          </h1>
          <p className="mt-6 text-white/55 text-base md:text-lg max-w-xl leading-relaxed">
            Fwangsat Ventures builds, sells, rents and manages property across Plateau State, and keeps
            homes and offices running on Swan Water. Every listing here is checked by our team before it
            goes live.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/properties" className="btn-primary">
              Browse properties <ArrowUpRight size={16} />
            </Link>
            <Link href="/list-property" className="btn-secondary">
              List your property
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            {[
              { label: "Business name reg.", value: "RC 7018588" },
              { label: "Founded", value: "2023" },
              { label: "Contractor grade", value: "Medium Works 3" },
              { label: "Bureau reg. cap", value: "₦250M–500M" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-white/[0.06] bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-white/40 font-mono uppercase tracking-wide">
          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-signal"/> CAC Registered</span>
          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-signal"/> SCUML Compliant</span>
          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-signal"/> PENCOM Certified</span>
          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-signal"/> NSITF Cleared</span>
          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-signal"/> ITF Compliant</span>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="eyebrow">Verified listings</span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2">
              Available for sale &amp; rent
            </h2>
          </div>
          <Link href="/properties" className="text-sm text-white/55 hover:text-white flex items-center gap-1.5">
            See all properties <ArrowUpRight size={14} />
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="glass-panel py-20 text-center text-white/40">
            New listings are on the way — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      {/* SWAN WATER TEASER */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <div className="glass-panel relative overflow-hidden p-8 md:p-14 grid md:grid-cols-2 gap-10 items-center bg-water/[0.04]">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-water/20 blur-3xl" />
          <div className="relative">
            <span className="eyebrow !text-water-light">Swan Water</span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-3 leading-snug">
              Table water, sachet water, and bulk delivery — dispatched daily from our depot.
            </h2>
            <p className="text-white/50 mt-4 text-sm leading-relaxed max-w-md">
              From our official distribution point on Zaramaganda Rayfield Road, Swan Water reaches homes,
              events and offices across Jos on our own logistics fleet.
            </p>
            <Link href="/water" className="btn-water mt-7 inline-flex">
              <Droplets size={16} /> Order Swan Water
            </Link>
          </div>
          <div className="relative grid grid-cols-2 gap-4">
            {[
              { icon: Droplets, label: "Daily dispatch" },
              { icon: ShieldCheck, label: "Quality assured" },
              { icon: Building2, label: "Bulk & retail" },
              { icon: Sparkles, label: "Fast delivery" },
            ].map((f) => (
              <div key={f.label} className="glass-panel !bg-white/[0.03] p-5 flex flex-col gap-3">
                <f.icon size={20} className="text-water-light" />
                <span className="text-sm text-white/70">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <span className="eyebrow">What we do</span>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 mb-10">
          Full-service construction & real estate
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: HomeIcon, title: "Residential", desc: "Single-family homes to full residential estates." },
            { icon: Building2, title: "Commercial", desc: "Offices, warehouses and retail-ready spaces." },
            { icon: Sparkles, title: "Design-build", desc: "One integrated team from drawing to handover." },
            { icon: ShieldCheck, title: "Build-to-sell", desc: "Market-ready homes built for property investors." },
          ].map((s) => (
            <div key={s.title} className="glass-panel p-6 flex flex-col gap-3">
              <span className="grid place-items-center h-10 w-10 rounded-xl bg-signal/10 text-signal">
                <s.icon size={19} />
              </span>
              <h3 className="font-display font-medium text-white">{s.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
