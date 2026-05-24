import React, { useContext } from "react";
import AuthContext from "../../context/auth-context";

const AdminNavbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="w-full bg-white shadow px-6 py-3 flex justify-between items-center">

      {/* Left — brand name, not page title */}
      <h1 className="text-xl font-semibold text-gray-800">
        
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          👤 {user?.name || "Admin"}
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;