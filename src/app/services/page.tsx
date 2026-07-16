import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Home as HomeIcon,
  Building2,
  Hammer,
  Waves,
  Handshake,
  Droplets,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Services — Fwangsat Ventures Nigeria Ltd",
  description:
    "Affordable housing, high-rise construction, road works, borehole drilling, real estate sales, and Swan Water distribution — every service Fwangsat Ventures Nigeria Ltd delivers, explained.",
};

const SERVICES = [
  {
    icon: HomeIcon,
    tag: "Housing",
    title: "Affordable Housing",
    desc: "We design and build residential homes and estates priced for real families and real budgets — every unit delivered with basic amenities included, not sold as an afterthought. From single-family homes to full estate developments, our housing projects are built to a standard that holds up for decades, not just for handover day.",
    image: "https://images.unsplash.com/photo-1746350965171-07ca503c6d03?fm=jpg&q=80&w=1400&auto=format&fit=crop",
    alt: "Row of modern affordable houses in a residential estate",
  },
  {
    icon: Building2,
    tag: "Construction",
    title: "High-Rise & Commercial Buildings",
    desc: "Multi-storey residential and commercial buildings, engineered and supervised end-to-end by our in-house team — from foundation and structural work through to finishing. We manage the full build lifecycle so clients deal with one accountable contractor, not a chain of subcontractors.",
    image: "https://images.unsplash.com/photo-1744509636454-7b7d179b6d23?fm=jpg&q=80&w=1400&auto=format&fit=crop",
    alt: "Modern high-rise building under construction",
  },
  {
    icon: Hammer,
    tag: "Infrastructure",
    title: "Road Construction",
    desc: "Access roads and estate roads delivered to Medium Works 3 contractor grade standards, connecting the communities that need it most — whether that's a new estate's internal road network or a stretch of road linking a rural community to the nearest town.",
    image: "https://images.unsplash.com/photo-1757030689760-3ec8be7326ae?fm=jpg&q=80&w=1400&auto=format&fit=crop",
    alt: "Road construction workers paving with an asphalt machine",
  },
  {
    icon: Waves,
    tag: "Water",
    title: "Borehole Drilling",
    desc: "Sustainable, portable water supply for rural and urban communities across Nigeria — from initial site survey and hydrogeological assessment through drilling, casing, and commissioning. Clean water access is core to what we build, not a side project.",
    image: "/images/borehole-drilling-action.jpg",
    alt: "Fwangsat Ventures team drilling a borehole on site",
  },
  {
    icon: Handshake,
    tag: "Real Estate",
    title: "Property Sales & Management",
    desc: "Verified property listings for sale and rent, with every submission checked by our professionals before it goes live — plus full management for landlords, from tenant vetting to lease tracking. Buyers and renters get a platform they can trust; owners get a partner who actually manages the details.",
    image: "https://images.unsplash.com/photo-1741156386380-0236c72eb6f9?fm=jpg&auto=format&fit=crop&w=1400&q=80",
    alt: "Hand holding house keys at the entrance of a home",
  },
  {
    icon: Droplets,
    tag: "Distribution",
    title: "Swan Water Distribution",
    desc: "As the official distributor of Swan Natural Spring Water, we supply retail bottles and bulk orders — 50cl, 75cl, and 150cl — to homes, offices, events, and retailers nationwide, dispatched daily on our own logistics fleet from our depot in Jos.",
    image: "/swan/swan-lifestyle-green.jpg",
    alt: "Swan Natural Spring Water bottle and glass",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-mesh-emerald border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-grid-lines bg-grid opacity-30 pointer-events-none" />
        <div className="mx-auto max-w-5xl px-5 md:px-8 py-20 relative text-center">
          <span className="eyebrow">What we do</span>
          <h1 className="font-display font-semibold text-white leading-[1.05] mt-4 text-[clamp(2rem,5vw,3.5rem)]">
            Six services. One accountable company.
          </h1>
          <p className="mt-6 text-white/55 leading-relaxed text-[clamp(0.95rem,2vw,1.15rem)] max-w-2xl mx-auto">
            From the ground up — housing, infrastructure, water, and the platform to sell,
            rent, and manage it all. Every service delivered by Fwangsat Ventures Nigeria Ltd,
            nationwide.
          </p>
        </div>
      </section>

      {/* SERVICES — alternating image/text rows */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-20 flex flex-col gap-16 md:gap-24">
        {SERVICES.map((service, i) => {
          const Icon = service.icon;
          const imageFirst = i % 2 === 0;
          return (
            <div
              key={service.title}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <div className={imageFirst ? "md:order-1" : "md:order-2"}>
                <div className="relative rounded-3xl overflow-hidden glass-panel aspect-[4/3]">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div className={imageFirst ? "md:order-2" : "md:order-1"}>
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-signal/10 text-signal mb-5">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span className="eyebrow">{service.tag}</span>
                <h2 className="font-display font-semibold text-white mt-3 mb-4 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
                  {service.title}
                </h2>
                <p className="text-white/55 leading-relaxed text-[clamp(0.9rem,1.5vw,1rem)]">
                  {service.desc}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <div className="glass-panel p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left bg-water/[0.04]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">
              Need one of these services?
            </h2>
            <p className="text-white/45 text-sm mt-2 max-w-lg">
              Talk to our team about housing, construction, boreholes, or Swan Water supply.
            </p>
          </div>
          <Link href="/book-meeting" className="btn-primary shrink-0">
            Book a meeting <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}