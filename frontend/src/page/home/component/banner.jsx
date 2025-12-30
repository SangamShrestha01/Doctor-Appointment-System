import React from 'react';
import Button from '../../../component/button';
import img from '../../../../public/image.png';

export default function Banner() {
  return (
    <main className="w-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Healthcare Banner Section */}
      <section className="w-full py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content Section */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 text-balance">
                  Making Health Care Better Together
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed text-pretty">
                  We believe that exceptional healthcare starts with compassion
                  and dedication. Our team of experienced professionals is
                  committed to providing you with personalized care that puts
                  your wellbeing first. Together, we're building a healthier
                  future for everyone in our community.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
                >
                  Make An Appointment
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-semibold px-8 bg-transparent"
                >
                  View Department
                </Button>
              </div>
            </div>

            {/* Doctor Image Section */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-square">
                <img
                  src={img}
                  alt="Healthcare professional with clipboard"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
