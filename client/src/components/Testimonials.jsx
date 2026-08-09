import { useEffect, useState, useRef } from "react";

const testimonials = [
  {
    name: "Priya Nair",
    role: "Founder, Aster Bakery",
    rating: 5,
    avatar: "PN",
    quote: "Our new site loads instantly and online orders doubled in the first month. Every update since launch has been handled promptly without chasing anyone!",
    // Glass Sticky
    glassStyle: "bg-amber-400/10 border border-amber-400/30 text-amber-200 -rotate-1",
    glassPin: "bg-amber-400/40",
    // Opaque Paper Sticky with Soft Pastel Gradient & Deep Dark Amber Ink Text
    paperStyle: "bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border border-amber-300/80 text-[#451A03] shadow-[4px_8px_22px_rgba(0,0,0,0.25)] -rotate-2",
    paperPin: "bg-amber-50/90",
    avatarBg: "bg-[#451A03] text-amber-100",
  },
  {
    name: "Daniel Cho",
    role: "Ops Lead, Northline Logistics",
    rating: 5,
    avatar: "DC",
    quote: "We replaced three chaotic spreadsheets with one streamlined Webnex dashboard. The handoff was clean and technical support has been lightning fast.",
    glassStyle: "bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 rotate-2",
    glassPin: "bg-cyan-400/40",
    // Deep Dark Cyan Ink Text (#042F2E)
    paperStyle: "bg-gradient-to-br from-[#ECFEFF] via-[#CFFAFE] to-[#A5F3FC] border border-cyan-300/80 text-[#042F2E] shadow-[4px_8px_22px_rgba(0,0,0,0.25)] rotate-2",
    paperPin: "bg-cyan-50/90",
    avatarBg: "bg-[#042F2E] text-cyan-100",
  },
  {
    name: "Maya Torres",
    role: "Founder, Fable & Co",
    rating: 5,
    avatar: "MT",
    quote: "Clear contract, transparent timeline, and zero surprise charges. Webnex Labs is the kind of engineering studio you build a long-term partnership with.",
    glassStyle: "bg-purple-400/10 border border-purple-400/30 text-purple-200 -rotate-2",
    glassPin: "bg-purple-400/40",
    // Deep Dark Purple Ink Text (#3B0764)
    paperStyle: "bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF] border border-purple-300/80 text-[#3B0764] shadow-[4px_8px_22px_rgba(0,0,0,0.25)] -rotate-1",
    paperPin: "bg-purple-50/90",
    avatarBg: "bg-[#3B0764] text-purple-100",
  },
  {
    name: "Vikram Sharma",
    role: "Tech Lead, Nexus Fintech",
    rating: 5,
    avatar: "VS",
    quote: "The software architecture is top-tier. Clean code, rock-solid security, and sensible structure that easily handles 50,000 monthly active users.",
    glassStyle: "bg-emerald-400/10 border border-emerald-400/30 text-emerald-200 rotate-1",
    glassPin: "bg-emerald-400/40",
    // Deep Dark Emerald Ink Text (#022C22)
    paperStyle: "bg-gradient-to-br from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0] border border-emerald-300/80 text-[#022C22] shadow-[4px_8px_22px_rgba(0,0,0,0.25)] rotate-1",
    paperPin: "bg-emerald-50/90",
    avatarBg: "bg-[#022C22] text-emerald-100",
  },
  {
    name: "Sophia Chen",
    role: "Director, Horizon Properties",
    rating: 5,
    avatar: "SC",
    quote: "The automated EMI and maintenance tracking system completely transformed our client billing operations. Saved us over 20 hours every month!",
    glassStyle: "bg-pink-400/10 border border-pink-400/30 text-pink-200 -rotate-1",
    glassPin: "bg-pink-400/40",
    // Deep Dark Pink Ink Text (#500724)
    paperStyle: "bg-gradient-to-br from-[#FDF2F8] via-[#FCE7F3] to-[#FBCFE8] border border-pink-300/80 text-[#500724] shadow-[4px_8px_22px_rgba(0,0,0,0.25)] -rotate-2",
    paperPin: "bg-pink-50/90",
    avatarBg: "bg-[#500724] text-pink-100",
  },
  {
    name: "Elena Rostova",
    role: "CEO, Velox Media",
    rating: 5,
    avatar: "ER",
    quote: "Webnex Labs delivered our full web platform 10 days ahead of deadline. Extremely professional, responsive, and detail-oriented engineering team.",
    glassStyle: "bg-indigo-400/10 border border-indigo-400/30 text-indigo-200 rotate-2",
    glassPin: "bg-indigo-400/40",
    // Deep Dark Indigo Ink Text (#1E1B4B)
    paperStyle: "bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#C7D2FE] border border-indigo-300/80 text-[#1E1B4B] shadow-[4px_8px_22px_rgba(0,0,0,0.25)] rotate-2",
    paperPin: "bg-indigo-50/90",
    avatarBg: "bg-[#1E1B4B] text-indigo-100",
  },
];

