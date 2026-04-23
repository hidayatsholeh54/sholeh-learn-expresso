const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userService = require("../services/userService");

// register
exports.register = async (req, res) => {
  try {
    let email = req.body.email?.trim().toLowerCase();
    let password = req.body.password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email & password wajib",
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        message: "User sudah ada",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: "user",
    });

    res.json({
      message: "Register berhasil",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// login
exports.login = async (req, res) => {
  try {
    let email = req.body.email?.trim().toLowerCase();
    let password = req.body.password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email & password wajib",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        message: "Password salah",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// change password
exports.changePassword = async (req, res) => {
  try {
    let oldPassword = req.body.oldPassword?.trim();
    let newPassword = req.body.newPassword?.trim();

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password dan new password wajib diisi",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password baru minimal 6 karakter",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password lama salah",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({
      message: "Password berhasil diubah",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getProfile = (req, res) => {
  res.json({
    message: "Berhasil akses profile",
    user: req.user,
  });
};

exports.getMe = (req, res) => {
  res.json({
    message: "Berhasil ambil data user",
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// get user admin
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};