import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { API_BASE } from "../../../api/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ nom: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE}/admin/users`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUsers(data.filter((u) => !u.roles?.includes("ROLE_ADMIN"))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const getColor = (name) => {
    const colors = ["bg-violet-600", "bg-blue-600", "bg-green-600", "bg-orange-500", "bg-pink-600", "bg-teal-600"];
    return colors[name?.charCodeAt(0) % colors.length] || "bg-gray-600";
  };

  const resetForm = () => {
    setForm({ nom: "", email: "", password: "" });
    setEditUser(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setForm({ nom: user.nom, email: user.email, password: "" });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw await res.json();
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSuccess("Utilisateur supprimé.");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const body = {
      nom: form.nom,
      email: form.email,
      roles: ["ROLE_USER"],
      ...(form.password && { password: form.password }),
    };

    try {
      if (editUser) {
        const res = await fetch(`${API_BASE}/admin/users/${editUser.id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw await res.json();
        setSuccess("Utilisateur mis à jour.");
      } else {
        if (!form.password) return setError("Le mot de passe est obligatoire.");
        const res = await fetch(`${API_BASE}/admin/users`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw await res.json();
        setSuccess("Utilisateur créé.");
      }
      resetForm();
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.error || err.message || "Erreur lors de l'opération.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Utilisateurs</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Ajouter un utilisateur</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>
      <p className="text-base md:text-lg text-gray-500 mb-8">
        Gérez les utilisateurs de la plateforme
      </p>

      {success && (
        <div className="border-l-4 border-gray-900 bg-gray-50 px-4 py-3 rounded-r-xl mb-6">
          <p className="text-base font-medium text-gray-900">{success}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">
              {editUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-700 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="border-l-4 border-red-600 bg-red-50 px-4 py-3 rounded-r-xl mb-4">
              <p className="text-base font-medium text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Mot de passe {editUser && <span className="text-gray-400 text-sm">(laisser vide = inchangé)</span>}
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-base font-semibold hover:bg-gray-800 transition cursor-pointer"
              >
                {editUser ? "Enregistrer" : "Créer"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="text-gray-400">Chargement...</p>}

      {!loading && users.length === 0 && (
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-900">Aucun utilisateur trouvé</p>
        </div>
      )}

      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white border-2 border-gray-100 rounded-2xl p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-11 h-11 rounded-xl ${getColor(u.nom)} flex items-center justify-center text-white text-base font-bold flex-shrink-0`}>
                {u.nom?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-base truncate">{u.nom}</p>
                <p className="text-sm text-gray-400 truncate">{u.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:block bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1 rounded-lg">
                {u.skills_count} compétence{u.skills_count > 1 ? "s" : ""}
              </span>
              <button
                onClick={() => handleEdit(u)}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition cursor-pointer"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(u.id)}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;