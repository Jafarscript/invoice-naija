import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const Settings = () => {
  const { user, login } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    businessName: user?.businessName || "",
    bankName: user?.bankName || "",
    accountNumber: user?.accountNumber || "",
    accountName: user?.accountName || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await api.put("/users/me", form);
      login({ ...data, token: user?.token as string });
      setSuccess("Settings updated successfully");
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
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-slate-400 mt-1">
          Update your profile and bank details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Profile */}
        <div className="bg-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="font-semibold text-lg">Profile</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="text-slate-300 text-sm mb-1 block">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              required
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full bg-slate-900 text-slate-400 px-4 py-3 rounded-lg cursor-not-allowed"
            />
            <p className="text-slate-500 text-xs mt-1">
              Email cannot be changed
            </p>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-slate-800 p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="font-semibold text-lg">Bank Details</h2>
            <p className="text-slate-400 text-sm mt-1">
              These appear on your invoice PDF so clients know where to pay
            </p>
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Zenith Bank"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">
              Account Name
            </label>
            <input
              type="text"
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Jafar Lihammed"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Settings;