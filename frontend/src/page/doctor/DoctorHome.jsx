import React, { useEffect, useState } from "react";
import api from "../../api/api.js";

const StatsCard = ({ title, value, icon, subtitle, accentColor, iconBg, iconColor }) => (
  <div
    style={{
      background: "#fff",
      border: "0.5px solid #e5e7eb",
      borderRadius: "14px",
      padding: "1.1rem 1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      transition: "border-color 0.15s, box-shadow 0.15s",
      cursor: "default",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = accentColor;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}22`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = "#e5e7eb";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {title}
      </span>
      <div style={{
        width: "34px", height: "34px", borderRadius: "9px",
        background: iconBg, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "17px", color: iconColor,
      }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: "30px", fontWeight: 700, color: "#111827", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: "12px", color: "#9ca3af" }}>{subtitle}</div>
  </div>
);

const BarRow = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
      <span style={{ fontSize: "12px", color: "#6b7280", width: "68px", flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: "7px", background: "#f3f4f6", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "99px", transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: "12px", color: "#6b7280", width: "20px", textAlign: "right", flexShrink: 0 }}>{value}</span>
    </div>
  );
};

const SummaryRow = ({ icon, label, count, rowBg, rowBorder, labelColor, countBg, countColor }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 14px", borderRadius: "10px",
    background: rowBg, border: `0.5px solid ${rowBorder}`,
  }}>
    <span style={{ fontSize: "13px", fontWeight: 500, color: labelColor, display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "15px" }}>{icon}</span>
      {label}
    </span>
    <span style={{
      fontSize: "13px", fontWeight: 600, color: countColor,
      background: countBg, padding: "2px 11px", borderRadius: "99px",
    }}>{count}</span>
  </div>
);

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
  const responded = confirmed + rejected;
  const acceptRate = responded > 0 ? Math.round((confirmed / responded) * 100) : null;

  const stats = [
    { title: "Total",     value: total,     icon: "📋", subtitle: "All appointments",    accentColor: "#3b82f6", iconBg: "#eff6ff", iconColor: "#2563eb" },
    { title: "Pending",   value: pending,   icon: "⏳", subtitle: "Awaiting confirmation", accentColor: "#f59e0b", iconBg: "#fffbeb", iconColor: "#b45309" },
    { title: "Confirmed", value: confirmed, icon: "✅", subtitle: "Ready to attend",      accentColor: "#10b981", iconBg: "#ecfdf5", iconColor: "#059669" },
    { title: "Rejected",  value: rejected,  icon: "❌", subtitle: "Declined appointments", accentColor: "#ef4444", iconBg: "#fef2f2", iconColor: "#dc2626" },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "12px" }}>
        <div style={{
          width: "38px", height: "38px", border: "3px solid #3b82f6",
          borderTopColor: "transparent", borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: "13px", color: "#9ca3af" }}>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: 0 }}>Overview</h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "3px" }}>Your appointment summary at a glance</p>
        </div>
        <div style={{
          fontSize: "12px", color: "#059669", background: "#ecfdf5",
          padding: "5px 13px", borderRadius: "99px", border: "0.5px solid #6ee7b7",
          display: "flex", alignItems: "center", gap: "6px", fontWeight: 500,
        }}>
          <span style={{
            width: "7px", height: "7px", borderRadius: "50%", background: "#10b981",
            animation: "pulse 1.6s infinite",
            display: "inline-block",
          }} />
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
          Live data
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Two-col section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>

        {/* Bar chart */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "14px", padding: "1.25rem" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "1rem" }}>Status breakdown</h2>
          {total > 0 ? (
            <>
              <BarRow label="Pending"   value={pending}   total={total} color="#f59e0b" />
              <BarRow label="Confirmed" value={confirmed} total={total} color="#10b981" />
              <BarRow label="Rejected"  value={rejected}  total={total} color="#ef4444" />
            </>
          ) : (
            <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center", padding: "1.5rem 0" }}>No data yet</p>
          )}
        </div>

        {/* Acceptance rate */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "14px", padding: "1.25rem" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Acceptance rate</h2>
          <div style={{ fontSize: "30px", fontWeight: 700, color: "#111827", lineHeight: 1, margin: "8px 0 4px" }}>
            {acceptRate !== null ? `${acceptRate}%` : "—"}
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>of responded appointments confirmed</p>
          <div style={{ height: "7px", background: "#f3f4f6", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{
              width: `${acceptRate || 0}%`, height: "100%",
              background: "#10b981", borderRadius: "99px", transition: "width 0.7s ease",
            }} />
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
            {responded > 0
              ? `${responded} responded · ${responded - confirmed} declined`
              : "No responses recorded yet"}
          </p>
        </div>

      </div>

      {/* Quick Summary */}
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "14px", padding: "1.25rem" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "1rem" }}>Quick summary</h2>
        {total > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <SummaryRow icon="⏳" label="Pending appointments"   count={pending}   rowBg="#fffbeb" rowBorder="#fcd34d" labelColor="#92400e" countBg="#fde68a" countColor="#b45309" />
            <SummaryRow icon="✅" label="Confirmed appointments" count={confirmed} rowBg="#ecfdf5" rowBorder="#6ee7b7" labelColor="#065f46" countBg="#a7f3d0" countColor="#047857" />
            <SummaryRow icon="❌" label="Rejected appointments"  count={rejected}  rowBg="#fef2f2" rowBorder="#fca5a5" labelColor="#991b1b" countBg="#fecaca" countColor="#b91c1c" />
          </div>
        ) : (
          <p style={{ textAlign: "center", fontSize: "13px", color: "#9ca3af", padding: "1.5rem 0" }}>
            No appointments yet. They'll show up here once booked.
          </p>
        )}
      </div>

      <p style={{ fontSize: "12px", color: "#d1d5db", textAlign: "center" }}>Data refreshes on each page load</p>

    </div>
  );
};

export default DoctorHome;