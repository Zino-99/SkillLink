import { useState, useEffect } from "react";

const EmptyState = ({ text }) => (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center">
      <p className="text-lg font-semibold text-gray-900">{text}</p>
    </div>
);


const MyExchanges = () => {
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



  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mes échanges</h1>
      <p className="text-base md:text-lg text-gray-500 mb-8">
        Gérez vos demandes d'échange envoyées et reçues
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("received")}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-base font-semibold transition ${
            tab === "received"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Reçues {received.length > 0 && `(${received.length})`}
        </button>
        <button
          onClick={() => setTab("sent")}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-base font-semibold transition ${
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
                  className="bg-white border-2 border-gray-100 rounded-2xl p-5"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-11 h-11 rounded-xl ${getColor(exchange.sender_nom)} flex items-center justify-center text-white text-base font-bold flex-shrink-0`}>
                      {exchange.sender_nom?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">{exchange.sender_nom}</p>
                      <p className="text-sm text-gray-400 truncate">
                        {new Date(exchange.date).toLocaleDateString("fr-FR")} — {exchange.skill_titre}
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 ${getStatusStyle(exchange.status)}`}>
                      {getStatusLabel(exchange.status)}
                    </span>
                  </div>

                  {exchange.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatus(exchange.id, "accepted")}
                        className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition cursor-pointer"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => handleStatus(exchange.id, "rejected")}
                        className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition cursor-pointer"
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
                  className="bg-white border-2 border-gray-100 rounded-2xl p-5 flex items-start gap-4"
                >
                  <div className={`w-11 h-11 rounded-xl ${getColor(exchange.receiver_nom)} flex items-center justify-center text-white text-base font-bold flex-shrink-0`}>
                    {exchange.receiver_nom?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">À : {exchange.receiver_nom}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {new Date(exchange.date).toLocaleDateString("fr-FR")} — {exchange.skill_titre}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 ${getStatusStyle(exchange.status)}`}>
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