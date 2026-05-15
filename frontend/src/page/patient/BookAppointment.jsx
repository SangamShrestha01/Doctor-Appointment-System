import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { BookingForm } from '../../component/booking';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${doctorId}`);
        setDoctor(res.data.data);
      } catch (err) {
        toast.error('Failed to fetch doctor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  if (loading) return <p className="text-center mt-12">Loading...</p>;
  if (!doctor) return <p className="text-center mt-12">Doctor not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">
        Book Appointment with Dr. {doctor.user.name}
      </h1>
      <BookingForm
        doctorId={doctor._id}
        availability={doctor.availability}
        slot_booked={doctor.slot_booked}
        fees={doctor.fees}
      />
    </div>
  );
}
