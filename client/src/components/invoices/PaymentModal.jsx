import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Calendar, Trash2, CheckCircle, Clock, Percent, PlusCircle, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import api from "../../api/client.js";
import { toast } from "sonner";
import { useConfirm } from "../../context/ConfirmContext.jsx";

export default function PaymentModal({
  isOpen,
  invoice,
  onClose,
  onPaymentUpdated,
}) {
  const confirm = useConfirm();
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [submittingSettlement, setSubmittingSettlement] = useState(false);

  // Installment form state
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const paymentDateRef = useRef(null);

  // Settlement / Discount state
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountReason, setDiscountReason] = useState("Full & final settlement concession");

  useEffect(() => {
    if (invoice) {
      const remaining = Number(invoice.balanceDue) || 0;
      setPaymentAmount(remaining > 0 ? String(remaining) : "");
      setDiscountAmount(invoice.discount ? String(invoice.discount) : "");
      setDiscountReason(invoice.discountReason || "Full & final settlement concession");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setPaymentRef("");
      setPaymentNote("");
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const total = Number(invoice.totalAmount) || 0;
  const paid = Number(invoice.amountPaid) || 0;
  const discount = Number(invoice.discount) || 0;
  const balance = Number(invoice.balanceDue) !== undefined ? Number(invoice.balanceDue) : Math.max(0, total - paid - discount);
  const payments = Array.isArray(invoice.payments) ? invoice.payments : [];

  const paidPercent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
  const discountPercent = total > 0 ? Math.min(100 - paidPercent, Math.round((discount / total) * 100)) : 0;

  async function handleAddPayment(e) {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid payment amount greater than 0.");
      return;
    }

    setSubmittingPayment(true);
    try {
      const res = await api.post(`/invoices/${invoice.id}/payments`, {
        amount: amt,
        date: paymentDate,
        method: paymentMethod,
        reference: paymentRef,
        note: paymentNote,
      });

      toast.success(`Payment of ₹${amt.toLocaleString()} recorded successfully!`);
      if (onPaymentUpdated) onPaymentUpdated(res.data);
      // Reset installment input to remaining
      const newBal = Number(res.data?.balanceDue) || 0;
      setPaymentAmount(newBal > 0 ? String(newBal) : "");
      setPaymentRef("");
      setPaymentNote("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to record payment.");
    } finally {
      setSubmittingPayment(false);
    }
  }

  async function handleDeletePayment(paymentId, amt) {
    const ok = await confirm({
      title: "Remove Payment Record",
      message: `Are you sure you want to remove this payment installment of ₹${Number(amt).toLocaleString()}? The balance due will be updated.`,
      confirmText: "Remove Payment",
      variant: "danger",
    });
    if (!ok) return;

    try {
      const res = await api.delete(`/invoices/${invoice.id}/payments/${paymentId}`);
      toast.success("Payment installment removed.");
      if (onPaymentUpdated) onPaymentUpdated(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete payment.");
    }
  }

  async function handleApplySettlement(e) {
    if (e) e.preventDefault();
    const disc = parseFloat(discountAmount);
    if (isNaN(disc) || disc < 0) {
      toast.error("Please enter a valid concession/discount amount.");
      return;
    }

    setSubmittingSettlement(true);
    try {
      const res = await api.post(`/invoices/${invoice.id}/settle`, {
        discount: disc,
        discountReason: discountReason.trim() || "Full & final settlement concession",
      });

      toast.success(`Settlement concession of ₹${disc.toLocaleString()} updated!`);
      if (onPaymentUpdated) onPaymentUpdated(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update settlement discount.");
    } finally {
      setSubmittingSettlement(false);
    }
  }

  async function handleSettleRemainingAsDiscount() {
    if (balance <= 0) return;
    const ok = await confirm({
      title: "Full & Final Settlement Concession",
      message: `Client deposited ₹${paid.toLocaleString()} against total ₹${total.toLocaleString()}. Would you like to record the remaining balance of ₹${balance.toLocaleString()} as a Settlement Concession / Discount and mark this invoice as Paid in Full?`,
      confirmText: `Settle as Discount (₹${balance.toLocaleString()})`,
      variant: "primary",
    });
    if (!ok) return;

    setSubmittingSettlement(true);
    try {
      const res = await api.post(`/invoices/${invoice.id}/settle`, {
        settleBalance: true,
        discountReason: discountReason.trim() || "Full & final settlement concession",
      });

      toast.success(`Invoice settled! ₹${balance.toLocaleString()} applied as concession.`);
      if (onPaymentUpdated) onPaymentUpdated(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to settle invoice.");
    } finally {
      setSubmittingSettlement(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-void/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden rounded-2xl bg-panel border border-edge border-t-2 border-t-cyan shadow-2xl p-5 sm:p-6 space-y-5 text-paper">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-edge/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan font-bold bg-cyan/10 px-2 py-0.5 rounded border border-cyan/25">
                Payments & Settlement Ledger
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                invoice.status === "Paid"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : invoice.status === "Partially Paid"
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  : "bg-rose-500/15 text-rose-400 border-rose-500/30"
              }`}>
                {invoice.status}
              </span>
            </div>
            <h2 className="font-display text-lg font-bold text-paper mt-1">
              {invoice.invoiceNumber} • {invoice.clientName}
            </h2>
            <p className="text-xs text-mist font-mono">
              {invoice.projectTitle} • Issued: {invoice.issueDate}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-mist hover:text-paper hover:bg-white/5 transition"
          >
            ✕
          </button>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-void/70 border border-edge">
            <span className="text-[10px] font-mono text-mist uppercase tracking-wider block">Total Billed</span>
            <p className="text-sm sm:text-base font-bold font-mono text-paper mt-0.5">₹{total.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-void/70 border border-emerald-500/20">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Total Received</span>
            <p className="text-sm sm:text-base font-bold font-mono text-emerald-400 mt-0.5">₹{paid.toLocaleString()}</p>
            <span className="text-[10px] font-mono text-mist block">{payments.length} installment{payments.length === 1 ? "" : "s"}</span>
          </div>
          <div className="p-3 rounded-xl bg-void/70 border border-cyan/20">
            <span className="text-[10px] font-mono text-cyan uppercase tracking-wider block">Concession / Off</span>
            <p className="text-sm sm:text-base font-bold font-mono text-cyan mt-0.5">₹{discount.toLocaleString()}</p>
            <span className="text-[10px] font-mono text-mist block">{discount > 0 ? "Settlement discount" : "None"}</span>
          </div>
          <div className={`p-3 rounded-xl bg-void/70 border ${balance > 0 ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`}>
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${balance > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {balance > 0 ? "Balance Pending" : "Status"}
            </span>
            <p className={`text-sm sm:text-base font-bold font-mono mt-0.5 ${balance > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {balance > 0 ? `₹${balance.toLocaleString()}` : "₹0 (Fully Settled)"}
            </p>
          </div>
        </div>

        {/* Payment Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-mist">
            <span>Progress: {paidPercent}% Paid {discountPercent > 0 ? `+ ${discountPercent}% Concession` : ""}</span>
            <span className={balance === 0 ? "text-emerald-400 font-semibold" : "text-amber-400"}>
              {balance === 0 ? "✓ Settle in Full" : `₹${balance.toLocaleString()} Due`}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-void/90 border border-edge overflow-hidden flex">
            {paidPercent > 0 && (
              <div style={{ width: `${paidPercent}%` }} className="bg-emerald-400 h-full transition-all duration-300" title={`Paid: ₹${paid}`} />
            )}
            {discountPercent > 0 && (
              <div style={{ width: `${discountPercent}%` }} className="bg-cyan h-full transition-all duration-300" title={`Concession: ₹${discount}`} />
            )}
          </div>
        </div>

        {/* 1. Record Installment Section */}
        <div className="p-4 rounded-xl bg-void/50 border border-edge space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-paper flex items-center gap-1.5">
              <PlusCircle size={14} className="text-cyan" /> Record Payment Installment
            </h3>
            {balance > 0 && (
              <button
                type="button"
                onClick={() => setPaymentAmount(String(balance))}
                className="text-[11px] font-mono text-cyan hover:underline"
              >
                Fill Remaining (₹{balance.toLocaleString()})
              </button>
            )}
          </div>

          <form onSubmit={handleAddPayment} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-mist uppercase mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="e.g. 1500"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-xs font-mono focus-ring outline-none text-paper"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-mist uppercase mb-1">Payment Date *</label>
                <div className="relative flex items-center">
                  <input
                    ref={paymentDateRef}
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="date-input-custom w-full rounded-xl bg-void border border-edge pl-3 pr-9 py-2 text-xs font-mono focus-ring outline-none text-paper [color-scheme:dark]"
                  />
                  <button
                    type="button"
                    onClick={() => paymentDateRef.current?.showPicker ? paymentDateRef.current.showPicker() : paymentDateRef.current?.focus()}
                    className="absolute right-2 p-1 text-mist hover:text-cyan transition-colors rounded-lg cursor-pointer"
                    title="Choose date"
                    tabIndex={-1}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-mist uppercase mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-xs font-mono focus-ring outline-none text-paper"
                >
                  <option value="UPI">Direct UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (IMPS / NEFT)</option>
                  <option value="Cash">Cash Deposit</option>
                  <option value="Card">Card Payment</option>
                  <option value="Cheque">Cheque Deposit</option>
                  <option value="Other">Other Mode</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-mist uppercase mb-1">UTR / Transaction Ref (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. UPI/418291038 or IMPS-8921"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-xs font-mono focus-ring outline-none text-paper"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-mist uppercase mb-1">Installment Note / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Installment 1 of 3 (Advance)"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-xs font-mono focus-ring outline-none text-paper"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={submittingPayment}
                className="px-4 py-2 rounded-xl bg-grad-primary text-void font-bold text-xs hover:brightness-110 shadow transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <PlusCircle size={13} />
                <span>{submittingPayment ? "Recording..." : "Record Payment Installment"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Full & Final Settlement / Concession Discount Section */}
        <div className="p-4 rounded-xl bg-void/50 border border-edge space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-paper flex items-center gap-1.5">
                <Percent size={14} className="text-cyan" /> Full & Final Settlement Concession / Discount
              </h3>
              <p className="text-[11px] text-mist mt-0.5">
                If the client paid a negotiated lump-sum (e.g. deposited ₹4,200 for a ₹4,500 invoice), record the ₹300 difference here as a settlement discount so the balance is ₹0.
              </p>
            </div>
          </div>

          {/* 1-click shortcut if balance remaining */}
          {balance > 0 && paid > 0 && (
            <div className="p-3 rounded-xl bg-cyan/10 border border-cyan/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-semibold text-paper block">1-Click Full & Final Settlement</span>
                <span className="text-mist text-[11px]">
                  Client paid ₹{paid.toLocaleString()}. Waive remaining ₹{balance.toLocaleString()} as settlement concession to close invoice.
                </span>
              </div>
              <button
                type="button"
                disabled={submittingSettlement}
                onClick={handleSettleRemainingAsDiscount}
                className="px-3.5 py-1.5 rounded-lg bg-cyan text-void font-mono font-bold text-xs hover:brightness-110 transition shrink-0 shadow-sm disabled:opacity-50"
              >
                {submittingSettlement ? "Settling..." : `⚡ Waive ₹${balance.toLocaleString()} & Settle Full`}
              </button>
            </div>
          )}

          <form onSubmit={handleApplySettlement} className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-3 items-end">
            <div>
              <label className="block text-[10px] font-mono text-mist uppercase mb-1">Concession Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 300"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-xs font-mono focus-ring outline-none text-paper"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-mist uppercase mb-1">Concession Reason / Remark</label>
              <input
                type="text"
                placeholder="Full & final settlement concession"
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-xs font-mono focus-ring outline-none text-paper"
              />
            </div>
            <button
              type="submit"
              disabled={submittingSettlement}
              className="px-4 py-2 rounded-xl bg-panel border border-edge text-paper hover:bg-white/5 hover:border-cyan/40 text-xs font-semibold transition disabled:opacity-50"
            >
              Save Discount
            </button>
          </form>
        </div>

        {/* 3. Installments History Log */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-paper flex items-center gap-1.5">
              <Clock size={14} className="text-cyan" /> Payment Installments Log ({payments.length})
            </h3>
            {payments.length > 0 && (
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                Total Received: ₹{paid.toLocaleString()}
              </span>
            )}
          </div>

          {payments.length === 0 ? (
            <div className="p-4 rounded-xl bg-void/40 border border-edge text-center text-xs text-mist">
              No individual installment payments recorded yet. Use the form above to record payments made on different dates.
            </div>
          ) : (
            <div className="rounded-xl border border-edge bg-void/50 divide-y divide-edge overflow-hidden">
              {payments.map((p, idx) => (
                <div key={p.id || idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-cyan/15 text-cyan font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-semibold text-paper">{p.date}</span>
                        <span className="px-2 py-0.5 rounded-full bg-void border border-edge font-mono text-[10px] text-mist">
                          {p.method || "UPI"}
                        </span>
                        {p.reference && (
                          <span className="font-mono text-[10px] text-cyan/90 truncate">
                            Ref: {p.reference}
                          </span>
                        )}
                      </div>
                      {p.note && <p className="text-[11px] text-mist truncate mt-0.5">{p.note}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-bold text-sm text-emerald-400">
                      +₹{Number(p.amount).toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeletePayment(p.id, p.amount)}
                      title="Delete payment record"
                      className="p-1 rounded text-mist hover:text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-edge">
          <div className="text-xs font-mono text-mist">
            {balance <= 0 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle size={14} /> Invoice is 100% Settled & Marked as Paid
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <Clock size={14} /> ₹{balance.toLocaleString()} remaining pending
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-panel border border-edge text-paper hover:bg-white/5 text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
