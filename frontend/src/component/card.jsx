import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <div className="h-56 w-full overflow-hidden rounded-t-xl">
        <img
          src={doctor.image || '/placeholder.svg'}
          alt={doctor.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>

        {/* Degree */}
        <p className="text-gray-600 text-sm">{doctor.degree}</p>

        {/* Speciality */}
        <span className="inline-block text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
          {doctor.speciality}
        </span>

        {/* Fees */}
        <div className="flex justify-between items-center text-gray-700 text-sm mt-2">
          <span>Consultation Fee:</span>
          <span className="font-semibold text-gray-900">Rs. {doctor.fees}</span>
        </div>

        {/* Button */}
        <Link to={`/doctors/${doctor.id}`}>
          <button className="mt-3 w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Book Appointment
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
