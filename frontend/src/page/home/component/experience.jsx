import React from 'react';
import Button from '../../../component/button';

function Experience() {
  return (
    <div className="mt-6 border-t border-slate-200 pt-5 space-y-4">
      {/* Experience */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Experience</span>
        <span className="font-semibold text-slate-900">8+ Years</span>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-lg">★</span>
          <span className="font-semibold text-slate-900">4.8</span>
          <span className="text-sm text-slate-500">(320 reviews)</span>
        </div>

        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
          Verified
        </span>
      </div>

      {/* CTA */}
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">
        Book Appointment
      </Button>
    </div>
  );
}

export default Experience;
