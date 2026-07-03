import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Users, Flag, BarChart2, Menu, X } from "lucide-react";
import AdminUsers from "./sections/AdminUsers";
import AdminReports from "./sections/AdminReports";

const menuItems = [
  { id: "stats", label: "Vue générale", icon: BarChart2 },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "reports", label: "Signalements", icon: Flag },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("stats");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  const renderContent = () => {
    switch (active) {
      case "stats":   return <AdminStats />;
      case "users":   return <AdminUsers />;
      case "reports": return <AdminReports />;
      default:        return <AdminStats />;
    }
  };

  const SidebarContent = () => (
    <>
      <div className="px-6 py-6 border-b-2 border-gray-100">
        <p className="text-2xl font-bold text-gray-900 tracking-tight">SkillLink</p>
        <span className="inline-block bg-violet-50 text-violet-700 text-xs font-semibold px-2 py-1 rounded-lg mt-1">
          Administration
        </span>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-base font-medium transition cursor-pointer ${
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
    </>
  );

  return (
    <div className="h-screen flex flex-col bg-white">

      {/* Mobile topbar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 border-b-2 border-gray-100">
        <div>
          <p className="text-xl font-bold text-gray-900">SkillLink</p>
          <span className="text-xs font-semibold text-violet-700">Administration</span>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 cursor-pointer">
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-100">
            <div>
              <p className="text-xl font-bold text-gray-900">SkillLink</p>
              <span className="text-xs font-semibold text-violet-700">Administration</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-gray-700 cursor-pointer">
              <X size={26} />
            </button>
          </div>
          <SidebarContent />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 border-r-2 border-gray-100 flex-col">
          <SidebarContent />
        </aside>

        {/* Contenu */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const AdminStats = () => {
  const [stats, setStats] = useState({ users: 0, skills: 0, exchanges: 0, reports: 0 });

  useState(() => {
    fetch("http://localhost:8000/api/admin/stats", { credentials: "include" })
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Vue générale</h1>
      <p className="text-base md:text-lg text-gray-500 mb-8">Statistiques de la plateforme SkillLink</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
          <p className="text-4xl font-bold text-gray-900 mb-1">{stats.users}</p>
          <p className="text-base text-gray-500">Utilisateurs inscrits</p>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
          <p className="text-4xl font-bold text-gray-900 mb-1">{stats.skills}</p>
          <p className="text-base text-gray-500">Compétences publiées</p>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
          <p className="text-4xl font-bold text-gray-900 mb-1">{stats.exchanges}</p>
          <p className="text-base text-gray-500">Demandes d'échange</p>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
          <p className="text-4xl font-bold text-violet-600 mb-1">{stats.reports}</p>
          <p className="text-base text-gray-500">Signalements en attente</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;