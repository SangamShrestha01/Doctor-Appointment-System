import React from "react";
import { NavLink } from "react-router-dom";
import { ADMIN_NAV_LINKS } from "../../constant/nav";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      {/* Logo / Title */}
      <div className="text-2xl font-bold mb-8">
        Admin Panel
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {ADMIN_NAV_LINKS.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;