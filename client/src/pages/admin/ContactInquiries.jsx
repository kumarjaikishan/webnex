import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, Building, MessageSquare, Trash2, CheckCircle2 } from "lucide-react";
import api from "../../api/client.js";
import GearboxLoader from "../../components/GearboxLoader.jsx";

export default function ContactInquiries() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-paper">📩 Contact Inquiries</h1>
          <p className="text-xs font-mono text-mist mt-1">
            View all messages and project quotes submitted by visitors on your website.
          </p>
        </div>
        <span className="font-mono text-xs text-cyan bg-cyan/10 border border-cyan/30 px-3 py-1 rounded-full font-semibold">
          Total: {messages.length} Inquiry{messages.length === 1 ? "" : "ies"}
        </span>
      </div>

      {loading ? (
        <GearboxLoader label="Loading contact inquiries..." />
      ) : messages.length === 0 ? (
        <div className="p-12 text-center space-y-3 border border-edge rounded-2xl bg-panel/50">
          <MessageSquare size={36} className="mx-auto text-mist/40" />
          <h3 className="font-display text-lg font-semibold text-paper">No Inquiries Yet</h3>
          <p className="text-mist text-xs max-w-sm mx-auto">
            When visitors fill out the contact form on your website, their entries will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-2xl border border-edge bg-panel/80 p-6 backdrop-blur shadow-xl space-y-4 hover:border-cyan/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-edge/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center font-bold text-cyan font-display text-sm">
                    {msg.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-paper">{msg.name}</h3>
                    <p className="font-mono text-[11px] text-cyan">{msg.subject || "Project Inquiry"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-mist">
                  <Calendar size={13} className="text-cyan/70" />
                  {msg.receivedAt
                    ? new Date(msg.receivedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "Recently"}
                </div>
              </div>

              {/* Metadata Details Bar */}
              <div className="grid gap-3 sm:grid-cols-3 font-mono text-xs text-mist bg-void/50 p-3 rounded-xl border border-edge/50">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-cyan shrink-0" />
                  <span className="text-paper select-all">{msg.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail size={14} className="text-cyan shrink-0" />
                  <span className="text-paper select-all truncate">{msg.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building size={14} className="text-cyan shrink-0" />
                  <span className="text-paper">{msg.businessType || "Not Specified"}</span>
                </div>
              </div>

              {/* Message Content */}
              {msg.message && (
                <div className="text-sm leading-relaxed text-mist pt-1">
                  <p className="text-xs font-mono text-mist/60 uppercase mb-1 font-semibold">Message:</p>
                  <p className="bg-panel/40 p-4 rounded-xl border border-edge/40 text-paper whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
