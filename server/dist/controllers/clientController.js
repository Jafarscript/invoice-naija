"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.getClient = exports.getClients = exports.createClient = void 0;
const Client_1 = __importDefault(require("../models/Client"));
const createClient = async (req, res) => {
    const { name, email, phone, address } = req.body;
    try {
        const client = await Client_1.default.create({
            user: req.user?._id,
            name,
            email,
            phone,
            address,
        });
        res.status(201).json(client);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.createClient = createClient;
const getClients = async (req, res) => {
    try {
        const clients = await Client_1.default.find({ user: req.user?._id }).sort({
            createdAt: -1,
        });
        res.status(200).json(clients);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getClients = getClients;
const getClient = async (req, res) => {
    try {
        const client = await Client_1.default.findOne({
            _id: req.params.id,
            user: req.user?._id,
        });
        if (!client) {
            res.status(404).json({ message: "Client not found" });
            return;
        }
        res.status(200).json(client);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getClient = getClient;
const updateClient = async (req, res) => {
    const { name, email, phone, address } = req.body;
    try {
        const client = await Client_1.default.findOneAndUpdate({ _id: req.params.id, user: req.user?._id }, { $set: { name, email, phone, address } }, { new: true });
        if (!client) {
            res.status(404).json({ message: "Client not found" });
            return;
        }
        res.status(200).json(client);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.updateClient = updateClient;
const deleteClient = async (req, res) => {
    try {
        const client = await Client_1.default.findOneAndDelete({
            _id: req.params.id,
            user: req.user?._id,
        });
        if (!client) {
            res.status(404).json({ message: "Client not found" });
            return;
        }
        res.status(200).json({ message: "Client deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.deleteClient = deleteClient;
