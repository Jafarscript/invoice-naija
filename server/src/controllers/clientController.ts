import { Response } from "express";
import { AuthRequest } from "../types/express";
import Client from "../models/Client";

export const createClient = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, email, phone, address } = req.body;

  try {
    const client = await Client.create({
      user: req.user?._id,
      name,
      email,
      phone,
      address,
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getClients = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const clients = await Client.find({ user: req.user?._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getClient = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      user: req.user?._id,
    });

    if (!client) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateClient = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, email, phone, address } = req.body;

  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      { $set: { name, email, phone, address } },
      { new: true }
    );

    if (!client) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteClient = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      user: req.user?._id,
    });

    if (!client) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};