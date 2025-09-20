export default function Profile() {
    return (
      <div className="p-6 max-w-xl">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="https://via.placeholder.com/80"
              alt="profile"
              className="w-20 h-20 rounded-full border"
            />
            <div>
              <h2 className="text-xl font-semibold">Amit Kumar</h2>
              <p className="text-gray-500">Handicraft Artisan</p>
            </div>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" defaultValue="Amit Kumar" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="w-full px-3 py-2 border rounded-lg" defaultValue="amit@example.com" />
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    );
  }
  