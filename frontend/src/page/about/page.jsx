import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // If using React Router
import {
  Check,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Briefcase,
  Clock,
} from 'lucide-react';
import { useDoctorByIdQuery } from '../../services/query/doctor.query';

// Sample doctor data (replace with API fetch in real app)

const DoctorDetailPage = () => {
  const { id } = useParams();

  const { doctor, loading, error } = useDoctorByIdQuery(id);

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading doctor details...
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  // ✅ Safety check
  if (!doctor) return null;

  const availability = Object.entries(doctor.availability || {});

  return (
    <main className="w-full min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2 transition">
            ← Back to Doctors
          </button>
        </div>
      </div>

      {/* Doctor Profile Hero Section */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Gradient Header */}
            <div className="h-40 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700"></div>

            {/* Profile Content */}
            <div className="px-6 md:px-10 pb-10 -mt-20">
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Doctor Photo */}
                <div className="flex-shrink-0">
                  <img
                    src={doctor.user.image}
                    alt={doctor.user.name}
                    className="w-56 h-56 rounded-full object-cover border-8 border-white shadow-2xl"
                  />
                </div>

                {/* Doctor Info */}
                <div className="flex-1 pt-6">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
                    {doctor.user.name}
                  </h1>
                  <p className="text-2xl font-semibold text-blue-600 mt-2">
                    {doctor.speciality}
                  </p>

                  {/* Credentials */}
                  <div className="flex flex-wrap gap-6 mt-6">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-slate-800">
                        {doctor.degree}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-slate-800">
                        {doctor.experience} year
                        {doctor.experience > 1 ? 's' : ''} experience
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-slate-800">
                        ₹{doctor.fees} consultation
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-4 mt-6 text-slate-700">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {doctor.address.hospital}
                      </p>
                      <p className="text-slate-600">
                        {doctor.address.city}, Nepal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Booking Card */}
                <div className="lg:w-96 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg">
                  <p className="text-sm uppercase tracking-wide text-slate-600 mb-2">
                    Consultation Fee
                  </p>
                  <p className="text-5xl font-extrabold text-blue-700 mb-8">
                    ₹{doctor.fees}
                  </p>
                  <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105">
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Availability */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                About the Doctor
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                Dr. {doctor.user.name.split('Dr. ')[1] || doctor.user.name} is a
                highly qualified {doctor.speciality} with {doctor.experience}{' '}
                year{doctor.experience > 1 ? 's' : ''} of dedicated experience
                in patient care. Holding a {doctor.degree}, the doctor is
                committed to providing exceptional medical services and
                maintaining the highest standards of healthcare excellence at{' '}
                {doctor.address.hospital}.
              </p>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                Available Slots
              </h2>

              {/* Day Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {availability.map(([day]) => (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedSlot(''); // Reset slot when day changes
                    }}
                    className={`p-5 rounded-xl font-bold text-lg transition-all border-2 ${
                      selectedDay === day
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:shadow-md'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Time Slots */}
              {selectedDay && (
                <div className="space-y-6">
                  <p className="text-lg font-semibold text-slate-700">
                    Available times on{' '}
                    <span className="text-blue-600">{selectedDay}</span>
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {doctor.availability[selectedDay].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-4 rounded-xl border-2 font-medium flex items-center justify-center gap-2 transition-all ${
                          selectedSlot === slot
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                            : 'bg-slate-50 text-slate-800 border-slate-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        <Clock className="w-5 h-5" />
                        {slot}
                      </button>
                    ))}
                  </div>

                  {selectedSlot && (
                    <div className="pt-6">
                      <button className="w-full md:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 mx-auto">
                        <Check className="w-6 h-6" />
                        Confirm Appointment for {selectedSlot}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Contact Information
              </h3>
              <div className="space-y-5 text-lg">
                <div>
                  <p className="text-sm uppercase text-slate-500 mb-1">Email</p>
                  <p className="font-semibold text-slate-800 break-all">
                    {doctor.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-slate-500 mb-1">
                    Location
                  </p>
                  <p className="font-semibold text-slate-800">
                    {doctor.address.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-slate-500 mb-1">
                    Hospital
                  </p>
                  <p className="font-semibold text-slate-800">
                    {doctor.address.hospital}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Quick Stats</h3>
              <div className="space-y-5 text-lg">
                <div className="flex justify-between">
                  <span>Experience</span>
                  <span className="font-bold">
                    {doctor.experience} year{doctor.experience > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Consultation Fee</span>
                  <span className="font-bold">₹{doctor.fees}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Days</span>
                  <span className="font-bold">
                    {availability.length} days/week
                  </span>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <button className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-105">
              Book Appointment Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DoctorDetailPage;
