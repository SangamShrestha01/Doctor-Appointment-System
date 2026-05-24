import React, { useEffect, useState } from "react";
import api from "../../api/api";

const statusConfig = {
  pending:   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-100",   dot: "bg-amber-400",   label: "Pending"   },
  confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", dot: "bg-emerald-400", label: "Confirmed" },
  approved:  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", dot: "bg-emerald-400", label: "Approved"  },
  cancelled: { bg: "bg-red-50",     text: "text-red-600",     border: "border-red-100",     dot: "bg-red-400",     label: "Cancelled" },
  completed: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-100",    dot: "bg-blue-400",    label: "Completed" },
};

const getStatus = (status) =>
  statusConfig[status?.toLowerCase()] || { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-100", dot: "bg-gray-400", label: status || "Unknown" };

const getPatientName  = (a) => a.patient?.name       || a.patient?.user?.name || "Unknown Patient";
const getDoctorName   = (a) => a.doctor?.user?.name  || a.doctorName          || "Doctor Not Assigned";
const getDoctorImage  = (a) => a.doctor?.user?.image || a.doctorImage         || null;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filter, setFilter]             = useState("all");

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments/doctor");
      setAppointments(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesFilter = filter === "all" || a.status?.toLowerCase() === filter;
    const matchesSearch =
      getPatientName(a).toLowerCase().includes(search.toLowerCase()) ||
      getDoctorName(a).toLowerCase().includes(search.toLowerCase()) ||
      (a.reason || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filters = ["all", "pending", "confirmed", "completed", "cancelled"];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {appointments.length} total appointment{appointments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={fetchAppointments}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search patient, doctor or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
          />
        </div>
        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border capitalize transition
                ${filter === f
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-3xl">📅</div>
          <p className="text-gray-500 font-medium">No appointments found</p>
          <p className="text-gray-300 text-sm">Try adjusting your search or filter</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Patient</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Doctor</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reason</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((a) => {
                  const sc = getStatus(a.status);
                  return (
                    <tr key={a._id} className="hover:bg-blue-50/30 transition-colors">

                      {/* Patient */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {getPatientName(a).charAt(0).toUpperCase()}
                          </div>
                          <p className="text-sm font-semibold text-gray-800">{getPatientName(a)}</p>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {getDoctorImage(a) ? (
                            <img src={getDoctorImage(a)} alt="doctor"
                              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-300 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {getDoctorName(a).charAt(0)}
                            </div>
                          )}
                          <p className="text-sm text-gray-700 font-medium">{getDoctorName(a)}</p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 font-medium">{a.date}</p>
                        {a.time && <p className="text-xs text-gray-400 mt-0.5">⏰ {a.time}</p>}
                      </td>

                      {/* Reason */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-500 max-w-[160px] truncate">{a.reason || "—"}</p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((a) => {
              const sc = getStatus(a.status);
              return (
                <div key={a._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-sm font-bold text-white">
                        {getPatientName(a).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{getPatientName(a)}</p>
                        <p className="text-xs text-gray-400">Patient</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                    {getDoctorImage(a) ? (
                      <img src={getDoctorImage(a)} alt="doctor" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        {getDoctorName(a).charAt(0)}
                      </div>
                    )}
                    <p className="text-sm text-gray-600 font-medium">{getDoctorName(a)}</p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>📅 {a.date}{a.time ? ` · ⏰ ${a.time}` : ""}</span>
                    {a.reason && <span>📝 {a.reason}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Appointments;