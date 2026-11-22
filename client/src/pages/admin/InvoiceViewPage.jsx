import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Landmark } from "lucide-react";
import api from "../../api/client.js";
import DocumentCard from "../../components/DocumentCard.jsx";
import GearboxLoader from "../../components/GearboxLoader.jsx";

export default function InvoiceViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const docCardRef = React.useRef(null);

  // Bank & settlement details fallback from settings
  const [bankSettings, setBankSettings] = useState({
    beneficiaryName: "Jai Kishan Kumar (Webnex Labs)",
    upiId: "8210539367@fam",
    bankName: "State Bank of India",
    accountNumber: "39001234567",
    ifscCode: "SBIN0001234",
  });

  useEffect(() => {
    // 1. Fetch invoice
    api
      .get(`/invoices/${id}`)
      .then((res) => {
        setInvoice(res.data);
      })
      .catch((err) => {
        console.error("Failed to load invoice", err);
        setError("Invoice not found or inaccessible.");
      })
      .finally(() => setLoading(false));

    // 2. Fetch admin settings for payment info
    api
      .get("/settings")
      .then((res) => {
        if (res.data) {
          const pd = res.data.paymentDetails || {};
          setBankSettings({
            beneficiaryName: pd.beneficiaryName || res.data.paymentBeneficiary || res.data.soleProprietorName || "Jai Kishan Kumar (Webnex Labs)",
            upiId: pd.upiId || res.data.paymentUpiId || "8210539367@fam",
            bankName: pd.bankName || res.data.paymentBankName || "State Bank of India",
            accountNumber: pd.accountNumber || res.data.paymentAccountNumber || "39001234567",
            ifscCode: pd.ifscCode || res.data.paymentIfsc || "SBIN0001234",
          });
        }
      })
      .catch(() => {});
  }, [id]);

  const getUpiQrUrl = (upiIdVal, nameVal, amountVal, invoiceNumVal) => {
    const cleanUpi = encodeURIComponent(upiIdVal?.trim() || "8210539367@fam");
    const cleanName = encodeURIComponent(nameVal?.trim() || "Webnex Labs");
    const cleanAmount = Number(amountVal || 0).toFixed(2);
    const cleanNote = encodeURIComponent(`Invoice ${invoiceNumVal || "Webnex"}`);
    const upiString = `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${cleanAmount}&cu=INR&tn=${cleanNote}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiString)}&margin=1`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <GearboxLoader label="Loading invoice..." />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-panel border border-edge rounded-2xl text-center space-y-4">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-xl font-bold text-paper">Invoice Not Found</h2>
        <p className="text-mist text-sm">{error || "The requested invoice does not exist."}</p>
        <Link
          to="/admin/invoices"
          className="inline-block px-5 py-2.5 rounded-xl bg-grad-primary text-void font-bold text-sm"
        >
          ← Back to Invoices
        </Link>
      </div>
    );
  }

  // Prefer invoice-specific paymentDetails if explicitly customized, otherwise fall back to latest saved bankSettings
  const pd = {
    ...bankSettings,
    ...(invoice.paymentDetails || {}),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 print:p-0 print:m-0 print:max-w-full print:w-full print:space-y-0">
      {/* Top Breadcrumb & Action Bar (Hidden during Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={() => navigate("/admin/invoices")}
          className="flex items-center gap-2 text-sm text-mist hover:text-paper font-mono transition"
        >
          <span>←</span> Back to Invoices
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-mist">
            Status: <strong className="text-paper uppercase">{invoice.status}</strong>
          </span>
          <button
            type="button"
            disabled={downloadingPdf}
            onClick={() => {
              if (docCardRef.current?.downloadPdf) {
                docCardRef.current.downloadPdf();
              } else {
                const directBtn = document.querySelector(".printable-document-actions button");
                if (directBtn) directBtn.click();
              }
            }}
            className="px-4 py-2 rounded-xl bg-grad-primary text-void font-bold text-xs shadow hover:brightness-110 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>{downloadingPdf ? "⏳" : "📥"}</span>
            <span>{downloadingPdf ? "Generating PDF..." : "Download PDF"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-panel border border-edge text-paper hover:bg-white/5 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <span>🖨️</span> Print
          </button>
        </div>
      </div>

      {/* Full Dedicated Invoice Document Card */}
      <DocumentCard
        ref={docCardRef}
        onDownloadingChange={setDownloadingPdf}
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
        isPage={true}
        showCardActions={false}
        onPrint={() => window.print()}
        onClose={() => navigate("/admin/invoices")}
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
              {(invoice.items || []).map((it, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? "bg-gray-50/60" : "bg-white"}>
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    <p className="font-semibold text-sm text-gray-900">{it.description}</p>
                    <p className="text-[11px] text-gray-500 font-normal mt-0.5">
                      Bespoke software engineering & digital implementation
                    </p>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* PAYMENT INFO & GOLDEN GRAND TOTAL BANNER */}
        <div className="flex flex-col sm:flex-row items-end justify-between gap-4 pt-4 border-t border-gray-200">
          <div className="text-xs font-mono space-y-1 text-left">
            <p className="font-bold uppercase text-gray-900 tracking-wider text-[11px]">PAYMENT INFO</p>
            <p className="text-gray-500">Method: Direct UPI / IMPS Settlement</p>
            <p className="text-gray-500">
              Status: {invoice.status === "Paid" ? "Payment Received" : "Payment Due Upon Receipt"}
            </p>
          </div>

          <div className="w-full sm:w-72 text-right text-xs">
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
                marginTop: "14px",
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
          </div>
        </div>

        {/* BANK SETTLEMENT & DYNAMIC SCAN-TO-PAY UPI QR CODE */}
        <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50/20 backdrop-blur-[2px] p-4 rounded-xl border border-gray-200/60">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            {/* Bank Details */}
            <div className="space-y-1.5 text-xs flex-1">
              <p className="font-mono text-[11px] font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-gray-900 shrink-0 stroke-[2.2]" /> BANK & SETTLEMENT INSTRUCTIONS
              </p>
              <table className="border-collapse p-0 m-0 border-0 text-left pt-1">
                <tbody className="space-y-1 text-gray-600">
                  <tr>
                    <td className="py-0.5 pr-2 font-mono text-gray-900 font-semibold whitespace-nowrap">A/c Holder</td>
                    <td className="py-0.5 px-1.5 text-gray-400 font-bold">:</td>
                    <td className="py-0.5 pl-1.5 text-gray-900">{pd.beneficiaryName || "Jai Kishan Kumar (Webnex Labs)"}</td>
                  </tr>
                  {pd.bankName && (
                    <tr>
                      <td className="py-0.5 pr-2 font-mono text-gray-900 font-semibold whitespace-nowrap">Bank</td>
                      <td className="py-0.5 px-1.5 text-gray-400 font-bold">:</td>
                      <td className="py-0.5 pl-1.5 text-gray-900">{pd.bankName}</td>
                    </tr>
                  )}
                  {pd.accountNumber && (
                    <tr>
                      <td className="py-0.5 pr-2 font-mono text-gray-900 font-semibold whitespace-nowrap">A/c No.</td>
                      <td className="py-0.5 px-1.5 text-gray-400 font-bold">:</td>
                      <td className="py-0.5 pl-1.5 font-mono text-gray-900">{pd.accountNumber}</td>
                    </tr>
                  )}
                  {pd.ifscCode && (
                    <tr>
                      <td className="py-0.5 pr-2 font-mono text-gray-900 font-semibold whitespace-nowrap">IFSC</td>
                      <td className="py-0.5 px-1.5 text-gray-400 font-bold">:</td>
                      <td className="py-0.5 pl-1.5 font-mono text-gray-900 font-semibold uppercase">{pd.ifscCode.toUpperCase()}</td>
                    </tr>
                  )}
                  {pd.upiId && (
                    <tr>
                      <td className="pt-2 pb-0.5 pr-2 font-mono text-gray-900 font-semibold whitespace-nowrap">UPI ID</td>
                      <td className="pt-2 pb-0.5 px-1.5 text-gray-400 font-bold">:</td>
                      <td className="pt-2 pb-0.5 pl-1.5">
                        <span className="font-mono text-gray-900 font-semibold select-all">
                          {pd.upiId}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* UPI QR Code Container */}
            {pd.upiId && (
              <div className="flex flex-col items-center text-center bg-white p-3 rounded-2xl shadow-md border border-gray-200 shrink-0 max-w-[190px]">
                <div className="relative">
                  <img
                    src={getUpiQrUrl(
                      pd.upiId,
                      pd.beneficiaryName,
                      invoice.totalAmount,
                      invoice.invoiceNumber
                    )}
                    alt="Scan to Pay via UPI"
                    crossOrigin="anonymous"
                    className="w-32 h-32 object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 border border-black/10 rounded-lg pointer-events-none" />
                </div>

                <span className="font-mono text-xs text-gray-900 font-bold mt-2 block w-full">
                  ₹{invoice.totalAmount?.toLocaleString()}
                </span>
                <span className="font-mono text-[10px] text-gray-700 font-medium block w-full">
                  Scan with Any UPI App
                </span>
                <span className="font-mono text-[8px] text-gray-500 mt-0.5 block w-full whitespace-nowrap">
                  GPay • PhonePe • Paytm • BHIM
                </span>
              </div>
            )}
          </div>
        </div>
      </DocumentCard>
    </div>
  );
}
