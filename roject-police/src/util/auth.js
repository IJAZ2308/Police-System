import jwtDecode from "jwt-decode";

export const login = (token) => {
  localStorage.setItem("token", token);
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token ? true : false;
};

export const getUser = () => {
  const token = localStorage.getItem("token");
  return token ? jwtDecode(token) : null;
};
