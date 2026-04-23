const bcrypt = require("bcrypt");
const User = require("../models/user");
const userService = require("../services/userService");

// create admin
exports.createAdmin = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    const result = await userService.createAdmin(email, password);

    res.json({
      message: "Admin berhasil dibuat",
      data: result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// update user
exports.updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const email = req.body.email?.trim().toLowerCase();
    const role = req.body.role?.trim();

    const result = await userService.updateUser(id, { email, role });

    res.json({
      message: "User berhasil diupdate",
      user: result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const result = await userService.deleteUser(id, req.user);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};