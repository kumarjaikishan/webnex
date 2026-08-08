import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ParticleBackground from "./components/ParticleBackground.jsx";

import Home from "./pages/Home.jsx";
import Work from "./pages/Work.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";

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

import ClientLayout from "./pages/client/ClientLayout.jsx";
import ClientOverview from "./pages/client/ClientOverview.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Full-Page Fixed Ambient Particle & 3D Halo Canvas */}
      <ParticleBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Overview />} />
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:id" element={<ClientDetail />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="contracts" element={<Contracts />} />
              <Route path="welcome-notes" element={<WelcomeNotes />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="notes" element={<Notes />} />
              <Route path="projects" element={<AdminProjects />} />
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
