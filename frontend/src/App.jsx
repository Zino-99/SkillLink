import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/user/Home";
import Onboarding from "./pages/user/Onboarding";
import Dashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

const AppContent = () => {
  const location = useLocation();
  const hiddenNavbar = ["/dashboard", "/admin"];
  const showNavbar = !hiddenNavbar.includes(location.pathname);

  return (
    <div className="h-screen flex flex-col bg-white">
      {showNavbar && <Navbar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
  }
/>
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;