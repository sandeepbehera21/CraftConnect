import React, { useEffect, useState } from "react";
import { getProfile } from "../services/authService";
import { useAuth } from "../state/AuthContext";
import { API_BASE_URL } from "../config";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProfile();
        setProfile(data);
        setFormData({ name: data.user?.name || "", email: data.user?.email || "" });
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile. Please login again.");
        // Fallback to context user data
        if (user) {
          setFormData({ name: user.name || "", email: user.email || "" });
          setProfile({ user });
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("Please login to view your profile.");
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("cc_token");
      
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      
      const data = await res.json();
      setProfile(data);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (e) {
      console.error("Profile update error:", e);
      setError(e.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Profile</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (profile?.user || user) ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 rounded-lg">{profile?.user?.name || user?.name || "Not available"}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 rounded-lg">{profile?.user?.email || user?.email || "Not available"}</p>
              )}
            </div>
          </div>
          
          {editing && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {isAuthenticated ? "No profile data available" : "Please login to view your profile"}
        </div>
      )}
    </div>
  );
};

export default Profile;
