import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLink = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? "text-paper" : "text-mist hover:text-paper"}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-void/15 backdrop-blur-md transition-all duration-300 shadow-lg">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-lg tracking-tight flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-grad-primary shadow-md flex items-center justify-center font-bold text-void text-xs">
            W
          </span>
          <span className="font-bold text-paper">
            Webnex <span className="bg-grad-primary bg-clip-text text-transparent">Labs</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/services" className={navLink}>Services</NavLink>
          <NavLink to="/pricing" className={navLink}>Pricing</NavLink>
          <NavLink to="/work" className={navLink}>Work</NavLink>
          <NavLink to="/faqs" className={navLink}>FAQs</NavLink>
          <NavLink to="/blog" className={navLink}>Blog</NavLink>
          <NavLink to="/about" className={navLink}>About</NavLink>
          <NavLink to="/contact" className={navLink}>Contact</NavLink>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/portal"}
                className="text-sm font-mono text-cyan hover:underline focus-ring rounded font-semibold"
              >
                {user.role === "admin" ? "Dashboard" : "My Portal"}
              </Link>
              <button onClick={logout} className="text-sm text-mist hover:text-paper focus-ring rounded font-medium">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline text-sm text-mist hover:text-paper focus-ring rounded font-medium">
                Client Login
              </Link>
              <Link
                to="/contact"
                className="text-sm px-4 py-2 rounded-full bg-grad-primary text-void font-semibold hover:brightness-110 transition focus-ring shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
