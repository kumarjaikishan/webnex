import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client.js";
import ScrollReveal from "../components/ScrollReveal.jsx";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    businessType: "",
    message: ""
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handlePhoneChange = (e) => {
    // Keep only digits and restrict to max 10 characters
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, phone: digitsOnly }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.", {
        position: "bottom-right",
        theme: "dark"
      });
      return;
    }

    setStatus("sending");
    try {
      await api.post("/contact", form);
      setStatus("sent");
      toast.success("🚀 Inquiry submitted successfully! We will contact you soon.", {
        position: "bottom-right",
        theme: "dark"
      });
      setForm({ name: "", phone: "", email: "", businessType: "", message: "" });
    } catch (err) {
      setStatus("error");
      toast.error("Failed to send inquiry. Please try again.", {
        position: "bottom-right",
        theme: "dark"
      });
    }
  }

  return (
    <div className="pt-8 pb-24">
      {/* TOP CENTERED HEADER SECTION */}
      <section className="max-w-5xl mx-auto px-6 text-center pt-12 pb-14">
        <ScrollReveal direction="up" delay={50}>
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan mb-6 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            CONTACT US
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight text-paper">
            Let's Talk About Your Project
          </h1>
          <p className="text-mist text-lg max-w-2xl mx-auto leading-relaxed">
            Fill out the form and our team will get back to you with a free quote.
          </p>
        </ScrollReveal>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: WHY WORK WITH US & HIGHLIGHT BADGES */}
          <div className="lg:col-span-5 space-y-8">
            <ScrollReveal direction="left" delay={150}>
              <div className="space-y-4">
                <h2 className="text-xs font-mono text-cyan tracking-widest uppercase font-semibold">
                  Why Work With Us
                </h2>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-panel/70 border border-edge flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan shrink-0 text-base font-bold">
                      🎯
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-paper">Fixed & Clear Pricing</h3>
                      <p className="text-xs text-mist leading-relaxed mt-0.5">
                        Clear upfront costs with zero hidden fees or surprise charges.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-panel/70 border border-edge flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-purple/10 border border-purple/30 flex items-center justify-center text-purple-400 shrink-0 text-base font-bold">
                      ⚡
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-paper">Fast & Reliable Delivery</h3>
                      <p className="text-xs text-mist leading-relaxed mt-0.5">
                        Quick turnaround with live preview links so you can test features early.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-panel/70 border border-edge flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 text-base font-bold">
                      🛠️
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-paper">Ongoing Support</h3>
                      <p className="text-xs text-mist leading-relaxed mt-0.5">
                        Monthly maintenance plans to keep your website fast, safe, and updated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* QUICK HIGHLIGHT BADGES */}
            <ScrollReveal direction="left" delay={200}>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-panel/80 border border-edge flex items-center gap-3">
                  <span className="text-xl">⚡</span>
                  <div>
                    <p className="text-xs font-semibold text-paper">Quick Reply</p>
                    <p className="text-[11px] text-mist font-mono">Within 24 hours</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-panel/80 border border-edge flex items-center gap-3">
                  <span className="text-xl">🛡️</span>
                  <div>
                    <p className="text-xs font-semibold text-paper">Private & Safe</p>
                    <p className="text-[11px] text-mist font-mono">NDA Available</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-panel/80 border border-edge flex items-center gap-3">
                  <span className="text-xl">🤝</span>
                  <div>
                    <p className="text-xs font-semibold text-paper">Direct Contact</p>
                    <p className="text-[11px] text-mist font-mono">No Sales Middlemen</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-panel/80 border border-edge flex items-center gap-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <p className="text-xs font-semibold text-paper">Clear Terms</p>
                    <p className="text-[11px] text-mist font-mono">Simple Contracts</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="right" delay={150}>
              <div className="bg-panel/90 border border-edge rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <h2 className="font-display text-2xl font-bold text-paper">
                    Send us a message
                  </h2>

                  {status === "sent" ? (
                    <div className="p-8 rounded-2xl bg-cyan/10 border border-cyan/30 text-center space-y-3 animate-fadeIn">
                      <span className="text-4xl inline-block">🎉</span>
                      <p className="text-cyan font-mono text-xl font-bold">Message Sent!</p>
                      <p className="text-mist text-sm max-w-md mx-auto">
                        Thank you for reaching out. We have received your inquiry and will reply within 24 hours.
                      </p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="mt-4 px-6 py-2 rounded-full bg-grad-primary text-void font-semibold text-xs hover:brightness-110 transition"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-mist mb-1.5 uppercase tracking-wider">
                            Full Name *
                          </label>
                          <input
                            required
                            placeholder="Your name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-xl bg-void/80 border border-edge px-4 py-3.5 focus-ring outline-none text-paper placeholder:text-mist/40 transition text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-mist mb-1.5 uppercase tracking-wider">
                            Mobile Number *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3.5 font-mono text-sm text-cyan font-semibold pointer-events-none select-none z-10">
                              +91
                            </span>
                            <input
                              required
                              type="tel"
                              maxLength={10}
                              placeholder="9876543210"
                              value={form.phone}
                              onChange={handlePhoneChange}
                              style={{ paddingLeft: "3.5rem" }}
                              className="w-full rounded-xl bg-void/80 border border-edge pr-4 py-3.5 focus-ring outline-none text-paper placeholder:text-mist/40 transition text-sm font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-mist mb-1.5 uppercase tracking-wider">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="you@business.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-xl bg-void/80 border border-edge px-4 py-3.5 focus-ring outline-none text-paper placeholder:text-mist/40 transition text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-mist mb-1.5 uppercase tracking-wider">
                          Business Type
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Restaurant, Clinic, School, Retail"
                          value={form.businessType}
                          onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                          className="w-full rounded-xl bg-void/80 border border-edge px-4 py-3.5 focus-ring outline-none text-paper placeholder:text-mist/40 transition text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-mist mb-1.5 uppercase tracking-wider">
                          Message
                        </label>
                        <textarea
                          rows={5}
                          placeholder="Tell us about your project..."
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full rounded-xl bg-void/80 border border-edge px-4 py-3.5 focus-ring outline-none text-paper placeholder:text-mist/40 transition text-sm resize-none"
                        />
                      </div>

                      {status === "error" && (
                        <p className="text-red-400 text-xs font-mono bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                          ⚠️ Something went wrong. Please try again.
                        </p>
                      )}

                      <button
                        disabled={status === "sending"}
                        className="w-full py-4 rounded-xl bg-grad-primary text-void font-bold text-sm hover:brightness-110 transition focus-ring disabled:opacity-50 shadow-xl flex items-center justify-center gap-2"
                      >
                        {status === "sending" ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-void border-t-transparent animate-spin" />
                            <span>Sending Inquiry...</span>
                          </>
                        ) : (
                          <span>Get Free Quote</span>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
