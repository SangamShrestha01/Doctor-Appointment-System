import express from "express";
import {
  bookAppointment,
  cancelAppointment,
  getMyAppointments,
  getDoctorAppointments,
  deleteAppointment,  // ✅ add this
} from "../controller/appointment.controller.js";

import { protectedRoutes } from "../middleware/protectedRoutes.js";

const router = express.Router();

// Patient routes
router.post("/", protectedRoutes, bookAppointment);
router.get("/", protectedRoutes, getMyAppointments);
router.patch("/cancel/:appointmentId", protectedRoutes, cancelAppointment);
router.delete("/:appointmentId", protectedRoutes, deleteAppointment); // ✅ new

// Doctor routes
router.get("/doctor", protectedRoutes, getDoctorAppointments);

export default router;