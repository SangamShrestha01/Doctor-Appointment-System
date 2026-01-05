import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorCard from '../../component/card';
import { useDoctorQuery } from '../../services/query/doctor.query';

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from URL
  const speciality = searchParams.get('speciality') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Query parameters for the main doctor list (paginated)
  const query = useMemo(() => {
    const q = {
      page,
      limit: 6,
    };
    if (speciality) q.speciality = speciality;
    return q;
  }, [speciality, page]);

  // Fetch paginated doctors
  const {
    doctors = [],
    loading,
    error,
    totalCount = 0,
  } = useDoctorQuery(query);

  // Calculate total pages correctly
  const totalPages = Math.ceil(totalCount / query.limit);

  // Fetch ALL doctors matching current speciality filter to build stable speciality list
  // (without pagination — to get all available specialties)
  const allSpecialitiesQuery = useMemo(() => {
    const q = { limit: 1000 }; // large limit to get all, or create dedicated endpoint later
    if (speciality) q.speciality = speciality;
    return q;
  }, [speciality]);

  const { doctors: allDoctors = [] } = useDoctorQuery(allSpecialitiesQuery);

  // Extract and deduplicate specialties
  const availableSpecialties = useMemo(() => {
    const set = new Set();
    allDoctors.forEach((doctor) => {
      if (doctor?.speciality) set.add(doctor.speciality);
    });
    return Array.from(set).sort(); // optional: sort alphabetically
  }, [allDoctors]);

  // Handlers
  const handleCategoryClick = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (!cat) {
      newParams.delete('speciality');
    } else {
      newParams.set('speciality', cat);
    }
    newParams.set('page', '1'); // reset to page 1
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 bg-white p-6 rounded-xl shadow space-y-6 sticky top-24 h-max">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Speciality
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleCategoryClick('')}
                  className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    speciality === ''
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  All Specialities ({totalCount})
                </button>

                {availableSpecialties.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                      speciality === cat
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Doctors Grid */}
          <div className="flex-1">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading && (
                <p className="col-span-full text-center text-blue-700 text-lg">
                  Loading doctors...
                </p>
              )}

              {error && (
                <p className="col-span-full text-center text-red-600">
                  Error: {error}
                </p>
              )}

              {!loading && doctors.length === 0 && (
                <p className="col-span-full text-center text-gray-500 text-lg">
                  No doctors found for the selected speciality.
                </p>
              )}

              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-gray-700 font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
