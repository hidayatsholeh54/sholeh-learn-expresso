import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userService from "../services/userService.js";
import User from "../models/User.js";
import logger from "../config/logger.js";

// register
export const register = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase() || null;
  const password = req.body.password?.trim() || null;

  try {
    logger.info({
      correlation_id: req.correlationId,
      message: "REGISTER request",
      method: req.method,
      path: req.originalUrl,
      email,
    });

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password wajib" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      logger.warn({
        correlation_id: req.correlationId,
        message: "REGISTER failed - user exists",
        email,
      });

      return res.status(400).json({ message: "User sudah ada" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: "user",
    });

    logger.info({
      correlation_id: req.correlationId,
      message: "REGISTER success",
      userId: user.id,
    });

    res.status(201).json({
      message: "Register berhasil",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    logger.error({
      correlation_id: req.correlationId,
      message: "REGISTER error",
      error: err.message,
      email,
    });

    return res.status(500).json({ error: "internal server error" });
  }
};

// login
export const login = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase() || null;
  const password = req.body.password?.trim() || null;

  try {
    logger.info({
      correlation_id: req.correlationId,
      message: "LOGIN attempt",
      method: req.method,
      path: req.originalUrl,
      email,
    });

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password wajib" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn({
        correlation_id: req.correlationId,
        message: "LOGIN failed - user not found",
        email,
      });

      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      logger.warn({
        correlation_id: req.correlationId,
        message: "LOGIN failed - wrong password",
        userId: user.id,
      });

      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    logger.info({
      correlation_id: req.correlationId,
      message: "LOGIN success",
      userId: user.id,
    });

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
    logger.error({
      correlation_id: req.correlationId,
      message: "LOGIN error",
      error: err.message,
      email,
    });

    res.status(500).json({ error: err.message });
  }
};

// change password
export const changePassword = async (req, res) => {
  try {
    logger.info({
      correlation_id: req.correlationId,
      message: "CHANGE PASSWORD request",
      userId: req.user.id,
    });

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
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      logger.warn({
        correlation_id: req.correlationId,
        message: "CHANGE PASSWORD failed - wrong old password",
        userId: user.id,
      });

      return res.status(400).json({ message: "Password lama salah" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    logger.info({
      correlation_id: req.correlationId,
      message: "CHANGE PASSWORD success",
      userId: user.id,
    });

    res.json({ message: "Password berhasil diubah" });
  } catch (err) {
    logger.error({
      correlation_id: req.correlationId,
      message: "CHANGE PASSWORD failed",
      error: err.message,
      userId: req.user?.id,
    });

    res.status(500).json({ error: "internal server error" });
  }
};


export const getProfile = (req, res) => {
  logger.info({
    correlation_id: req.correlationId,
    message: "GET PROFILE",
    userId: req.user.id,
  });
  res.json({
    message: "Berhasil akses profile",
    user: req.user,
  });
};

export const getMe = (req, res) => {
  logger.info({
    correlation_id: req.correlationId,
    message: "GET ME",
    userId: req.user.id,
  });
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
export const getUsers = async (req, res) => {
  try {
    logger.info({
      correlation_id: req.correlationId,
      message: "GET USERS",
      byUser: req.user.id,
    });
    const users = await userService.getUsers();

    res.json(users);
  } catch (err) {
    logger.error({
      correlation_id: req.correlationId,
      message: "GET USERS error",
      error: err.message,
      byUser: req.user?.id,
    });

    res.status(500).json({ message: "internal server error" });
  }
};