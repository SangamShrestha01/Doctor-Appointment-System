import React from 'react';
import { Clock } from 'lucide-react';

function AvailabilityCard({ availability }) {
  if (!availability) return null;

  return (
    <div className="shadow-xl rounded-xl p-5 bg-white space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Clock className="w-5 h-5 text-blue-600" />
        Available Time Slots
      </div>

      {Object.entries(availability).map(([day, times]) => (
        <div key={day}>
          <h4 className="font-semibold text-blue-600 mb-2">{day}</h4>

          <div className="flex flex-wrap gap-2">
            {times.map((time) => (
              <span
                key={time}
                className="border rounded-lg px-3 py-1 text-sm text-gray-700"
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AvailabilityCard;
