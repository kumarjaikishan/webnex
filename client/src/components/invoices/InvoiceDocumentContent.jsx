import React, { forwardRef } from "react";
import DocumentCard from "../DocumentCard.jsx";
import { CheckCircle } from "lucide-react";

export function getUpiQrUrl(upiId, payeeName, amount, invoiceNumber) {
  if (!upiId) return "";
  const cleanUpi = upiId.trim();
  const cleanName = encodeURIComponent((payeeName || "Webnex Labs").trim());
  const cleanTxnNote = encodeURIComponent(`Invoice ${invoiceNumber || ""}`.trim());
  const cleanAmount = Number(amount) > 0 ? Number(amount).toFixed(2) : "";

  let upiString = `upi://pay?pa=${cleanUpi}&pn=${cleanName}&tn=${cleanTxnNote}&cu=INR`;
  if (cleanAmount && Number(cleanAmount) > 0) {
    upiString += `&am=${cleanAmount}`;
  }

  const encodedUpiString = encodeURIComponent(upiString);
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=4&data=${encodedUpiString}&format=png`;
}

const InvoiceDocumentContent = forwardRef(function InvoiceDocumentContent(
  { invoice, bankSettings, onDownloadingChange, showCardActions = false, isPage = true },
  ref
) {
  if (!invoice) return null;

  const pd = invoice.paymentDetails || bankSettings || {
    beneficiaryName: "Jai Kishan Kumar (Webnex Labs)",
    upiId: "8210539367@jio",
    bankName: "Jio Payment Bank",
    accountNumber: "8210539367",
    ifscCode: "JIOP0000001",
  };

  const discountAmount = Number(invoice.discount) || 0;
  const rawRemaining = Number(invoice.balanceDue ?? (invoice.totalAmount - (invoice.amountPaid || 0) - discountAmount));
  const remainingDue = Math.max(0, rawRemaining);
  const isFullySettled = invoice.status === "Paid" || remainingDue === 0;

  return (
    <DocumentCard
      ref={ref}
      onDownloadingChange={onDownloadingChange}
      docType="INVOICE"
      docNumber={invoice.invoiceNumber}
      date={invoice.issueDate}
      secondaryDate={invoice.dueDate}
      secondaryDateLabel="Due Date"
      clientName={invoice.clientName}
      clientEmail={invoice.clientEmail}
      projectTitle={invoice.projectTitle}
      status={invoice.status}
      notes={invoice.notes}
      isPage={isPage}
      showCardActions={showCardActions}
    >
      {/* TWO-TONE TABLE: Gold ITEM DESCRIPTION + Slate Dark Headers */}
      <div className="overflow-hidden rounded-lg border border-gray-200 mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="font-mono text-xs font-bold">
              <th className="py-2.5 px-4 bg-[#f5b842] text-gray-950 tracking-wider uppercase">
                ITEM DESCRIPTION
              </th>
              <th className="py-2.5 px-3 bg-[#262832] text-white text-right tracking-wider uppercase">
                PRICE
              </th>
              <th className="py-2.5 px-3 bg-[#262832] text-white text-center tracking-wider uppercase">
                QTY
              </th>
              <th className="py-2.5 px-4 bg-[#262832] text-white text-right tracking-wider uppercase">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-sans">
            {(invoice.items || []).map((it, idx) => {
              const subText =
                it.subDescription !== undefined
                  ? it.subDescription
                  : it.subtitle !== undefined
                  ? it.subtitle
                  : "Bespoke software engineering & digital implementation";
              return (
                <tr key={idx} className={idx % 2 === 1 ? "bg-gray-50/60" : "bg-white"}>
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    <p className="font-semibold text-sm text-gray-900">{it.description}</p>
                    {subText && (
                      <p className="text-[11px] text-gray-500 font-normal mt-0.5">
                        {subText}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-800 font-mono">
                    ₹{Number(it.price || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center text-gray-800 font-mono">
                    {it.quantity || 1}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-gray-950">
                    ₹{(Number(it.quantity || 1) * Number(it.price || 0)).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAYMENT INFO & GOLDEN GRAND TOTAL BANNER */}
      <div className="flex flex-col sm:flex-row items-end justify-between gap-4 pt-4 border-t border-gray-200">
        <div className="text-xs font-mono space-y-1 text-left">
          <p className="font-bold uppercase text-gray-900 tracking-wider text-[11px]">PAYMENT INFO</p>
          <p className="text-gray-500">Method: Direct UPI / IMPS Settlement</p>
          <p className="text-gray-500">
            Status: {isFullySettled ? "Payment Received (Settled)" : invoice.status === "Partially Paid" ? "Partially Paid" : "Payment Due Upon Receipt"}
          </p>
        </div>

        <div className="w-full sm:w-80 text-right text-xs">
          <div className="space-y-1.5 pb-2">
            <div className="flex justify-between px-2">
              <span className="font-mono text-gray-500">Sub Total</span>
              <span className="font-mono font-semibold text-gray-900">
                ₹{invoice.subtotal?.toLocaleString()}
              </span>
            </div>
            {invoice.taxPercent > 0 && (
              <div className="flex justify-between px-2">
                <span className="font-mono text-gray-500">Tax Vat ({invoice.taxPercent}%)</span>
                <span className="font-mono font-semibold text-gray-900">
                  ₹{(invoice.subtotal * (invoice.taxPercent / 100)).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Golden Yellow Grand Total Banner */}
          <div
            className="bg-[#f5b842] text-gray-950 rounded font-mono font-black shadow-sm"
            style={{
              marginTop: "6px",
              marginBottom: "0px",
              padding: "0 16px",
              height: "44px",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
            }}
          >
            <span
              className="uppercase text-xs font-bold text-gray-950 tracking-wider"
              style={{
                lineHeight: "44px",
                height: "44px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              GRAND TOTAL
            </span>
            <span
              className="text-base text-gray-950 font-black"
              style={{
                lineHeight: "44px",
                height: "44px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              ₹{invoice.totalAmount?.toLocaleString()}
            </span>
          </div>

          {/* Settlement Concession, Payments Received & Remaining Balance breakdown */}
          <div className="space-y-1.5 pt-3 border-t border-gray-200 mt-2">
            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between px-2 text-xs font-mono">
                <span className="text-gray-600">
                  Settlement Concession / Off
                  {invoice.discountReason ? ` (${invoice.discountReason})` : ""}
                </span>
                <span className="font-semibold text-cyan-700">
                  -₹{Number(invoice.discount).toLocaleString()}
                </span>
              </div>
            )}

            {(Number(invoice.amountPaid) > 0 || (invoice.payments && invoice.payments.length > 0)) && (
              <div className="flex justify-between px-2 text-xs font-mono">
                <span className="text-gray-600">
                  Amount Received ({invoice.payments?.length || 1} payment{(invoice.payments?.length || 1) === 1 ? "" : "s"})
                </span>
                <span className="font-semibold text-emerald-700">
                  ₹{Number(invoice.amountPaid || 0).toLocaleString()}
                </span>
              </div>
            )}

            <div className={`flex justify-between px-2 pt-2 border-t border-dashed border-gray-300 font-mono font-bold text-xs ${
              isFullySettled ? "text-emerald-700" : "text-amber-700"
            }`}>
              <span className="uppercase tracking-wider">
                {isFullySettled ? "Balance Due" : "Remaining Balance Due"}
              </span>
              <span className="text-sm">
                {isFullySettled ? "₹0.00 (PAID IN FULL)" : `₹${remainingDue.toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT INSTALLMENTS RECEIVED TABLE */}
      {Array.isArray(invoice.payments) && invoice.payments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="font-mono text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-2">
            PAYMENT INSTALLMENTS RECEIVED
          </p>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 font-mono text-[10px] text-gray-700 uppercase">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3">Transaction Ref / Note</th>
                  <th className="py-2.5 px-3 text-right">Amount Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-mono text-xs">
                {invoice.payments.map((p, idx) => (
                  <tr key={p.id || idx} className="bg-white">
                    <td className="py-2.5 px-3 text-gray-800">{p.date}</td>
                    <td className="py-2.5 px-3 text-gray-600">{p.method || "UPI"}</td>
                    <td className="py-2.5 px-3 text-gray-500 font-sans text-[11px]">
                      {p.reference || p.note ? (
                        <>
                          {p.reference && <strong className="font-mono text-gray-800">{p.reference} </strong>}
                          {p.note && <span>({p.note})</span>}
                        </>
                      ) : (
                        <span className="font-mono text-gray-400">
                          {String(p.method || "").toLowerCase().includes("cash") ? "-" : "N/A"}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      +₹{Number(p.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BANK SETTLEMENT & DYNAMIC SCAN-TO-PAY UPI QR CODE */}
      <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50/20 backdrop-blur-[2px] p-4 rounded-xl border border-gray-200/60">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          {/* Bank Details */}
          <div className="space-y-1.5 text-xs flex-1">
            <div className="flex items-center gap-1.5 text-gray-900 font-bold font-mono text-xs uppercase tracking-wider mb-2">
              <span>🏛️ Bank & Settlement Instructions</span>
            </div>
            <table className="font-mono text-[11px] text-gray-700 w-full max-w-sm">
              <tbody>
                <tr>
                  <td className="text-gray-900 font-semibold py-0.5 pr-2 whitespace-nowrap">A/c Holder</td>
                  <td className="text-gray-500 px-1">:</td>
                  <td className="text-gray-900 font-medium py-0.5">{pd.beneficiaryName}</td>
                </tr>
                <tr>
                  <td className="text-gray-900 font-semibold py-0.5 pr-2 whitespace-nowrap">Bank</td>
                  <td className="text-gray-500 px-1">:</td>
                  <td className="text-gray-900 font-medium py-0.5">{pd.bankName}</td>
                </tr>
                <tr>
                  <td className="text-gray-900 font-semibold py-0.5 pr-2 whitespace-nowrap">A/c No.</td>
                  <td className="text-gray-500 px-1">:</td>
                  <td className="text-gray-900 font-medium py-0.5">{pd.accountNumber}</td>
                </tr>
                <tr>
                  <td className="text-gray-900 font-semibold py-0.5 pr-2 whitespace-nowrap">IFSC</td>
                  <td className="text-gray-500 px-1">:</td>
                  <td className="text-gray-900 font-medium py-0.5">{pd.ifscCode}</td>
                </tr>
                {pd.upiId && (
                  <tr>
                    <td className="text-gray-900 font-semibold py-0.5 pr-2 whitespace-nowrap">UPI ID</td>
                    <td className="text-gray-500 px-1">:</td>
                    <td className="text-gray-900 font-medium py-0.5 flex items-center gap-1">
                      <span>{pd.upiId}</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* UPI QR Code Container or PAID IN FULL Stamp */}
          {isFullySettled ? (
            <div className="flex flex-col items-center justify-center text-center bg-emerald-50/80 p-4 rounded-2xl shadow-sm border border-emerald-300 shrink-0 w-[190px] h-[190px]">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 shadow-inner">
                <CheckCircle size={28} />
              </div>
              <span className="font-mono text-xs text-emerald-900 font-black tracking-wider uppercase">
                PAID IN FULL
              </span>
              <span className="font-mono text-[11px] text-emerald-700 font-bold mt-1">
                ₹{Number(invoice.totalAmount).toLocaleString()} Settled
              </span>
              {Number(invoice.discount) > 0 && (
                <span className="font-mono text-[9px] text-cyan-800 mt-1">
                  (₹{Number(invoice.discount).toLocaleString()} concession discount)
                </span>
              )}
            </div>
          ) : pd.upiId ? (
            <div className="flex flex-col items-center text-center bg-white p-3 rounded-2xl shadow-md border border-gray-200 shrink-0 max-w-[190px]">
              <div className="relative">
                <img
                  src={getUpiQrUrl(
                    pd.upiId,
                    pd.beneficiaryName,
                    remainingDue,
                    invoice.invoiceNumber
                  )}
                  alt="Scan to Pay via UPI"
                  crossOrigin="anonymous"
                  className="w-32 h-32 object-contain rounded-lg"
                />
                <div className="absolute inset-0 border border-black/10 rounded-lg pointer-events-none" />
              </div>

              <span className="font-mono text-xs text-gray-900 font-bold mt-2 block w-full">
                ₹{remainingDue.toLocaleString()} Due
              </span>
              <span className="font-mono text-[10px] text-gray-700 font-medium block w-full">
                Scan to Pay Balance
              </span>
              <span className="font-mono text-[8px] text-gray-500 mt-0.5 block w-full whitespace-nowrap">
                GPay • PhonePe • Paytm • BHIM
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </DocumentCard>
  );
});

export default InvoiceDocumentContent;
