const userRepository = require('../repositories/user.repository');
const baseResponse = require("../utils/baseResponse.util");
const bcrypt = require("bcrypt");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex = /^(?=.*[^\s]{8,})(?=.*\d)(?=.*[^\w\d]).+$/;
const saltRounds = 10;

exports.registerUser = async (req, res) => {
    if (!req.query.name || !req.query.email || !req.query.password) {
        return baseResponse(res, false, 400, "Missing user name, email, or password", null);
    }
    try {
        if (!emailRegex.test(req.query.email)) {
            return baseResponse(res, false, 400, "Invalid email", null);
        }
        if (await userRepository.getUserByEmail(req.query.email)) {
            return baseResponse(res, false, 400, "Email already registered", null);
        }
        if (!passRegex.test(req.query.password)) {
            return baseResponse(res, false, 400, "Password must be at least 8 characters long, contain at least one number, and one special character", null);
        }
        const hashedPassword = await bcrypt.hash(req.query.password, saltRounds);
        const user = await userRepository.registerUser(req.query.name, req.query.email, hashedPassword);
        baseResponse(res, true, 201, "User created", user);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.loginUser = async (req, res) => {
    if (!req.query.email || !req.query.password) {
        return baseResponse(res, false, 400, "Missing email or password", null);
    }
    try {
        const user = await userRepository.loginUser(req.query.email, req.query.password);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        else {
            baseResponse(res, true, 200, "Login successful", user);
        }
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving user", error);
    }
}

exports.getUserByEmail = async (req, res) => {
    try {
        const user = await userRepository.getUserByEmail(req.params.email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving user", error);
    }
}

exports.updateUser = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return baseResponse(res, false, 400, "Missing user name, email, or password", null);
    }
    try {
        if (!emailRegex.test(req.body.email)) {
            return baseResponse(res, false, 400, "Invalid email", null);
        }
        if (await userRepository.getUserByEmail(req.body.email)) {
            return baseResponse(res, false, 400, "Email already registered", null);
        }
        if (!passRegex.test(req.body.password)) {
            return baseResponse(res, false, 400, "Password must be at least 8 characters long, contain at least one number, and one special character", null);
        }
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const user = await userRepository.updateUser(req.body.name, req.body.email, hashedPassword, req.body.id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User updated", user);
    } catch (error) {
        baseResponse(res, false, 500, "Error updating user", error);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const deleted = await userRepository.deleteUser(req.params.id);
        if (!deleted) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User deleted", deleted);
    } catch (error) {
        baseResponse(res, false, 500, "Error deleting user", error);
    }
}

exports.topUpBalance = async (req, res) => {
    if (!req.query.id || !req.query.amount) {
        return baseResponse(res, false, 400, "Missing user id or amount", null);
    }
    if (req.query.amount <= 0) {
        return baseResponse(res, false, 400, "Amount must be larger than 0", null);
    }
    try {
        const user = await userRepository.topUpBalance(req.query.id, req.query.amount);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "Balance updated", user);
    } catch (error) {
        baseResponse(res, false, 500, "Error updating balance", error);
    }
}