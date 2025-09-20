// src/pages/Dashboard.jsx
import React, { useState } from 'react';

export default function Dashboard() {
  // Replace with actual artisan data fetched from backend
  const artisanName = "Raju Kumar";
  const [products, setProducts] = useState([
    { id: 1, name: "Clay Pot", price: 300, category: "Pottery" },
    { id: 2, name: "Handwoven Basket", price: 450, category: "Basketry" }
  ]);

  // Form state for adding product
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '' });

  const handleInputChange = e => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = e => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category) return;

    const product = { 
      id: Date.now(), 
      name: newProduct.name, 
      price: parseFloat(newProduct.price), 
      category: newProduct.category 
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', category: '' });
    // Call backend API here to save product
  };

  const handleDeleteProduct = id => {
    setProducts(products.filter(p => p.id !== id));
    // Call backend API to delete product too
  };

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {artisanName}</h1>

      {/* Product List */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Your Products</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Price (₹)</th>
              <th className="border border-gray-300 p-2 text-left">Category</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{p.name}</td>
                <td className="border border-gray-300 p-2">{p.price}</td>
                <td className="border border-gray-300 p-2">{p.category}</td>
                <td className="border border-gray-300 p-2 text-center space-x-2">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button 
                    className="text-red-600 hover:underline" 
                    onClick={() => handleDeleteProduct(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Product Form */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-4 max-w-md">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={newProduct.price}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            min="1"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={newProduct.category}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </section>
  );
}
