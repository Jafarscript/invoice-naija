"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadInvoicePDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const Invoice_1 = __importDefault(require("../models/Invoice"));
const User_1 = __importDefault(require("../models/User"));
const downloadInvoicePDF = async (req, res) => {
    try {
        const invoice = await Invoice_1.default.findOne({
            _id: req.params.id,
            user: req.user?._id,
        }).populate("client");
        const user = await User_1.default.findById(req.user?._id).select("-password");
        if (!invoice || !user) {
            res.status(404).json({ message: "Invoice not found" });
            return;
        }
        const doc = new pdfkit_1.default({ margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${invoice.invoiceNumber}.pdf`);
        doc.pipe(res);
        // ── Header ──
        doc
            .fontSize(24)
            .fillColor("#10b981")
            .text("InvoiceNaija", 50, 50);
        doc
            .fontSize(10)
            .fillColor("#94a3b8")
            .text(user.businessName, 50, 80);
        doc
            .fontSize(20)
            .fillColor("#1e293b")
            .text("INVOICE", 400, 50, { align: "right" });
        doc
            .fontSize(10)
            .fillColor("#64748b")
            .text(`Invoice No: ${invoice.invoiceNumber}`, 400, 80, { align: "right" })
            .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString("en-NG")}`, 400, 95, { align: "right" })
            .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString("en-NG")}`, 400, 110, { align: "right" });
        // ── Divider ──
        doc
            .moveTo(50, 140)
            .lineTo(550, 140)
            .strokeColor("#e2e8f0")
            .stroke();
        // ── Bill To ──
        const client = invoice.client;
        doc
            .fontSize(10)
            .fillColor("#94a3b8")
            .text("BILL TO", 50, 160);
        doc
            .fontSize(12)
            .fillColor("#1e293b")
            .text(client.name, 50, 178);
        doc
            .fontSize(10)
            .fillColor("#64748b")
            .text(client.email, 50, 195);
        if (client.phone)
            doc.text(client.phone, 50, 210);
        if (client.address)
            doc.text(client.address, 50, 225);
        // ── Line Items Table Header ──
        const tableTop = 270;
        doc
            .fontSize(10)
            .fillColor("#ffffff")
            .rect(50, tableTop, 500, 25)
            .fill("#10b981");
        doc
            .fillColor("#ffffff")
            .text("Description", 60, tableTop + 8)
            .text("Qty", 300, tableTop + 8)
            .text("Unit Price", 360, tableTop + 8)
            .text("Total", 460, tableTop + 8);
        // ── Line Items ──
        let y = tableTop + 35;
        invoice.lineItems.forEach((item, index) => {
            if (index % 2 === 0) {
                doc
                    .rect(50, y - 5, 500, 22)
                    .fillColor("#f8fafc")
                    .fill();
            }
            doc
                .fontSize(10)
                .fillColor("#1e293b")
                .text(item.description, 60, y)
                .text(String(item.quantity), 300, y)
                .text(new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
            }).format(item.unitPrice), 360, y)
                .text(new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
            }).format(item.total), 460, y);
            y += 25;
        });
        // ── Total ──
        doc
            .moveTo(50, y + 10)
            .lineTo(550, y + 10)
            .strokeColor("#e2e8f0")
            .stroke();
        doc
            .fontSize(12)
            .fillColor("#1e293b")
            .text("Total Amount:", 360, y + 20)
            .fontSize(14)
            .fillColor("#10b981")
            .text(new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(invoice.totalAmount), 460, y + 20);
        // ── Bank Details ──
        if (user.bankName || user.accountNumber) {
            doc
                .fontSize(10)
                .fillColor("#94a3b8")
                .text("PAYMENT DETAILS", 50, y + 60);
            doc
                .fontSize(10)
                .fillColor("#64748b")
                .text(`Bank: ${user.bankName}`, 50, y + 78)
                .text(`Account Number: ${user.accountNumber}`, 50, y + 93)
                .text(`Account Name: ${user.accountName}`, 50, y + 108);
        }
        // ── Notes ──
        if (invoice.notes) {
            doc
                .fontSize(10)
                .fillColor("#94a3b8")
                .text("NOTES", 50, y + 140);
            doc
                .fontSize(10)
                .fillColor("#64748b")
                .text(invoice.notes, 50, y + 158);
        }
        // ── Footer ──
        doc
            .fontSize(9)
            .fillColor("#94a3b8")
            .text("Generated by InvoiceNaija", 50, y + 300, { align: "center" });
        doc.end();
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.downloadInvoicePDF = downloadInvoicePDF;
