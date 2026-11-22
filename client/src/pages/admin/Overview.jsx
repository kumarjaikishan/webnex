import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import StatCard from "../../components/StatCard.jsx";
import { Calendar, DollarSign, Users, MessageSquare, Bell, ArrowUpRight } from "lucide-react";

export default function Overview() {
  const [clients, setClients] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [period, setPeriod] = useState("all"); // "month" | "year" | "all"

  useEffect(() => {
    Promise.all([
      api.get("/clients").then((r) => setClients(r.data || [])),
      api.get("/reminders").then((r) => setReminders(r.data || [])),
      api.get("/maintenance").then((r) => setMaintenance(r.data || [])),
      api.get("/invoices").then((r) => setInvoices(r.data || [])),
      api.get("/contact").then((r) => setInquiries(r.data || [])).catch(() => {}),
    ]);
  }, []);

  const now = new Date();
  const currentMonthStr = now.toISOString().substring(0, 7); // "YYYY-MM"
  const currentYearStr = String(now.getFullYear()); // "YYYY"

  // Filter records based on selected period
  const filteredData = useMemo(() => {
    const isDateInPeriod = (dateStr) => {
      if (!dateStr) return false;
      if (period === "all") return true;
      if (period === "month") return dateStr.startsWith(currentMonthStr);
      if (period === "year") return dateStr.startsWith(currentYearStr);
      return true;
    };

    // Filtered Invoices
    const periodInvoices = invoices.filter((inv) =>
      isDateInPeriod(inv.issueDate || inv.createdAt)
    );

    // Total Revenue Collected (from Paid / Partially Paid amounts in this period)
    const collectedRevenue = periodInvoices.reduce((sum, inv) => {
      const paid = Number(inv.amountPaid) !== undefined ? Number(inv.amountPaid) : (inv.status === "Paid" ? Number(inv.totalAmount || 0) : 0);
      return sum + (Number(paid) || 0);
    }, 0);

    // Total Maintenance Revenue Collected
    const maintenanceCollected = periodInvoices
      .filter((inv) => inv.isMaintenance || inv.projectTitle?.toLowerCase().includes("maintenance") || inv.invoiceNumber?.includes("MNT"))
      .reduce((sum, inv) => {
        const paid = Number(inv.amountPaid) !== undefined ? Number(inv.amountPaid) : (inv.status === "Paid" ? Number(inv.totalAmount || 0) : 0);
        return sum + (Number(paid) || 0);
      }, 0);

    // Pending Uncollected Revenue
    const pendingRevenue = periodInvoices.reduce((sum, inv) => {
      const due = Number(inv.balanceDue) !== undefined ? Number(inv.balanceDue) : (inv.status === "Paid" ? 0 : Number(inv.totalAmount || 0));
      return sum + (Number(due) || 0);
    }, 0);

    // Active Monthly Retainer Value (MRR) from active maintenance plans
    const activeMRR = maintenance
      .filter((m) => m.status === "active")
      .reduce((sum, m) => sum + Number(m.amount || 0), 0);

    // Filtered Inquiries
    const periodInquiries = inquiries.filter((msg) =>
      isDateInPeriod(msg.receivedAt || msg.createdAt)
    );

    // Filtered Clients (created in period or all active)
    const periodClients = period === "all"
      ? clients
      : clients.filter((c) => isDateInPeriod(c.createdAt));

    return {
      collectedRevenue,
      maintenanceCollected,
      pendingRevenue,
      activeMRR,
      invoicesCount: periodInvoices.length,
      paidInvoicesCount: periodInvoices.filter((i) => i.status === "Paid").length,
      inquiriesCount: periodInquiries.length,
      clientsCount: period === "all" ? clients.length : periodClients.length,
    };
  }, [invoices, inquiries, clients, maintenance, period, currentMonthStr, currentYearStr]);

  const openReminders = reminders.filter((r) => !r.done);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-paper mb-1">Overview & Analytics</h1>
          <p className="text-xs font-mono text-mist">
            Real-time financial metrics, actual collected revenue, and pipeline status.
          </p>
        </div>

        {/* Time Period Filter Tabs */}
        <div className="inline-flex items-center p-1 rounded-xl bg-void/80 border border-edge self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPeriod("month")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
              period === "month"
                ? "bg-cyan text-void shadow-sm"
                : "text-mist hover:text-paper"
            }`}
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => setPeriod("year")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
              period === "year"
                ? "bg-cyan text-void shadow-sm"
                : "text-mist hover:text-paper"
            }`}
          >
            This Year ({currentYearStr})
          </button>
          <button
            type="button"
            onClick={() => setPeriod("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
              period === "all"
                ? "bg-cyan text-void shadow-sm"
                : "text-mist hover:text-paper"
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Primary Financial & Core Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-edge bg-panel p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-mist uppercase tracking-wider">
              {period === "month" ? "Maintenance Paid (This Month)" : period === "year" ? "Maintenance Paid (This Year)" : "Total Maintenance Paid"}
            </span>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-cyan">
            ₹{filteredData.maintenanceCollected.toLocaleString()}
          </p>
          <p className="text-[10px] font-mono text-mist">
            Active Retainer MRR: ₹{filteredData.activeMRR.toLocaleString()}/mo
          </p>
        </div>

        <div className="rounded-2xl border border-edge bg-panel p-5 space-y-1">
          <span className="font-mono text-[11px] text-mist uppercase tracking-wider">
            Total Revenue Collected
          </span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-400">
            ₹{filteredData.collectedRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] font-mono text-mist">
            {filteredData.paidInvoicesCount} of {filteredData.invoicesCount} invoices paid
          </p>
        </div>

        <div className="rounded-2xl border border-edge bg-panel p-5 space-y-1">
          <span className="font-mono text-[11px] text-mist uppercase tracking-wider">
            Pending / Due Invoices
          </span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-amber-400">
            ₹{filteredData.pendingRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] font-mono text-mist">
            Awaiting client settlement
          </p>
        </div>

        <div className="rounded-2xl border border-edge bg-panel p-5 space-y-1">
          <span className="font-mono text-[11px] text-mist uppercase tracking-wider">
            {period === "all" ? "Active Clients" : "New Clients Added"}
          </span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-paper">
            {filteredData.clientsCount}
          </p>
          <p className="text-[10px] font-mono text-mist">
            {inquiries.length} total contact inquiries
          </p>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-void/60 border border-edge flex items-center justify-between">
          <span className="text-mist">New Inquiries ({period === "all" ? "Total" : period === "month" ? "Month" : "Year"}):</span>
          <span className="font-bold text-cyan text-sm">{filteredData.inquiriesCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-void/60 border border-edge flex items-center justify-between">
          <span className="text-mist">Open Reminders:</span>
          <span className="font-bold text-paper text-sm">{openReminders.length}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-void/60 border border-edge flex items-center justify-between col-span-2 sm:col-span-1">
          <span className="text-mist">Active Maintenance Plans:</span>
          <span className="font-bold text-emerald-400 text-sm">
            {maintenance.filter((m) => m.status === "active").length} active
          </span>
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-paper">Recent Form Submissions</h2>
          <Link to="/admin/inquiries" className="font-mono text-xs text-cyan hover:underline inline-flex items-center gap-1">
            <span>View All ({inquiries.length})</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="rounded-2xl border border-edge bg-panel divide-y divide-edge">
          {inquiries.slice(0, 4).map((msg) => (
            <div key={msg.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-paper">{msg.name} <span className="text-mist font-normal font-mono text-xs">({msg.businessType || "Inquiry"})</span></p>
                <p className="font-mono text-xs text-cyan truncate">{msg.phone || msg.email || "No contact info"}</p>
              </div>
              <span className="font-mono text-xs text-mist shrink-0">
                {msg.receivedAt ? new Date(msg.receivedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Recent"}
              </span>
            </div>
          ))}
          {inquiries.length === 0 && (
            <p className="px-5 py-6 text-sm text-mist">No contact form inquiries yet.</p>
          )}
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-paper">Upcoming Reminders</h2>
          <Link to="/admin/reminders" className="font-mono text-xs text-cyan hover:underline inline-flex items-center gap-1">
            <span>Manage Reminders</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="rounded-2xl border border-edge bg-panel divide-y divide-edge">
          {openReminders.slice(0, 6).map((r) => {
            const client = clients.find((c) => c.id === r.clientId);
            return (
              <div key={r.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="font-mono text-xs text-mist">{client?.name || "General Reminder"}</p>
                </div>
                <span className="font-mono text-xs text-cyan">{r.dueDate}</span>
              </div>
            );
          })}
          {openReminders.length === 0 && (
            <p className="px-5 py-6 text-sm text-mist">Nothing due — you're all caught up.</p>
          )}
        </div>
      </div>
    </div>
  );
}
