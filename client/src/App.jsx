import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import api from "./api/client.js";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ParticleBackground from "./components/ParticleBackground.jsx";
import ScrollRestoreManager from "./components/ScrollRestoreManager.jsx";
import WebnexLoader from "./components/WebnexLoader.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Overview from "./pages/admin/Overview.jsx";
import Clients from "./pages/admin/Clients.jsx";
import ClientDetail from "./pages/admin/ClientDetail.jsx";
import Invoices from "./pages/admin/Invoices.jsx";
import Contracts from "./pages/admin/Contracts.jsx";
import WelcomeNotes from "./pages/admin/WelcomeNotes.jsx";
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
  const [backgroundStyle, setBackgroundStyle] = useState("cyber_grid");

  useEffect(() => {
    // Initial fetch from settings via configured Axios client
    api.get("/settings")
      .then((res) => {
        if (res.data?.backgroundStyle) {
          setBackgroundStyle(res.data.backgroundStyle);
        }
      })
      .catch(() => {});

    // Listen for real-time backgroundStyle updates from Admin Settings
    const handleBgUpdate = (e) => {
      if (e.detail?.backgroundStyle) {
        setBackgroundStyle(e.detail.backgroundStyle);
      }
    };
    window.addEventListener("webnex:backgroundStyle", handleBgUpdate);
    return () => window.removeEventListener("webnex:backgroundStyle", handleBgUpdate);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {isLoading && <WebnexLoader onFinish={() => setIsLoading(false)} />}
      <ScrollRestoreManager />
      <ToastContainer position="bottom-right" theme="dark" autoClose={4000} />
      {/* Full-Page Fixed Ambient Particle & 3D Halo Canvas */}
      <ParticleBackground style={backgroundStyle} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
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

            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Overview />} />
              <Route path="inquiries" element={<ContactInquiries />} />
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:id" element={<ClientDetail />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="contracts" element={<Contracts />} />
              <Route path="welcome-notes" element={<WelcomeNotes />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="notes" element={<Notes />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="/portal" element={<ProtectedRoute role="client"><ClientLayout /></ProtectedRoute>}>
              <Route index element={<ClientOverview />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}
