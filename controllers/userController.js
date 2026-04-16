const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validasi basic
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password wajib" });
    }

    // cek user sudah ada atau belum
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User sudah ada" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create admin
    const admin = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.json({
      message: "Admin berhasil dibuat",
      data: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // update field (hanya yang dikirim)
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    res.json({
      message: "User berhasil diupdate",
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

// delete user 
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (req.user.id == id) {
      return res.status(400).json({ message: "Tidak bisa hapus diri sendiri" });
    }

    // destroy adalah method milik sequelize untuk menghapus baris data
    await user.destroy();

    res.json({
      message: "User berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};