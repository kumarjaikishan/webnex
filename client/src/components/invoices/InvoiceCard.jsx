import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Trash2, Check, Clock, Edit2, MoreVertical, Calendar } from "lucide-react";

export default function InvoiceCard({
  invoice,
  onStatusChange,
  onEdit,
  onDelete,
  serialNumber,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "Overdue":
        return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/25";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/25";
    }
  };

  return (
    <div className="bg-panel/75 backdrop-blur-xl border border-edge rounded-2xl p-4 sm:p-5 flex flex-col md:grid md:grid-cols-[40px_110px_1fr_120px_130px_130px] md:items-center gap-4 hover:border-cyan/30 hover:bg-panel transition-all shadow-lg group">
      {/* 1. Serial Number */}
      <div className="flex items-center shrink-0">
        {serialNumber !== undefined && (
          <div className="w-8 h-8 rounded-xl bg-void/80 border border-edge flex items-center justify-center font-mono text-xs font-bold text-cyan shrink-0 shadow-inner group-hover:border-cyan/40 transition-colors">
            {serialNumber}
          </div>
        )}
      </div>

      {/* 2. Generation Date Column (After Serial No.) */}
      <div className="flex md:flex-col items-baseline md:items-start gap-1 font-mono shrink-0">
        <span className="text-[10px] text-mist/60 uppercase md:hidden">Date:</span>
        <span className="text-xs font-semibold text-paper font-mono flex items-center gap-1">
          <Calendar size={12} className="text-cyan hidden md:inline shrink-0" />
          <span>{invoice.issueDate || "N/A"}</span>
        </span>
        {invoice.dueDate && (
          <span className="text-[10px] text-mist/70 font-mono">
            due: {invoice.dueDate}
          </span>
        )}
      </div>

      {/* 3. Invoice Number & Client / Project Details */}
      <div className="space-y-0.5 min-w-0">
        <span className="font-mono text-sm font-bold text-paper tracking-wider block">
          {invoice.invoiceNumber}
        </span>

        <h3 className="font-medium text-sm text-paper truncate">
          {invoice.clientName}
        </h3>

        <p className="text-xs text-mist truncate">
          {invoice.projectTitle}
        </p>
      </div>

      {/* 4. Dedicated Status Column (Different Column) */}
      <div className="flex items-center md:justify-center shrink-0">
        <span
          className={`text-[11px] px-3 py-1 rounded-full border font-mono font-semibold flex items-center gap-1.5 ${getStatusColor(
            invoice.status
          )}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${invoice.status === "Paid"
              ? "bg-emerald-400"
              : invoice.status === "Pending"
                ? "bg-amber-400 animate-pulse"
                : "bg-rose-400"
              }`}
          />
          <span>{invoice.status}</span>
        </span>
      </div>

      {/* 5. Amount Column */}
      <div className="text-left md:text-right shrink-0">
        <p className="font-mono text-base font-bold text-paper">
          ₹{invoice.totalAmount?.toLocaleString()}
        </p>
      </div>

      {/* 6. Actions Column */}
      <div className="flex items-center justify-end gap-2 shrink-0 relative">
        {/* View Invoice Button */}
        <Link
          to={`/admin/invoices/${invoice.id}`}
          className="px-3 py-1.5 rounded-xl border border-edge bg-void/60 text-xs hover:bg-white/10 hover:border-cyan/40 transition font-mono font-semibold text-cyan flex items-center gap-1.5"
        >
          <FileText size={13} />
          <span>View</span>
        </Link>

        {/* 3 Vertical Dots Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            title="More options (Mark Paid, Edit, Delete)"
            className={`p-2 rounded-xl border transition flex items-center justify-center ${menuOpen
              ? "bg-cyan/20 border-cyan text-cyan shadow-sm"
              : "border-edge bg-void/60 text-mist hover:text-paper hover:border-cyan/40 hover:bg-white/5"
              }`}
          >
            <MoreVertical size={15} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-[#0c0d15] border border-white/10 shadow-2xl py-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 divide-y divide-white/5">
              <div className="py-1">
                {/* Option 1: Mark Paid / Pending */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onStatusChange(invoice.id, invoice.status === "Paid" ? "Pending" : "Paid");
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-mono flex items-center gap-2.5 transition ${invoice.status === "Paid"
                    ? "text-amber-400 hover:bg-amber-500/10"
                    : "text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                >
                  {invoice.status === "Paid" ? (
                    <>
                      <Clock size={14} className="shrink-0" />
                      <span>Mark as Pending</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} className="shrink-0" />
                      <span>Mark as Paid</span>
                    </>
                  )}
                </button>

                {/* Option 2: Edit Invoice */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    if (onEdit) onEdit(invoice);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-mono text-paper/90 hover:text-cyan hover:bg-cyan/10 flex items-center gap-2.5 transition"
                >
                  <Edit2 size={14} className="shrink-0" />
                  <span>Edit Invoice</span>
                </button>
              </div>

              {/* Option 3: Delete Invoice */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(invoice.id);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-mono text-rose-400/90 hover:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition"
                >
                  <Trash2 size={14} className="shrink-0" />
                  <span>Delete Invoice</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
