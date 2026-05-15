export const ROUTES = {
  /* ================= AUTH ================= */
  LOGIN: "/login",
  REGISTER: "/register",

  /* ================= PUBLIC ================= */
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  DOCTORS: "/doctors",

  /* ================= ADMIN ================= */
  ADMIN_DASHBOARD: "/admin",
  ADMIN_DOCTORS: "/admin/doctors",
  ADMIN_CREATE_DOCTOR: "/admin/doctors/create",
  ADMIN_EDIT_DOCTOR: "/admin/doctors/edit/:id",
  ADMIN_APPOINTMENTS: "/admin/appointments",

  /* ================= DOCTOR ================= */
  DOCTOR_DASHBOARD: "/doctor/dashboard",
  DOCTOR_APPOINTMENTS: "/doctor/appointments",
  DOCTOR_PROFILE: "/doctor/profile",
  DOCTOR_EDIT_PROFILE: "/doctor/profile/edit",

  /* ================= PATIENT ================= */
  PATIENT_DASHBOARD: "/patient",
  PATIENT_APPOINTMENTS: "/patient/appointments",

  /* ================= USER ================= */
  PROFILE: "/profile",
  EDIT_PROFILE: "/profile/edit",

  /* ================= PAYMENT ================= */
  PAYMENT_SUCCESS: "/payment-success",

  /* ================= FALLBACK ================= */
  NOT_FOUND: "*",
};