import api from "./api";

/* =========================================================
   DOCTORS - ADMIN APIs
========================================================= */

/**
 * Get all doctors
 */
export const getAllDoctors = async () => {
  return await api.get("/admin/doctors");
};

/**
 * Get single doctor by ID
 */
export const getDoctorById = async (id) => {
  return await api.get(`/admin/doctors/${id}`);
};

/**
 * Create new doctor (Admin only)
 */
export const createDoctor = async (data) => {
  return await api.post("/admin/doctors", data);
};

/**
 * Update doctor (Admin only)
 */
export const updateDoctor = async (id, data) => {
  return await api.patch(`/admin/doctors/${id}`, data);
};

/**
 * Delete doctor (Admin only)
 */
export const deleteDoctor = async (id) => {
  return await api.delete(`/admin/doctors/${id}`);
};