import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, HeartPulse, ChevronDown } from "lucide-react";
import { NAV_LINKS } from "../constant/nav";
import { ROUTES } from "../constant/route";
import AuthContext from "../context/auth-context";
import ConfirmModal from "./modal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileMode, setProfileMode] = useState(false);

  const { isAuthenticated, user, logout } = useContext(AuthContext);
  console.log("user",user)
  const location = useLocation();
  const profileRef = useRef(null);
  const panelRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // ✅ Cache-busted avatar — auth-context already appends ?t= on login/update,
  // but we strip+re-add here as a safety net in case image arrives without it
  const avatarSrc = user?.image
    ? `${user.image.split("?")[0]}?t=${Date.now()}`
    : "/avatar.png";

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        panelRef.current &&
        !panelRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
        setProfileMode(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MedConnect
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold ${
                  isActive(link.path)
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div ref={profileRef} className="relative">

                {/* Avatar — ✅ uses cache-busted avatarSrc */}
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    className="w-9 h-9 rounded-full ring-2 ring-blue-500/50 object-cover"
                  />
                  <ChevronDown
                    className={`w-4 h-4 transition ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl overflow-hidden animate-dropdown">
                    <div className="px-4 py-3 bg-slate-50 flex items-center gap-3">
                      {/* ✅ also cache-busted in dropdown */}
                      <img
                        src={avatarSrc}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-200"
                      />
                      <div>
                        <p className="text-sm font-semibold">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setProfileMode(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-100"
                    >
                      👤 My Profile
                    </button>

                    <Link
                      to={ROUTES.EDIT_PROFILE}
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-100 block"
                    >
                      ✏️ Edit Profile
                    </Link>

                    <Link
                      to="/patient/appointments"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-100 block"
                    >
                      📅 My Appointments
                    </Link>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>Login</Link>
                <Link to={ROUTES.REGISTER}>Register</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Profile Panel */}
      {profileMode && (
        <div
          ref={panelRef}
          className="absolute right-6 top-20 z-40 w-[360px] bg-white rounded-2xl shadow-xl border p-5 animate-panel"
        >
          <div className="flex items-center gap-4 mb-4">
            {/* ✅ cache-busted in profile panel too */}
            <img
              src={avatarSrc}
              alt="Profile"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-200"
            />
            <div>
              <h3 className="text-lg font-bold">{user?.name}</h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => setProfileMode(false)}
            className="mt-2 w-full bg-blue-600 text-white py-2 rounded-xl"
          >
            Close
          </button>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <ConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={logout}
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
        />
      )}

      {/* Animations */}
      <style>
        {`
          .animate-panel,
          .animate-dropdown {
            animation: dropdown 0.2s ease-out forwards;
          }
          @keyframes dropdown {
            from { opacity: 0; transform: translateY(-8px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>
    </header>
  );
};

export default Header;