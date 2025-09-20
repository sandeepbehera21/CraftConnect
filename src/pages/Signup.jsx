import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { useToast } from "../ui/ToastProvider.jsx";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  function validate() {
    const next = { name: "", email: "", password: "" };
    if (!name.trim()) next.name = "Full name is required";
    if (!email) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "At least 6 characters";
    setErrors(next);
    return !next.name && !next.email && !next.password;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signup(name, email, password);
      show("Welcome to CraftConnect!", "success");
      navigate("/dashboard", { replace: true });
    } catch (e) {
      show("Signup failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-2xl font-semibold mb-6 text-center">Signup</h3>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 ${errors.name ? "border-red-400" : ""}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 ${errors.email ? "border-red-400" : ""}`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 ${errors.password ? "border-red-400" : ""}`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}
