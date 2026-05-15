import React from 'react';
import { useDoctorQuery } from '../../../services/query/doctor.query';
import DoctorCard from '../../../component/card';

function DoctorGrid() {
  const { doctors, loading, error } = useDoctorQuery({ limit: 4 });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section id="our-doctors" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">
          Our Doctors
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DoctorGrid;
