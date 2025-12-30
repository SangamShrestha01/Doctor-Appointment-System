import express from "express";
import { login, register } from "../controller/auth.controller.js";
import { imageUpload } from "../middleware/multer.js";
import { protectedRoutes } from "../middleware/protectedRoutes.js";
const router = express.Router();


router.post('/register', imageUpload, register)
router.post('/login', login)


export default router;