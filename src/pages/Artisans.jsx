import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

const ArtisansPreview = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchArtisans() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/auth/artisans`);
        if (!res.ok) throw new Error("Failed to load artisans");
        const data = await res.json();
        setArtisans(data || []);
      } catch (e) {
        setError(e.message || "Failed to load artisans");
      } finally {
        setLoading(false);
      }
    }
    fetchArtisans();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet Our Artisans</h2>
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading artisans...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet Our Artisans</h2>
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet Our Artisans</h2>
        {artisans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No artisans with products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {artisans.map((artisan) => (
              <div key={artisan._id} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
                <div className="h-40 w-40 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-sm">
                  {artisan.name?.charAt(0) || 'A'}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{artisan.name}</h3>
                <p className="text-sm text-gray-500">{artisan.productCount} product{artisan.productCount !== 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-400 mt-1">Joined {new Date(artisan.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
};

export default ArtisansPreview;
