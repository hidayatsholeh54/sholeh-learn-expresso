const express = require("express");
const router = express.Router();
const { register, login} = require("../controllers/authController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

// public route
router.post("/register", register);
router.post("/login", login);

// admin
router.get("/admin", verifyToken, checkRole("admin"), (req, res) => {
  res.json({ message: "Welcome admin" });
});

// protected route
router.get("/profile", verifyToken, (req, res) => {
    res.json({ message: "Berhasil Akses Profile", user: req.user });
});

module.exports = router;