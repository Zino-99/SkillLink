import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center h-24">
        <Link to="/" className="text-3xl font-bold text-gray-900 tracking-tight">
          SkillLink
        </Link>

        <div className="flex items-center gap-10">
          {user ? (
            <>
              <span className="text-lg text-gray-500">
                Bonjour, {user.nom}
              </span>
            {user && isAdmin() && (
                <Link to="/admin" className="text-base font-medium text-violet-600 hover:text-violet-700 transition">
                    Administration
                </Link>
            )}
              <button
                onClick={handleLogout}
                className="text-lg font-medium text-red-600 hover:text-red-700 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg font-medium text-gray-700 hover:text-gray-900 transition">
                Connexion
              </Link>
              <Link
                to="/register"
                className="text-lg font-semibold bg-gray-900 text-white px-7 py-3.5 rounded-xl hover:bg-gray-800 transition"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;