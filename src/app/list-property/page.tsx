import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ListPropertyForm } from "@/components/forms/ListPropertyForm";

export default function ListPropertyPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <SiteHeader />
      <section className="bg-mesh-emerald border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-5 md:px-8 py-14 text-center">
          <span className="eyebrow">Sell or rent through us</span>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mt-2">
            List your property
          </h1>
          <p className="text-white/45 mt-3 text-sm max-w-lg mx-auto">
            Submit your property for verification. Once approved, our agents market it on your behalf —
            you only need to accept our standard agent commission on the sale.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 md:px-8 py-12">
        <ListPropertyForm />
      </section>

      <SiteFooter />
    </div>
  );
}
