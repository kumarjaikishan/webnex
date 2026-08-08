import { useState } from "react";
import api from "../api/client.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contact", form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: SIMPLE INTRO & WHY WORK WITH US */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-mono font-semibold tracking-wider mb-4 uppercase">
              GET IN TOUCH
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-paper">
              Let’s talk about your project.
            </h1>
            <p className="text-mist text-sm sm:text-base leading-relaxed mt-4">
              Have a new project idea or need help building and maintaining your site? Fill out the form and we will get back to you within 24 hours.
            </p>
          </div>

          {/* WHY WORK WITH US */}
          <div className="space-y-4 pt-2">
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

          {/* QUICK HIGHLIGHT BADGES */}
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
        </div>

        {/* RIGHT COLUMN: SIMPLE CONTACT FORM */}
        <div className="lg:col-span-7">
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
                    Thank you for reaching out. We have received your message and will reply within 24 hours.
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
                      <label className="block text-xs font-semibold text-mist mb-1.5 uppercase tracking-wider">Your Name *</label>
                      <input
                        required
                        placeholder="e.g. Alex Rivers"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-xl bg-void/80 border border-edge px-4 py-3.5 focus-ring outline-none text-paper placeholder:text-mist/40 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-mist mb-1.5 uppercase tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-xl bg-void/80 border border-edge px-4 py-3.5 focus-ring outline-none text-paper placeholder:text-mist/40 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-mist mb-1.5 uppercase tracking-wider">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Website Design & Monthly Maintenance"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full rounded-xl bg-void/80 border border-edge px-4 py-3.5 focus-ring outline-none text-paper placeholder:text-mist/40 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-mist mb-1.5 uppercase tracking-wider">Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your project, goals, and any questions you have..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-xl bg-void/80 border border-edge px-4 py-3.5 focus-ring outline-none text-paper placeholder:text-mist/40 transition resize-none"
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
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
