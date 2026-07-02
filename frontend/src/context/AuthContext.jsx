import { createContext, useContext, useState, useEffect } from "react";
import { me, logout as apiLogout } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  me()
    .then(data => setUser(data.user ?? data))
    .catch(() => setUser(null))
    .finally(() => setLoading(false));
}, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

const isAdmin = () => user?.roles?.includes("ROLE_ADMIN");
const isUser = () => !user?.roles?.includes("ROLE_ADMIN");

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);