import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, Building, MessageSquare, Trash2, CheckCircle2, MessageCircle, ChevronDown, ChevronUp, Clock, Check, Sparkles } from "lucide-react";
import api from "../../api/client.js";
import { toast } from "react-toastify";
import GearboxLoader from "../../components/GearboxLoader.jsx";

export default function ContactInquiries() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null); // Track which inquiry is expanded

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/contact");
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load contact messages", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleStatusUpdate = async (id, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/contact/${id}`, { status: newStatus });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      const labels = {
        new: "New Lead",
        contacted: "Contacted",
        converted: "Converted (Won)",
        archived: "Archived",
      };
      toast.success(`Inquiry marked as: ${labels[newStatus] || newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id, name, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete inquiry from ${name || "this client"}?`)) {
      return;
    }
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (expandedId === id) setExpandedId(null);
      toast.success("Inquiry deleted successfully");
    } catch (err) {
      toast.error("Failed to delete inquiry");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "converted":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "contacted":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "archived":
        return "bg-mist/10 text-mist border-mist/20";
      case "new":
      default:
        return "bg-cyan/15 text-cyan border-cyan/40";
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "all") return true;
    const s = m.status || "new";
    return s === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-paper flex items-center gap-2">
            <span>📩</span> Contact Inquiries & Leads
          </h1>
          <p className="text-xs font-mono text-mist mt-1">
            Click any inquiry row to expand and view full message & contact details.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-void p-1 rounded-xl border border-edge">
          {["all", "new", "contacted", "converted", "archived"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition ${
                filter === f
                  ? "bg-cyan/15 text-cyan border border-cyan/40 font-bold"
                  : "text-mist hover:text-paper"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <GearboxLoader label="Loading contact inquiries..." />
      ) : filteredMessages.length === 0 ? (
        <div className="p-12 text-center space-y-3 border border-edge rounded-2xl bg-panel/50">
          <MessageSquare size={36} className="mx-auto text-mist/40" />
          <h3 className="font-display text-lg font-semibold text-paper">No Inquiries Found</h3>
          <p className="text-mist text-xs max-w-sm mx-auto">
            {filter === "all"
              ? "When visitors fill out the contact form on your website, their entries will appear here instantly."
              : `No inquiries matching the "${filter}" filter.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const isExpanded = expandedId === msg.id;
            const currentStatus = msg.status || "new";
            const cleanPhone = (msg.phone || "").replace(/[^0-9]/g, "");

            return (
              <div
                key={msg.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-lg ${
                  isExpanded
                    ? "bg-panel border-cyan/50 shadow-cyan/5 ring-1 ring-cyan/30"
                    : "bg-panel/80 border-edge hover:border-edge/90 hover:bg-panel"
                }`}
              >
                {/* COMPACT SUMMARY BAR (Always Visible / Click to Expand) */}
                <div
                  onClick={() => toggleExpand(msg.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-10 w-10 shrink-0 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center font-bold text-cyan font-display text-sm">
                      {msg.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display text-base font-bold text-paper truncate">{msg.name}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-semibold shrink-0 ${getStatusBadge(currentStatus)}`}>
                          {currentStatus}
                        </span>
                        {msg.businessType && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-void border border-edge text-mist hidden md:inline">
                            {msg.businessType}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-cyan truncate mt-0.5">
                        {msg.subject || "Project Inquiry"}
                        <span className="text-mist text-[11px] font-sans font-normal ml-2">
                          — {msg.message ? (msg.message.length > 65 ? `${msg.message.slice(0, 65)}…` : msg.message) : "No message text"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions & Chevron Button */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Status Changer Select */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 bg-void px-2.5 py-1 rounded-xl border border-edge"
                    >
                      <span className="text-[10px] font-mono text-mist uppercase">Status:</span>
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusUpdate(msg.id, e.target.value, e)}
                        className="bg-transparent font-mono text-xs text-paper focus:outline-none cursor-pointer uppercase font-semibold"
                      >
                        <option value="new" className="bg-void text-paper">NEW LEAD</option>
                        <option value="contacted" className="bg-void text-paper">CONTACTED</option>
                        <option value="converted" className="bg-void text-paper">CONVERTED (WON)</option>
                        <option value="archived" className="bg-void text-paper">ARCHIVED</option>
                      </select>
                    </div>

                    {/* Quick WhatsApp */}
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}?text=${encodeURIComponent(`Hello ${msg.name}, thank you for reaching out to Webnex Labs!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition text-xs flex items-center gap-1 font-mono"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle size={14} />
                      </a>
                    )}

                    {/* Quick Email */}
                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Project Inquiry - Webnex Labs")}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-cyan/10 text-cyan border border-cyan/30 hover:bg-cyan/20 transition text-xs flex items-center gap-1 font-mono"
                        title="Reply via Email"
                      >
                        <Mail size={14} />
                      </a>
                    )}

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(msg.id, msg.name, e)}
                      className="p-2 rounded-xl border border-edge text-mist hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition"
                      title="Delete Inquiry"
                    >
                      <Trash2 size={15} />
                    </button>

                    {/* Expand/Collapse Chevron Icon */}
                    <button
                      type="button"
                      className="p-1.5 rounded-xl text-mist hover:text-paper"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp size={18} className="text-cyan" /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE BODY (Revealed when clicked) */}
                {isExpanded && (
                  <div className="p-5 pt-0 space-y-4 border-t border-edge/60 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Metadata Details Grid */}
                    <div className="grid gap-3 sm:grid-cols-3 font-mono text-xs text-mist bg-void/60 p-3.5 rounded-xl border border-edge/50 mt-3">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-cyan shrink-0" />
                        <div>
                          <p className="text-[10px] text-mist/60 uppercase">Phone / WhatsApp</p>
                          <span className="text-paper font-semibold select-all">{msg.phone || "Not Provided"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Mail size={14} className="text-cyan shrink-0" />
                        <div className="truncate">
                          <p className="text-[10px] text-mist/60 uppercase">Email Address</p>
                          <span className="text-paper font-semibold select-all truncate">{msg.email || "Not Provided"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building size={14} className="text-cyan shrink-0" />
                        <div>
                          <p className="text-[10px] text-mist/60 uppercase">Business Category</p>
                          <span className="text-paper font-semibold">{msg.businessType || "General Web Project"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Full Message Text Box */}
                    {msg.message && (
                      <div className="text-sm leading-relaxed text-mist">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-mono text-cyan uppercase font-bold flex items-center gap-1.5">
                            <MessageSquare size={13} /> Full Project Description & Requirements:
                          </p>
                          <span className="font-mono text-[11px] text-mist/60 flex items-center gap-1">
                            <Calendar size={12} />
                            Received:{" "}
                            {msg.receivedAt
                              ? new Date(msg.receivedAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Recently"}
                          </span>
                        </div>
                        <div className="bg-void p-4 rounded-xl border border-edge text-paper whitespace-pre-wrap font-sans text-sm leading-relaxed shadow-inner">
                          {msg.message}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
