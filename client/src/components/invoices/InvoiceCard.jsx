import { Link } from "react-router-dom";
import { FileText, Trash2, Check } from "lucide-react";

export default function InvoiceCard({ invoice, onStatusChange, onDelete, serialNumber }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Overdue":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="bg-panel/75 backdrop-blur-xl border border-edge rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan/30 hover:bg-panel transition-all shadow-lg group">
      {/* Left: Serial Number & Invoice Info */}
      <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
        {serialNumber !== undefined && (
          <div className="w-8 h-8 rounded-xl bg-void/80 border border-edge flex items-center justify-center font-mono text-xs font-bold text-cyan shrink-0 mt-0.5 shadow-inner group-hover:border-cyan/40 transition-colors">
            {serialNumber}
          </div>
        )}

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-sm font-bold text-paper tracking-wider">
              {invoice.invoiceNumber}
            </span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-mono font-semibold ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>

          <h3 className="font-medium text-sm sm:text-base text-paper truncate">
            {invoice.clientName} <span className="text-mist text-xs font-mono font-normal">({invoice.clientEmail})</span>
          </h3>

          <p className="text-xs text-mist truncate">
            {invoice.projectTitle} • Issued: {invoice.issueDate} • Due: {invoice.dueDate}
          </p>
        </div>
      </div>

      {/* Right: Amount & Actions */}
      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pl-11 md:pl-0">
        <div className="text-left md:text-right">
          <p className="font-mono text-base sm:text-lg font-bold text-paper">
            ₹{invoice.totalAmount?.toLocaleString()}
          </p>
          <p className="text-xs text-mist font-mono">{invoice.items?.length || 0} item(s)</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/invoices/${invoice.id}`}
            className="px-3 py-1.5 rounded-xl border border-edge bg-void/60 text-xs hover:bg-white/10 hover:border-cyan/40 transition font-mono font-semibold text-cyan flex items-center gap-1.5"
          >
            <FileText size={13} />
            <span>View</span>
          </Link>

          {invoice.status !== "Paid" && (
            <button
              type="button"
              onClick={() => onStatusChange(invoice.id, "Paid")}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs hover:bg-emerald-500/25 transition font-mono font-semibold flex items-center gap-1"
            >
              <Check size={13} />
              <span>Paid</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(invoice.id)}
            className="p-2 rounded-xl border border-edge bg-void/60 text-mist hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition"
            title="Delete invoice"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
