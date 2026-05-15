import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./database.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import doctorRoutes from "./routes/doctor.route.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import postRoutes from "./routes/post.router.js";
import adminRoutes from "./routes/admin.routes.js";

import { ErrorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();

connectDB();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ROUTES (IMPORTANT ORDER DOES NOT MATTER HERE)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

// error handler
app.use(ErrorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});