import express from "express";
import {
  createUser,
  getUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:email", getUserByEmail);
router.put("/:email", updateUser);
router.delete("/:email", deleteUser);

export default router;