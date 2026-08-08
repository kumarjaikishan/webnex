import { useEffect } from "react";
import PageHeader from "@/components/PageHeader";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms & Conditions | Lumix Digital";
  }, []);

  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" />
      <section className="section-pad bg-white">
        <div className="container-lx max-w-3xl space-y-6 font-body text-sm leading-relaxed text-ink/65">
          <p>Last updated: August 2026</p>
          <h2 className="font-display text-xl font-semibold text-ink">Services</h2>
          <p>
            Lumix Digital provides website development and custom software services as agreed
            upon in individual project proposals. Pricing shown on this website is a starting
            reference and final pricing is confirmed after project scoping.
          </p>
          <h2 className="font-display text-xl font-semibold text-ink">Payments</h2>
          <p>Payment terms are agreed upon per project and communicated before work begins.</p>
          <h2 className="font-display text-xl font-semibold text-ink">Revisions</h2>
          <p>Each plan includes a defined number of revision rounds, as outlined in your project proposal.</p>
          <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
          <p>Questions about these terms can be directed to hello@lumixdigital.in.</p>
        </div>
      </section>
    </>
  );
}
