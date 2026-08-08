import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Portfolio", to: "/portfolio" },
      { label: "Case Studies", to: "/case-studies" },
      { label: "Blog", to: "/blog" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Business Websites", to: "/services" },
      { label: "School ERP", to: "/services" },
      { label: "Hospital Management", to: "/services" },
      { label: "Custom Web Apps", to: "/services" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Pricing", to: "/pricing" },
      { label: "FAQs", to: "/faqs" },
      { label: "Testimonials", to: "/testimonials" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-night text-white">
      <div className="container-lx grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-sm">L</span>
            Lumix Digital
          </Link>
          <p className="mt-4 max-w-sm font-body text-[15px] leading-relaxed text-white/60">
            Bihar Sharif's trusted web development company, helping businesses across Nalanda,
            Patna and Bihar build a powerful online presence.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Linkedin, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-primary/40 hover:text-white"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-ui text-sm font-semibold uppercase tracking-wider text-white/40">{col.title}</h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="font-body text-[15px] text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-lx flex flex-col gap-4 py-6 text-[13px] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Lumix Digital. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> Bihar Sharif, Nalanda, Bihar</span>
            <span className="flex items-center gap-1.5"><Phone size={14} /> +91-XXXXXXXXXX</span>
            <span className="flex items-center gap-1.5"><Mail size={14} /> hello@lumixdigital.in</span>
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
