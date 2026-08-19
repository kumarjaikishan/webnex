import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import clientRoutes from "./routes/clients.js";
import contractRoutes from "./routes/contracts.js";
import maintenanceRoutes from "./routes/maintenance.js";
import reminderRoutes from "./routes/reminders.js";
import noteRoutes from "./routes/notes.js";
import contactRoutes from "./routes/contact.js";
import invoiceRoutes from "./routes/invoices.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/settings", settingsRoutes);

// Root Health & Welcome Check (for Render URL check in browser: e.g. https://your-app.onrender.com)
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "Webnex Devfolio API is online and running!",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Detailed API Health Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Webnex Devfolio Backend",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our end." });
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
}

export default app;
