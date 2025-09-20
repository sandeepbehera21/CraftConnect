import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("cc_token") || localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/orders/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (e) {
      setError(e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Product</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Placed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4" colSpan={6}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td className="p-4" colSpan={6}>No orders yet.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{o._id.slice(-6).toUpperCase()}</td>
                  <td className="p-3 flex items-center gap-3">
                    {o.product?.image && (
                      <img src={o.product.image} alt={o.product?.name} className="w-10 h-10 object-cover rounded" />
                    )}
                    <span>{o.product?.name || "Product"}</span>
                  </td>
                  <td className="p-3">{o.customerName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      o.status === "Shipped"
                        ? "bg-green-100 text-green-600"
                        : o.status === "Delivered"
                        ? "bg-blue-100 text-blue-600"
                        : o.status === "Cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3">₹{o.amount}</td>
                  <td className="p-3 text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
  