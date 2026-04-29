import express from "express";
const router = express.Router();

import { 
  register, 
  login, 
  changePassword, 
  getProfile, 
  getMe, 
  getUsers 
} from "../controllers/authController.js";

import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";

// public route
router.post("/register", register);
router.post("/login", login);

// protected route
router.put("/change-password", verifyToken, changePassword);

// profile sederhana
router.get("/profile", verifyToken, getProfile);

// ambil data user dari token
router.get("/me", verifyToken, getMe);

router.get("/admin", verifyToken, checkRole("admin"), (req, res) => {
  res.json({ message: "Welcome admin" });
});

router.get("/users", verifyToken, checkRole("admin"), getUsers);

export default router;