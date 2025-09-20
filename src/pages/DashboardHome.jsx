import { useState } from "react";
import { API_BASE_URL } from "../config";

export default function DashboardHome() {
  const stats = [
    { title: "Total Products", value: 12 },
    { title: "Pending Orders", value: 5 },
    { title: "Revenue", value: "₹24,500" },
  ];

  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null); // preview URL
  const [productImageFile, setProductImageFile] = useState(null); // actual File
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("other");
  const [region, setRegion] = useState("");
  const canSave = !!aiResult && (!!productName || !!productImageFile);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setProductImage(URL.createObjectURL(file));
      setProductImageFile(file);
    } else {
      setProductImage(null);
      setProductImageFile(null);
    }
  }

  async function generateStory(e) {
    e.preventDefault();
    if (!productName && !productImageFile) {
      setError("Enter a product name or upload a photo");
      return;
    }

    setLoading(true);
    setError("");
    setAiResult(null);
    
    try {
      // Try multiple possible API endpoints
      const apiEndpoints = [
        `${API_BASE_URL}/api/products/generate`
      ];

      let response;
      let lastError;

      for (const endpoint of apiEndpoints) {
        try {
          if (productImageFile) {
            const formData = new FormData();
            formData.append("image", productImageFile);
            if (productName) formData.append("name", productName);
            response = await fetch(endpoint, {
              method: "POST",
              body: formData,
            });
          } else {
            response = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: productName }),
            });
          }

          if (response.ok) break;
        } catch (err) {
          lastError = err;
          console.log(`Failed to connect to ${endpoint}, trying next...`);
        }
      }

      if (!response || !response.ok) {
        throw new Error(lastError?.message || "Cannot connect to the server. Make sure your backend is running.");
      }

      const data = await response.json();
      
      if (!data.description && !data.story && !data.caption) {
        throw new Error("AI service returned empty content. Please try again.");
      }

      setAiResult({
        description: data.description || "No description generated.",
        story: data.story || "No story generated.",
        caption: data.caption || "No caption generated.",
      });
    } catch (error) {
      console.error("AI Generation Error:", error);
      setError(error.message || "Failed to generate content. Please check your backend server.");
    } finally {
      setLoading(false);
    }
  }

  async function addProduct() {
    if (!canSave) return;
    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("cc_token") || localStorage.getItem("token");
      if (!token) {
        throw new Error("You are not logged in. Please login and try again.");
      }
      const formData = new FormData();
      if (productImageFile) formData.append("image", productImageFile);
      if (productName) formData.append("name", productName);
      if (aiResult?.description) formData.append("description", aiResult.description);
      if (aiResult?.story) formData.append("story", aiResult.story);
      if (aiResult?.caption) formData.append("caption", aiResult.caption);
      if (price) formData.append("price", price);
      if (stock) formData.append("stock", stock);
      if (category) formData.append("category", category);
      if (region) formData.append("region", region);

      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        let serverMsg = "";
        try { serverMsg = await res.text(); } catch (_) {}
        if (res.status === 401) throw new Error("Unauthorized. Please login again.");
        throw new Error(serverMsg || `Failed to add product (HTTP ${res.status})`);
      }

      // Clear inputs after successful save
      setProductName("");
      setProductImage(null);
      setProductImageFile(null);
      setAiResult(null);
      setPrice("");
      setStock("");
      setCategory("other");
      setRegion("");
      alert("Product added to My Products");
    } catch (e) {
      setError(e.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">CraftConnect</h1>
        <p className="text-gray-600">Artisan Stories Marketplace</p>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Artisan Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item, i) => (
            <div key={i} className="bg-indigo-50 shadow-md rounded-xl p-6 border border-indigo-100 hover:shadow-lg transition">
              <h2 className="text-gray-600 text-sm font-medium">{item.title}</h2>
              <p className="text-2xl font-bold mt-2 text-indigo-700">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Product Story Generator */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">AI Product Story Generator</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <form onSubmit={generateStory} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Give your product a clear name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">This name will appear in My Products after you click Add Product.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Product Photo (Optional)
              </label>
              <div className="flex items-center space-x-3">
                <label className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer hover:bg-indigo-200 transition-colors">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-500">
                  {productImageFile ? productImageFile.name : "No file chosen"}
                </span>
              </div>
              
              {productImage && (
                <div className="mt-4">
                  <img
                    src={productImage}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-indigo-200"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 499.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="pottery">Pottery</option>
                  <option value="textiles">Textiles</option>
                  <option value="woodwork">Woodwork</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="metalwork">Metalwork</option>
                  <option value="basketry">Basketry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Rajasthan, Kashmir"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
              type="submit"
              disabled={loading || (!productName && !productImageFile)}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Story...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Generate Story
                </>
              )}
              </button>

              <button
                type="button"
                onClick={addProduct}
                disabled={!canSave || saving}
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Product...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Product
                  </>
                )}
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Pro Tip</h3>
              <p className="text-blue-600 text-sm">
                Make sure your backend server is running on port 5000 for the AI generation to work properly.
              </p>
            </div>
          </div>

          {/* Right Side: AI Result */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Generated Content</h3>
            
            {aiResult ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Product Description
                  </h4>
                  <p className="text-green-700 mt-2">{aiResult.description}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Craft Story
                  </h4>
                  <p className="text-purple-700 mt-2">{aiResult.story}</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    Social Media Caption
                  </h4>
                  <p className="text-orange-700 mt-2">{aiResult.caption}</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="text-gray-500 text-lg font-medium">Your AI-generated content will appear here</p>
                <p className="text-gray-400 text-sm mt-2">Enter a product name and click "Generate Story"</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}