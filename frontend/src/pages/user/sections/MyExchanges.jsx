import { useState, useEffect } from "react";
import ExchangeCard from "../../../components/ExchangeCard";
import { API_BASE } from "../../../api/api";

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
    fetch(`${API_BASE}/exchanges/`, {
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

  const handleStatusChange = async (id, status) => {
    await fetch(`${API_BASE}/exchanges/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReceived((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mes échanges</h1>
      <p className="text-base md:text-lg text-gray-500 mb-8">
        Gérez vos demandes d'échange envoyées et reçues
      </p>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("received")}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-base font-semibold transition cursor-pointer ${
            tab === "received"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Reçues {received.length > 0 && `(${received.length})`}
        </button>
        <button
          onClick={() => setTab("sent")}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-base font-semibold transition cursor-pointer ${
            tab === "sent"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Envoyées {sent.length > 0 && `(${sent.length})`}
        </button>
      </div>

      {loading && <p className="text-gray-400">Chargement...</p>}

      {!loading && tab === "received" && (
        received.length === 0 ? (
          <EmptyState text="Aucune demande reçue pour le moment" />
        ) : (
          <div className="space-y-4">
            {received.map((exchange) => (
              <ExchangeCard
                key={exchange.id}
                exchange={exchange}
                type="received"
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )
      )}

      {!loading && tab === "sent" && (
        sent.length === 0 ? (
          <EmptyState text="Aucune demande envoyée pour le moment" />
        ) : (
          <div className="space-y-4">
            {sent.map((exchange) => (
              <ExchangeCard
                key={exchange.id}
                exchange={exchange}
                type="sent"
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MyExchanges;