import React from 'react';

const DoctorCard = ({ doctor }) => {
  return (
    <div
      className="group relative backdrop-blur-xl bg-white/70
      border border-white/40 rounded-2xl overflow-hidden
      shadow-lg hover:shadow-2xl transition-all duration-300
      hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={doctor.image || '/placeholder.svg'}
          alt={doctor.name}
          className="w-full h-full object-cover
          transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />

        {/* Speciality Badge */}
        <div
          className="absolute bottom-4 left-4 px-4 py-1.5
          rounded-full text-sm font-semibold
          bg-white/80 backdrop-blur-md
          text-blue-700 shadow-md"
        >
          {doctor.speciality}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col space-y-4">
        <h3 className="text-xl font-bold text-gray-800 text-center">
          {doctor.name}
        </h3>

        {/* Qualification */}
        <div className="flex justify-between items-center border-b border-gray-200/70 pb-2">
          <span className="text-gray-600 text-sm font-medium">
            Qualification
          </span>
          <span className="font-semibold text-gray-800">{doctor.degree}</span>
        </div>

        {/* Fee */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm font-medium">
            Consultation Fee
          </span>
          <span className="text-lg font-bold text-blue-600">
            Rs. {doctor.fees}
          </span>
        </div>

        {/* Action */}
        <button
          className="mt-2 w-full py-3 rounded-xl
          bg-linear-to-r from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          text-white font-semibold
          shadow-lg hover:shadow-xl
          transition-all duration-300
          flex items-center justify-center gap-2
          hover:scale-[1.03]"
        >
          <CalendarIcon />
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;

/* Icon */
const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
