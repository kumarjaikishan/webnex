import { useState } from "react";
import api from "../../api/client.js";
import DocumentCard from "../../components/DocumentCard.jsx";

export default function WelcomeNotes() {
  const [clientName, setClientName] = useState("Alex Rivers");
  const [clientEmail, setClientEmail] = useState("alex@acmestudio.com");
  const [companyName, setCompanyName] = useState("Acme Studio");
  const [projectTitle, setProjectTitle] = useState("E-commerce Storefront & Mobile API");
  const [kickoffDate, setKickoffDate] = useState("2026-08-10");
  const [portalUrl, setPortalUrl] = useState("http://localhost:5173/login");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const client = clientName || "[Client Name]";
  const company = companyName || "[Company Name]";
  const project = projectTitle || "[Project Title]";
  const kickoff = kickoffDate || "[Date]";

  const welcomeTemplate = `Dear ${client},

Welcome to Webnex Labs! We are thrilled to partner with ${company} for the upcoming "${project}" development.

Here is a quick summary of what to expect during our onboarding:

1. Kickoff Date: ${kickoff}
2. Client Workspace Portal: ${portalUrl}
3. Deliverables & Milestones: Highlighting weekly progress demos and transparent updates.

Your dedicated Webnex Labs team is preparing the initial sprint environment. Please log into your Client Portal to review initial contracts and project scope documents.

If you have any questions before our kickoff call, feel free to reply directly to this note or contact hello@webnexlabs.com.

Warm regards,
The Webnex Labs Team
Engineering & Digital Solutions`;

  async function handleSaveNote() {
    try {
      await api.post("/notes", {
        title: `Welcome Note — ${clientName} (${companyName})`,
        body: welcomeTemplate,
        type: "welcome_note",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save welcome note to notes database");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(welcomeTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-edge pb-4">
        <h1 className="font-display text-2xl font-bold">Client Welcome Notes Generator</h1>
        <p className="text-mist text-sm">Generate branded welcome letters and onboarding cards with identical Webnex Labs headers.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* FORM CONTROLS */}
        <div className="lg:col-span-5 bg-panel border border-edge rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="font-display text-lg font-semibold text-paper border-b border-edge pb-2">Onboarding Information</h2>

          <div>
            <label className="block text-xs font-mono text-mist uppercase mb-1">Client Contact Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-mist uppercase mb-1">Client Email Address</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-mist uppercase mb-1">Company / Business Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-mist uppercase mb-1">Project Name</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-mist uppercase mb-1">Kickoff Date</label>
              <input
                type="date"
                value={kickoffDate}
                onChange={(e) => setKickoffDate(e.target.value)}
                className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-mist uppercase mb-1">Portal Login Link</label>
              <input
                type="text"
                value={portalUrl}
                onChange={(e) => setPortalUrl(e.target.value)}
                className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              onClick={handleSaveNote}
              className="w-full py-3 rounded-xl bg-grad-primary text-void text-xs font-bold hover:brightness-110 transition focus-ring"
            >
              {saved ? "✓ Saved to CRM Notes!" : "💾 Save Welcome Note to CRM"}
            </button>
          </div>
        </div>

        {/* IDENTICAL BRANDED DOCUMENT PREVIEW */}
        <div className="lg:col-span-7">
          <DocumentCard
            docType="WELCOME NOTE"
            docNumber="WEL-2026-01"
            date={new Date().toISOString().split("T")[0]}
            secondaryDate={kickoffDate}
            secondaryDateLabel="Kickoff Date"
            clientName={clientName}
            clientEmail={clientEmail}
            projectTitle={projectTitle}
            status="Onboarding Active"
            onPrint={() => window.print()}
            onCopy={handleCopy}
            isCopied={copied}
            copiedText="Copy Welcome Letter"
            notes="Welcome note generated via Webnex Labs CRM Client Onboarding Suite."
          >
            <div className="bg-void p-5 rounded-xl border border-edge font-mono text-xs text-paper whitespace-pre-wrap leading-relaxed shadow-inner">
              {welcomeTemplate}
            </div>
          </DocumentCard>
        </div>
      </div>
    </div>
  );
}
