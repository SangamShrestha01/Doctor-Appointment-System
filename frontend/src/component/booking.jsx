import React from 'react';
import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function BookingForm({ doctorName, availability, fees }) {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Appointment booked with ${doctorName} on ${selectedDay} at ${selectedTime}`
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Day */}
      <div>
        <p className="font-medium mb-2">Select Day</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(availability).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => {
                setSelectedDay(day);
                setSelectedTime('');
              }}
              className={`px-4 py-2 rounded-lg border transition
                ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white'
                    : 'bg-white hover:bg-blue-50'
                }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Time */}
      {selectedDay && (
        <div>
          <p className="font-medium mb-2">Select Time</p>
          <div className="grid grid-cols-2 gap-2">
            {availability[selectedDay].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-2 rounded-lg border text-sm transition
                  ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-white hover:bg-blue-50'
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fee */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex justify-between">
        <span className="text-gray-600">Consultation Fee</span>
        <span className="text-xl font-bold text-blue-600">Rs. {fees}</span>
      </div>

      {/* Submit */}
      <button
        disabled={!selectedDay || !selectedTime}
        className="w-full py-3 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
      >
        <Calendar className="inline mr-2 h-4 w-4" />
        Confirm Booking
      </button>
    </form>
  );
}
