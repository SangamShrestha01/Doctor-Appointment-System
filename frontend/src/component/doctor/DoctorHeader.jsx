import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/auth-context"; // ✅ adjust path if needed

const DoctorHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // ✅ read live from context

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow rounded-lg p-4 mb-6 flex items-center justify-between">
      {/* Left Side */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Dr. {user?.name}
        </h1>
        <p className="text-sm text-gray-500">{user?.role}</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <img
          src={user?.image}
          alt="Doctor"
          className="w-12 h-12 rounded-full object-cover border"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Doctor")}&background=e0e7ff&color=4f46e5&bold=true`;
          }}
        />
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DoctorHeader;