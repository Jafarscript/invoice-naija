import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { type IInvoice } from "../../types";
import api from "../../api/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalEarnings = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const paidCount = invoices.filter((inv) => inv.status === "paid").length;

  const unpaidCount = invoices.filter((inv) => inv.status !== "paid").length;

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const recentInvoices = invoices.slice(0, 5);

  const statusColors: Record<string, string> = {
    draft: "bg-slate-500/20 text-slate-400",
    sent: "bg-blue-500/20 text-blue-400",
    paid: "bg-emerald-500/20 text-emerald-400",
    overdue: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-slate-400 mt-1">{user?.businessName}</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-800 p-6 rounded-2xl animate-pulse h-28"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm mb-1">Total Earnings</p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-400">
              {formatNaira(totalEarnings)}
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm mb-1">Paid Invoices</p>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {paidCount}
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm mb-1">Unpaid Invoices</p>
            <p className="text-2xl md:text-3xl font-bold text-red-400">
              {unpaidCount}
            </p>
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentInvoices.length === 0 ? (
          <p className="text-slate-400 text-sm">No invoices yet. Create your first one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left pb-3">Invoice</th>
                  <th className="text-left pb-3">Client</th>
                  <th className="text-left pb-3 hidden sm:table-cell">Due Date</th>
                  <th className="text-left pb-3">Amount</th>
                  <th className="text-left pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td className="py-3 font-medium">{invoice.invoiceNumber}</td>
                    <td className="py-3 text-slate-300">{invoice.client.name}</td>
                    <td className="py-3 text-slate-300 hidden sm:table-cell">
                      {new Date(invoice.dueDate).toLocaleDateString("en-NG")}
                    </td>
                    <td className="py-3 text-emerald-400">
                      {formatNaira(invoice.totalAmount)}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;