import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../component/navbar";
import Footer from "../component/footer";

const PublicLayout = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset animation on route change
    setShow(false);
    const timer = setTimeout(() => setShow(true), 50); // trigger animation
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main
        className={`transition-all duration-700 ease-out ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 px-4 py-12`}
      >
        {/* Optional: Add container for better layout */}
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Outlet will hold page content */}
          <Outlet key={location.pathname}/>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
