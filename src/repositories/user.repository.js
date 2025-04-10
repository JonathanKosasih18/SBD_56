const db = require("../database/pg.database");
const bcrypt = require("bcrypt");

exports.registerUser = async (name, email, password) => {
    try {
        const result = await db.query(
            "INSERT INTO users(name, email, password, balance) VALUES($1, $2, $3, 0) RETURNING *",
            [name, email, password]
        );
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
    }
};

exports.loginUser = async (email, password) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const compare = await bcrypt.compare(password, result.rows[0].password);
        if (!compare) {
            return null;
        }
        else {
            return result.rows[0];
        }
    } catch (error) {
        console.error("User repository error", error);
    }
}

exports.getUserById = async (id) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
    }
}

exports.getUserByEmail = async (email) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
    }
}

exports.updateUser = async (name, email, password, id) => {
    try {
        const result = await db.query(
            "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
            [name, email, password, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
    }
}

exports.deleteUser = async (id) => {
    try {
        const result = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
    }
}

exports.topUpBalance = async (id, amount) => {
    try {
        const result = await db.query(
            "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *",
            [amount, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("User repository error", error);
    }
}