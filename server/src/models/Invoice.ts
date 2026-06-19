import mongoose, { Document, Schema } from "mongoose";

export interface ILineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IInvoice extends Document {
  user: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  invoiceNumber: string;
  lineItems: ILineItem[];
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: Date;
  notes: string;
  createdAt: Date;
}

const LineItemSchema = new Schema<ILineItem>(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    lineItems: { type: [LineItemSchema], required: true },
    totalAmount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue"],
      default: "draft",
    },
    dueDate: { type: Date, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IInvoice>("Invoice", InvoiceSchema);