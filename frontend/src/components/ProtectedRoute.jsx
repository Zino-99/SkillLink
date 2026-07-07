import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin()) return <Navigate to="/dashboard" />;
  if (!adminOnly && isAdmin()) return <Navigate to="/admin" />;

  return children;
};

export default ProtectedRoute;