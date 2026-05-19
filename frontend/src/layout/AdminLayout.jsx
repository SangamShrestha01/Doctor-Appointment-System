import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/admin/Sidebar";
import AdminNavbar from "../component/admin/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar - fixed on the left */}
      <div className="fixed top-0 left-0 h-screen z-10">
        <Sidebar />
      </div>

      {/* Main Section - offset by sidebar width */}
      <div className="flex-1 flex flex-col ml-64">

        {/* Top Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;