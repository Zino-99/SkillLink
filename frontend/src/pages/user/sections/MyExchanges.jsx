import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const MyExchanges = () => {
  const { user } = useAuth();
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("received");

  useEffect(() => {
    fetch("http://localhost:8000/api/exchanges/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setSent(data.sent || []);
        setReceived(data.received || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    await fetch(`http://localhost:8000/api/exchanges/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReceived((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted": return "bg-green-50 text-green-700";
      case "rejected": return "bg-red-50 text-red-700";
      default:         return "bg-yellow-50 text-yellow-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "accepted": return "Accepté";
      case "rejected": return "Refusé";
      default:         return "En attente";
    }
  };

  const getColor = (name) => {
    const colors = [
      "bg-violet-600", "bg-blue-600", "bg-green-600",
      "bg-orange-500", "bg-pink-600", "bg-teal-600"
    ];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index] || "bg-gray-600";
  };

  const EmptyState = ({ text }) => (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-12 text-center">
      <p className="text-2xl mb-3">🔄</p>
      <p className="text-lg font-semibold text-gray-900 mb-2">{text}</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes échanges</h1>
      <p className="text-lg text-gray-500 mb-8">
        Gérez vos demandes d'échange envoyées et reçues
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("received")}
          className={`px-5 py-2.5 rounded-xl text-base font-semibold transition ${
            tab === "received"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Reçues {received.length > 0 && `(${received.length})`}
        </button>
        <button
          onClick={() => setTab("sent")}
          className={`px-5 py-2.5 rounded-xl text-base font-semibold transition ${
            tab === "sent"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Envoyées {sent.length > 0 && `(${sent.length})`}
        </button>
      </div>

      {loading && <p className="text-gray-400">Chargement...</p>}

      {/* Reçues */}
      {!loading && tab === "received" && (
        <>
          {received.length === 0 ? (
            <EmptyState text="Aucune demande reçue pour le moment" />
          ) : (
            <div className="space-y-4">
              {received.map((exchange) => (
                <div
                  key={exchange.id}
                  className="bg-white border-2 border-gray-100 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${getColor(exchange.sender_nom)} flex items-center justify-center text-white text-lg font-bold`}>
                      {exchange.sender_nom?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{exchange.sender_nom}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(exchange.date).toLocaleDateString("fr-FR")} — {exchange.skill_titre}
                      </p>
                    </div>
                    <span className={`ml-auto px-3 py-1.5 rounded-xl text-sm font-semibold ${getStatusStyle(exchange.status)}`}>
                      {getStatusLabel(exchange.status)}
                    </span>
                  </div>

                  {exchange.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatus(exchange.id, "accepted")}
                        className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => handleStatus(exchange.id, "rejected")}
                        className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Envoyées */}
      {!loading && tab === "sent" && (
        <>
          {sent.length === 0 ? (
            <EmptyState text="Aucune demande envoyée pour le moment" />
          ) : (
            <div className="space-y-4">
              {sent.map((exchange) => (
                <div
                  key={exchange.id}
                  className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${getColor(exchange.receiver_nom)} flex items-center justify-center text-white text-lg font-bold`}>
                      {exchange.receiver_nom?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">À : {exchange.receiver_nom}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(exchange.date).toLocaleDateString("fr-FR")} — {exchange.skill_titre}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${getStatusStyle(exchange.status)}`}>
                    {getStatusLabel(exchange.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyExchanges;