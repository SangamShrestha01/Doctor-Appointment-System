import express from "express";
import {
  bookAppointment,
  cancelAppointment,
  getMyAppointments,
  getDoctorAppointments
} from "../controller/appointment.controller.js";

import { protectedRoutes } from "../middleware/protectedRoutes.js";

const router = express.Router();

// Patient routes
router.post("/", protectedRoutes, bookAppointment);
router.get("/", protectedRoutes, getMyAppointments);
router.patch("/cancel/:appointmentId", protectedRoutes, cancelAppointment);

// Doctor routes (FIXED)
router.get("/doctor", protectedRoutes, getDoctorAppointments);

export default router;