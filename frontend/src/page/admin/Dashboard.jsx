import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constant/route";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
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
          patients:     patientsRes.data?.total       || 0,
          appointments: appointmentsRes.data?.total   || 0,
        });
        setRecentDoctors((doctorsRes.data?.data     || []).slice(0, 4));
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
    confirmed: { bg: "#dcfce7", text: "#15803d", dot: "#22c55e", label: "Confirmed" },
    pending:   { bg: "#fef9c3", text: "#a16207", dot: "#eab308", label: "Pending"   },
    cancelled: { bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444", label: "Cancelled" },
    completed: { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6", label: "Completed" },
  };

  const getStatus = (status) =>
    statusConfig[status?.toLowerCase()] || { bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af", label: status };

  const avatarFallback = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=e0e7ff&color=4f46e5&bold=true`;

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          border: "3px solid #e0e7ff", borderTopColor: "#6366f1",
          animation: "spin 0.8s linear infinite"
        }} />
        <p style={{ color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>Loading dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Doctors",
      value: stats.doctors,
      icon: "👨‍⚕️",
      accent: "#6366f1",
      lightBg: "#eef2ff",
      route: ROUTES.ADMIN_DOCTORS,
      trend: "+2 this month",
    },
    {
      title: "Total Patients",
      value: stats.patients,
      icon: "🧑‍🤝‍🧑",
      accent: "#10b981",
      lightBg: "#ecfdf5",
      route: null,
      trend: "+12 this week",
    },
    {
      title: "Appointments",
      value: stats.appointments,
      icon: "📅",
      accent: "#f59e0b",
      lightBg: "#fffbeb",
      route: ROUTES.ADMIN_APPOINTMENTS,
      trend: "View all",
    },
  ];

  return (
    <div style={{ padding: "0 0 40px", fontFamily: "'Outfit', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .stat-card {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          border: 1.5px solid #f1f5f9;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: fadeUp 0.4s ease both;
          position: relative;
          overflow: hidden;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }
        .stat-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent);
          border-radius: 0 0 20px 20px;
        }
        .panel {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #f1f5f9;
          overflow: hidden;
          animation: fadeUp 0.5s ease both;
        }
        .panel-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .doc-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.15s;
        }
        .doc-row:last-child { border-bottom: none; }
        .doc-row:hover { background: #f8fafc; }
        .appt-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.15s;
        }
        .appt-row:last-child { border-bottom: none; }
        .appt-row:hover { background: #f8fafc; }
        .view-btn {
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
          background: #eef2ff;
          border: none;
          padding: 6px 14px;
          border-radius: 20px;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }
        .view-btn:hover { background: #e0e7ff; }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
          .doc-row, .appt-row { padding: 10px 16px; }
          .panel-header { padding: 16px; }
        }
        @media (max-width: 900px) {
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "flex-start",
        justifyContent: "space-between", gap: 12, marginBottom: 32,
        animation: "fadeUp 0.3s ease both",
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: "4px 0 0", fontWeight: 400 }}>
            Welcome back, Super Admin 👋
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#f8fafc", border: "1.5px solid #f1f5f9",
          borderRadius: 12, padding: "8px 16px",
        }}>
          <span style={{ fontSize: 16 }}>📅</span>
          <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
        marginBottom: 28,
      }}>
        {statCards.map((card, i) => (
          <div
            key={card.title}
            className="stat-card"
            style={{ "--accent": card.accent, animationDelay: `${i * 0.07}s`, cursor: card.route ? "pointer" : "default" }}
            onClick={() => card.route && navigate(card.route)}
          >
            {/* Icon blob */}
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: card.lightBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, marginBottom: 16,
            }}>
              {card.icon}
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {card.title}
            </p>
            <p style={{ fontSize: 36, fontWeight: 700, color: "#0f172a", margin: "0 0 10px", lineHeight: 1 }}>
              {card.value}
            </p>
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: card.accent,
              background: card.lightBg,
              padding: "3px 10px", borderRadius: 20,
            }}>
              {card.trend}
            </span>
          </div>
        ))}
      </div>

      {/* ── Bottom Grid ── */}
      <div className="bottom-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Recent Doctors */}
        <div className="panel" style={{ animationDelay: "0.2s" }}>
          <div className="panel-header">
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>Recent Doctors</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>{recentDoctors.length} registered</p>
            </div>
            <button className="view-btn" onClick={() => navigate(ROUTES.ADMIN_DOCTORS)}>
              View all →
            </button>
          </div>

          {recentDoctors.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>👨‍⚕️</p>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>No doctors registered yet</p>
            </div>
          ) : (
            recentDoctors.map((doc) => (
              <div key={doc._id} className="doc-row">
                <img
                  src={doc.user?.image || avatarFallback(doc.user?.name)}
                  alt={doc.user?.name}
                  onError={(e) => { e.target.src = avatarFallback(doc.user?.name); }}
                  style={{ width: 42, height: 42, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: "2px solid #f1f5f9" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {doc.user?.name}
                  </p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {doc.user?.email}
                  </p>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  background: "#eef2ff", color: "#6366f1",
                  padding: "4px 10px", borderRadius: 20,
                  whiteSpace: "nowrap", flexShrink: 0,
                  border: "1px solid #e0e7ff",
                }}>
                  {doc.speciality}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Recent Appointments */}
        <div className="panel" style={{ animationDelay: "0.25s" }}>
          <div className="panel-header">
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>Recent Appointments</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>{recentAppointments.length} latest</p>
            </div>
            <button className="view-btn" onClick={() => navigate(ROUTES.ADMIN_APPOINTMENTS)}>
              View all →
            </button>
          </div>

          {recentAppointments.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>📅</p>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>No appointments yet</p>
            </div>
          ) : (
            recentAppointments.map((appt) => {
              const sc = getStatus(appt.status);
              return (
                <div key={appt._id} className="appt-row">
                  <img
                    src={appt.patient?.image || avatarFallback(appt.patient?.name)}
                    alt={appt.patient?.name}
                    onError={(e) => { e.target.src = avatarFallback(appt.patient?.name); }}
                    style={{ width: 42, height: 42, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: "2px solid #f1f5f9" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {appt.patient?.name}
                    </p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {appt.doctor?.user?.name} · {appt.date}
                    </p>
                  </div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11, fontWeight: 600,
                    background: sc.bg, color: sc.text,
                    padding: "4px 10px", borderRadius: 20,
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                    {sc.label}
                  </span>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;``