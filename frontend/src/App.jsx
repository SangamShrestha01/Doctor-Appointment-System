import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './constant/route';
import Home from './page/home/page';
import About from './page/about/page';
import Contact from './page/contact-us/page';
import Doctor from './page/doctor/page';
import Login from './page/unauth/login/login';
import Register from './page/unauth/register/register';
import AuthLayout from './layout/authLayout';
import PublicLayout from './layout/unAuthLayout'; // I assume this is your main site layout
import DoctorDetailPage from './page/doctor/detail/page';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.DOCTOR} element={<Doctor />} />
          <Route path={ROUTES.DOCTOR + "/:id"} element={<DoctorDetailPage />} />
          {/* You can add a redirect or fallback if needed */}
        </Route>

        {/* Auth pages with the special split-screen AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
