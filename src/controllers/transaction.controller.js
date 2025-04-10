const transactionRepository = require('../repositories/transaction.repository');
const itemRepository = require('../repositories/item.repository');
const userRepository = require('../repositories/user.repository');
const baseResponse = require('../utils/baseResponse.util');

exports.createTransaction = async (req, res) => {
    const item = await itemRepository.getItemById(req.body.item_id);
    const user = await userRepository.getUserById(req.body.user_id);
    if (!req.body.user_id || !req.body.item_id || !req.body.quantity || !user || !item) {
        return baseResponse(res, false, 400, "Missing user_id, item_id, or quantity", null);
    }
    else if (req.body.quantity < 1) {
        return baseResponse(res, false, 400, "Quantity must be larger than 0", null);
    }
    try {
        const total = item.price * req.body.quantity;
        const transactionData = {
            user_id: req.body.user_id,
            item_id: req.body.item_id,
            quantity: req.body.quantity,
            total: total
        };
        const transaction = await transactionRepository.createTransaction(transactionData);
        baseResponse(res, true, 201, "Transaction created", transaction);
    } catch (error) {
        console.error(error);
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.handlePayment = async (req, res) => {
    const {id} = req.params;
    console.log(id);
    try {
        const transaction = await transactionRepository.getTransactionById(id);
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        else if (transaction.status === "paid") {
            return baseResponse(res, false, 400, "Transaction already paid", null);
        }
        const user = await userRepository.getUserById(transaction.user_id);
        if (user.balance < transaction.total) {
            return baseResponse(res, false, 400, "Insufficient balance", null);
        }
        const item = await itemRepository.getItemById(transaction.item_id);
        if (item.stock < transaction.quantity) {
            return baseResponse(res, false, 400, "Insufficient stock", null);
        }
        await userRepository.updateUser(user.name, user.email, user.password, user.balance - transaction.total, user.id);
        await itemRepository.updateItem(item.name, item.price, item.store_id, item.image_url, item.stock - transaction.quantity, item.id);
        const updatedTransaction = await transactionRepository.handlePayment(id);
        baseResponse(res, true, 200, "Payment successful", updatedTransaction);
    } catch (error) {
        console.error(error);
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getAllTransactions();
        if (!transactions) {
            return baseResponse(res, false, 404, "No transactions found", null);
        }
        baseResponse(res, true, 200, "Transactions found", transactions);
    } catch (error) {
        console.error(error);
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.deleteTransaction = async (req, res) => {
    try {
        const deleted = await transactionRepository.deleteTransaction(req.params.id);
        if (!deleted) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        baseResponse(res, true, 200, "Transaction deleted", deleted);
    }
    catch (error) {
        console.error(error);
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}
