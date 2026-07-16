"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMe = exports.getMe = void 0;
const User_1 = __importDefault(require("../models/User"));
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?._id).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getMe = getMe;
const updateMe = async (req, res) => {
    const { name, businessName, bankName, accountNumber, accountName } = req.body;
    try {
        const user = await User_1.default.findByIdAndUpdate(req.user?._id, { $set: { name, businessName, bankName, accountNumber, accountName } }, { new: true }).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.updateMe = updateMe;
