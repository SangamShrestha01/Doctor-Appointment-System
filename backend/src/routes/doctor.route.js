import express from "express";

import {
  createDoctorProfile,
  getDoctorById,
  getDoctors,
  updateDoctorProfile,
  doctorDashboard,
} from "../controller/doctor.controller.js";

import {
  protectedRoutes,
  restrictedTo,
} from "../middleware/protectedRoutes.js";

import { imageUpload } from "../middleware/multer.js";

const router = express.Router();

/* =========================
   PUBLIC ROUTES
   ========================= */

// Get all doctors (public listing)
router.get("/", getDoctors);

/* =========================
   DOCTOR ONLY ROUTES
   ✅ FIXED: Specific routes BEFORE /:id
   ========================= */

// Doctor dashboard
router.get(
  "/dashboard",
  protectedRoutes,
  restrictedTo("Doctor"),
  doctorDashboard
);

// Create doctor profile
router.post(
  "/profile",
  protectedRoutes,
  restrictedTo("Doctor"),
  imageUpload,
  createDoctorProfile
);

// Update doctor profile
router.patch(
  "/profile",
  protectedRoutes,
  restrictedTo("Doctor"),
  imageUpload,
  updateDoctorProfile
);

/* =========================
   PUBLIC DYNAMIC ROUTE
   ✅ FIXED: /:id LAST so it doesn't swallow /dashboard or /profile
   ========================= */

// Get single doctor by ID
router.get("/:id", getDoctorById);

export default router;