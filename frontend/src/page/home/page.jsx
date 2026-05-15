import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Banner from "./component/banner";
import Speciality from "./component/speciality";
import Experience from "./component/experience";
import DoctorGrid from "./component/feature-doctor";
import { useDoctorQuery } from "../../services/query/doctor.query";

function Home() {
  const location = useLocation();
  const [show, setShow] = useState(false);

  // Trigger animation on route change
  useEffect(() => {
    setShow(false); // reset
    const timer = setTimeout(() => setShow(true), 50); // start animation
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const animationClass = "transition-all duration-700 ease-out";

  const { doctors = [], loading, error } = useDoctorQuery({ limit: 10 });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const specialties = doctors.map((doctor) => doctor?.speciality);
  const uniqueSpecialties = [...new Set(specialties)];

  return (
    <div
      className={`${animationClass} ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      key={location.pathname} // remount on route change for animation
    >
      <Banner />
      <Speciality specialties={uniqueSpecialties} />
      <DoctorGrid />
      <Experience />
    </div>
  );
}

export default Home;
