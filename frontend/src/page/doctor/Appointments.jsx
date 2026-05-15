import React, { useEffect, useState } from "react";
import api from "../../api/api";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments/doctor");

      console.log("API Response:", res.data);

      setAppointments(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "approved":
      case "confirmed":
        return "text-green-600 bg-green-100 border-green-200";
      case "cancelled":
        return "text-red-600 bg-red-100 border-red-200";
      case "completed":
        return "text-blue-600 bg-blue-100 border-blue-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getPatientName = (appointment) =>
    appointment.patient?.name ||
    appointment.patient?.user?.name ||
    "Unknown Patient";

  const getDoctorName = (appointment) =>
    appointment.doctor?.user?.name ||
    appointment.doctorName ||   // from backend fallback
    "Doctor Not Assigned";

  const getDoctorImage = (appointment) =>
    appointment.doctor?.user?.image ||
    appointment.doctorImage ||  // from backend fallback
    null;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading appointments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-gray-500">
            Total: {appointments.length}
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Refresh
        </button>
      </div>

      {/* EMPTY */}
      {appointments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No appointments found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Patient</th>
                <th className="p-4 text-left">Doctor</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Reason</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="border-t">

                  {/* PATIENT */}
                  <td className="p-4">
                    {getPatientName(appointment)}
                  </td>

                  {/* DOCTOR (🔥 FIXED PART) */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getDoctorImage(appointment) && (
                        <img
                          src={getDoctorImage(appointment)}
                          className="w-8 h-8 rounded-full object-cover"
                          alt="doctor"
                        />
                      )}
                      <span>{getDoctorName(appointment)}</span>
                    </div>
                  </td>

                  {/* DATE */}
                  <td className="p-4">
                    {appointment.date} {appointment.time}
                  </td>

                  {/* REASON */}
                  <td className="p-4">
                    {appointment.reason || "N/A"}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;