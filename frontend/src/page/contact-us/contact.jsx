import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setShow(false);
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const animationClass = "transition-all duration-700 ease-out";

  return (
    <div
      className={`${animationClass} ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-12`}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Contact <span className="text-blue-600">MedConnect</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Have questions or need assistance with booking appointments?
            Our team is always ready to help you.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-10 md:grid-cols-2">
          {/* Contact Form */}
          <div
            className={`${animationClass} ${
              show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } rounded-2xl bg-white p-8 shadow-md transition hover:shadow-lg`}
          >
            <h2 className="mb-6 text-2xl font-semibold text-gray-700">
              Send Us a Message
            </h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Full Name"
                className="w-full rounded-lg border px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />

              <input
                type="email"
                placeholder="Your Email Address"
                className="w-full rounded-lg border px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-lg border px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />

              <textarea
                rows="4"
                placeholder="Write your message here..."
                className="w-full rounded-lg border px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              ></textarea>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium transition hover:bg-blue-700 active:scale-[0.98]"
              >
                Submit Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {[
              {
                title: "Contact Information",
                content: (
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-center gap-4">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span>+977 9800000000</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span>support@medconnect.com</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span>Kathmandu, Nepal</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span>Sun – Fri: 9:00 AM – 6:00 PM</span>
                    </div>
                  </div>
                ),
              },
              {
                title: "About MedConnect",
                content: (
                  <p className="text-gray-600 leading-relaxed">
                    MedConnect is a modern doctor appointment system designed
                    to simplify healthcare access. Patients can easily book
                    appointments, view doctor availability, and manage their
                    healthcare journey in one secure platform.
                  </p>
                ),
              },
            ].map((section, index) => (
              <div
                key={index}
                className={`${animationClass} ${
                  show
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                } rounded-2xl bg-white p-8 shadow-md transition hover:shadow-lg`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h2 className="mb-6 text-2xl font-semibold text-gray-700">
                  {section.title}
                </h2>
                {section.content}
              </div>
            ))}
          </div>
        </div>

        {/* Google Map */}
        <div
          className={`${animationClass} ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } mt-14 rounded-2xl bg-white p-8 shadow-md transition hover:shadow-lg`}
          style={{ transitionDelay: "200ms" }}
        >
          <h2 className="mb-6 text-2xl font-semibold text-gray-700 text-center">
            Our Location
          </h2>

          <iframe
            title="MedConnect Location"
            src="https://www.google.com/maps?q=28.2174004,83.9850419&z=19&output=embed"
            width="100%"
            height="360"
            className="rounded-xl border"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
