import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || "Failed to load profile";
        setError(msg);
        toast.error(msg); // ✅ FIXED: was using stale `error` state
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Role-based edit route
  const editRoute =
    user?.role === "Doctor"
      ? "/doctor/dashboard/profile/edit"  // DoctorEditProfile
      : "/profile/edit";                  // PatientEditProfile

  if (loading) return <p className="text-center mt-12">Loading profile...</p>;
  if (error)   return <p className="text-red-600 text-center mt-12">{error}</p>;
  if (!user)   return <p className="text-center mt-12">No user data</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">

      {/* Profile Header */}
      <div className="flex flex-col items-center">
        <img
          src={user.image || "https://via.placeholder.com/150"}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h2 className="text-2xl font-semibold">{user.name}</h2>
        <p className="text-gray-500 capitalize">{user.role}</p>
      </div>

      {/* Basic User Info */}
      <div className="mt-6 space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address || "N/A"}</p>
        <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Doctor Profile Info */}
      {user.role === "Doctor" && user.doctorProfile && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold mb-2">Doctor Profile</h3>
          <p><strong>Speciality:</strong> {user.doctorProfile.speciality}</p>
          <p><strong>Degree:</strong> {user.doctorProfile.degree}</p>
          <p><strong>Experience:</strong> {user.doctorProfile.experience} years</p>
          <p><strong>Consultation Fees:</strong> ₹{user.doctorProfile.fees}</p>
        </div>
      )}

      {/* ✅ FIXED: Role-based edit button */}
      <Link
        to={editRoute}
        className="block text-center mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Edit Profile
      </Link>

    </div>
  );
};

export default Profile;