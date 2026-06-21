import { useEffect, useState } from "react";
import { type IClient } from "../../types";
import api from "../../api/axios";

const Clients = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<IClient | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

 useEffect(() => {
  const fetchClients = async () => {
    try {
      const { data } = await api.get("/clients");
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchClients();
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setEditingClient(null);
    setForm({ name: "", email: "", phone: "", address: "" });
    setError("");
    setShowForm(true);
  };

  const openEdit = (client: IClient) => {
    setEditingClient(client);
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingClient(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    if (editingClient) {
      const { data } = await api.put(`/clients/${editingClient._id}`, form);
      setClients(clients.map((c) => (c._id === editingClient._id ? data : c)));
    } else {
      const { data } = await api.post("/clients", form);
      setClients([data, ...clients]);
    }
    closeForm();
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
  setError(error.response?.data?.message || "Something went wrong");
  }
};

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      await api.delete(`/clients/${id}`);
      setClients(clients.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Clients</h1>
          <p className="text-slate-400 mt-1">Manage your clients</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full sm:w-auto"
        >
          + Add Client
        </button>
      </div>

      {/* Client List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400">No clients yet.</p>
          <button
            onClick={openCreate}
            className="text-emerald-400 hover:underline text-sm mt-2"
          >
            Add your first client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div
              key={client._id}
              className="bg-slate-800 p-6 rounded-2xl flex flex-col justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold text-lg">{client.name}</h3>
                <p className="text-slate-400 text-sm">{client.email}</p>
                {client.phone && (
                  <p className="text-slate-400 text-sm">{client.phone}</p>
                )}
                {client.address && (
                  <p className="text-slate-400 text-sm">{client.address}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(client)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(client._id)}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editingClient ? "Edit Client" : "Add Client"}
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Emeka Okafor"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="emeka@example.com"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-1 block">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="08012345678"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-1 block">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="14 Broad Street, Lagos"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg transition text-sm font-medium"
                >
                  {editingClient ? "Save Changes" : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;