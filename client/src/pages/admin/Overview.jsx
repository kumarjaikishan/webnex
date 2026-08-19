import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import StatCard from "../../components/StatCard.jsx";

export default function Overview() {
  const [clients, setClients] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    api.get("/clients").then((r) => setClients(r.data));
    api.get("/reminders").then((r) => setReminders(r.data));
    api.get("/maintenance").then((r) => setMaintenance(r.data));
    api.get("/contact").then((r) => setInquiries(r.data || [])).catch(() => {});
  }, []);

  const openReminders = reminders.filter((r) => !r.done);
  const mrr = maintenance.reduce((sum, m) => sum + Number(m.amount || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-10">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-paper mb-1 sm:mb-2">Overview</h1>
        <p className="text-xs font-mono text-mist">System metrics, recent inquiries, and active reminders.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Active clients" value={clients.length} />
        <StatCard label="New Inquiries" value={inquiries.length} accent="text-cyan" />
        <StatCard label="Open reminders" value={openReminders.length} accent="text-cyan" />
        <StatCard label="Maintenance revenue" value={`₹${mrr.toLocaleString()}`} accent="text-cyan" />
      </div>

      {/* Recent Inquiries List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-paper">Recent Form Submissions</h2>
          <Link to="/admin/inquiries" className="font-mono text-xs text-cyan hover:underline">
            View All ({inquiries.length}) →
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
        <h2 className="font-display text-xl font-bold text-paper mb-4">Upcoming Reminders</h2>
        <div className="rounded-2xl border border-edge bg-panel divide-y divide-edge">
          {openReminders.slice(0, 6).map((r) => {
            const client = clients.find((c) => c.id === r.clientId);
            return (
              <div key={r.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm">{r.title}</p>
                  <p className="font-mono text-xs text-mist">{client?.name || "Unknown client"}</p>
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
