import React, { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth-context";

const DoctorDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded transition-all ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">Doctor Dashboard</h2>
          <p className="text-sm text-gray-500 mb-6">
            Welcome, {user?.name || "Doctor"}
          </p>

          <nav className="space-y-2">
            <NavLink to="/dashboard" end className={linkClass}>
              🏠 Overview
            </NavLink>

            <NavLink to="/dashboard/appointments" className={linkClass}>
              📅 Appointments
            </NavLink>

            <NavLink to="/dashboard/profile" className={linkClass}>
              👤 Profile
            </NavLink>

            <NavLink to="/dashboard/edit-profile" className={linkClass}>
              ✏️ Edit Profile
            </NavLink>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-all text-sm font-medium"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorDashboard;