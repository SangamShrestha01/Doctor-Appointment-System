import express from "express";
import { createPost, getPosts, getPost, deletePost, updatePost } from "../controller/post.controller.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.delete("/:id", deletePost);
router.patch("/:id", updatePost);

export default router;