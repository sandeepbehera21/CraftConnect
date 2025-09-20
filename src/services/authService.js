import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/auth`; // your backend URL

// ✅ Signup
export const signup = async (userData) => {
  const res = await axios.post(`${API_URL}/signup`, userData);
  return res.data;
};

// ✅ Login
export const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  // Save token to localStorage with consistent key
  if (res.data.token) {
    localStorage.setItem("cc_token", res.data.token);
  }
  return res.data;
};

// ✅ Get profile (protected route)
export const getProfile = async () => {
  const token = localStorage.getItem("cc_token");
  const res = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Logout
export const logout = () => {
  localStorage.removeItem("cc_token");
};
