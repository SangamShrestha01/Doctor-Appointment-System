import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import {
  HeartPulse, LayoutDashboard, CalendarDays,
  UserCircle, PenSquare, LogOut, ChevronLeft, ChevronRight, Bell
} from "lucide-react";

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

  const navItems = [
    { to: "/doctor/dashboard",              label: "Overview",     icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { to: "/doctor/dashboard/appointments", label: "Appointments", icon: <CalendarDays    className="w-5 h-5" /> },
    { to: "/doctor/dashboard/profile",      label: "Profile",      icon: <UserCircle      className="w-5 h-5" /> },
    { to: "/doctor/dashboard/profile/edit", label: "Edit Profile", icon: <PenSquare       className="w-5 h-5" /> },
  ];

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ================= SIDEBAR ================= */}
      <aside className={`${collapsed ? "w-20" : "w-64"} fixed top-0 left-0 h-screen transition-all duration-300 z-20 flex flex-col`}
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 60%, #0f2744 100%)" }}
      >
        {/* Logo */}
        <div className="px-4 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/40">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <span className="text-white font-bold text-base tracking-wide whitespace-nowrap">
                Medi<span className="text-blue-400">Care</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-slate-400 hover:text-white flex-shrink-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Doctor Card */}
        <div className={`mx-3 mt-4 mb-2 rounded-2xl p-3 border border-white/10 flex items-center gap-3 overflow-hidden
          ${collapsed ? "justify-center px-0" : ""}`}
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user?.image ? (
              <img src={user.image} alt="avatar"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-400/50" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                {initials}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-xs text-blue-300 font-medium">● Online</p>
            </div>
          )}
        </div>

        {/* Nav Label */}
        {!collapsed && (
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-5 mb-2 mt-3">
            Navigation
          </p>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group
                ${isActive
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-400 hover:bg-white/8 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-300"}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                  {!collapsed && isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-red-400 hover:bg-red-500/15 hover:text-red-300 transition group
              ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-0.5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>

        {/* HEADER */}
        <header className="sticky top-0 z-10 px-6 py-3.5 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm flex items-center justify-between">

          {/* Left — greeting */}
          <div>
            <p className="text-base font-bold text-slate-800">
              {getGreeting()}, <span className="text-blue-600">{displayName}</span> 👋
            </p>
            <p className="text-xs text-slate-400">{dateStr} · {timeStr}</p>
          </div>

          {/* Right — bell + avatar */}
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-blue-100">
              {user?.image ? (
                <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

// ✅ Time-based greeting
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export default DoctorDashboard;