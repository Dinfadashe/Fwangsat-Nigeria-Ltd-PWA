import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Building2, Droplets, ShieldCheck, Home as HomeIcon, Sparkles, Hammer, Waves, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import { SITE, LOCATIONS } from "@/lib/constants";

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

      {/* HERO — logo + text centered, fills the viewport on any screen */}
      <section className="relative overflow-hidden bg-mesh-emerald min-h-[90dvh] flex items-center">
        <div className="absolute inset-0 bg-grid-lines bg-grid opacity-30 pointer-events-none" />

        <div className="mx-auto max-w-5xl px-5 md:px-8 py-16 relative flex flex-col items-center text-center w-full">

          {/* BOLD LOGO EMBLEM — centered */}
          <div className="relative h-32 w-32 xs:h-36 xs:w-36 md:h-48 md:w-48 mb-10">
            <div className="absolute inset-0 rounded-full bg-signal/30 blur-[70px]" />
            <div className="absolute inset-2 rounded-full border border-signal/20" />
            <div className="absolute inset-6 rounded-full border border-signal/30" />
            <div className="absolute inset-10 rounded-full border border-white/10" />
            <div className="absolute inset-5 rounded-full bg-white shadow-[0_0_80px_rgba(200,255,77,0.35)] grid place-items-center p-6 ring-4 ring-signal/40">
              <Image
                src="/logo-full.png"
                alt={SITE.name}
                width={180}
                height={180}
                priority
                className="object-contain"
              />
            </div>
          </div>

          <span className="eyebrow">Nigeria-Wide · Est. 2023</span>

          <h1 className="font-display font-semibold text-white leading-[1.05] mt-4 text-[clamp(2rem,6vw,4.5rem)] max-w-4xl">
            Affordable homes, infrastructure, and{" "}
            <span className="text-signal">clean water</span> — one company you can verify.
          </h1>

          <p className="mt-6 text-white/55 leading-relaxed text-[clamp(0.95rem,2vw,1.15rem)] max-w-xl">
            Fwangsat Ventures Nigeria Ltd builds affordable housing with basic amenities,
            constructs roads and high-rise buildings, drills boreholes, and supplies
            sustainable, portable water to rural and urban communities across Nigeria.
            Every listing here is checked by our professionals before it goes live.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/properties" className="btn-primary">
              Browse properties <ArrowUpRight size={16} />
            </Link>
            <Link href="/list-property" className="btn-secondary">
              List your property
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl w-full">
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

      {/* INFRASTRUCTURE */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <span className="eyebrow">Beyond housing</span>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 mb-4">
          Infrastructure that communities rely on
        </h2>
        <p className="text-white/50 text-sm md:text-base max-w-2xl mb-10 leading-relaxed">
          Our contractor grade covers more than housing — we deliver high-rise
          construction, road works, and borehole drilling for rural and urban
          communities nationwide.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="glass-panel overflow-hidden flex flex-col">
            <div className="relative h-48 w-full">
              <Image
                src="https://images.unsplash.com/photo-1744509636454-7b7d179b6d23?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                alt="High-rise building construction"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-7 flex flex-col gap-3">
              <span className="grid place-items-center h-11 w-11 rounded-xl bg-signal/10 text-signal">
                <Building2 size={20} />
              </span>
              <h3 className="font-display font-medium text-white text-lg">High-Rise Buildings</h3>
              <p className="text-sm text-white/45 leading-relaxed">
                Multi-storey residential and commercial buildings, engineered and
                supervised end-to-end by our in-house team.
              </p>
            </div>
          </div>

          <div className="glass-panel overflow-hidden flex flex-col">
            <div className="relative h-48 w-full">
              <Image
                src="https://images.unsplash.com/photo-1757030689760-3ec8be7326ae?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                alt="Road construction"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-7 flex flex-col gap-3">
              <span className="grid place-items-center h-11 w-11 rounded-xl bg-signal/10 text-signal">
                <Hammer size={20} />
              </span>
              <h3 className="font-display font-medium text-white text-lg">Road Construction</h3>
              <p className="text-sm text-white/45 leading-relaxed">
                Access roads and estate roads built to Medium Works 3 contractor
                grade, connecting communities that need it most.
              </p>
            </div>
          </div>

          <div className="glass-panel overflow-hidden flex flex-col">
            <div className="relative h-48 w-full">
              <Image
                src="https://images.unsplash.com/photo-1733947313015-e7000aebda5d?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                alt="Borehole and water infrastructure"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-7 flex flex-col gap-3">
              <span className="grid place-items-center h-11 w-11 rounded-xl bg-signal/10 text-signal">
                <Waves size={20} />
              </span>
              <h3 className="font-display font-medium text-white text-lg">Borehole Drilling</h3>
              <p className="text-sm text-white/45 leading-relaxed">
                Sustainable, portable water supply for rural and urban
                communities, from site survey through to commissioning.
              </p>
            </div>
          </div>
        </div>
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
              From our official distribution point on Zarmaganda–Rayfield Road, Swan Water reaches homes,
              events and offices across Nigeria on our own logistics fleet.
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
          Full-service construction &amp; real estate
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: HomeIcon, title: "Residential", desc: "Affordable single-family homes to full residential estates." },
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

      {/* LOCATIONS */}
      <section className="relative mx-auto max-w-7xl px-5 md:px-8 pb-24 overflow-hidden">
        <div className="absolute -left-16 -bottom-16 pointer-events-none select-none hidden md:block">
          <Image
            src="/logo-icon.png"
            alt=""
            width={300}
            height={300}
            className="object-contain opacity-[0.05]"
          />
        </div>
        <div className="relative">
          <span className="eyebrow">Nationwide presence</span>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 mb-10">
            Find us across Nigeria
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {LOCATIONS.map((loc) => (
              <div key={loc.address} className="glass-panel p-6 flex items-start gap-4">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-signal/10 text-signal shrink-0">
                  <MapPin size={18} />
                </span>
                <div>
                  <h3 className="font-display font-medium text-white text-sm mb-1">{loc.label}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{loc.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}