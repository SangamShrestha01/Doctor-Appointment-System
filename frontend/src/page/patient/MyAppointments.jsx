import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

// ✅ Fallback image
const FALLBACK_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/387/387561.png";

// ✅ Safe image helper (FIXED)
const getImageUrl = (img) => {
  if (!img) return FALLBACK_IMAGE;
  if (img.startsWith("http")) return img;
  return `${import.meta.env.VITE_API_URL}/${img}`;
};

const STATUS_STYLES = {
  Pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Approved: "bg-green-50 text-green-700 border border-green-200",
  Cancelled: "bg-red-50 text-red-500 border border-red-200",
  Confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
};

const STATUS_DOT = {
  Pending: "bg-yellow-400",
  Approved: "bg-green-500",
  Cancelled: "bg-red-400",
  Confirmed: "bg-blue-500",
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointment");
        console.log(res.data.data);
        setAppointments(res.data.data || []);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch appointments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    setCancelingId(id);

    try {
      await api.patch(`/appointment/cancel/${id}`);

      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === id ? { ...apt, status: "Cancelled" } : apt
        )
      );

      toast.success("Appointment cancelled successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to cancel appointment"
      );
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">
            Loading your appointments...
          </p>
        </div>
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">
          No Appointments Yet
        </h2>
        <p className="text-slate-400 text-sm max-w-xs">
          You haven't booked any appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            My Appointments
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            {appointments.length} appointment
            {appointments.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="space-y-4">
          {appointments.map((apt) => {

            // ✅ FIXED DOCTOR DATA (FULL SAFE LOGIC)
            const doctorName =
              apt.doctor?.user?.name ||
              apt.doctorName ||
              apt.doctor?.name ||
              "Unknown Doctor";

            const doctorImage =
              apt.doctor?.user?.image ||
              apt.doctorImage ||
              apt.doctor?.image ||
              null;

            const speciality =
              apt.doctor?.speciality || "";

            const date = apt.appointmentDateTime
              ? new Date(apt.appointmentDateTime).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
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
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">

                  <div className="flex flex-wrap justify-between gap-2">

                    <div>
                      <h2 className="font-bold text-slate-800 text-lg">
                        {doctorName}
                      </h2>

                      {speciality && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {speciality}
                        </span>
                      )}
                    </div>

                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_STYLES[status] || STATUS_STYLES.Pending
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          STATUS_DOT[status] || STATUS_DOT.Pending
                        }`}
                      />
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
                      <span className="font-medium">Reason:</span>{" "}
                      {apt.reason}
                    </p>
                  )}

                  {status === "Pending" && (
                    <button
                      onClick={() => cancelAppointment(apt._id)}
                      disabled={cancelingId === apt._id}
                      className="mt-3 text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      {cancelingId === apt._id
                        ? "Cancelling..."
                        : "✕ Cancel Appointment"}
                    </button>
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