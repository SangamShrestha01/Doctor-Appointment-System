import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./constant/route";

/* ================= PUBLIC PAGES ================= */
import Home from "./page/home/page";
import About from "./page/about/aboutUs";
import Contact from "./page/contact-us/contact";
import Doctor from "./page/doctor/page";
import DoctorDetailPage from "./page/doctor/detail/page";
import PaymentSuccess from "./page/success";

/* ================= BOOK APPOINTMENT ================= */
import BookAppointment from "./page/patient/BookAppointment"; // ✅ FIXED

/* ================= AUTH ================= */
import Login from "./page/unauth/login/login";
import Register from "./page/unauth/register/register";

/* ================= PATIENT ================= */
import MyAppointments from "./page/patient/MyAppointments";

/* ================= PROFILE ================= */
import Profile from "./page/profile/Profile";
import PatientEditProfile from "./page/profile/PatientEditProfile";
import DoctorEditProfile from "./page/profile/DoctorEditProfile";

/* ================= DOCTOR ================= */
import DoctorDashboard from "./page/doctor/DoctorDashboard";
import DoctorHome from "./page/doctor/DoctorHome";
import DoctorAppointments from "./page/doctor/Appointments"; // ✅ separate from BookAppointment

/* ================= ADMIN ================= */
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./page/admin/Dashboard";
import Doctors from "./page/admin/Doctors";
import CreateDoctor from "./page/admin/CreateDoctor";
import EditDoctor from "./page/admin/EditDoctor";

/* ================= LAYOUTS ================= */
import AuthLayout from "./layout/authLayout";
import PublicLayout from "./layout/unAuthLayout";

/* ================= PROTECTED ROUTE ================= */
import ProtectedRoute from "./component/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<PublicLayout />}>

          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />

          <Route path={ROUTES.DOCTORS} element={<Doctor />} />
          <Route path={`${ROUTES.DOCTORS}/:id`} element={<DoctorDetailPage />} />

          {/* BOOK APPOINTMENT */}
          <Route
            path="/book-appointment/:doctorId"
            element={
              <ProtectedRoute allowedRoles={["Patient"]}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />

          <Route path={ROUTES.PAYMENT_SUCCESS} element={<PaymentSuccess />} />

          {/* PATIENT APPOINTMENTS */}
          <Route
            path={ROUTES.PATIENT_APPOINTMENTS}
            element={
              <ProtectedRoute allowedRoles={["Patient"]}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          {/* PROFILE */}
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute allowedRoles={["Patient", "Doctor"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.EDIT_PROFILE}
            element={
              <ProtectedRoute allowedRoles={["Patient"]}>
                <PatientEditProfile />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* ================= AUTH ROUTES ================= */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
        </Route>

        {/* ================= DOCTOR DASHBOARD ================= */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DoctorHome />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<DoctorEditProfile />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/create" element={<CreateDoctor />} />
          <Route path="doctors/edit/:id" element={<EditDoctor />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<p>Page Not Found</p>} />

      </Routes>
    </Router>
  );
};

export default App;