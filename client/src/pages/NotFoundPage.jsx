import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowLeft, Layers, Briefcase, Tag, Mail, Terminal, Compass } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const quickLinks = [
    {
      title: "Services & Capabilities",
      description: "Full-stack apps, system care & enterprise tools",
      href: "/services",
      icon: Layers,
    },
    {
      title: "Featured Portfolio",
      description: "Production case studies & deployed architectures",
      href: "/work",
      icon: Briefcase,
    },
    {
      title: "Pricing & Retainers",
      description: "Transparent engineering fees & care plans",
      href: "/pricing",
      icon: Tag,
    },
    {
      title: "Start a Project",
      description: "Direct technical scoping & consultations",
      href: "/contact",
      icon: Mail,
    },
  ];

  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 relative">
      <div className="w-full max-w-3xl mx-auto space-y-8 text-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          <span>HTTP 404 // ROUTE NOT FOUND</span>
        </div>

        {/* Big Display 404 */}
        <div className="space-y-3">
          <h1 className="font-display text-7xl sm:text-9xl font-black tracking-tight select-none">
            <span className="bg-gradient-to-r from-violet via-cyan to-paper bg-clip-text text-transparent">
              404
            </span>
          </h1>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper tracking-tight">
            Lost in the Digital Void
          </h2>
          <p className="font-body text-mist text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            The page or resource you requested does not exist, has been decommissioned, or was moved to an updated coordinate.
          </p>
        </div>

        {/* Telemetry / Terminal Box */}
        <div className="max-w-md mx-auto rounded-2xl bg-panel/90 border border-edge p-4 font-mono text-left text-xs shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-edge/80 text-mist">
            <Terminal size={14} className="text-cyan" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-paper">Navigation Diagnostic</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <p className="text-mist truncate">
              <span className="text-cyan">URI_PATH:</span> {location.pathname}
            </p>
            <p className="text-mist">
              <span className="text-cyan">STATUS:</span> 404_ROUTE_UNRESOLVED
            </p>
            <p className="text-mist">
              <span className="text-cyan">HOST:</span> Webnex Labs System Mesh
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-edge bg-panel text-paper hover:bg-white/5 hover:border-cyan/40 text-xs sm:text-sm font-semibold transition active:scale-[0.98] flex items-center gap-2 shadow"
          >
            <ArrowLeft size={15} className="text-mist" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-grad-primary text-void text-xs sm:text-sm font-bold hover:brightness-110 active:scale-[0.98] transition flex items-center gap-2 shadow-lg shadow-cyan/20"
          >
            <Home size={15} />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Quick Links Matrix */}
        <div className="pt-6 border-t border-edge/80">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-mist uppercase tracking-wider mb-4">
            <Compass size={13} className="text-cyan" />
            <span>Recommended Destinations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group p-4 rounded-2xl bg-panel/70 border border-edge hover:border-cyan/40 hover:bg-panel transition shadow-sm flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-void border border-edge flex items-center justify-center text-cyan group-hover:border-cyan/40 transition shrink-0">
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-paper group-hover:text-cyan transition flex items-center gap-1">
                      <span>{item.title}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
                    </p>
                    <p className="text-xs text-mist mt-0.5 truncate">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Portal Access Link */}
        <p className="text-xs font-mono text-mist pt-2">
          Looking for client workspace or management?{" "}
          <Link to="/login" className="text-cyan hover:underline font-semibold">
            Sign in to Portal →
          </Link>
        </p>
      </div>
    </main>
  );
}
