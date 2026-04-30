import * as userService from "../services/userService.js";
import logger from "../config/logger.js";

// create admin
export const createAdmin = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase() || null;
    const password = req.body.password?.trim() || null;

    logger.info({
      correlation_id: req.correlationId,
      message: "CREATE ADMIN request",
      method: req.method,
      path: req.originalUrl,
      email,
    });

    const result = await userService.createAdmin(email, password);

    logger.info({
      correlation_id: req.correlationId,
      message: "CREATE ADMIN success",
      method: req.method,
      path: req.originalUrl,
      userId: result.id,
    });

    res.status(201).json({
      message: "Admin berhasil dibuat",
      data: result,
    });
  } catch (err) {
    logger.error({
      correlation_id: req.correlationId,
      message: "CREATE ADMIN failed",
      method: req.method,
      path: req.originalUrl,
      error: err.message,
      email,
      byUser: req.user?.id,
    });

    res.status(400).json({ message: err.message });
  }
};

// update user
export const updateUser = async (req, res) => {
  let id;

  try {
    id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const email = req.body.email?.trim().toLowerCase() || null;
    const role = req.body.role?.trim() || null;

    logger.info({
      correlation_id: req.correlationId,
      message: "UPDATE USER request",
      method: req.method,
      path: req.originalUrl,
      targetUserId: id,
      byUser: req.user.id,
    });

    const result = await userService.updateUser(id, { email, role });

    logger.info({
      correlation_id: req.correlationId,
      message: "UPDATE USER success",
      method: req.method,
      path: req.originalUrl,
      targetUserId: id,
    });

    res.status(200).json({
      message: "User berhasil diupdate",
      user: result,
    });
  } catch (err) {
    logger.error({
      correlation_id: req.correlationId,
      message: "UPDATE USER failed",
      method: req.method,
      path: req.originalUrl,
      error: err.message,
      targetUserId: id,
      byUser: req.user?.id,
    });

    res.status(400).json({ message: err.message });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  let id;

  try {
    id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    logger.warn({
      correlation_id: req.correlationId,
      message: "DELETE USER attempt",
      method: req.method,
      path: req.originalUrl,
      targetUserId: id,
      byUser: req.user.id,
    });

    const result = await userService.deleteUser(id, req.user);

    logger.info({
      correlation_id: req.correlationId,
      message: "DELETE USER success",
      method: req.method,
      path: req.originalUrl,
      targetUserId: id,
    });

    res.status(200).json(result);
  } catch (err) {
    logger.error({
      correlation_id: req.correlationId,
      message: "DELETE USER failed",
      method: req.method,
      path: req.originalUrl,
      error: err.message,
      targetUserId: id,
      byUser: req.user?.id,
    });

    res.status(400).json({ message: err.message });
  }
};