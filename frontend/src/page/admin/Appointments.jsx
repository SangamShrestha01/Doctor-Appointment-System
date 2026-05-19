import React, { useEffect, useState } from "react";
import api from "../../api/api";

const DeleteModal = ({ onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    />
    {/* Modal */}
    <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 z-10">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-3xl">
          🗑️
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Delete Appointment</h3>
          <p className="text-sm text-gray-400 mt-1">
            This action is permanent and cannot be undone. Are you sure you want to delete this appointment?
          </p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/admin/appointments");
      setAppointments(res.data.data || []);
    } catch (error) {
      console.log("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openDeleteModal = (id) => setDeleteModal({ open: true, id });
  const closeDeleteModal = () => setDeleteModal({ open: false, id: null });

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/appointments/${deleteModal.id}`);
      setAppointments((prev) => prev.filter((a) => a._id !== deleteModal.id));
      closeDeleteModal();
    } catch (error) {
      console.log("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  const statusConfig = {
    confirmed: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
    pending:   { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500"   },
    cancelled: { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500"     },
    completed: { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500"    },
  };

  const getStatusConfig = (status) =>
    statusConfig[status?.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };

  const filtered = filter === "all"
    ? appointments
    : appointments.filter((a) => a.status?.toLowerCase() === filter);

  const counts = {
    all:       appointments.length,
    pending:   appointments.filter((a) => a.status?.toLowerCase() === "pending").length,
    confirmed: appointments.filter((a) => a.status?.toLowerCase() === "confirmed").length,
    completed: appointments.filter((a) => a.status?.toLowerCase() === "completed").length,
    cancelled: appointments.filter((a) => a.status?.toLowerCase() === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Delete Modal */}
      {deleteModal.open && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
          loading={deleting}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage all patient appointments</p>
        </div>
        <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full border border-blue-100">
          {appointments.length} Total
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize
              ${filter === tab
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
              }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Patient</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Doctor</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fees</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reason</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">📋</div>
                    <p className="text-gray-400 font-medium">No appointments found</p>
                    <p className="text-gray-300 text-sm">Try a different filter</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((appt) => {
                const sc = getStatusConfig(appt.status);
                return (
                  <tr key={appt._id} className="hover:bg-blue-50/30 transition-colors">

                    {/* Patient */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={appt.patient?.image}
                          alt="patient"
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{appt.patient?.name}</p>
                          <p className="text-xs text-gray-400">{appt.patient?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={appt.doctor?.user?.image}
                          alt="doctor"
                          className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{appt.doctor?.user?.name}</p>
                          <p className="text-xs text-blue-400">{appt.doctor?.speciality}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700">{appt.date}</p>
                      <p className="text-xs text-gray-400">{appt.time}</p>
                    </td>

                    {/* Fees */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-gray-800">
                        Rs. {appt.fees}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-500 max-w-[140px] truncate" title={appt.reason}>
                        {appt.reason || "General consultation"}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {appt.status}
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => openDeleteModal(appt._id)}
                        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-100 transition"
                      >
                        🗑️ Delete
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminAppointments;