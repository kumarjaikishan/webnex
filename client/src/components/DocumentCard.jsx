import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { downloadElementAsPdf } from "../utils/pdfExport.js";
import { toast } from "react-toastify";

const DocumentCard = forwardRef(function DocumentCard(
  {
    docType, // "INVOICE" | "AGREEMENT" | "WELCOME NOTE"
    docNumber,
    date,
    secondaryDate, // e.g. Due Date or Kickoff Date
    secondaryDateLabel = "Due Date",
    clientName,
    clientEmail,
    projectTitle,
    status,
    children,
    notes,
    onPrint,
    onCopy,
    onClose,
    copiedText = "Copy Text",
    isCopied = false,
    isPage = false,
    onDownloadingChange,
    showCardActions = true,
  },
  ref
) {
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  const cleanClient = (clientName || "Client").replace(/[^a-zA-Z0-9_-]/g, "_");
  const cleanDocNum = (docNumber || "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const cleanType = (docType || "Document").replace(/\s+/g, "_");
  const defaultPdfName = `Webnex_Labs_${cleanType}_${cleanClient}_${cleanDocNum}.pdf`;

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = defaultPdfName.replace(".pdf", "");

    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }

    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleDirectDownloadPdf = async () => {
    if (downloading || !cardRef.current) return;
    setDownloading(true);
    if (onDownloadingChange) onDownloadingChange(true);
    const toastId = toast.loading("Generating high-resolution PDF...", { autoClose: false });
    try {
      await downloadElementAsPdf(cardRef.current, defaultPdfName);
      toast.update(toastId, {
        render: `✓ PDF downloaded: ${defaultPdfName}`,
        type: "success",
        isLoading: false,
        autoClose: 3500,
      });
    } catch (err) {
      console.error("Failed to generate direct PDF:", err);
      toast.update(toastId, {
        render: "Opening system print dialog to save PDF...",
        type: "info",
        isLoading: false,
        autoClose: 2500,
      });
      handlePrint();
    } finally {
      setDownloading(false);
      if (onDownloadingChange) onDownloadingChange(false);
    }
  };

  useImperativeHandle(ref, () => ({
    downloadPdf: handleDirectDownloadPdf,
    print: handlePrint,
  }));

  return (
    <div
      ref={cardRef}
      className={`bg-white text-gray-900 border-0 rounded-2xl overflow-hidden ${isPage ? "max-h-none overflow-visible" : "max-h-[90vh] overflow-y-auto"} relative shadow-2xl printable-document print-theme-light print:overflow-visible print:max-h-none print:rounded-none print:shadow-none`}
    >
      {/* 100% EXACT BRAND WATERMARK (Logo + WEBNEX LABS + Tagline) - STRAIGHT HORIZONTAL & EXACT A4 PAGE CENTERED */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden printable-page-watermark"
        style={{ opacity: 0.058 }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center justify-center text-center transform scale-125 sm:scale-150 print:scale-150">
          {/* Row: Geometric Leaf Logo + WEBNEX LABS (Straight Horizontal) */}
          <div className="flex items-center gap-5 sm:gap-7">
            {/* Geometric Leaf/Petal Icon */}
            <div className="relative w-16 h-20 sm:w-24 sm:h-28 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 40 50" className="w-full h-full">
                <path d="M5 25 C5 10, 20 5, 22 5 C22 20, 10 35, 5 25 Z" fill="#f5b842" />
                <path d="M22 5 C25 5, 38 15, 35 30 C30 45, 12 45, 22 5 Z" fill="none" stroke="#111827" strokeWidth="2.8" />
              </svg>
            </div>

            {/* Brand Typography: WEBNEX (Dark) + LABS (Gold) */}
            <div className="text-left">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-5xl sm:text-7xl font-black tracking-tight text-gray-950 uppercase">
                  WEBNEX
                </span>
                <span className="font-display text-5xl sm:text-7xl font-black tracking-tight text-[#f5b842] uppercase">
                  LABS
                </span>
              </div>
              <p className="text-sm sm:text-base font-mono tracking-[0.38em] text-gray-700 font-bold uppercase mt-1.5">
                WEB • DESIGN • DEVELOPMENT
              </p>
            </div>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse p-0 m-0 border-0 relative z-10">
        {/* REPEATING HEADER (Repeats on Page 1, Page 2, Page 3...) */}
        <thead className="table-header-group">
          <tr>
            <td className="p-0 border-0">
              {/* 100% IDENTICAL CURVY WAVY HEADER DESIGN */}
              <div className="relative bg-[#20222a] text-white pt-6 pb-12 px-6 sm:px-8 print:px-12 print:pt-8 print:pb-16 overflow-hidden">
                {/* Layer 1: Dark Slate Background with Content */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-2">
                  {/* Logo & Brand Section */}
                  <div className="flex items-center gap-3.5">
                    {/* Geometric Leaf/Petal Icon */}
                    <div className="relative w-9 h-11 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 40 50" className="w-full h-full drop-shadow-sm">
                        <path d="M5 25 C5 10, 20 5, 22 5 C22 20, 10 35, 5 25 Z" fill="#f5b842" />
                        <path d="M22 5 C25 5, 38 15, 35 30 C30 45, 12 45, 22 5 Z" fill="none" stroke="#ffffff" strokeWidth="2.5" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                          WEBNEX
                        </span>
                        <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#f5b842] uppercase">
                          LABS
                        </span>
                      </div>
                      <p className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">WEB • DESIGN • DEVELOPMENT</p>
                    </div>
                  </div>
                  {/* Top Right Header Coordinates */}
                  <div className="text-right">
                    {/* Clean Header */}
                  </div>
                </div>

                {/* 100% Exact Layered Smooth Waves (Bottom SVG) */}
                <div className="absolute inset-x-0 -bottom-1 leading-none pointer-events-none w-full overflow-hidden">
                  <svg
                    viewBox="0 0 1200 131"
                    preserveAspectRatio="none"
                    className="w-full h-14 sm:h-20 block"
                  >
                    <path
                      d="M0,45 C300,110 550,20 850,75 C1050,110 1150,60 1200,40 L1200,131 L0,131 Z"
                      fill="#9ba1ad"
                      opacity="0.85"
                    />
                    <path
                      d="M0,65 C250,125 500,50 780,95 C1000,130 1120,95 1200,80 L1200,131 L0,131 Z"
                      fill="#d9dce2"
                      opacity="0.95"
                    />
                    <path
                      d="M0,90 C220,135 450,75 750,115 C950,140 1100,115 1200,105 L1200,131 L0,131 Z"
                      fill="#ffffff"
                    />
                  </svg>
                </div>
              </div>
            </td>
          </tr>
        </thead>

        {/* REPEATING FOOTER SPACER IN TABLE (Preserves space on each page so text never overlaps footer) */}
        <tfoot className="table-footer-group">
          <tr>
            <td className="p-0 border-0">
              <div className="h-12 sm:h-14 w-full printable-footer-spacer pointer-events-none" />
            </td>
          </tr>
        </tfoot>

        {/* MIDDLE BODY CONTENT (Flows naturally across multiple pages) */}
        <tbody className="table-row-group">
          <tr>
            <td className="p-0 border-0 relative">
              <div className="px-6 sm:px-10 py-5 space-y-6 relative z-10">
                {/* DOCUMENT METADATA BAR */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-gray-200 text-xs">
                  {/* INVOICED TO */}
                  <div className="space-y-1 text-left">
                    <p className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {docType === "INVOICE" ? "INVOICED TO" : "PREPARED FOR"}
                    </p>
                    <p className="font-bold text-gray-950 text-sm">{clientName || "Client Name"}</p>
                    {clientEmail && <p className="text-gray-500 font-mono text-[11px]">{clientEmail}</p>}
                    {projectTitle && (
                      <p className="text-gray-600 font-medium text-xs mt-1">
                        <span className="text-gray-400">Project:</span> {projectTitle}
                      </p>
                    )}
                  </div>

                  {/* INVOICE META & DATES */}
                  <div className="sm:text-right space-y-1 font-mono text-xs w-full sm:w-auto">
                    <div className="space-y-0.5">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500 font-bold text-gray-700">Doc Ref :</span>
                        <span className="text-gray-950 font-bold font-mono text-[13px]">{docNumber || "DRAFT"}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Date :</span>
                        <span className="text-gray-900">{date || new Date().toISOString().split("T")[0]}</span>
                      </div>
                      {secondaryDate && (
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">{secondaryDateLabel} :</span>
                          <span className="text-gray-900 font-semibold">{secondaryDate}</span>
                        </div>
                      )}
                      {status && (
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Status :</span>
                          <span className="text-emerald-600 font-bold uppercase">{status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* DOCUMENT BODY CONTENT */}
                <div className="space-y-4">
                  {children}
                </div>

                {/* NOTES & TERMS FOOTER */}
                {notes && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600">
                    <p className="font-mono uppercase text-[10px] text-gray-800 mb-1 font-bold">Notes & Terms</p>
                    <p className="leading-relaxed">{notes}</p>
                  </div>
                )}

                {/* FOOTER ACTIONS (HIDDEN IN PRINT, OPTIONAL ON PAGE) */}
                {showCardActions && (
                  <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-gray-200 printable-document-actions no-print">
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={handleDirectDownloadPdf}
                        disabled={downloading}
                        className="px-4 py-2 rounded-xl bg-grad-primary text-void text-xs font-bold shadow hover:brightness-110 transition focus-ring flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <span>{downloading ? "⏳" : "📥"}</span>
                        <span>{downloading ? "Generating PDF..." : "Direct Download PDF"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePrint}
                        className="px-4 py-2 rounded-xl bg-gray-900 text-white border border-gray-800 text-xs font-semibold hover:bg-gray-800 transition focus-ring flex items-center gap-1.5 shadow-sm"
                      >
                        <span>🖨️</span>
                        <span>Print / Save PDF</span>
                      </button>

                      {onCopy && (
                        <button
                          type="button"
                          onClick={onCopy}
                          className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs transition"
                        >
                          {isCopied ? "✓ Copied!" : `📋 ${copiedText}`}
                        </button>
                      )}
                    </div>

                    {onClose && (
                      <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-grad-primary text-void text-xs font-bold hover:brightness-110 transition focus-ring"
                      >
                        Close
                      </button>
                    )}
                  </div>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 100% IDENTICAL BOTTOM GEOMETRIC BRAND STRIPE (Fixed to bottom of every printed page & on-screen bottom) */}
      <div className="w-full relative h-11 sm:h-12 print:h-12 flex overflow-hidden mt-auto mb-0 leading-none shrink-0 print-theme-bottom-stripe printable-page-footer">
        {/* SVG Geometric Background */}
        <svg
          viewBox="0 0 1000 48"
          preserveAspectRatio="none"
          className="w-full h-full block absolute inset-0 pointer-events-none"
        >
          {/* Left: Golden Yellow Band */}
          <polygon points="0,14 510,14 455,48 0,48" fill="#f5b842" />
          {/* Right: Deep Charcoal Slate (#1a1c23) Block */}
          <polygon points="435,48 495,0 1000,0 1000,48" fill="#181a20" />
        </svg>

        {/* Content Overlay: Website and Phone together on the Right Slate Block */}
        <div className="relative z-10 w-full h-full flex items-center justify-end px-6 sm:px-10 font-mono select-none">
          <div className="flex items-center gap-3 sm:gap-5 text-white font-bold text-[10px] sm:text-[11px] tracking-wide self-center pt-1 sm:pt-0">
            {/* Website */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#f5b842] text-[11px] leading-none">🌐</span>
              <a
                href="https://webnex.battlefiesta.in"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-[#f5b842] hover:underline font-bold tracking-tight transition"
                style={{ color: "#ffffff" }}
              >
                webnex.battlefiesta.in
              </a>
            </div>

            {/* Subtle Divider */}
            <span className="text-gray-500 text-[10px] select-none">•</span>

            {/* Phone Number */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#f5b842] text-[11px] leading-none">📞</span>
              <span className="text-white font-bold tracking-wide" style={{ color: "#ffffff" }}>
                +91 8210539367
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DocumentCard;
