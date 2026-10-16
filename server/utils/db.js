import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.db || process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ [Webnex DB] FATAL: 'db' connection string is missing in server/.env!");
  process.exit(1);
}

// In-memory cache synced directly with MongoDB Cloud for ultra-fast synchronous route compatibility
let memoryCache = {
  users: [],
  projects: [],
  clients: [],
  contracts: [],
  maintenance: [],
  reminders: [],
  notes: [],
  invoices: [],
  messages: [],
  settings: [],
};

let isConnected = false;

// Connect to MongoDB Atlas
export async function connectMongo() {
  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log("⚡ [Webnex DB] Connected directly to MongoDB Atlas Cloud!");

    const nativeDb = mongoose.connection.db;

    // Load existing collections into cache
    const collections = [
      "users",
      "projects",
      "clients",
      "contracts",
      "maintenance",
      "reminders",
      "notes",
      "invoices",
      "messages",
      "settings",
    ];

    for (const colName of collections) {
      try {
        const records = await nativeDb.collection(colName).find({}).toArray();
        memoryCache[colName] = records.map((doc) => {
          const { _id, ...rest } = doc;
          return { id: doc.id || _id.toString(), ...rest };
        });
      } catch (err) {
        memoryCache[colName] = [];
      }
    }

    // Ensure Initial Admin exists in MongoDB
    const adminEmail = process.env.ADMIN_EMAIL || "kumar.jaikishan0@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Dev@4880";
    const existingAdmin = memoryCache.users.find(
      (u) => u.email.toLowerCase() === adminEmail.toLowerCase() || u.role === "admin"
    );

    if (!existingAdmin) {
      const adminDoc = {
        id: uuid(),
        role: "admin",
        name: "Webnex Admin",
        email: adminEmail.toLowerCase(),
        passwordHash: bcrypt.hashSync(adminPassword, 10),
        createdAt: new Date().toISOString(),
      };
      await nativeDb.collection("users").insertOne(adminDoc);
      memoryCache.users.push(adminDoc);
      console.log(`✅ [Webnex DB] Seeded initial admin (${adminEmail}) in MongoDB Cloud.`);
    }

    // Ensure initial projects exist in MongoDB if empty
    if (memoryCache.projects.length === 0) {
      const initialProjects = [
        {
          id: "proj-riseown",
          title: "RISEOWN — Custom Enterprise Retail & Real Estate ERP",
          summary: "Custom enterprise ERP engineered for a private commercial client, covering retail POS, property plot bookings, WebSockets wireless scanner, multi-tier sponsor commissions & automated bilingual legal contract generation.",
          tags: ["React", "Node.js", "MongoDB", "Socket.IO", "jsPDF"],
          coverColor: "#0284C7",
          liveUrl: "",
          featured: true,
          order: 1,
        },
        {
          id: uuid(),
          title: "GoodFeel Merchandise — Health & Wellness E-Commerce",
          summary: "High-performance direct-to-consumer storefront with rapid checkout flow, catalog inventory management, and automated client invoicing.",
          tags: ["React", "TailwindCSS", "Node.js", "Express"],
          coverColor: "#3A6B63",
          liveUrl: "",
          featured: true,
          order: 2,
        },
      ];
      await nativeDb.collection("projects").insertMany(initialProjects);
      memoryCache.projects = initialProjects;
    }

    console.log("🚀 [Webnex DB] All data loaded from MongoDB Cloud into active engine.");
  } catch (err) {
    console.error("❌ [Webnex DB] MongoDB Cloud Connection Error:", err.message);
  }
}

// Auto-connect immediately
connectMongo();

// Helper to write changes to MongoDB Cloud asynchronously in the background
function syncToMongo(action, collection, payload, id = null) {
  if (!isConnected || !mongoose.connection.db) return;
  const col = mongoose.connection.db.collection(collection);

  if (action === "insert") {
    col.insertOne(payload).catch((err) => console.error(`MongoDB insert error in ${collection}:`, err.message));
  } else if (action === "update") {
    col.updateOne({ id }, { $set: payload }, { upsert: true }).catch((err) =>
      console.error(`MongoDB update error in ${collection}:`, err.message)
    );
  } else if (action === "remove") {
    col.deleteOne({ id }).catch((err) => console.error(`MongoDB delete error in ${collection}:`, err.message));
  } else if (action === "saveAll") {
    col.deleteMany({})
      .then(() => (payload.length > 0 ? col.insertMany(payload) : null))
      .catch((err) => console.error(`MongoDB saveAll error in ${collection}:`, err.message));
  }
}

// 100% Online MongoDB Database API — perfectly compatible with all existing routes!
export const db = {
  get: (collection) => {
    return memoryCache[collection] || [];
  },

  getAll: () => {
    return memoryCache;
  },

  save: (collection, records) => {
    memoryCache[collection] = records;
    syncToMongo("saveAll", collection, records);
    return records;
  },

  insert: (collection, record) => {
    if (!memoryCache[collection]) memoryCache[collection] = [];
    memoryCache[collection].push(record);
    syncToMongo("insert", collection, record);
    return record;
  },

  update: (collection, id, patch) => {
    const list = memoryCache[collection] || [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...patch };
    syncToMongo("update", collection, patch, id);
    return list[idx];
  },

  remove: (collection, id) => {
    if (!memoryCache[collection]) return true;
    memoryCache[collection] = memoryCache[collection].filter((r) => r.id !== id);
    syncToMongo("remove", collection, null, id);
    return true;
  },

  findOne: (collection, predicateFn) => {
    return (memoryCache[collection] || []).find(predicateFn) || null;
  },

  isMongoConnected: () => isConnected,
};
