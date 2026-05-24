import React from 'react';
import {
  MapPin, Calendar, DollarSign, GraduationCap, Clock, ArrowLeft,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useDoctorByIdQuery } from '../../../services/query/doctor.query';
import { BookingForm } from '../../../component/booking';
import HospitalCard from './component/hospital';
import AboutDoctorCard from './component/about';
import AvailabilityCard from './component/availibilty';

export default function DoctorDetailPage() {
  const { id } = useParams();
  const { doctor, loading, error } = useDoctorByIdQuery(id);

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!doctor) return null;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Back */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/doctors"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Doctors
          </Link>
        </div>
      </div>

      {/* Content */}
      {/* ✅ Added items-start to fix sticky */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8 items-start">

        {/* Left */}
        <div className="lg:col-span-2 space-y-6">

          {/* Doctor Card */}
          <div className="bg-white rounded-2xl shadow p-6 flex gap-6">
            <img
              src={doctor.user.image}
              alt={doctor.user.name}
              className="w-40 h-40 rounded-xl object-cover"
            />
            <div className="space-y-3">
              <h1 className="text-3xl font-bold">{doctor.user.name}</h1>
              <p className="text-blue-600 font-semibold">{doctor.speciality}</p>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                <Info IconComp={Calendar}>{doctor.experience} years</Info>
                <Info IconComp={DollarSign}>₹{doctor.fees}</Info>
                <Info IconComp={MapPin}>{doctor.address?.city || "N/A"}</Info>
                <Info IconComp={GraduationCap}>{doctor.degree}</Info>
              </div>
            </div>
          </div>

          <HospitalCard doctor={doctor} />
          <AvailabilityCard availability={doctor.availability} />
          <AboutDoctorCard doctor={doctor} />

        </div>

        {/* Right — sticky booking form */}
        <div className="sticky top-20 h-fit bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Book Appointment
          </h3>
          <BookingForm
            doctorId={id}
            availability={doctor.availability}
            fees={doctor.fees}
          />
        </div>

      </section>
    </main>
  );
}

function Info({ IconComp, children }) {
  if (!IconComp) return null;
  return (
    <div className="flex items-center gap-2">
      <IconComp className="w-4 h-4 text-blue-600" />
      <span>{children}</span>
    </div>
  );
}