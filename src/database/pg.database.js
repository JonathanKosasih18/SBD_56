require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: true
});

const connect = async () => {
    try {
        await pool.connect();
        console.log("Database connected!");
    } catch (error) {
        console.error("Database connection error", error);
    }
}

connect();

const query = async (text, params) => {
    try {
        const result = await pool.query(text, params);
        return result;
    } catch (error) {
        console.error("Database query error", error);
    }
}
module.exports = { query };