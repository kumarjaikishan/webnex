// Run with: npm run seed
// Seeds admin user with bcrypt hashed password to MongoDB (if configured) & data/db.json
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const adminEmail = process.env.ADMIN_EMAIL || "kumar.jaikishan0@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Dev@4880";
const passwordHash = bcrypt.hashSync(adminPassword, 10);

async function seed() {
  console.log("🌱 Starting Webnex DB Seeder...");
  console.log(`🔑 Target Admin Email: ${adminEmail}`);

  // 1. JSON Local DB Seeding / Update
  let currentData = { users: [], projects: [], clients: [], contracts: [], maintenance: [], reminders: [], notes: [], messages: [] };
  if (fs.existsSync(DB_PATH)) {
    try {
      currentData = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    } catch (e) {}
  }

  currentData.users = currentData.users || [];
  const existingIndex = currentData.users.findIndex(u => u.email.toLowerCase() === adminEmail.toLowerCase() || u.role === "admin");
  const adminDoc = {
    id: existingIndex >= 0 ? currentData.users[existingIndex].id : uuid(),
    role: "admin",
    name: "Webnex Admin",
    email: adminEmail,
    passwordHash: passwordHash,
    createdAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    currentData.users[existingIndex] = adminDoc;
  } else {
    currentData.users.push(adminDoc);
  }

  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(currentData, null, 2));
  console.log("✅ Seeded JSON Database file at", DB_PATH);

  // 2. MongoDB Cloud Seeding (if mongoUri present)
  const mongoUri = process.env.db || process.env.MONGODB_URI || process.env.MONGO_URI;
  if (mongoUri) {
    try {
      console.log("⚡ Connecting to MongoDB Cloud...");
      await mongoose.connect(mongoUri);
      const dbCollection = mongoose.connection.collection("users");
      
      await dbCollection.updateOne(
        { email: adminEmail.toLowerCase() },
        {
          $set: {
            id: adminDoc.id,
            role: "admin",
            name: "Webnex Admin",
            email: adminEmail.toLowerCase(),
            passwordHash: passwordHash,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          }
        },
        { upsert: true }
      );
      console.log("✅ Seeded MongoDB Cloud database user successfully!");
      await mongoose.disconnect();
    } catch (err) {
      console.warn("⚠️ MongoDB cloud seed error:", err.message);
    }
  }

  console.log(`\n🎉 Admin Ready:`);
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Hash:     ${passwordHash.slice(0, 15)}... (bcrypt hashed)\n`);
}

seed();
