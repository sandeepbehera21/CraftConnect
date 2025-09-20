import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
              <span className="text-lg font-bold">CraftConnect</span>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Empowering artisans with AI-driven storytelling and a beautiful marketplace presence.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-200">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="hover:text-white" href="/products">Products</a></li>
              <li><a className="hover:text-white" href="/impact">Our Impact</a></li>
              <li><a className="hover:text-white" href="/contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-200">Follow</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="hover:text-white" href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
              <li><a className="hover:text-white" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a className="hover:text-white" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} CraftConnect. All rights reserved.</p>
          <div className="mt-3 sm:mt-0 flex items-center gap-4">
            <a className="hover:text-white" href="/features">Features</a>
            <span className="h-3 w-px bg-white/10"></span>
            <a className="hover:text-white" href="/products">Shop</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
