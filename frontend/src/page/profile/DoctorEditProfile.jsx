import React, { useEffect, useState, useContext } from "react";
import { Upload, User } from "lucide-react";
import api from "../../api/api";
import { toast } from "react-toastify";
import AuthContext from "../../context/auth-context";

const DoctorEditProfile = () => {
  const { updateUser } = useContext(AuthContext);

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

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get("/doctor/dashboard");

      const doctor = res.data?.data?.doctor;
      const user = doctor?.user;

      setProfile({
        name: user?.name || "",
        address: user?.address || "",
        speciality: doctor?.speciality || "",
        experience: doctor?.experience || "",
        fees: doctor?.fees || "",
      });

      if (user?.image) {
        setPreview(user.image);
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
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
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // ================= SUBMIT =================
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

      if (file) {
        formData.append("image", file);
      }

      const res = await api.patch("/doctor/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("🔥 FULL RESPONSE:", res.data);

      // ================= FIXED RESPONSE HANDLING =================
      const updatedUser =
        res.data?.data?.user || res.data?.data;

      console.log("🔥 UPDATED USER:", updatedUser);
      console.log("🔥 IMAGE:", updatedUser?.image);

      if (updatedUser) {
        // 🔥 GLOBAL AUTH UPDATE (FIX FOR DASHBOARD IMAGE ISSUE)
        updateUser({
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.image,
        });

        // force refresh preview
        if (updatedUser.image) {
          setPreview(`${updatedUser.image}?t=${Date.now()}`);
        }
      }

      setFile(null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">

      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* IMAGE */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border">
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover"
                alt="profile"
              />
            ) : (
              <User className="w-full h-full text-gray-400" />
            )}
          </div>

          <label className="cursor-pointer px-4 py-2 bg-blue-100 rounded">
            <Upload className="inline w-4 h-4 mr-1" />
            Change Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* FIELDS */}
        <input
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />

        <input
          name="address"
          value={profile.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 border rounded"
        />

        <input
          name="speciality"
          value={profile.speciality}
          onChange={handleChange}
          placeholder="Speciality"
          className="w-full p-2 border rounded"
        />

        <input
          name="experience"
          value={profile.experience}
          onChange={handleChange}
          placeholder="Experience"
          className="w-full p-2 border rounded"
        />

        <input
          name="fees"
          value={profile.fees}
          onChange={handleChange}
          placeholder="Fees"
          className="w-full p-2 border rounded"
        />

        {/* SUBMIT */}
        <button
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {saving ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default DoctorEditProfile;