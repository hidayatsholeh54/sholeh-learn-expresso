import 'dotenv/config';
import express from "express";
import sequelize from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import redisClient from './config/redis.js';
import { addCorrelationId, requestLogger, errorHandler  } from './middlewares/loggerMiddleware.js';

const app = express();

app.use(express.json());
app.use(addCorrelationId);
app.use(requestLogger);

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    // connect to database
    await sequelize.sync();
    console.log("Database connected");

    // test redis connection
    await redisClient.set("test", "Hello Redis!");
    const value = await redisClient.get("test");
    console.log("Redis test value:", value);

    // start server
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
