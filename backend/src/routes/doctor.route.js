import express from 'express'
import { createDoctorProfile, getDoctorById, getDoctors } from '../controller/docotor.controller.js';
import { protectedRoutes, restrictedTo } from '../middleware/protectedRoutes.js';
const router = express.Router();
router.post('/', protectedRoutes, restrictedTo("Doctor"), createDoctorProfile);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);


export default router