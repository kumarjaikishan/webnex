import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Menu, X } from "lucide-react";

const navLink = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? "text-paper" : "text-mist hover:text-paper"}`;

const mobileNavLink = ({ isActive }) =>
  `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all ${
    isActive
      ? "bg-cyan/15 text-cyan border border-cyan/30 font-semibold"
      : "text-mist hover:text-paper hover:bg-panel"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-void/80 backdrop-blur-md transition-all duration-300 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="font-display text-lg tracking-tight flex items-center gap-2 z-50">
          <span className="w-7 h-7 rounded-lg bg-grad-primary shadow-md flex items-center justify-center font-bold text-void text-xs">
            W
          </span>
          <span className="font-bold text-paper">
            Webnex <span className="bg-grad-primary bg-clip-text text-transparent">Labs</span>
          </span>
        </Link>

        {/* Desktop Navigation Links (Key Primary Items) */}
        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/services" className={navLink}>Services</NavLink>
          <NavLink to="/work" className={navLink}>Work</NavLink>
          <NavLink to="/pricing" className={navLink}>Pricing</NavLink>
          <NavLink to="/about" className={navLink}>About</NavLink>
        </div>

        {/* Right CTA / Auth & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                to={user.role === "admin" ? "/admin" : "/portal"}
                className="text-sm font-mono text-cyan hover:underline focus-ring rounded font-semibold"
              >
                {user.role === "admin" ? "Dashboard" : "My Portal"}
              </Link>
              <button onClick={logout} className="text-sm text-mist hover:text-paper focus-ring rounded font-medium">
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden sm:inline text-sm text-mist hover:text-paper focus-ring rounded font-medium">
                Client Login
              </Link>
              <Link
                to="/contact"
                className="text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-grad-primary text-void font-semibold hover:brightness-110 transition focus-ring shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-panel border border-edge text-mist hover:text-paper focus-ring transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay & Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-void/95 backdrop-blur-xl border-b border-edge/80 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 max-h-[calc(100vh-4rem)] overflow-y-auto z-40">
          <div className="p-5 space-y-2">
            <NavLink to="/services" className={mobileNavLink}>Services</NavLink>
            <NavLink to="/work" className={mobileNavLink}>Work</NavLink>
            <NavLink to="/pricing" className={mobileNavLink}>Pricing</NavLink>
            <NavLink to="/about" className={mobileNavLink}>About</NavLink>
            <NavLink to="/contact" className={mobileNavLink}>Contact Us</NavLink>

            <div className="pt-4 mt-2 border-t border-edge/60 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    to={user.role === "admin" ? "/admin" : "/portal"}
                    className="flex items-center justify-center px-4 py-3 rounded-xl bg-cyan/15 border border-cyan/30 text-cyan font-mono font-semibold"
                  >
                    {user.role === "admin" ? "Open Admin Dashboard" : "Open Client Portal"}
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full py-2.5 rounded-xl border border-edge text-mist hover:text-paper font-medium text-sm transition"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center px-4 py-3 rounded-xl border border-edge text-paper font-medium bg-panel/60"
                >
                  Client Portal Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
