import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Artisan Dashboard
      </div>
      <nav className="mt-6 flex flex-col space-y-4 px-4">
        <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">🏠 Dashboard</Link>
        <Link to="/dashboard/products" className="hover:bg-gray-700 p-2 rounded">📦 My Products</Link>
        <Link to="/dashboard/orders" className="hover:bg-gray-700 p-2 rounded">🛒 Orders</Link>
        <Link to="/dashboard/profile" className="hover:bg-gray-700 p-2 rounded">👤 Profile</Link>
        <Link to="/login" className="mt-auto bg-red-600 hover:bg-red-700 p-2 rounded text-center">🚪 Logout</Link>
      </nav>
    </div>
  );
}
