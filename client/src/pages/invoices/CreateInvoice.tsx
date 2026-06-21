import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { type IClient } from "../../types";
import api from "../../api/axios";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<IClient[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    client: "",
    dueDate: "",
    notes: "",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0, total: 0 },
  ]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await api.get("/clients");
        setClients(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClients();
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLineItemChange = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };

    const quantity = Number(updated[index].quantity);
    const unitPrice = Number(updated[index].unitPrice);
    updated[index].total = quantity * unitPrice;

    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + item.total, 0);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.client) {
      setError("Please select a client");
      return;
    }

    if (lineItems.some((item) => !item.description)) {
      setError("Please fill in all line item descriptions");
      return;
    }

    setLoading(true);

    try {
      await api.post("/invoices", {
        ...form,
        lineItems,
      });
      navigate("/invoices");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Create Invoice</h1>
        <p className="text-slate-400 mt-1">Fill in the details below</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client + Due Date */}
        <div className="bg-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="font-semibold text-lg">Invoice Details</h2>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">Client</label>
            <select
              name="client"
              value={form.client}
              onChange={handleFormChange}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleFormChange}
              required
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleFormChange}
              rows={3}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Payment via bank transfer please"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="font-semibold text-lg">Line Items</h2>

          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-end"
              >
                <div>
                  {index === 0 && (
                    <label className="text-slate-400 text-xs mb-1 block">
                      Description
                    </label>
                  )}
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleLineItemChange(index, "description", e.target.value)
                    }
                    className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="Web Design"
                  />
                </div>

                <div>
                  {index === 0 && (
                    <label className="text-slate-400 text-xs mb-1 block">
                      Qty
                    </label>
                  )}
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      handleLineItemChange(index, "quantity", e.target.value)
                    }
                    className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  {index === 0 && (
                    <label className="text-slate-400 text-xs mb-1 block">
                      Unit Price
                    </label>
                  )}
                  <input
                    type="number"
                    value={item.unitPrice}
                    min={0}
                    onChange={(e) =>
                      handleLineItemChange(index, "unitPrice", e.target.value)
                    }
                    className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  {index === 0 && (
                    <label className="text-slate-400 text-xs mb-1 block">
                      Total
                    </label>
                  )}
                  <input
                    type="text"
                    value={formatNaira(item.total)}
                    readOnly
                    className="w-full bg-slate-900 text-emerald-400 px-3 py-2 rounded-lg text-sm cursor-not-allowed"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeLineItem(index)}
                  disabled={lineItems.length === 1}
                  className="text-red-400 hover:text-red-300 transition disabled:opacity-30 disabled:cursor-not-allowed pb-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addLineItem}
            className="text-emerald-400 hover:text-emerald-300 text-sm transition"
          >
            + Add Line Item
          </button>

          {/* Total */}
          <div className="border-t border-slate-700 pt-4 flex justify-end">
            <div className="text-right">
              <p className="text-slate-400 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-emerald-400">
                {formatNaira(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;