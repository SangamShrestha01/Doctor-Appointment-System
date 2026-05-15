import { ROUTES } from "./route";

/* ================= PUBLIC NAVIGATION ================= */
export const NAV_LINKS = [
  { label: "Home", path: ROUTES.HOME },
  { label: "About", path: ROUTES.ABOUT },
  { label: "Contact", path: ROUTES.CONTACT },
  { label: "Doctors", path: ROUTES.DOCTORS },
];

/* ================= AUTH LINKS ================= */
export const AUTH_LINKS = [
  { label: "Login", path: ROUTES.LOGIN },
  { label: "Register", path: ROUTES.REGISTER },
];

/* ================= ADMIN SIDEBAR ================= */
export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", path: ROUTES.ADMIN_DASHBOARD },
  { label: "Doctors", path: ROUTES.ADMIN_DOCTORS },
  { label: "Create Doctor", path: ROUTES.ADMIN_CREATE_DOCTOR },
  { label: "Appointments", path: ROUTES.ADMIN_APPOINTMENTS },
];

/* ================= DOCTOR SIDEBAR ================= */
export const DOCTOR_NAV_LINKS = [
  { label: "Dashboard", path: ROUTES.DOCTOR_DASHBOARD },
  { label: "Appointments", path: ROUTES.DOCTOR_APPOINTMENTS },
  { label: "Profile", path: ROUTES.DOCTOR_PROFILE },
  { label: "Edit Profile", path: ROUTES.DOCTOR_EDIT_PROFILE },
];

/* ================= PATIENT SIDEBAR ================= */
export const PATIENT_NAV_LINKS = [
  { label: "Dashboard", path: ROUTES.PATIENT_DASHBOARD },
  { label: "My Appointments", path: ROUTES.PATIENT_APPOINTMENTS },
  { label: "Profile", path: ROUTES.PROFILE },
  { label: "Edit Profile", path: ROUTES.EDIT_PROFILE },
];