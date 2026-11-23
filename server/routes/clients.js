import express from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

// Admin: list all clients (with a summary of their CRM data attached)
router.get("/", requireRole("admin"), (req, res) => {
  const clients = db.get("clients");
  const contracts = db.get("contracts");
  const maintenance = db.get("maintenance");
  const reminders = db.get("reminders");

  const enriched = clients.map((c) => ({
    ...c,
    contractCount: contracts.filter((x) => x.clientId === c.id).length,
    maintenancePlan: maintenance.find((x) => x.clientId === c.id) || null,
    openReminders: reminders.filter((x) => x.clientId === c.id && !x.done).length,
  }));
  res.json(enriched);
});

// Admin: create a client (also creates their portal login)
router.post("/", requireRole("admin"), (req, res) => {
  const { name, email, company, password, notes } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and a starting password are required." });
  }
  const exists = db.findOne("users", (u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(409).json({ error: "A user with this email already exists." });

  const clientId = uuid();
  db.insert("users", {
    id: clientId,
    role: "client",
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString(),
  });
  const client = db.insert("clients", {
    id: clientId,
    name,
    email,
    company: company || "",
    notes: notes || "",
    status: "active",
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(client);
});

// A logged-in client can see their own record; admin can see any
router.get("/:id", (req, res) => {
  if (req.user.role !== "admin" && req.user.id !== req.params.id) {
    return res.status(403).json({ error: "You don't have access to this." });
  }
  const client = db.findOne("clients", (c) => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found." });
  res.json(client);
});

router.put("/:id", requireRole("admin"), (req, res) => {
  const { name, email, company, password, status, notes } = req.body;
  const client = db.findOne("clients", (c) => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found." });

  // If email is changing, verify no collision with another user
  if (email && email.toLowerCase() !== (client.email || "").toLowerCase()) {
    const existingUser = db.findOne(
      "users",
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== client.id
    );
    if (existingUser) {
      return res.status(409).json({ error: "A user with this email already exists." });
    }
  }

  const clientPatch = {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(company !== undefined && { company }),
    ...(status !== undefined && { status }),
    ...(notes !== undefined && { notes }),
  };
  const updated = db.update("clients", req.params.id, clientPatch);

  // Sync to users collection for portal login authentication
  const userPatch = {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
  };
  if (password && typeof password === "string" && password.trim().length > 0) {
    userPatch.passwordHash = bcrypt.hashSync(password.trim(), 10);
  }
  db.update("users", req.params.id, userPatch);

  res.json(updated);
});

router.delete("/:id", requireRole("admin"), (req, res) => {
  db.remove("clients", req.params.id);
  db.remove("users", req.params.id);
  res.status(204).end();
});

export default router;
