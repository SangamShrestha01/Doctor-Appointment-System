import React, { useEffect, useState } from "react";
import { getAllDoctors, deleteDoctor } from "../../api/admin.api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constant/route";

// ✅ Toast Component
const Toast = ({ message, type, onClose }) => {
  const isError = type === "error";
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-start gap-3 px-5 py-4 rounded-xl shadow-lg border max-w-sm w-full
      ${isError ? "bg-red-50 border-red-100 text-red-700" : "bg-green-50 border-green-100 text-green-700"}`}
      style={{ animation: "slideIn 0.3s ease-out" }}
    >
      <span className="text-xl mt-0.5">{isError ? "⚠️" : "✅"}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{isError ? "Something went wrong" : "Doctor Deleted"}</p>
        <p className="text-xs mt-0.5 opacity-80">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-0.5">×</button>
    </div>
  );
};

// ✅ Delete Modal
const DeleteModal = ({ doctor, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🗑️</span>
      </div>
      <h2 className="text-lg font-bold text-gray-800 text-center">Delete Doctor</h2>
      <p className="text-sm text-gray-400 text-center mt-1">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-700">{doctor?.user?.name}</span>?
        This action cannot be undone.
      </p>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting...</>
          ) : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null); // ✅ { message, type }
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDoctors = async () => {
    try {
      const res = await getAllDoctors();
      setDoctors(res.data.data || []);
    } catch (error) {
      console.log("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteDoctor(deleteTarget._id);
      const deletedName = deleteTarget.user?.name;
      setDoctors((prev) => prev.filter((doc) => doc._id !== deleteTarget._id));
      setDeleteTarget(null);
      showToast(`Dr. ${deletedName} has been removed successfully.`, "success");
    } catch (error) {
      setDeleteTarget(null);
      showToast(error?.response?.data?.message || "Failed to delete doctor. Please try again.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = doctors.filter(
    (doc) =>
      doc.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.speciality?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ✅ Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          doctor={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {doctors.length} registered doctor{doctors.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.ADMIN_CREATE_DOCTOR)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
        >
          <span className="text-lg leading-none">+</span>
          Add Doctor
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          placeholder="Search by name or speciality..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
        />
      </div>

      {/* Table — Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Doctor</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Speciality</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Experience</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fees</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">👨‍⚕️</div>
                    <p className="text-gray-400 font-medium">No doctors found</p>
                    <p className="text-gray-300 text-sm">Try a different search or add a new doctor</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((doc) => (
                <tr key={doc._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.user?.image}
                        alt="doctor"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{doc.user?.name}</p>
                        <p className="text-xs text-gray-400">{doc.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                      {doc.speciality}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">{doc.experience || 0} yr{doc.experience !== 1 ? "s" : ""}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">Rs. {doc.fees}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/doctors/edit/${doc._id}`)}
                        className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-100 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(doc)}
                        className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-100 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards — Mobile */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">👨‍⚕️</div>
            <p className="text-gray-400 font-medium">No doctors found</p>
          </div>
        ) : (
          filtered.map((doc) => (
            <div key={doc._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={doc.user?.image}
                  alt="doctor"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <p className="font-semibold text-gray-800">{doc.user?.name}</p>
                  <p className="text-xs text-gray-400">{doc.user?.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                  {doc.speciality}
                </span>
                <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full border border-gray-100">
                  {doc.experience || 0} yrs exp
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100">
                  Rs. {doc.fees}
                </span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => navigate(`/admin/doctors/edit/${doc._id}`)}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold py-2 rounded-xl border border-emerald-100 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(doc)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold py-2 rounded-xl border border-red-100 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Animations */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

    </div>
  );
};

export default Doctors;