import RatingForm from "./RatingForm";

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

const ExchangeCard = ({ exchange, type, onStatusChange }) => {
  const name = type === "sent" ? exchange.receiver_nom : exchange.sender_nom;
  const label = type === "sent" ? `À : ${name}` : name;

  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-11 h-11 rounded-xl ${getColor(name)} flex items-center justify-center text-white text-base font-bold flex-shrink-0`}>
          {name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900">{label}</p>
          <p className="text-sm text-gray-400 truncate">
            {new Date(exchange.date).toLocaleDateString("fr-FR")} — {exchange.skill_titre}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 ${getStatusStyle(exchange.status)}`}>
          {getStatusLabel(exchange.status)}
        </span>
      </div>

      {type === "received" && exchange.status === "pending" && (
        <div className="flex gap-3">
          <button
            onClick={() => onStatusChange(exchange.id, "accepted")}
            className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition cursor-pointer"
          >
            Accepter
          </button>
          <button
            onClick={() => onStatusChange(exchange.id, "rejected")}
            className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition cursor-pointer"
          >
            Refuser
          </button>
        </div>
      )}

      {type === "received" && exchange.status === "accepted" && (
        <RatingForm exchange={exchange} />
      )}
    </div>
  );
};

export default ExchangeCard;