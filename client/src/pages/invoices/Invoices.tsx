import { useEffect, useState } from "react";
import { Link } from "react-router";
import { type IInvoice } from "../../types";
import api from "../../api/axios";

const statusColors: Record<string, string> = {
  draft: "bg-slate-500/20 text-slate-400",
  sent: "bg-blue-500/20 text-blue-400",
  paid: "bg-emerald-500/20 text-emerald-400",
  overdue: "bg-red-500/20 text-red-400",
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await api.get("/invoices");
        setInvoices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const { data } = await api.patch(`/invoices/${id}/status`, { status });
      setInvoices(invoices.map((inv) => (inv._id === id ? data : inv)));
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    try {
      await api.delete(`/invoices/${id}`);
      setInvoices(invoices.filter((inv) => inv._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const handleDownloadPDF = async (id: string, invoiceNumber: string) => {
    try {
      const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Invoices</h1>
          <p className="text-slate-400 mt-1">Manage your invoices</p>
        </div>
        <Link
          to="/invoices/create"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition text-center w-full sm:w-auto"
        >
          + Create Invoice
        </Link>
      </div>

      {/* Invoice List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400">No invoices yet.</p>
          <Link
            to="/invoices/create"
            className="text-emerald-400 hover:underline text-sm mt-2 inline-block"
          >
            Create your first invoice
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="bg-slate-800 p-4 md:p-6 rounded-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {invoice.invoiceNumber}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {invoice.client.name}
                  </p>
                  <p className="text-slate-400 text-xs">
                    Due: {new Date(invoice.dueDate).toLocaleDateString("en-NG")}
                  </p>
                </div>

                {/* Right */}
                <div className="flex flex-col sm:items-end gap-2">
                  <p className="text-emerald-400 font-bold text-lg">
                    {formatNaira(invoice.totalAmount)}
                  </p>

                  {/* Status Updater */}
                  <select
                    value={invoice.status}
                    disabled={updatingId === invoice._id}
                    onChange={(e) =>
                      handleStatusChange(invoice._id, e.target.value)
                    }
                    className="bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>

                  <Link
                    to={`/invoices/${invoice._id}/edit`}
                    className="text-blue-400 hover:text-blue-300 text-xs transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(invoice._id)}
                    className="text-red-400 hover:text-red-300 text-xs transition"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() =>
                      handleDownloadPDF(invoice._id, invoice.invoiceNumber)
                    }
                    className="text-emerald-400 hover:text-emerald-300 text-xs transition"
                  >
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Line Items */}
              <div className="mt-4 border-t border-slate-700 pt-4">
                <p className="text-slate-400 text-xs mb-2">Line Items</p>
                <div className="space-y-1">
                  {invoice.lineItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        {item.description} x{item.quantity}
                      </span>
                      <span className="text-white">
                        {formatNaira(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;
