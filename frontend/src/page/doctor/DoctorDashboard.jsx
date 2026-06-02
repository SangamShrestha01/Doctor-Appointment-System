import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import {
  HeartPulse,
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  PenSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";

const DoctorDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // ================= USER INFO =================
  const displayName = user?.name?.startsWith("Dr.")
    ? user.name
    : `Dr. ${user?.name || "Doctor"}`;

  const initials = (user?.name || "D")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ================= FIXED AVATAR (UPDATED) =================
  const avatarSrc = user?.image
    ? `${user.image.split("?")[0]}?t=${Date.now()}`
    : "/avatar.png";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      to: "/doctor/dashboard",
      label: "Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
      end: true,
    },
    {
      to: "/doctor/dashboard/appointments",
      label: "Appointments",
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      to: "/doctor/dashboard/profile",
      label: "Profile",
      icon: <UserCircle className="w-5 h-5" />,
    },
    {
      to: "/doctor/dashboard/profile/edit",
      label: "Edit Profile",
      icon: <PenSquare className="w-5 h-5" />,
    },
  ];

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ================= SIDEBAR (NO IMAGE HERE) ================= */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } fixed top-0 left-0 h-screen transition-all duration-300 z-20 flex flex-col`}
        style={{
          background:
            "linear-gradient(160deg, #0f172a 0%, #1e3a5f 60%, #0f2744 100%)",
        }}
      >
        {/* Logo */}
        <div className="px-4 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>

            {!collapsed && (
              <span className="text-white font-bold">
                Medi<span className="text-blue-400">Care</span>
              </span>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* HEADER (ONLY IMAGE HERE) */}
        <header className="sticky top-0 z-10 px-6 py-3 bg-white/80 backdrop-blur border-b flex justify-between">

          <div>
            <p className="font-bold text-slate-800">
              {getGreeting()}, <span className="text-blue-600">{displayName}</span>
            </p>
            <p className="text-xs text-slate-400">
              {dateStr} · {timeStr}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <Bell className="w-4 h-4 text-slate-500" />
            </button>

            {/* ONLY IMAGE */}
            <div className="w-9 h-9 rounded-xl overflow-hidden">
              {user?.image ? (
                <img
                  src={avatarSrc}
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export default DoctorDashboard;