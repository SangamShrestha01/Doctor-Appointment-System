import React from "react";
import Button from "../../../component/button";
import img from "../../../../public/image.png";
import { useNavigate } from "react-router-dom";

export default function Banner() {
  const navigate = useNavigate();

  const handleScrollToDoctors = () => {
    const section = document.getElementById("our-doctors");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="w-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <section className="w-full py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Content */}
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Making Health Care Better Together
              </h1>

              <p className="text-lg text-slate-600">
                We believe that exceptional healthcare starts with compassion
                and dedication.
              </p>

              <div className="flex gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/doctors")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Make An Appointment
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleScrollToDoctors}   // ✅ SCROLL HERE
                  className="border-2 border-slate-900"
                >
                  View Department
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <img src={img} alt="Doctor" className="object-contain" />
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
