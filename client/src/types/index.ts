export interface IUser {
  _id: string;
  name: string;
  email: string;
  businessName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  token: string;
}

export interface IClient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface ILineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IInvoice {
  _id: string;
  invoiceNumber: string;
  client: IClient;
  lineItems: ILineItem[];
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  notes: string;
  createdAt: string;
}