import React from 'react';
import { Link } from 'react-router-dom';

import {
  MapPin,
  Calendar,
  DollarSign,
  GraduationCap,
  Clock,
  ArrowLeft,
  Icon,
} from 'lucide-react';
import { glass } from './glass';
import BookingForm from '../../../component/booking';

const doctorDetails = {
  user: {
    name: 'Dr. Doctor 10',
  },
  speciality: 'Gastroenterologist',
  degree: 'MBBS, MD',
  experience: 1,
  fees: 769,
  address: {
    city: 'Kathmandu',
    hospital: 'City Care Hospital',
  },
  availability: {
    Monday: ['10:00', '12:00', '15:00'],
    Wednesday: ['11:00', '14:00'],
    Friday: ['09:00', '13:00'],
  },
  image: 'https://i.pravatar.cc/300?img=19',
};

export default function DoctorDetailPage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Back */}
        <div className="py-4">
          <div className="max-w-7xl mx-auto px-4">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Doctors
            </Link>
          </div>
        </div>

        {/* Profile */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* LEFT */}
              <div className="lg:col-span-2 space-y-6">
                {/* Doctor Info */}
                <div className={`${glass} p-6`}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={doctorDetails.image}
                      className="w-44 h-44 rounded-xl object-cover"
                    />

                    <div className="space-y-4 flex-1">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                          {doctorDetails.user.name}
                        </h1>
                        <p className="text-blue-600">{doctorDetails.degree}</p>
                      </div>

                      <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        {doctorDetails.speciality}
                      </span>

                      <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                        <Info
                          icon={Calendar}
                          text={`${doctorDetails.experience} year experience`}
                        />
                        <Info
                          icon={DollarSign}
                          text={`Rs. ${doctorDetails.fees} / visit`}
                        />
                        <Info icon={MapPin} text={doctorDetails.address.city} />
                        <Info
                          icon={GraduationCap}
                          text={doctorDetails.degree}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hospital */}
                <div className={`${glass} p-6`}>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Hospital & Location
                  </h3>
                  <p>
                    <strong>Hospital:</strong> {doctorDetails.address.hospital}
                  </p>
                  <p>
                    <strong>City:</strong> {doctorDetails.address.city}
                  </p>
                </div>

                {/* Availability */}
                <div className={`${glass} p-6`}>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Available Time Slots
                  </h3>

                  {Object.entries(doctorDetails.availability).map(
                    ([day, times]) => (
                      <div key={day} className="mb-4">
                        <h4 className="font-semibold text-blue-600 mb-2">
                          {day}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {times.map((time) => (
                            <span
                              key={time}
                              className="px-3 py-1.5 rounded-full bg-white/80 border border-blue-200 text-blue-700 text-sm"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* About */}
                <div className={`${glass} p-6`}>
                  <h3 className="text-lg font-semibold mb-2">
                    About the Speciality
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Dr. {doctorDetails.user.name.split(' ').pop()} is a{' '}
                    {doctorDetails.speciality} with {doctorDetails.experience}{' '}
                    year of experience. Available at{' '}
                    {doctorDetails.address.hospital},{' '}
                    {doctorDetails.address.city}.
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <div className={`${glass} p-6`}>
                    <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Book Appointment
                    </h3>

                    <BookingForm
                      doctorName={doctorDetails.user.name}
                      availability={doctorDetails.availability}
                      fees={doctorDetails.fees}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const Info = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-4 w-4 text-blue-500" />
    <span>{text}</span>
  </div>
);
