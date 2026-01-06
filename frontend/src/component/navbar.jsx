import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, HeartPulse } from 'lucide-react';
import { NAV_LINKS } from '../constant/nav';
import { ROUTES } from '../constant/route';
import AuthContext from '../context/auth-context';
import ConfirmModal from './modal';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  console.log(isAuthenticated, user);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MedConnect
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive(link.path) ? 'text-blue-600' : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Links */}
          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Profile Image */}
                <img
                  src={user?.image || '/avatar.png'}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />

                {/* User Name
                <span className="text-sm font-medium text-slate-700">
                  Hello, {user?.name || 'User'}
                </span> */}

                {/* Logout Button */}
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to={ROUTES.REGISTER}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-blue-600 p-2"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-1 shadow-xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-3 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <Link
              to={ROUTES.LOGIN}
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3 text-slate-700 font-medium border border-slate-200 rounded-lg"
            >
              Login
            </Link>
            <Link
              to={ROUTES.REGISTER}
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3 bg-blue-600 text-white font-semibold rounded-lg"
            >
              Register
            </Link>
          </div>
        </div>
      )}

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
    </header>
  );
};

export default Header;
