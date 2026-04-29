import bcrypt from "bcrypt";
import User from "../models/user.js";
import * as userService from "../services/userService.js";

// create admin
export const createAdmin = async (req, res) => {
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
export const updateUser = async (req, res) => {
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
export const deleteUser = async (req, res) => {
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