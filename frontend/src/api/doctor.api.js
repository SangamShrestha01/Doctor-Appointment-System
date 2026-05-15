import api from "./api";

// Get logged-in user's profile (Patient / Doctor / Admin)
export const getMyProfile = () => api.get("/users/me");

// Get logged-in doctor's own profile & dashboard data
export const getDoctorProfile = () => api.get("/doctor/dashboard");

// Get any doctor by ID (public — used on booking/detail page)
export const getDoctorById = (id) => api.get(`/doctor/${id}`);