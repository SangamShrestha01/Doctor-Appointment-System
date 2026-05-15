import React, { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { useBookAppointment } from '../services/mutatation/booking';
import { useInitiatePayment } from '../services/mutatation/payment.mutations';
import 'react-toastify/dist/ReactToastify.css';

export function BookingForm({ doctorId, availability, fees, slot_booked = [] }) {
  const [selectedWeekday, setSelectedWeekday] = useState('');
  const [selectedTime, setSelectedTime]       = useState('');
  const [reason, setReason]                   = useState('');

  const { bookAppointment, loading } = useBookAppointment();
  const { initiatePayment }          = useInitiatePayment();

  // ✅ FIX: Handle Mongoose Map serialized as plain object OR real Map
  const normalizedAvailability = useMemo(() => {
    const normalized = {};
    if (!availability) return normalized;

    const entries =
      availability instanceof Map
        ? Array.from(availability.entries())
        : Object.entries(availability);

    entries.forEach(([day, times]) => {
      if (Array.isArray(times) && times.length > 0) {
        normalized[day.toLowerCase()] = times;
      }
    });

    return normalized;
  }, [availability]);

  const weekdays = useMemo(
    () => Object.keys(normalizedAvailability),
    [normalizedAvailability]
  );

  const handleDaySelect = (day) => {
    setSelectedWeekday(day);
    setSelectedTime(''); // reset time when day changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedWeekday || !selectedTime) {
      toast.error('Please select a day and time');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for visit');
      return;
    }

    try {
      const res = await bookAppointment({
        doctorId,
        weekday: selectedWeekday,  // backend does case-insensitive lookup now
        time: selectedTime,
        reason,
      });

      // ✅ FIX: correct path — API returns { success, message, data: { _id, ... } }
      const appointmentId = res?.data?._id;
      if (!appointmentId) throw new Error('Appointment ID missing from response');

      toast.success('Appointment booked! Redirecting to payment...');

      const formHtml = await initiatePayment(appointmentId);

      const parser      = new DOMParser();
      const doc         = parser.parseFromString(formHtml, 'text/html');
      const backendForm = doc.querySelector('form');
      if (!backendForm) throw new Error('No payment form returned from server');

      const form    = document.createElement('form');
      form.action   = backendForm.action;
      form.method   = backendForm.method || 'POST';
      form.style.display = 'none';
      document.body.appendChild(form);

      Array.from(backendForm.querySelectorAll('input')).forEach((input) => {
        const hidden   = document.createElement('input');
        hidden.type    = 'hidden';
        hidden.name    = input.name;
        hidden.value   = input.value;
        form.appendChild(hidden);
      });

      form.submit();
    } catch (err) {
      console.error('Booking/payment error:', err);
      toast.error(
        err.response?.data?.message || err.message || 'Booking failed'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Day Selection */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">Select Day</p>
        {weekdays.length === 0 && (
          <p className="text-sm text-red-500">No available days for this doctor.</p>
        )}
        <div className="grid grid-cols-2 gap-2">
          {weekdays.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => handleDaySelect(day)}
              className={`py-2 rounded-lg text-sm font-medium border transition
                ${selectedWeekday === day
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-slate-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedWeekday && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Select Time</p>
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
                    ${selectedTime === time
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 border-slate-300 hover:bg-blue-50'
                    }
                    ${isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* Fee Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center">
        <span className="text-sm text-slate-600">Consultation Fee</span>
        <span className="text-2xl font-bold text-blue-700">₹{fees}</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!selectedWeekday || !selectedTime || loading}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition"
      >
        <Calendar className="w-4 h-4" />
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>

    </form>
  );
}