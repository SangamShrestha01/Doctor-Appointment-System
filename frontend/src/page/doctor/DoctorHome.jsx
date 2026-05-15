import React, { useEffect, useState } from "react";
import api from "../../api/api.js";
import StatsCard from "../../component/doctor/StatsCard.jsx"
const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments/doctor");
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= STATS =================
  const total = appointments.length;
  const pending = appointments.filter(
    (a) => a.status === "pending"
  ).length;

  const confirmed = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;

  const rejected = appointments.filter(
    (a) => a.status === "rejected"
  ).length;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Doctor Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Welcome back! Here is your appointment overview.
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-blue-600 font-medium">
          Loading dashboard...
        </p>
      ) : (
        <>
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <StatsCard
              title="Total Appointments"
              value={total}
              color="text-blue-600"
            />

            <StatsCard
              title="Pending"
              value={pending}
              color="text-yellow-500"
            />

            <StatsCard
              title="Confirmed"
              value={confirmed}
              color="text-green-600"
            />

            <StatsCard
              title="Rejected"
              value={rejected}
              color="text-red-600"
            />

          </div>

          {/* QUICK SUMMARY */}
          <div className="bg-white p-5 rounded-xl shadow mt-6">
            <h2 className="text-lg font-semibold mb-2">
              Quick Summary
            </h2>

            <ul className="text-sm text-gray-600 space-y-1">
              <li>📌 You have {pending} pending appointments</li>
              <li>✅ {confirmed} appointments confirmed</li>
              <li>❌ {rejected} appointments rejected</li>
            </ul>
          </div>
        </>
      )}

    </div>
  );
};

export default DoctorHome;