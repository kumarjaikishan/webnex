import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-edge mt-24 bg-void/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Company Column */}
        <div className="md:col-span-1">
          <Link to="/" className="font-display text-lg flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-xl bg-grad-primary shadow-md flex items-center justify-center font-bold text-void text-sm">
              W
            </span>
            <span className="font-bold text-paper">
              Webnex <span className="bg-grad-primary bg-clip-text text-transparent">Labs</span>
            </span>
          </Link>
          <p className="text-sm text-mist leading-relaxed mt-4">
            Trusted web development & software engineering company, helping businesses build a powerful online presence.
          </p>

          {/* Social Icon Buttons (Instagram & GitHub) */}
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-edge bg-panel/60 text-mist transition-all duration-300 hover:border-cyan/40 hover:text-cyan hover:bg-cyan/10"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-edge bg-panel/60 text-mist transition-all duration-300 hover:border-cyan/40 hover:text-cyan hover:bg-cyan/10"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Company Column */}
        <div>
          <p className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold mb-4">COMPANY</p>
          <ul className="space-y-2.5 text-sm text-mist">
            <li><Link to="/about" className="hover:text-paper transition-colors">About</Link></li>
            <li><Link to="/work" className="hover:text-paper transition-colors">Portfolio</Link></li>
            <li><Link to="/work" className="hover:text-paper transition-colors">Case Studies</Link></li>
            <li><Link to="/blog" className="hover:text-paper transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Services Column */}
        <div>
          <p className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold mb-4">SERVICES</p>
          <ul className="space-y-2.5 text-sm text-mist">
            <li><Link to="/services" className="hover:text-paper transition-colors">Business Websites</Link></li>
            <li><Link to="/services" className="hover:text-paper transition-colors">School ERP</Link></li>
            <li><Link to="/services" className="hover:text-paper transition-colors">Hospital Management</Link></li>
            <li><Link to="/services" className="hover:text-paper transition-colors">Custom Web Apps</Link></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <p className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold mb-4">RESOURCES</p>
          <ul className="space-y-2.5 text-sm text-mist">
            <li><Link to="/pricing" className="hover:text-paper transition-colors">Pricing</Link></li>
            <li><Link to="/faqs" className="hover:text-paper transition-colors">FAQs</Link></li>
            <li><Link to="/#testimonials" className="hover:text-paper transition-colors">Testimonials</Link></li>
            <li><Link to="/contact" className="hover:text-paper transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>

      {/* BOTTOM FOOTER BAR */}
      <div className="border-t border-edge/80 bg-void/80">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-xs font-mono text-mist">
          <p>© {new Date().getFullYear()} Webnex Labs. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-mist">
            <span className="flex items-center gap-1.5 hover:text-paper transition-colors">
              <MapPin size={14} className="text-cyan shrink-0" />
              Bihar Sharif, Nalanda, Bihar
            </span>
            <span className="flex items-center gap-1.5 hover:text-paper transition-colors">
              <Phone size={14} className="text-cyan shrink-0" />
              +91-XXXXXXXXXX
            </span>
            <span className="flex items-center gap-1.5 hover:text-paper transition-colors">
              <Mail size={14} className="text-cyan shrink-0" />
              hello@webnexlabs.in
            </span>
            <Link to="/privacy-policy" className="hover:text-cyan transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cyan transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
