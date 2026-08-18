import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial JSON file structure template
function getInitialData() {
  const adminEmail = process.env.ADMIN_EMAIL || "kumar.jaikishan0@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Dev@4880";
  return {
    users: [
      {
        id: uuid(),
        role: "admin",
        name: "Webnex Admin",
        email: adminEmail,
        passwordHash: bcrypt.hashSync(adminPassword, 10),
        createdAt: new Date().toISOString(),
      },
    ],
    projects: [
      {
        id: uuid(),
        title: "Webnex Enterprise Suite",
        summary: "Custom CRM & Lead Generation Platform with high conversion rate.",
        tags: ["React", "Node.js", "MongoDB"],
        coverColor: "#3A6B63",
        liveUrl: "https://webnexlabs.com",
        featured: true,
        order: 1,
      },
      {
        id: uuid(),
        title: "Nova Financial — Payment Portal",
        summary: "Automated billing and real-time payment reminder integration.",
        tags: ["React", "Express", "Stripe"],
        coverColor: "#E8A33D",
        liveUrl: "",
        featured: true,
        order: 2,
      },
    ],
    clients: [],
    contracts: [],
    maintenance: [],
    reminders: [],
    notes: [],
    invoices: [],
    contactSubmissions: [],
  };
}

function readDB() {
  const adminEmail = process.env.ADMIN_EMAIL || "kumar.jaikishan0@gmail.com";
  const defaultAdminPassword = process.env.ADMIN_PASSWORD || "Dev@4880";
  const defaultUser = {
    id: uuid(),
    role: "admin",
    name: "Webnex Admin",
    email: adminEmail,
    passwordHash: bcrypt.hashSync(defaultAdminPassword, 10),
    createdAt: new Date().toISOString(),
  };

  if (!fs.existsSync(DB_PATH)) {
    const initial = getInitialData();
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    } catch (err) {
      console.warn("Could not write initial db.json (read-only environment):", err.message);
    }
    return initial;
  }
  try {
    const content = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(content);
    // Ensure admin user exists in JSON DB
    if (!parsed.users || !parsed.users.some(u => u.email.toLowerCase() === adminEmail.toLowerCase())) {
      parsed.users = parsed.users || [];
      parsed.users.push(defaultUser);
      try {
        fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2));
      } catch (e) {
        // Read-only filesystem ignore
      }
    }
    return parsed;
  } catch (err) {
    console.error("Error reading db.json, returning fallback initial data...", err.message);
    return getInitialData();
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn("Could not persist to db.json (read-only filesystem):", err.message);
  }
}


// MongoDB Connection Setup
const mongoUri = process.env.db || process.env.MONGODB_URI || process.env.MONGO_URI;
let isMongoConnected = false;

if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(async () => {
      isMongoConnected = true;
      console.log("⚡ [Webnex DB] Successfully connected to MongoDB Cloud!");

      // Sync Admin User in MongoDB
      try {
        const adminEmail = process.env.ADMIN_EMAIL || "kumar.jaikishan0@gmail.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Dev@4880";
        const usersCollection = mongoose.connection.collection("users");
        const existingAdmin = await usersCollection.findOne({ email: adminEmail.toLowerCase() });
        if (!existingAdmin) {
          await usersCollection.insertOne({
            id: uuid(),
            role: "admin",
            name: "Webnex Admin",
            email: adminEmail.toLowerCase(),
            passwordHash: bcrypt.hashSync(adminPassword, 10),
            createdAt: new Date(),
          });
          console.log(`⚡ [Webnex DB] Seeded admin (${adminEmail}) to MongoDB.`);
        }
      } catch (e) {
        console.warn("⚠️ Could not auto-sync admin to MongoDB:", e.message);
      }
    })
    .catch((err) => {
      console.warn("⚠️ [Webnex DB] MongoDB Connection Notice:", err.message);
      console.log("⚡ [Webnex DB] Fallback JSON Storage Active.");
    });
} else {
  console.log("⚡ [Webnex DB] JSON Storage Active (No db connection string in .env).");
}

export const db = {
  get: (collection) => readDB()[collection] || [],
  getAll: () => readDB(),
  save: (collection, records) => {
    const data = readDB();
    data[collection] = records;
    writeDB(data);
    return records;
  },
  insert: (collection, record) => {
    const data = readDB();
    if (!data[collection]) data[collection] = [];
    data[collection].push(record);
    writeDB(data);
    return record;
  },
  update: (collection, id, patch) => {
    const data = readDB();
    const idx = (data[collection] || []).findIndex((r) => r.id === id);
    if (idx === -1) return null;
    data[collection][idx] = { ...data[collection][idx], ...patch };
    writeDB(data);
    return data[collection][idx];
  },
  remove: (collection, id) => {
    const data = readDB();
    data[collection] = (data[collection] || []).filter((r) => r.id !== id);
    writeDB(data);
    return true;
  },
  findOne: (collection, predicateFn) => {
    return readDB()[collection]?.find(predicateFn) || null;
  },
  isMongoConnected: () => isMongoConnected,
};
