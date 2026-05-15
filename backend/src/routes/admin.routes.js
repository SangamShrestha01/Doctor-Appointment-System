import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controller/admin.controller.js";

import { protectedRoutes, restrictedTo } from "../middleware/protectedRoutes.js";

const router = express.Router();

/* =========================================================
   CREATE DOCTOR (ADMIN ONLY)
========================================================= */
router.post(
  "/doctors",
  protectedRoutes,
  restrictedTo("Admin"),
  createDoctor
);

/* =========================================================
   GET ALL DOCTORS (ADMIN ONLY)
========================================================= */
router.get(
  "/doctors",
  protectedRoutes,
  restrictedTo("Admin"),
  getAllDoctors
);

/* =========================================================
   GET SINGLE DOCTOR (ADMIN ONLY)
========================================================= */
router.get(
  "/doctors/:id",
  protectedRoutes,
  restrictedTo("Admin"),
  getDoctorById
);

/* =========================================================
   UPDATE DOCTOR (ADMIN ONLY)
========================================================= */
router.patch(
  "/doctors/:id",
  protectedRoutes,
  restrictedTo("Admin"),
  updateDoctor
);

/* =========================================================
   DELETE DOCTOR (ADMIN ONLY)
========================================================= */
router.delete(
  "/doctors/:id",
  protectedRoutes,
  restrictedTo("Admin"),
  deleteDoctor
);

export default router;