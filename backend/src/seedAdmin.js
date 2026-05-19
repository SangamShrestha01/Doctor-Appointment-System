import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

import { User } from "./model/user.model.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to DB");

    const existing = await User.findOne({ email: "admin@clinic.com" });
    if (existing) {
      console.log("⚠️  Admin already exists. Skipping.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@clinic.com",
      password: hashedPassword,
      role: "Admin",
      address: "Admin Office",
    });

    console.log("✅ Admin seeded successfully!");
    console.log("   Email:    admin@clinic.com");
    console.log("   Password: admin123");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seedAdmin();