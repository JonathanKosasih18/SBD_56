const db = require("../database/pg.database");

exports.getAllStores = async () => {
    try {
        const result = await db.query("SELECT * FROM stores");
        return result.rows;
    } catch (error) {
        console.error("Store repository error", error);
    }
};

exports.createStore = async (store) => {
    try {
        const result = await db.query(
            "INSERT INTO stores(name, address) VALUES($1, $2) RETURNING *", 
            [store.name, store.address]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Store repository error", error);
    }
};

exports.getStoreById = async (id) => {
    try {
        const result = await db.query("SELECT * FROM stores WHERE id = $1", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Store repository error", error);
    }
};

exports.updateStore = async (store) => {
    try {
        const result = await db.query(
            "UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *",
            [store.name, store.address, store.id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Store repository error", error);
    }
}

exports.deleteStore = async (id) => {
    try {
        const result = await db.query("DELETE FROM stores WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Store repository error", error);
    }
}