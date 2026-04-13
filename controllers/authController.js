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
        res.json({ message: "Login Berhasil!", token });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};