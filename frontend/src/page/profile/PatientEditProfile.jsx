import React, { useContext, useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import AuthContext from "../../context/auth-context";

const PatientEditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    address: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { user, updateUser } = useContext(AuthContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get("/users/me");

      const userData = res.data.user || res.data;

      setProfile({
        name: userData.name || "",
        address: userData.address || "",
      });

      if (userData.image) {
        setPreview(userData.image);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("address", profile.address);

      if (file) {
        formData.append("image", file);
      }

      const res = await api.patch("/users/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data.user || res.data;

      // Update Context + LocalStorage
      updateUser(updatedUser);

      // Update local form state
      setProfile({
        name: updatedUser.name || "",
        address: updatedUser.address || "",
      });

      if (updatedUser.image) {
        setPreview(updatedUser.image);
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const initials = (profile.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-[80vh] bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-28 bg-linear-to-r from-blue-600 to-indigo-500 relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
          </div>

          <div className="flex justify-center -mt-14 mb-2 relative z-10">
            <div className="relative group">
              <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {initials}
                  </span>
                )}
              </div>

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

          <p className="text-center text-xs text-slate-400 mb-6">
            Hover over photo to change
          </p>

          <div className="px-8 pb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1 text-center">
              Edit Profile
            </h2>

            <p className="text-slate-400 text-sm text-center mb-6">
              Update your personal information
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                  👤 Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                  📍 Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-xl"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientEditProfile;