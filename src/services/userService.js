import bcrypt from "bcrypt";
import validator from "validator";
import { findByEmail, create, findById, deleteUser as repoDeleteUserr, getAllUsers } from "../repositories/userRepository.js";

export const createAdmin = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email dan Password wajib!");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Format email tidak valid");
  }

  if (password.length < 6) {
    throw new Error("Password minimal 6 karakter");
  }

  const existingUser = await findByEmail(email);

  if (existingUser) {
    throw new Error("User sudah ada!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await create({
    email,
    password: hashedPassword,
    role: "admin",
  });

  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };
};

export const updateUser = async (id, data) => {
  const user = await findById(id);

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  if (data.email) {
    if (!validator.isEmail(data.email)) {
      throw new Error("Format email tidak valid");
    }
    user.email = data.email;
  }

  if (data.role) {
    user.role = data.role;
  }

  await user.save();

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
};

export const deleteUser = async (id, currentUser) => {
  if (currentUser.id === id) {
    throw new Error("Tidak bisa hapus diri sendiri");
  }

  const user = await findById(id);

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  await repoDeleteUserr(user);

  return { message: "User berhasil dihapus" };
};

export const getUsers = async () => {
  return await getAllUsers();
};