import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as apiRegister, login as apiLogin } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await apiRegister(nom, email, password);
      const data = await apiLogin(email, password);
      login(data.user);
      setSuccess(true);
      setTimeout(() => navigate("/onboarding"), 2000);
    } catch (err) {
      setError(err.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center tracking-tight">
          Créer un compte SkillLink
        </h1>

        {success && (
          <div className="bg-green-50 text-green-700 text-base p-4 rounded-xl mb-6 text-center font-medium">
            ✅ Compte créé avec succès ! Redirection en cours...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 text-base p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3.5 text-lg focus:outline-none focus:border-gray-900 transition"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3.5 text-lg focus:outline-none focus:border-gray-900 transition"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3.5 text-lg focus:outline-none focus:border-gray-900 transition"
            />
          </div>

          <button
            type="submit"
            disabled={success}
            className="w-full bg-gray-900 text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition disabled:opacity-40"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-lg text-gray-500 text-center mt-8">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-gray-900 font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;