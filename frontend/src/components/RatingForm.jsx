import { useState } from "react";
import { createRating } from "../api/api";
import { Star } from "lucide-react";

const RatingForm = ({ exchange, onRated }) => {
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [rated, setRated] = useState(false);
  const [error, setError] = useState("");

  const handleRating = async () => {
    if (!commentaire.trim()) return;
    try {
      await createRating(exchange.sender_id, note, commentaire);
      setRated(true);
      setShowForm(false);
      setCommentaire("");
      setNote(5);
      if (onRated) onRated(exchange.id);
    } catch (err) {
      setError(err.error || "Erreur lors de la notation");
    }
  };

  if (rated) {
    return (
      <div className="mt-2 border-l-4 border-gray-900 bg-gray-50 px-3 py-2 rounded-r-xl">
        <p className="text-sm font-medium text-gray-900">Note envoyée.</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {error && (
        <div className="border-l-4 border-red-600 bg-red-50 px-3 py-2 rounded-r-xl mb-2">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer flex items-center justify-center gap-2"
      >
        <Star size={14} />
        Noter {exchange.sender_nom}
      </button>

      {showForm && (
        <div className="mt-3 bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Noter {exchange.sender_nom}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm font-medium text-gray-700">Note :</label>
            <select
              value={note}
              onChange={(e) => setNote(parseInt(e.target.value))}
              className="border-2 border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-gray-900 transition"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} / 5</option>
              ))}
            </select>
          </div>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Laissez un commentaire..."
            rows={3}
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-900 transition resize-none mb-3"
          />
          <button
            onClick={handleRating}
            disabled={!commentaire.trim()}
            className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-40 cursor-pointer"
          >
            Envoyer la note
          </button>
        </div>
      )}
    </div>
  );
};

export default RatingForm;