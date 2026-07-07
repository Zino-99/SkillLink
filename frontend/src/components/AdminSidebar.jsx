import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Users, Flag, BarChart2 } from "lucide-react";

const menuItems = [
  { id: "stats", label: "Vue générale", icon: BarChart2 },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "reports", label: "Signalements", icon: Flag },
];

const AdminSidebar = ({ active, setActive }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getColor = (name) => {
    const colors = ["bg-violet-600", "bg-blue-600", "bg-green-600", "bg-orange-500", "bg-pink-600", "bg-teal-600"];
    return colors[name?.charCodeAt(0) % colors.length] || "bg-gray-600";
  };

  return (
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
              onClick={() => setActive(item.id)}
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
};

export default AdminSidebar;