import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

const FALLBACK_IMAGE = "https://cdn-icons-png.flaticon.com/512/387/387561.png";

const getImageUrl = (img) => {
  if (!img) return FALLBACK_IMAGE;
  if (img.startsWith("http")) return img;
  return `${import.meta.env.VITE_API_URL}/${img}`;
};

const STATUS_STYLES = {
  Pending:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Approved:  "bg-green-50 text-green-700 border border-green-200",
  Cancelled: "bg-red-50 text-red-500 border border-red-200",
  Confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
};

const STATUS_DOT = {
  Pending:   "bg-yellow-400",
  Approved:  "bg-green-500",
  Cancelled: "bg-red-400",
  Confirmed: "bg-blue-500",
};

// ✅ Reusable Modal
const ConfirmModal = ({ title, message, confirmLabel, confirmClass, icon, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <h2 className="text-lg font-bold text-slate-800 text-center">{title}</h2>
      <p className="text-sm text-slate-400 text-center mt-1">{message}</p>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Go Back
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition flex items-center justify-center gap-2 ${confirmClass}`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Please wait...
            </>
          ) : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState(null);

  // ✅ Separate modal state for cancel and delete
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointment");
        setAppointments(res.data.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // ✅ Cancel — changes status to Cancelled
  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelLoading(true);
    try {
      await api.patch(`/appointment/cancel/${cancelTarget._id}`);
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === cancelTarget._id ? { ...apt, status: "Cancelled" } : apt
        )
      );
      toast.success("Appointment cancelled successfully");
      setCancelTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancelLoading(false);
    }
  };

  // ✅ Delete — removes from list entirely
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/appointment/${deleteTarget._id}`);
      setAppointments((prev) => prev.filter((apt) => apt._id !== deleteTarget._id));
      toast.success("Appointment removed successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete appointment");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ✅ Retry payment
  const handleRetryPayment = async (apt) => {
    setRetryingId(apt._id);
    try {
      const res = await api.post(`/payment/initiate`, {
        appointmentId: apt._id,
        amount: apt.fees,
      });
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        toast.error("Could not initiate payment. Please try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment retry failed");
    } finally {
      setRetryingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">No Appointments Yet</h2>
        <p className="text-slate-400 text-sm max-w-xs">You haven't booked any appointments.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">

      {/* ✅ Cancel Modal */}
      {cancelTarget && (
        <ConfirmModal
          icon="❌"
          title="Cancel Appointment"
          message={`Are you sure you want to cancel your appointment with ${cancelTarget?.doctor?.user?.name || "this doctor"}? This cannot be undone.`}
          confirmLabel="Yes, Cancel"
          confirmClass="bg-red-500 hover:bg-red-600 disabled:bg-red-300"
          onConfirm={handleCancel}
          onCancel={() => setCancelTarget(null)}
          loading={cancelLoading}
        />
      )}

      {/* ✅ Delete Modal */}
      {deleteTarget && (
        <ConfirmModal
          icon="🗑️"
          title="Remove Appointment"
          message={`Remove this appointment with ${deleteTarget?.doctor?.user?.name || "this doctor"} from your list?`}
          confirmLabel="Yes, Remove"
          confirmClass="bg-slate-600 hover:bg-slate-700 disabled:bg-slate-300"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Appointments</h1>
          <p className="text-slate-400 text-sm mt-1">
            {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="space-y-4">
          {appointments.map((apt) => {
            const doctorName =
              apt.doctor?.user?.name || apt.doctorName || apt.doctor?.name || "Unknown Doctor";
            const doctorImage =
              apt.doctor?.user?.image || apt.doctorImage || apt.doctor?.image || null;
            const speciality = apt.doctor?.speciality || "";
            const date = apt.appointmentDateTime
              ? new Date(apt.appointmentDateTime).toLocaleDateString("en-US", {
                  weekday: "short", year: "numeric", month: "short", day: "numeric",
                })
              : "N/A";
            const status = apt.status || "Pending";

            return (
              <div
                key={apt._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
              >
                {/* Doctor Image */}
                <div className="flex-shrink-0">
                  <img
                    src={getImageUrl(doctorImage)}
                    alt={doctorName}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <h2 className="font-bold text-slate-800 text-lg">{doctorName}</h2>
                      {speciality && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {speciality}
                        </span>
                      )}
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || STATUS_DOT.Pending}`} />
                      {status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>📅 {date}</span>
                    {apt.time && <span>🕐 {apt.time}</span>}
                    {apt.fees && <span>💰 Rs. {apt.fees}</span>}
                  </div>

                  {apt.reason && (
                    <p className="mt-2 text-sm text-slate-500">
                      <span className="font-medium">Reason:</span> {apt.reason}
                    </p>
                  )}

                  {/* ✅ Pending — retry payment + cancel */}
                  {status === "Pending" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleRetryPayment(apt)}
                        disabled={retryingId === apt._id}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                      >
                        {retryingId === apt._id ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : "💳 Complete Payment"}
                      </button>

                      <button
                        onClick={() => setCancelTarget(apt)}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-4 py-2 rounded-xl border border-red-100 transition"
                      >
                        ✕ Cancel
                      </button>

                      {/* ✅ Delete also available on Pending */}
                      <button
                        onClick={() => setDeleteTarget(apt)}
                        className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}

                  {/* ✅ Cancelled — only delete */}
                  {status === "Cancelled" && (
                    <div className="mt-4">
                      <button
                        onClick={() => setDeleteTarget(apt)}
                        className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 transition"
                      >
                        🗑️ Remove from list
                      </button>
                    </div>
                  )}

                  {/* ✅ Approved/Confirmed — only delete */}
                  {(status === "Approved" || status === "Confirmed") && (
                    <div className="mt-4">
                      <button
                        onClick={() => setDeleteTarget(apt)}
                        className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 transition"
                      >
                        🗑️ Remove from list
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;