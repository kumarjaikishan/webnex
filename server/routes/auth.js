import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.findOne("users", (u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user || !bcrypt.compareSync(password || "", user.passwordHash)) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }
  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { id: user.id, role: user.role, name: user.name, email: user.email },
  });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
