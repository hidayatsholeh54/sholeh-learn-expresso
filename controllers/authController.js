const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.register = async (req, res) => {
    try {
        const {email, password} = req.body;

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
        });
        res.json({ message: "Register berhasil", user });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        // compare password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(400).json({
                message: "Password salah"
            });
        }

        // buat token
        const token = jwt.sign({
            id: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: "1d"}
        );
        res.json({ message: "Login Berhasil!", token, user: { id: user.id, email:user.email, role: user.role }});
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

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

// change password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // validasi input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message:"Old password dan new password wajib diisi" })
        }

        // ambil user dari middleware (req.user)
        const user = await User.findByPk(id);

        if(!user) {
            return res.status(400).json({ message: "user tidak ditemukan" });
        }

        // check password lama 
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        console.log(isMatch, "match password");

        if (!isMatch) {
            return res.status(400).json({ message: "Password lama salah" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

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