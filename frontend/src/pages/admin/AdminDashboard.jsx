import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Users, Flag, BarChart2 } from "lucide-react";
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
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (active) {
      case "stats":   return <AdminStats />;
      case "users":   return <AdminUsers />;
      case "reports": return <AdminReports />;
      default:        return <AdminStats />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r-2 border-gray-100 flex flex-col">
          <div className="px-6 py-6 border-b-2 border-gray-100">
            <p className="text-2xl font-bold text-gray-900 tracking-tight">SkillLink</p>
            <span className="inline-block bg-violet-50 text-violet-700 text-xs font-semibold px-2 py-1 rounded-lg mt-1">
              Administration
            </span>
          </div>

          <div className="px-6 py-6 border-b-2 border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center text-white text-lg font-bold mb-3">
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
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-100 transition mb-1"
            >
              <span>← Retour au dashboard</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Contenu */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Vue générale</h1>
      <p className="text-lg text-gray-500 mb-8">Statistiques de la plateforme SkillLink</p>

      <div className="grid grid-cols-2 gap-6">
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