import { useState, useEffect } from "react";
import { getSkills } from "../../api/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .catch(() => setError("Impossible de charger les compétences"))
      .finally(() => setLoading(false));
  }, []);


 return (
    <div className="h-full flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl text-center">
        <h1 className="text-7xl sm:text-8xl font-bold text-gray-900 leading-[1.1] mb-10 tracking-tight">
          Bienvenue sur<br />
          <span className="text-violet-600">SkillLink</span>
        </h1>

        <p className="text-2xl text-gray-500 leading-relaxed mb-16 max-w-3xl mx-auto">
          Apprenez une nouvelle compétence en partageant la vôtre. Connectez-vous
          avec des personnes prêtes à échanger leur savoir-faire — sans argent,
          juste du partage de connaissances.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            to="/login"
            className="px-12 py-5 rounded-xl bg-gray-900 text-white text-xl font-semibold hover:bg-gray-800 transition"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="px-12 py-5 rounded-xl border-2 border-gray-300 text-gray-900 text-xl font-semibold hover:bg-gray-50 transition"
          >
            Inscription
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;