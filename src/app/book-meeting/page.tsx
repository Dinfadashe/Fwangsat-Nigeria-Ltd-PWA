import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MeetingBookingForm } from "@/components/forms/MeetingBookingForm";

export default function BookMeetingPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <SiteHeader />
      <section className="bg-mesh-emerald border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-5 md:px-8 py-14 text-center">
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
