import React, { useEffect, useState } from "react";
import api from "../../api/api.js";
import StatsCard from "../../component/doctor/StatsCard.jsx";

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAppointments(); }, []);

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

  const total     = appointments.length;
  const pending   = appointments.filter((a) => a.status === "pending").length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const rejected  = appointments.filter((a) => a.status === "rejected").length;

  const stats = [
    {
      title: "Total",
      value: total,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: "📋",
      subtitle: "All appointments",
    },
    {
      title: "Pending",
      value: pending,
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: "⏳",
      subtitle: "Awaiting confirmation",
    },
    {
      title: "Confirmed",
      value: confirmed,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: "✅",
      subtitle: "Ready to attend",
    },
    {
      title: "Rejected",
      value: rejected,
      color: "text-red-500",
      bg: "bg-red-50",
      icon: "❌",
      subtitle: "Declined appointments",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
        <p className="text-sm text-gray-400 mt-0.5">Here's your appointment summary at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* Quick Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Quick Summary</h2>
        <div className="space-y-3">

          <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
              <span>⏳</span> Pending appointments
            </div>
            <span className="text-sm font-bold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full">{pending}</span>
          </div>

          <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <span>✅</span> Confirmed appointments
            </div>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">{confirmed}</span>
          </div>

          <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-red-50 border border-red-100">
            <div className="flex items-center gap-2 text-sm font-medium text-red-600">
              <span>❌</span> Rejected appointments
            </div>
            <span className="text-sm font-bold text-red-500 bg-red-100 px-2.5 py-0.5 rounded-full">{rejected}</span>
          </div>

          {total === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm">
              No appointments yet. They'll show up here once booked.
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default DoctorHome;