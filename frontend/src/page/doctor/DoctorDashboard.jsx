import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import { HeartPulse, LayoutDashboard, CalendarDays, UserCircle, PenSquare, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

const DoctorDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const displayName = user?.name?.startsWith("Dr.")
    ? user.name
    : `Dr. ${user?.name || "Doctor"}`;

  const initials = (user?.name || "D")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ FIXED: all routes include /doctor/dashboard prefix to match App.jsx nested routes
  const navItems = [
    { to: "/doctor/dashboard",              label: "Overview",     icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { to: "/doctor/dashboard/appointments", label: "Appointments", icon: <CalendarDays    className="w-5 h-5" /> },
    { to: "/doctor/dashboard/profile",      label: "Profile",      icon: <UserCircle      className="w-5 h-5" /> },
    { to: "/doctor/dashboard/profile/edit", label: "Edit Profile", icon: <PenSquare       className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } transition-all duration-300 bg-slate-900 text-white flex flex-col flex-shrink-0`}
      >

        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <HeartPulse className="w-6 h-6 text-blue-400 flex-shrink-0" />
            {!collapsed && (
              <h1 className="text-base font-bold tracking-wide whitespace-nowrap">
                MedConnect
              </h1>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition flex-shrink-0"
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4" />
              : <ChevronLeft  className="w-4 h-4" />
            }
          </button>
        </div>

        {/* Doctor avatar + name */}
        {!collapsed && (
          <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{displayName}</p>
              <p className="text-xs text-slate-400">Doctor</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium
                ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="px-6 py-4 bg-white border-b border-slate-100 shadow-sm flex items-center justify-between">
          <p className="text-slate-700 font-semibold">
            Welcome back, <span className="text-blue-600">{displayName}</span>
          </p>
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
            {initials}
          </div>
        </header>

        {/* CHILD PAGES */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DoctorDashboard;