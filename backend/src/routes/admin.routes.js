import express from "express";
import multer from "multer";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getAllAppointments,
  getAllPatients,
  deleteAppointment,
} from "../controller/admin.controller.js";
import { protectedRoutes, restrictedTo } from "../middleware/protectedRoutes.js";

const router = express.Router();

// ✅ Multer — memory storage works with your existing dataUri + Cloudinary setup
const upload = multer({ storage: multer.memoryStorage() });

// Doctors
router.post("/doctors", protectedRoutes, restrictedTo("Admin"), upload.single("image"), createDoctor);  // ✅ upload added
router.get("/doctors", protectedRoutes, restrictedTo("Admin"), getAllDoctors);
router.get("/doctors/:id", protectedRoutes, restrictedTo("Admin"), getDoctorById);
router.patch("/doctors/:id", protectedRoutes, restrictedTo("Admin"), updateDoctor);
router.delete("/doctors/:id", protectedRoutes, restrictedTo("Admin"), deleteDoctor);

// Appointments
router.get("/appointments", protectedRoutes, restrictedTo("Admin"), getAllAppointments);
router.delete("/appointments/:id", protectedRoutes, restrictedTo("Admin"), deleteAppointment);

// Patients
router.get("/patients", protectedRoutes, restrictedTo("Admin"), getAllPatients);

export default router;