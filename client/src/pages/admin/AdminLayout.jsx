import { NavLink, Outlet } from "react-router-dom";

const link = ({ isActive }) =>
  `block px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
    isActive ? "bg-grad-primary text-void font-bold" : "text-mist hover:bg-white/5"
  }`;

export default function AdminLayout() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1 bg-panel border border-edge p-4 rounded-2xl h-fit">
        <p className="font-mono text-xs text-cyan tracking-wider px-4 mb-3 uppercase">Webnex CRM</p>
        <NavLink to="/admin" end className={link}>Overview</NavLink>
        <NavLink to="/admin/inquiries" className={link}>📩 Inquiries</NavLink>
        <NavLink to="/admin/clients" className={link}>Clients</NavLink>
        <NavLink to="/admin/invoices" className={link}>🧾 Invoices</NavLink>
        <NavLink to="/admin/contracts" className={link}>📄 Agreements</NavLink>
        <NavLink to="/admin/welcome-notes" className={link}>💌 Welcome Notes</NavLink>
        <NavLink to="/admin/reminders" className={link}>🔔 Reminders</NavLink>
        <NavLink to="/admin/notes" className={link}>📝 Notes & Cards</NavLink>
        <NavLink to="/admin/maintenance" className={link}>🛠️ Maintenance</NavLink>
        <NavLink to="/admin/projects" className={link}>🚀 Portfolio</NavLink>
        <NavLink to="/admin/settings" className={link}>⚙️ Settings</NavLink>
      </aside>
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
