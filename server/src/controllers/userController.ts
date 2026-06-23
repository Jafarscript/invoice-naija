import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../types/express";

export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, businessName, bankName, accountNumber, accountName } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { name, businessName, bankName, accountNumber, accountName } },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};