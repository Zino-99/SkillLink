import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const MyProfile = () => {
  const { user, login } = useAuth();
  const [nom, setNom] = useState(user?.nom || "");
  const [description, setDescription] = useState(user?.description || "");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("http://localhost:8000/api/me", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, description }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      login(data.user);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour");
    }
  };

  const getColor = (name) => {
    const colors = [
      "bg-violet-600", "bg-blue-600", "bg-green-600",
      "bg-orange-500", "bg-pink-600", "bg-teal-600"
    ];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index] || "bg-gray-600";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon profil</h1>
      <p className="text-lg text-gray-500 mb-8">
        Modifiez vos informations personnelles
      </p>

      <div className="max-w-xl">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-10">
          <div className={`w-20 h-20 rounded-2xl ${getColor(user?.nom)} flex items-center justify-center text-white text-3xl font-bold`}>
            {user?.nom?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{user?.nom}</p>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 text-green-700 text-base p-4 rounded-xl mb-6">
            ✅ Profil mis à jour avec succès
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 text-base p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Parlez de vous, de vos compétences, de ce que vous cherchez..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gray-900 text-white text-base font-semibold hover:bg-gray-800 transition"
          >
            Sauvegarder les modifications
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;