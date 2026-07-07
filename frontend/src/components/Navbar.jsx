import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          SkillLink
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <span className="text-base text-gray-500">Bonjour, {user.nom}</span>
              {isAdmin() && (
                <Link to="/admin" className="text-base font-medium text-violet-600 hover:text-violet-700 transition">
                  Administration
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-base font-medium text-red-600 hover:text-red-700 transition cursor-pointer"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-base font-medium text-gray-700 hover:text-gray-900 transition">
                Connexion
              </Link>
              <Link
                to="/register"
                className="text-base font-semibold bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
              >
                Inscription
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-gray-700 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-6 py-4 space-y-3">
          {user ? (
            <>
              <p className="text-base text-gray-500 py-2">Bonjour, {user.nom}</p>
              {isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block text-base font-medium text-violet-600 py-2"
                >
                  Administration
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-base font-semibold text-red-600 border-2 border-red-200 py-3 rounded-xl hover:bg-red-50 transition cursor-pointer"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center text-base font-semibold border-2 border-gray-300 text-gray-900 py-3 rounded-xl hover:bg-gray-50 transition"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center text-base font-semibold bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;