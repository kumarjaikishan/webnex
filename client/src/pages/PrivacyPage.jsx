import ScrollReveal from "../components/ScrollReveal.jsx";

export default function PrivacyPage() {
  return (
    <div className="pt-8 pb-24">
      {/* Page Header */}
      <section className="max-w-4xl mx-auto px-6 text-center pt-12 pb-12">
        <ScrollReveal direction="up" delay={50}>
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan mb-6 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            LEGAL DOCUMENT
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight text-paper">
            Privacy Policy
          </h1>
          <p className="text-mist text-sm font-mono">Last updated: August 2026</p>
        </ScrollReveal>
      </section>

      {/* Content Container */}
      <section className="max-w-3xl mx-auto px-6">
        <ScrollReveal direction="up" delay={150}>
          <div className="rounded-3xl border border-edge bg-panel/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl space-y-8 text-mist text-sm leading-relaxed">
            <p>
              Webnex Labs ("we", "us", "our") respects your privacy. This policy explains what information we collect through our website and engineering services and how we handle and protect it.
            </p>

            <div className="space-y-3">
              <h2 className="font-display text-xl font-semibold text-paper">1. Information We Collect</h2>
              <p>
                When you submit a contact form or request a project quote, we collect your name, phone number, email address, business type, and any project details you share with us.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl font-semibold text-paper">2. How We Use Your Information</h2>
              <p>
                We use this information solely to respond to your inquiries, provide tailored project proposals, execute signed milestone contracts, and communicate regarding ongoing engineering maintenance. We do not sell or rent your information to third parties.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl font-semibold text-paper">3. Data Protection & NDAs</h2>
              <p>
                We enforce strict internal access controls and offer Non-Disclosure Agreements (NDAs) for proprietary project ideas, codebase access, and client databases.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl font-semibold text-paper">4. Contact Us</h2>
              <p>
                For any privacy-related inquiries or data deletion requests, please email us directly at <span className="text-cyan font-mono">hello@webnexlabs.in</span>.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
