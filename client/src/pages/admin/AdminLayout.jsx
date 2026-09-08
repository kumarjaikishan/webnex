import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Mail, Users, FileText, FileCheck, HeartHandshake, Bell, StickyNote, Wrench, FolderGit2, Settings, ChevronDown, ChevronUp } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/inquiries", label: "Inquiries", icon: Mail },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/invoices", label: "Invoices", icon: FileText },
  { to: "/admin/contracts", label: "Agreements", icon: FileCheck },
  { to: "/admin/welcome-notes", label: "Welcome Notes", icon: HeartHandshake },
  { to: "/admin/reminders", label: "Reminders", icon: Bell },
  { to: "/admin/notes", label: "Notes & Cards", icon: StickyNote },
  { to: "/admin/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/admin/projects", label: "Portfolio", icon: FolderGit2 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentTab = navItems.find((item) => 
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  ) || navItems[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid md:grid-cols-[230px_1fr] gap-6 sm:gap-8 print:m-0 print:p-0 print:w-full print:max-w-full print:block print:border-0">
      {/* MOBILE ADMIN DROPDOWN & SCROLLABLE BAR */}
      <div className="md:hidden space-y-3 no-print">
        <div className="flex items-center justify-between bg-panel border border-edge p-3 rounded-xl">
          <div className="flex items-center gap-2.5">
            <currentTab.icon size={18} className="text-cyan" />
            <span className="font-mono text-xs font-semibold text-paper uppercase tracking-wider">
              {currentTab.label}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-void/60 border border-edge text-xs font-mono text-mist hover:text-paper transition"
          >
            <span>Navigation</span>
            {mobileMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Collapsible Mobile Menu */}
        {mobileMenuOpen && (
          <div className="grid grid-cols-2 gap-2 bg-panel border border-edge p-3 rounded-2xl animate-in fade-in slide-in-from-top-2 shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                      isActive
                        ? "bg-grad-primary text-void font-bold shadow-sm"
                        : "text-mist hover:bg-white/5 hover:text-paper"
                    }`
                  }
                >
                  <Icon size={15} />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Quick Horizontal Scroll Pills on Mobile */}
        <div className="w-full overflow-x-auto overflow-y-hidden touch-pan-x py-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={`pill-${item.to}`}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all shrink-0 select-none ${
                    isActive
                      ? "bg-cyan/15 text-cyan border border-cyan/30 font-bold shadow-sm"
                      : "bg-panel border border-edge text-mist hover:text-paper"
                  }`
                }
              >
                <Icon size={13} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:block space-y-1.5 bg-panel border border-edge p-4 rounded-2xl h-fit sticky top-24 no-print">
        <div className="px-3 pb-3 mb-2 border-b border-edge/60">
          <p className="font-mono text-xs text-cyan tracking-wider uppercase font-semibold">Webnex CRM</p>
          <p className="text-[11px] text-mist font-mono mt-0.5">Management Portal</p>
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? "bg-grad-primary text-void font-bold shadow-md"
                    : "text-mist hover:bg-white/5 hover:text-paper"
                }`
              }
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="min-w-0 w-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
