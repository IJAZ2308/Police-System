import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

const AuthGuard = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
};

export default AuthGuard;
