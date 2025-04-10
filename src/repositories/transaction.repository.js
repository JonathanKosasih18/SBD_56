const db = require("../database/pg.database");

exports.createTransaction = async (transaction) => {
    try {
        const result = await db.query(
            "INSERT INTO transactions(user_id, item_id, quantity, total) VALUES($1, $2, $3, $4) RETURNING *",
            [transaction.user_id, transaction.item_id, transaction.quantity, transaction.total]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Transaction repository error", error);
    }
}

exports.getTransactionById = async (id) => {
    try {
        const result = await db.query("SELECT * FROM transactions WHERE id = $1", 
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Transaction repository error", error);
    }
}

exports.handlePayment = async (id) => {
    try {
        const result = await db.query("UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *", 
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Transaction repository error", error);
    }
}

exports.getAllTransactions = async () => {
    try {
        const result = await db.query("SELECT t.id AS transaction_id, t.quantity, t.total, t.status, t.created_at AS transaction_time, u.id AS user_id, u.name AS user_name, u.email AS user_email, u.balance AS user_balance, i.id AS item_id, i.name AS item_name, i.price AS item_price, i.stock AS item_stock, i.image_url, i.store_id FROM transactions t JOIN users u ON t.user_id = u.id JOIN items i ON t.item_id = i.id");
        return result.rows;
    } catch (error) {
        console.error("Transaction repository error", error);
    }
}

exports.deleteTransaction = async (id) => {
    try {
        const result = await db.query("DELETE FROM transactions WHERE id = $1 RETURNING *", 
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Transaction repository error", error);
    }
}
