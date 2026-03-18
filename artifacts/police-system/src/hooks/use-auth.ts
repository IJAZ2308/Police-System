import { create } from "zustand";
import type { User, LoginRequest, RegisterRequest } from "@workspace/api-client-react";
import { login, register, getMe } from "@workspace/api-client-react";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  token: localStorage.getItem("police_token"),
  user: null,
  isLoading: true,
  
  setAuth: (token, user) => {
    localStorage.setItem("police_token", token);
    set({ token, user, isLoading: false });
  },
  
  logout: () => {
    localStorage.removeItem("police_token");
    set({ token: null, user: null, isLoading: false });
    window.location.href = "/";
  },
  
  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isLoading: false });
      return;
    }
    
    try {
      const user = await getMe({ headers: { Authorization: `Bearer ${token}` } });
      set({ user, isLoading: false });
    } catch (error) {
      localStorage.removeItem("police_token");
      set({ token: null, user: null, isLoading: false });
    }
  },

  login: async (data) => {
    const res = await login(data);
    get().setAuth(res.token, res.user);
  },

  register: async (data) => {
    const res = await register(data);
    get().setAuth(res.token, res.user);
  }
}));

export const getAuthHeaders = () => {
  const token = localStorage.getItem("police_token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};
