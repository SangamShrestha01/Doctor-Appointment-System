import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex-row-reverse items-center justify-center bg-linear-to-br from-teal-400 via-blue-500 to-indigo-600">
      {/* Full-screen subtle ECG/Heartbeat Pattern Overlay */}

      {/* Grid Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 py-12 lg:p-12">
        {/* Promotional Card - Left on desktop, top on mobile */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-10 shadow-2xl text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 drop-shadow-lg">
              Welcome to MedConnect
            </h1>
            <p className="text-lg lg:text-xl mb-10 opacity-90 leading-relaxed">
              Manage appointments, connect with doctors, and streamline your
              healthcare experience—all in one secure place.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="bg-white/30 backdrop-blur-sm p-4 rounded-full shadow-md">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium">
                  Easy appointment booking
                </span>
              </div>

              <div className="flex items-center gap-5">
                <div className="bg-white/30 backdrop-blur-sm p-4 rounded-full shadow-md">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2m4 0c0-1.104.896-2 2-2s2 .896 2 2m-8 6h12"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17h6"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium">
                  Secure & HIPAA-compliant
                </span>
              </div>

              <div className="flex items-center gap-5">
                <div className="bg-white/30 backdrop-blur-sm p-4 rounded-full shadow-md">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium">
                  Access medical records anytime
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* This is where Login/Register forms will appear */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
