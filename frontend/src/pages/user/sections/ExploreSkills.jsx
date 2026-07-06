import { useState, useEffect } from "react";
import { getSkills, createExchange, createReport } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import { Flag, X } from "lucide-react";

const ExploreSkills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("");
  const [sent, setSent] = useState({});
  const [error, setError] = useState("");
  const [reportForm, setReportForm] = useState(null);
  const [reportDesc, setReportDesc] = useState("");
  const [reported, setReported] = useState({});

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(skills.map((s) => s.categorie))];

  const userMap = {};
  skills.forEach((s) => {
    if (s.user_id === user?.id) return;
    if (!userMap[s.user_id]) {
      userMap[s.user_id] = {
        user_id: s.user_id,
        user_nom: s.user_nom,
        skills: [],
      };
    }
    const matchSearch =
      s.titre.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchCategorie = categorie ? s.categorie === categorie : true;
    if (matchSearch && matchCategorie) {
      userMap[s.user_id].skills.push(s);
    }
  });

  const users = Object.values(userMap).filter((u) => u.skills.length > 0);

  const handleExchange = async (skill) => {
    setError("");
    try {
      await createExchange(skill.id, skill.user_id);
      setSent((prev) => ({ ...prev, [skill.user_id]: true }));
    } catch (err) {
      setError(err.error || "Erreur lors de l'envoi de la demande");
    }
  };

  const handleReport = async (userId) => {
    if (!reportDesc.trim()) return;
    try {
      await createReport(userId, reportDesc);
      setReported((prev) => ({ ...prev, [userId]: true }));
      setReportForm(null);
      setReportDesc("");
    } catch (err) {
      setError(err.error || "Erreur lors du signalement");
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
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Explorer
      </h1>
      <p className="text-base md:text-lg text-gray-500 mb-8">
        Découvrez des profils et proposez un échange de compétences
      </p>

      {error && (
        <div className="border-l-4 border-red-600 bg-red-50 px-4 py-3 rounded-r-xl mb-6">
          <p className="text-base font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Rechercher une compétence..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition"
        />
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="w-full sm:w-auto border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-400">Chargement...</p>}

      {!loading && users.length === 0 && (
        <p className="text-gray-400">Aucun profil trouvé.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <div
            key={u.user_id}
            className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-gray-300 transition"
          >
            {/* Avatar + Nom + Drapeau */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${getColor(u.user_nom)} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                  {u.user_nom?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{u.user_nom}</p>
                  <p className="text-sm text-gray-400">{u.skills.length} compétence{u.skills.length > 1 ? "s" : ""}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!reported[u.user_id]) {
                    setReportForm(reportForm === u.user_id ? null : u.user_id);
                    setReportDesc("");
                  }
                }}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  reported[u.user_id]
                    ? "text-red-600 bg-red-50 cursor-default"
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
                title={reported[u.user_id] ? "Utilisateur signalé" : "Signaler cet utilisateur"}
              >
                <Flag size={16} />
              </button>
            </div>

            {/* Formulaire signalement */}
            {reportForm === u.user_id && !reported[u.user_id] && (
              <div className="mb-4 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">Signaler cet utilisateur</p>
                  <button onClick={() => setReportForm(null)} className="text-gray-400 cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
                <textarea
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Décrivez le motif du signalement..."
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-900 transition resize-none mb-2"
                />
                <button
                  onClick={() => handleReport(u.user_id)}
                  disabled={!reportDesc.trim()}
                  className="w-full py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-40 cursor-pointer"
                >
                  Envoyer le signalement
                </button>
              </div>
            )}

            {/* Skills */}
            <div className="space-y-2 mb-6">
              {u.skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <span className="bg-violet-50 text-violet-700 text-xs font-medium px-2 py-1 rounded-lg">
                    {skill.categorie}
                  </span>
                  <span className="text-sm text-gray-700 font-medium">{skill.titre}</span>
                </div>
              ))}
            </div>

            {/* Bouton échange */}
            <button
              onClick={() => handleExchange(u.skills[0])}
              disabled={sent[u.user_id]}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                sent[u.user_id]
                  ? "bg-green-50 text-green-700 cursor-default"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {sent[u.user_id] ? "Demande envoyée" : "Proposer un échange"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreSkills;