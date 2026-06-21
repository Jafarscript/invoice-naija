import { Response } from "express";
import Invoice from "../models/Invoice";
import { AuthRequest } from "../types/express";

export const createInvoice = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { client, lineItems, dueDate, notes } = req.body;

  try {
    const count = await Invoice.countDocuments({ user: req.user?._id });
    const invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;

    const totalAmount = lineItems.reduce(
      (sum: number, item: { total: number }) => sum + item.total,
      0
    );

    const invoice = await Invoice.create({
      user: req.user?._id,
      client,
      invoiceNumber,
      lineItems,
      totalAmount,
      dueDate,
      notes,
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getInvoices = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const invoices = await Invoice.find({ user: req.user?._id })
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getInvoice = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user?._id,
    }).populate("client", "name email phone address");

    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateInvoice = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { lineItems, dueDate, notes } = req.body;

  try {
    const totalAmount = lineItems.reduce(
      (sum: number, item: { total: number }) => sum + item.total,
      0
    );

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      { $set: { lineItems, totalAmount, dueDate, notes } },
      { new: true }
    );

    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateInvoiceStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { status } = req.body;

  const validStatuses = ["draft", "sent", "paid", "overdue"];

  if (!validStatuses.includes(status)) {
    res.status(400).json({ message: "Invalid status value" });
    return;
  }

  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      { $set: { status } },
      { new: true }
    );

    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteInvoice = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user?._id,
    });

    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};