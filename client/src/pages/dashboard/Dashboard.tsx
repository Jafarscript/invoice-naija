import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name} 👋</h1>
          <p className="text-slate-400">{user?.businessName}</p>
        </div>
        <button
          onClick={logout}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-sm mb-1">Total Earnings</p>
          <p className="text-3xl font-bold text-emerald-400">₦0.00</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-sm mb-1">Paid Invoices</p>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-sm mb-1">Unpaid Invoices</p>
          <p className="text-3xl font-bold text-red-400">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;