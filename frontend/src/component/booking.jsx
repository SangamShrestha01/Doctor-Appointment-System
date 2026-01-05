import React, { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { useBookAppointment } from '../services/mutatation/booking';
import 'react-toastify/dist/ReactToastify.css';

export function BookingForm({
  doctorId,
  availability,
  fees,
  slot_booked = [],
}) {
  const [selectedWeekday, setSelectedWeekday] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const { bookAppointment, loading } = useBookAppointment();

  // Normalize availability keys to lowercase for consistency
  const normalizedAvailability = useMemo(() => {
    const normalized = {};
    if (!availability) return normalized;
    Object.keys(availability).forEach((day) => {
      normalized[day.toLowerCase()] = availability[day];
    });
    return normalized;
  }, [availability]);

  // List of weekdays with available times
  const weekdays = useMemo(
    () => Object.keys(normalizedAvailability),
    [normalizedAvailability]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedWeekday || !selectedTime) {
      toast.error('Please select a weekday and time');
      return;
    }

    try {
      await bookAppointment({
        doctorId,
        weekday: selectedWeekday,
        time: selectedTime,
        reason,
      });

      toast.success('Appointment booked successfully!');

      // Reset selection
      setSelectedWeekday('');
      setSelectedTime('');
      setReason('');
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || 'Booking failed'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Weekday Selection */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">Select Day</p>
        <div className="grid grid-cols-2 gap-2">
          {weekdays.map((day) => {
            const times = normalizedAvailability[day] || [];
            const isDisabled = times.length === 0;

            return (
              <button
                key={day}
                type="button"
                onClick={() => !isDisabled && setSelectedWeekday(day)}
                className={`py-2 rounded-lg text-sm font-medium border transition
                  ${
                    selectedWeekday === day
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-slate-300'
                  }
                  ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-blue-500 hover:bg-blue-50'
                  }
                `}
                disabled={isDisabled}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedWeekday && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">
            Select Time
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {(normalizedAvailability[selectedWeekday] || []).map((time) => {
              const slotKey = `${selectedWeekday}-${time}`;
              const isBooked = slot_booked.includes(slotKey);

              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => !isBooked && setSelectedTime(time)}
                  disabled={isBooked}
                  className={`py-2 rounded-lg text-sm border transition
                    ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 border-slate-300 hover:bg-blue-50'
                    }
                    ${isBooked ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {time} {isBooked && '(Booked)'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Reason */}
      <div>
        <label className="text-sm font-medium text-slate-700">
          Reason for Visit
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Describe your problem..."
          required
        />
      </div>

      {/* Fee */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between">
        <span className="text-sm text-slate-600">Consultation Fee</span>
        <span className="text-2xl font-bold text-blue-700">₹{fees}</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!selectedWeekday || !selectedTime || loading}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Calendar className="w-4 h-4" />
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
