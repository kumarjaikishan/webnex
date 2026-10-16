import { Link } from "react-router-dom";
import { Puzzle, ArrowRight, Sparkles, Clock, Compass } from "lucide-react";

export default function ExtensionsPage() {
  return (
    <div className="relative min-h-[calc(100vh-16rem)] flex items-center justify-center py-16 sm:py-24">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[360px] bg-gradient-to-b from-cyan/15 via-violet-600/10 to-transparent blur-[120px]" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-panel/85 backdrop-blur-md px-4 py-1.5 font-mono text-xs text-cyan mb-8 shadow-[0_0_20px_rgba(63,214,224,0.15)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
          </span>
          WEBNEX EXTENSIONS LAB
        </div>

        {/* Main Hook Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-paper mb-6 leading-[1.1]">
          Something Powerful Is{" "}
          <span className="bg-grad-primary bg-clip-text text-transparent block mt-1.5 sm:mt-2">
            Coming Very Soon.
          </span>
        </h1>

        {/* Clear, simple English message */}
        <p className="text-mist text-base sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
          We are building a collection of useful Chrome extensions designed to make your daily work easier, faster, and more productive. Stay tuned as we roll them out!
        </p>

        {/* Simple Card Highlights */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          <div className="p-4 rounded-2xl border border-edge/80 bg-panel/60 backdrop-blur text-left">
            <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan mb-3">
              <Sparkles size={16} />
            </div>
            <h3 className="font-semibold text-paper text-sm">Useful Tools</h3>
            <p className="text-xs text-mist mt-1 leading-relaxed">
              Built to solve real day-to-day browser tasks with zero friction.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-edge/80 bg-panel/60 backdrop-blur text-left">
            <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan mb-3">
              <Clock size={16} />
            </div>
            <h3 className="font-semibold text-paper text-sm">Fast & Clean</h3>
            <p className="text-xs text-mist mt-1 leading-relaxed">
              Lightweight extensions with modern UI and no bloat.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-edge/80 bg-panel/60 backdrop-blur text-left">
            <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan mb-3">
              <Compass size={16} />
            </div>
            <h3 className="font-semibold text-paper text-sm">In Active Lab</h3>
            <p className="text-xs text-mist mt-1 leading-relaxed">
              Currently being crafted and tested by our core team.
            </p>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/work"
            className="px-6 py-3 rounded-full bg-grad-primary text-void font-semibold text-xs sm:text-sm hover:brightness-110 transition shadow-lg inline-flex items-center gap-2"
          >
            Explore Our Work
            <ArrowRight size={14} />
          </Link>

          <Link
            to="/contact"
            className="px-6 py-3 rounded-full border border-edge bg-panel/80 hover:bg-panel text-paper font-semibold text-xs sm:text-sm transition hover:border-cyan/40"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
