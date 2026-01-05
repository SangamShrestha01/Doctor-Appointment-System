import React from 'react';

import { MapPin } from 'lucide-react';

function HospitalCard({ doctor }) {
  return (
    <div className="shadow-xl rounded-xl p-5 bg-white space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MapPin className="w-5 h-5 text-blue-600" />
        Hospital & Location
      </div>

      <div>
        <p className="text-sm text-gray-500">Hospital</p>
        <p className="font-medium">{doctor.address.hospital}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">City</p>
        <p className="font-medium">{doctor.address.city}</p>
      </div>
    </div>
  );
}

export default HospitalCard;
