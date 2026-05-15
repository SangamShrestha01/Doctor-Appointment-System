import React from "react";

const AppointmentCard = ({ appointment, onUpdateStatus }) => {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white space-y-3">

      {/* Patient Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {appointment?.patient?.name || "Unknown Patient"}
        </h2>
        <p className="text-sm text-gray-500">
          {appointment?.patient?.email}
        </p>
      </div>

      {/* Appointment Details */}
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-medium">Date:</span> {appointment?.date}
        </p>
        <p>
          <span className="font-medium">Time:</span> {appointment?.time}
        </p>
        <p>
          <span className="font-medium">Reason:</span> {appointment?.reason}
        </p>
      </div>

      {/* Status */}
      <div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            appointment?.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : appointment?.status === "confirmed"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {appointment?.status}
        </span>
      </div>

      {/* Actions */}
      {appointment?.status === "pending" && (
        <div className="flex gap-3 pt-2">

          <button
            onClick={() => onUpdateStatus(appointment._id, "confirmed")}
            className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Accept
          </button>

          <button
            onClick={() => onUpdateStatus(appointment._id, "rejected")}
            className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Reject
          </button>

        </div>
      )}
    </div>
  );
};

export default AppointmentCard;