import React, { useState } from 'react';
import { useDoctorQuery } from '../../services/query/doctor.query';
import DoctorCard from '../../component/card';

const categories = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'General Practice',
];

export default function DoctorsPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const { doctors, loading, error } = useDoctorQuery(
    selectedCategory ? { speciality: selectedCategory } : {}
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Find Your Doctor
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-balance">
            Browse through our network of verified, experienced healthcare
            professionals. Find the right specialist for your needs.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 bg-white p-4 rounded-xl shadow space-y-4 sticky top-24 h-max">
            <h3 className="text-lg font-semibold text-gray-800">Speciality</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`text-left px-3 py-2 rounded-lg font-medium border border-gray-200 transition-colors ${
                  selectedCategory === ''
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3 py-2 rounded-lg font-medium border border-gray-200 transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Doctors Grid */}
          <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <p className="text-blue-700 col-span-full">Loading doctors...</p>
            )}
            {error && (
              <p className="text-red-600 col-span-full">Error: {error}</p>
            )}
            {!loading && doctors.length === 0 && (
              <p className="text-gray-500 col-span-full">No doctors found.</p>
            )}

            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
