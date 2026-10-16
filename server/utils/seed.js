// Run with: npm run seed
// Seeds admin user and initial data purely to MongoDB Cloud
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL || "kumar.jaikishan0@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Jai@4880";
const passwordHash = bcrypt.hashSync(adminPassword, 10);
const mongoUri = process.env.db || process.env.MONGODB_URI || process.env.MONGO_URI;

async function seed() {
  console.log("🌱 Starting Webnex MongoDB Cloud Seeder...");
  console.log(`🔑 Target Admin Email: ${adminEmail}`);

  if (!mongoUri) {
    console.error("❌ 'db' connection string is not set in server/.env");
    process.exit(1);
  }

  try {
    console.log("⚡ Connecting to MongoDB Cloud...");
    await mongoose.connect(mongoUri);
    const dbCollection = mongoose.connection.collection("users");

    await dbCollection.updateOne(
      { email: adminEmail.toLowerCase() },
      {
        $set: {
          id: uuid(),
          role: "admin",
          name: "Webnex Admin",
          email: adminEmail.toLowerCase(),
          passwordHash: passwordHash,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log("✅ Seeded MongoDB Cloud database admin user successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("⚠️ MongoDB cloud seed error:", err.message);
    process.exit(1);
  }

  console.log(`\n🎉 Admin Ready in MongoDB Cloud:`);
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Hash:     ${passwordHash.slice(0, 15)}... (bcrypt hashed)\n`);
}

seed();
