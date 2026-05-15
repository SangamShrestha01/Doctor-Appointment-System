import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

const PatientEditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: "", address: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/me");
      const user = res.data;
      setProfile({ name: user.name || "", address: user.address || "" });
      if (user.image) setPreview(user.image);
    } catch (error) {
      console.error("Error fetching patient profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("address", profile.address);
      if (file) formData.append("image", file);
      await api.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Initials fallback for avatar
  const initials = (profile.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Top banner */}
          <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-500 relative">
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "30px 30px"
              }}
            />
          </div>

          {/* Avatar */}
          <div className="flex justify-center -mt-14 mb-2 relative z-10">
            <div className="relative group">
              <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-3xl font-bold">{initials}</span>
                )}
              </div>

              {/* Camera overlay */}
              <label
                htmlFor="image-upload"
                className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <span className="text-white text-xl">📷</span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Click to change hint */}
          <p className="text-center text-xs text-slate-400 mb-6">
            Hover over photo to change
          </p>

          {/* Form */}
          <div className="px-8 pb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1 text-center">
              Edit Profile
            </h2>
            <p className="text-slate-400 text-sm text-center mb-6">
              Update your personal information
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                  <span>👤</span> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                  <span>📍</span> Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:from-blue-700 hover:to-indigo-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientEditProfile;