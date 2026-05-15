import React, { useEffect, useState, useContext } from "react";
import { Upload, User, MapPin, Stethoscope, Clock, DollarSign } from "lucide-react";
import api from "../../api/api";
import { toast } from "react-toastify";
import AuthContext from "../../context/auth-context";

const DoctorEditProfile = () => {
  const { updateUser } = useContext(AuthContext); // ✅ get updateUser from context

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    address: "",
    speciality: "",
    experience: "",
    fees: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctor/dashboard");
      const doctor = res.data.data.doctor;
      const user = doctor.user;

      setProfile({
        name: user?.name || "",
        address: user?.address || "",
        speciality: doctor?.speciality || "",
        experience: doctor?.experience || "",
        fees: doctor?.fees || "",
      });

      if (user?.image) setPreview(user.image);
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

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
      formData.append("speciality", profile.speciality);
      formData.append("experience", profile.experience);
      formData.append("fees", profile.fees);
      if (file) formData.append("image", file);

      await api.patch("/doctor/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ FIX 1: Update AuthContext → dashboard header name updates instantly
      updateUser({
        name: profile.name,
        address: profile.address,
      });

      // ✅ FIX 2: Refetch from backend → form fields show fresh saved data
      await fetchProfile();

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
          <p className="text-sm text-slate-500 mt-1">Update your professional information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* IMAGE UPLOAD */}
            <div className="flex items-center gap-5 pb-5 border-b border-slate-100">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-300" />
                )}
              </div>

              <div>
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition text-sm text-slate-600 font-medium">
                    <Upload className="w-4 h-4" />
                    Change Photo
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-400 mt-1.5">JPEG or PNG recommended</p>
              </div>
            </div>

            {/* NAME */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                    outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  placeholder="Your address"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                    outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* SPECIALITY */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Speciality</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="speciality"
                  value={profile.speciality}
                  onChange={handleChange}
                  placeholder="e.g. Cardiologist"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                    outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* EXPERIENCE & FEES */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Experience (years)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    placeholder="Years"
                    min="0"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                      outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Consultation Fees (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    name="fees"
                    value={profile.fees}
                    onChange={handleChange}
                    placeholder="Amount"
                    min="0"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                      outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm
                flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorEditProfile;