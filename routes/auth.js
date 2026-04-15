const express = require("express");
const router = express.Router();
const { register, login, createAdmin, updateUser, deleteUser, changePassword} = require("../controllers/authController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
const User = require("../models/user");

// public route
router.post("/register", register);
router.post("/login", login);

// admin
router.post("/create-admin", verifyToken, checkRole("admin"), createAdmin );
router.put("/users/:id", verifyToken, checkRole("admin"), updateUser);
router.delete("/users/:id", verifyToken, checkRole("admin"), deleteUser);
router.put("/change-password", verifyToken, changePassword);

router.get("/admin", verifyToken, checkRole("admin"), (req, res) => {
  res.json({ message: "Welcome admin" });
});

// protected route
router.get("/profile", verifyToken, (req, res) => {
    res.json({ message: "Berhasil Akses Profile", user: req.user });
});

// ambil data user berdasarkan token masuk
router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Berhasil ambil data user",
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  })
})

// 
router.get("/users", verifyToken, checkRole("admin"), async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "email", "role"],
  });

  res.json(users);
});

module.exports = router;