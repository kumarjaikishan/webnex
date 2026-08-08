import { useEffect, useState } from "react";
import { Phone, ArrowUp, MessageCircle } from "lucide-react";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {showTop && (
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-card transition-transform hover:-translate-y-0.5"
        >
          <ArrowUp size={18} />
        </button>
      )}
      <a
        href="tel:+91XXXXXXXXXX"
        aria-label="Call now"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-night text-white shadow-card transition-transform hover:-translate-y-0.5"
      >
        <Phone size={20} />
      </a>
      <a
        href="https://wa.me/91XXXXXXXXXX?text=Hi%20Lumix%20Digital%2C%20I%27d%20like%20a%20free%20quote%20for%20a%20website."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card transition-transform hover:-translate-y-0.5 animate-float-slow"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
