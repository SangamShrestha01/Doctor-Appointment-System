import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getAllAppointments, // ✅ new
  getAllPatients,
  deleteAppointment,     // ✅ new
} from "../controller/admin.controller.js";

import { protectedRoutes, restrictedTo } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.post("/doctors", protectedRoutes, restrictedTo("Admin"), createDoctor);
router.get("/doctors", protectedRoutes, restrictedTo("Admin"), getAllDoctors);
router.get("/doctors/:id", protectedRoutes, restrictedTo("Admin"), getDoctorById);
router.patch("/doctors/:id", protectedRoutes, restrictedTo("Admin"), updateDoctor);
router.delete("/doctors/:id", protectedRoutes, restrictedTo("Admin"), deleteDoctor);

// ✅ new routes
router.get("/appointments", protectedRoutes, restrictedTo("Admin"), getAllAppointments);
router.get("/patients", protectedRoutes, restrictedTo("Admin"), getAllPatients);
router.delete("/appointments/:id", protectedRoutes, restrictedTo("Admin"), deleteAppointment);

export default router;