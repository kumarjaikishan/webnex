import ScrollReveal from "../components/ScrollReveal.jsx";
import { ShieldCheck, Lock, FileText, Code2, Database, Server, RefreshCw, Mail, MapPin, Phone } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="pt-8 pb-24">
      {/* Page Header */}
      <section className="max-w-4xl mx-auto px-6 text-center pt-12 pb-12">
        <ScrollReveal direction="up" delay={50}>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan mb-6 shadow-[0_0_20px_rgba(63,214,224,0.15)]">
            <ShieldCheck size={14} className="text-cyan animate-pulse" />
            OFFICIAL PRIVACY & DATA GOVERNANCE
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight text-paper">
            Privacy Policy
          </h1>
          <p className="text-mist text-sm font-mono">
            Effective Date: October 2026 &bull; Version 2.4 &bull; Webnex Labs
          </p>
        </ScrollReveal>
      </section>

      {/* Highlights Bar */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
        <ScrollReveal direction="up" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-edge/80 bg-panel/60 backdrop-blur flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-paper">Zero Data Selling</h4>
                <p className="text-xs text-mist mt-0.5">We never sell, rent, or monetize your contact or business data.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-edge/80 bg-panel/60 backdrop-blur flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan shrink-0">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-paper">Mutual NDA Ready</h4>
                <p className="text-xs text-mist mt-0.5">Full proprietary protection for your startup ideas and codebases.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-edge/80 bg-panel/60 backdrop-blur flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-paper">Strict Confidentiality</h4>
                <p className="text-xs text-mist mt-0.5">Zero unauthorized disclosures, private repo access & isolated client data.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Content Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal direction="up" delay={150}>
          <div className="rounded-3xl border border-edge bg-panel/80 p-6 sm:p-12 backdrop-blur-xl shadow-2xl space-y-10 text-mist text-sm leading-relaxed">
            
            {/* Introduction */}
            <div>
              <p className="text-base text-paper font-medium mb-3">
                Welcome to Webnex Labs ("we", "us", "our", or "Webnex").
              </p>
              <p>
                We are committed to safeguarding the privacy, confidentiality, and integrity of the personal and proprietary information entrusted to us by our visitors, prospective clients, and enterprise partners. This Privacy Policy outlines our transparent practices regarding data collection, engineering confidentiality, client intellectual property, and cybersecurity standards.
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-3 pt-4 border-t border-edge/60">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-paper flex items-center gap-2">
                <span className="text-cyan font-mono text-base">01.</span> Information We Collect
              </h2>
              <p>We collect information in two primary ways: directly from your communication and automatically when browsing our web studio.</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-mist">
                <li>
                  <strong className="text-paper">Client Inquiries & Onboarding:</strong> When you submit a quote request, discovery form, or communicate via our portal, we collect your full name, email address, telephone/WhatsApp number, company name, project requirements, budget range, and uploaded project specifications.
                </li>
                <li>
                  <strong className="text-paper">Billing & Invoicing Records:</strong> For active contracts, we record business tax IDs (such as GSTIN), billing addresses, milestone payment transaction IDs, and receipt logs. Note that sensitive card/banking details are handled directly by certified payment gateways; Webnex does not store raw credit card numbers.
                </li>
                <li>
                  <strong className="text-paper">Technical Telemetry & Analytics:</strong> Standard server logs, browser user-agent, operating system version, referring URLs, and anonymous page interaction heatmaps collected to maintain studio uptime and responsiveness.
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-3 pt-4 border-t border-edge/60">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-paper flex items-center gap-2">
                <span className="text-cyan font-mono text-base">02.</span> How We Use Your Information
              </h2>
              <p>All information collected is strictly leveraged for legitimate business and engineering operations:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-mist">
                <li>Providing customized software proposals, scope-of-work (SOW) blueprints, and engineering estimates.</li>
                <li>Executing bilateral milestone contracts, project deliveries, and issuing automated digital invoices.</li>
                <li>Granting access to the Webnex Client Portal to inspect live Kanban progress, code reviews, and milestone signoffs.</li>
                <li>Providing 24/7 technical maintenance, security vulnerability patching, and server monitoring.</li>
                <li>Complying with applicable legal, accounting, and tax compliance obligations under Indian and international law.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-3 pt-4 border-t border-edge/60">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-paper flex items-center gap-2">
                <span className="text-cyan font-mono text-base">03.</span> Proprietary Confidentiality & NDAs
              </h2>
              <p>
                We treat our clients' software blueprints, business logic, customer databases, and proprietary algorithms with institutional-grade confidentiality.
              </p>
              <p>
                Prior to receiving any confidential codebase access, API keys, or architectural wireframes, we gladly sign legally binding mutual Non-Disclosure Agreements (NDAs). All client work is developed within private, segregated repositories with access restricted strictly to verified engineers on a need-to-know basis.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3 pt-4 border-t border-edge/60">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-paper flex items-center gap-2">
                <span className="text-cyan font-mono text-base">04.</span> Data Security & Engineering Architecture
              </h2>
              <p>
                We apply defense-in-depth security principles across both our internal systems and all software applications we engineer:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-panel border border-edge/70">
                  <span className="text-xs font-mono text-cyan font-semibold block mb-1">ENCRYPTION PROTOCOLS</span>
                  <p className="text-xs text-mist">All web traffic is enforced via HTTPS with TLS 1.3 encryption. Passwords and credentials use salted Bcrypt hashing.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-panel border border-edge/70">
                  <span className="text-xs font-mono text-cyan font-semibold block mb-1">ISOLATED ENVIRONMENTS</span>
                  <p className="text-xs text-mist">Production databases and staging environments are segregated with zero cross-tenant access and environment variable protection.</p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-3 pt-4 border-t border-edge/60">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-paper flex items-center gap-2">
                <span className="text-cyan font-mono text-base">05.</span> Third-Party Service Providers
              </h2>
              <p>
                We work only with vetted, enterprise-tier cloud infrastructure providers that comply with global data safety benchmarks:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-mist">
                <li><strong className="text-paper">Cloud Infrastructure:</strong> AWS, Render, Vercel, and MongoDB Atlas.</li>
                <li><strong className="text-paper">Transactional Email:</strong> Resend, SendGrid, or secure SMTP relays.</li>
                <li><strong className="text-paper">Payment Processing:</strong> Razorpay, Stripe, and direct bank RTGS/NEFT.</li>
              </ul>
              <p className="text-xs text-mist/80 pt-1">
                These partners are bound by confidentiality contracts and are forbidden from utilizing client information for unauthorized purposes.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-3 pt-4 border-t border-edge/60">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-paper flex items-center gap-2">
                <span className="text-cyan font-mono text-base">06.</span> Your Data Rights
              </h2>
              <p>
                Regardless of your geographic location, you retain full sovereignty over your personal data:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-mist">
                <li><strong className="text-paper">Right to Access:</strong> You may request an export of all personal details associated with your profile or active contracts.</li>
                <li><strong className="text-paper">Right to Rectification:</strong> You can request corrections to any outdated company records or contact channels.</li>
                <li><strong className="text-paper">Right to Erasure ("Right to be Forgotten"):</strong> Upon conclusion of your service lifecycle, you may request complete deletion of your records from our active databases, subject to mandatory statutory tax retention requirements.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="space-y-3 pt-4 border-t border-edge/60">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-paper flex items-center gap-2">
                <span className="text-cyan font-mono text-base">07.</span> Cookies & Local Storage
              </h2>
              <p>
                Webnex Labs uses minimal first-party cookies and modern browser LocalStorage exclusively for session authentication tokens (such as client portal login status) and saving UI preferences (such as canvas animations or dark mode tokens). We do not deploy invasive third-party ad retargeting trackers.
              </p>
            </div>

            {/* Section 8 */}
            <div className="space-y-3 pt-4 border-t border-edge/60">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-paper flex items-center gap-2">
                <span className="text-cyan font-mono text-base">08.</span> Policy Updates & Notifications
              </h2>
              <p>
                We may periodically update this policy to reflect enhancements in data protection laws or changes to our software suite. Any material modifications will be accompanied by an updated effective revision date at the top of this document.
              </p>
            </div>

            {/* Section 9 */}
            <div className="space-y-4 pt-4 border-t border-edge/60">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-paper flex items-center gap-2">
                <span className="text-cyan font-mono text-base">09.</span> Contact Our Data Governance Team
              </h2>
              <p>
                If you have questions regarding this Privacy Policy, wish to execute an NDA prior to architectural discussions, or want to exercise your data rights, reach out to us:
              </p>

              <div className="p-5 rounded-2xl bg-panel border border-edge/80 space-y-2.5 font-mono text-xs text-mist">
                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-cyan" />
                  <span>Email: <a href="mailto:hello@webnexlabs.in" className="text-paper hover:text-cyan transition-colors">hello@webnexlabs.in</a></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-cyan" />
                  <span>Phone: <a href="tel:+918210539367" className="text-paper hover:text-cyan transition-colors">+91-8210539367</a></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-cyan" />
                  <span>Location: Nalanda, Bihar, India</span>
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
