import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Target,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Award,
  Building2,
  MapPin,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { STOCK_IMAGES } from "@/lib/media";
import { LOCATIONS } from "@/lib/constants";

export const metadata = {
  title: "About Us — Fwangsat Ventures Nigeria Ltd",
  description:
    "Fwangsat Ventures Nigeria Ltd is a registered contractor delivering affordable housing, infrastructure and sustainable water supply to communities across Nigeria since 2023.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    desc: "We uphold the highest ethical standards in all our dealings, ensuring transparency and honesty.",
  },
  {
    icon: Award,
    title: "Excellence",
    desc: "We strive for excellence in everything we do, from project planning to execution and delivery.",
  },
  {
    icon: Target,
    title: "Innovation",
    desc: "We embrace innovation and continuously seek new ways to improve our services and processes.",
  },
  {
    icon: HeartHandshake,
    title: "Safety",
    desc: "We prioritize the safety of our workers, clients, and the environment in all our projects.",
  },
];

const PROFESSIONALS = [
  {
    name: "Penuel Satmark",
    role: "Chief Executive Officer",
    qualification: "B.Sc. Estate Surveying & Valuation, University of Jos",
  },
  {
    name: "Pwajok Joseph Dung",
    role: "Architect",
    qualification: "M.Sc. Architecture · Registered with the Architects Registration Council of Nigeria",
  },
  {
    name: "Nganjiwa Godwin Elijah",
    role: "Building Engineer",
    qualification: "B.Tech Building Technology, Abubakar Tafawa Balewa University, Bauchi",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0">
          <Image
            src={STOCK_IMAGES.roadConstruction}
            alt="Fwangsat Ventures Nigeria Ltd construction works"
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/90 to-ink-950" />
        </div>
        <div className="absolute inset-0 bg-mesh-emerald" />
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-24 relative text-center">
          <span className="eyebrow">About Fwangsat Ventures Nigeria Ltd</span>
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-white mt-3 leading-tight">
            Building Nigeria&apos;s future, one project at a time.
          </h1>
          <p className="text-white/50 mt-5 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            A registered Medium Works contractor delivering affordable housing, infrastructure and
            sustainable water supply — trusted across Nigeria since 2023.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow">Our story</span>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 mb-5">
            Founded in 2023, with a vision to transform construction in Nigeria
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-4">
            At Fwangsat Ventures Nigeria Ltd, we believe in building a brighter future through
            innovative construction solutions. Based in Nigeria, our company has established itself
            as a leading provider of high-quality construction services, catering to a diverse range
            of clients across various sectors.
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            With a passion for excellence and a commitment to integrity, we embarked on a journey to
            deliver top-notch construction services that not only meet but exceed client expectations.
            Over the years, our unwavering dedication to quality and customer satisfaction has earned us
            a reputation for reliability and professionalism across the communities we serve nationwide.
          </p>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src={STOCK_IMAGES.bridgeConstruction}
            alt="Civil works under construction"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24 grid md:grid-cols-2 gap-5">
        <div className="glass-panel p-8">
          <span className="grid place-items-center h-11 w-11 rounded-xl bg-signal/10 text-signal mb-5">
            <Target size={20} />
          </span>
          <h3 className="font-display text-lg font-semibold text-white mb-3">Our Mission</h3>
          <p className="text-sm text-white/50 leading-relaxed">
            To provide exceptional construction services that contribute to the sustainable development
            of communities across Nigeria — delivering innovative, cost-effective solutions, maintaining
            the highest standards of quality and safety, and building long-lasting relationships with our
            clients, partners, and stakeholders.
          </p>
        </div>
        <div className="glass-panel p-8">
          <span className="grid place-items-center h-11 w-11 rounded-xl bg-water/10 text-water-light mb-5">
            <Eye size={20} />
          </span>
          <h3 className="font-display text-lg font-semibold text-white mb-3">Our Vision</h3>
          <p className="text-sm text-white/50 leading-relaxed">
            A Nigeria where innovative design and sustainable construction transform communities and
            elevate the quality of life for all. We aspire to be the leading force in the construction
            industry, setting new standards for quality, safety, and customer satisfaction.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <span className="eyebrow">What guides us</span>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 mb-10">
          Our values
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v) => (
            <div key={v.title} className="glass-panel p-6 flex flex-col gap-3">
              <span className="grid place-items-center h-10 w-10 rounded-xl bg-signal/10 text-signal">
                <v.icon size={19} />
              </span>
              <h3 className="font-display font-medium text-white">{v.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUR PROFESSIONALS */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <span className="eyebrow">Who&apos;s behind the work</span>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2 mb-10">
          Our Professionals
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROFESSIONALS.map((p) => (
            <div key={p.name} className="glass-panel p-6 flex flex-col gap-3">
              <span className="h-12 w-12 rounded-full bg-signal/15 text-signal grid place-items-center font-display font-semibold text-lg">
                {p.name.charAt(0)}
              </span>
              <div>
                <h3 className="font-display font-medium text-white">{p.name}</h3>
                <p className="text-sm text-signal">{p.role}</p>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">{p.qualification}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <div className="glass-panel p-8 md:p-12">
          <span className="eyebrow">Fully compliant</span>
          <h2 className="font-display text-xl md:text-2xl font-semibold text-white mt-2 mb-8">
            Registered, certified, and audited
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { label: "CAC", sub: "BN 7018588" },
              { label: "SCUML", sub: "Registered" },
              { label: "PENCOM", sub: "Compliant" },
              { label: "NSITF", sub: "Cleared" },
              { label: "ITF", sub: "Compliant" },
            ].map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-2">
                <span className="grid place-items-center h-12 w-12 rounded-full bg-signal/10 text-signal">
                  <ShieldCheck size={20} />
                </span>
                <p className="font-display text-sm font-semibold text-white">{c.label}</p>
                <p className="text-xs text-white/40">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
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
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <div className="glass-panel p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left bg-water/[0.04]">
          <div>
            <span className="grid place-items-center h-11 w-11 rounded-xl bg-water/10 text-water-light mb-4 mx-auto md:mx-0">
              <Building2 size={20} />
            </span>
            <h2 className="font-display text-2xl font-semibold text-white">
              Have a project or property in mind?
            </h2>
            <p className="text-white/45 text-sm mt-2 max-w-lg">
              Talk to our team about construction, real estate, or Swan Water supply.
            </p>
          </div>
          <Link href="/book-meeting" className="btn-primary shrink-0">
            Book a meeting <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}