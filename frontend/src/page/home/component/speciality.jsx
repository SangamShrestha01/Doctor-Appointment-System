import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const specialtyIcons = {
  Gastroenterologist: '💊',
  Urologist: '🩺',
  'ENT Specialist': '👂',
  Gynecologist: '👩‍⚕️',
  Psychiatrist: '🧠',
  Pediatrician: '👶',
  Orthopedic: '🦴',
  Neurologist: '🧬',
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
      navigate(`/doctors?${searchParam}`);
    }
  };

  return (
    <section className="w-full py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="mb-10 max-w-2xl">
          <span className="inline-block text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
            Our Specialties
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-3">
            Find by Specialty
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Browse through our extensive list of trusted doctors and
            schedule your appointment hassle-free.
          </p>
        </div>

        {/* Grid on md+, horizontal scroll on mobile */}
        <div className="
          flex gap-3 overflow-x-auto pb-3
          md:grid md:grid-cols-4 md:overflow-visible md:pb-0
          lg:grid-cols-6
          scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent
        ">
          {specialties.map((name) => (
            <button
              key={name}
              onClick={() => handleSpecialtyClick(name)}
              className="
                shrink-0 group flex flex-col items-center justify-center gap-3
                p-4 md:p-5 w-32 md:w-auto rounded-2xl
                border-2 border-slate-100 bg-slate-50
                hover:border-blue-500 hover:bg-blue-50
                active:scale-95 transition-all duration-200 cursor-pointer
              "
            >
              {/* Icon circle */}
              <div className="
                w-12 h-12 md:w-14 md:h-14 rounded-2xl
                bg-white border border-slate-100 shadow-sm
                flex items-center justify-center text-2xl md:text-3xl
                group-hover:shadow-md group-hover:border-blue-100
                transition-all duration-200
              ">
                {specialtyIcons[name] || '🩻'}
              </div>

              <p className="
                text-center font-semibold text-slate-700
                group-hover:text-blue-600 transition-colors
                text-xs md:text-sm leading-tight
              ">
                {name}
              </p>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Speciality;
