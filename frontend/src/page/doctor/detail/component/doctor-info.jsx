import React from 'react';

import { Award, Briefcase, DollarSign, MapPin } from 'lucide-react';

const DoctorInfo = ({ doctor }) => (
  <div className="flex-1 pt-6">
    <h1 className="text-4xl font-extrabold">{doctor.user.name}</h1>
    <p className="text-2xl text-blue-600">{doctor.speciality}</p>

    <div className="flex gap-6 mt-6 flex-wrap">
      <span className="flex gap-2">
        <Award /> {doctor.degree}
      </span>
      <span className="flex gap-2">
        <Briefcase /> {doctor.experience} yrs
      </span>
      <span className="flex gap-2">
        <DollarSign /> ₹{doctor.fees}
      </span>
    </div>

    <div className="flex gap-3 mt-6">
      <MapPin />
      <div>
        <p>{doctor.address.hospital}</p>
        <p className="text-slate-500">{doctor.address.city}, Nepal</p>
      </div>
    </div>
  </div>
);

export default DoctorInfo;
