const express = require("express");
const router = express.Router();
const { createAdmin, updateUser, deleteUser } = require("../controllers/userController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware")
const User = require("../models/user");

// admin
router.post("/create-admin", verifyToken, checkRole("admin"), createAdmin );
router.put("/users/:id", verifyToken, checkRole("admin"), updateUser);
router.delete("/users/:id", verifyToken, checkRole("admin"), deleteUser);

module.exports = router;