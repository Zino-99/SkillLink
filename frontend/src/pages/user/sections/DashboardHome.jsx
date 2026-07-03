import { useState, useEffect } from "react";
import { getSkills, createSkill, deleteSkill } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import { Plus, Trash2, X } from "lucide-react";

const DashboardHome = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titre: "", description: "", categorie: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSkills = () => {
    getSkills()
      .then(setSkills)
      .catch(() => {})
      .finally(() => setLoading(false));
  };


  useEffect(() => {
    fetchSkills();
  }, []);


  const mySkills = skills.filter((s) => s.user_id === user?.id);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createSkill(form);
      setSuccess("Compétence ajoutée.");
      setForm({ titre: "", description: "", categorie: "" });
      setShowForm(false);
      fetchSkills();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.error || "Erreur lors de l'ajout.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette compétence ?")) return;
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      setSuccess("Compétence supprimée.");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Bonjour, {user?.nom} 👋
      </h1>
      <p className="text-base md:text-lg text-gray-500 mb-8">
        Bienvenue sur votre tableau de bord SkillLink
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
          <p className="text-4xl font-bold text-gray-900 mb-1">{mySkills.length}</p>
          <p className="text-base text-gray-500">Compétences publiées</p>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
          <p className="text-4xl font-bold text-gray-900 mb-1">{skills.length}</p>
          <p className="text-base text-gray-500">Compétences disponibles</p>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
          <p className="text-4xl font-bold text-violet-600 mb-1">0</p>
          <p className="text-base text-gray-500">Échanges en cours</p>
        </div>
      </div>

      {success && (
        <div className="border-l-4 border-gray-900 bg-gray-50 px-4 py-3 rounded-r-xl mb-6">
          <p className="text-base font-medium text-gray-900">{success}</p>
        </div>
      )}

      {/* Mes skills */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Mes compétences</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">Nouvelle compétence</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="border-l-4 border-red-600 bg-red-50 px-4 py-3 rounded-r-xl mb-4">
              <p className="text-base font-medium text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  required
                  placeholder="React, Photoshop..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <input
                  type="text"
                  value={form.categorie}
                  onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                  required
                  placeholder="Développement, Design..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={3}
                placeholder="Décrivez votre niveau et expérience..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
              >
                Ajouter la compétence
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="text-gray-400">Chargement...</p>}

      {!loading && mySkills.length === 0 && (
        <p className="text-gray-400">Vous n'avez pas encore publié de compétences.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mySkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white border-2 border-gray-100 rounded-2xl p-5 flex items-start justify-between"
          >
            <div>
              <span className="inline-block bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1 rounded-lg mb-3">
                {skill.categorie}
              </span>
              <h3 className="text-base font-bold text-gray-900 mb-1">{skill.titre}</h3>
              <p className="text-gray-500 text-sm">{skill.description}</p>
            </div>
            <button
              onClick={() => handleDelete(skill.id)}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition cursor-pointer flex-shrink-0 ml-3"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;