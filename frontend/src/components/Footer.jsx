import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-edge mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <Link to="/" className="font-display text-lg flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-md bg-grad-primary" />
            Webnex Labs
          </Link>
          <p className="text-sm text-mist">Websites that ship, and keep running.</p>
        </div>
        <div>
          <p className="font-mono text-xs text-mist tracking-widest mb-4">SERVICES</p>
          <ul className="space-y-2 text-sm text-mist">
            <li>Web development</li>
            <li>Maintenance & support</li>
            <li>Contracts & onboarding</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs text-mist tracking-widest mb-4">QUICK LINKS</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/work" className="text-mist hover:text-paper transition-colors">Work</Link></li>
            <li><Link to="/about" className="text-mist hover:text-paper transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-mist hover:text-paper transition-colors">Contact</Link></li>
            <li><Link to="/login" className="text-mist hover:text-paper transition-colors">Client Login</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs text-mist tracking-widest mb-4">GET IN TOUCH</p>
          <ul className="space-y-2 text-sm text-mist">
            <li>hello@webnexlabs.com</li>
            <li>Available for new projects</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-edge">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-mono text-xs text-mist">© {new Date().getFullYear()} Webnex Labs. All rights reserved.</p>
          <p className="font-mono text-xs text-mist">status: <span className="text-cyan">available for projects</span></p>
        </div>
      </div>
    </footer>
  );
}
