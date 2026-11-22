import{r as e}from"./rolldown-runtime-Dw2cE7zH.js";import{wt as t}from"./lucide-icons-nmXz87aE.js";import{d as n,l as r}from"./react-router-DpLGJwUH.js";import"./utils-vendor-CTkCwYwk.js";import{t as i}from"./client-xYzqD79v.js";import{t as a}from"./jsx-runtime-WDAJaHBe.js";import"./pdf-generator-DokQCoxd.js";import{c as o}from"./index-BmfwOZrX.js";import{t as s}from"./DocumentCard-5-RnwNSo.js";var c=e(t(),1),l=a(),u=`# SOFTWARE DEVELOPMENT AND MAINTENANCE AGREEMENT

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
Jai Kishan Kumar (Founder & Lead Developer, Webnex Labs)`;function d(){let{id:e}=n(),t=r(),[a,d]=(0,c.useState)(null),[f,p]=(0,c.useState)(null),[m,h]=(0,c.useState)(!0),[g,_]=(0,c.useState)(null),[v,y]=(0,c.useState)(!1),b=c.useRef(null);if((0,c.useEffect)(()=>{Promise.all([i.get(`/contracts/${e}`),i.get(`/clients`)]).then(([e,t])=>{d(e.data),p((t.data||[]).find(t=>t.id===e.data?.clientId)||null)}).catch(e=>{console.error(`Failed to load agreement`,e),_(`Agreement not found or inaccessible.`)}).finally(()=>h(!1))},[e]),m)return(0,l.jsx)(`div`,{className:`flex items-center justify-center min-h-[60vh]`,children:(0,l.jsx)(o,{label:`Loading agreement...`})});if(g||!a)return(0,l.jsxs)(`div`,{className:`max-w-2xl mx-auto px-4 py-16 text-center space-y-4`,children:[(0,l.jsx)(`p`,{className:`text-rose-400 font-mono text-sm`,children:g||`Agreement not found.`}),(0,l.jsx)(`button`,{onClick:()=>t(`/admin/contracts`),className:`px-4 py-2 rounded-xl bg-grad-primary text-void text-xs font-bold shadow hover:brightness-110`,children:`Return to Agreements`})]});let x=f?.name||a.clientName||`Client`,S=f?.email||a.clientEmail||`client@domain.com`;return(0,l.jsxs)(`div`,{className:`max-w-4xl mx-auto px-4 py-8 space-y-6 print:p-0 print:m-0 print:max-w-full print:w-full print:space-y-0`,children:[(0,l.jsxs)(`div`,{className:`flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print`,children:[(0,l.jsxs)(`button`,{onClick:()=>t(`/admin/contracts`),className:`flex items-center gap-2 text-sm text-mist hover:text-paper font-mono transition`,children:[(0,l.jsx)(`span`,{children:`←`}),` Back to Agreements`]}),(0,l.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,l.jsxs)(`span`,{className:`text-xs font-mono text-mist`,children:[`Status: `,(0,l.jsx)(`strong`,{className:`text-paper uppercase`,children:a.status||`DRAFT`})]}),(0,l.jsxs)(`button`,{type:`button`,disabled:v,onClick:()=>{if(b.current?.downloadPdf)b.current.downloadPdf();else{let e=document.querySelector(`.printable-document-actions button`);e&&e.click()}},className:`px-4 py-2 rounded-xl bg-grad-primary text-void font-bold text-xs shadow hover:brightness-110 transition flex items-center gap-1.5 disabled:opacity-50`,children:[(0,l.jsx)(`span`,{children:v?`⏳`:`📥`}),(0,l.jsx)(`span`,{children:v?`Generating PDF...`:`Download PDF`})]}),(0,l.jsxs)(`button`,{type:`button`,onClick:()=>window.print(),className:`px-4 py-2 rounded-xl bg-panel border border-edge text-paper hover:bg-white/5 font-semibold text-xs transition flex items-center gap-1.5`,children:[(0,l.jsx)(`span`,{children:`🖨️`}),` Print`]})]})]}),(0,l.jsx)(s,{ref:b,onDownloadingChange:y,docType:`AGREEMENT`,docNumber:`AGR-${a.id.slice(0,6).toUpperCase()}`,date:a.issuedAt?.split(`T`)[0]||new Date().toISOString().split(`T`)[0],secondaryDate:`₹${Number(a.amount||0).toLocaleString()}`,secondaryDateLabel:`Dev Cost`,clientName:x,clientEmail:S,projectTitle:a.title,status:a.status?.toUpperCase()||`DRAFT`,isPage:!0,showCardActions:!1,onPrint:()=>window.print(),onClose:()=>t(`/admin/contracts`),notes:`Legally binding Software Development & Maintenance Agreement executed via Webnex Labs CRM.`,children:(0,l.jsx)(`div`,{className:`font-mono text-xs text-gray-900 whitespace-pre-wrap leading-relaxed py-2`,children:a.terms||a.scope||u})})]})}export{d as default};