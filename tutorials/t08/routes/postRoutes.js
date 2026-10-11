import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", getPosts);
router.get("/:postID", getPostById);
router.put("/:postID", updatePost);
router.delete("/:postID", deletePost);

export default router;