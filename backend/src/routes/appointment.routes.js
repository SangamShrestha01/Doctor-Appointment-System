import { bookAppointment, getMyAppointments } from "../controller/appointment.controller.js";
import { protectedRoutes } from "../middleware/protectedRoutes.js";
import express from "express";

const router = express.Router();
router.post("/", protectedRoutes, bookAppointment);
router.get("/", protectedRoutes, getMyAppointments);

export default router