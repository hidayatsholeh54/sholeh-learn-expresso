import express from "express";
const router = express.Router();
import {createAdmin, updateUser, deleteUser} from "../controllers/userController.js";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";
import User from "../models/user.js";

// admin
router.post("/create-admin", verifyToken, checkRole("admin"), createAdmin );
router.delete("/:id", verifyToken, checkRole("admin"), deleteUser);
router.put("/:id", verifyToken, checkRole("admin"), updateUser);

export default router;