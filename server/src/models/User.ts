import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  businessName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    businessName: { type: String, required: true, trim: true },
    bankName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    accountName: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);