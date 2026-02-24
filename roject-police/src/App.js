import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";
import Signup from "./components/Signup";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/police" element={
          <ProtectedRoute role="POLICE"><PoliceDashboard /></ProtectedRoute>
        } />
        <Route path="/analyst" element={
          <ProtectedRoute role="ANALYST"><AnalystDashboard /></ProtectedRoute>
        } />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
