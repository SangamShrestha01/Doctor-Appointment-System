import React, { useEffect, useState } from "react";
import api from "../../api/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fetch dashboard data (you can connect real API later)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 🔥 Replace these with real backend endpoints later
        const doctorsRes = await api.get("/admin/doctors");
        const appointmentsRes = await api.get("/appointment");

        setStats({
          doctors: doctorsRes.data?.count || 0,
          patients: 0, // later implement user API
          appointments: appointmentsRes.data?.length || 0,
        });
      } catch (error) {
        console.log("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, color }) => (
    <div className={`p-6 rounded-xl shadow-md text-white ${color}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of your hospital system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <StatCard
          title="Total Doctors"
          value={stats.doctors}
          color="bg-blue-500"
        />

        <StatCard
          title="Total Patients"
          value={stats.patients}
          color="bg-green-500"
        />

        <StatCard
          title="Appointments"
          value={stats.appointments}
          color="bg-purple-500"
        />

      </div>

      {/* Future Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Recent Activity
        </h2>

        <p className="text-gray-500">
          📌 You can later add recent appointments, doctor registrations, etc.
        </p>
      </div>

    </div>
  );
};

export default Dashboard;