import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import api from "./api/client.js";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ParticleBackground from "./components/ParticleBackground.jsx";
import ScrollRestoreManager from "./components/ScrollRestoreManager.jsx";
import WebnexLoader from "./components/WebnexLoader.jsx";
import GearboxLoader from "./components/GearboxLoader.jsx";
import { Toaster } from "sonner";
import { ConfirmProvider } from "./context/ConfirmContext.jsx";

// Public Pages (Home loaded eagerly for immediate First Contentful Paint)
import Home from "./pages/Home.jsx";
const Work = lazy(() => import("./pages/Work.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const ServicesPage = lazy(() => import("./pages/ServicesPage.jsx"));
const FAQsPage = lazy(() => import("./pages/FAQsPage.jsx"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage.jsx"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage.jsx"));
const BlogPage = lazy(() => import("./pages/BlogPage.jsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.jsx"));
const ExtensionsPage = lazy(() => import("./pages/ExtensionsPage.jsx"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.jsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.jsx"));

// Admin Protected Pages (Lazy loaded only when an admin authenticates & accesses)
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const Overview = lazy(() => import("./pages/admin/Overview.jsx"));
const Clients = lazy(() => import("./pages/admin/Clients.jsx"));
const ClientDetail = lazy(() => import("./pages/admin/ClientDetail.jsx"));
const Invoices = lazy(() => import("./pages/admin/Invoices.jsx"));
const InvoiceViewPage = lazy(() => import("./pages/admin/InvoiceViewPage.jsx"));
const Contracts = lazy(() => import("./pages/admin/Contracts.jsx"));
const ContractViewPage = lazy(() => import("./pages/admin/ContractViewPage.jsx"));
const WelcomeNotes = lazy(() => import("./pages/admin/WelcomeNotes.jsx"));
const WelcomeNoteViewPage = lazy(() => import("./pages/admin/WelcomeNoteViewPage.jsx"));
const Maintenance = lazy(() => import("./pages/admin/Maintenance.jsx"));
const Reminders = lazy(() => import("./pages/admin/Reminders.jsx"));
const Notes = lazy(() => import("./pages/admin/Notes.jsx"));
const AdminProjects = lazy(() => import("./pages/admin/Projects.jsx"));
const ContactInquiries = lazy(() => import("./pages/admin/ContactInquiries.jsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.jsx"));

// Client Protected Pages
const ClientLayout = lazy(() => import("./pages/client/ClientLayout.jsx"));
const ClientOverview = lazy(() => import("./pages/client/ClientOverview.jsx"));

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
            <Suspense
              fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                  <GearboxLoader label="Loading page..." />
                </div>
              }
            >
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
            </Suspense>
          </div>
          <Footer />
        </div>
      </div>
    </ConfirmProvider>
  );
}
