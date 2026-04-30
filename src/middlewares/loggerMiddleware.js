import { randomUUID } from 'node:crypto';
import logger from '../config/logger.js';

export const addCorrelationId = (req, res, next) => {
    req.correlationId = randomUUID();
    next();
}

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  logger.info({
    correlation_id: req.correlationId,
    message: "REQUEST RECEIVED",
    method: req.method,
    path: req.originalUrl,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info({
      correlation_id: req.correlationId,
      message: "REQUEST COMPLETED",
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: duration,
    });
  });

  next();
};

export const errorHandler = (err, req, res, next) => {
  logger.error({
    correlation_id: req.correlationId,
    message: "UNHANDLED ERROR",
    method: req.method,
    path: req.originalUrl,
    error: err.message,
    stack: err.stack,
  });

  res.status(err.status || 500).json({
    correlation_id: req.correlationId,
    message: err.message || "Internal server error",
  });
};
