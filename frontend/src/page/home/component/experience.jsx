import React from 'react';
import Button from '../../../component/button';

function Experience() {
  return (
    <section className=" py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Card Container */}
        <div className=" rounded-2xl p-8  shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-1">
                Professional Experience
              </h3>
              <p className="text-sm text-blue-700">Verified specialist</p>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
              Verified
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Experience Card */}
            <div className="bg-white rounded-xl p-5 border border-blue-200">
              <p className="text-xs uppercase tracking-wide text-blue-500 font-medium mb-2">
                Experience
              </p>
              <p className="text-3xl font-bold text-blue-900">8+</p>
              <p className="text-sm text-blue-700 mt-1">Years in industry</p>
            </div>

            {/* Rating Card */}
            <div className="bg-white rounded-xl p-5 border border-blue-200">
              <p className="text-xs uppercase tracking-wide text-blue-500 font-medium mb-2">
                Rating
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-blue-900">4.8</p>
                <span className="text-yellow-400 text-xl">★</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">320 verified reviews</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-blue-200 mb-8"></div>

          {/* Details Section */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">
                Response Time
              </span>
              <span className="text-sm font-semibold text-blue-900">
                Within 2 hours
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">
                Client Satisfaction
              </span>
              <span className="text-sm font-semibold text-blue-900">98%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">
                Projects Completed
              </span>
              <span className="text-sm font-semibold text-blue-900">500+</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button className="w-full bg-blue-500 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 text-base shadow-md hover:shadow-lg">
            Book Appointment
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Experience;
