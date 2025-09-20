import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const AuthContext = createContext(null);
const API_URL = `${API_BASE_URL}/api/auth`; // your backend

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("cc_token") || "");
  const [user, setUser] = useState(null);
  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      localStorage.setItem("cc_token", token);
    } else {
      localStorage.removeItem("cc_token");
    }
  }, [token]);

  const value = useMemo(() => ({
    isAuthenticated,
    token,
    user,

    // ✅ Login with backend
    login: async (email, password) => {
      try {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        return true;
      } catch (err) {
        throw err.response?.data?.message || "Login failed";
      }
    },

    // ✅ Signup with backend
    signup: async (name, email, password) => {
      try {
        const res = await axios.post(`${API_URL}/signup`, { name, email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        return true;
      } catch (err) {
        throw err.response?.data?.message || "Signup failed";
      }
    },

    // ✅ Logout
    logout: () => {
      setToken("");
      setUser(null);
    },
  }), [isAuthenticated, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
