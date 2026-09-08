import { Link } from "react-router-dom";

export default function InvoiceCard({ invoice, onStatusChange, onDelete }) {
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
    <div className="bg-panel border border-edge rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-edge/80 transition">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-cyan">{invoice.invoiceNumber}</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono ${getStatusColor(invoice.status)}`}>
            {invoice.status}
          </span>
        </div>
        <h3 className="font-medium text-paper">{invoice.clientName} ({invoice.clientEmail})</h3>
        <p className="text-xs text-mist">{invoice.projectTitle} • Issued: {invoice.issueDate} • Due: {invoice.dueDate}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-mono text-lg font-bold text-paper">₹{invoice.totalAmount?.toLocaleString()}</p>
          <p className="text-xs text-mist">{invoice.items?.length || 0} line item(s)</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/invoices/${invoice.id}`}
            className="px-3 py-1.5 rounded-lg border border-edge text-xs hover:bg-white/5 transition font-semibold text-cyan flex items-center gap-1"
          >
            <span>📄</span> View Invoice
          </Link>
          {invoice.status !== "Paid" && (
            <button
              type="button"
              onClick={() => onStatusChange(invoice.id, "Paid")}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/30 transition"
            >
              Mark Paid
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(invoice.id)}
            className="p-1.5 text-mist hover:text-rose-400 text-xs transition"
            title="Delete invoice"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
