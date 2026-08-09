import ScrollReveal from "../components/ScrollReveal.jsx";

export default function TermsPage() {
  return (
    <div className="pt-8 pb-24">
      {/* Page Header */}
      <section className="max-w-4xl mx-auto px-6 text-center pt-12 pb-12">
        <ScrollReveal direction="up" delay={50}>
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan mb-6 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            LEGAL TERMS
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight text-paper">
            Terms & Conditions
          </h1>
          <p className="text-mist text-sm font-mono">Last updated: August 2026</p>
        </ScrollReveal>
      </section>

      {/* Content Container */}
      <section className="max-w-3xl mx-auto px-6">
        <ScrollReveal direction="up" delay={150}>
          <div className="rounded-3xl border border-edge bg-panel/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl space-y-8 text-mist text-sm leading-relaxed">
            <div className="space-y-3">
              <h2 className="font-display text-1xl font-semibold text-paper">1. Services & Proposals</h2>
              <p>
                Webnex Labs provides software engineering, web application development, and ongoing maintenance services as defined in individual project proposals. Starting prices listed on this site serve as references; final quotes are confirmed after technical scoping.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-1xl font-semibold text-paper">2. Payments & Milestones</h2>
              <p>
                Payment terms are structured on a milestone basis per project agreement. Development phases commence upon receipt of agreed initial deposits.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-1xl font-semibold text-paper">3. Revision Policy</h2>
              <p>
                Each project plan includes a dedicated number of revision cycles specified during initial scoping. Additional feature requests beyond agreed scopes will be quoted separately.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-1xl font-semibold text-paper">4. Code Ownership & Hosting</h2>
              <p>
                Upon final payment completion, full intellectual property and codebase ownership are transferred to the client, along with hosting credentials and configuration documentation.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-1xl font-semibold text-paper">5. Contact Information</h2>
              <p>
                Questions regarding our terms should be directed to <span className="text-cyan font-mono">hello@webnexlabs.in</span>.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
