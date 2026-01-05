import React from 'react';
import { useNavigate, useSearchParams } from 'react-router';

// Map each specialty to a solid icon
const specialtyIcons = {
  Gastroenterologist: '💊',
  Urologist: '🩺',
  'ENT Specialist': '👂',
  Gynecologist: '👩‍⚕️',
  Psychiatrist: '🧠',
  Pediatrician: '👶',
  Orthopedic: '🦴',
  Neurologist: '🧠',
  Dermatologist: '🔬',
  Cardiologist: '❤️',
  'General Physician': '👨‍⚕️',
};

function Speciality({ specialties }) {
  const navigate = useNavigate();
  const [searchParam, setSearchParam] = useSearchParams();

  const handleSpecialtyClick = (specialty) => {
    if (specialty) {
      searchParam.set('speciality', specialty);
      setSearchParam(searchParam);
      navigate(`/doctor?${searchParam}`);
    }
  };

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-balance">
              Find by Specialty
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed text-pretty">
              Simply browse through our extensive list of trusted doctors,
              schedule your appointment hassle-free.
            </p>
          </div>

          {/* Horizontal Scroll */}
          <div className="flex space-x-4 overflow-x-auto pt-8 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {specialties.map((name) => (
              <button
                onClick={() => handleSpecialtyClick(name)}
                key={name}
                className="shrink-0 group flex flex-col items-center justify-center p-6 min-w-35 rounded-lg border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
              >
                <span className="text-4xl mb-3">
                  {specialtyIcons[name] || '❓'}
                </span>
                <p className="text-center font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm md:text-base">
                  {name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Speciality;
