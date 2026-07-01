import { useState, useEffect } from "react";
import { getSkills } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";

const DashboardHome = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const mySkills = skills.filter((s) => s.user_id === user?.id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Bonjour, {user?.nom} 👋
      </h1>
      <p className="text-lg text-gray-500 mb-10">
        Bienvenue sur votre tableau de bord SkillLink
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
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

      {/* Mes skills */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Mes compétences</h2>
      {loading && <p className="text-gray-400">Chargement...</p>}
      {!loading && mySkills.length === 0 && (
        <p className="text-gray-400">Vous n'avez pas encore publié de compétences.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mySkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white border-2 border-gray-100 rounded-2xl p-5"
          >
            <span className="inline-block bg-violet-50 text-violet-700 text-sm font-medium px-3 py-1 rounded-lg mb-3">
              {skill.categorie}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{skill.titre}</h3>
            <p className="text-gray-500 text-sm">{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;