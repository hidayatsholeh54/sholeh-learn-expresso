import 'dotenv/config';
import express from "express";
import sequelize from './config/db.js';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'

const app = express();

app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// koneksi DB
sequelize.sync().then(() => {
  console.log("Database Connected");
  app.listen(3000, () => console.log("Server running on port 3000"));
});
