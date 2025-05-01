require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    },
    max: 5, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 5000 
});

const query = async (text, params) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(text, params);
        return result;
    } catch (error) {
        console.error('Database error:', error);
        throw error; 
    } finally {
        if (client) client.release(); 
    }
};

const checkConnection = async () => {
    try {
        await pool.query('SELECT 1');
        return true;
    } catch {
        return false;
    }
};

module.exports = { query, checkConnection };