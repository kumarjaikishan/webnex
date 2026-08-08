import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Send } from "lucide-react";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="section-pad relative overflow-hidden bg-night text-white">
      <div className="pointer-events-none absolute inset-0 bg-glow-radial" />
      <div className="container-lx relative text-center">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold md:text-[44px]">
          Ready to Build a Website That Actually Grows Your Business?
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-body text-white/60">
          Get a free quote today — no obligation, no pressure. Just a clear plan for your project.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link to="/contact" className="btn-primary">
            Get Free Quote <ArrowRight size={16} />
          </Link>
          <Link to="/contact" className="btn-ghost-dark">
            Book Free Consultation
          </Link>
        </div>

        <div className="mx-auto mt-16 max-w-md border-t border-white/10 pt-10">
          <p className="font-ui text-sm font-semibold text-white/70">
            Subscribe for web design tips & business growth insights
          </p>
          {subscribed ? (
            <p className="mt-4 font-body text-sm text-accent">You're subscribed — thank you!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 font-body text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient">
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
