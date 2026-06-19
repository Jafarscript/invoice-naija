import mongoose, { Document, Schema } from "mongoose";

export interface IClient extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IClient>("Client", ClientSchema);