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

// Change Password Endpoint (Protected)
router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters." });
  }

  const user = db.findOne("users", (u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User account not found." });
  }

  const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: "Current password does not match." });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.update("users", user.id, { passwordHash: newHash });

  // If MongoDB is connected, update MongoDB users collection as well
  if (db.isMongoConnected()) {
    try {
      const mongoose = (await import("mongoose")).default;
      await mongoose.connection.collection("users").updateOne(
        { id: user.id },
        { $set: { passwordHash: newHash, updatedAt: new Date() } }
      );
    } catch (e) {
      console.warn("Could not sync updated password to MongoDB:", e.message);
    }
  }

  res.json({ ok: true, message: "Password updated successfully!" });
});

export default router;
