"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvoice = exports.updateInvoiceStatus = exports.updateInvoice = exports.getInvoice = exports.getInvoices = exports.createInvoice = void 0;
const Invoice_1 = __importDefault(require("../models/Invoice"));
const createInvoice = async (req, res) => {
    const { client, lineItems, dueDate, notes } = req.body;
    try {
        const count = await Invoice_1.default.countDocuments({ user: req.user?._id });
        const invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;
        const totalAmount = lineItems.reduce((sum, item) => sum + item.total, 0);
        const invoice = await Invoice_1.default.create({
            user: req.user?._id,
            client,
            invoiceNumber,
            lineItems,
            totalAmount,
            dueDate,
            notes,
        });
        res.status(201).json(invoice);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.createInvoice = createInvoice;
const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice_1.default.find({ user: req.user?._id })
            .populate("client", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(invoices);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getInvoices = getInvoices;
const getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice_1.default.findOne({
            _id: req.params.id,
            user: req.user?._id,
        }).populate("client", "name email phone address");
        if (!invoice) {
            res.status(404).json({ message: "Invoice not found" });
            return;
        }
        res.status(200).json(invoice);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getInvoice = getInvoice;
const updateInvoice = async (req, res) => {
    const { lineItems, dueDate, notes } = req.body;
    try {
        const totalAmount = lineItems.reduce((sum, item) => sum + item.total, 0);
        const invoice = await Invoice_1.default.findOneAndUpdate({ _id: req.params.id, user: req.user?._id }, { $set: { lineItems, totalAmount, dueDate, notes } }, { new: true });
        if (!invoice) {
            res.status(404).json({ message: "Invoice not found" });
            return;
        }
        res.status(200).json(invoice);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.updateInvoice = updateInvoice;
const updateInvoiceStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ["draft", "sent", "paid", "overdue"];
    if (!validStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status value" });
        return;
    }
    try {
        const invoice = await Invoice_1.default.findOneAndUpdate({ _id: req.params.id, user: req.user?._id }, { $set: { status } }, { new: true });
        if (!invoice) {
            res.status(404).json({ message: "Invoice not found" });
            return;
        }
        res.status(200).json(invoice);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.updateInvoiceStatus = updateInvoiceStatus;
const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice_1.default.findOneAndDelete({
            _id: req.params.id,
            user: req.user?._id,
        });
        if (!invoice) {
            res.status(404).json({ message: "Invoice not found" });
            return;
        }
        res.status(200).json({ message: "Invoice deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.deleteInvoice = deleteInvoice;
