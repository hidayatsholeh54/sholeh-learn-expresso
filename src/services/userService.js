const bcrypt = require("bcrypt");
const validator = require("validator");
const userRepository = require("../repositories/userRepository");

exports.createAdmin = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email dan Password wajib!");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Format email tidak valid");
  }

  if (password.length < 6) {
    throw new Error("Password minimal 6 karakter");
  }

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("User sudah ada!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await userRepository.create({
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

exports.updateUser = async (id, data) => {
  const user = await userRepository.findById(id);

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

exports.deleteUser = async (id, currentUser) => {
  if (currentUser.id === id) {
    throw new Error("Tidak bisa hapus diri sendiri");
  }

  const user = await userRepository.findById(id);

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  await userRepository.delete(user);

  return { message: "User berhasil dihapus" };
};

exports.getUsers = async () => {
  return await userRepository.getAllUsers();
};