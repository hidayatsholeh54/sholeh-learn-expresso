// catatan : kalau 401 itu urusannya sama Authentication (proses ngenalin siapa kamu),
//  sedangkan 403 itu urusannya sama Authorization (proses nentuin kamu boleh ngapain aja).
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Format token salah" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log(err.name);
        console.log(err.message);
        if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired bre, login lagi ya" });
        }
        // User dikenal, tapi dilarang akses rute ini?
        return res.status(403).json({ message: "Token ngaco nih, token tidak invalid" });
    }
}

exports.checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      // User dikenal, tapi dilarang akses rute ini?
      return res.status(403).json({ message: "Akses ditolak" });
    }
    next();
  };
};