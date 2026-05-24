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
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const editRoute =
    user?.role === "Doctor"
      ? "/doctor/dashboard/profile/edit"
      : "/profile/edit";

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-3xl">⚠️</div>
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <p className="text-gray-400">No user data found.</p>
      </div>
    );
  }

  const dp = user.doctorProfile;

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Banner */}
        <div
          className="h-28 w-full relative"
          style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)" }}
        >
          {/* Avatar — sits on top of banner, centered */}
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Name + Role + Edit — pushed down to clear the avatar */}
        <div className="pt-14 px-6 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 capitalize mt-1">
              {user.role === "Doctor" ? "🩺" : "👤"} {user.role}
            </span>
          </div>
          <Link
            to={editRoute}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm w-fit"
          >
            ✏️ Edit Profile
          </Link>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Account Information</p>
        <div className="space-y-3">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <span className="text-lg">✉️</span>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-semibold text-gray-800">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <span className="text-lg">📍</span>
            <div>
              <p className="text-xs text-gray-400">Address</p>
              <p className="text-sm font-semibold text-gray-800">{user.address || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <span className="text-lg">📅</span>
            <div>
              <p className="text-xs text-gray-400">Member Since</p>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Doctor Professional Details */}
      {user.role === "Doctor" && dp && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Professional Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <span className="text-lg">🩺</span>
              <div>
                <p className="text-xs text-blue-400">Speciality</p>
                <p className="text-sm font-semibold text-blue-800">{dp.speciality}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-lg">🎓</span>
              <div>
                <p className="text-xs text-purple-400">Degree</p>
                <p className="text-sm font-semibold text-purple-800">{dp.degree}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-lg">📆</span>
              <div>
                <p className="text-xs text-emerald-400">Experience</p>
                <p className="text-sm font-semibold text-emerald-800">{dp.experience} years</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <span className="text-lg">💰</span>
              <div>
                <p className="text-xs text-amber-400">Consultation Fees</p>
                <p className="text-sm font-semibold text-amber-800">Rs. {dp.fees}</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;