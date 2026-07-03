import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  ArrowLeftRight,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "explore", label: "Explorer", icon: Search },
  { id: "exchanges", label: "Mes échanges", icon: ArrowLeftRight },
  { id: "messages", label: "Mes messages", icon: MessageSquare },
  { id: "profile", label: "Mon profil", icon: User },
];

const Sidebar = ({ active, setActive }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleNav = (id) => {
    setActive(id);
    setMenuOpen(false);
  };

  const getColor = (name) => {
    const colors = ["bg-violet-600", "bg-blue-600", "bg-green-600", "bg-orange-500", "bg-pink-600", "bg-teal-600"];
    return colors[name?.charCodeAt(0) % colors.length] || "bg-gray-600";
  };

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 border-b-2 border-gray-100">
        <p className="text-xl font-bold text-gray-900">SkillLink</p>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 cursor-pointer">
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-100">
            <p className="text-xl font-bold text-gray-900">SkillLink</p>
            <button onClick={() => setMenuOpen(false)} className="text-gray-700 cursor-pointer">
              <X size={26} />
            </button>
          </div>

          <div className="px-6 py-6 border-b-2 border-gray-100">
            <div className={`w-12 h-12 rounded-xl ${getColor(user?.nom)} flex items-center justify-center text-white text-lg font-bold mb-3`}>
              {user?.nom?.charAt(0).toUpperCase()}
            </div>
            <p className="font-bold text-gray-900 text-base">{user?.nom}</p>
            <p className="text-gray-400 text-sm truncate">{user?.email}</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-base font-medium transition ${
                    active === item.id
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="px-3 pb-8">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r-2 border-gray-100 flex-col">
        <div className="px-6 py-6 border-b-2 border-gray-100">
          <p className="text-2xl font-bold text-gray-900 tracking-tight">SkillLink</p>
        </div>

        <div className="px-6 py-6 border-b-2 border-gray-100">
          <div className={`w-12 h-12 rounded-xl ${getColor(user?.nom)} flex items-center justify-center text-white text-lg font-bold mb-3`}>
            {user?.nom?.charAt(0).toUpperCase()}
          </div>
          <p className="font-bold text-gray-900 text-base">{user?.nom}</p>
          <p className="text-gray-400 text-sm truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-base font-medium transition ${
                  active === item.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;