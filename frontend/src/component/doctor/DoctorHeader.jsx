import { useNavigate } from "react-router-dom";

const DoctorHeader = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
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
