import { useState, useEffect } from "react";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/reports", { credentials: "include" })
      .then((res) => res.json())
      .then(setReports)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    await fetch(`http://localhost:8000/api/admin/reports/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "resolved": return "bg-green-50 text-green-700";
      case "rejected": return "bg-red-50 text-red-700";
      default:         return "bg-yellow-50 text-yellow-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "resolved": return "Résolu";
      case "rejected": return "Rejeté";
      default:         return "En attente";
    }
  };

  const getColor = (name) => {
    const colors = ["bg-violet-600", "bg-blue-600", "bg-green-600", "bg-orange-500", "bg-pink-600", "bg-teal-600"];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index] || "bg-gray-600";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Signalements</h1>
      <p className="text-lg text-gray-500 mb-8">
        Gérez les signalements des utilisateurs
      </p>

      {loading && <p className="text-gray-400">Chargement...</p>}

      {!loading && reports.length === 0 && (
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-12 text-center">
          <p className="text-2xl mb-3">🎉</p>
          <p className="text-lg font-semibold text-gray-900">Aucun signalement en attente</p>
        </div>
      )}

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${getColor(report.reporter_nom)} flex items-center justify-center text-white text-lg font-bold`}>
                  {report.reporter_nom?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {report.reporter_nom} → {report.reported_nom}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(report.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${getStatusStyle(report.status)}`}>
                {getStatusLabel(report.status)}
              </span>
            </div>

            <p className="text-base text-gray-700 mb-4 bg-gray-50 rounded-xl p-4">
              {report.description}
            </p>

            {report.status === "pending" && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleStatus(report.id, "resolved")}
                  className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                >
                  Marquer comme résolu
                </button>
                <button
                  onClick={() => handleStatus(report.id, "rejected")}
                  className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                >
                  Rejeter
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;