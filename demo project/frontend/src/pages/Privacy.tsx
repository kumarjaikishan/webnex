import { useEffect } from "react";
import PageHeader from "@/components/PageHeader";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy | Lumix Digital";
  }, []);

  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <section className="section-pad bg-white">
        <div className="container-lx max-w-3xl space-y-6 font-body text-sm leading-relaxed text-ink/65">
          <p>Last updated: August 2026</p>
          <p>
            Lumix Digital ("we", "us") respects your privacy. This policy explains what
            information we collect through this website and how we use it.
          </p>
          <h2 className="font-display text-xl font-semibold text-ink">Information We Collect</h2>
          <p>
            When you submit a contact form or request a quote, we collect your name, phone
            number, email address, and any details you share about your project.
          </p>
          <h2 className="font-display text-xl font-semibold text-ink">How We Use Your Information</h2>
          <p>
            We use this information solely to respond to your inquiry, provide quotes, and
            communicate about your project. We do not sell your information to third parties.
          </p>
          <h2 className="font-display text-xl font-semibold text-ink">Contact Us</h2>
          <p>For any privacy-related questions, email us at hello@lumixdigital.in.</p>
        </div>
      </section>
    </>
  );
}
