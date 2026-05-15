import express from "express";
import { getMyProfile, updateMyProfile } from "../controller/user.controller.js";
import { protectedRoutes } from "../middleware/protectedRoutes.js";
import { imageUpload } from "../middleware/multer.js";

const router = express.Router();

router.get("/me", protectedRoutes, getMyProfile);
router.patch("/me", protectedRoutes, imageUpload, updateMyProfile);

export default router;
