import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center bg-gradient-to-tr from-[#e0c7ff] via-[#ffe4f1] to-[#cce7ff] text-gray-900">
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6 pt-24 md:pt-32">
        {/* Text Section */}
        <div className="md:w-2/3 text-left md:text-left text-center">
          <div className="mb-3">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
              AI FOR ARTISANS
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Grow your <span className="text-purple-600">craft business</span> <br />
            with intelligent storytelling
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-8 max-w-xl mx-auto md:mx-0">
            Professional product pages, AI-written descriptions and cultural stories, ready for marketplaces and social.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
            {/* ✅ Signup Page */}
            <Link
              to="/signup"
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700 transition"
            >
              Get Started
            </Link>

            {/* ✅ Navigate to Artisan Preview Page */}
            <Link
              to="/artisans"
              className="px-6 py-3 bg-white text-purple-600 font-semibold border border-purple-100 rounded-xl shadow hover:bg-purple-50 transition"
            >
              Artisans Preview
            </Link>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-10 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Secure & ready for scale
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Designed for mobile-first commerce
            </span>
          </div>
        </div>

        {/* Preview Card */}
        <div className="md:w-1/3 flex justify-center">
          <div className="rounded-3xl shadow-xl bg-white bg-opacity-80 p-12 md:p-16 text-center w-[350px] md:w-[400px]">
            <div className="font-semibold mb-3 text-gray-700 text-lg">Preview</div>
            <div className="text-2xl font-bold text-purple-700 mb-3">
              AI Product Story, <br /> Description & Hashtags
            </div>
            <div className="text-gray-500 text-base">
              Auto-generated when you upload a product
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 max-w-6xl mx-auto mt-20 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-purple-100/80 backdrop-blur-lg rounded-xl shadow">
            <p className="text-3xl font-bold text-purple-700">2,000+</p>
            <p className="text-gray-700 text-sm mt-1">Crafts Listed</p>
          </div>
          <div className="p-6 bg-purple-100/80 backdrop-blur-lg rounded-xl shadow">
            <p className="text-3xl font-bold text-purple-700">1,000+</p>
            <p className="text-gray-700 text-sm mt-1">Artisans Onboard</p>
          </div>
          <div className="p-6 bg-purple-100/80 backdrop-blur-lg rounded-xl shadow">
            <p className="text-3xl font-bold text-purple-700">₹10L+</p>
            <p className="text-gray-700 text-sm mt-1">Revenue Generated</p>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="relative z-10 max-w-3xl mx-auto mt-16 px-6">
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 shadow text-center">
          <p className="italic text-lg text-gray-800 leading-relaxed">
            “AI helped me reach new buyers across India and grow my business faster than ever before!”
          </p>
          <p className="mt-4 font-semibold text-purple-700">— Raju, Artisan (Rajasthan)</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 max-w-6xl mx-auto mt-20 px-6 pb-16">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-10">How It Works</h2>
        <div className="flex flex-wrap justify-between items-center text-gray-700 font-semibold text-center px-4 md:px-0">
          {["Artisan", "Upload", "AI Generates", "Global Reach"].map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center flex-1 px-2 mb-6 md:mb-0">
                <div className="mb-2 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                  {i + 1}
                </div>
                {step}
              </div>
              {i < 3 && (
                <div className="hidden md:block h-1 flex-1 bg-purple-300 relative top-5 mx-2 rounded-full"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
