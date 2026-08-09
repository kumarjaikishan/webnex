// Run with: npm run seed
// Creates data/db.json with an admin user + sample portfolio projects.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const adminEmail = process.env.ADMIN_EMAIL || "jai@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Jai@4880";

const data = {
  users: [
    {
      id: uuid(),
      role: "admin",
      name: "Studio Admin",
      email: adminEmail,
      passwordHash: bcrypt.hashSync(adminPassword, 10),
      createdAt: new Date().toISOString(),
    },
  ],
  projects: [
    {
      id: uuid(),
      title: "Aster Bakery — E-commerce Rebuild",
      summary: "Headless storefront, 40% faster checkout, custom CMS for seasonal menus.",
      tags: ["React", "Node.js", "Stripe"],
      coverColor: "#3A6B63",
      liveUrl: "",
      featured: true,
      order: 1,
    },
    {
      id: uuid(),
      title: "Northline Logistics — Ops Dashboard",
      summary: "Real-time fleet tracking dashboard replacing three spreadsheets.",
      tags: ["React", "WebSocket", "PostgreSQL"],
      coverColor: "#E8A33D",
      liveUrl: "",
      featured: true,
      order: 2,
    },
    {
      id: uuid(),
      title: "Fable & Co — Brand Portfolio",
      summary: "Design-forward marketing site with CMS-driven case studies.",
      tags: ["Next.js", "Sanity", "Framer Motion"],
      coverColor: "#8B93A1",
      liveUrl: "",
      featured: false,
      order: 3,
    },
  ],
  clients: [],
  contracts: [],
  maintenance: [],
  reminders: [],
  notes: [],
  messages: [],
};

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
console.log("✅ Seeded database at", DB_PATH);
console.log(`   Admin login → ${adminEmail} / ${adminPassword}`);
