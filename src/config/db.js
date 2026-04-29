import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: "localhost",
        dialect: "postgres",
        pool: {
        max: 5,     // max koneksi
        min: 0,
        acquire: 30000, // waiting time for connection 30second
        idle: 10000 // idle time 10second
        },
    }
);

export default sequelize;