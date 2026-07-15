import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MeetingBookingForm } from "@/components/forms/MeetingBookingForm";
import { STOCK_IMAGES } from "@/lib/media";

export default function BookMeetingPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0">
          <Image
            src={STOCK_IMAGES.bridgeConstruction}
            alt=""
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/90 to-ink-950" />
        </div>
        <div className="absolute inset-0 bg-mesh-emerald" />
        <div className="mx-auto max-w-3xl px-5 md:px-8 py-14 text-center relative">
          <span className="eyebrow">Talk to us</span>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mt-2">
            Book a meeting
          </h1>
          <p className="text-white/45 mt-3 text-sm max-w-lg mx-auto">
            Whether it&apos;s a property enquiry, a bulk water order, or a partnership — tell us when works
            for you.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 md:px-8 py-12">
        <MeetingBookingForm />
      </section>
      <SiteFooter />
    </div>
  );
}
