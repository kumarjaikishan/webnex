import "dotenv/config";
import { connectDB } from "./config/db.js";
import { Service } from "./models/Service.js";
import { Testimonial } from "./models/Testimonial.js";
import { Project } from "./models/Project.js";
import { FAQ } from "./models/FAQ.js";
import mongoose from "mongoose";

async function seed() {
  await connectDB();

  await Promise.all([Service.deleteMany({}), Testimonial.deleteMany({}), Project.deleteMany({}), FAQ.deleteMany({})]);

  await Service.insertMany([
    { title: "Business Websites", description: "Fast, modern websites that establish credibility and turn visitors into inquiries.", icon: "Globe", category: "core", order: 1 },
    { title: "School ERP Systems", description: "Admissions, attendance, fees and communication in one connected platform.", icon: "GraduationCap", category: "business-systems", order: 2 },
    { title: "Hospital Management", description: "Patient records, appointments and billing built for clinics and hospitals.", icon: "HeartPulse", category: "business-systems", order: 3 },
    { title: "SEO Optimization", description: "On-page and technical SEO that helps the right customers find you.", icon: "Search", category: "growth", order: 4 },
  ]);

  await Testimonial.insertMany([
    { name: "Rakesh Verma", role: "Owner", business: "Verma Electronics", location: "Bihar Sharif", rating: 5, review: "Lumix Digital built our business website in less than three weeks. Inquiries from Google started coming in within the first month." },
    { name: "Dr. Anjali Singh", role: "Director", business: "Singh Multi-Speciality Clinic", location: "Nalanda", rating: 5, review: "The appointment and patient management system they built has genuinely simplified how our front desk works every single day." },
  ]);

  await Project.insertMany([
    {
      slug: "battlefiesta",
      title: "BattleFiesta",
      tagline: "Esports Tournament Platform",
      tags: ["Authentication", "Tournament Management", "Real-time Updates", "Responsive"],
      problem: "The client needed a platform to run competitive esports tournaments with live bracket updates.",
      solution: "We built a full tournament management system with secure authentication and real-time score updates.",
      technology: ["React", "Node.js", "MongoDB", "Socket.io"],
      businessImpact: "Enabled the client to run multiple simultaneous tournaments with zero manual bracket management.",
    },
  ]);

  await FAQ.insertMany([
    { question: "Which areas does Lumix Digital serve?", answer: "We work with businesses across Bihar Sharif, Nalanda, Patna, Rajgir, Nawada, Gaya, Sheikhpura and the rest of Bihar, as well as remote clients across India.", category: "General", order: 1 },
    { question: "How much does a business website cost?", answer: "Pricing depends on scope and features. Our Business Website plan starts from ₹24,999.", category: "Pricing", order: 2 },
  ]);

  console.log("Database seeded successfully.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
