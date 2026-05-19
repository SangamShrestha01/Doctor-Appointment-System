import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constant/route";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
  });
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [doctorsRes, appointmentsRes, patientsRes] = await Promise.all([
          api.get("/admin/doctors"),
          api.get("/admin/appointments"),
          api.get("/admin/patients"),
        ]);

        setStats({
          doctors:      doctorsRes.data?.totalDoctors || 0,
          patients:     patientsRes.data?.total || 0,
          appointments: appointmentsRes.data?.total || 0,
        });

        // grab 3 most recent of each
        setRecentDoctors((doctorsRes.data?.data || []).slice(0, 3));
        setRecentAppointments((appointmentsRes.data?.data || []).slice(0, 5));

      } catch (error) {
        console.log("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statusConfig = {
    confirmed: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
    pending:   { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500"   },
    cancelled: { bg: "bg-red-100",     text: "text-red-600",     dot: "bg-red-500"     },
    completed: { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500"    },
  };

  const getStatus = (status) =>
    statusConfig[status?.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Doctors",
      value: stats.doctors,
      icon: "👨‍⚕️",
      bg: "bg-blue-500",
      light: "bg-blue-50",
      text: "text-blue-600",
      route: ROUTES.ADMIN_DOCTORS,
    },
    {
      title: "Total Patients",
      value: stats.patients,
      icon: "🧑‍🤝‍🧑",
      bg: "bg-emerald-500",
      light: "bg-emerald-50",
      text: "text-emerald-600",
      route: null,
    },
    {
      title: "Appointments",
      value: stats.appointments,
      icon: "📅",
      bg: "bg-purple-500",
      light: "bg-purple-50",
      text: "text-purple-600",
      route: ROUTES.ADMIN_APPOINTMENTS,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Welcome back, Super Admin 👋
          </p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <div
            key={card.title}
            onClick={() => card.route && navigate(card.route)}
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 transition
              ${card.route ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : ""}`}
          >
            <div className={`w-14 h-14 rounded-xl ${card.light} flex items-center justify-center text-2xl shrink-0`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{card.title}</p>
              <p className={`text-3xl font-bold ${card.text}`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Doctors */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Recent Doctors</h2>
            <button
              onClick={() => navigate(ROUTES.ADMIN_DOCTORS)}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium transition"
            >
              View all →
            </button>
          </div>

          {recentDoctors.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No doctors registered yet</p>
          ) : (
            <div className="space-y-3">
              {recentDoctors.map((doc) => (
                <div key={doc._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                  <img
                    src={doc.user?.image}
                    alt="doctor"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{doc.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{doc.user?.email}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100 shrink-0">
                    {doc.speciality}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Recent Appointments</h2>
            <button
              onClick={() => navigate(ROUTES.ADMIN_APPOINTMENTS)}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium transition"
            >
              View all →
            </button>
          </div>

          {recentAppointments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((appt) => {
                const sc = getStatus(appt.status);
                return (
                  <div key={appt._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                    <img
                      src={appt.patient?.image}
                      alt="patient"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{appt.patient?.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                         {appt.doctor?.user?.name} · {appt.date}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {appt.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;