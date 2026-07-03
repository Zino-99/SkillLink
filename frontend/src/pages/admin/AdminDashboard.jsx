import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminUsers from "./sections/AdminUsers";
import AdminReports from "./sections/AdminReports";

const AdminDashboard = () => {
    const [active, setActive] = useState("stats");
    const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id) => {
    setActive(id);
    setMenuOpen(false);
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
          <AdminSidebar active={active} setActive={handleNav} />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 border-r-2 border-gray-100 flex-col">
          <AdminSidebar active={active} setActive={setActive} />
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