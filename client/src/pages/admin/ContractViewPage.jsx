import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client.js";
import DocumentCard from "../../components/DocumentCard.jsx";
import GearboxLoader from "../../components/GearboxLoader.jsx";

const DEFAULT_AGREEMENT_TERMS = `# SOFTWARE DEVELOPMENT AND MAINTENANCE AGREEMENT

## 1. Parties
Client Name: [Client Name]
Client Contact: [Client Email]

Developer / Studio: Webnex Labs (Represented by Jai Kishan Kumar, Lead Developer & Proprietor)
Contact Email: hello@webnexlabs.in
Website: https://webnex.battlefiesta.in

Collectively referred to as "the Parties."

---

## 2. Scope & Purpose
The Developer has architected, built, and agrees to maintain a custom web-based software application for the Client.

The software deliverables include:
1. Custom Frontend & Responsive UI/UX Interface
2. Backend API Architecture & Database Engineering
3. Authentication, Role-based Access & Security Controls
4. Third-party Integrations (Payment Gateway / SMS / Analytics)
5. Production Deployment, Domain Configuration & SSL Setup

---

## 3. Commercials & Milestones
- Total Development Fee: Agreed project amount as specified.
- Payment Structure: Staged milestone schedule as per issued Webnex Labs invoices.
- Tax Status: GST Exempt (Under threshold limit).

---

## 4. Monthly Maintenance & Retainer (Optional/Post-Launch)
- Monthly Retainer Fee: ₹4,500/- per month
- Billing Cycle: Payable within 5 days of monthly invoice generation.
- Includes: Bug fixes, server uptime monitoring, security patching, and technical support.
- Excludes: Major new feature additions and separate standalone applications.

---

## 5. Intellectual Property & Code Ownership
Upon complete receipt of agreed development fees, the Client receives full perpetual ownership of application deliverables, data, and source code. Webnex Labs retains the right to display the completed work in its technical portfolio.

---

## 6. Confidentiality & Data Security
All Client proprietary logic, customer databases, and commercial data shall remain strictly confidential and protected under standard non-disclosure practices.

---

## 7. Governing Law & Dispute Resolution
This agreement is executed and governed under the laws of the Republic of India.

---

## Signatures & Execution

For Client:
Authorized Signature: _______________________      Date: _________
Name & Designation: [Client Name]

For Webnex Labs:
Authorized Signature: _______________________      Date: _________
Jai Kishan Kumar (Founder & Lead Developer, Webnex Labs)`;

export default function ContractViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const docCardRef = React.useRef(null);

  useEffect(() => {
    Promise.all([api.get(`/contracts/${id}`), api.get("/clients")])
      .then(([contractRes, clientsRes]) => {
        setContract(contractRes.data);
        const cl = (clientsRes.data || []).find((c) => c.id === contractRes.data?.clientId);
        setClient(cl || null);
      })
      .catch((err) => {
        console.error("Failed to load agreement", err);
        setError("Agreement not found or inaccessible.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GearboxLoader label="Loading agreement..." />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-rose-400 font-mono text-sm">{error || "Agreement not found."}</p>
        <button
          onClick={() => navigate("/admin/contracts")}
          className="px-4 py-2 rounded-xl bg-grad-primary text-void text-xs font-bold shadow hover:brightness-110"
        >
          Return to Agreements
        </button>
      </div>
    );
  }

  const clientName = client?.name || contract.clientName || "Client";
  const clientEmail = client?.email || contract.clientEmail || "client@domain.com";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 print:p-0 print:m-0 print:max-w-full print:w-full print:space-y-0">
      {/* Top Breadcrumb & Action Bar (Hidden during Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={() => navigate("/admin/contracts")}
          className="flex items-center gap-2 text-sm text-mist hover:text-paper font-mono transition"
        >
          <span>←</span> Back to Agreements
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-mist">
            Status: <strong className="text-paper uppercase">{contract.status || "DRAFT"}</strong>
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

      {/* Full Dedicated Agreement Document Card */}
      <DocumentCard
        ref={docCardRef}
        onDownloadingChange={setDownloadingPdf}
        docType="AGREEMENT"
        docNumber={`AGR-${contract.id.slice(0, 6).toUpperCase()}`}
        date={contract.issuedAt?.split("T")[0] || new Date().toISOString().split("T")[0]}
        secondaryDate={`₹${Number(contract.amount || 0).toLocaleString()}`}
        secondaryDateLabel="Dev Cost"
        clientName={clientName}
        clientEmail={clientEmail}
        projectTitle={contract.title}
        status={contract.status?.toUpperCase() || "DRAFT"}
        isPage={true}
        showCardActions={false}
        onPrint={() => window.print()}
        onClose={() => navigate("/admin/contracts")}
        notes="Legally binding Software Development & Maintenance Agreement executed via Webnex Labs CRM."
      >
        <div className="font-mono text-xs text-gray-900 whitespace-pre-wrap leading-relaxed py-2">
          {contract.terms || contract.scope || DEFAULT_AGREEMENT_TERMS}
        </div>
      </DocumentCard>
    </div>
  );
}
