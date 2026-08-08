import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const DISMISS_KEY = "lx_exit_intent_dismissed";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
      }
    };
    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 backdrop-blur-sm px-4"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-xl3 bg-white p-8 shadow-glow"
          >
            <button
              aria-label="Close"
              onClick={dismiss}
              className="absolute right-5 top-5 text-ink/40 hover:text-ink"
            >
              <X size={20} />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient-soft text-primary">
              <Gift size={22} />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
              Before You Go — Get a Free Quote
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-ink/60">
              Tell us about your project and we'll get back to you with a clear quote —
              no cost, no obligation.
            </p>
            <Link to="/contact" onClick={dismiss} className="btn-primary mt-6 w-full justify-center">
              Get My Free Quote
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
