
import React from 'react';
function AboutDoctorCard({ doctor }) {
  return (
    <div className=" shadow-xl rounded-xl p-5 bg-white">
      <h3 className="text-lg font-semibold mb-3">About the Speciality</h3>

      <p className="text-gray-600 leading-relaxed">
        Dr. {doctor.user.name.split(' ').pop()} is a {doctor.speciality} with{' '}
        {doctor.experience} year{doctor.experience !== 1 ? 's' : ''} of
        experience. Specialized in {doctor.speciality}, holding a{' '}
        {doctor.degree} degree. Available for consultations at{' '}
        {doctor.address.hospital} in {doctor.address.city}.
      </p>
    </div>
  );
}

export default AboutDoctorCard;
