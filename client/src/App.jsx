import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import api from "./api/client.js";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ParticleBackground from "./components/ParticleBackground.jsx";
import ScrollRestoreManager from "./components/ScrollRestoreManager.jsx";
import WebnexLoader from "./components/WebnexLoader.jsx";
import { Toaster } from "sonner";
import { ConfirmProvider } from "./context/ConfirmContext.jsx";

import Home from "./pages/Home.jsx";
import Work from "./pages/Work.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import FAQsPage from "./pages/FAQsPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import ExtensionsPage from "./pages/ExtensionsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Overview from "./pages/admin/Overview.jsx";
import Clients from "./pages/admin/Clients.jsx";
import ClientDetail from "./pages/admin/ClientDetail.jsx";
import Invoices from "./pages/admin/Invoices.jsx";
import InvoiceViewPage from "./pages/admin/InvoiceViewPage.jsx";
import Contracts from "./pages/admin/Contracts.jsx";
import ContractViewPage from "./pages/admin/ContractViewPage.jsx";
import WelcomeNotes from "./pages/admin/WelcomeNotes.jsx";
import WelcomeNoteViewPage from "./pages/admin/WelcomeNoteViewPage.jsx";
import Maintenance from "./pages/admin/Maintenance.jsx";
import Reminders from "./pages/admin/Reminders.jsx";
import Notes from "./pages/admin/Notes.jsx";
import AdminProjects from "./pages/admin/Projects.jsx";
import ContactInquiries from "./pages/admin/ContactInquiries.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";

import ClientLayout from "./pages/client/ClientLayout.jsx";
import ClientOverview from "./pages/client/ClientOverview.jsx";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundStyle, setBackgroundStyle] = useState(() => {
    return localStorage.getItem("webnex_background_style") || "warp_speed";
  });

  useEffect(() => {
    // Initial fetch from settings via configured Axios client
    api.get("/settings")
      .then((res) => {
        if (res.data?.backgroundStyle) {
          setBackgroundStyle(res.data.backgroundStyle);
          localStorage.setItem("webnex_background_style", res.data.backgroundStyle);
        }
      })
      .catch(() => {});

    // Listen for real-time backgroundStyle updates from Admin Settings
    const handleBgUpdate = (e) => {
      if (e.detail?.backgroundStyle) {
        setBackgroundStyle(e.detail.backgroundStyle);
        localStorage.setItem("webnex_background_style", e.detail.backgroundStyle);
      }
    };
    window.addEventListener("webnex:backgroundStyle", handleBgUpdate);
    return () => window.removeEventListener("webnex:backgroundStyle", handleBgUpdate);
  }, []);

  return (
    <ConfirmProvider>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        {isLoading && <WebnexLoader onFinish={() => setIsLoading(false)} />}
        <ScrollRestoreManager />
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: "font-body text-sm rounded-2xl shadow-2xl p-4 border flex items-center gap-3 backdrop-blur-xl transition-all",
              title: "font-semibold text-sm",
              description: "text-xs opacity-90",
              actionButton: "bg-cyan text-void font-semibold text-xs rounded-lg px-3 py-1.5",
              cancelButton: "bg-panel text-mist font-semibold text-xs rounded-lg px-3 py-1.5",
              closeButton: "!bg-transparent hover:!bg-white/10 !border-white/20 !text-mist hover:!text-paper",
              success: "!bg-[#071e14]/95 !border-emerald-500/60 !text-emerald-100 [&_[data-icon]]:!text-emerald-400 [&_svg]:!text-emerald-400 shadow-[0_4px_24px_rgba(16,185,129,0.22)]",
              error: "!bg-[#280c13]/95 !border-rose-500/60 !text-rose-100 [&_[data-icon]]:!text-rose-400 [&_svg]:!text-rose-400 shadow-[0_4px_24px_rgba(244,63,94,0.22)]",
              warning: "!bg-[#261905]/95 !border-amber-400/60 !text-amber-100 [&_[data-icon]]:!text-amber-400 [&_svg]:!text-amber-400 shadow-[0_4px_24px_rgba(251,191,36,0.22)]",
              info: "!bg-[#051c24]/95 !border-cyan/60 !text-cyan-100 [&_[data-icon]]:!text-cyan [&_svg]:!text-cyan shadow-[0_4px_24px_rgba(6,182,212,0.22)]",
              default: "!bg-[#0e0f17]/95 !border-white/15 !text-paper shadow-[0_4px_24px_rgba(0,0,0,0.5)]",
            },
          }}
        />
        {/* Full-Page Fixed Ambient Particle & 3D Halo Canvas */}
        <ParticleBackground style={backgroundStyle} />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1 pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/extensions" element={<ExtensionsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/faqs" element={<FAQsPage />} />
              <Route path="/work" element={<PortfolioPage />} />
              <Route path="/work/:slug" element={<ProjectDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="clients" element={<Clients />} />
                <Route path="clients/:id" element={<ClientDetail />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="invoices/:id" element={<InvoiceViewPage />} />
                <Route path="contracts" element={<Contracts />} />
                <Route path="contracts/:id" element={<ContractViewPage />} />
                <Route path="welcome-notes" element={<WelcomeNotes />} />
                <Route path="welcome-notes/:id" element={<WelcomeNoteViewPage />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="reminders" element={<Reminders />} />
                <Route path="notes" element={<Notes />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="inquiries" element={<ContactInquiries />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Client Protected Routes */}
              <Route
                path="/portal"
                element={
                  <ProtectedRoute role="client">
                    <ClientLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ClientOverview />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </ConfirmProvider>
  );
}
