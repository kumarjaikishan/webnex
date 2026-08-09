import React, { useState } from "react";

export default function DocumentCard({
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
}) {
  const [printTheme, setPrintTheme] = useState("light"); // "light" | "dark"

  const handlePrint = () => {
    const originalTitle = document.title;
    const cleanClient = (clientName || "Client").replace(/[^a-zA-Z0-9_-]/g, "_");
    const cleanDocNum = (docNumber || "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const cleanType = (docType || "Document").replace(/\s+/g, "_");

    // Dynamic clean PDF file name when saving
    document.title = `Webnex_Labs_${cleanType}_${cleanClient}_${cleanDocNum}`;

    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }

    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className={`bg-panel border border-edge rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-paper relative shadow-2xl printable-document ${printTheme === "dark" ? "print-theme-dark" : "print-theme-light"}`}>
      {/* IDENTICAL BRANDED HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-edge pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-md bg-grad-primary" />
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Webnex <span className="bg-grad-primary bg-clip-text text-transparent">Labs</span>
            </h2>
          </div>
          <p className="text-xs text-mist font-medium">Digital Studio & Engineering Solutions</p>
          <p className="text-xs text-mist font-mono">hello@webnexlabs.com</p>
        </div>

        <div className="text-left sm:text-right">
          <h3 className="font-mono text-xl font-bold text-cyan tracking-wider">{docType}</h3>
          {docNumber && <p className="font-mono text-sm text-mist">{docNumber}</p>}
          <p className="text-xs text-mist mt-1">Date: <span className="text-paper">{date || new Date().toISOString().split("T")[0]}</span></p>
          {secondaryDate && (
            <p className="text-xs text-mist">
              {secondaryDateLabel}: <span className="text-paper">{secondaryDate}</span>
            </p>
          )}
        </div>
      </div>

      {/* IDENTICAL CLIENT & PROJECT REFERENCE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-void/50 p-4 rounded-xl border border-edge">
        <div>
          <p className="text-[10px] font-mono text-mist uppercase tracking-widest">
            {docType === "INVOICE" ? "BILLED TO" : "PREPARED FOR"}
          </p>
          <p className="font-semibold text-paper mt-1">{clientName || "Client Name"}</p>
          <p className="text-xs text-mist font-mono">{clientEmail || "client@domain.com"}</p>
        </div>
        <div>
          <p className="text-[10px] font-mono text-mist uppercase tracking-widest">PROJECT REFERENCE</p>
          <p className="font-semibold text-paper mt-1">{projectTitle || "Web App & Digital Engineering"}</p>
          {status && (
            <p className="text-xs text-mist">
              Status: <span className="text-cyan font-mono">{status}</span>
            </p>
          )}
        </div>
      </div>

      {/* DOCUMENT BODY CONTENT */}
      <div className="space-y-4">
        {children}
      </div>

      {/* NOTES & TERMS FOOTER */}
      {notes && (
        <div className="bg-void/40 p-4 rounded-xl border border-edge/60 text-xs text-mist">
          <p className="font-mono uppercase text-[10px] text-cyan mb-1 font-semibold">Notes & Terms</p>
          <p className="leading-relaxed">{notes}</p>
        </div>
      )}

      {/* IDENTICAL FOOTER ACTIONS (HIDDEN IN PRINT) */}
      <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-edge printable-document-actions no-print">
        <div className="flex items-center gap-3 flex-wrap">
          {/* PRINT THEME SWITCHER TOGGLE */}
          <div className="flex items-center gap-1 bg-void border border-edge rounded-xl p-1">
            <button
              type="button"
              onClick={() => setPrintTheme("light")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                printTheme === "light"
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm"
                  : "text-mist hover:text-paper"
              }`}
            >
              ☀️ Light PDF
            </button>
            <button
              type="button"
              onClick={() => setPrintTheme("dark")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                printTheme === "dark"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                  : "text-mist hover:text-paper"
              }`}
            >
              🌙 Dark PDF
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-cyan/15 text-cyan border border-cyan/30 text-xs font-semibold hover:bg-cyan/25 transition focus-ring flex items-center gap-1.5"
          >
            <span>🖨️</span>
            <span>Print / Save ({printTheme === "dark" ? "Dark" : "Light"})</span>
          </button>

          {onCopy && (
            <button
              onClick={onCopy}
              className="px-4 py-2 rounded-xl border border-edge bg-void text-mist hover:text-paper text-xs transition"
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
    </div>
  );
}
