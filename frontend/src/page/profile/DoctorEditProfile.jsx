import React, { useEffect, useState, useContext } from "react";
import {
  Upload,
  User,
  MapPin,
  Stethoscope,
  Briefcase,
  DollarSign,
} from "lucide-react";
import api from "../../api/api";
import { toast } from "react-toastify";
import AuthContext from "../../context/auth-context";

// ================= REUSABLE INPUT =================
const InputField = ({
  icon: Icon,
  name,
  value,
  placeholder,
  type = "text",
  onChange,
}) => (
  <div className="relative">
    <Icon
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        w-full
        pl-10
        pr-4
        py-3
        border
        border-gray-300
        rounded-xl
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
        transition-all
      "
    />
  </div>
);

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
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= FILE CHANGE =================
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // ================= UPDATE PROFILE =================
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

      const updatedUser = res.data?.data?.user || res.data?.data;

      if (updatedUser) {
        updateUser({
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.image,
        });

        if (updatedUser.image) {
          setPreview(`${updatedUser.image}?t=${Date.now()}`);
        }
      }

      setFile(null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADER =================
  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="mt-2 text-blue-100">
            Keep your professional information updated.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-10">

            <div className="relative">

              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                {preview ? (
                  <img
                    src={preview}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User size={60} className="text-gray-400" />
                  </div>
                )}
              </div>

              <label
                className="
                  absolute
                  bottom-1
                  right-1
                  bg-blue-600
                  text-white
                  p-3
                  rounded-full
                  cursor-pointer
                  shadow-lg
                  hover:bg-blue-700
                  transition
                "
              >
                <Upload size={18} />

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Click the upload button to change profile photo
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <InputField
              icon={User}
              name="name"
              value={profile.name}
              placeholder="Full Name"
              onChange={handleChange}
            />

            <InputField
              icon={MapPin}
              name="address"
              value={profile.address}
              placeholder="Address"
              onChange={handleChange}
            />

            <InputField
              icon={Stethoscope}
              name="speciality"
              value={profile.speciality}
              placeholder="Speciality"
              onChange={handleChange}
            />

            <InputField
              icon={Briefcase}
              name="experience"
              value={profile.experience}
              placeholder="Years of Experience"
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <InputField
                icon={DollarSign}
                name="fees"
                type="number"
                value={profile.fees}
                placeholder="Consultation Fee"
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="
                px-8
                py-3
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                text-white
                rounded-xl
                font-medium
                shadow-md
                hover:shadow-xl
                hover:scale-105
                transition-all
                disabled:opacity-70
                disabled:cursor-not-allowed
              "
            >
              {saving ? "Updating..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default DoctorEditProfile;