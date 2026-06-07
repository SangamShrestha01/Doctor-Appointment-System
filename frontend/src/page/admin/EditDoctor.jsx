import React, { useEffect, useState, useCallback } from "react";
import { getDoctorById, updateDoctor } from "../../api/admin.api";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constant/route";

const SPECIALITIES = [
  "Cardiologist", "Dermatologist", "Neurologist", "Orthopedic",
  "Pediatrician", "Psychiatrist", "General Physician", "Gynecologist",
  "ENT Specialist", "Ophthalmologist",
];

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Doctor")}&background=e0e7ff&color=4f46e5&bold=true`;

const Toast = ({ message, type, onClose }) => {
  const isError = type === "error";
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-start gap-3 px-5 py-4 rounded-xl shadow-lg border max-w-sm w-full
        ${isError ? "bg-red-50 border-red-100 text-red-700" : "bg-green-50 border-green-100 text-green-700"}`}
      style={{ animation: "slideIn 0.3s ease-out" }}
    >
      <span className="text-xl mt-0.5">{isError ? "⚠️" : "✅"}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{isError ? "Something went wrong" : "Doctor Updated!"}</p>
        <p className="text-xs mt-0.5 opacity-80">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-0.5">×</button>
    </div>
  );
};

const InputField = ({ name, label, placeholder, type = "text", icon, value, onChange, disabled }) => (
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
      disabled={disabled}
      required
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition disabled:bg-gray-50 disabled:text-gray-400"
    />
  </div>
);

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null);

  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    name: "", email: "", speciality: "", degree: "",
    fees: "", experience: "", hospital: "", city: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDoctor = useCallback(async () => {
    try {
      const res = await getDoctorById(id);
      const doc = res.data.data;

      setForm({
        name:       doc.user?.name        || "",
        email:      doc.user?.email       || "",
        speciality: doc.speciality        || "",
        degree:     doc.degree            || "",
        fees:       doc.fees              || "",
        experience: doc.experience        || "",
        hospital:   doc.address?.hospital || "",
        city:       doc.address?.city     || "",
      });

      const imageUrl = doc.user?.image || null;
      setImagePreview(imageUrl ? `${imageUrl}?t=${Date.now()}` : avatarUrl(doc.user?.name));

    } catch (error) {
      showToast("Failed to load doctor details.", "error");
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDoctor();
  }, [fetchDoctor]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name",              form.name);
      formData.append("speciality",        form.speciality);
      formData.append("degree",            form.degree);
      formData.append("fees",              form.fees);
      formData.append("experience",        form.experience);
      formData.append("address[hospital]", form.hospital);
      formData.append("address[city]",     form.city);

      if (imageFile) formData.append("image", imageFile);

      const res = await updateDoctor(id, formData);

      const updatedImage = res.data?.data?.user?.image;
      if (updatedImage) {
        setImagePreview(`${updatedImage}?t=${Date.now()}`);
      }

      await fetchDoctor();
      setImageFile(null);

      showToast(`${form.name} has been updated successfully.`, "success");
      setTimeout(() => navigate(ROUTES.ADMIN_DOCTORS), 1800);

    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to update doctor. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading doctor details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Doctor</h1>
        <p className="text-sm text-gray-400 mt-1">Update the details for this doctor</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleUpdate} className="space-y-5">

          {/* Doctor Photo */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Doctor Photo</p>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = avatarUrl(form.name); }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="doctor-image"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg transition"
                >
                  📷 {imageFile ? "Change Photo" : "Update Photo"}
                </label>
                <input
                  id="doctor-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-gray-400">Leave unchanged to keep the current photo.</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="name"  label="Full Name"     placeholder="e.g. Dr. Rajesh Sharma"   icon="👤" value={form.name}  onChange={handleChange} />
              <InputField name="email" label="Email Address" placeholder="e.g. rajesh@hospital.com" icon="✉️" value={form.email} onChange={handleChange} disabled />
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1">📌 Email cannot be changed after account creation.</p>
          </div>

          {/* Professional Info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Professional Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">🩺 Speciality</label>
                <select
                  name="speciality"
                  value={form.speciality}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition bg-white"
                >
                  <option value="" disabled>Select speciality</option>
                  {SPECIALITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <InputField name="degree"     label="Degree / Qualification"  placeholder="e.g. MBBS, MD" icon="🎓" value={form.degree}     onChange={handleChange} />
              <InputField name="experience" label="Years of Experience"     placeholder="e.g. 5"        icon="📅" value={form.experience} onChange={handleChange} type="number" />
              <InputField name="fees"       label="Consultation Fees (Rs.)" placeholder="e.g. 500"      icon="💰" value={form.fees}       onChange={handleChange} type="number" />
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Location</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="hospital" label="Hospital Name" placeholder="e.g. Norvic Hospital" icon="🏥" value={form.hospital} onChange={handleChange} />
              <InputField name="city"     label="City"          placeholder="e.g. Pokhara"         icon="📍" value={form.city}     onChange={handleChange} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
                : "💾 Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_DOCTORS)}
              className="text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-lg text-sm border border-gray-200 hover:border-gray-300 transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default EditDoctor;