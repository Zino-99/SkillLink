import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const MyMessages = () => {
  const { user } = useAuth();
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [contenu, setContenu] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("received");

  useEffect(() => {
    fetch("http://localhost:8000/api/messages/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setSent(data.sent || []);
        setReceived(data.received || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("http://localhost:8000/api/users/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUsers(data.filter((u) => u.id !== user?.id)))
      .catch(() => {});
  }, [user?.id]);

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/messages/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu, receiver_id: parseInt(receiverId) }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setSuccess(true);
      setContenu("");
      setReceiverId("");
      setShowForm(false);
      setSent((prev) => [...prev, {
        id: data.id,
        contenu,
        date: new Date().toISOString(),
        sender_id: user?.id,
        sender_nom: user?.nom,
        receiver_id: parseInt(receiverId),
        receiver_nom: users.find(u => u.id === parseInt(receiverId))?.nom,
      }]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.error || "Erreur lors de l'envoi");
    }
  };

  const getColor = (name) => {
    const colors = ["bg-violet-600", "bg-blue-600", "bg-green-600", "bg-orange-500", "bg-pink-600", "bg-teal-600"];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index] || "bg-gray-600";
  };

  const MessageCard = ({ message, type }) => {
    const name = type === "sent" ? message.receiver_nom : message.sender_nom;
    const label = type === "sent" ? `À : ${name}` : `De : ${name}`;
    return (
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl ${getColor(name)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
            {name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="text-xs text-gray-400">
              {new Date(message.date).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
        <p className="text-base text-gray-700">{message.contenu}</p>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mes messages</h1>
        <button
          onClick={() => { setShowForm(!showForm); setSuccess(false); }}
          className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
        >
          + Nouveau
        </button>
      </div>
      <p className="text-base md:text-lg text-gray-500 mb-8">
        Consultez et envoyez des messages aux autres utilisateurs
      </p>

      {success && (
        <div className="border-l-4 border-gray-900 bg-gray-50 px-4 py-3 rounded-r-xl mb-6">
          <p className="text-base font-medium text-gray-900">Message envoyé.</p>
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">Nouveau message</h2>
          {error && (
            <div className="border-l-4 border-red-600 bg-red-50 px-4 py-3 rounded-r-xl mb-4">
              <p className="text-base font-medium text-red-700">{error}</p>
            </div>
          )}
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Destinataire</label>
              <select
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition"
              >
                <option value="">Sélectionner un utilisateur</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                required
                rows={4}
                placeholder="Écrivez votre message..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900 transition resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-base font-semibold hover:bg-gray-800 transition cursor-pointer"
              >
                Envoyer
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 text-base font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("received")}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-base font-semibold transition ${tab === "received" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Reçus {received.length > 0 && `(${received.length})`}
        </button>
        <button
          onClick={() => setTab("sent")}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-base font-semibold transition ${tab === "sent" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Envoyés {sent.length > 0 && `(${sent.length})`}
        </button>
      </div>

      {loading && <p className="text-gray-400">Chargement...</p>}

      {!loading && tab === "received" && (
        received.length === 0 ? (
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">Aucun message reçu</p>
          </div>
        ) : (
          <div className="space-y-4">
            {received.map((m) => <MessageCard key={m.id} message={m} type="received" />)}
          </div>
        )
      )}

      {!loading && tab === "sent" && (
        sent.length === 0 ? (
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">Aucun message envoyé</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sent.map((m) => <MessageCard key={m.id} message={m} type="sent" />)}
          </div>
        )
      )}
    </div>
  );
};

export default MyMessages;