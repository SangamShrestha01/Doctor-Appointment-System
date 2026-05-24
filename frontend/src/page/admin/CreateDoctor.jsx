import React, { useState } from "react";
import { createDoctor } from "../../api/admin.api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constant/route";
import { createDoctorSchema } from "../../schemas/register";

const SPECIALITIES = [
  "Cardiologist", "Dermatologist", "Neurologist", "Orthopedic",
  "Pediatrician", "Psychiatrist", "General Physician", "Gynecologist",
  "ENT Specialist", "Ophthalmologist",
];

// ✅ Toast Component
const Toast = ({ message, type, onClose }) => {
  const isError = type === "error";
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-start gap-3 px-5 py-4 rounded-xl shadow-lg border max-w-sm w-full animate-slide-in
      ${isError ? "bg-red-50 border-red-100 text-red-700" : "bg-green-50 border-green-100 text-green-700"}`}>
      <span className="text-xl mt-0.5">{isError ? "⚠️" : "✅"}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{isError ? "Something went wrong" : "Doctor Created!"}</p>
        <p className="text-xs mt-0.5 opacity-80">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-0.5">×</button>
    </div>
  );
};

const InputField = ({ name, label, placeholder, type = "text", icon, autoComplete = "off", value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600">
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      autoComplete={autoComplete}
      required
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
    />
  </div>
);

const CreateDoctor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Toast state
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000); // auto-dismiss after 4s
  };

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    name: "", email: "", password: "", speciality: "",
    degree: "", fees: "", experience: "", hospital: "", city: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = createDoctorSchema.safeParse(form);
    if (!result.success) {
      showToast(result.error.errors[0].message, "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("speciality", form.speciality);
      formData.append("degree", form.degree);
      formData.append("fees", form.fees);
      formData.append("experience", form.experience);
      formData.append("address[hospital]", form.hospital);
      formData.append("address[city]", form.city);
      if (imageFile) formData.append("image", imageFile);

      await createDoctor(formData);

      // ✅ Show success toast, then navigate after short delay
      showToast(`Dr. ${form.name} has been registered successfully.`, "success");
      setTimeout(() => navigate(ROUTES.ADMIN_DOCTORS), 1800);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to create doctor. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">

      {/* ✅ Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create Doctor</h1>
        <p className="text-sm text-gray-400 mt-1">Fill in the details below to register a new doctor</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">

          {/* Doctor Photo */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Doctor Photo</p>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="doctor-image" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg transition">
                  📷 {imagePreview ? "Change Photo" : "Upload Photo"}
                </label>
                <input id="doctor-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <p className="text-xs text-gray-400">JPG, PNG or WEBP. Optional — default avatar used if skipped.</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="name" label="Full Name" placeholder="e.g. Dr. Rajesh Sharma" icon="👤" autoComplete="new-name" value={form.name} onChange={handleChange} />
              <InputField name="email" label="Email Address" placeholder="e.g. rajesh@hospital.com" type="email" icon="✉️" autoComplete="new-email" value={form.email} onChange={handleChange} />
            </div>
          </div>

          {/* Password */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Login Credentials</p>
            <InputField name="password" label="Temporary Password" placeholder="Min. 6 characters" type="password" icon="🔑" autoComplete="new-password" value={form.password} onChange={handleChange} />
            <p className="text-xs text-gray-400 mt-1.5 ml-1">The doctor will use this to log in for the first time.</p>
          </div>

          {/* Professional Info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Professional Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">🩺 Speciality</label>
                <select name="speciality" value={form.speciality} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition bg-white">
                  <option value="" disabled>Select speciality</option>
                  {SPECIALITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <InputField name="degree" label="Degree / Qualification" placeholder="e.g. MBBS, MD, MS" icon="🎓" value={form.degree} onChange={handleChange} />
              <InputField name="experience" label="Years of Experience" placeholder="e.g. 5" type="number" icon="📅" value={form.experience} onChange={handleChange} />
              <InputField name="fees" label="Consultation Fees (Rs.)" placeholder="e.g. 500" type="number" icon="💰" value={form.fees} onChange={handleChange} />
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Location</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="hospital" label="Hospital Name" placeholder="e.g. Norvic Hospital" icon="🏥" value={form.hospital} onChange={handleChange} />
              <InputField name="city" label="City" placeholder="e.g. Pokhara" icon="📍" value={form.city} onChange={handleChange} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2">
              {loading ? (<><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</>) : "✅ Create Doctor"}
            </button>
            <button type="button" onClick={() => navigate(ROUTES.ADMIN_DOCTORS)} className="text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-lg text-sm border border-gray-200 hover:border-gray-300 transition">
              Cancel
            </button>
          </div>

        </form>
      </div>

      {/* ✅ Slide-in animation */}
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateDoctor;