// catatan : kalau 401 itu urusannya sama Authentication (proses ngenalin siapa kamu),
//  sedangkan 403 itu urusannya sama Authorization (proses nentuin kamu boleh ngapain aja).
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import redisClient from "../config/redis.js";
import logger from "../config/logger.js";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Format token salah" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // cek cache Redis
        const cachedUser = await redisClient.get(`user:${decoded.id}`);
        
        if (cachedUser) {
            logger.info({
                correlation_id: req.correlationId,
                message: "CACHE HIT",
                userId: decoded.id,
            });
            req.user = JSON.parse(cachedUser);
            return next();
        }

        // fallback DB
        logger.info({
            correlation_id: req.correlationId,
            message: "CACHE MISS - querying DB",
            userId: decoded.id,
        });

        const user = await User.findByPk(decoded.id);

        if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
        }

        await redisClient.set(`user:${user.id}`, JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
        }), {
            EX: 60 // cache selama 1 menit (testing)
        })

        req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        };

        next();
    } catch (err) {
        logger.error({
            correlation_id: req.correlationId,
            message: "JWT ERROR",
            error: err.message,
        });
        if (err.name === "TokenExpiredError") {
        return res.status(401).json({ correlation_id: req.correlationId,message: "Token expired bre, login lagi ya" });
        }
        // User dikenal, tapi dilarang akses rute ini?
        return res.status(403).json({ correlation_id: req.correlationId, message: "Token ngaco nih, token tidak invalid" });
    }
}

export const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      // User dikenal, tapi dilarang akses rute ini?
      return res.status(403).json({ correlation_id: req.correlationId, message: "Akses ditolak" });
    }
    next();
  };
};