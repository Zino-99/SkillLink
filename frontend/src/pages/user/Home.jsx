import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="h-full flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-gray-900 leading-[1.1] mb-8 md:mb-10 tracking-tight">
          Bienvenue sur<br />
          <span className="text-violet-600">SkillLink</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 leading-relaxed mb-12 md:mb-16 max-w-3xl mx-auto">
          Apprenez une nouvelle compétence en partageant la vôtre. Connectez-vous
          avec des personnes prêtes à échanger leur savoir-faire — sans argent,
          juste du partage de connaissances.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-10 py-4 md:px-12 md:py-5 rounded-xl bg-gray-900 text-white text-lg md:text-xl font-semibold hover:bg-gray-800 transition"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="px-10 py-4 md:px-12 md:py-5 rounded-xl border-2 border-gray-300 text-gray-900 text-lg md:text-xl font-semibold hover:bg-gray-50 transition"
          >
            Inscription
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;