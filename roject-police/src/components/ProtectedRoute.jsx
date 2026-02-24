import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");
  return userRole === role ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
