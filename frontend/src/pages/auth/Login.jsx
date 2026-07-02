import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as apiLogin } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
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
      const data = await apiLogin(email, password);
      login(data.user);
      setSuccess(true);
      setTimeout(() => {
        if (data.user.roles?.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (err) {
      setError(err.error || "Erreur de connexion");
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center tracking-tight">
          Connexion à SkillLink
        </h1>

        {success && (
          <div className="border-l-4 border-gray-900 bg-gray-50 px-4 py-3 rounded-r-xl mb-6">
            <p className="text-base font-medium text-gray-900">Connexion réussie. Redirection en cours...</p>
          </div>
        )}

        {error && (
          <div className="border-l-4 border-red-600 bg-red-50 px-4 py-3 rounded-r-xl mb-6">
            <p className="text-base font-medium text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full bg-gray-900 text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition cursor-pointer disabled:opacity-40"
          >
            Se connecter
          </button>
        </form>

        <p className="text-lg text-gray-500 text-center mt-8">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-gray-900 font-semibold">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;