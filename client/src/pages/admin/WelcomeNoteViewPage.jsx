import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client.js";
import DocumentCard from "../../components/DocumentCard.jsx";
import GearboxLoader from "../../components/GearboxLoader.jsx";

export default function WelcomeNoteViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const docCardRef = useRef(null);

  useEffect(() => {
    api
      .get(`/notes/${id}`)
      .then((res) => {
        setNote(res.data);
      })
      .catch((err) => {
        console.error("Failed to load welcome note", err);
        setError("Welcome note not found or inaccessible.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopy = () => {
    if (!note?.message) return;
    navigator.clipboard.writeText(note.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <GearboxLoader label="Loading welcome note..." />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-panel border border-edge rounded-2xl text-center space-y-4">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-xl font-bold text-paper">Welcome Note Not Found</h2>
        <p className="text-mist text-sm">{error || "The requested welcome note does not exist."}</p>
        <button
          onClick={() => navigate("/admin/welcome-notes")}
          className="inline-block px-5 py-2.5 rounded-xl bg-grad-primary text-void font-bold text-sm hover:brightness-110"
        >
          ← Back to Welcome Notes
        </button>
      </div>
    );
  }

  const clientName = note.clientName || "Client Name";
  const clientEmail = note.clientEmail || "";
  const projectTitle = note.projectTitle || "Custom Web Application";
  const kickoffDate = note.kickoffDate || note.sentAt?.split("T")[0] || new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 print:p-0 print:m-0 print:max-w-full print:w-full print:space-y-0">
      {/* Top Breadcrumb & Action Bar (Hidden during Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={() => navigate("/admin/welcome-notes")}
          className="flex items-center gap-2 text-sm text-mist hover:text-paper font-mono transition"
        >
          <span>←</span> Back to Welcome Notes
        </button>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-mono text-mist mr-2">
            Status: <strong className="text-emerald-400 uppercase">Onboarding Active</strong>
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl border border-edge bg-panel text-paper hover:bg-white/5 text-xs transition flex items-center gap-1.5 font-mono"
          >
            {copied ? "✓ Copied!" : "📋 Copy Letter"}
          </button>

          <button
            type="button"
            onClick={() => {
              const cardEl = document.querySelector(".printable-document");
              if (cardEl) {
                import("../../utils/pdfExport.js").then(({ downloadElementAsPdf }) => {
                  downloadElementAsPdf(cardEl, `Webnex_Labs_Welcome_Note_${clientName.replace(/\s+/g, "_")}.pdf`);
                });
              }
            }}
            className="px-4 py-2 rounded-xl bg-grad-primary text-void font-bold text-xs shadow hover:brightness-110 transition flex items-center gap-1.5"
          >
            <span>📥</span>
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-panel border border-edge text-paper hover:bg-white/5 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <span>🖨️</span>
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Standalone Welcome Note Document View */}
      <DocumentCard
        ref={docCardRef}
        docType="WELCOME NOTE"
        docNumber={`WEL-${note.id.slice(0, 6).toUpperCase()}`}
        date={note.sentAt?.split("T")[0] || new Date().toISOString().split("T")[0]}
        secondaryDate={kickoffDate}
        secondaryDateLabel="Kickoff Date"
        clientName={clientName}
        clientEmail={clientEmail}
        projectTitle={projectTitle}
        status="Onboarding Active"
        isPage={true}
        showCardActions={false}
        onPrint={() => window.print()}
        onClose={() => navigate("/admin/welcome-notes")}
        notes="Welcome note generated via Webnex Labs CRM Client Onboarding Suite."
      >
        <div className="font-mono text-xs text-gray-900 whitespace-pre-wrap leading-relaxed py-2">
          {note.message}
        </div>
      </DocumentCard>
    </div>
  );
}
