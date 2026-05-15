import React, { useState, useEffect } from 'react';
import aboutImg from '../../../../frontend/public/about_us.jpg'; // change path if needed

const AboutUs = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation on component mount
    setShow(false);
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const baseAnimation =
    'transition-all duration-700 ease-out';

  return (
    <main
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-20 ${baseAnimation} ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className={`relative ${baseAnimation} ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="absolute inset-0 bg-blue-200 rounded-3xl blur-3xl opacity-40"></div>
          <img
            src={aboutImg}
            alt="MedConnect Healthcare Platform"
            className="relative rounded-3xl shadow-2xl w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className={`space-y-6 ${baseAnimation} ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
            About <span className="text-blue-600">MedConnect</span>
          </h1>

          <p className="text-lg text-slate-700 leading-relaxed">
            <strong>MedConnect</strong> is a modern healthcare appointment
            management platform designed to simplify the way patients and
            doctors connect. Our goal is to make healthcare access faster,
            easier, and more reliable through technology.
          </p>

          <p className="text-slate-700 leading-relaxed">
            The platform allows patients to browse doctors by specialization,
            view availability, and book appointments online without long
            waiting times. Doctors can efficiently manage schedules, reduce
            manual work, and focus more on patient care.
          </p>

          <p className="text-slate-700 leading-relaxed">
            MedConnect is built using modern web technologies with a strong
            focus on security, performance, and user experience. It is ideal
            for clinics, hospitals, and healthcare providers looking to
            digitalize their appointment system.
          </p>

          {/* Highlights */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            {[
              { title: 'Easy Appointment Booking', text: 'Book doctor appointments anytime, anywhere.' },
              { title: 'Secure & Reliable', text: 'User authentication and protected medical data.' },
              { title: 'Doctor-Friendly', text: 'Manage schedules and patient flow efficiently.' },
              { title: 'Modern UI', text: 'Clean, responsive, and user-focused design.' },
            ].map((item, index) => (
              <div
                key={index}
                className={`${baseAnimation} transition-all duration-700 ease-out delay-${index * 100} p-4 bg-white rounded-xl shadow`}
              >
                <h4 className="font-semibold text-blue-600">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={`bg-white py-16 px-4 mt-20 ${baseAnimation} ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">
            Our Mission
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Our mission is to bridge the gap between patients and healthcare
            providers by leveraging technology to improve accessibility,
            efficiency, and transparency in healthcare services.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
