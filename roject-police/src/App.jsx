import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/police"
        element={
          <ProtectedRoute role="POLICE">
            <PoliceDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analyst"
        element={
          <ProtectedRoute role="ANALYST">
            <AnalystDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
