require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

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
