"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../config/email");
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
const register = async (req, res) => {
    const { name, email, password, businessName } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already in use" });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
            businessName,
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            businessName: user.businessName,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            businessName: user.businessName,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(200).json({
                message: "If that email exists you will receive a reset link shortly",
            });
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();
        await (0, email_1.sendPasswordResetEmail)(user.email, resetToken, user.name);
        res.status(200).json({
            message: "If that email exists you will receive a reset link shortly",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const user = await User_1.default.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() },
        });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired reset token" });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(password, salt);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.resetPassword = resetPassword;
