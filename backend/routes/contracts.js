import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

function scoped(req) {
  const all = db.get("contracts");
  if (req.user.role === "admin") return all;
  return all.filter((c) => c.clientId === req.user.id);
}

router.get("/", (req, res) => res.json(scoped(req)));

router.post("/", requireRole("admin"), (req, res) => {
  const { clientId, title, scope, amount, status } = req.body;
  if (!clientId || !title) return res.status(400).json({ error: "Client and title are required." });
  const contract = db.insert("contracts", {
    id: uuid(),
    clientId,
    title,
    scope: scope || "",
    amount: amount || 0,
    status: status || "draft", // draft | sent | signed
    issuedAt: new Date().toISOString(),
  });
  res.status(201).json(contract);
});

router.put("/:id", requireRole("admin"), (req, res) => {
  const updated = db.update("contracts", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Contract not found." });
  res.json(updated);
});

router.delete("/:id", requireRole("admin"), (req, res) => {
  db.remove("contracts", req.params.id);
  res.status(204).end();
});

export default router;
