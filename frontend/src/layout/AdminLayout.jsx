import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/admin/Sidebar";
import AdminNavbar from "../component/admin/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

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