const totalOriginal = testimonials.length;
const SLIDE_MS = 3500;
const TRANSITION_MS = 700;

// Duplicate items so the track can scroll seamlessly past the end
// and land back on clones of the first cards before snapping to index 0.
const extendedTestimonials = [...testimonials, ...testimonials];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  // Change default card style theme here: "opaquePaper" | "glassSticky" | "darkGlass"
  const [cardStyle, setCardStyle] = useState("opaquePaper"); 
  const timerRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  // Autoplay: always move forward seamlessly
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, SLIDE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  // Seamless endless loop reset logic
  useEffect(() => {
    if (currentIndex === totalOriginal) {
      resetTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, TRANSITION_MS);
    } else {
      setIsTransitioning(true);
    }

    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalOriginal - 1));
  };

  const goToSlide = (i) => {
    setIsTransitioning(true);
    setCurrentIndex(i);
  };

  const activeDot = currentIndex % totalOriginal;

  return (
    <div
      className="space-y-6 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >

      {/* SLIDING HORIZONTAL TRACK CONTAINER */}
      <div className="overflow-hidden w-full py-4">
        <div
          className={`flex gap-8 ease-[cubic-bezier(0.16,1,0.3,1)] ${isTransitioning ? "transition-transform duration-700" : ""
            }`}
          style={{
            transform: `translateX(-${currentIndex * (100 / 3)}%)`,
          }}
        >
          {extendedTestimonials.map((t, idx) => {
            if (cardStyle === "opaquePaper") {
              return (
                /* THEME 1: OPAQUE PAPER STICKY NOTE CARD WITH SOFT PASTEL GRADIENT */
                <div
                  key={`paper-${t.name}-${idx}`}
                  className={`w-full md:w-[calc((100%-64px)/3)] flex-shrink-0 rounded-md p-6 sm:p-5 flex flex-col justify-between space-y-5 transition-all duration-500 relative overflow-hidden group hover:scale-[1.03] hover:rotate-0 hover:z-20 ${t.paperStyle}`}
                >
                  {/* REALISTIC LIGHTING HIGHLIGHT & CORNER LIFT (NO BLACK OVERLAYS) */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-current opacity-10" />
                  <div className="pointer-events-none absolute bottom-0 right-0 w-10 h-10 bg-current opacity-10 [clip-path:polygon(100%_0,0_100%,100%_100%)]" />

                  {/* REALISTIC 3D PUSHPIN IN TOP CENTER */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center pointer-events-none">
                    <div className="relative flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-700 via-rose-500 to-rose-400 border-2 border-white/90 shadow-[0_4px_8px_rgba(0,0,0,0.35)] flex items-center justify-center -rotate-12">
                        <div className="w-2 h-2 rounded-full bg-white/80" />
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-3 pt-4">
                    {/* RATING */}
                    <div className="flex gap-1 text-amber-600 text-md">
                      {Array.from({ length: t.rating }).map((_, r) => (
                        <span key={r}>★</span>
                      ))}
                    </div>

                    {/* HANDWRITTEN REVIEW QUOTE */}
                    <p className="font-handwriting text-lg md:text-xl font-bold leading-snug tracking-wide text-current">
                      “{t.quote}”
                    </p>
                  </div>

                  {/* STICKY NOTE AUTHOR FOOTER */}
                  <div className="relative z-10 flex items-center gap-3 pt-3 border-t border-current/20">
                    <div className={`w-9 h-9 rounded-full ${t.avatarBg} flex items-center justify-center font-display text-xs font-bold shadow-md`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-current">{t.name}</p>
                      <p className="font-mono text-[11px] text-current opacity-80 font-medium">{t.role}</p>
                    </div>
                  </div>
                </div>
              );
            } else if (cardStyle === "glassSticky") {
              return (
                /* THEME 2: GLASS STICKY NOTE CARD (CLEAN WITHOUT GLOW SHADOW) */
                <div
                  key={`glass-${t.name}-${idx}`}
                  className={`w-full md:w-[calc((100%-64px)/3)] flex-shrink-0 border rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all duration-500 relative overflow-hidden group hover:scale-[1.02] hover:rotate-0 hover:z-20 backdrop-blur-md ${t.glassStyle}`}
                >
                  <div className="relative z-10 space-y-3 pt-2">
                    {/* RATING */}
                    <div className="flex gap-1 text-amber-400 text-xs">
                      {Array.from({ length: t.rating }).map((_, r) => (
                        <span key={r}>★</span>
                      ))}
                    </div>

                    {/* HANDWRITTEN REVIEW QUOTE */}
                    <p className="font-handwriting text-xl md:text-2xl font-bold leading-snug tracking-wide text-paper">
                      “{t.quote}”
                    </p>
                  </div>

                  {/* AUTHOR FOOTER */}
                  <div className="relative z-10 flex items-center gap-3 pt-3 border-t border-white/10">
                    <div className="w-9 h-9 rounded-full bg-void/80 border border-white/10 flex items-center justify-center font-display text-xs text-paper font-bold shadow-md">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-paper">{t.name}</p>
                      <p className="font-mono text-[11px] text-mist">{t.role}</p>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                /* THEME 3: DARK GLASSMORPHISM CARD */
                <div
                  key={`dark-${t.name}-${idx}`}
                  className="w-full md:w-[calc((100%-64px)/3)] flex-shrink-0 bg-panel border border-edge rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-cyan/40 transition-all duration-500 shadow-xl relative overflow-hidden group hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-aurora opacity-40 pointer-events-none group-hover:opacity-70 transition" />

                  <div className="relative z-10 space-y-4">
                    {/* RATING */}
                    <div className="flex gap-1 text-amber-400 text-sm">
                      {Array.from({ length: t.rating }).map((_, r) => (
                        <span key={r}>★</span>
                      ))}
                    </div>

                    {/* QUOTE */}
                    <p className="text-paper text-sm leading-relaxed italic">
                      “{t.quote}”
                    </p>
                  </div>

                  {/* AUTHOR FOOTER */}
                  <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-edge/60">
                    <div className="w-10 h-10 rounded-full bg-grad-primary flex items-center justify-center font-display text-xs text-void font-bold shadow-md">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-paper">{t.name}</p>
                      <p className="font-mono text-[11px] text-mist">{t.role}</p>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center justify-between pt-2">
        {/* DOTS */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 focus-ring ${i === activeDot ? "w-8 bg-cyan" : "w-2 bg-edge hover:bg-mist/50"
                }`}
            />
          ))}
        </div>

        {/* ARROWS */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full border border-edge bg-panel flex items-center justify-center text-mist hover:text-paper hover:border-cyan/50 transition focus-ring"
            aria-label="Previous testimonials"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full border border-edge bg-panel flex items-center justify-center text-mist hover:text-paper hover:border-cyan/50 transition focus-ring"
            aria-label="Next testimonials"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
